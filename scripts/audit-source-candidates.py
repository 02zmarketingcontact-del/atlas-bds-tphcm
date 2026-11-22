import argparse, json, pathlib, urllib.parse

def audit(data):
    sources = data.get("sources", [])
    if not isinstance(sources, list):
        raise ValueError("sources must be a list")
    seen = set()
    output = []
    for source in sources:
        sid = source.get("id")
        url = source.get("url", "")
        parsed = urllib.parse.urlsplit(url)
        if not sid or sid in seen:
            raise ValueError("missing or duplicate source id")
        if parsed.scheme != "https" or not parsed.hostname:
            raise ValueError("invalid https URL")
        seen.add(sid)
        output.append({"id": sid, "host": parsed.hostname, "rights_status": source.get("rights_status", "UNKNOWN"), "feed_configured": bool(source.get("feed_endpoint")), "enabled": bool(source.get("enabled"))})
    return {"candidate_sources": len(output), "unique_domains": len(set(s["host"] for s in output)), "enabled_sources": sum(s["enabled"] for s in output), "configured_feeds": sum(s["feed_configured"] for s in output), "sources": output, "note": "Registry audit only; no reachability or rights verification."}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--output", required=True)
    a = p.parse_args()
    report = audit(json.loads(pathlib.Path(a.input).read_text(encoding="utf-8")))
    dest = pathlib.Path(a.output)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "sources"}))

if __name__ == "__main__":
    main()
