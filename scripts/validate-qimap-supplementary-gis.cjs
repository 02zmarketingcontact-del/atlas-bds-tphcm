"use strict";
const fs=require("node:fs"), assert=require("node:assert/strict");
const reg=JSON.parse(fs.readFileSync("data/qimap_supplementary_layers_source_registry_20261010.json","utf8"));
const stops=JSON.parse(fs.readFileSync("data/bus_stops_osm.geojson","utf8"));
const metros=JSON.parse(fs.readFileSync("data/metro_stations_osm.geojson","utf8"));
const routes=JSON.parse(fs.readFileSync("data/transit_lines_2026.json","utf8"));
const approved=JSON.parse(fs.readFileSync("data/planning_layers.geojson","utf8"));
assert.equal(reg.layers.length,12);assert.equal(new Set(reg.layers.map(x=>x.id)).size,12);
assert.equal(reg.source_registry.length,7);assert.ok(reg.source_registry.every(x=>/^https:\/\//.test(x.url)&&x.rights));
assert.equal(stops.features.length,1223);assert.equal(metros.features.length,14);
assert.equal(routes.lines.length,9);assert.equal(approved.features.length,0);
assert.equal(reg.no_official_GTFS_feed_confirmed,true);
assert.equal(reg.no_new_approved_official_planning_geometry,true);
for(const x of reg.layers){assert.ok(x.acceptance_criteria&&x.coordinate_target&&x.source_kinds.length);if(/planned|zoning/.test(x.id)){assert.equal(x.has_new_approved_official_geometry,false)}}
console.log("QIMAP SUPPLEMENTARY GIS SOURCE AUDIT PASS 12 layers 7 referenced sources; 0 authorized planning geometry, 0 verified bus route feeds");
