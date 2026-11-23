/* PAPAFIT v7 stage 1 — copy, credibility, pricing, accessibility and consent-based analytics */
(()=>{
 'use strict';
 const BUILD='PAPAFIT-v10-guide-production-2026-11-13';
 const CONFIG=window.PAPAFIT_TRACKING_CONFIG||{};
 const isRu=()=>/^\/ru(?:\/|$)/.test(location.pathname);
 const isHome=()=>/^(\/|\/ru|\/ru\/|\/index\.html)$/.test(location.pathname);
 const TEXT={
  he:{
    micro:'פנייה ראשונית בוואטסאפ, ללא התחייבות. אני משיב אישית.',
    credentials:[['רקע בספורט מקצועי','ניסיון אישי בכדורסל מקצועי'],['ליווי אישי 1:1','התאמה לשגרת החיים שלך'],['משוב שבועי','בדיקת התקדמות והתאמות'],['אפליקציית PAPAFIT','תזונה, הרגלים ומעקב במקום אחד']],
    from:'לעלות מדרגה מתחילים בהרגל אחד שאפשר לשמור עליו.',
    storiesTitle:'הסיפור הבא יכול להיות שלך',storiesBody:'אלה חלק מסיפורי ההתקדמות של אנשים שליוויתי.',
    monthly4:'שווה ערך ל־450 ₪ לחודש · המחיר המלא הוא 1,800 ₪',
    monthly6:'שווה ערך ל־400 ₪ לחודש · המחיר המלא הוא 2,400 ₪',
    consentTitle:'אפשר להשתמש בכלי מדידה?',consentBody:'בהסכמתך נשתמש בכלי מדידה כדי להבין אילו עמודים עוזרים למבקרים. סירוב לא יפגע בגלישה באתר.',
    accept:'מאשר/ת מדידה',deny:'גלישה ללא מדידה',policy:'מדיניות פרטיות',
    logoAlt:'PAPAFIT, ליווי תזונה ובניית הרגלים',avatarAlt:'אלכס קביטניצקי, מייסד PAPAFIT'
  },
  ru:{
    micro:'Первое обращение в WhatsApp, без обязательств. Я отвечаю лично.',
    credentials:[['Опыт в профессиональном спорте','Баскетбол на профессиональном уровне'],['Личное сопровождение 1:1','Программа под ваш ритм жизни'],['Еженедельная обратная связь','Отслеживание и корректировка'],['Приложение PAPAFIT','Питание, привычки и прогресс']],
    storiesTitle:'Следующая история может быть вашей',storiesBody:'Это лишь некоторые истории людей, которых я сопровождал.',
    monthly4:'Эквивалент 450 ₪ в месяц · полная стоимость 1 800 ₪',
    monthly6:'Эквивалент 400 ₪ в месяц · полная стоимость 2 400 ₪',
    consentTitle:'Разрешить аналитику?',consentBody:'С вашего согласия мы используем инструменты аналитики, чтобы понять, какие страницы полезны посетителям. Отказ не повлияет на работу сайта.',
    accept:'Разрешить',deny:'Продолжить без аналитики',policy:'Политика конфиденциальности',
    logoAlt:'PAPAFIT, сопровождение по питанию и привычкам',avatarAlt:'Алекс Квитницкий, основатель PAPAFIT'
  }
 };
 const lang=()=>isRu()?'ru':'he'; const t=()=>TEXT[lang()];
 window.__PAPAFIT_REVIEW_BUILD=BUILD;
 let started=false;let nextPatch=false;let consent=null;let consentElement=null;
 try{consent=localStorage.getItem('papafit_analytics_consent_v7');}catch(e){}
 const looksGTM=v=>/^GTM-[A-Z0-9]{4,}$/.test(v||'');
 const looksGA=v=>/^G-[A-Z0-9]{5,}$/.test(v||'');
 const looksPixel=v=>/^\d{6,20}$/.test(v||'');
 const configured=()=>looksGTM(CONFIG.GTM_ID)||looksGA(CONFIG.GA4_ID)||looksPixel(CONFIG.META_PIXEL_ID);
 function inject(src){let s=document.createElement('script');s.async=true;s.src=src;document.head.appendChild(s);}
 function startMeasurement(){
  if(started||consent!=='yes'||!configured())return;
  started=true;
  if(looksGTM(CONFIG.GTM_ID)){
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
    inject('https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(CONFIG.GTM_ID));
  }else{
    if(looksGA(CONFIG.GA4_ID)){
      window.dataLayer=window.dataLayer||[];
      window.gtag=function(){window.dataLayer.push(arguments)};
      window.gtag('js',new Date());
      window.gtag('config',CONFIG.GA4_ID,{send_page_view:true});
      inject('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(CONFIG.GA4_ID));
    }
    if(looksPixel(CONFIG.META_PIXEL_ID)){
      const f=window;const b=f.fbq=function(){b.callMethod?b.callMethod.apply(b,arguments):b.queue.push(arguments)};
      b.queue=[];b.loaded=true;b.version='2.0';
      inject('https://connect.facebook.net/en_US/fbevents.js');
      f.fbq('init',CONFIG.META_PIXEL_ID);f.fbq('track','PageView');
    }
  }
 }
 function emit(kind,detail){
  if(consent!=='yes'||!started)return;
  if(looksGTM(CONFIG.GTM_ID)){
    if(kind==='whatsapp_click'){window.dataLayer.push({event:'papafit_generate_lead',...detail,lead_type:'whatsapp'});}
    else{window.dataLayer.push({event:'papafit_'+kind,...detail});}
  }else{
    if(typeof window.gtag==='function'){window.gtag('event',kind,detail);if(kind==='whatsapp_click')window.gtag('event','generate_lead',{...detail,lead_type:'whatsapp'});}
    if(typeof window.fbq==='function'&&kind==='whatsapp_click')window.fbq('track','Contact',{button_location:detail.button_location});
  }
 }
 function chooseConsent(yes){consent=yes?'yes':'no';try{localStorage.setItem('papafit_analytics_consent_v7',consent)}catch(e){};consentElement?.remove();consentElement=null;if(yes)startMeasurement()}
 function banner(){
  if(!configured()||consent!==null||consentElement)return;
  let tr=t();let div=document.createElement('div');div.className='pf-v7-consent';div.dir=lang()==='ru'?'ltr':'rtl';div.setAttribute('role','region');div.setAttribute('aria-label',tr.consentTitle);
  div.innerHTML=`<strong class="pf-v7-consent-title"></strong><p></p><div class="pf-v7-consent-actions"><button type="button" data-choice="yes"></button><button type="button" data-choice="no"></button></div><a href="${isRu()?'/ru/privacy':'/privacy'}"></a>`;
  div.querySelector('strong').textContent=tr.consentTitle;div.querySelector('p').textContent=tr.consentBody;
  div.querySelector('[data-choice="yes"]').textContent=tr.accept;div.querySelector('[data-choice="no"]').textContent=tr.deny;div.querySelector('a').textContent=tr.policy;
  div.addEventListener('click',e=>{let btn=e.target.closest('button[data-choice]');if(btn)chooseConsent(btn.dataset.choice==='yes')});
  document.body.appendChild(div);consentElement=div;
 }
 function insertMicroAfter(anchor,unique){
  if(!anchor||anchor.dataset.pfV7Micros==='1')return;
  // The hint is placed after the flex container when the CTA shares a row with secondary actions.
  let node=anchor.parentElement;const parent=node?.className||'';
  if(node&&/flex/.test(parent)&&node.querySelectorAll('a').length>1){}
  else node=anchor;
  if(node.nextElementSibling?.classList?.contains('pf-v7-micro')){anchor.dataset.pfV7Micros='1';return}
  const hint=document.createElement('p');hint.className='pf-v7-micro';hint.textContent=t().micro;
  node.insertAdjacentElement('afterend',hint);anchor.dataset.pfV7Micros='1';
 }
 function addMicro(){
  if(!isHome())return;
  const areas=[document.querySelector('main section'),document.getElementById('results'),document.getElementById('pricing'),document.querySelector('main>section:last-of-type')];
  for(const sec of areas){if(!sec)continue;const links=[...sec.querySelectorAll('a[href*="wa.me/"]')];
    for(const a of links){
      if(sec.id==='pricing'&&!/4 חודשים|6 חודשים|4 месяца|6 месяцев/.test(a.closest('article')?.textContent||''))continue;
      if(sec===areas[0]&&a!==links[0])continue;
      if(sec.id==='results'&&a!==links[links.length-1])continue;
      if(sec===areas[3]&&a!==links[links.length-1])continue;
      insertMicroAfter(a);
    }
  }
 }
 function addCredibility(){
  if(!isHome())return;
  const hero=document.querySelector('main section');
  if(!hero||hero.querySelector('.pf-v7-cred'))return;
  const benefits=[...hero.querySelectorAll('ul')].find(el=>/בלי תפריט|Без жесткого/.test(el.textContent));
  let anchor=benefits||hero.querySelector('h1')?.parentElement;
  if(!anchor)return;
  let bar=document.createElement('div');bar.className='pf-v7-cred';bar.setAttribute('aria-label',lang()==='ru'?'Почему мне доверяют':'למה לבחור ב־PAPAFIT');
  for(const [name,description] of t().credentials){const item=document.createElement('div');const b=document.createElement('strong');b.textContent=name;const sp=document.createElement('span');sp.textContent=description;item.append(b,sp);bar.appendChild(item)}
  anchor.insertAdjacentElement('afterend',bar);
 }
 function resultsSummary(){
  if(!isHome())return;
  const res=document.getElementById('results');if(!res)return;
  const p=[...res.querySelectorAll('p')].find(e=>/יחד, אצל חמשת|у пяти|пяти участник/.test(e.textContent||''));
  if(!p)return;
  const stat=p.previousElementSibling;if(stat&&/52/.test(stat.textContent)) {stat.removeAttribute('dir');stat.textContent=t().storiesTitle;stat.style.fontSize='clamp(1.5rem,3vw,2.25rem)';}
  p.textContent=t().storiesBody;
 }
 function monthlyPrices(){
  for(const article of document.querySelectorAll('article')){
    if(article.querySelector('.pf-v7-subprice'))continue;
    const price=[...article.querySelectorAll('span,p')].find(el=>/^(?:1[ ,.]?800|2[ ,.]?400)\s*₪$/.test(el.textContent?.trim()||''));
    if(!price)continue;
    let is4=/1[ ,.]?800/.test(price.textContent);let el=document.createElement('p');el.className='pf-v7-subprice';el.textContent=is4?t().monthly4:t().monthly6;
    (price.closest('p')||price).insertAdjacentElement('afterend',el);
  }
 }
 function aboutTerms(){
  if(!/(?:^|\/)about(?:\.html)?$/.test(location.pathname))return;
  for(const el of document.querySelectorAll('main p')){
    if(lang()==='he'&&el.textContent.includes('מאמן לתזונה')){
      for(const node of el.childNodes){if(node.nodeType===Node.TEXT_NODE)node.textContent=node.textContent.replace('מאמן לתזונה','מלווה תזונה');}
    }
  }
 }
 function addGuideLink(){
  if(lang()!=='he')return;
  if(isHome()){
    const heading=document.getElementById('articles-title');
    const articles=heading?.closest('section');
    if(!articles||document.querySelector('[data-pf-guide-promo]'))return;
    const promo=document.createElement('section');
    promo.className='pf-guide-promo';promo.dataset.pfGuidePromo='1';promo.dir='rtl';
    promo.innerHTML='<div class="pf-guide-promo-inner"><div><span class="pf-guide-promo-eyebrow">PAPAFIT · המדריך המלא</span><h2>ככה באמת יורדים במשקל כשיש עבודה וילדים</h2><p>9 עקרונות מעשיים לתזונה, הרגלים והתמדה בשבוע עמוס. בלי דיאטות קיצוניות ובלי לוותר על ארוחת שישי.</p><a href="/weight-loss-guide" class="pf-guide-promo-button">לקריאת המדריך המלא ←</a></div><div class="pf-guide-promo-aside" aria-hidden="true"><span>9</span><small>עקרונות ליישום<br>בחיים האמיתיים</small></div></div>';
    articles.insertAdjacentElement('beforebegin',promo);
  }else if(/^\/articles(?:\.html|\/)?$/.test(location.pathname)){
    const heading=document.querySelector('main h1');
    if(!heading||document.querySelector('[data-pf-guide-link]'))return;
    const note=document.createElement('p');note.dataset.pfGuideLink='1';
    const link=document.createElement('a');link.href='/weight-loss-guide';
    link.textContent='למדריך המלא: ככה באמת יורדים במשקל כשיש עבודה וילדים';
    note.append(link);heading.insertAdjacentElement('afterend',note);
  }
 }
 function fillImageAlts(){
  for(const im of document.querySelectorAll('img')){
    const src=im.getAttribute('src')||'';
    if((src.includes('papafit-logo.webp')||src.includes('alex-avatar'))&&!im.alt) im.alt=src.includes('papafit-logo')?t().logoAlt:t().avatarAlt;
    if(src.includes('/images/articles/')&&!im.alt){const card=im.closest('article');const title=card?.querySelector('h3')?.textContent?.trim();if(title)im.alt=title}
  }
 }
 function position(a){
  if(a.dataset.cta)return a.dataset.cta;
  const s=a.closest('section');const price=a.closest('article');let text=a.textContent||'';
  if(a.closest('header'))return 'header';
  if(a.closest('footer'))return 'footer';
  if(price){if(/4 חודשים|4 месяца/.test(price.textContent))return 'price_4m';if(/6 חודשים|6 месяцев/.test(price.textContent))return 'price_6m';if(/פגישת ייעוץ|консультац/.test(price.textContent))return 'price_single';}
  if(s?.id==='results')return 'testimonials';
  if(s?.id==='method')return 'method';
  if(s?.id==='pricing')return 'pricing';
  if(s?.id==='papafit-intro-video')return 'video';
  if(s===document.querySelector('main section'))return 'hero';
  if(a.classList.contains('fixed')||a.parentElement?.classList?.contains('fixed'))return 'floating';
  if(s&&s===document.querySelector('main>section:last-of-type'))return 'final';
  if(/שליחת הודעה|Написать Алексу/.test(text))return 'final';
  return 'other';
 }
 function apply(){
  const wa=[...document.querySelectorAll('a[href]')].filter(a=>/^(https?:\/\/)?(?:wa\.me|api\.whatsapp\.com)\//.test(a.getAttribute('href')||''));
  for(const a of wa){a.target='_blank';a.rel='noopener noreferrer';if(!a.dataset.cta)a.dataset.cta=position(a)}
  addMicro();addCredibility();resultsSummary();monthlyPrices();aboutTerms();fillImageAlts();addGuideLink();banner();
 }
 function schedule(){if(nextPatch)return;nextPatch=true;requestAnimationFrame(()=>{nextPatch=false;apply()})}
 const observer=new MutationObserver(records=>{if(records.some(r=>r.addedNodes.length||r.removedNodes.length))schedule()});
 // Global event delegation survives Next.js client-side navigation.
 document.addEventListener('click',(e)=>{
   const a=e.target.closest?.('a[href]');if(!a)return;
   if(/^(https?:\/\/)?(?:wa\.me|api\.whatsapp\.com)\//.test(a.getAttribute('href')||'')){
     emit('whatsapp_click',{button_location:position(a),page_path:location.pathname});
   }
 },true);
 observer.observe(document.documentElement,{childList:true,subtree:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true}); else schedule();
 window.addEventListener('pageshow',schedule);window.addEventListener('popstate',()=>{schedule();if(consent==='yes'&&typeof window.fbq==='function')window.fbq('track','PageView')});
 if(consent==='yes')startMeasurement();
})();
