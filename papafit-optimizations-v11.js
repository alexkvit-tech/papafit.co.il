/* PAPAFIT v7 stage 1 — copy, credibility, pricing, accessibility and consent-based analytics */
(()=>{
 'use strict';
 const BUILD='PAPAFIT-v18-quiz-2026-11-23';
 const CONFIG=window.PAPAFIT_TRACKING_CONFIG||{};
 const isRu=()=>/^\/ru(?:\/|$)/.test(location.pathname);
 const isHome=()=>/^(\/|\/ru|\/ru\/|\/index\.html)$/.test(location.pathname);
 const TEXT={
  he:{
    micro:'פנייה ראשונית בוואטסאפ, ללא התחייבות. אני משיב אישית.',
    credentials:[['בוגר קורס תזונה','LBS Academy'],['ליווי אישי 1:1','התאמה לשגרת החיים שלך'],['משוב שבועי','בדיקת התקדמות והתאמות'],['אפליקציית PAPAFIT','תזונה, הרגלים ומעקב במקום אחד']],
    certBadge:'בוגר קורס תזונה · LBS Academy',
    from:'לעלות מדרגה מתחילים בהרגל אחד שאפשר לשמור עליו.',
    storiesTitle:'הסיפור הבא יכול להיות שלך',storiesBody:'אלה חלק מסיפורי ההתקדמות של אנשים שליוויתי.',
    monthly4:'שווה ערך ל־450 ₪ לחודש',
    monthly6:'שווה ערך ל־400 ₪ לחודש',
    consentTitle:'אפשר להשתמש בכלי מדידה?',consentBody:'בהסכמתך נשתמש בכלי מדידה כדי להבין אילו עמודים עוזרים למבקרים. סירוב לא יפגע בגלישה באתר.',
    accept:'מאשר/ת מדידה',deny:'גלישה ללא מדידה',policy:'מדיניות פרטיות',
    logoAlt:'PAPAFIT, ליווי תזונה ובניית הרגלים',avatarAlt:'אלכס קביטניצקי, מייסד PAPAFIT'
  },
  ru:{
    micro:'Первое обращение в WhatsApp, без обязательств. Я отвечаю лично.',
    credentials:[['Курс по питанию','LBS Academy'],['Личное сопровождение 1:1','Программа под ваш ритм жизни'],['Еженедельная обратная связь','Отслеживание и корректировка'],['Приложение PAPAFIT','Питание, привычки и прогресс']],
    certBadge:'Курс по питанию · LBS Academy',
    storiesTitle:'Следующая история может быть вашей',storiesBody:'Это лишь некоторые истории людей, которых я сопровождал.',
    monthly4:'Эквивалент 450 ₪ в месяц',
    monthly6:'Эквивалент 400 ₪ в месяц',
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
  const benefits=[...hero.querySelectorAll('ul')].find(el=>/בלי תפריט|Без ж[её]сткого/.test(el.textContent));
  let anchor=benefits||hero.querySelector('h1')?.parentElement;
  if(!anchor)return;
  let bar=document.createElement('div');bar.className='pf-v7-cred';bar.setAttribute('aria-label',lang()==='ru'?'Почему мне доверяют':'למה לבחור ב־PAPAFIT');
  for(const [name,description] of t().credentials){const item=document.createElement('div');const b=document.createElement('strong');b.textContent=name;const sp=document.createElement('span');sp.textContent=description;item.append(b,sp);bar.appendChild(item)}
  anchor.insertAdjacentElement('afterend',bar);
 }
 function addCertBadge(){
  const h=document.getElementById('about-title')||(/(?:^|\/)about(?:\.html)?$/.test(location.pathname)?document.querySelector('main h1'):null);
  if(!h||h.parentElement.querySelector('.pf-cert-badge'))return;
  const b=document.createElement('p');b.className='pf-cert-badge';b.textContent=t().certBadge;
  h.insertAdjacentElement('afterend',b);
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
  const ru=lang()==='ru';
  const guide=ru?'/ru/weight-loss-guide':'/weight-loss-guide';
  if(isHome()){
    const heading=document.getElementById('articles-title');
    const articles=heading?.closest('section');
    if(!articles||document.querySelector('[data-pf-guide-promo]'))return;
    const promo=document.createElement('section');
    promo.className='pf-guide-promo';promo.dataset.pfGuidePromo='1';promo.dir=ru?'ltr':'rtl';
    promo.innerHTML=ru
      ?'<div class="pf-guide-promo-inner"><div><span class="pf-guide-promo-eyebrow">PAPAFIT · Бесплатное руководство</span><h2>Как снижать вес, когда есть работа и дети?</h2><p>Практическое руководство с девятью принципами, которые работают даже в загруженную неделю, на семейных обедах и в выходные.</p><a href="/ru/weight-loss-guide" class="pf-guide-promo-button">Читать полное руководство</a></div></div>'
      :'<div class="pf-guide-promo-inner"><div><span class="pf-guide-promo-eyebrow">PAPAFIT · מדריך חינמי לקריאה</span><h2>איך יורדים במשקל כשיש עבודה וילדים?</h2><p>מדריך מעשי עם תשעה עקרונות שעובדים גם בשבוע עמוס, בארוחות משפחתיות ובסופי שבוע.</p><a href="/weight-loss-guide" class="pf-guide-promo-button">לקריאת המדריך המלא</a></div></div>';
    articles.insertAdjacentElement('beforebegin',promo);
  }else if(/^(?:\/ru)?\/articles(?:\.html|\/)?$/.test(location.pathname)){
    const heading=document.querySelector('main h1');
    if(!heading||document.querySelector('[data-pf-guide-link]'))return;
    const note=document.createElement('p');note.dataset.pfGuideLink='1';
    const link=document.createElement('a');link.href=guide;
    link.textContent=ru?'Полное руководство: как на самом деле снижать вес, когда есть работа и дети':'למדריך המלא: ככה באמת יורדים במשקל כשיש עבודה וילדים';
    note.append(link);heading.insertAdjacentElement('afterend',note);
  }
 }

 const hydrated=el=>!!el&&Object.keys(el).some(k=>k.startsWith('__reactFiber'));
 const QUIZ_TXT={
  he:{promo:'<div class="pf-quiz-promo-inner"><div><span class="pf-quiz-promo-eyebrow">PAPAFIT · שאלון אישי חינמי</span><h2>למה אתה לא מצליח לרדת במשקל?</h2><p>15 שאלות קצרות, 3 דקות, ובסוף הסיבות העיקריות שעוצרות דווקא אותך, עם הסבר ומה לעשות כבר השבוע. בלי הרשמה ובלי מייל.</p></div><div class="pf-quiz-promo-cta"><a href="/weight-loss-quiz" class="pf-quiz-promo-button" data-cta="quiz_promo">לגלות מה עוצר אותי</a><small>התוצאות מופיעות מיד על המסך · או <a href="/calorie-calculator">מחשבון קלוריות אישי</a></small></div></div>',
   label:'שאלון: למה אתה לא מצליח לרדת במשקל',quiz:'/weight-loss-quiz',calc:'/calorie-calculator',list:/^\/articles(?:\.html|\/)?$/,art:/^\/articles\/[^/]+/,faq:/שאלות נפוצות/,
   link:'שאלון של 3 דקות: למה אתה לא מצליח לרדת במשקל?',calcLink:'מחשבון קלוריות אישי',
   card:'<h2>רוצה לדעת מה עוצר דווקא אותך?</h2><p>שאלון קצר של 3 דקות שמראה את הסיבות העיקריות שלך ומה לעשות איתן כבר השבוע.</p><a href="/weight-loss-quiz" class="pf-quiz-promo-button" data-cta="quiz_article">למילוי השאלון</a>'},
  ru:{promo:'<div class="pf-quiz-promo-inner"><div><span class="pf-quiz-promo-eyebrow">PAPAFIT · Бесплатный персональный тест</span><h2>Почему у вас не получается похудеть?</h2><p>15 коротких вопросов, 3 минуты, и в конце главные причины, которые останавливают именно вас, с объяснением и тем, что делать уже на этой неделе. Без регистрации и e-mail.</p></div><div class="pf-quiz-promo-cta"><a href="/ru/weight-loss-quiz" class="pf-quiz-promo-button" data-cta="quiz_promo">Узнать, что мне мешает</a><small>Результат сразу на экране · или <a href="/ru/calorie-calculator">калькулятор калорий</a></small></div></div>',
   label:'Тест: почему у вас не получается похудеть',quiz:'/ru/weight-loss-quiz',calc:'/ru/calorie-calculator',list:/^\/ru\/articles(?:\.html|\/)?$/,art:/^\/ru\/articles\/[^/]+/,faq:/Частые вопросы/,
   link:'Тест на 3 минуты: почему у вас не получается похудеть?',calcLink:'Калькулятор калорий',
   card:'<h2>Хотите узнать, что мешает именно вам?</h2><p>Короткий тест на 3 минуты покажет ваши главные причины и что с ними делать уже на этой неделе.</p><a href="/ru/weight-loss-quiz" class="pf-quiz-promo-button" data-cta="quiz_article">Пройти тест</a>'}
 };
 function addQuizLink(){
  const ru=lang()==='ru';const T=QUIZ_TXT[ru?'ru':'he'];
  const later=()=>{if(!addQuizLink.t)addQuizLink.t=setTimeout(()=>{addQuizLink.t=0;addQuizLink()},400);};
  if(isHome()){
    if(document.querySelector('[data-pf-quiz-promo]'))return;
    const problem=document.getElementById('problem-title')?.closest('section');
    if(!problem)return;
    if(!hydrated(problem))return later();
    const promo=document.createElement('section');promo.className='pf-quiz-promo';promo.dataset.pfQuizPromo='1';promo.dir=ru?'ltr':'rtl';promo.setAttribute('aria-label',T.label);
    promo.innerHTML=T.promo;problem.insertAdjacentElement('afterend',promo);
  }else if(T.list.test(location.pathname)){
    const h1=document.querySelector('main h1');
    if(!h1||document.querySelector('[data-pf-quiz-link]'))return;
    if(!hydrated(h1))return later();
    const note=document.createElement('p');note.dataset.pfQuizLink='1';const a=document.createElement('a');a.href=T.quiz;a.textContent=T.link;const c=document.createElement('a');c.href=T.calc;c.textContent=T.calcLink;note.append(a,' · ',c);
    (document.querySelector('[data-pf-guide-link]')||h1).insertAdjacentElement('afterend',note);
  }else if(T.art.test(location.pathname)){
    const prose=document.querySelector('main .prose-pf');
    if(!prose||document.querySelector('[data-pf-quiz-card]'))return;
    if(!hydrated(prose))return later();
    const card=document.createElement('aside');card.className='pf-quiz-card';card.dataset.pfQuizCard='1';card.dir=ru?'ltr':'rtl';
    card.innerHTML=T.card;
    const faq=[...prose.querySelectorAll('h2')].find(h=>T.faq.test(h.textContent));
    faq?faq.insertAdjacentElement('beforebegin',card):prose.insertAdjacentElement('afterend',card);
  }
 }
 function addNavTab(){
  const ru=lang()==='ru';const calc=ru?'/ru/calorie-calculator':'/calorie-calculator';const label=ru?'Калькулятор калорий':'מחשבון קלוריות';
  const isReact=!!document.querySelector('script[src*="/_next/"]');
  for(const ul of document.querySelectorAll('header nav ul, #mobile-menu ul')){
    if(ul.querySelector('[data-pf-nav-calc]'))continue;
    const ref=[...ul.querySelectorAll('a')].find(a=>(ru?/^\/ru\/articles$/:/^\/articles$/).test(a.getAttribute('href')||''));
    if(!ref)continue;
    if(isReact&&!hydrated(ul)){if(!addNavTab.t)addNavTab.t=setTimeout(()=>{addNavTab.t=0;addNavTab()},400);continue;}
    const li=document.createElement('li');li.dataset.pfNavCalc='1';
    const a=ref.cloneNode(true);a.href=calc;a.removeAttribute('aria-current');
    const tn=[...a.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());if(tn)tn.textContent=label;else a.prepend(label);
    if(location.pathname.replace(/\.html$|\/$/,'')===calc)a.setAttribute('aria-current','page');
    li.append(a);ref.closest('li').insertAdjacentElement('afterend',li);
  }
 }
 window.papafitTrack=(kind,detail)=>emit(kind,{...(detail||{}),page_path:location.pathname});
 function articleDate(){
  if(!/^(?:\/ru)?\/articles\/[^/]+/.test(location.pathname))return;
  const h1=document.querySelector('main h1');
  if(!h1||document.querySelector('[data-pf-updated]'))return;
  // wait until React has hydrated the heading, otherwise inserting nodes breaks hydration
  if(!Object.keys(h1).some(k=>k.startsWith('__reactFiber'))){if(!articleDate.t)articleDate.t=setTimeout(()=>{articleDate.t=0;articleDate()},400);return;}
  let d=null;
  for(const s of document.querySelectorAll('script[type="application/ld+json"]')){try{const j=JSON.parse(s.textContent);if(j['@type']==='Article'&&j.dateModified){d=j.dateModified;break}}catch(e){}}
  if(!d)return;
  const dt=new Date(d.length===10?d+'T12:00:00':d);
  const el=document.createElement('p');el.dataset.pfUpdated='1';el.className='pf-updated';
  el.style.cssText='margin-top:.75rem;font-size:.875rem;opacity:.75';
  const time=document.createElement('time');time.dateTime=d;
  time.textContent=dt.toLocaleDateString(lang()==='ru'?'ru-RU':'he-IL',{day:'numeric',month:'long',year:'numeric'});
  el.append(lang()==='ru'?'Обновлено: ':'עודכן: ',time);
  h1.insertAdjacentElement('afterend',el);
 }
 const ARTICLE_IMAGES={
  "article-protein-v6.webp":"papafit-protein-v11.webp",
  "article-carbs-evening-v6.webp":"papafit-carbs-evening-v11.webp",
  "article-back-to-routine-v6.webp":"papafit-back-to-routine-v11.webp",
  "article-weight-plateau-v6.webp":"papafit-weight-plateau-v11.webp",
  "article-online-coaching-v6.webp":"papafit-online-coaching-v11.webp",
  "article-no-extreme-diet-v6.webp":"papafit-no-extreme-diet-v11.webp",
  "article-habits-v6.webp":"papafit-habits-v11.webp",
  "article-no-calorie-counting-v6.webp":"papafit-no-calorie-counting-v11.webp"
 };
 function repairArticleImages(){
  document.querySelectorAll('img[src*="/images/articles/"]').forEach(im=>{
   const src=im.getAttribute('src')||'';
   for(const [old,newName] of Object.entries(ARTICLE_IMAGES)){
    if(src.includes(old)){
      im.setAttribute('src',src.replace(old,newName));
      break;
    }
   }
  });
 }
 function fillImageAlts(){
  for(const im of document.querySelectorAll('img')){
    const src=im.getAttribute('src')||'';
    if((src.includes('papafit-logo.webp')||src.includes('alex-avatar'))&&!im.alt) im.alt=src.includes('papafit-logo')?t().logoAlt:t().avatarAlt;
    const sm=src.match(/\/images\/success\/(dima|dennis|lihi|alim|yuli)\.webp/);
    if(sm&&!im.alt){const he={dima:'דימה: 20 ק״ג פחות, לפני ואחרי',dennis:'דניס: 12 ק״ג פחות, לפני ואחרי',lihi:'ליהי: 8 ק״ג פחות, לפני ואחרי',alim:'עלים: 6 ק״ג פחות, לפני ואחרי',yuli:'יולי: 6 ק״ג פחות, לפני ואחרי'};const ru={dima:'Дима: минус 20 кг, до и после',dennis:'Денис: минус 12 кг, до и после',lihi:'Лихи: минус 8 кг, до и после',alim:'Алим: минус 6 кг, до и после',yuli:'Юли: минус 6 кг, до и после'};im.alt=(lang()==='ru'?ru:he)[sm[1]];}
    if(/ytimg\.com|hqdefault/.test(src)&&!im.alt) im.alt=lang()==='ru'?'Видео: знакомство с Алексом Квитницким':'סרטון היכרות עם אלכס קביטניצקי';
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
 function shareGuide(){
  const btn=document.getElementById('pf-guide-copy-link');
  if(!btn||btn.dataset.pfBound)return;
  btn.dataset.pfBound='1';
  btn.addEventListener('click',async()=>{
    const url=isRu()?'https://papafit.co.il/ru/weight-loss-guide':'https://papafit.co.il/weight-loss-guide';
    try{await navigator.clipboard.writeText(url);btn.textContent=isRu()?'Ссылка скопирована ✓':'הקישור הועתק ✓';}
    catch(err){btn.textContent=url;}
  });
 }
 function apply(){
  const wa=[...document.querySelectorAll('a[href]')].filter(a=>/^(https?:\/\/)?(?:wa\.me|api\.whatsapp\.com)\//.test(a.getAttribute('href')||''));
  for(const a of wa){a.target='_blank';a.rel='noopener noreferrer';if(!a.dataset.cta)a.dataset.cta=position(a)}
  addMicro();addCredibility();addCertBadge();resultsSummary();monthlyPrices();aboutTerms();repairArticleImages();fillImageAlts();addGuideLink();addQuizLink();addNavTab();articleDate();shareGuide();banner();
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
