#!/usr/bin/env python3
"""QiMap: offline, source-attributed OSM project geocoding.
Reads a locally downloaded Geofabrik Vietnam PBF (ODbL), NEVER Google Maps scraping.
Staged points are unverified until checked; outputs WGS84 x=longitude, y=latitude.
"""
import argparse, collections, datetime as dt, json, math, re, unicodedata
import osmium

def load(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)

def norm(value):
    value = unicodedata.normalize("NFD", str(value or ""))
    value = "".join(c for c in value if unicodedata.category(c)!="Mn")
    value = value.casefold().replace("đ","d")
    value = re.sub(r"[^a-z0-9]+"," ",value).strip()
    return re.sub(r"\s+"," ",value)

def strip(value):
    text=norm(value)
    for prefix in ("chung cu ", "can ho ", "khu can ho ", "khu chung cu ",
                   "apartment building ", "apartment complex ", "apartments ",
                   "toa nha ", "residential complex "):
        if text.startswith(prefix):
            text=text[len(prefix):]
            break
    return text

def in_zone(row, lng, lat):
    zone=row.get("region_scope") or "HCMC_old_boundary"
    bounds={
        "HCMC_old_boundary":(106.35,10.50,107.10,11.08),
        "Binh_Duong_pre_2025":(106.40,10.65,107.20,11.55),
        "Long_An_pre_2025":(106.20,10.30,106.85,11.12),
        "Ba_Ria_Vung_Tau_pre_2025":(106.80,10.20,107.60,11.00)
    }
    lo,la,hi,ha=bounds.get(zone,bounds["HCMC_old_boundary"])
    return lo<=lng<=hi and la<=lat<=ha

def distance_metres(a,b):
    lat1,lon1=a
    lat2,lon2=b
    p=math.pi/180
    dlat=(lat2-lat1)*p
    dlon=(lon2-lon1)*p
    s=math.sin(dlat/2)**2+math.cos(lat1*p)*math.cos(lat2*p)*math.sin(dlon/2)**2
    return 12742000*math.asin(min(1,math.sqrt(s)))

