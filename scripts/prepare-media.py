"""Download the selected, source-attributed LMH media. Run manually, not at build time."""
import concurrent.futures, io, json, pathlib, urllib.request
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
CURRENT = 'https://lorenmichaelsharris.com/wp-content/uploads/'
OLD = 'https://old.lorenmichaelsharris.com/wp-content/uploads/'
images = [
 ('loren-raspberry.jpg', CURRENT+'2025/11/Drl12-min-scaled.jpg',424,'Home hero','Photographer not credited at source'),
 ('loren-blue.jpg', CURRENT+'2025/11/Drl3-min-scaled.jpg',432,'Program hero; homepage program feature','Photographer not credited at source'),
 ('loren-floral.jpg', CURRENT+'2025/11/Drl7-min-scaled.jpg',429,'About hero; homepage biography','Photographer not credited at source'),
 ('loren-hat.jpg', CURRENT+'2025/11/DrL1-min-scaled.jpg',434,'Bathrobe Moments hero','Photographer not credited at source'),
 ('loren-speaking.jpg', OLD+'2019/11/untitled-1130.jpg',None,'Speaking hero','Scott R. Gane; source watermark preserved'),
 ('workshop.jpg', CURRENT+'2025/10/WhatsApp-Image-2025-10-31-at-9.43.45-PM-1.jpeg',380,'Coaching hero; program coaching section','Photographer not credited at source'),
 ('stage-wide.jpg', CURRENT+'2025/11/Untitled-design-63.jpg',503,'Speaking event photography','Photographer not credited at source'),
 ('interview.jpg', CURRENT+'2025/11/WhatsApp-Image-2025-10-31-at-10.12.51-PM.jpeg',528,'Keynote writing; voice and story','Photographer not credited at source'),
 ('bathrobe-logo.png', CURRENT+'2026/05/ChatGPT_Image_May_5_2026_03_03_53_PM.png',None,'Bathrobe Moments; homepage show feature','Existing published show artwork'),
]
videos = [
 ('power-of-we','4PyakES8UQ0','Home event film'),('speaking-reel','LqGDr7rsLUg','Speaking reel'),('goalcast','NHeQafrmpG8','About story'),
 ('robert','8d5Nzyy6u0A','Robert A. Lane testimonial'),('martha','60Oe5YNWuHs','Martha Glory testimonial'),('amy','qld-3VtERrA','Amy Joy testimonial'),
 ('episode-geoff','c7tWatGhdVM','Geoff Gunn'),('episode-mavis','HJcgTzUXH9s','Mavis Tsai'),('episode-lee','6HZiGPvU9TI','Lee Giove'),
 ('episode-brett','o-IQKiGKTMo','Brett D. Scott'),('episode-grace','CLjn0NqRogc','Grace M. Lovret'),('episode-alice','BxV7glP7ga4','Alice Brink'),
]
def fetch(url):
 return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=60).read()
def image_asset(item):
 name,url,media_id,placement,credit=item
 path=ROOT/'src/assets'/name
 data=fetch(url); path.write_bytes(data)
 im=Image.open(io.BytesIO(data))
 return {'path':str(path.relative_to(ROOT)).replace('\\','/'),'source':url,'mediaId':media_id,'dimensions':im.size,'bytes':len(data),'credit':credit,'placement':placement,'derivatives':'Astro build: responsive widths, WebP, natural colour; original retained'}
def poster(item):
 name,vid,placement=item
 metadata=json.loads(fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v='+vid+'&format=json'))
 for variant in ['maxresdefault','hq720','sddefault','hqdefault']:
  try:
   url=f'https://i.ytimg.com/vi/{vid}/{variant}.jpg'; data=fetch(url); im=Image.open(io.BytesIO(data))
   if im.width<400: continue
   break
  except Exception: continue
 else: raise RuntimeError('No poster '+vid)
 path=ROOT/'public/media'/(name+'.jpg'); path.parent.mkdir(exist_ok=True)
 im.convert('RGB').save(path,quality=88,optimize=True)
 return {'path':str(path.relative_to(ROOT)).replace('\\','/'),'source':url,'recording':'https://www.youtube.com/watch?v='+vid,'title':metadata['title'],'credit':metadata['author_name'],'dimensions':im.size,'bytes':path.stat().st_size,'placement':placement,'derivatives':'YouTube poster recompressed to quality 88 JPEG; recording remains hosted by source'}
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
  records=list(pool.map(image_asset,images))+list(pool.map(poster,videos))
 target=ROOT/'docs/evidence/media-selections-v2.json'
 target.write_text(json.dumps({'sources':['https://lorenmichaelsharris.com/','https://old.lorenmichaelsharris.com/','https://lorenmichaelsharris.com/mindset_revolution_program_blueprint.html'],'records':records},indent=2)+'\n',encoding='utf-8')
 print('Prepared',len(records),'verified assets; recorded sources and dimensions.')
