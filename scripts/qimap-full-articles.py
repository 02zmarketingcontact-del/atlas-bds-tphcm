#!/usr/bin/env python3
"""Generate original four-language QiMap explainers from public news metadata.
No copying article bodies; all source-specific claims are restricted to metadata.
"""
import datetime as dt
import html
import json
import os
import pathlib
import re
import urllib.request

ROOT=pathlib.Path(__file__).resolve().parents[1]
INPUT=ROOT/"data/news/latest.json"
OUT=ROOT/"data/news/articles"
API="https://models.github.ai/inference/chat/completions"
LANGS=["vi","en","zh-CN","zh-TW"]

def complete(article):
    return all(isinstance(article.get("languages",{}).get(l),dict)
        and len(article["languages"][l].get("body","").strip())>=500
        and len(article["languages"][l].get("title","").strip())>=12
        and len(article["languages"][l].get("description","").strip())>=40
        for l in LANGS)

def generate(item,token):
    if not item.get("original_url") or not item.get("source_description"):
        raise ValueError("publisher source URL and metadata required before rewrite")
    system=("You write ORIGINAL multilingual Vietnamese property market explainers for QiMap. "
      "Only evidence about this specific news story is the publisher title, description, publisher and date. "
      "Never pretend you read the full article. Never invent numbers, quotes, legal approvals, prices or events. "
      "Distinguish the headline's claim from your general interpretation. "
      "Produce one complete coherent explainer in each of vi, en, zh-CN, zh-TW. "
      "Each body must be at least 500 characters, with useful independently authored context, "
      "what this could mean for apartment investors, limitations and what to check next. "
      "Each language must be genuinely translated, not left in Vietnamese. "
      "Do not copy the source headline verbatim as the article body. "
      "Return ONLY valid JSON: {languages:{vi:{title,description,body},en:{...},"
      "zh-CN:{...},zh-TW:{...}}}. Plain text bodies; no markdown.")
    data={"headline":item.get("original_title",item["title"]),"publisher_description":item["source_description"],"source":item["source"],"published":item.get("source_published",item["published"]),"topic":item["topic"]}
    payload={"model":"openai/gpt-4.1-mini","temperature":0.2,"max_tokens":7500,
      "messages":[{"role":"system","content":system},{"role":"user","content":json.dumps(data,ensure_ascii=False)}]}
    req=urllib.request.Request(API,data=json.dumps(payload,ensure_ascii=False).encode("utf-8"),
      headers={"Authorization":"Bearer "+token,"Content-Type":"application/json","Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"},method="POST")
    with urllib.request.urlopen(req,timeout=90) as response:
        raw=json.load(response)["choices"][0]["message"]["content"].strip()
    if raw.startswith("```"):
        raw=raw.split("\n",1)[1].rsplit("```",1)[0].strip()
    article=json.loads(raw)
    if not complete(article):
        raise ValueError("incomplete four-language content")
    article.update({"id":item["id"],"source":item["source"],"source_url":item["original_url"],
      "published":item["published"],"topic":item["topic"],"status":"COMPLETE_4_LANG",
      "editorial_basis":"PUBLISHER_TITLE_DESCRIPTION_WITH_ORIGINAL_CONTEXT",
      "generated_at":dt.datetime.now(dt.timezone.utc).isoformat()})
    return article

def main():
    token=os.getenv("GH_TOKEN")
    if not token: raise SystemExit("GH_TOKEN is required")
    doc=json.loads(INPUT.read_text(encoding="utf-8"))
    OUT.mkdir(parents=True,exist_ok=True)
    limit=int(os.getenv("ARTICLE_LIMIT","3"))
    completed=0; errors=[]
    for item in reversed(doc["items"]):
        if completed>=limit: break
        if not item.get("original_url") or not item.get("source_description"): continue
        path=OUT/(item["id"]+".json")
        if path.exists():
            try:
                if complete(json.loads(path.read_text(encoding="utf-8"))):continue
            except (ValueError,OSError):pass
        try:
            article=generate(item,token)
            path.write_text(json.dumps(article,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
            completed+=1
        except Exception as exc:
            errors.append({"id":item["id"],"error":str(exc)[:180]})
    manifest=[]
    for path in sorted(OUT.glob("*.json")):
        try:
            item=json.loads(path.read_text(encoding="utf-8"))
            if complete(item):
                manifest.append({"id":item["id"],"source":item["source"],"published":item["published"],
                    "source_url":item["source_url"],"topic":item["topic"],
                    "languages":{l:{"title":item["languages"][l]["title"],
                        "description":item["languages"][l]["description"]} for l in LANGS}})
        except (OSError,ValueError,KeyError):continue
    (ROOT/"data/news/articles-index.json").write_text(json.dumps(
      {"count":len(manifest),"updated_at":dt.datetime.now(dt.timezone.utc).isoformat(),
       "items":manifest},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"created":completed,"published_total":len(manifest),"errors":errors[:10]},ensure_ascii=False))
if __name__=="__main__":main()