def main():
    cli=argparse.ArgumentParser()
    cli.add_argument("--pbf",required=True)
    cli.add_argument("--output",default="data/qimap_osm_pbf_candidates_20261010.json")
    args=cli.parse_args()
    idx=load("data/project_search_index.json")["records"]
    legacy=load("data/projects.json")
    current=load("data/qimap_public_geo_review_20261010.json")
    six=load("data/qimap_additional_discovery_20261010.json")["records"]
    pinned=set(["map-"+x["id"] for x in legacy]+[p["id"] for p in current["pins"]])
    missing=[x for x in idx if x["id"] not in pinned]
    missing += current.get("discovery_candidates",[])
    missing += six
    # The 153-record core cohort is 150 index records plus three 2026-10-09 discoveries.
    # Six later discoveries are tracked separately; derive baselines from current main.
    assert len(idx)==150 and len({x["id"] for x in missing})==len(missing),(len(idx),len(missing))
    print("PBF INPUT PROJECTS",len(missing),flush=True)
    exact=collections.defaultdict(list)
    aliases_by_id={}
    for row in missing:
        labels=set([strip(row["name"])]+[strip(x) for x in row.get("aliases",[])])
        labels={x for x in labels if len(x)>=5}
        aliases_by_id[row["id"]]=labels
        for label in labels:
            exact[label].append(row)
    def find_rows(osm_name):
        n=strip(osm_name)
        matched={x["id"]:(x,100) for x in exact.get(n,[])}
        if len(n)>=9:
            for row in missing:
                if row["id"] in matched:
                    continue
                for label in aliases_by_id[row["id"]]:
                    if len(label)>=10 and (n.startswith(label+" ") or n.endswith(" "+label)):
                        matched[row["id"]]=(row,86)
                        break
        return list(matched.values())
    def plausible(tags):
        return any(k in tags for k in ("building","landuse","residential","addr:housenumber","addr:street")) or (
            "chung cu" in norm(tags.get("name")) or "can ho" in norm(tags.get("name")))
    objects={}
    node_hits=[]
    way_nodes={}
    required_nodes=set()
    class PhaseOne(osmium.SimpleHandler):
        def node(self, obj):
            if "name" not in obj.tags:
                return
            name=obj.tags.get("name","")
            matches=find_rows(name)
            if not matches or not plausible(obj.tags):
                return
            try:
                loc=obj.location
                lng,lat=loc.lon,loc.lat
            except Exception:
                return
            for row,score in matches:
                if in_zone(row,lng,lat):
                    node_hits.append(dict(id=row["id"],name=row["name"],osm_name=name,
                        osm_type="node",osm_id=int(obj.id),lat=lat,lng=lng,score=score,
                        tags={k:obj.tags.get(k) for k in
                              ("building","landuse","addr:street","addr:housenumber","place")
                              if k in obj.tags}))
        def way(self,obj):
            if "name" not in obj.tags:
                return
            name=obj.tags.get("name","")
            matches=find_rows(name)
            if not matches or not plausible(obj.tags):
                return
            nodes=[int(n.ref) for n in obj.nodes]
            if not nodes or len(nodes)>2000:
                return
            wid=int(obj.id)
            way_nodes[wid]=nodes
            required_nodes.update(nodes)
            objects[wid]=dict(name=name,matches=[(x["id"],x["name"],score,x) for x,score in matches],
                tags={k:obj.tags.get(k) for k in
                      ("building","landuse","addr:street","addr:housenumber","place")
                      if k in obj.tags})
    PhaseOne().apply_file(args.pbf)
    print("OSM NAME LOOKUP",len(node_hits),"named nodes",len(way_nodes),"candidate ways",len(required_nodes),"way vertices",flush=True)
    point_coords={}
    class PhaseTwo(osmium.SimpleHandler):
        def node(self,obj):
            key=int(obj.id)
            if key in required_nodes:
                try:
                    point_coords[key]=(obj.location.lon,obj.location.lat)
                except Exception:
                    pass
    PhaseTwo().apply_file(args.pbf)
    observations=node_hits.copy()
    for wid,nodes in way_nodes.items():
        pts=[point_coords[n] for n in nodes if n in point_coords]
        if not pts:
            continue
        # Average of boundary vertices is an approximate complex/tower reference point.
        unique=list(dict.fromkeys(pts))
        lng=sum(x for x,y in unique)/len(unique)
        lat=sum(y for x,y in unique)/len(unique)
        item=objects[wid]
        for pid,name,score,row in item["matches"]:
            if in_zone(row,lng,lat):
                observations.append(dict(id=pid,name=name,osm_name=item["name"],
                    osm_type="way",osm_id=wid,lat=lat,lng=lng,score=score,
                    tags=item["tags"]))
    by_id=collections.defaultdict(list)
    for o in observations:
        o["source_url"]="https://www.openstreetmap.org/"+o["osm_type"]+"/"+str(o["osm_id"])
        o["x"]=round(o["lng"],7)
        o["y"]=round(o["lat"],7)
        o["longitude"]=o["x"]
        o["latitude"]=o["y"]
        o["crs"]="EPSG:4326"
        o["coordVerified"]=False
        o["verification_level"]="REFERENCE_UNVERIFIED"
        o["source_published_at"]=None
        o["checked_at"]=dt.datetime.now(dt.timezone.utc).isoformat()
        o["spatial_accuracy"]="NAMED_OSM_FEATURE_REFERENCE_NOT_ENTRANCE_OR_CADASTRAL"
        o["geometry_method"]=("OSM_NODE_POSITION" if o["osm_type"]=="node" else
                              "UNWEIGHTED_WAY_VERTEX_MEAN")
        o["source_license"]="ODbL © OpenStreetMap contributors"
        by_id[o["id"]].append(o)
    candidates=[]
    ambiguous=[]
    for pid,variants in sorted(by_id.items()):
        strongest=max(x["score"] for x in variants)
        best=[x for x in variants if x["score"]==strongest]
        # De-dupe identical geometries only; don't conflate neighboring complexes.
        distinct=list({(x["osm_type"],x["osm_id"]):x for x in best}.values())
        if len(distinct)==1:
            selected=dict(distinct[0])
            selected["review_status"]="ONE_NAMED_OSM_OBJECT_AWAITING_GIS_REVIEW"
            candidates.append(selected)
        elif len(distinct)>1:
            distances=[distance_metres((x["lat"],x["lng"]),(y["lat"],y["lng"]))
                       for i,x in enumerate(distinct) for y in distinct[i+1:]]
            if distances and max(distances)<=180 and strongest==100:
                selected=dict(distinct[0])
                selected["lat"]=round(sum(x["lat"] for x in distinct)/len(distinct),7)
                selected["lng"]=round(sum(x["lng"] for x in distinct)/len(distinct),7)
                selected["x"]=selected["longitude"]=selected["lng"]
                selected["y"]=selected["latitude"]=selected["lat"]
                selected["review_status"]="MULTI_TOWER_CLUSTER_CENTER_PENDING_REVIEW"
                selected["geometry_method"]="MEAN_OF_NEARBY_OSM_GEOMETRY_REFERENCES"
                selected["osm_related_objects"]=[x["source_url"] for x in distinct]
                candidates.append(selected)
            else:
                ambiguous.append(dict(id=pid,name=distinct[0]["name"],
                    reason="MULTIPLE_GEOGRAPHIC_SITES_OR_OSM_OBJECTS",
                    options=distinct[:20]))
    cohort_ids={x["id"] for x in idx}|{x["id"] for x in current.get("discovery_candidates",[])}
    assert len(cohort_ids)==153,("Core cohort changed, require human review",len(cohort_ids))
    assert pinned.issubset(cohort_ids),("Preview reference IDs outside core cohort",sorted(pinned-cohort_ids))
    base_candidates=[x for x in candidates if x["id"] in cohort_ids]
    assert len({x["id"] for x in base_candidates})==len(base_candidates)
    assert not ({x["id"] for x in base_candidates}&pinned)
    core_covered=len(pinned)+len(base_candidates)
    summary={"schema_version":"1.1","created_at":dt.datetime.now(dt.timezone.utc).isoformat(),
        "source":"Geofabrik Vietnam OpenStreetMap latest.osm.pbf",
        "source_url":"https://download.geofabrik.de/asia/vietnam-latest.osm.pbf",
        "license":"ODbL © OpenStreetMap contributors",
        "publication_gate":"RESEARCH_UNVERIFIED",
        "coordinate_rule":"WGS84 EPSG:4326 x=longitude,y=latitude. Geometry mean is NOT a cadastral parcel, legal site, tower entrance or survey-verified point.",
        "source_data_download_url":"https://download.geofabrik.de/asia/vietnam-latest.osm.pbf",
        "source_pbf_sha256":__import__("os").environ.get("QIMAP_PBF_SHA256"),
        "review_levels":["REFERENCE_UNVERIFIED","CORROBORATED","VERIFIED"],
        "not_verified":True,
        "counts":{"indexed":len(idx),"already_geolocated":len(pinned),
            "missing_before":len(missing),"named_candidates":len(candidates),
            "ambiguous_dossiers":len(ambiguous),
            "not_found":len(missing)-len(by_id),
            "core_cohort_153":len(cohort_ids),"already_pinned_in_core":len(pinned),
            "new_core_unverified_osm_named_candidates":len(base_candidates),
            "core_with_staged_osm_or_existing_reference":core_covered,
            "core_missing_even_research_osm":len(cohort_ids)-core_covered,
            "new_verified_coordinates":0,
            "extra_20261010_discovery_candidates":len(candidates)-len(base_candidates)},
        "candidates":candidates,"ambiguous":ambiguous}
    with open(args.output,"w",encoding="utf-8") as fh:
        json.dump(summary,fh,ensure_ascii=False,indent=2)
        fh.write("\n")
    print("PBF GIS RESULTS",json.dumps(summary["counts"]),flush=True)

if __name__=="__main__":
    main()
