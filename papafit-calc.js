/* PAPAFIT calorie-balance calculator (no backend, inputs stay in the browser) */
(() => {
  'use strict';
  const STORE = 'papafit_calc_v1';
  const WA = '972526425670';
  const form = document.getElementById('calc-form');
  const out = document.getElementById('calc-result');
  if (!form || !out) return;

  const ACT = { 1.2: 'יושבני', 1.375: 'פעילות קלה', 1.55: 'פעילות בינונית', 1.725: 'פעילות גבוהה' };
  const PACE = { slow: [0.15, 'הדרגתי'], mid: [0.2, 'מומלץ'], fast: [0.25, 'מהיר יותר'] };
  const r50 = n => Math.round(n / 50) * 50;
  const r5 = n => Math.round(n / 5) * 5;
  const fmt = n => Math.round(n).toLocaleString('he-IL');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const track = (k, d) => { try { window.papafitTrack && window.papafitTrack(k, d || {}); } catch (e) {} };
  const WA_ICON = document.querySelector('#wa-icon-tpl')?.innerHTML || '';

  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved) for (const [k, v] of Object.entries(saved)) {
      const els = form.elements[k];
      if (!els) continue;
      if (els instanceof RadioNodeList) { for (const el of els) el.checked = el.value === v; } else els.value = v;
    }
  } catch (e) {}

  function num(name, min, max) {
    const el = form.elements[name];
    const v = parseFloat(String(el.value).replace(',', '.'));
    const ok = !isNaN(v) && v >= min && v <= max;
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok ? v : null;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const sex = form.elements.sex.value;
    const age = num('age', 16, 90), h = num('height', 130, 230), w = num('weight', 35, 300);
    const gRaw = String(form.elements.goal.value).trim();
    let goal = gRaw ? num('goal', 35, 300) : null;
    if (gRaw === '') form.elements.goal.setAttribute('aria-invalid', 'false');
    const act = parseFloat(form.elements.activity.value);
    const pace = form.elements.pace.value;
    const err = document.getElementById('calc-error');
    if (!sex || !age || !h || !w || !act || !pace || (gRaw && !goal)) {
      err.textContent = 'כדאי לבדוק את השדות המסומנים: גיל 16 עד 90, גובה בס״מ ומשקל בק״ג.';
      err.hidden = false;
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    if (goal && goal >= w) {
      err.textContent = 'משקל היעד צריך להיות נמוך מהמשקל הנוכחי. אפשר גם להשאיר את השדה ריק.';
      err.hidden = false;
      form.elements.goal.setAttribute('aria-invalid', 'true');
      form.elements.goal.focus();
      return;
    }
    err.hidden = true;
    try { localStorage.setItem(STORE, JSON.stringify({ sex, age, height: h, weight: w, goal: gRaw, activity: String(act), pace })); } catch (e) {}

    const fem = sex === 'f';
    const g = (m, f) => (fem ? f : m);
    const bmr = 10 * w + 6.25 * h - 5 * age + (fem ? -161 : 5);
    const tdee = bmr * act;
    const floor = fem ? 1200 : 1500;
    let deficit = tdee * PACE[pace][0];
    deficit = Math.min(deficit, 11 * w); // no more than ~1% of body weight per week
    let target = r50(Math.max(floor, tdee - deficit));
    const floored = target === r50(floor) && tdee - deficit < floor;
    const realDef = Math.max(0, tdee - target);
    const perWeek = (realDef * 7) / 7700;
    const bmi = w / Math.pow(h / 100, 2);
    const ref = goal || (bmi > 30 ? 27 * Math.pow(h / 100, 2) : w);
    const pLo = r5(ref * 1.6), pHi = r5(ref * 2.0);
    const weekly = target * 7;
    const weekday = r50((weekly - 900) / 7);
    const fri = weekday + 600, sat = weekly - weekday * 5 - fri;
    let timeline = '';
    if (goal && perWeek > 0.05) {
      const weeks = ((w - goal) / perWeek) * 1.15;
      const months = weeks / 4.35;
      timeline = months < 1.5 ? `כ־${Math.max(2, Math.round(weeks))} שבועות` : `כ־${Math.round(months)} חודשים`;
    }

    const msg = `היי אלכס, חישבתי את המאזן הקלורי במחשבון באתר:\n` +
      `${g('גבר', 'אישה')}, גיל ${age}, ${h} ס״מ, ${w} ק״ג${goal ? `, יעד ${goal} ק״ג` : ''}\n` +
      `שמירה: כ־${fmt(r50(tdee))} קלוריות · יעד לירידה: כ־${fmt(target)} ביום · חלבון ${pLo}–${pHi} גרם\n` +
      `אשמח לשיחת ייעוץ קצרה כדי להפוך את זה לתוכנית`;
    const self = `המאזן הקלורי שלי (מחשבון PAPAFIT):\nשמירה: ${fmt(r50(tdee))} · ירידה: ${fmt(target)} ביום · חלבון ${pLo}–${pHi} גרם\nhttps://papafit.co.il/calorie-calculator`;

    out.innerHTML = `
      <header class="calc-head"><p class="eyebrow">התוצאות שלך</p><h2>התקציב הקלורי שלך לירידה במשקל</h2></header>
      <div class="calc-big">
        <div class="calc-stat is-main"><span>יעד יומי לירידה</span><strong>${fmt(target)}</strong><small>קלוריות ביום, בממוצע</small></div>
        <div class="calc-stat"><span>שמירה על המשקל</span><strong>${fmt(r50(tdee))}</strong><small>קלוריות ביום</small></div>
        <div class="calc-stat"><span>חלבון ביום</span><strong><bdi dir="ltr">${pLo}–${pHi}</bdi></strong><small>גרם</small></div>
        <div class="calc-stat"><span>קצב צפוי</span><strong>${perWeek.toFixed(1)}</strong><small>ק״ג בשבוע בממוצע${timeline ? ` · ליעד: ${timeline}` : ''}</small></div>
      </div>
      ${floored ? `<p class="calc-warn">החישוב יצא נמוך מ־${fmt(floor)} קלוריות, ולכן הצבתי את היעד על ${fmt(floor)}. מתחת לזה קשה לקבל מספיק חלבון, ויטמינים ואנרגיה, ובדרך כלל זה גם לא מחזיק לאורך זמן.</p>` : ''}

      <section class="calc-block">
        <h3>איך הגעתי למספרים</h3>
        <ol class="calc-steps">
          <li><strong>${fmt(bmr)} קלוריות</strong> זה מה שהגוף שלך שורף במנוחה מלאה, רק כדי לחיות (חישוב לפי נוסחת Mifflin-St Jeor).</li>
          <li><strong>× ${act}</strong> לפי רמת הפעילות (${esc(ACT[act])}) מגיעים ל־<strong>${fmt(r50(tdee))}</strong>. זו כמות האנרגיה שבה המשקל שלך נשאר יציב.</li>
          <li><strong>גירעון של כ־${fmt(r50(realDef))} קלוריות ביום</strong> (קצב ${esc(PACE[pace][1])}) נותן יעד של <strong>${fmt(target)}</strong>. גירעון כזה מאפשר לרדת בלי רעב קיצוני ובלי לאבד הרבה שריר.</li>
        </ol>
      </section>

      <section class="calc-block">
        <h3>החשבון השבועי: יש מקום לארוחת שישי</h3>
        <p>התקציב השבועי שלך הוא <strong>${fmt(weekly)} קלוריות</strong>. לא חייבים לאכול בדיוק אותו מספר כל יום. לדוגמה:</p>
        <div class="calc-week" role="table" aria-label="דוגמה לחלוקה שבועית">
          <div role="row"><span role="cell">ראשון עד חמישי</span><strong role="cell">${fmt(weekday)}</strong></div>
          <div role="row" class="is-fri"><span role="cell">שישי</span><strong role="cell">${fmt(fri)}</strong></div>
          <div role="row"><span role="cell">שבת</span><strong role="cell">${fmt(sat)}</strong></div>
        </div>
        <p class="sub">זו המחשה חשבונית. העיקר הוא הממוצע לאורך השבוע, לא יום בודד.</p>
      </section>

      <section class="calc-block">
        <h3>איך זה נראה בצלחת</h3>
        <ul class="calc-tips">
          <li><strong>חלבון:</strong> בערך ${r5(pLo / 4)} עד ${r5(pHi / 3.5)} גרם בכל ארוחה מרכזית. למשל 150 גרם חזה עוף, 3 ביצים עם קוטג׳, או פחית טונה עם יוגורט.</li>
          <li><strong>ירקות</strong> בכל ארוחה, כדי לקבל נפח ושובע בפחות קלוריות.</li>
          <li><strong>שמן, טחינה ואגוזים</strong> נמדדים בכף. כל כף היא בערך 90 עד 120 קלוריות.</li>
          <li><strong>צעדים:</strong> ${g('כוון', 'כווני')} ל־7,000 עד 9,000 ביום. זה משפיע על ההוצאה היומית יותר ממה שנדמה.</li>
        </ul>
      </section>

      <section class="calc-block calc-truth">
        <h3>מה המחשבון לא יודע</h3>
        <p>כל נוסחה היא הערכה, וטעות של 10% עד 15% לכל כיוון היא נורמלית. המספר האמיתי שלך מתגלה רק אחרי שבועיים־שלושה של מעקב: אם הממוצע השבועי של המשקל לא יורד, מורידים 100 עד 150 קלוריות. אם יורדים מהר מדי ו${g('אתה רעב', 'את רעבה')} כל הזמן, מוסיפים.</p>
        <p>ומספר על הנייר זה החלק הקל. החלק הקשה הוא לעמוד בו בשבוע עם עבודה, ילדים, אירועים וערבים עייפים. בשביל זה יש ליווי.</p>
      </section>

      <section class="callout calc-cta" aria-labelledby="calc-cta-title">
        <h2 id="calc-cta-title">${g('רוצה', 'רוצה')} שנהפוך את המספרים האלה לתוכנית?</h2>
        <p>בשיחת ייעוץ קצרה נעבור על התוצאות, נבדוק מה מתאים לשגרה שלך, ונבנה צעד ראשון שאפשר להתחיל ממנו כבר השבוע.</p>
        <ul><li>15 דקות בטלפון</li><li>ללא עלות וללא התחייבות</li><li>אני עונה אישית</li></ul>
        <a class="button" data-cta="calc_result" href="https://wa.me/${WA}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener noreferrer">${WA_ICON}לשלוח לאלכס את התוצאות</a>
        <p class="result-cta-note">ההודעה כבר כתובה עם המספרים שלך. רק ללחוץ ״שליחה״.</p>
      </section>

      <div class="result-tools-grid">
        <a class="result-tool" href="/weight-loss-quiz"><strong>למה ${g('אני לא מצליח', 'אני לא מצליחה')} לרדת?</strong><span>שאלון של 3 דקות שמגלה מה עוצר אותך</span></a>
        <a class="result-tool" data-cta="calc_share_self" href="https://api.whatsapp.com/send?text=${encodeURIComponent(self)}" target="_blank" rel="noopener noreferrer"><strong>לשמור את התוצאות</strong><span>שליחה לעצמך בוואטסאפ</span></a>
        <a class="result-tool" href="/weight-loss-guide"><strong>המדריך המלא</strong><span>9 עקרונות לירידה במשקל עם עבודה וילדים</span></a>
      </div>
      <p class="result-disclaimer">המחשבון מיועד למבוגרים בריאים ונותן הערכה כללית בלבד. בהיריון, בהנקה, במצב רפואי, עם תרופות שמשפיעות על המשקל או עם היסטוריה של הפרעת אכילה, חשוב להתייעץ עם רופא או דיאטנית קלינית.</p>`;
    out.hidden = false;
    const hd = out.querySelector('h2');
    hd.setAttribute('tabindex', '-1');
    hd.focus({ preventScroll: true });
    out.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    track('calculator_complete', { calc_pace: pace, calc_activity: String(act) });
  });
})();
