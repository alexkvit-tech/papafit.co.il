(()=>{
  'use strict';
  const BUILD='PAPAFIT-2026-10-22-v4';
  const NEW_HERO='/images/alex-papafit-hero-new.webp';
  const NEW_FACE='/images/alex-avatar-new.webp';
  const OLD_HERO='/images/alex-papafit-gym.webp';
  const ABOUT_PHOTO='/images/alex-basketball-about.webp';
  const VIDEO_ID='papafit-intro-video';
  const VIDEO='-iOVJ-2T3-k';
  const trim = value => value.replace(/\/+$/, '') || '/';
  const path = () => trim(window.location.pathname);
  const isAbout = p => /^(\/ru)?\/about$/.test(p);
  const isHome = p => p==='/' || p==='/ru';
  let running=false, queued=false;
  window.__PAPAFIT_RELEASE=BUILD;

  // An internal Next.js navigation can use an older prefetched RSC payload.
  // Only /about links use native document navigation so canonical HTML is
  // used instead of a stale client-side payload.
  document.addEventListener('click',e=>{
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const a=e.target&&e.target.closest&&e.target.closest('a[href]');
    if(!a||a.hasAttribute('download')||(a.target&&a.target!=='_self'))return;
    let url;
    try{ url=new URL(a.href,window.location.href); }catch{return;}
    if(url.origin!==window.location.origin||!isAbout(trim(url.pathname)))return;
    if(url.href===window.location.href)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.location.assign(url.href);
  },true);

  function source(img,src){
    if(img.getAttribute('src')!==src){
      img.setAttribute('src',src);
      // These images are exported with unoptimized Next Image so there is no
      // responsive srcset to override our selected source.
      if(img.hasAttribute('srcset'))img.removeAttribute('srcset');
    }
  }

  function apply(){
    if(running)return;
    running=true;
    try{
      const p=path(),about=isAbout(p),home=isHome(p);
      // In About the large profile portrait is the previous hero image.
      if(about){
        for(const img of document.querySelectorAll('main aside img')) source(img,ABOUT_PHOTO);
      }
      // Small profile pictures elsewhere use a crop from the new photo.
      for(const img of document.querySelectorAll('img[src*="/images/alex-avatar.webp"]')){
        if(!about||!img.closest('main aside'))source(img,NEW_FACE);
      }
      if(home){
        const hero=document.querySelector('main section img[src*="alex-papafit-gym.webp"],main section img[src*="alex-papafit-hero-new.webp"]');
        if(hero && hero.closest('.clip-reveal'))source(hero,NEW_HERO);
        // The About teaser on the homepage retains the former hero photo.
        const teaser=Array.from(document.querySelectorAll('main section img'))
          .find(img=>img.closest('section')?.querySelector('a[href="/about"],a[href="/ru/about"]')
            && (img.getAttribute('src')||'').includes('alex-'));
        if(teaser && !/alex-family-(intro|2026)\.webp/.test(teaser.getAttribute('src')||''))source(teaser,OLD_HERO);
        if(!document.getElementById(VIDEO_ID))installVideo(p);
      }
    }finally{running=false;}
  }
  function installVideo(p){
    const target=document.getElementById('method');
    if(!target)return;
    const ru=p==='/ru';
    const title=ru?'Прежде чем начать — давайте познакомимся':'לפני שמתחילים, בואו נכיר';
    const desc=ru?'Посмотрите короткое видео, чтобы узнать меня и мой подход к персональному сопровождению':'בסרטון קצר תוכלו להכיר אותי, לשמוע על הגישה שלי ולראות אם הליווי מתאים לכם';
    const play=ru?'Смотреть видео':'לצפייה בסרטון';
    const cta=ru?'Проверить, подходит ли мне сопровождение':'בדיקת התאמה אישית בוואטסאפ';
    const wa=document.querySelector('a[href*="wa.me"],a[href*="api.whatsapp.com"]')?.href||'/contact';
    const section=document.createElement('section');
    section.id=VIDEO_ID;
    section.className='papafit-intro-section';
    section.innerHTML='<div class="papafit-intro-wrap"><div class="papafit-intro-heading"><span class="papafit-intro-eyebrow">PAPAFIT · VIDEO</span><h2>'+title+'</h2><p>'+desc+'</p></div><div class="papafit-intro-player"><button type="button" class="papafit-intro-play" aria-label="'+play+'"><img alt="" loading="lazy" src="https://i.ytimg.com/vi/'+VIDEO+'/hqdefault.jpg?rev=20261022-4"><span class="papafit-intro-play-icon" aria-hidden="true">▶</span><span class="papafit-intro-play-label">'+play+'</span></button></div><a class="papafit-intro-cta" href="'+wa+'" target="_blank" rel="noopener noreferrer">'+cta+'</a></div>';
    target.parentNode.insertBefore(section,target);
    section.querySelector('button').addEventListener('click',()=>{
      const frame=document.createElement('iframe');
      frame.src='https://www.youtube-nocookie.com/embed/'+VIDEO+'?autoplay=1&rel=0';
      frame.title=title;frame.loading='lazy';
      frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.referrerPolicy='strict-origin-when-cross-origin';
      frame.allowFullscreen=true;
      section.querySelector('.papafit-intro-player').replaceChildren(frame);
    },{once:true});
  }

  function schedule(){
    if(queued)return;
    queued=true;
    // Deferred to after React commits the new route DOM.
    queueMicrotask(()=>{queued=false;apply();});
  }
  const observer=new MutationObserver(records=>{
    if(records.some(r=>r.addedNodes.length||r.removedNodes.length))schedule();
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
  window.addEventListener('pageshow',schedule);
  window.addEventListener('popstate',schedule);
})();
