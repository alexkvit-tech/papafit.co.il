/* PAPAFIT strength-program builder (no backend, answers stay in the browser)
 * Volume logic follows the PAPAFIT summary of Tal Ben Moshe's article and the 2024-2025
 * meta-analyses on weekly and per-session volume: start low, fractional set counting
 * (secondary muscle = half a set), ~10 sets per muscle per session as an upper guide,
 * add 2-4 weekly sets only when progress stalls and everything else is in order. */
(() => {
  'use strict';
  const STORE = 'papafit_strength_v2';
  const WA = '972526425670';
  const PAGE_URL = 'https://papafit.co.il/strength-program';

  /* ---------- Questions ---------- */
  const Q = [
    { id: 'gender', q: 'נתחיל. מי בונה את התוכנית?', hint: 'כדי שאוכל לפנות אליך נכון.', opts: [{ t: 'גבר', v: 'm' }, { t: 'אישה', v: 'f' }] },
    { id: 'goal', q: 'מה המטרה העיקרית שלך?', opts: [
      { t: 'לרדת במשקל ולשמור על השריר', v: 'fat' },
      { t: 'לבנות שריר ולשפר את הרכב הגוף', v: 'muscle' },
      { t: 'להיות חזק{|ה} יותר', v: 'strength' },
      { t: 'בריאות, תנועה והרגשה טובה', v: 'health' }] },
    { id: 'place', q: 'איפה {תתאמן|תתאמני}?', opts: [
      { t: 'בחדר כושר', v: 'gym' },
      { t: 'בבית, עם משקולות או גומיות', v: 'home' },
      { t: 'בבית, בלי ציוד', v: 'bw' }] },
    { id: 'exp', q: 'כמה ניסיון יש לך באימוני כוח?', opts: [
      { t: 'אין ניסיון, או שאני חוזר{|ת} אחרי הפסקה ארוכה', v: 'beg' },
      { t: 'פחות משנה של אימונים קבועים', v: 'beg' },
      { t: 'שנה עד שלוש של אימונים קבועים', v: 'int' },
      { t: 'יותר משלוש שנים, ואני מכיר{|ה} היטב את התרגילים', v: 'adv' }] },
    { id: 'days', q: 'כמה אימונים בשבוע {אתה יכול|את יכולה} להתחייב אליהם באמת, גם בשבוע עמוס?', hint: 'לרוב האנשים העסוקים, 2–3 אימוני כל הגוף הם הפתרון הכי מעשי.', opts: [
      { t: 'פעמיים בשבוע', v: 2 }, { t: '3 פעמים בשבוע', v: 3 }, { t: '4 פעמים בשבוע', v: 4 }, { t: '5 פעמים בשבוע', v: 5 }] },
    { id: 'time', q: 'כמה זמן יש לך לכל אימון?', opts: [
      { t: 'עד 30 דקות', v: 30 }, { t: 'כ־45 דקות', v: 45 }, { t: 'כשעה', v: 60 }, { t: 'יותר משעה', v: 75 }] },
    { id: 'focus', q: 'יש קבוצת שרירים שחשוב לך לחזק במיוחד?', hint: 'אפשר לתת עדיפות לקבוצה אחת בלי להגדיל את הנפח של כל הגוף.', opts: [
      { t: 'אין העדפה, הכול באיזון', v: 'none' }, { t: 'חזה', v: 'chest' }, { t: 'גב', v: 'back' }, { t: 'כתפיים', v: 'shoulders' }, { t: 'ישבן ורגליים', v: 'legs' }, { t: 'ידיים', v: 'arms' }] },
    { id: 'limits', multi: true, q: 'יש משהו שכדאי להתחשב בו?', hint: 'אפשר לבחור כמה תשובות. אם יש כאב חד או פציעה, קודם לבדוק עם רופא או פיזיותרפיסט.', opts: [
      { t: 'ברכיים רגישות', v: 'knees' }, { t: 'גב תחתון רגיש', v: 'back' }, { t: 'כתפיים רגישות', v: 'shoulders' }, { t: 'אין מגבלה', v: 'none', only: true }] }
  ];

  /* ---------- Exercise library: [variant A, variant B] ---------- */
  const LIB = {
    gym: {
      squat: ['סקוואט עם מוט', 'לחיצת רגליים במכונה'],
      hinge: ['דדליפט רומני עם מוט', 'דדליפט רומני עם משקולות'],
      hpush: ['לחיצת חזה עם מוט', 'לחיצת חזה בשיפוע חיובי עם משקולות'],
      hpull: ['חתירה בכבל בישיבה', 'חתירה עם משקולת ביד אחת'],
      vpush: ['לחיצת כתפיים עם משקולות בישיבה', 'לחיצת כתפיים במכונה'],
      vpull: ['פולי עליון', 'מתח (או מתח בעזרת מכונה)'],
      lunge: ['מכרעים בהליכה עם משקולות', 'ספליט סקוואט בולגרי'],
      glute: ['היפ תראסט עם מוט', 'גשר ישבן במכונה'],
      hamcurl: ['כפיפת ברכיים במכונה בשכיבה', 'כפיפת ברכיים במכונה בישיבה'],
      lat: ['הרחקת כתפיים עם משקולות', 'הרחקת כתפיים בכבל'],
      rear: ['פרפר הפוך במכונה', 'פייס פול בכבל'],
      bi: ['כפיפת מרפקים עם משקולות', 'כפיפת מרפקים בכבל'],
      tri: ['פשיטת מרפקים בכבל', 'פשיטת מרפקים מעל הראש עם משקולת'],
      calves: ['הרמות עקבים בעמידה במכונה'],
      core: ['פלאנק', 'הרמות ברכיים בתלייה']
    },
    home: {
      squat: ['גובלט סקוואט עם משקולת', 'סקוואט עם משקולות בידיים'],
      hinge: ['דדליפט רומני עם משקולות', 'דדליפט רומני על רגל אחת'],
      hpush: ['לחיצת חזה עם משקולות על ספסל או רצפה', 'שכיבות סמיכה'],
      hpull: ['חתירה עם משקולת ביד אחת', 'חתירה בהטיה עם שתי משקולות'],
      vpush: ['לחיצת כתפיים עם משקולות בעמידה', 'לחיצת כתפיים ביד אחת'],
      vpull: ['משיכת גומייה למטה (כמו פולי עליון)', 'פולאובר עם משקולת'],
      lunge: ['מכרעים לאחור עם משקולות', 'ספליט סקוואט בולגרי עם משקולות'],
      glute: ['גשר ישבן עם משקולת', 'היפ תראסט עם גב על הספה'],
      hamcurl: ['כפיפת ברכיים עם גומייה', 'גשר ישבן על רגל אחת'],
      lat: ['הרחקת כתפיים עם משקולות', 'הרחקת כתפיים עם גומייה'],
      rear: ['פרפר הפוך בהטיה עם משקולות', 'משיכת גומייה לפנים (פייס פול)'],
      bi: ['כפיפת מרפקים עם משקולות', 'כפיפת פטישים'],
      tri: ['פשיטת מרפקים מעל הראש עם משקולת', 'דיפס על כיסא'],
      calves: ['הרמות עקבים על מדרגה', 'הרמות עקבים על רגל אחת'],
      core: ['פלאנק', 'דד באג']
    },
    bw: {
      squat: ['סקוואט במשקל גוף עם ירידה איטית', 'סקוואט עם עצירה של 2 שניות למטה'],
      hinge: ['גשר ישבן על רגל אחת', 'דדליפט רומני על רגל אחת'],
      hpush: ['שכיבות סמיכה (או בשיפוע על שולחן)', 'שכיבות סמיכה עם ירידה איטית'],
      hpull: ['חתירה הפוכה מתחת לשולחן יציב', 'חתירה עם מגבת קשורה לידית דלת'],
      vpush: ['שכיבות סמיכה פייק (ישבן למעלה)', 'שכיבות סמיכה פייק עם רגליים על כיסא'],
      vpull: ['משיכת מגבת למטה מול דלת סגורה', 'מתח (אם יש מוט בבית)'],
      lunge: ['מכרעים לאחור', 'ספליט סקוואט בולגרי עם רגל על כיסא'],
      glute: ['גשר ישבן', 'גשר ישבן עם רגליים על הספה'],
      hamcurl: ['כפיפת ברכיים עם מגבת על רצפה חלקה', 'גשר ישבן על רגל אחת'],
      lat: ['הרחקת כתפיים עם בקבוקי מים', 'סופרמן עם ידיים בצורת Y'],
      rear: ['סופרמן עם ידיים בצורת T', 'משיכת מגבת לפנים'],
      bi: ['כפיפת מרפקים עם תיק גב טעון', 'כפיפת מרפקים עם מגבת ונגד רגל'],
      tri: ['דיפס על כיסא', 'שכיבות סמיכה צרות'],
      calves: ['הרמות עקבים על מדרגה', 'הרמות עקבים על רגל אחת'],
      core: ['פלאנק', 'דד באג']
    }
  };
  // Simpler first variant for beginners in the gym
  const BEG_GYM = { squat: 'גובלט סקוואט עם משקולת', hinge: 'דדליפט רומני עם משקולות', hpush: 'לחיצת חזה במכונה', vpush: 'לחיצת כתפיים במכונה', glute: 'גשר ישבן במכונה' };
  // Swaps for sensitive joints
  const LIMIT = {
    knees: { gym: { squat: 'לחיצת רגליים בטווח נוח', lunge: 'היפ תראסט' }, home: { squat: 'סקוואט לכיסא עם משקולת, בטווח נוח', lunge: 'גשר ישבן עם משקולת' }, bw: { squat: 'סקוואט לכיסא, בטווח נוח', lunge: 'גשר ישבן' } },
    back: { gym: { hinge: 'היפ תראסט במכונה', squat: 'לחיצת רגליים' }, home: { hinge: 'גשר ישבן עם משקולת', squat: 'גובלט סקוואט עם משקולת' }, bw: { hinge: 'גשר ישבן', squat: 'סקוואט לכיסא' } },
    shoulders: { gym: { vpush: 'הרחקת כתפיים קלה בטווח נוח', hpush: 'לחיצת חזה עם משקולות באחיזה ניטרלית' }, home: { vpush: 'הרחקת כתפיים קלה בטווח נוח', hpush: 'לחיצת חזה עם משקולות באחיזה ניטרלית' }, bw: { vpush: 'סופרמן עם ידיים בצורת Y', hpush: 'שכיבות סמיכה בשיפוע על שולחן' } }
  };
  // Joint-friendly fillers used when a swap would repeat an exercise already in the workout
  const SAFE = {
    gym: ['היפ תראסט במכונה', 'כפיפת ברכיים במכונה', 'הרחקת ירכיים במכונה', 'גשר ישבן על רגל אחת'],
    home: ['היפ תראסט עם גב על הספה', 'כפיפת ברכיים עם גומייה', 'גשר ישבן על רגל אחת', 'צעידה הצידה עם גומייה'],
    bw: ['גשר ישבן עם רגליים על הספה', 'גשר ישבן על רגל אחת', 'כפיפת ברכיים עם מגבת על רצפה חלקה', 'הרמת רגל הצידה בשכיבה']
  };
  const COMPOUND = new Set(['squat', 'hinge', 'hpush', 'hpull', 'vpush', 'vpull', 'lunge', 'glute']);

  /* ---------- Weekly structure ---------- */
  // Full-body days lead with lower + push + pull so even short sessions cover the main muscles
  const T = {
    FA: ['אימון A · כל הגוף', ['squat', 'hpush', 'vpull', 'hinge', 'lat', 'core', 'bi']],
    FB: ['אימון B · כל הגוף', ['hinge', 'hpush', 'hpull', 'lunge', 'vpush', 'core', 'tri']],
    FC: ['אימון C · כל הגוף', ['squat', 'vpush', 'hpull', 'glute', 'hpush', 'rear', 'bi']],
    UA: ['אימון A · פלג גוף עליון', ['hpush', 'hpull', 'vpush', 'vpull', 'hpush', 'lat', 'bi']],
    LA: ['אימון B · פלג גוף תחתון', ['squat', 'hinge', 'lunge', 'hamcurl', 'calves', 'core', 'glute']],
    UB: ['אימון C · פלג גוף עליון', ['vpull', 'hpush', 'hpull', 'vpush', 'hpush', 'rear', 'tri']],
    LB: ['אימון D · פלג גוף תחתון', ['hinge', 'squat', 'glute', 'lunge', 'hamcurl', 'core', 'calves']],
    PU: ['אימון C · דחיפה', ['hpush', 'vpush', 'hpush', 'lat', 'tri', 'core', 'tri']],
    PL: ['אימון D · משיכה', ['vpull', 'hpull', 'rear', 'hpull', 'bi', 'core', 'bi']],
    LG: ['אימון E · רגליים', ['squat', 'hinge', 'lunge', 'glute', 'hamcurl', 'calves', 'core']]
  };
  const PLAN = { 2: ['FA', 'FB'], 3: ['FA', 'FB', 'FC'], 4: ['UA', 'LA', 'UB', 'LB'], 5: ['UA', 'LA', 'PU', 'PL', 'LG'] };
  const VARIANT = { FA: 0, FB: 1, FC: 1, UA: 0, LA: 0, UB: 1, LB: 1, PU: 1, PL: 1, LG: 1 };
  const SCHEDULE = { 2: 'ראשון ורביעי', 3: 'ראשון, שלישי וחמישי', 4: 'ראשון, שני, רביעי וחמישי', 5: 'ראשון, שני, שלישי, חמישי ושישי' };
  const SPLIT = { 2: 'שני אימוני כל הגוף', 3: 'שלושה אימוני כל הגוף', 4: 'פלג עליון ופלג תחתון, פעמיים כל אחד', 5: 'עליון, תחתון, דחיפה, משיכה ורגליים' };
  const N_EX = { 30: 4, 45: 5, 60: 6, 75: 7 };
  const SESSION_CAP = 10; // ~10–11 sets per muscle in one workout as an upper guide

  /* ---------- Fractional set counting: main muscle = 1 set, significant secondary = ½ ---------- */
  const MUSCLES = [['chest', 'חזה'], ['back', 'גב'], ['shoulders', 'כתפיים'], ['quads', 'ירך קדמית'], ['posterior', 'ירך אחורית וישבן'], ['biceps', 'יד קדמית'], ['triceps', 'יד אחורית']];
  const HITS = {
    squat: { quads: 1, posterior: 0.5 }, lunge: { quads: 1, posterior: 0.5 }, hinge: { posterior: 1 }, glute: { posterior: 1 }, hamcurl: { posterior: 1 },
    hpush: { chest: 1, triceps: 0.5, shoulders: 0.5 }, vpush: { shoulders: 1, triceps: 0.5 },
    hpull: { back: 1, biceps: 0.5 }, vpull: { back: 1, biceps: 0.5 },
    lat: { shoulders: 1 }, rear: { shoulders: 1 }, bi: { biceps: 1 }, tri: { triceps: 1 }, calves: {}, core: {}
  };
  const primaryOf = pat => Object.keys(HITS[pat]).find(k => HITS[pat][k] === 1);
  const FOCUS = { chest: ['chest'], back: ['back'], shoulders: ['shoulders'], legs: ['quads', 'posterior'], arms: ['biceps', 'triceps'] };
  const FOCUS_ADD = { chest: ['hpush'], back: ['hpull', 'vpull'], shoulders: ['lat', 'rear'], legs: ['glute', 'lunge'], arms: ['bi', 'tri'] };
  const FOCUS_LABEL = { chest: 'חזה', back: 'גב', shoulders: 'כתפיים', legs: 'ישבן ורגליים', arms: 'ידיים' };

  // Weekly target (hard sets per main muscle group) by experience and goal
  function target(exp, goal) {
    if (exp === 'beg') return [4, 8];
    if (exp === 'int') return goal === 'muscle' || goal === 'strength' ? [8, 12] : [6, 10];
    return goal === 'muscle' ? [10, 20] : goal === 'strength' ? [8, 14] : [8, 12];
  }

  const LABEL = {
    goal: { fat: 'ירידה במשקל ושמירה על השריר', muscle: 'בניית שריר', strength: 'כוח', health: 'בריאות ותנועה' },
    place: { gym: 'חדר כושר', home: 'בית עם משקולות', bw: 'בית בלי ציוד' },
    exp: { beg: 'מתחיל', int: 'בינוני', adv: 'מתקדם' },
    time: { 30: 'עד 30 דקות', 45: '45 דקות', 60: 'שעה', 75: 'יותר משעה' }
  };

  /* ---------- State + helpers ---------- */
  let st = { i: 0, a: {}, name: '', done: false };
  const load = () => { try { const v = JSON.parse(localStorage.getItem(STORE) || 'null'); if (v && v.a) st = v; } catch (e) {} };
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) {} };
  const track = (k, d) => { try { window.papafitTrack && window.papafitTrack(k, d || {}); } catch (e) {} };
  const val = id => { const q = Q.find(x => x.id === id); const a = st.a[id]; return a && a.length ? q.opts[a[0]].v : null; };
  const vals = id => { const q = Q.find(x => x.id === id); return (st.a[id] || []).map(n => q.opts[n].v); };
  const fem = () => val('gender') === 'f';
  const g = s => String(s).replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_, m, f) => (fem() ? f : m));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const num = v => (Math.round(v * 2) / 2).toString();

  const app = document.getElementById('quiz-app');
  const intro = document.getElementById('quiz-intro');
  if (!app || !intro) return;
  const WA_ICON = document.querySelector('#wa-icon-tpl')?.innerHTML || '';

  /* ---------- Program builder ---------- */
  function build() {
    const goal = val('goal') || 'fat', place = val('place') || 'gym', exp = val('exp') || 'beg';
    const days = val('days') || 2, time = val('time') || 45, focus = val('focus') || 'none';
    const limits = vals('limits').filter(x => x !== 'none');
    const n = N_EX[time];
    const focusGroups = FOCUS[focus] || [];

    const pickName = (pat, variant, used) => {
      let name = LIB[place][pat][variant];
      if (place === 'gym' && exp === 'beg' && variant === 0 && BEG_GYM[pat]) name = BEG_GYM[pat];
      let swapped = false;
      for (const l of limits) { const sw = LIMIT[l][place][pat]; if (sw) { name = sw; swapped = true; } }
      if (used.has(name)) {
        const alt = swapped ? null : LIB[place][pat][1 - variant];
        const lower = ['squat', 'hinge', 'lunge', 'glute', 'hamcurl'].includes(pat);
        name = [alt, ...(lower ? SAFE[place] : [])].find(x => x && !used.has(x)) || null;
        if (name && name !== alt) swapped = true;
      }
      return name ? { name, swapped } : null;
    };
    const baseSets = (pat, idx) => {
      const comp = COMPOUND.has(pat);
      let s = exp === 'beg' ? 2 : exp === 'int' ? (comp ? 3 : 2) : ((goal === 'muscle' || goal === 'strength') && comp && idx < 2 ? 4 : 3);
      if (time === 30) s = Math.min(s, 3);
      return s;
    };
    const fits = (sess, pat, sets) => Object.entries(HITS[pat]).every(([m, w]) => (sess[m] || 0) + w * sets <= SESSION_CAP);
    const maxFit = (sess, pat, want) => { let s = want; while (s >= 1 && !fits(sess, pat, s)) s--; return s; };
    const addHits = (sess, pat, sets) => { for (const [m, w] of Object.entries(HITS[pat])) sess[m] = (sess[m] || 0) + w * sets; };
    const details = (pat) => {
      const comp = COMPOUND.has(pat);
      let reps;
      if (pat === 'core') reps = '30–45 שנ׳ / 10–15';
      else if (!comp) reps = '10–15';
      else if (goal === 'strength' && place === 'gym' && exp !== 'beg') reps = '5–8';
      else if (goal === 'muscle' || goal === 'strength') reps = '8–12';
      else reps = '8–15';
      if (place === 'bw' && comp) reps = '8–15';
      const rir = exp === 'beg' ? '2–3' : exp === 'int' ? '1–3' : (comp || pat === 'core' ? '1–2' : '0–2');
      const rest = comp ? (goal === 'strength' && exp !== 'beg' ? '2–3 דק׳' : '1.5–2 דק׳') : '1–1.5 דק׳';
      return { reps, rir, rest };
    };

    const workouts = PLAN[days].map(key => {
      const [title, slots] = T[key];
      const seen = {}, used = new Set(), sess = {}, ex = [];
      for (const pat of slots) {
        if (ex.length >= n) break;
        const occ = seen[pat] = (seen[pat] || 0) + 1;
        const picked = pickName(pat, (VARIANT[key] + occ - 1) % 2, used);
        if (!picked) continue;
        const sets = maxFit(sess, pat, baseSets(pat, ex.length));
        if (sets < 2) continue;
        addHits(sess, pat, sets);
        used.add(picked.name);
        ex.push({ pat, name: picked.name, sets, swapped: picked.swapped, focus: false, ...details(pat) });
      }
      // Focus muscle (intermediate / advanced): +1 set on its main exercises, and one extra exercise if time allows
      if (focusGroups.length && exp !== 'beg') {
        for (const e of ex) if (focusGroups.includes(primaryOf(e.pat)) && fits(sess, e.pat, 1) && e.sets < 4) { e.sets += 1; addHits(sess, e.pat, 1); e.focus = true; }
        const hasFocusEx = ex.some(e => focusGroups.includes(primaryOf(e.pat)));
        if (time >= 45 && (!hasFocusEx || time >= 60)) {
          for (const pat of FOCUS_ADD[focus]) {
            const picked = pickName(pat, 1, used);
            if (!picked) continue;
            const sets = maxFit(sess, pat, 3);
            if (sets < 2) continue;
            addHits(sess, pat, sets);
            used.add(picked.name);
            ex.push({ pat, name: picked.name, sets, swapped: picked.swapped, focus: true, ...details(pat) });
            break;
          }
        }
      }
      return { key, title, ex, sess };
    });
    /* Balance weekly volume toward the target range: trim muscles above it (isolation first),
       top up main muscles below it while the session cap and the time budget allow. */
    const [lo, hi] = target(exp, goal);
    const rangeOf = m => focusGroups.includes(m) && exp !== 'beg' ? [lo + 2, Math.min(hi + 4, 20)] : (m === 'biceps' || m === 'triceps') ? [0, hi] : [lo, hi];
    const BUDGET = { 30: 12, 45: 16, 60: 20, 75: 24 }[time];
    const recalc = () => {
      const week = {};
      for (const [k] of MUSCLES) week[k] = 0;
      for (const w of workouts) {
        w.sess = {};
        for (const e of w.ex) addHits(w.sess, e.pat, e.sets);
        for (const k in w.sess) if (k in week) week[k] += w.sess[k];
      }
      return week;
    };
    const maxSets = comp => (exp === 'beg' ? 3 : comp ? 4 : 3);
    for (let guard = 0; guard < 200; guard++) {
      const week = recalc();
      const overs = MUSCLES.map(([k]) => k).filter(k => week[k] > rangeOf(k)[1]).sort((x, y) => (week[y] - rangeOf(y)[1]) - (week[x] - rangeOf(x)[1]));
      const over = overs.length > 0;
      let acted = false;
      for (const m of overs) {
        const cands = [];
        workouts.forEach(w => w.ex.forEach((e, i) => { if (primaryOf(e.pat) === m) cands.push({ w, e, i }); }));
        cands.sort((a, b) => (COMPOUND.has(a.e.pat) - COMPOUND.has(b.e.pat)) || (b.e.sets - a.e.sets) || (b.i - a.i));
        const red = cands.find(c => c.e.sets > 2);
        if (red) { red.e.sets -= 1; acted = true; break; }
        const drop = cands.find(c => !COMPOUND.has(c.e.pat) && c.w.ex.length > 3);
        if (drop) { drop.w.ex.splice(drop.w.ex.indexOf(drop.e), 1); acted = true; break; }
        if (week[m] - rangeOf(m)[1] > 2) {
          const dropC = cands.filter(c => c.w.ex.length > 3).sort((a, b) => b.i - a.i)[0];
          if (dropC) { dropC.w.ex.splice(dropC.w.ex.indexOf(dropC.e), 1); acted = true; break; }
        }
      }
      if (acted) continue;
      const unders = ['chest', 'back', 'quads', 'posterior', 'shoulders'].filter(k => week[k] < rangeOf(k)[0]);
      let added = false;
      for (const under of unders) {
        for (const w of workouts) {
          const total = w.ex.reduce((a, e) => a + e.sets, 0);
          if (total >= BUDGET) continue;
          const e = w.ex.find(x => primaryOf(x.pat) === under && x.sets < maxSets(COMPOUND.has(x.pat)) && fits(w.sess, x.pat, 1)
            && Object.entries(HITS[x.pat]).every(([m, wt]) => week[m] + wt <= rangeOf(m)[1]));
          if (e) { e.sets += 1; added = true; break; }
        }
        if (added) break;
      }
      if (!added) break;
    }
    const week = recalc(), peak = {};
    for (const [k] of MUSCLES) peak[k] = Math.max(0, ...workouts.map(w => w.sess[k] || 0));
    return { goal, place, exp, days, time, focus, limits, workouts, week, peak, range: [lo, hi], rangeOf };
  }

  /* ---------- Rendering ---------- */
  function show(html, focusSel) {
    intro.hidden = true;
    app.hidden = false;
    // keep number ranges (3–4, 60–90) in the right order inside Hebrew text
    app.innerHTML = html.replace(/(<bdi[^>]*>)?(\d+(?:[.,]\d+)?)–(\d+(?:[.,]\d+)?)/g, (m, open, a, b) => open ? m : `<bdi dir="ltr">${a}–${b}</bdi>`);
    const f = app.querySelector(focusSel || 'h2');
    if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
    const top = app.getBoundingClientRect().top + window.scrollY - 90;
    if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top, behavior: reduced() ? 'auto' : 'smooth' });
  }
  const backBtn = '<button type="button" class="quiz-back" data-act="back"><span aria-hidden="true">→</span> חזרה</button>';
  const bar = pct => `<div class="quiz-bar" role="progressbar" aria-label="התקדמות" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${Math.max(pct, 4)}%"></span></div>`;

  function renderQuestion() {
    const q = Q[st.i];
    const sel = st.a[q.id] || [];
    const opts = q.opts.map((o, n) => `<li><button type="button" class="quiz-opt${sel.includes(n) ? ' is-on' : ''}" data-n="${n}" ${q.multi ? `role="checkbox" aria-checked="${sel.includes(n)}"` : `aria-pressed="${sel.includes(n)}"`}><span class="quiz-mark" aria-hidden="true"></span><span>${esc(g(o.t))}</span></button></li>`).join('');
    show(`<div class="quiz-card quiz-step">
      <div class="quiz-top">${st.i > 0 ? backBtn : '<span></span>'}<span class="quiz-count" aria-live="polite">שאלה ${st.i + 1} מתוך ${Q.length}</span></div>
      ${bar(Math.round((st.i / Q.length) * 100))}
      <h2 class="quiz-q">${esc(g(q.q))}</h2>
      ${q.hint ? `<p class="quiz-hint">${esc(g(q.hint))}</p>` : ''}
      <ul class="quiz-opts${q.multi ? ' is-multi' : ''}" ${q.multi ? 'role="group"' : ''} aria-label="תשובות">${opts}</ul>
      ${q.multi ? `<button type="button" class="button quiz-next" data-act="next" ${sel.length ? '' : 'disabled'}>המשך</button>` : ''}
    </div>`, '.quiz-q');
  }

  function renderName() {
    show(`<div class="quiz-card quiz-step">
      <div class="quiz-top">${backBtn}<span class="quiz-count">כמעט סיימנו</span></div>
      ${bar(100)}
      <h2 class="quiz-q">${esc(g('מצוין. איך לקרוא לך?'))}</h2>
      <p class="quiz-hint">לא חובה. השם מופיע רק בתוכנית שלך ולא נשלח לשום מקום.</p>
      <form class="quiz-name">
        <label for="quiz-name-input" class="sr-only">שם פרטי</label>
        <input id="quiz-name-input" name="name" type="text" autocomplete="given-name" maxlength="30" placeholder="שם פרטי" value="${esc(st.name || '')}">
        <button type="submit" class="button">לבנות את התוכנית שלי</button>
      </form>
    </div>`, '.quiz-q');
  }

  function renderLoading() {
    show('<div class="quiz-card quiz-loading" role="status"><span class="quiz-spinner" aria-hidden="true"></span><h2>בונה את התוכנית שלך...</h2><p>מחשב נפח שבועי, סטים, חזרות ומנוחות</p></div>');
    setTimeout(renderResults, reduced() ? 200 : 1500);
  }

  function programText(p) {
    return p.workouts.map(w => `${w.title}\n` + w.ex.map(e => `• ${e.name}: ${e.sets}×${e.reps}, RIR ${e.rir}`).join('\n')).join('\n\n');
  }

  function renderResults() {
    const p = build();
    const name = (st.name || '').trim();
    const [lo, hi] = p.range;
    const scale = Math.max(24, hi + 8);
    const minutes = p.workouts.map(w => w.ex.reduce((a, e) => a + e.sets, 0));

    const notes = [];
    if (p.exp === 'beg' && p.days >= 4) notes.push(g('למתחילים, 2–3 אימונים בשבוע הם נקודת התחלה מצוינת. בנינו תוכנית ל־' + p.days + ' ימים כפי שביקשת, אבל אם השבוע מתמלא, עדיף לרדת ל־2–3 אימונים ולא לוותר.'));
    if (p.exp === 'beg') notes.push('בשבועיים הראשונים אפשר להתחיל גם בסט אחד לתרגיל, וללמוד את הטכניקה לפני שמגיעים לסטים קשים.');
    if (p.focus !== 'none' && p.exp === 'beg') notes.push(g(`ביקשת דגש על ${FOCUS_LABEL[p.focus]}. בשלב הזה עדיף קודם לבנות בסיס מאוזן; את הדגש מוסיפים אחרי כמה חודשים של התקדמות.`));
    if (p.focus !== 'none' && p.exp !== 'beg') notes.push(`הדגש על ${FOCUS_LABEL[p.focus]}: עוד סט בתרגילים המרכזיים שלו${p.time >= 45 ? ' ותרגיל נוסף' : ''}, בלי להגדיל את הנפח של שאר הגוף. תרגילים כאלה מסומנים "דגש".`);

    const workouts = p.workouts.map((w, i) => `<article class="sp-workout">
      <h4>${esc(w.title)} <small class="sp-sets-total">${minutes[i]} סטים</small></h4>
      <ol class="sp-ex">${w.ex.map(e => `<li>
        <span class="sp-ex-name">${esc(e.name)}${e.swapped ? ' <small class="sp-swap">מותאם</small>' : ''}${e.focus ? ' <small class="sp-swap sp-focus">דגש</small>' : ''}</span>
        <span class="sp-ex-meta"><span><strong>${e.sets}</strong> סטים</span><span><strong>${esc(e.reps)}</strong> חזרות</span><span>RIR <strong>${e.rir}</strong></span><span>מנוחה ${esc(e.rest)}</span></span>
      </li>`).join('')}</ol>
    </article>`).join('');

    const volume = MUSCLES.map(([k, label]) => {
      const v = p.week[k];
      const isArm = k === 'biceps' || k === 'triceps';
      const [mlo, mhi] = isArm ? [lo, hi] : p.rangeOf(k);
      const status = v < mlo ? (isArm ? ['ok', 'כולל עבודה עקיפה'] : ['low', 'מתחת לטווח']) : v > mhi + 2 ? ['high', 'מעל הטווח'] : v > mhi ? ['ok', 'קצת מעל הטווח'] : ['ok', FOCUS[p.focus] && FOCUS[p.focus].includes(k) && p.exp !== 'beg' ? 'בטווח · דגש' : 'בטווח'];
      const pct = Math.min(100, Math.round((v / scale) * 100));
      return `<li><span class="bar-label">${label}</span><span class="bar-track sp-track" aria-hidden="true"><span class="sp-range" style="inset-inline-start:${(mlo / scale) * 100}%;width:${((mhi - mlo) / scale) * 100}%"></span><span class="bar-fill is-${status[0] === 'ok' ? 'high' : 'mid'}" style="width:${Math.max(pct, 3)}%"></span></span><span class="bar-val"><strong>${num(v)}</strong> · ${status[1]}</span></li>`;
    }).join('');
    const anyLow = MUSCLES.some(([k]) => k !== 'biceps' && k !== 'triceps' && p.week[k] < p.rangeOf(k)[0]);

    const goalTip = {
      fat: `בירידה במשקל המטרה של אימוני הכוח היא לשמור על השריר, ולשימור צריך הרבה פחות נפח מאשר לבנייה. לפעמים מספיק מספר חד־ספרתי של סטים שבועיים לשריר. מה שחשוב יחד עם זה: חלבון מספיק, גירעון קלורי מתון ושינה. <a href="/calorie-calculator">לחשב את התקציב הקלורי שלך</a>`,
      muscle: 'לבניית שריר, הסטים הראשונים נותנים את רוב התוצאה. לפני שמוסיפים סטים, מוודאים שהסטים הקיימים קשים מספיק, בטכניקה טובה ובטווח תנועה מלא, ושיש מספיק חלבון ואוכל. בגירעון קלורי גדול קשה מאוד לבנות שריר.',
      strength: 'לכוח, התרגילים המרכזיים הם הלב של התוכנית. שם מוסיפים משקל בהדרגה ונחים מספיק בין הסטים, כדי שכל סט יהיה איכותי.',
      health: 'לבריאות, העקביות חשובה יותר מכל פרט אחר. שני אימונים קבועים לאורך שנה שווים יותר מחמישה אימונים לחודש אחד.'
    }[p.goal];

    const msgAlex = `היי אלכס${name ? ', אני ' + name : ''}. בניתי תוכנית אימוני כוח באתר:\nמטרה: ${LABEL.goal[p.goal]} · ${LABEL.place[p.place]} · רמה: ${LABEL.exp[p.exp]}\n${p.days} אימונים בשבוע, ${LABEL.time[p.time]} לאימון${p.focus !== 'none' ? ' · דגש: ' + FOCUS_LABEL[p.focus] : ''}${p.limits.length ? ' · רגישות: ' + p.limits.map(l => ({ knees: 'ברכיים', back: 'גב תחתון', shoulders: 'כתפיים' })[l]).join(', ') : ''}\nאשמח לשיחת ייעוץ קצרה כדי להתאים את התוכנית ואת התזונה`;
    const msgSelf = `תוכנית אימוני הכוח שלי (PAPAFIT)\n${p.days} אימונים בשבוע · ${SCHEDULE[p.days]}\n\n${programText(p)}\n\nRIR = כמה חזרות נשארו "במיכל" בסוף הסט.\n${PAGE_URL}`;

    show(`<div class="quiz-results sp-results">
      <header class="result-hero">
        <p class="eyebrow">התוכנית שלך</p>
        <h2>${name ? esc(name) + ', ' : ''}${esc(g('זו תוכנית האימונים שלך'))}</h2>
        <ul class="sp-chips">
          <li>${esc(LABEL.goal[p.goal])}</li><li>${esc(LABEL.place[p.place])}</li><li>רמה: ${esc(LABEL.exp[p.exp])}</li><li>${p.days} אימונים בשבוע</li><li>${esc(LABEL.time[p.time])} לאימון</li>${p.focus !== 'none' ? `<li>דגש: ${FOCUS_LABEL[p.focus]}</li>` : ''}
        </ul>
        <p class="intro">${esc(g(`המבנה: ${SPLIT[p.days]}. ימים מומלצים: ${SCHEDULE[p.days]}, עם יום מנוחה בין אימונים כשאפשר. היעד שלך: ${lo}–${hi} סטים קשים בשבוע לכל קבוצת שרירים מרכזית.`))}</p>
        ${notes.length ? `<ul class="sp-notes">${notes.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      </header>

      <section aria-labelledby="sp-workouts-title">
        <h3 id="sp-workouts-title" class="result-section-title">האימונים</h3>
        <div class="sp-workouts">${workouts}</div>
        <p class="sub">לפני כל אימון: 5 דקות חימום כללי ו־1–2 סטים קלים של התרגיל הראשון. "מותאם" = תרגיל שהוחלף בגלל רגישות שסימנת. כדאי להישאר עם אותם תרגילים לפחות כמה שבועות, כדי לראות התקדמות במשקלים ובחזרות.</p>
      </section>

      <section class="result-profile">
        <h3>כמה קשה כל סט? RIR</h3>
        <p>RIR (Repetitions in Reserve) זה כמה חזרות עוד היית ${esc(g('{מסוגל|מסוגלת}'))} לבצע בסוף הסט. התוכנית שלך מכוונת ל־RIR ${p.exp === 'beg' ? '2–3' : p.exp === 'int' ? '1–3' : '0–2'}${p.exp === 'beg' ? ', ואחרי שהטכניקה יושבת אפשר להתקרב ל־1–2' : ''}.</p>
        <table class="sp-rir"><thead><tr><th scope="col">RIR</th><th scope="col">משמעות</th></tr></thead><tbody>
          <tr><td>0</td><td>הגעה לכשל שרירי</td></tr>
          <tr><td>1</td><td>אפשר היה לבצע עוד חזרה אחת</td></tr>
          <tr><td>2</td><td>אפשר היה לבצע עוד שתי חזרות</td></tr>
          <tr><td>3</td><td>אפשר היה לבצע עוד שלוש חזרות</td></tr>
        </tbody></table>
        <p class="sub">אין צורך להגיע לכשל בכל סט כדי לבנות שריר, אבל כל סט צריך להיות מאתגר מספיק. סטים נוספים הם לא הפתרון לאימון שאינו איכותי מספיק.</p>
      </section>

      <section class="result-profile">
        <h3>כמה סטים כל שריר מקבל בשבוע</h3>
        <p>בספירה, השריר המרכזי בתרגיל מקבל סט מלא, ושריר משני שעובד משמעותית מקבל חצי סט. למשל, 4 סטים של לחיצת חזה = 4 לחזה, 2 ליד האחורית ו־2 לכתף. הפס הבהיר מסמן את הטווח המומלץ לך: ${lo}–${hi} סטים בשבוע.</p>
        <ul class="result-bars sp-volume">${volume}</ul>
        <p class="sub">${anyLow ? 'שרירים שמתחת לטווח זה לא כישלון. גם 4 סטים בשבוע כבר מובילים לגדילה מדידה, ותמיד אפשר להוסיף בהמשך. ' : ''}אף שריר לא מקבל יותר מ־${SESSION_CAP} סטים באימון אחד: מעבר לכך אין מספיק ראיות לתועלת נוספת, והאיכות יורדת.</p>
      </section>

      <section class="result-profile sp-returns">
        <h3>למה לא צריך יותר? התמורה הפוחתת</h3>
        <p>לפי מטא־אנליזה של 35 מחקרים, הסטים הראשונים נותנים הכי הרבה. כל סט נוסף עדיין עוזר, אבל פחות ופחות:</p>
        <ol class="sp-steps">
          <li><strong>4</strong><span>סטים בשבוע</span><em>כ־2.2% גדילה מוערכת</em></li>
          <li><strong>11</strong><span>סטים בשבוע</span><em>בערך פי 2 תוצאה</em></li>
          <li><strong>22</strong><span>סטים בשבוע</span><em>בערך פי 3 תוצאה</em></li>
        </ol>
        <p class="sub">אלה הערכות ממודל מחקרי, לא תחזית אישית. בגלל זה, לאנשים עסוקים עדיף נפח שאפשר להתמיד בו: שני אימונים איכותיים של 35 דקות לאורך שנה עדיפים על ארבעה אימונים של שעה וחצי שנוטשים אחרי חודש.</p>
      </section>

      <section class="result-first sp-progress">
        <span class="guide-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 6-6 4 4 8-8m-5 0h5v5"/></svg></span>
        <div>
          <h3>איך מתקדמים, ומתי מוסיפים סטים?</h3>
          <p><strong>כל אימון:</strong> קודם משפרים טכניקה, אחר כך חזרות, ואז משקל. כשמגיעים לקצה העליון של טווח החזרות בכל הסטים, ב־RIR הנכון, מעלים קצת משקל בפעם הבאה. בלי ציוד: מאטים את הירידה, מוסיפים עצירה או עוברים לגרסה קשה יותר.</p>
          <p><strong>כל 3–4 שבועות, לפני שמוסיפים סטים, בודקים:</strong></p>
          <ul class="sp-check">
            <li>יש התקדמות במשקלים או בחזרות?</li><li>הסטים קשים מספיק, בטכניקה טובה?</li><li>המנוחה בין הסטים מספיקה?</li><li>יש מספיק חלבון, והתזונה מתאימה למטרה?</li><li>השינה מספיקה, והגוף מתאושש בין האימונים?</li><li>${esc(g('{אתה מתמיד|את מתמידה}'))} בתוכנית לאורך זמן?</li>
          </ul>
          <div class="sp-flow">
            <div class="sp-yes"><strong>מתקדמים</strong><span>ממשיכים בדיוק עם אותו נפח. אין סיבה להוסיף סטים כשהגוף מתקדם.</span></div>
            <div class="sp-no"><strong>תקועים</strong><span>אם כל השאר תקין, מוסיפים בהדרגה 2–4 סטים בשבוע לשריר שנתקע. אם יש עייפות מצטברת או התאוששות חלשה, דווקא מורידים נפח לשבוע־שבועיים.</span></div>
          </div>
        </div>
      </section>

      <section class="result-timeline"><h3>טיפ למטרה שלך</h3><p>${goalTip}</p></section>

      <section class="pf-cta-card result-cta" aria-labelledby="cta-title">
        <div class="result-cta-copy">
          <p class="pf-cta-eyebrow">PAPAFIT</p>
          <h2 id="cta-title">${esc(g(name ? `${name}, {רוצה|רוצה} שנתאים את זה אליך?` : '{רוצה|רוצה} שנתאים את זה אליך?'))}</h2>
          <p>${esc(g('התוכנית בנויה לפי עקרונות מבוססי מחקר, אבל התוצאה תלויה גם בתזונה, בשינה ובמה שקורה בשבוע עמוס. בשיחת ייעוץ קצרה נעבור על התוכנית ונחבר אותה לתזונה ולשגרה שלך.'))}</p>
          <ul><li>15 דקות בטלפון</li><li>ללא עלות וללא התחייבות</li><li>אני עונה אישית</li></ul>
          <a class="button" data-cta="strength_result" href="https://wa.me/${WA}?text=${encodeURIComponent(msgAlex)}" target="_blank" rel="noopener noreferrer">${WA_ICON}להתייעץ עם אלכס על התוכנית</a>
          <p class="result-cta-note">ההודעה כבר כתובה עם הפרטים של התוכנית שלך.</p>
        </div>
        <figure class="result-cta-photo"><img src="/images/alex-avatar-new.webp" alt="אלכס קביטניצקי" width="400" height="400" loading="lazy" decoding="async"><figcaption><strong>אלכס קביטניצקי</strong>מלווה תזונה ובניית הרגלים להורים עסוקים · מעל 800 לקוחות</figcaption></figure>
      </section>

      <section class="result-tools">
        <h3>לשמור את התוכנית</h3>
        <div class="result-tools-grid">
          <a class="result-tool" data-cta="strength_share_self" href="https://api.whatsapp.com/send?text=${encodeURIComponent(msgSelf)}" target="_blank" rel="noopener noreferrer"><strong>לשלוח לעצמי בוואטסאפ</strong><span>כל האימונים בהודעה אחת</span></a>
          <button type="button" class="result-tool" data-act="print"><strong>להדפיס או לשמור כ־PDF</strong><span>גרסה נקייה להדפסה</span></button>
          <a class="result-tool" href="/weight-loss-quiz"><strong>למה ${esc(g('{אני לא מצליח|אני לא מצליחה}'))} לרדת?</strong><span>שאלון של 3 דקות</span></a>
          <button type="button" class="result-tool" data-act="restart"><strong>לבנות תוכנית חדשה</strong><span>לשנות תשובות או ימים</span></button>
        </div>
      </section>

      <section class="sp-sources">
        <h3>על מה זה מבוסס</h3>
        <p>עקרונות הנפח בתוכנית מבוססים על המאמר של טל בן משה ועל שתי מטא־אנליזות משנים 2024–2025 (35 מחקרים, כ־1,035 מתאמנים), בהתאמה לקהל של PAPAFIT: אנשים עסוקים שרוצים את התוצאה הטובה ביותר ביחס לזמן שיש להם.</p>
        <ul>
          <li><a href="https://tbm-academy.com/%D7%9B%D7%9E%D7%94-%D7%A1%D7%98%D7%99%D7%9D-%D7%9C%D7%A2%D7%A9%D7%95%D7%AA-%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%9C%D7%9E%D7%AA%D7%90%D7%9E%D7%9F-%D7%94%D7%9E%D7%91%D7%95%D7%9C%D7%91%D7%9C/" target="_blank" rel="noopener">טל בן משה: כמה סטים לעשות בשביל לבנות שרירים?</a></li>
          <li><a href="https://sportrxiv.org/index.php/server/preprint/view/460" target="_blank" rel="noopener" lang="en">Meta-analysis: weekly training volume</a></li>
          <li><a href="https://sportrxiv.org/index.php/server/preprint/view/537/1148" target="_blank" rel="noopener" lang="en">Meta-analysis: per-session training volume</a></li>
        </ul>
      </section>

      <p class="result-disclaimer">התוכנית כללית ומיועדת לאנשים בריאים. ההמלצות המחקריות הן קווים מנחים ולא ערכי סף מוחלטים. אם יש כאב, פציעה, מצב רפואי או היריון, חשוב להתייעץ עם רופא או פיזיותרפיסט לפני שמתחילים. כאב חד בזמן תרגיל הוא סימן לעצור.</p>
    </div>`, '.result-hero h2');
  }

  /* ---------- Flow ---------- */
  function start(fresh) {
    if (fresh) st = { i: 0, a: {}, name: '', done: false };
    track('strength_start', {});
    save();
    st.done ? renderResults() : (st.i >= Q.length ? renderName() : renderQuestion());
  }
  function answer(n) {
    const q = Q[st.i];
    if (q.multi) {
      let sel = (st.a[q.id] || []).slice();
      if (sel.includes(n)) sel = sel.filter(x => x !== n);
      else if (q.opts[n].only) sel = [n];
      else sel = sel.filter(x => !q.opts[x].only).concat(n);
      st.a[q.id] = sel;
      save();
      app.querySelectorAll('.quiz-opt').forEach(b => { const on = sel.includes(+b.dataset.n); b.classList.toggle('is-on', on); b.setAttribute('aria-checked', String(on)); });
      app.querySelector('.quiz-next').disabled = !sel.length;
      return;
    }
    st.a[q.id] = [n];
    app.querySelectorAll('.quiz-opt').forEach(b => { const on = +b.dataset.n === n; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); b.disabled = true; });
    setTimeout(next, reduced() ? 60 : 260);
  }
  function next() { st.i += 1; save(); st.i >= Q.length ? renderName() : renderQuestion(); }

  app.addEventListener('click', e => {
    const opt = e.target.closest('.quiz-opt');
    if (opt) return answer(+opt.dataset.n);
    const act = e.target.closest('[data-act]');
    if (!act) return;
    const a = act.dataset.act;
    if (a === 'back') { st.i = Math.max(0, st.i - 1); st.done = false; save(); renderQuestion(); }
    else if (a === 'next') next();
    else if (a === 'restart') { st = { i: 0, a: {}, name: '', done: false }; save(); renderQuestion(); }
    else if (a === 'print') { track('strength_print', {}); window.print(); }
  });
  app.addEventListener('submit', e => {
    e.preventDefault();
    st.name = (e.target.elements.name.value || '').trim().slice(0, 30);
    st.done = true;
    save();
    track('strength_complete', { sp_goal: val('goal'), sp_place: val('place'), sp_exp: val('exp'), sp_days: String(val('days')), sp_focus: val('focus') });
    renderLoading();
  });

  load();
  document.querySelectorAll('[data-quiz-start]').forEach(b => b.addEventListener('click', () => start(b.dataset.quizStart === 'fresh' || !Object.keys(st.a).length)));
  const resume = document.getElementById('quiz-resume');
  if (resume && Object.keys(st.a).length) {
    resume.hidden = false;
    resume.textContent = st.done ? 'לצפייה בתוכנית הקודמת שלך' : 'להמשיך מאיפה שהפסקתי';
    resume.addEventListener('click', () => start(false));
  }
})();
