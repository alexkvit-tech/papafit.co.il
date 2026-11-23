/* PAPAFIT calorie-balance calculator, Hebrew + Russian (no backend, inputs stay in the browser) */
(() => {
  'use strict';
  const STORE = 'papafit_calc_v1';
  const WA = '972526425670';
  const form = document.getElementById('calc-form');
  const out = document.getElementById('calc-result');
  const errBox = document.getElementById('calc-error');
  if (!form || !out || !errBox) return;

  const RU = document.documentElement.lang === 'ru';
  const LOCALE = RU ? 'ru-RU' : 'he-IL';
  const r50 = n => Math.round(n / 50) * 50;
  const r5 = n => Math.round(n / 5) * 5;
  const fmt = n => Math.round(n).toLocaleString(LOCALE);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const track = (k, d) => { try { window.papafitTrack && window.papafitTrack(k, d || {}); } catch (e) {} };
  const WA_ICON = document.querySelector('#wa-icon-tpl')?.innerHTML || '';
  const PACE_PCT = { slow: 0.15, mid: 0.2, fast: 0.25 };
  const range = (a, b) => `<bdi dir="ltr">${a}–${b}</bdi>`;

  /* ---------- Texts ---------- */
  const T = RU ? {
    act: { 1.2: 'сидячий образ жизни', 1.375: 'лёгкая активность', 1.55: 'средняя активность', 1.725: 'высокая активность' },
    pace: { slow: 'постепенный', mid: 'рекомендуемый', fast: 'быстрее' },
    errSex: 'Выберите: мужчина или женщина.',
    errAge: 'Возраст: от 16 до 90 лет.',
    errHeight: 'Рост: от 130 до 230 см.',
    errWeight: 'Вес: от 35 до 300 кг.',
    errGoal: 'Целевой вес: от 35 до 300 кг (или оставьте поле пустым).',
    errGoalHigh: 'Целевой вес должен быть меньше текущего. Можно оставить поле пустым.',
    errTitle: 'Проверьте отмеченные поля:',
    weeks: n => `≈ ${n} нед.`,
    months: n => `≈ ${n} мес.`,
    eyebrow: 'Ваши результаты',
    title: 'Ваш калорийный бюджет для снижения веса',
    titleLow: 'Ваш калорийный баланс',
    sTarget: 'Цель в день для снижения', sTargetU: 'ккал в день, в среднем',
    sMaint: 'Поддержание веса', sMaintU: 'ккал в день',
    sProt: 'Белок в день', sProtU: 'г',
    sPace: 'Ожидаемый темп', sPaceU: 'кг в неделю в среднем', sGoal: 'до цели',
    timeNote: 'Срок посчитан по начальному темпу. На практике снижение замедляется по мере того, как вес уменьшается, поэтому обычно это занимает немного больше времени.',
    floored: f => `Расчёт получился ниже ${fmt(f)} ккал, поэтому я поставил цель ${fmt(f)}. Ниже этого трудно получать достаточно белка, витаминов и энергии, и обычно это не держится долго.`,
    lowTitle: 'В вашем случае число «для снижения» не имеет смысла',
    lowBody: (t, f) => [
      `При вашем росте, возрасте и уровне активности организм тратит около ${fmt(t)} ккал в день. Безопасный минимум для питания — около ${fmt(f)} ккал, поэтому места для дефицита за счёт еды почти нет. Урезать ещё сильнее — это голод, потеря мышц и почти гарантированный срыв.`,
      'Хорошая новость: рычаг здесь — не тарелка, а движение и состав тела.'
    ],
    lowActions: [
      'Добавьте 3 000 шагов в день: это примерно 100–150 ккал расхода без ощущения диеты.',
      'Две силовые тренировки в неделю, чтобы сохранить и нарастить мышцы.',
      'Белок в каждом приёме пищи и регулярное питание без «голодных» дней.',
      'Пересчитайте через месяц с более высоким уровнем активности и смотрите на объём талии, а не только на весы.'
    ],
    lowCta: 'Здесь особенно важен индивидуальный подход. Напишите мне, и мы вместе посмотрим, что реально подойдёт именно вам.',
    howTitle: 'Как я получил эти цифры',
    how1: b => `<strong>${fmt(b)} ккал</strong> — столько ваш организм тратит в полном покое, просто чтобы жить (формула Миффлина — Сан Жеора).`,
    how2: (a, n, t) => `<strong>× ${a}</strong> с учётом активности (${esc(n)}) получается <strong>${fmt(t)}</strong>. При таком количестве энергии вес остаётся стабильным.`,
    how3: (d, p, t) => `<strong>Дефицит около ${fmt(d)} ккал в день</strong> (темп: ${esc(p)}) даёт цель <strong>${fmt(t)}</strong>. Такой дефицит позволяет снижать вес без сильного голода и без большой потери мышц.`,
    weekTitle: 'Недельный расчёт: место для пятничного ужина есть',
    weekBody: w => `Ваш недельный бюджет — <strong>${fmt(w)} ккал</strong>. Не обязательно есть одно и то же количество каждый день. Например:`,
    weekRows: ['Воскресенье — четверг', 'Пятница', 'Суббота'],
    weekNote: 'Это арифметический пример. Главное — среднее за неделю, а не отдельный день.',
    plateTitle: 'Как это выглядит на тарелке',
    plate: (a, b) => [
      `<strong>Белок:</strong> примерно ${range(a, b)} г в каждом основном приёме пищи. Например, 150 г куриной грудки, 3 яйца с творогом или банка тунца с йогуртом.`,
      '<strong>Овощи</strong> в каждом приёме пищи: объём и сытость при меньшем количестве калорий.',
      '<strong>Масло, тхина и орехи</strong> — отмеряйте ложкой. Каждая ложка — примерно 90–120 ккал.',
      '<strong>Шаги:</strong> ориентир 7 000–9 000 в день. Это влияет на расход больше, чем кажется.'
    ],
    truthTitle: 'Чего калькулятор не знает',
    truth: [
      'Любая формула — это оценка, и ошибка в 10–15% в любую сторону нормальна. Ваше реальное число становится понятным только через 2–3 недели наблюдения: если средний вес за неделю не снижается, убираем 100–150 ккал. Если снижение слишком быстрое и вы постоянно голодны — добавляем.',
      'А число на бумаге — это лёгкая часть. Сложная — держаться его в неделю с работой, детьми, праздниками и усталыми вечерами. Для этого и нужно сопровождение.'
    ],
    ctaTitle: 'Хотите превратить эти цифры в план?',
    ctaBody: 'На короткой консультации разберём результаты, посмотрим, что подходит под ваш ритм жизни, и наметим первый шаг, с которого можно начать уже на этой неделе.',
    ctaList: ['15 минут по телефону', 'Бесплатно и без обязательств', 'Отвечаю лично'],
    ctaBtn: 'Отправить Алексу результаты',
    ctaNote: 'Сообщение уже написано с вашими цифрами. Осталось нажать «Отправить».',
    tools: [['/ru/weight-loss-guide', 'Полное руководство', '9 принципов снижения веса при работе и детях'], ['share', 'Сохранить результаты', 'Отправить себе в WhatsApp']],
    disclaimer: 'Калькулятор предназначен для здоровых взрослых и даёт только общую оценку. При беременности, грудном вскармливании, заболеваниях, приёме лекарств, влияющих на вес, или расстройствах пищевого поведения в прошлом обязательно проконсультируйтесь с врачом или клиническим диетологом.',
    msg: (d) => `Привет, Алекс! Посчитал(а) калорийный баланс в калькуляторе на сайте:\n${d.sex === 'f' ? 'Женщина' : 'Мужчина'}, ${d.age} лет, ${d.h} см, ${d.w} кг${d.goal ? `, цель ${d.goal} кг` : ''}\nПоддержание: ≈ ${fmt(d.tdee)} ккал${d.low ? '' : ` · для снижения: ≈ ${fmt(d.target)} в день`} · белок ${d.pLo}–${d.pHi} г\nХочу короткую консультацию, чтобы превратить это в план`,
    self: (d) => `Мой калорийный баланс (калькулятор PAPAFIT):\nПоддержание: ${fmt(d.tdee)}${d.low ? '' : ` · снижение: ${fmt(d.target)} в день`} · белок ${d.pLo}–${d.pHi} г\nhttps://papafit.co.il/ru/calorie-calculator`
  } : null;

  const HE = (fem) => {
    const g = (m, f) => (fem ? f : m);
    return {
      act: { 1.2: 'יושבני', 1.375: 'פעילות קלה', 1.55: 'פעילות בינונית', 1.725: 'פעילות גבוהה' },
      pace: { slow: 'הדרגתי', mid: 'מומלץ', fast: 'מהיר יותר' },
      weeks: n => `כ־${n} שבועות`,
      months: n => `כ־${n} חודשים`,
      eyebrow: 'התוצאות שלך',
      title: 'התקציב הקלורי שלך לירידה במשקל',
      titleLow: 'המאזן הקלורי שלך',
      sTarget: 'יעד יומי לירידה', sTargetU: 'קלוריות ביום, בממוצע',
      sMaint: 'שמירה על המשקל', sMaintU: 'קלוריות ביום',
      sProt: 'חלבון ביום', sProtU: 'גרם',
      sPace: 'קצב צפוי', sPaceU: 'ק״ג בשבוע בממוצע', sGoal: 'ליעד',
      timeNote: 'הזמן ליעד מחושב לפי הקצב בתחילת הדרך. בפועל הירידה מאטה ככל שהמשקל יורד, ולכן סביר שזה ייקח קצת יותר.',
      floored: f => `החישוב יצא נמוך מ־${fmt(f)} קלוריות, ולכן הצבתי את היעד על ${fmt(f)}. מתחת לזה קשה לקבל מספיק חלבון, ויטמינים ואנרגיה, ובדרך כלל זה גם לא מחזיק לאורך זמן.`,
      lowTitle: 'במקרה שלך, מספר "לירידה" לא יהיה הגיוני',
      lowBody: (t, f) => [
        `לפי הגובה, הגיל ורמת הפעילות שלך, הגוף שורף בערך ${fmt(t)} קלוריות ביום. המינימום הבטוח לתזונה הוא בערך ${fmt(f)}, כך שכמעט אין מקום ליצור גירעון דרך האוכל. לקצץ עוד פירושו רעב, איבוד שריר ושבירה כמעט בטוחה.`,
        'החדשות הטובות: אצלך המנוף הוא לא הצלחת, אלא התנועה והרכב הגוף.'
      ],
      lowActions: [
        'להוסיף 3,000 צעדים ביום. זה בערך 100 עד 150 קלוריות של הוצאה, בלי להרגיש בדיאטה.',
        'שני אימוני כוח בשבוע, כדי לשמור על השריר ולבנות אותו.',
        'חלבון בכל ארוחה ואכילה מסודרת, בלי ימים של "לא לאכול".',
        `לחשב מחדש בעוד חודש עם רמת פעילות גבוהה יותר, ו${g('למדוד', 'למדוד')} היקף מותניים ולא רק משקל.`
      ],
      lowCta: `במצב כזה התאמה אישית חשובה במיוחד. ${g('כתוב', 'כתבי')} לי ונבדוק יחד מה באמת יעבוד אצלך.`,
      howTitle: 'איך הגעתי למספרים',
      how1: b => `<strong>${fmt(b)} קלוריות</strong> זה מה שהגוף שלך שורף במנוחה מלאה, רק כדי לחיות (חישוב לפי נוסחת Mifflin-St Jeor).`,
      how2: (a, n, t) => `<strong>× ${a}</strong> לפי רמת הפעילות (${esc(n)}) מגיעים ל־<strong>${fmt(t)}</strong>. זו כמות האנרגיה שבה המשקל שלך נשאר יציב.`,
      how3: (d, p, t) => `<strong>גירעון של כ־${fmt(d)} קלוריות ביום</strong> (קצב ${esc(p)}) נותן יעד של <strong>${fmt(t)}</strong>. גירעון כזה מאפשר לרדת בלי רעב קיצוני ובלי לאבד הרבה שריר.`,
      weekTitle: 'החשבון השבועי: יש מקום לארוחת שישי',
      weekBody: w => `התקציב השבועי שלך הוא <strong>${fmt(w)} קלוריות</strong>. לא חייבים לאכול בדיוק אותו מספר כל יום. לדוגמה:`,
      weekRows: ['ראשון עד חמישי', 'שישי', 'שבת'],
      weekNote: 'זו המחשה חשבונית. העיקר הוא הממוצע לאורך השבוע, לא יום בודד.',
      plateTitle: 'איך זה נראה בצלחת',
      plate: (a, b) => [
        `<strong>חלבון:</strong> בערך ${range(a, b)} גרם בכל ארוחה מרכזית. למשל 150 גרם חזה עוף, 3 ביצים עם קוטג׳, או פחית טונה עם יוגורט.`,
        '<strong>ירקות</strong> בכל ארוחה, כדי לקבל נפח ושובע בפחות קלוריות.',
        '<strong>שמן, טחינה ואגוזים</strong> נמדדים בכף. כל כף היא בערך 90 עד 120 קלוריות.',
        `<strong>צעדים:</strong> ${g('כוון', 'כווני')} ל־7,000 עד 9,000 ביום. זה משפיע על ההוצאה היומית יותר ממה שנדמה.`
      ],
      truthTitle: 'מה המחשבון לא יודע',
      truth: [
        `כל נוסחה היא הערכה, וטעות של 10% עד 15% לכל כיוון היא נורמלית. המספר האמיתי שלך מתגלה רק אחרי שבועיים־שלושה של מעקב: אם הממוצע השבועי של המשקל לא יורד, מורידים 100 עד 150 קלוריות. אם יורדים מהר מדי ו${g('אתה רעב', 'את רעבה')} כל הזמן, מוסיפים.`,
        'ומספר על הנייר זה החלק הקל. החלק הקשה הוא לעמוד בו בשבוע עם עבודה, ילדים, אירועים וערבים עייפים. בשביל זה יש ליווי.'
      ],
      ctaTitle: 'רוצה שנהפוך את המספרים האלה לתוכנית?',
      ctaBody: 'בשיחת ייעוץ קצרה נעבור על התוצאות, נבדוק מה מתאים לשגרה שלך, ונבנה צעד ראשון שאפשר להתחיל ממנו כבר השבוע.',
      ctaList: ['15 דקות בטלפון', 'ללא עלות וללא התחייבות', 'אני עונה אישית'],
      ctaBtn: 'לשלוח לאלכס את התוצאות',
      ctaNote: 'ההודעה כבר כתובה עם המספרים שלך. רק ללחוץ ״שליחה״.',
      tools: [['/weight-loss-quiz', `למה ${g('אני לא מצליח', 'אני לא מצליחה')} לרדת?`, 'שאלון של 3 דקות שמגלה מה עוצר אותך'], ['share', 'לשמור את התוצאות', 'שליחה לעצמך בוואטסאפ'], ['/weight-loss-guide', 'המדריך המלא', '9 עקרונות לירידה במשקל עם עבודה וילדים']],
      disclaimer: 'המחשבון מיועד למבוגרים בריאים ונותן הערכה כללית בלבד. בהיריון, בהנקה, במצב רפואי, עם תרופות שמשפיעות על המשקל או עם היסטוריה של הפרעת אכילה, חשוב להתייעץ עם רופא או דיאטנית קלינית.',
      msg: (d) => `היי אלכס, חישבתי את המאזן הקלורי במחשבון באתר:\n${g('גבר', 'אישה')}, גיל ${d.age}, ${d.h} ס״מ, ${d.w} ק״ג${d.goal ? `, יעד ${d.goal} ק״ג` : ''}\nשמירה: כ־${fmt(d.tdee)} קלוריות${d.low ? '' : ` · יעד לירידה: כ־${fmt(d.target)} ביום`} · חלבון ${d.pLo}–${d.pHi} גרם\nאשמח לשיחת ייעוץ קצרה כדי להפוך את זה לתוכנית`,
      self: (d) => `המאזן הקלורי שלי (מחשבון PAPAFIT):\nשמירה: ${fmt(d.tdee)}${d.low ? '' : ` · ירידה: ${fmt(d.target)} ביום`} · חלבון ${d.pLo}–${d.pHi} גרם\nhttps://papafit.co.il/calorie-calculator`
    };
  };
  const ERR_HE = {
    errSex: 'לבחור גבר או אישה.',
    errAge: 'גיל: בין 16 ל־90.',
    errHeight: 'גובה: בין 130 ל־230 ס״מ.',
    errWeight: 'משקל: בין 35 ל־300 ק״ג.',
    errGoal: 'משקל יעד: בין 35 ל־300 ק״ג (או להשאיר ריק).',
    errGoalHigh: 'משקל היעד צריך להיות נמוך מהמשקל הנוכחי. אפשר גם להשאיר את השדה ריק.',
    errTitle: 'כדאי לבדוק את השדות המסומנים:'
  };
  const E = RU ? T : ERR_HE;

  /* ---------- Restore last inputs ---------- */
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved) for (const [k, v] of Object.entries(saved)) {
      const els = form.elements[k];
      if (!els || v === undefined || v === null) continue;
      if (els instanceof RadioNodeList) { for (const el of els) el.checked = el.value === String(v); } else els.value = v;
    }
  } catch (e) {}

  /* ---------- Validation helpers ---------- */
  const sexSet = form.querySelector('[data-field="sex"]');
  function markSex(bad) {
    if (!sexSet) return;
    sexSet.classList.toggle('is-invalid', bad);
    let msg = sexSet.querySelector('.calc-inline-err');
    if (bad && !msg) { msg = document.createElement('p'); msg.className = 'calc-inline-err'; msg.id = 'calc-sex-err'; msg.textContent = E.errSex; sexSet.append(msg); }
    if (msg) msg.hidden = !bad;
    if (bad) sexSet.setAttribute('aria-describedby', 'calc-sex-err'); else sexSet.removeAttribute('aria-describedby');
    for (const r of form.querySelectorAll('input[name="sex"]')) r.setAttribute('aria-invalid', bad ? 'true' : 'false');
  }
  function num(name, min, max) {
    const el = form.elements[name];
    const v = parseFloat(String(el.value).replace(',', '.'));
    const ok = !isNaN(v) && v >= min && v <= max;
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok ? v : null;
  }
  function fail(list, focusEl) {
    out.hidden = true;
    out.innerHTML = '';
    errBox.innerHTML = list.length > 1
      ? `<strong>${esc(E.errTitle)}</strong><ul>${list.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`
      : esc(list[0]);
    errBox.hidden = false;
    (focusEl || form.querySelector('[aria-invalid="true"]'))?.focus();
  }
  form.addEventListener('input', e => {
    if (e.target.name === 'sex') markSex(false);
    else if (e.target.getAttribute('aria-invalid') === 'true') e.target.setAttribute('aria-invalid', 'false');
  });
  form.addEventListener('change', e => { if (e.target.name === 'sex') markSex(false); });

  /* ---------- Submit ---------- */
  form.addEventListener('submit', e => {
    e.preventDefault();
    const sex = form.elements.sex.value;
    const age = num('age', 16, 90), h = num('height', 130, 230), w = num('weight', 35, 300);
    const gRaw = String(form.elements.goal.value).trim();
    const goal = gRaw ? num('goal', 35, 300) : null;
    if (!gRaw) form.elements.goal.setAttribute('aria-invalid', 'false');
    const act = parseFloat(form.elements.activity.value) || 1.375;
    const pace = form.elements.pace.value || 'mid';

    const errs = [];
    markSex(!sex);
    if (!sex) errs.push(E.errSex);
    if (!age) errs.push(E.errAge);
    if (!h) errs.push(E.errHeight);
    if (!w) errs.push(E.errWeight);
    if (gRaw && !goal) errs.push(E.errGoal);
    if (errs.length) return fail(errs, !sex ? form.querySelector('input[name="sex"]') : null);
    if (goal && goal >= w) {
      form.elements.goal.setAttribute('aria-invalid', 'true');
      return fail([E.errGoalHigh], form.elements.goal);
    }
    errBox.hidden = true;
    try { localStorage.setItem(STORE, JSON.stringify({ sex, age, height: h, weight: w, goal: gRaw, activity: String(act), pace })); } catch (e) {}

    const fem = sex === 'f';
    const L = RU ? T : HE(fem);
    const bmr = 10 * w + 6.25 * h - 5 * age + (fem ? -161 : 5);
    const tdee = bmr * act;
    const tdeeR = r50(tdee);
    const floor = fem ? 1200 : 1500;
    // If the gap between maintenance and the safe minimum is under ~200 kcal there is no sensible "lose" number.
    const low = tdee - floor < 200;
    let deficit = Math.min(tdee * PACE_PCT[pace], 11 * w); // max ~1% of body weight per week
    const target = low ? tdeeR : r50(Math.max(floor, tdee - deficit));
    const floored = !low && tdee - deficit < floor;
    const realDef = Math.max(0, tdee - target);
    const perWeek = (realDef * 7) / 7700;
    const bmi = w / Math.pow(h / 100, 2);
    const ref = goal || (bmi > 30 ? 27 * Math.pow(h / 100, 2) : w);
    const pLo = r5(ref * 1.6), pHi = r5(ref * 2.0);

    let timeline = '';
    if (!low && goal && perWeek > 0.05) {
      const weeks = (w - goal) / perWeek;
      timeline = weeks <= 10 ? L.weeks(Math.max(1, Math.round(weeks))) : L.months(Math.round(weeks / 4.35));
    }
    const data = { sex, age, h, w, goal, tdee: tdeeR, target, pLo, pHi, low };
    const waHref = `https://wa.me/${WA}?text=${encodeURIComponent(L.msg(data))}`;
    const selfHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(L.self(data))}`;

    const stats = low
      ? `<div class="calc-stat is-main"><span>${L.sMaint}</span><strong>${fmt(tdeeR)}</strong><small>${L.sMaintU}</small></div>
         <div class="calc-stat calc-stat-wide"><span>${L.sProt}</span><strong>${range(pLo, pHi)}</strong><small>${L.sProtU}</small></div>`
      : `<div class="calc-stat is-main"><span>${L.sTarget}</span><strong>${fmt(target)}</strong><small>${L.sTargetU}</small></div>
         <div class="calc-stat"><span>${L.sMaint}</span><strong>${fmt(tdeeR)}</strong><small>${L.sMaintU}</small></div>
         <div class="calc-stat"><span>${L.sProt}</span><strong>${range(pLo, pHi)}</strong><small>${L.sProtU}</small></div>
         <div class="calc-stat"><span>${L.sPace}</span><strong>${perWeek.toFixed(1).replace('.', RU ? ',' : '.')}</strong><small>${L.sPaceU}${timeline ? ` · ${L.sGoal}: ${timeline}` : ''}</small></div>`;

    const weekly = target * 7;
    const weekday = r50((weekly - 900) / 7);
    const fri = weekday + 600, sat = weekly - weekday * 5 - fri;

    const lowBlock = `<section class="calc-block calc-truth">
        <h3>${esc(L.lowTitle)}</h3>
        ${L.lowBody(tdeeR, floor).map(p => `<p>${esc(p)}</p>`).join('')}
        <ul class="calc-tips">${L.lowActions.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
        <p><strong>${esc(L.lowCta)}</strong></p>
      </section>`;

    const normalBlocks = `
      <section class="calc-block">
        <h3>${L.howTitle}</h3>
        <ol class="calc-steps"><li>${L.how1(bmr)}</li><li>${L.how2(act, L.act[act], tdeeR)}</li><li>${L.how3(r50(realDef), L.pace[pace], target)}</li></ol>
      </section>
      <section class="calc-block">
        <h3>${L.weekTitle}</h3>
        <p>${L.weekBody(weekly)}</p>
        <div class="calc-week" role="table">
          <div role="row"><span role="cell">${L.weekRows[0]}</span><strong role="cell">${fmt(weekday)}</strong></div>
          <div role="row" class="is-fri"><span role="cell">${L.weekRows[1]}</span><strong role="cell">${fmt(fri)}</strong></div>
          <div role="row"><span role="cell">${L.weekRows[2]}</span><strong role="cell">${fmt(sat)}</strong></div>
        </div>
        <p class="sub">${L.weekNote}</p>
      </section>`;

    const tools = L.tools.map(([href, a, b]) => href === 'share'
      ? `<a class="result-tool" data-cta="calc_share_self" href="${selfHref}" target="_blank" rel="noopener noreferrer"><strong>${esc(a)}</strong><span>${esc(b)}</span></a>`
      : `<a class="result-tool" href="${href}"><strong>${esc(a)}</strong><span>${esc(b)}</span></a>`).join('');

    out.innerHTML = `
      <header class="calc-head"><p class="eyebrow">${L.eyebrow}</p><h2>${low ? L.titleLow : L.title}</h2></header>
      <div class="calc-big">${stats}</div>
      ${timeline ? `<p class="calc-note">${esc(L.timeNote)}</p>` : ''}
      ${floored ? `<p class="calc-warn">${esc(L.floored(floor))}</p>` : ''}
      ${low ? lowBlock : normalBlocks}
      <section class="calc-block">
        <h3>${L.plateTitle}</h3>
        <ul class="calc-tips">${L.plate(r5(pLo / 4), r5(pHi / 3.5)).map(x => `<li>${x}</li>`).join('')}</ul>
      </section>
      ${low ? '' : `<section class="calc-block calc-truth"><h3>${L.truthTitle}</h3>${L.truth.map(p => `<p>${esc(p)}</p>`).join('')}</section>`}
      <section class="pf-cta-card calc-cta" aria-labelledby="calc-cta-title">
        <p class="pf-cta-eyebrow">PAPAFIT</p>
        <h2 id="calc-cta-title">${esc(L.ctaTitle)}</h2>
        <p>${esc(L.ctaBody)}</p>
        <ul>${L.ctaList.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <a class="button" data-cta="calc_result" href="${waHref}" target="_blank" rel="noopener noreferrer">${WA_ICON}${esc(L.ctaBtn)}</a>
        <p class="result-cta-note">${esc(L.ctaNote)}</p>
      </section>
      <div class="result-tools-grid">${tools}</div>
      <p class="result-disclaimer">${esc(L.disclaimer)}</p>`;
    out.hidden = false;
    const hd = out.querySelector('h2');
    hd.setAttribute('tabindex', '-1');
    hd.focus({ preventScroll: true });
    out.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    track('calculator_complete', { calc_pace: pace, calc_activity: String(act), calc_low_gap: low ? 'yes' : 'no' });
  });
})();
