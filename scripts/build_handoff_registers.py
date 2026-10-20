"""Derive exhaustive route and image-tag registers from the audit snapshot."""
import csv
import json
import pathlib
import urllib.parse

BASE = pathlib.Path(__file__).resolve().parents[1]
DOCS = BASE/'docs'
records = json.loads((DOCS/'evidence/wordpress-public-index.json').read_text(encoding='utf-8'))
pages = json.loads((DOCS/'evidence/public-site-inventory.json').read_text(encoding='utf-8'))['pages']
policies = {'privacy-policy','terms-and-conditions','cookie-policy','accessibility-statement','data-processing-protection','disclaimer','refund-cancellation-policy','affiliate-disclosure','e-commerce-shipping-policy','testimonials-reviews-policy'}
guest_posts = {'windy-meyer','cheryl-angela','faith-jordan'}
notes = {
 'home':('Homepage','High','Keep URL; rebuild customer hierarchy, proof and CTAs.'),
 'about':('About','High','Replace hash download buttons; approve identity/bio/credentials.'),
 'services':('Services hub','High','Remove published design instruction; implement useful comparison.'),
 'speaking':('Speaking','High','Complete approved learning outcomes; correct FAQ and CTA routing.'),
 'coaching':('Coaching','High','Clarify formats/cadence and difference from named program.'),
 'keynote-writing':('Writing','High','Preserve concrete process; approve revision/timeline/IP terms.'),
 'the-mindset-revolution':('Program','High','Fix missing application anchor, wrong explore link, repeated timeline labels.'),
 'results':('Proof hub','High','Replace missing/hash story links; exclude unapproved metrics.'),
 'testimonials':('Testimonials','Medium','Use approved attributed quotes; correct grouping and duplicate labels.'),
 'case-studies-client-stories':('Client stories','High','Real approved evidence only; no fabricated case-study detail pages.'),
 'resources':('Resources hub','High','Currently no main content; build actual index.'),
 'faqs':('FAQ','Medium','Group by service; approve operational promises.'),
 'media-kit':('Media kit','High','Fix identity/editorial placeholders; supply actual approved assets.'),
 'blog':('Article index','Medium','Index actual posts with preserved dates and useful excerpts.'),
 'bathrobe-moments':('Show','High','Separate watch/apply; reconcile fee/counts and real episodes.'),
 'apply':('Guest application','High','Replace existing redirect-to-anchor with dedicated application route.'),
 'thank-you-page':('Confirmation','Critical','Truthful verified state; fix payment routing; noindex.'),
 'vault':('Reflection resource','Medium','Keep as readable public reflection resource locally; owner confirms long-term role.'),
 'contact':('Contact','High','Move inquiry task upward; preserve service context; real backend.'),
 'important-links':('Policy hub','Medium','Preserve URL; label Policies and Accessibility; meaningful H1.')
}
with (DOCS/'route-migration.csv').open('w',newline='',encoding='utf-8-sig') as f:
    writer=csv.writer(f)
    writer.writerow(['wp_id','source_url','observed_final_url','kind','template','priority','proposed_url','indexing','implementation','source_date','source_modified'])
    for r in sorted(records,key=lambda x:x['link']):
        slug=r['slug']; source=r['link']; path=urllib.parse.urlparse(source).path
        fetched=next(x for x in pages if x['url']==source)
        if slug in policies:
            template,priority,note='Policy','Medium','Preserve substantive approved terms; reconcile business-name substitutions, operational facts and revision date.'
        elif r['kind']=='posts':
            template='Archive guest note' if slug in guest_posts else 'Article'
            priority='Medium'; note='Preserve permalink, text, source date and attribution; archive time-relative guest copy.' if slug in guest_posts else 'Preserve permalink, body, date and author provenance; migrate into readable article template.'
        else: template,priority,note=notes[slug]
        writer.writerow([r['id'],source,fetched.get('final_url'),r['kind'],template,priority,path,'noindex' if slug=='thank-you-page' else 'index after content approval',note,r['date'],r['modified']])

assets={}
for page in pages:
    for image in page.get('images',[]):
        src=image.get('src')
        if not src or src.startswith('data:'): continue
        src=urllib.parse.urljoin(page.get('final_url',page['url']),src)
        item=assets.setdefault(src,{'pages':set(),'alts':set(),'width':image.get('width'),'height':image.get('height')})
        item['pages'].add(page['url']); item['alts'].add(image.get('alt') or '')
with (DOCS/'asset-register.csv').open('w',newline='',encoding='utf-8-sig') as f:
    writer=csv.writer(f); writer.writerow(['source_url','seen_on_pages','existing_alt_values','width_attribute','height_attribute','approval_status','local_path','limitations'])
    for src,item in sorted(assets.items()):
        writer.writerow([src,' | '.join(sorted(item['pages'])),' | '.join(sorted(item['alts'])),item['width'],item['height'],'needs suitability and rights review','','Image tags only; no CSS backgrounds/video extraction; not downloaded.'])
assert len(records)==len(pages)==41
print(f'Routes: {len(records)}; policies: {len(policies)}; posts: {sum(r["kind"]=="posts" for r in records)}; unique image-tag sources: {len(assets)}')
