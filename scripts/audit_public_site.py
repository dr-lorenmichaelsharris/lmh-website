"""Read-only public HTML inventory. No forms are submitted or assets downloaded."""
import concurrent.futures
import html.parser
import json
import pathlib
import urllib.error
import urllib.parse
import urllib.request

ROOT = 'https://lorenmichaelsharris.com/'
OUT = pathlib.Path(__file__).resolve().parents[1] / 'docs' / 'evidence'

class Page(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.text = []
        self.links = []
        self.images = []
        self.inputs = []
        self.headings = []
        self.heading = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ('script', 'style'): self.skip += 1
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag == 'img': self.images.append({k:a.get(k) for k in ('src','alt','width','height')})
        if tag == 'input' and a.get('type') != 'hidden': self.inputs.append({k:a.get(k) for k in ('type','name','id','placeholder','required')})
        if tag in ('h1','h2','h3','h4'): self.heading = {'level':tag,'text':''}
    def handle_endtag(self, tag):
        if tag in ('script','style'): self.skip = max(0,self.skip-1)
        if self.heading and tag == self.heading['level']:
            self.headings.append(self.heading); self.heading = None
    def handle_data(self, data):
        if self.skip: return
        t = ' '.join(data.split())
        if t: self.text.append(t)
        if self.heading: self.heading['text'] += t + ' '

def fetch(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0 (public website audit)'})
        with urllib.request.urlopen(req,timeout=35) as r:
            raw = r.read().decode('utf-8',errors='replace')
            p = Page(); p.feed(raw)
            return {'url':url,'final_url':r.url,'status':r.status,'bytes':len(raw.encode()),'headings':p.headings,'text':'\n'.join(p.text),'links':sorted(set(urllib.parse.urljoin(r.url,l) for l in p.links)),'images':p.images,'inputs':p.inputs}
    except urllib.error.HTTPError as e: return {'url':url,'status':e.code,'error':str(e)}
    except Exception as e: return {'url':url,'status':None,'error':str(e)}

def eligible(url):
    p = urllib.parse.urlparse(url)
    return p.netloc == 'lorenmichaelsharris.com' and not p.query and not any(x in p.path for x in ('/wp-','/feed','/author/','/category/','/tag/')) and not pathlib.PurePosixPath(p.path).suffix

if __name__ == '__main__':
    OUT.mkdir(parents=True,exist_ok=True)
    api_records = []
    for kind in ('pages','posts'):
        api_url = ROOT+'wp-json/wp/v2/'+kind+'?per_page=100&_fields=id,link,slug,title,date,modified'
        with urllib.request.urlopen(api_url,timeout=35) as response:
            records = json.load(response)
            api_records.extend(dict(record,kind=kind) for record in records)
    (OUT/'wordpress-public-index.json').write_text(json.dumps(api_records,indent=2),encoding='utf-8')
    seen = set(); pending = sorted(set([ROOT]+[r['link'] for r in api_records])); results = []
    for depth in range(8):
        batch = [u for u in pending if u not in seen][:100-len(seen)]
        if not batch: break
        seen.update(batch)
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
            current = list(pool.map(fetch,batch))
        results.extend(current)
        pending = sorted(set(urllib.parse.urldefrag(l)[0].replace('http://lorenmichaelsharris.com/','https://lorenmichaelsharris.com/') for r in current for l in r.get('links',[]) if eligible(l))-seen)
    (OUT/'public-site-inventory.json').write_text(json.dumps({'audited_date':'2026-10-20','method':'Public HTTP HTML crawl, maximum depth 7 and 100 URLs, excludes query URLs and archive/author/feed paths; content includes hidden HTML and is not a rendered or mobile audit.','pages':results,'remaining_discovered':pending},indent=2),encoding='utf-8')
    for r in results: print(r['status'],r['url'],len(r.get('text','')))
