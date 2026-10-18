#!/usr/bin/env python3
"""Gate source-backed multilingual articles for independent editorial quality."""
import json
import pathlib
import re
from urllib.parse import urlsplit
ROOT=pathlib.Path(__file__).resolve().parents[1]
LANGS=("vi","en","zh-CN","zh-TW")
def valid(article):
    if not article.get("source_url","").startswith("https://"):return False
    if "news.google.com" in urlsplit(article["source_url"]).hostname:return False
    if article.get("editorial_basis")!="PUBLISHER_TITLE_DESCRIPTION_WITH_ORIGINAL_CONTEXT":return False
    content=article.get("languages",{})
    for lang in LANGS:
        x=content.get(lang,{})
        if not all(isinstance(x.get(k),str) for k in ("title","description","body")):return False
        if len(x["body"].strip())<500 or len(x["title"].strip())<12 or len(x["description"].strip())<40:return False
        if lang in ("zh-CN","zh-TW") and len(re.findall(r"[\u3400-\u9fff]",x["body"]))<100:return False
    return True
def main():
    folder=ROOT/"data/news/articles"
    entries=[]
    for path in sorted(folder.glob("*.json")) if folder.exists() else []:
        try:
            a=json.loads(path.read_text(encoding="utf-8"))
            if not valid(a):continue
            entries.append({"id":a["id"],"source":a["source"],"source_url":a["source_url"],"published":a["published"],"topic":a["topic"],"languages":{l:{"title":a["languages"][l]["title"],"description":a["languages"][l]["description"]} for l in LANGS}})
        except (OSError,KeyError,ValueError):continue
    path=ROOT/"data/news/articles-index.json"
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps({"count":len(entries),"items":entries},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Qualified articles:",len(entries))
if __name__=="__main__":main()
