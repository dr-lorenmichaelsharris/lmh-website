/** Independent native-scroll rows: continuous desktop motion, drag and keyboard access. */
export function setupCarousels() {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach(root => {
    if(root.dataset.enhanced)return;root.dataset.enhanced='true';
    const rows=[...root.querySelectorAll<HTMLElement>('[data-carousel-row]')];
    const motion=matchMedia('(prefers-reduced-motion: reduce)'), desktop=matchMedia('(min-width:1024px)');
    let paused=false;
    const pause=root.querySelector<HTMLButtonElement>('[data-carousel-pause]');
    pause?.removeAttribute('hidden');
    pause?.addEventListener('click',()=>{paused=!paused;const label=pause.hasAttribute('data-media-pause')?`${paused?'Resume':'Pause'} gallery and previews`:`${paused?'Resume':'Pause'} motion`;if(pause.hasAttribute('data-media-pause')){pause.setAttribute('aria-label',label);pause.title=label;root.dataset.previewPaused=String(paused);document.dispatchEvent(new Event('lmh-gallery-state'));}else pause.textContent=label;pause.setAttribute('aria-pressed',String(paused));});
    rows.forEach((row,index)=>{
      const track=row.firstElementChild as HTMLElement;
      const automatic=root.dataset.carousel==='auto';
      const originals=[...track.children] as HTMLElement[];
      let period=0,hover=false,focused=false,visible=false,dragging=false,moved=false,startX=0,lastX=0,suppressUntil=0,navigationUntil=0;
      if(automatic){for(let copy=0;copy<2;copy++)originals.forEach(card=>{const clone=card.cloneNode(true) as HTMLElement;clone.dataset.clone='true';clone.setAttribute('aria-hidden','true');clone.querySelectorAll<HTMLElement>('a,button,[tabindex]').forEach(el=>el.tabIndex=-1);if(clone.matches('a'))clone.tabIndex=-1;track.append(clone);});}
      function updateArrows(){if(index||automatic)return;root.querySelectorAll<HTMLButtonElement>('[data-carousel-step]').forEach(button=>button.disabled=Number(button.dataset.carouselStep)<0?row.scrollLeft<=1:row.scrollLeft>=row.scrollWidth-row.clientWidth-1);}
      row.addEventListener('scroll',updateArrows,{passive:true});
      function measure(){period=automatic?(track.children[originals.length] as HTMLElement).offsetLeft-originals[0].offsetLeft:0;updateArrows();}
      new ResizeObserver(measure).observe(track);measure();
      const autoEnabled=()=>automatic&&desktop.matches&&!motion.matches;
      function normalize(){if(!autoEnabled()||!period)return;if(row.scrollLeft>=period)row.scrollLeft-=period;else if(row.scrollLeft<=0)row.scrollLeft+=period;}
      function updateMode(){root.classList.toggle('carousel-animated',desktop.matches&&!motion.matches);if(pause)pause.hidden=!desktop.matches||motion.matches;measure();}
      updateMode();desktop.addEventListener('change',updateMode);motion.addEventListener('change',updateMode);
      row.addEventListener('pointerover',e=>{hover=!!(e.target as Element).closest('[data-carousel-card]');});
      row.addEventListener('pointerout',e=>{hover=!!(e.relatedTarget instanceof Element&&row.contains(e.relatedTarget)&&e.relatedTarget.closest('[data-carousel-card]'));});
      row.addEventListener('focusin',()=>focused=!!row.querySelector(':focus-visible')||row.matches(':focus-visible'));row.addEventListener('focusout',()=>setTimeout(()=>focused=!!row.querySelector(':focus-visible')||row.matches(':focus-visible'),0));
      row.addEventListener('dragstart',e=>e.preventDefault());
      row.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0)return;dragging=true;moved=false;startX=lastX=e.clientX;});
      window.addEventListener('pointermove',e=>{if(!dragging)return;if(Math.abs(e.clientX-startX)>8)moved=true;if(moved){row.setPointerCapture(e.pointerId);row.classList.add('is-dragging');row.scrollLeft-=e.clientX-lastX;normalize();}lastX=e.clientX;});
      const end=()=>{if(!dragging)return;dragging=false;row.classList.remove('is-dragging');if(moved)suppressUntil=performance.now()+350;};
      window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);
      row.addEventListener('click',e=>{if(performance.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
      row.addEventListener('keydown',e=>{if(e.target!==row||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();row.scrollBy({left:(e.key==='ArrowLeft'?-1:1)*(originals[0].offsetWidth+24),behavior:motion.matches?'instant':'smooth'});});
      new IntersectionObserver(entries=>visible=entries[0].isIntersecting,{threshold:.05}).observe(row);
      root.querySelectorAll<HTMLButtonElement>('[data-carousel-step]').forEach(button=>{button.hidden=false;button.addEventListener('click',()=>{if(index)return;navigationUntil=performance.now()+650;normalize();row.scrollBy({left:Number(button.dataset.carouselStep)*(originals[0].offsetWidth+24),behavior:motion.matches?'instant':'smooth'});});});
      let previous=0,position=row.scrollLeft;
      function tick(time:number){const delta=Math.min(time-previous,50);previous=time;
        if(autoEnabled()&&visible&&!paused&&!hover&&!focused&&!dragging&&time>navigationUntil&&!document.hidden&&!document.querySelector('.watch-dialog[open]')){
          // Keep fractional motion between frames; scrollLeft itself is rounded by some browsers.
          if(Math.abs(position-row.scrollLeft)>2)position=row.scrollLeft;
          position+=(row.dataset.direction==='reverse'?-1:1)*delta*.026;
          if(period){position=((position%period)+period)%period;}row.scrollLeft=position;
        }else position=row.scrollLeft;
        requestAnimationFrame(tick);
      }requestAnimationFrame(tick);
    });
  });
}
