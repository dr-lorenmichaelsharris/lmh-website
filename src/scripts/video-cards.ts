interface Player {playVideo():void;pauseVideo():void;mute():void;destroy():void;}
interface Api {Player:new(el:HTMLElement,options:Record<string,unknown>)=>Player;}
const ytWindow=window as Window & {YT?:Api;onYouTubeIframeAPIReady?:()=>void};
let apiPromise:Promise<Api>|undefined;
function api(){if(ytWindow.YT?.Player)return Promise.resolve(ytWindow.YT);return apiPromise??=new Promise<Api>((resolve,reject)=>{const previous=ytWindow.onYouTubeIframeAPIReady;const timer=setTimeout(()=>reject(new Error('Video unavailable')),12000);ytWindow.onYouTubeIframeAPIReady=()=>{previous?.();clearTimeout(timer);if(ytWindow.YT)resolve(ytWindow.YT);};if(!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')){const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.onerror=()=>reject(new Error('Video unavailable'));document.head.append(script);}});}
export function setupVideoCards(){
 if(document.querySelector('.watch-dialog'))return;
 const dialog=document.createElement('dialog');dialog.className='watch-dialog';dialog.setAttribute('aria-labelledby','watch-title');
 dialog.innerHTML='<div class="watch-heading"><h2 id="watch-title"></h2><button type="button" class="round-control" aria-label="Close video">×</button></div><div class="watch-mount"></div><p><a class="watch-source" target="_blank" rel="noopener">Watch on YouTube ↗</a></p>';
 document.body.append(dialog);let opener:HTMLElement|null=null;
 const close=()=>dialog.close();dialog.querySelector('button')!.addEventListener('click',close);
 dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
 dialog.addEventListener('close',()=>{dialog.querySelector('video')?.pause();dialog.querySelector('.watch-mount')!.replaceChildren();dialog.dataset.playing='false';document.dispatchEvent(new Event('lmh-media-state'));opener?.focus();sync();});
 document.addEventListener('click',e=>{const event=e as MouseEvent;const link=(e.target as Element).closest<HTMLAnchorElement>('[data-watch]');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 const card=link.closest<HTMLElement>('.story-card')!;e.preventDefault();opener=link;
 dialog.querySelector('h2')!.textContent=card.dataset.videoTitle!;dialog.querySelector<HTMLAnchorElement>('.watch-source')!.href=link.href;
 const mount=dialog.querySelector('.watch-mount')!;const source=dialog.querySelector<HTMLAnchorElement>('.watch-source')!;
 if(card.dataset.videoSrc){const video=document.createElement('video');video.src=card.dataset.videoSrc;video.controls=true;video.playsInline=true;video.setAttribute('aria-label',card.dataset.videoTitle!);mount.replaceChildren(video);dialog.showModal();void video.play().catch(()=>{});source.textContent='Open video ↗';}
 else{const frame=document.createElement('iframe');frame.title=card.dataset.videoTitle!;frame.src=`https://www.youtube-nocookie.com/embed/${card.dataset.videoId}?autoplay=1&playsinline=1&rel=0`;frame.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;mount.replaceChildren(frame);dialog.showModal();source.textContent='Watch on YouTube ↗';}
 dialog.dataset.playing='true';document.dispatchEvent(new CustomEvent('lmh-play',{detail:dialog}));document.dispatchEvent(new Event('lmh-media-state'));sync();
 });
 document.addEventListener('lmh-play',event=>{if((event as CustomEvent).detail!==dialog&&dialog.open)close();});
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width:1024px)');
 const connection=(navigator as Navigator & {connection?:EventTarget & {saveData?:boolean}}).connection;
 type Preview={card:HTMLElement;ratio:number;player?:Player;video?:HTMLVideoElement;ready:boolean;loading:boolean;failed:boolean;selected:boolean};
 const previews:Preview[]=[...document.querySelectorAll<HTMLElement>('.story-card')].map(card=>({card,ratio:0,ready:false,loading:false,failed:false,selected:false}));
 function start(p:Preview){if(p.failed||p.loading)return;if(p.ready){if(p.video)void p.video.play().catch(()=>{p.failed=true;p.card.classList.remove('preview-playing');});else p.player?.playVideo();return;}p.loading=true;
 if(p.card.dataset.videoSrc){const video=document.createElement('video');p.video=video;video.src=p.card.dataset.videoSrc;video.muted=true;video.loop=true;video.playsInline=true;video.tabIndex=-1;p.card.querySelector('.silent-preview')!.append(video);p.ready=true;p.loading=false;video.addEventListener('playing',()=>{if(p.selected)p.card.classList.add('preview-playing');else video.pause();});video.addEventListener('pause',()=>p.card.classList.remove('preview-playing'));video.addEventListener('error',()=>{p.failed=true;p.card.classList.remove('preview-playing');});void video.play().catch(()=>{p.failed=true;});return;}
 api().then(YT=>{if(!p.selected){p.loading=false;return;}const mount=document.createElement('div');p.card.querySelector('.silent-preview')!.append(mount);
 p.player=new YT.Player(mount,{host:'https://www.youtube-nocookie.com',videoId:p.card.dataset.videoId,playerVars:{autoplay:0,mute:1,controls:0,playsinline:1,rel:0,disablekb:1,loop:1,playlist:p.card.dataset.videoId,origin:location.origin},events:{
 onReady:()=>{p.ready=true;p.loading=false;p.player?.mute();const frame=p.card.querySelector('iframe');if(frame){frame.tabIndex=-1;frame.title=`Silent preview: ${p.card.dataset.videoTitle}`;}if(p.selected)p.player?.playVideo();},
 onStateChange:(event:{data:number})=>{p.card.classList.toggle('preview-playing',event.data===1&&p.selected);if(event.data===1&&!p.selected)p.player?.pauseVideo();},
 onError:()=>{p.failed=true;p.card.classList.remove('preview-playing');p.player?.destroy();},onAutoplayBlocked:()=>{p.failed=true;p.card.classList.remove('preview-playing');p.player?.pauseVideo();}
 }});
 }).catch(()=>{p.failed=true;p.loading=false;});}
 function sync(){const eligible=desktop.matches&&!reduced.matches&&!connection?.saveData&&!document.hidden&&!dialog.open;
 const selected=eligible?previews.filter(p=>p.ratio>=.6&&!p.failed&&p.card.closest<HTMLElement>('.video-gallery')?.dataset.previewPaused!=='true').sort((a,b)=>b.ratio-a.ratio).slice(0,3):[];
 previews.forEach(p=>{const was=p.selected;p.selected=selected.includes(p);if(p.selected){if(!was)start(p);}else{p.video?.pause();p.player?.pauseVideo();p.card.classList.remove('preview-playing');}});
 }
 document.querySelectorAll<HTMLButtonElement>('[data-preview-pause]').forEach(button=>{button.hidden=false;button.addEventListener('click',()=>{const root=button.closest<HTMLElement>('.video-gallery')!;const paused=root.dataset.previewPaused!=='true';root.dataset.previewPaused=String(paused);button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Resume previews':'Pause previews';sync();});});
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{const p=previews.find(p=>p.card===entry.target);if(p)p.ratio=entry.intersectionRatio;});sync();},{threshold:[0,.6,.8,1]});previews.forEach(p=>observer.observe(p.card));
 reduced.addEventListener('change',sync);desktop.addEventListener('change',sync);connection?.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
}
