#!/usr/bin/env python3
"""Translate short original QiMap news briefs via GitHub Models; cache translations."""
import json, os, pathlib, time, urllib.request, urllib.error
ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=ROOT/"data/news/latest.json"
ENDPOINT="https://models.github.ai/inference/chat/completions"
LANGS={"en":"English","zh-CN":"Simplified Chinese","zh-TW":"Traditional Chinese used in Taiwan"}
def translate(item, lang, token):
    prompt={"title":item["title"],"brief":item["brief"]}
    payload={"model":"openai/gpt-4.1-mini","temperature":0.1,"max_tokens":450,"messages":[{"role":"system","content":"You are a precise professional translator for Vietnamese real-estate news metadata. Translate only the JSON title and brief to "+LANGS[lang]+". Preserve names, numbers, dates and attribution. Never add facts. Output ONLY a valid JSON object with keys title and brief."},{"role":"user","content":json.dumps(prompt,ensure_ascii=False)}]}
    req=urllib.request.Request(ENDPOINT,data=json.dumps(payload,ensure_ascii=False).encode(),headers={"Authorization":"Bearer "+token,"Content-Type":"application/json","Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"},method="POST")
    with urllib.request.urlopen(req,timeout=45) as response:
        result=json.load(response)
    raw=result["choices"][0]["message"]["content"].strip()
    if raw.startswith("```"):
        raw=raw.split("\n",1)[1].rsplit("```",1)[0].strip()
    out=json.loads(raw)
    if not all(isinstance(out.get(k),str) and out[k].strip() for k in ("title","brief")):
        raise ValueError("translation missing required fields")
    return {"title":out["title"].strip(),"brief":out["brief"].strip()}
def main():
    token=os.environ.get("GH_TOKEN","")
    if not token:
        raise SystemExit("GH_TOKEN missing; no translations claimed")
    doc=json.loads(DATA.read_text(encoding="utf-8"))
    limit=int(os.environ.get("TRANSLATE_ITEMS","12"))
    done=0; errors=[]
    for item in reversed(doc.get("items",[])):
        translations=item.setdefault("translations",{})
        if all(l in translations for l in LANGS):
            continue
        if done>=limit:
            break
        for lang in LANGS:
            if lang in translations: continue
            try:
                translations[lang]=translate(item,lang,token)
            except (urllib.error.URLError,ValueError,KeyError,TypeError,TimeoutError) as exc:
                errors.append({"id":item.get("id"),"language":lang,"error":str(exc)[:160]})
                break
            time.sleep(0.2)
        done+=1
    doc["translation_status"]={"translated_items_this_run":done,"errors":errors[:20],"method":"github_models","languages":list(LANGS)}
    DATA.write_text(json.dumps(doc,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(doc["translation_status"],ensure_ascii=False))
    if errors and done==0: raise SystemExit(1)
if __name__=="__main__":main()
