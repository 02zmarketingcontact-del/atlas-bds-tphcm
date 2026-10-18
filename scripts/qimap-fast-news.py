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
ARCHIVE = ROOT / "data" / "news" / "archive"
TOPICS = {
    "apartments": ["căn hộ chung cư TP HCM", "giá căn hộ TP HCM", "căn hộ thứ cấp TP HCM", "căn hộ sơ cấp TP HCM", "căn hộ Bình Thạnh Thủ Đức", "căn hộ Quận 7 Phú Mỹ Hưng"],
    "projects": ["dự án căn hộ TP HCM", "dự án chung cư mới mở bán", "tiến độ bàn giao căn hộ TP HCM", "chủ đầu tư dự án căn hộ", "pháp lý dự án chung cư", "dự án bất động sản Đồng Nai Bình Dương"],
    "policy": ["quy hoạch đô thị TP HCM", "pháp luật kinh doanh bất động sản", "nhà ở xã hội TP HCM", "thị trường bất động sản Việt Nam", "hạ tầng metro TP HCM", "quy định người nước ngoài mua nhà Việt Nam"],
    "rental": ["thuê căn hộ TP HCM", "giá thuê chung cư TP HCM", "căn hộ dịch vụ TP HCM", "lợi suất cho thuê căn hộ", "thị trường cho thuê bất động sản", "Savills CBRE JLL thị trường căn hộ"],
}

UA = "QiMapNewsResearch/1.0 (+https://github.com/02zmarketingcontact-del/atlas-bds-tphcm)"
def clean(s):
    return re.sub(r"\\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()[:500]
def fetch(topic, query):
    url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({"q": query + " when:30d", "hl": "vi", "gl": "VN", "ceid": "VN:vi"})
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as resp:
        payload = resp.read(1_500_001)
    if len(payload) > 1_500_000:
        raise ValueError("oversized feed")
    root = ET.fromstring(payload)
    results = []
    for item in root.findall(".//item")[:60]:
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
    for topic, queries in TOPICS.items():
        for query in queries:
            try:
                fresh.extend(fetch(topic, query))
            except Exception as exc:
                errors.append({"topic": topic, "query": query, "error": type(exc).__name__ + ": " + str(exc)[:160]})
    merged = {i["id"]: i for i in existing if isinstance(i, dict) and i.get("id")}
    for item in fresh:
        merged[item["id"]] = item
    # Persist the full history in monthly shards; latest.json is only a lightweight UI cache.
    by_month = {}
    for item in merged.values():
        try:
            from email.utils import parsedate_to_datetime
            month = parsedate_to_datetime(item.get("published", "")).strftime("%Y-%m")
        except (TypeError, ValueError, OverflowError):
            month = "undated"
        by_month.setdefault(month, []).append(item)
    ARCHIVE.mkdir(parents=True, exist_ok=True)
    for month, records in by_month.items():
        path = ARCHIVE / (month + ".json")
        previous = []
        if path.exists():
            try:
                previous = json.loads(path.read_text(encoding="utf-8")).get("items", [])
            except (ValueError, OSError):
                pass
        complete = {x["id"]: x for x in previous if isinstance(x, dict) and x.get("id")}
        complete.update({x["id"]: x for x in records})
        path.write_text(json.dumps({"month": month, "total": len(complete), "items": list(complete.values())}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    items = list(merged.values())[-200:]
    report = {"updated_at": dt.datetime.now(dt.timezone.utc).isoformat(), "mode": "PUBLIC_NEWS_METADATA", "verification": "NEWS_AGGREGATED_NOT_INDEPENDENTLY_VERIFIED", "new_fetched": len(fresh), "unique_fetched": len({x["id"] for x in fresh}), "queries": sum(len(v) for v in TOPICS.values()), "total": len(items), "archived_this_run": len(merged), "archive_months_touched": len(by_month), "errors": errors, "items": items}
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "items"}, ensure_ascii=False))
    if errors and not fresh and not existing:
        raise SystemExit(1)
if __name__ == "__main__":
    main()
