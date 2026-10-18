#!/usr/bin/env python3
"""QiMap fast news: public RSS metadata -> attributed short briefs. No article scraping."""
import datetime as dt
import hashlib
import html
import json
import pathlib
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "news" / "latest.json"
TOPICS = {
    "apartments": "căn hộ chung cư TP HCM bất động sản",
    "projects": "dự án căn hộ chủ đầu tư TP HCM",
    "policy": "bất động sản nhà ở pháp lý quy hoạch Việt Nam",
    "rental": "thị trường thuê căn hộ TP HCM",
}
UA = "QiMapNewsResearch/1.0 (+https://github.com/02zmarketingcontact-del/atlas-bds-tphcm)"
def clean(s):
    return re.sub(r"\\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()[:500]
def fetch(topic, query):
    url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({"q": query + " when:7d", "hl": "vi", "gl": "VN", "ceid": "VN:vi"})
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as resp:
        payload = resp.read(1_500_001)
    if len(payload) > 1_500_000:
        raise ValueError("oversized feed")
    root = ET.fromstring(payload)
    results = []
    for item in root.findall(".//item")[:30]:
        title = clean(item.findtext("title"))
        link = (item.findtext("link") or "").strip()
        pub = clean(item.findtext("pubDate"))
        source = clean(item.findtext("source")) or "Google News"
        if not title or not link.startswith("https://"):
            continue
        uid = hashlib.sha256((title.lower() + "|" + source.lower()).encode()).hexdigest()[:18]
        results.append({"id": uid, "topic": topic, "title": title, "source": source, "source_url": link, "published": pub, "brief": "Theo tin được tổng hợp từ " + source + ": " + title.rstrip(".") + ". QiMap ghi nhận để theo dõi thị trường; thông tin chưa được xác minh độc lập.", "status": "NEWS_AGGREGATED"})
    return results

def main():
    existing = []
    if OUT.exists():
        try:
            existing = json.loads(OUT.read_text(encoding="utf-8")).get("items", [])
        except (ValueError, OSError):
            pass
    errors = []
    fresh = []
    for topic, query in TOPICS.items():
        try:
            fresh.extend(fetch(topic, query))
        except Exception as exc:
            errors.append({"topic": topic, "error": type(exc).__name__ + ": " + str(exc)[:160]})
    merged = {i["id"]: i for i in existing if isinstance(i, dict) and i.get("id")}
    for item in fresh:
        merged[item["id"]] = item
    items = list(merged.values())[-160:]
    report = {"updated_at": dt.datetime.now(dt.timezone.utc).isoformat(), "mode": "PUBLIC_NEWS_METADATA", "verification": "NEWS_AGGREGATED_NOT_INDEPENDENTLY_VERIFIED", "new_fetched": len(fresh), "total": len(items), "errors": errors, "items": items}
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "items"}, ensure_ascii=False))
    if errors and not fresh and not existing:
        raise SystemExit(1)
if __name__ == "__main__":
    main()
