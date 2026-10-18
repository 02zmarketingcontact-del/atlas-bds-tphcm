#!/usr/bin/env python3
"""Resolve original publisher article URL and collect permitted public page metadata.
Never copy or republish article bodies. Fail closed if origin is not established.
"""
import html
import base64
import re
from html.parser import HTMLParser
import ipaddress
import json
import pathlib
import socket
import urllib.parse
import urllib.request

ROOT=pathlib.Path(__file__).resolve().parents[1]
FILE=ROOT/"data/news/latest.json"
class Meta(HTMLParser):
    def __init__(self):
        super().__init__();self.meta={};self.canonical=None
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=="meta":
            key=a.get("property") or a.get("name")
            if key in ("og:title","og:description","description","article:published_time"):
                self.meta[key]=html.unescape(a.get("content","")).strip()[:500]
        if tag=="link" and "canonical" in a.get("rel","").lower():
            self.canonical=a.get("href")
def public_url(url):
    p=urllib.parse.urlsplit(url)
    if p.scheme!="https" or not p.hostname or p.username or p.password: return False
    try:
        for addr in socket.getaddrinfo(p.hostname,443,type=socket.SOCK_STREAM):
            ip=ipaddress.ip_address(addr[4][0])
            if not ip.is_global: return False
    except (OSError,ValueError): return False
    return True
def decode_google_news_link(url):
    try:
        path=urllib.parse.urlsplit(url).path
        encoded=path.split('/articles/',1)[-1].split('/rss/articles/',1)[-1].split('/',1)[0]
        raw=base64.urlsafe_b64decode(encoded+'='*(-len(encoded)%4))
        hits=re.findall(rb'https?://[^\\x00-\\x20\\x7f-\\xff\\"<>]+',raw)
        for hit in hits:
            candidate=hit.decode('ascii','ignore')
            if candidate.startswith('https://') and public_url(candidate) and 'google.com' not in urllib.parse.urlsplit(candidate).hostname:
                return candidate
    except (ValueError,UnicodeError): pass
    return None

def resolve(item):
    url=item.get("source_url","")
    if "news.google.com" in urllib.parse.urlsplit(url).hostname:
        decoded=decode_google_news_link(url)
        if decoded: url=decoded
    if not public_url(url): return None
    req=urllib.request.Request(url,headers={"User-Agent":"QiMapNewsResearch/1.0"})
    class SafeRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, request, fp, code, msg, headers, newurl):
            if not public_url(newurl):
                raise ValueError("unsafe redirect")
            return super().redirect_request(request,fp,code,msg,headers,newurl)
    opener=urllib.request.build_opener(SafeRedirect())
    with opener.open(req,timeout=12) as resp:
        final=resp.geturl()
        if not public_url(final): return None
        if "news.google.com" in urllib.parse.urlsplit(final).hostname: return None
        if "text/html" not in resp.headers.get("Content-Type",""): return None
        content=resp.read(350_000).decode("utf-8","replace")
    parser=Meta();parser.feed(content)
    canonical=urllib.parse.urljoin(final,parser.canonical) if parser.canonical else final
    if not public_url(canonical) or urllib.parse.urlsplit(canonical).hostname!=urllib.parse.urlsplit(final).hostname:
        canonical=final
    if not parser.meta.get("og:title") and not parser.meta.get("description") and not parser.meta.get("og:description"):
        return None
    return {"original_url":canonical,"original_title":parser.meta.get("og:title") or item["title"],
        "source_description":parser.meta.get("og:description") or parser.meta.get("description") or "",
        "source_published":parser.meta.get("article:published_time") or item.get("published",""),
        "source_resolution":"PUBLISHER_HTML_METADATA"}
def main():
    doc=json.loads(FILE.read_text(encoding="utf-8"));resolved=0;failed=0
    attempted=0
    for item in reversed(doc.get("items",[])):
        if item.get("original_url") and item.get("source_description"): continue
        if attempted>=120:break
        attempted+=1
        try:
            result=resolve(item)
            if result:
                item.update(result);resolved+=1
            else: failed+=1
        except Exception: failed+=1
    FILE.write_text(json.dumps(doc,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"resolved":resolved,"unresolved":failed}))
    if resolved==0 and not any(i.get("original_url") for i in doc.get("items",[])):
        raise SystemExit("No publisher URLs resolved; review Google News link decoding and source acquisition")
if __name__=="__main__":main()
