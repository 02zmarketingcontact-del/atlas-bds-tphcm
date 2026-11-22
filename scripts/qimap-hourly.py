#!/usr/bin/env python3
"""Permission-gated QiMap feed discovery. Writes artifacts only; never publishes."""
import argparse
import datetime as dt
import hashlib
import json
import pathlib
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET

ALLOWED = {"OFFICIAL", "PARTNER_AUTHORIZED", "LICENSED_DATA"}
def validate(registry):
    if not isinstance(registry.get("feeds"), list):
        raise ValueError("feeds must be a list")
    ids = set()
    for feed in registry["feeds"]:
        if not isinstance(feed, dict) or not feed.get("id"):
            raise ValueError("each feed requires id")
        if feed["id"] in ids:
            raise ValueError("duplicate feed id")
        ids.add(feed["id"])
        if feed.get("enabled") and (feed.get("rights_status") not in ALLOWED or not feed.get("permission_basis")):
            raise ValueError("enabled feed missing documented permission")
        if feed.get("enabled") and (feed.get("format") != "rss" or not str(feed.get("url", "")).startswith("https://")):
            raise ValueError("only HTTPS RSS is supported in this safe pilot")
    return registry["feeds"]

def discover(feed, checkpoint):
    headers = {"User-Agent": "QiMap-Research/1.0 (permission-gated)"}
    if checkpoint.get("etag"):
        headers["If-None-Match"] = checkpoint["etag"]
    if checkpoint.get("last_modified"):
        headers["If-Modified-Since"] = checkpoint["last_modified"]
    request = urllib.request.Request(feed["url"], headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            payload = response.read(2_000_001)
            if len(payload) > 2_000_000:
                raise ValueError("feed exceeds 2MB")
            root = ET.fromstring(payload)
            items = root.findall(".//item")
            keys = [hashlib.sha256((feed["id"] + "|" + (i.findtext("guid") or i.findtext("link") or "")).encode()).hexdigest() for i in items if (i.findtext("guid") or i.findtext("link"))]
            return {"checked": len(items), "new_candidates": len(set(keys) - set(checkpoint.get("seen", []))), "duplicates": len(keys) - len(set(keys)), "checkpoint": {"etag": response.headers.get("ETag"), "last_modified": response.headers.get("Last-Modified"), "seen": list(dict.fromkeys(keys))[:5000]}}
    except urllib.error.HTTPError as exc:
        if exc.code == 304:
            return {"checked": 0, "new_candidates": 0, "duplicates": 0, "checkpoint": checkpoint}
        raise

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--registry", required=True)
    p.add_argument("--out", required=True)
    args = p.parse_args()
    out = pathlib.Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    checkpoint_dir = out / "checkpoints"
    checkpoint_dir.mkdir(exist_ok=True)
    report = {"run_id": dt.datetime.now(dt.timezone.utc).strftime("%Y%m%dT%H%M%SZ"), "started_at": dt.datetime.now(dt.timezone.utc).isoformat(), "sources_total": None, "sources_enabled": 0, "sources_checked": 0, "sources_success": 0, "sources_failed": 0, "new_candidates": 0, "duplicates": 0, "published": 0, "errors": []}
    try:
        feeds = validate(json.loads(pathlib.Path(args.registry).read_text(encoding="utf-8")))
        report["sources_total"] = len(feeds)
        for feed in feeds:
            if not feed.get("enabled"):
                continue
            report["sources_enabled"] += 1
            try:
                checkpoint_path = checkpoint_dir / (feed["id"] + ".json")
                previous = json.loads(checkpoint_path.read_text()) if checkpoint_path.exists() else {}
                result = discover(feed, previous)
                report["sources_checked"] += 1
                report["sources_success"] += 1
                report["new_candidates"] += result["new_candidates"]
                report["duplicates"] += result["duplicates"]
                checkpoint_path.write_text(json.dumps(result["checkpoint"], indent=2))
            except Exception as exc:
                report["sources_checked"] += 1
                report["sources_failed"] += 1
                report["errors"].append({"source": feed["id"], "error": str(exc)})
    except Exception as exc:
        report["errors"].append({"registry": str(exc)})
    report["finished_at"] = dt.datetime.now(dt.timezone.utc).isoformat()
    (out / "report.json").write_text(json.dumps(report, indent=2))
    if report["errors"]:
        raise SystemExit(1)

if __name__ == "__main__":
    main()
