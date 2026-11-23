/* PAPAFIT quiz: "למה אתה לא מצליח לרדת במשקל?" (lead magnet, no backend, answers stay in the browser) */
(() => {
  'use strict';
  const STORE = 'papafit_quiz_v1';
  const WA = '972526425670';
  const QUIZ_URL = 'https://papafit.co.il/weight-loss-quiz';

  /* ---------- Reasons (categories) ---------- */
  const REASONS = {
    evening: {
      title: 'הערב מוחק את מה שבנית במהלך היום',
      short: 'אכילת ערב',
      why: [
        'זה לא חוסר משמעת, זו ביולוגיה פשוטה. כשאוכלים מעט במהלך היום, מגיעים לערב עם רעב שהצטבר, עייפות ומקרר פתוח. בדיוק בשעה שבה כוח ההחלטה הכי נמוך, האוכל הכי זמין. יום ״מצוין״ של 1,200 קלוריות הופך בקלות לערב של עוד 1,000, והגירעון שבנית מהבוקר נעלם בלי {שתרגיש|שתרגישי}.',
        'אצל הרבה הורים הערב הוא גם ״הזמן שלי״, והאוכל הופך לפרס על היום. זה מובן לגמרי, אבל זה אומר שאת הערב צריך לתכנן מראש ולא לקוות שהוא יסתדר לבד.'
      ],
      actions: [
        'לאכול ארוחת צהריים אמיתית עם חלבון, ולא לדלג עליה גם ביום עמוס.',
        'להוסיף ״ארוחת גשר״ בין 16:00 ל־17:00, למשל יוגורט חלבון ופרי או טוסט עם גבינה. כך מגיעים הביתה פחות רעבים.',
        'לתכנן מראש פינוק ערב קטן של 150 עד 200 קלוריות במקום להילחם בו. מה שמתוכנן לא מרגיש כמו כישלון.'
      ],
      link: ['/articles/carbs-after-8pm', 'האם פחמימות אחרי 8 בערב משמינות?']
    },
    weekend: {
      title: 'סוף השבוע מוחק את השבוע',
      short: 'סופי שבוע',
      why: [
        'בוא{|י} נעשה חשבון. נניח שמראשון עד חמישי יצרת גירעון יפה של 400 קלוריות ביום, כלומר 2,000 בשבוע. ארוחת שישי עם חלה, תוספות וקינוח, ושבת עם אירוח, נשנושים ושתייה, יכולות להוסיף בקלות 1,000 קלוריות בכל יום. התוצאה: שבוע שלם של מאמץ שמסתיים באפס.',
        'זה גם מסביר למה זה כל כך מתסכל. באמצע השבוע {אתה מרגיש|את מרגישה} שעשית הכול נכון, וביום ראשון המשקל באותו מקום. הבעיה היא לא ארוחת שישי, אלא שאין לה מקום בתוכנית.'
      ],
      actions: [
        'לחשוב על קלוריות בחשבון שבועי ולא יומי: לחסוך מעט בימי החול כדי להשאיר מקום לארוחת שישי.',
        'בארוחת שישי לבחור מה הכי חשוב לך, החלה או הקינוח, ליהנות ממנו באמת ולוותר על השאר בלי דרמה.',
        'לשמור עוגן אחד גם בשבת: ארוחת בוקר עם חלבון או הליכה משפחתית.'
      ],
      link: ['/weight-loss-guide#p6', 'מהמדריך: איך משאירים מקום לארוחת שישי']
    },
    hidden: {
      title: 'קלוריות שלא רואים',
      short: 'קלוריות נסתרות',
      why: [
        'רוב האנשים מעריכים בחסר את מה שהם אוכלים, לפעמים בעשרות אחוזים, וזה לא כי הם משקרים. כף טחינה ״קטנה״ היא לרוב שתיים, מזיגה חופשית של שמן זית היא 120 עד 240 קלוריות, חופן אגוזים הוא כ־200, ושלושה ביסים מהשניצל של הילדים הם עוד 150.',
        '״אבל אני {אוכל|אוכלת} בריא״ הוא המשפט שאני שומע הכי הרבה. אוכל בריא חשוב מאוד, אבל הגוף לא יודע אם הקלוריה הגיעה מאבוקדו או מעוגייה. הקפה עם החלב, המיץ, הטעימות בבישול וכוס היין מצטברים בשקט.'
      ],
      actions: [
        'לרשום במשך 7 ימים באמת הכול, כולל שתייה, טעימות ושאריות. לא לתמיד, רק כדי לראות את התמונה.',
        'למדוד שמן, טחינה ואגוזים בכף במשך שבועיים. זו הדרך המהירה ביותר להבין כמה נכנס באמת.',
        'להחליף משקה מתוק אחד ביום במים, סודה או קפה בלי סוכר. 150 קלוריות ביום הן יותר מ־50,000 בשנה.'
      ],
      link: ['/articles/why-weight-is-not-going-down', 'למה המשקל לא יורד למרות שאוכלים בריא?']
    },
    protein: {
      title: 'חסר חלבון, ולכן הרעב מנצח',
      short: 'חלבון ושובע',
      why: [
        'חלבון הוא רכיב התזונה המשביע ביותר. לחם עם ממרח וקפה נגמרים תוך שעה וחצי ברעב, ואותה כמות קלוריות עם ביצים, קוטג׳ או יוגורט חלבון מחזיקה הרבה יותר זמן. כשאין מספיק חלבון, כל יום הוא מאבק ברעב, ומאבק ברעב מפסידים בסוף.',
        'מעבר לזה, בזמן ירידה במשקל הגוף עלול לאבד גם שריר אם הוא לא מקבל מספיק חלבון. פחות שריר זה גוף פחות חזק ומשקל שקל יותר להחזיר.'
      ],
      actions: [
        'לשים מקור חלבון בכל ארוחה: ביצים, קוטג׳, יוגורט, טונה, עוף, דג, טופו או קטניות.',
        'לכוון ל־25 עד 40 גרם חלבון בכל ארוחה מרכזית, בהתאם לגודל הגוף ולרעב.',
        'להחזיק בבית ״חלבון מהיר״: יוגורט חלבון, קוטג׳, ביצים קשות וטונה. כך גם ביום עמוס יש מה לאכול.'
      ],
      link: ['/articles/how-much-protein-per-day', 'כמה חלבון צריך ביום כדי לרדת במשקל?']
    },
    allornothing: {
      title: 'גישת ״הכול או כלום״',
      short: 'הכול או כלום',
      why: [
        'אם כל ניסיון מתחיל ב״מיום ראשון אני על זה״ ונגמר ב״הרסתי, אז כבר לא משנה״, הבעיה היא לא האוכל אלא המבנה. תוכנית נוקשה עובדת רק בשבוע מושלם, ושבוע מושלם עם עבודה וילדים כמעט לא קיים.',
        'וגם החשבון לא מסתדר: עוגייה אחת ״שהרסה״ את היום היא 100 קלוריות. מה שבאמת עושה נזק זה ה״כבר לא משנה״ שבא אחריה ונמשך עד סוף השבוע. ככה נוצר מעגל היו־יו: הגבלה, שבירה, אשמה, ושוב הגבלה.'
      ],
      actions: [
        'לקבוע ״גרסת מינימום״ לימים קשים: שני דברים שעושים תמיד, למשל חלבון בארוחות והליכה של 20 דקות.',
        'אחרי יום לא טוב, הארוחה הבאה רגילה. בלי לפצות ברעב ובלי ״להתחיל מחדש ביום ראשון״.',
        'לשאוף ל־80% עקביות ולא ל־100% שלמות. 80% לאורך חצי שנה מנצחים 100% לאורך שבועיים.'
      ],
      link: ['/articles/lose-weight-without-extreme-diet', 'איך לרדת במשקל בלי דיאטה קיצונית']
    },
    scale: {
      title: 'המשקל ״עובד״ עליך',
      short: 'מעקב והתקדמות',
      why: [
        'המשקל יכול לקפוץ בקילו או שניים מיום ליום בגלל מלח, פחמימות, נוזלים, מחזור, עיכול או אימון. אם {אתה נשקל|את נשקלת} ו{מגיב|מגיבה} לכל מספר בנפרד, סביר {שתחליט|שתחליטי} ש״זה לא עובד״ דווקא בשבוע שבו זה כן עבד.',
        'מצד שני, מי שלא נשקל בכלל מאבד את הדבר הכי חשוב: מידע. בלי מגמה אי אפשר לדעת אם צריך לשנות משהו, וכך אפשר להמשיך חודשים במקום בלי לשים לב.'
      ],
      actions: [
        'להישקל 3 עד 7 פעמים בשבוע, בבוקר אחרי השירותים, ולהשוות ממוצע שבועי לממוצע שבועי.',
        'לתת לכל שינוי לפחות שבועיים־שלושה לפני שמסיקים מסקנות.',
        'למדוד היקף מותניים פעם בשבועיים. לפעמים המשקל עומד והבגדים כבר משתנים.'
      ],
      link: ['/weight-loss-guide#p4', 'מהמדריך: איך עוקבים אחרי המשקל נכון']
    },
    stress: {
      title: 'עייפות, לחץ ושינה',
      short: 'שינה ולחץ',
      why: [
        'כשישנים מעט, הגוף מגביר את אותות הרעב ומחליש את תחושת השובע. מחקרים מראים שאחרי לילות קצרים אנשים אוכלים בממוצע כמה מאות קלוריות יותר, בעיקר מזונות מתוקים ושומניים. זו לא חולשה, זו פיזיולוגיה.',
        'באותו אופן, אכילה מלחץ או משעמום היא דרך מהירה להירגע. אם האוכל הוא הכלי העיקרי שלך להתאושש מהיום, כל יום קשה הופך לנשנוש.'
      ],
      actions: [
        'לקבוע שעת שינה, לא רק שעת השכמה. גם חצי שעה של שינה נוספת משפיעה על הרעב למחרת.',
        'לפני שפותחים את המקרר, לעצור לשתי דקות ולשאול: אני {רעב|רעבה} או {עייף|עייפה}? לפעמים מקלחת, תה או עשר דקות של שקט עושים את העבודה.',
        'לא להשאיר חטיפים בהישג יד בסלון, ולהוציא את המסך מהמיטה חצי שעה לפני השינה.'
      ],
      link: ['/articles/habits-for-long-term-weight-loss', 'בניית הרגלים לירידה במשקל לאורך זמן']
    },
    activity: {
      title: 'הגוף לא מקבל סיבה לשמור על שריר',
      short: 'תנועה ואימוני כוח',
      why: [
        'אימון הוא לא דרך ״לשרוף את מה שאכלתי״. חצי שעה של ריצה שורפת בערך כמו פרוסת עוגה, ולכן קשה לרדת במשקל רק מאימונים. אבל פעילות עושה שני דברים קריטיים: אימוני כוח שומרים על השריר בזמן הירידה, והתנועה היומיומית, הצעדים, היא חלק גדול מההוצאה היומית.',
        'מי שיושב רוב היום, בעיקר בתקופה עמוסה, יכול לאבד בלי לשים לב מאות קלוריות של הוצאה. ומי שעושה רק קרדיו ומצמצם אוכל מאבד גם שריר, וזה מוביל לגוף רך יותר ולחזרה מהירה של המשקל.'
      ],
      actions: [
        'להוסיף שני אימוני כוח בשבוע. גם 30 עד 40 דקות בבית מספיקות כדי להתחיל.',
        'לבדוק כמה צעדים {אתה עושה|את עושה} היום ולהוסיף 2,000 ביום. שיחות טלפון בהליכה הן התחלה מצוינת.',
        'לא ״לאכול בחזרה״ את הקלוריות של האימון. האימון הוא בשביל השריר והבריאות, הירידה מגיעה מהתזונה.'
      ],
      link: ['/weight-loss-guide#p8', 'מהמדריך: אימוני כוח ושינה']
    },
    planning: {
      title: 'אין תוכנית ליום עמוס',
      short: 'תכנון',
      why: [
        'כשאין תוכנית, ההחלטות מתקבלות כשהרעב כבר שם, וברגע כזה בוחרים את מה שהכי מהיר: משלוח, מאפה בקפיטריה או מה שנשאר במקרר. רוב האנשים לא נכשלים בימים הרגילים, הם נכשלים בימים הלא צפויים.',
        'תכנון לא חייב להיות קופסאות אוכל לשבוע שלם. מספיק לדעת מראש מה אוכלים ביום עמוס, ולהחזיק בבית ובתיק כמה אפשרויות שלא דורשות מחשבה.'
      ],
      actions: [
        'לבחור 2 עד 3 ארוחות קבועות ״על אוטומט״ לימים עמוסים, כמו טוסט עם גבינה וירקות או פיתה עם טונה וביצה.',
        'פעם בשבוע, 15 דקות: מהם הימים העמוסים השבוע ומה אוכלים בהם.',
        'לשים בתיק או ברכב יוגורט, פרי או חטיף חלבון, כדי לא להגיע לקפיטריה רעבים.'
      ],
      link: ['/weight-loss-guide#p9', 'מהמדריך: מה עושים בימים שלא הולך']
    }
  };
  const ORDER = ['evening', 'weekend', 'hidden', 'allornothing', 'protein', 'planning', 'scale', 'stress', 'activity'];

  /* ---------- Questions ---------- */
  const Q = [
    { id: 'gender', q: 'נתחיל מההתחלה. מי ממלא את השאלון?', hint: 'כדי שאוכל לפנות אליך נכון.', opts: [
      { t: 'גבר', v: 'm' }, { t: 'אישה', v: 'f' } ] },
    { id: 'goal', q: 'כמה קילו היית {רוצה|רוצה} לרדת?', opts: [
      { t: 'עד 5 ק״ג', v: 'a' }, { t: '5 עד 10 ק״ג', v: 'b' }, { t: '10 עד 20 ק״ג', v: 'c' }, { t: 'יותר מ־20 ק״ג', v: 'd' } ] },
    { id: 'years', q: 'כמה זמן {אתה מנסה|את מנסה} לרדת במשקל?', opts: [
      { t: 'רק התחלתי לחשוב על זה', v: 'a' },
      { t: 'פחות משנה', v: 'b' },
      { t: 'שנה עד שלוש', v: 'c', s: { allornothing: 1 } },
      { t: 'יותר משלוש שנים, יורד{|ת} ועולה{|} שוב', v: 'd', s: { allornothing: 2 } } ] },
    { id: 'tried', multi: true, q: 'מה כבר ניסית?', hint: 'אפשר לבחור כמה תשובות.', opts: [
      { t: 'דיאטה קיצונית, צום או קטו', v: 'extreme', s: { allornothing: 2 } },
      { t: 'תפריט קבוע מדיאטנית או מאפליקציה', v: 'menu', s: { allornothing: 1, planning: -1 } },
      { t: 'ספירת קלוריות באפליקציה', v: 'count', s: { hidden: -1 } },
      { t: 'אימונים או ריצה, בלי לשנות תזונה', v: 'gym', s: { hidden: 1 } },
      { t: 'עוד לא ניסיתי משהו מסודר', v: 'none', only: true } ] },
    { id: 'day', q: 'איך נראה בדרך כלל יום חול שלך מבחינת אוכל?', opts: [
      { t: 'כמעט לא {אוכל|אוכלת} עד הצהריים, ובערב אוכל{|ת} הרבה', s: { evening: 3, planning: 1, protein: 1 } },
      { t: 'בוקר וצהריים מסודרים, הערב מתפרק', s: { evening: 2 } },
      { t: 'נשנושים לאורך כל היום, בלי ארוחות של ממש', s: { planning: 2, hidden: 2, protein: 1 } },
      { t: 'שלוש ארוחות מסודרות, פחות או יותר', s: {} } ] },
    { id: 'night', q: 'מה קורה בערב, אחרי שהילדים נרדמים או כשהיום נגמר?', opts: [
      { t: 'זה הזמן שלי. משהו מתוק או מלוח מול המסך', s: { evening: 3, stress: 1 } },
      { t: 'פותח{|ת} את המקרר ״רק לטעום״ כמה פעמים', s: { evening: 2, hidden: 1 } },
      { t: 'לפעמים נשנוש קטן, בלי דרמה', s: { evening: 1 } },
      { t: 'בדרך כלל לא {אוכל|אוכלת} אחרי ארוחת הערב', s: {} } ] },
    { id: 'protein', q: 'בכמה מהארוחות שלך יש מקור חלבון ממשי?', hint: 'עוף, בשר, דג, ביצים, טונה, קוטג׳, יוגורט חלבון, טופו או קטניות.', opts: [
      { t: 'כמעט באף אחת', s: { protein: 3 } },
      { t: 'בארוחה אחת ביום, בדרך כלל בערב', s: { protein: 2 } },
      { t: 'בשתי ארוחות', s: { protein: 1 } },
      { t: 'כמעט בכל ארוחה', s: {} } ] },
    { id: 'hunger', q: 'איך הרעב שלך במהלך היום?', opts: [
      { t: 'רעב חזק בערב, אחרי יום של מעט אוכל', s: { evening: 1, protein: 1, planning: 1 } },
      { t: 'רעב{|ה} שוב זמן קצר אחרי שאכלתי', s: { protein: 2 } },
      { t: '{אוכל|אוכלת} גם בלי רעב, מלחץ, עייפות או שעמום', s: { stress: 2 } },
      { t: 'רוב הזמן בסדר', s: {} } ] },
    { id: 'weekend', q: 'איך נראה אצלך סוף השבוע?', opts: [
      { t: 'מחמישי בערב ועד שבת זה ״חופש מהדיאטה״', s: { weekend: 3, allornothing: 1 } },
      { t: 'ארוחת שישי גדולה, ושבת עם אירוחים ונשנושים', s: { weekend: 2 } },
      { t: 'קצת יותר מבאמצע השבוע, אבל בשליטה', s: { weekend: 1 } },
      { t: 'די דומה לשאר השבוע', s: {} } ] },
    { id: 'extras', multi: true, q: 'מה מהדברים האלה קורה אצלך באופן קבוע?', hint: 'אפשר לבחור כמה תשובות.', opts: [
      { t: 'שמן זית, טחינה או אגוזים בלי למדוד (״זה בריא״)', s: { hidden: 1 } },
      { t: 'קפה עם חלב וסוכר, שתייה מתוקה או מיצים', s: { hidden: 1 } },
      { t: 'אוכל{|ת} את השאריות של הילדים', s: { hidden: 1 } },
      { t: 'טעימות תוך כדי בישול', s: { hidden: 1 } },
      { t: 'אלכוהול כמה פעמים בשבוע', s: { hidden: 1, weekend: 1 } },
      { t: 'אף אחד מאלה', only: true, s: {} } ] },
    { id: 'tracking', q: 'איך {אתה עוקב|את עוקבת} אחרי ההתקדמות?', opts: [
      { t: 'נשקל{|ת} כל בוקר ומתבאס{|ת} כשהמספר עולה', s: { scale: 3 } },
      { t: 'נשקל{|ת} מדי פעם, כשמתחשק', s: { scale: 2 } },
      { t: 'לא נשקל{|ת} בכלל. עדיף לא לדעת', s: { scale: 2 } },
      { t: 'נשקל{|ת} באופן קבוע ומסתכל{|ת} על הממוצע השבועי', s: {} } ] },
    { id: 'slip', q: 'מה קורה אחרי יום ״לא טוב״, כמו אירוע, יום עמוס או נשנוש גדול?', opts: [
      { t: '״הרסתי, אז כבר לא משנה״. ממשיך{|ה} עד סוף השבוע', s: { allornothing: 3, weekend: 1 } },
      { t: 'מרגיש{|ה} אשמה ומנסה לפצות ברעב ביום שאחרי', s: { allornothing: 2, evening: 1 } },
      { t: 'לוקח לי כמה ימים לחזור למסלול', s: { allornothing: 1 } },
      { t: 'ממשיך{|ה} כרגיל מהארוחה הבאה', s: {} } ] },
    { id: 'sleep', q: 'כמה שעות {אתה ישן|את ישנה} ברוב הלילות?', opts: [
      { t: 'פחות מ־6 שעות', s: { stress: 3 } },
      { t: 'משתנה מאוד, הילדים מעירים', s: { stress: 2 } },
      { t: '6 עד 7 שעות', s: { stress: 1 } },
      { t: '7 שעות ומעלה', s: {} } ] },
    { id: 'move', q: 'מה מצב הפעילות הגופנית שלך?', opts: [
      { t: 'כמעט לא זז{|ה}. עבודה מול מחשב ונסיעות ברכב', s: { activity: 3 } },
      { t: 'הולך{|ת} קצת, בלי אימונים קבועים', s: { activity: 2 } },
      { t: 'רק הליכות, ריצה או קרדיו, בלי אימוני כוח', s: { activity: 1 } },
      { t: 'אימוני כוח פעמיים בשבוע או יותר', s: {} } ] },
    { id: 'plan', q: 'כמה פעמים בשבוע מה שאכלת נקבע לפי מה שהיה בהישג יד?', hint: 'משלוח, קפיטריה, מה שנשאר בבית.', opts: [
      { t: 'רוב הימים', s: { planning: 3 } },
      { t: 'פעמיים־שלוש בשבוע', s: { planning: 2 } },
      { t: 'לפעמים', s: { planning: 1 } },
      { t: 'כמעט אף פעם, יש לי תכנון', s: {} } ] }
  ];

  const GOAL = {
    a: ['עד 5 ק״ג', 'כחודש וחצי עד שלושה חודשים'],
    b: ['5 עד 10 ק״ג', 'כשלושה עד חמישה חודשים'],
    c: ['10 עד 20 ק״ג', 'כארבעה עד תשעה חודשים'],
    d: ['יותר מ־20 ק״ג', 'כחצי שנה עד שנה, בשלבים']
  };

  /* ---------- Max score per category (for normalising) ---------- */
  const MAX = {};
  for (const k of ORDER) MAX[k] = 0;
  for (const q of Q) {
    for (const k of ORDER) {
      const pts = q.opts.map(o => (o.s && o.s[k]) || 0);
      MAX[k] += q.multi ? pts.filter(p => p > 0).reduce((a, b) => a + b, 0) : Math.max(0, ...pts);
    }
  }

  /* ---------- State ---------- */
  let st = { i: 0, a: {}, name: '', done: false };
  const load = () => { try { const v = JSON.parse(localStorage.getItem(STORE) || 'null'); if (v && v.a) st = v; } catch (e) {} };
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) {} };
  const track = (k, d) => { try { window.papafitTrack && window.papafitTrack(k, d || {}); } catch (e) {} };

  const fem = () => st.a.gender && Q[0].opts[st.a.gender[0]].v === 'f';
  const g = s => s.replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_, m, f) => (fem() ? f : m));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const val = id => { const q = Q.find(x => x.id === id); const a = st.a[id]; return a && a.length ? q.opts[a[0]].v : null; };

  const app = document.getElementById('quiz-app');
  const intro = document.getElementById('quiz-intro');
  if (!app || !intro) return;

  function scores() {
    const raw = {};
    for (const k of ORDER) raw[k] = 0;
    for (const q of Q) for (const idx of (st.a[q.id] || [])) {
      const s = q.opts[idx].s || {};
      for (const k in s) raw[k] += s[k];
    }
    return ORDER.map((k, n) => ({ k, pct: Math.max(0, Math.min(100, Math.round((raw[k] / MAX[k]) * 100))), n }))
      .sort((x, y) => y.pct - x.pct || x.n - y.n);
  }

  /* ---------- Rendering ---------- */
  function show(html, focusSel) {
    intro.hidden = true;
    app.hidden = false;
    app.innerHTML = html;
    const f = app.querySelector(focusSel || 'h2');
    if (f) { f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
    const top = app.getBoundingClientRect().top + window.scrollY - 90;
    if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  function renderQuestion() {
    const q = Q[st.i];
    const total = Q.length;
    const sel = st.a[q.id] || [];
    const pct = Math.round((st.i / total) * 100);
    const opts = q.opts.map((o, n) => `<li><button type="button" class="quiz-opt${sel.includes(n) ? ' is-on' : ''}" data-n="${n}" ${q.multi ? `role="checkbox" aria-checked="${sel.includes(n)}"` : `aria-pressed="${sel.includes(n)}"`}><span class="quiz-mark" aria-hidden="true"></span><span>${esc(g(o.t))}</span></button></li>`).join('');
    show(`<div class="quiz-card quiz-step">
      <div class="quiz-top">
        ${st.i > 0 ? '<button type="button" class="quiz-back" data-act="back"><span aria-hidden="true">→</span> חזרה</button>' : '<span></span>'}
        <span class="quiz-count" aria-live="polite">שאלה ${st.i + 1} מתוך ${total}</span>
      </div>
      <div class="quiz-bar" role="progressbar" aria-label="התקדמות בשאלון" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${Math.max(pct, 4)}%"></span></div>
      <h2 class="quiz-q">${esc(g(q.q))}</h2>
      ${q.hint ? `<p class="quiz-hint">${esc(g(q.hint))}</p>` : ''}
      <ul class="quiz-opts${q.multi ? ' is-multi' : ''}" ${q.multi ? 'role="group"' : ''} aria-label="תשובות">${opts}</ul>
      ${q.multi ? `<button type="button" class="button quiz-next" data-act="next" ${sel.length ? '' : 'disabled'}>המשך</button>` : ''}
    </div>`, '.quiz-q');
  }

  function renderName() {
    show(`<div class="quiz-card quiz-step">
      <div class="quiz-top"><button type="button" class="quiz-back" data-act="back"><span aria-hidden="true">→</span> חזרה</button><span class="quiz-count">כמעט סיימנו</span></div>
      <div class="quiz-bar" role="progressbar" aria-label="התקדמות בשאלון" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><span style="width:100%"></span></div>
      <h2 class="quiz-q">${esc(g('כל הכבוד, עברת את כל השאלות. איך לקרוא לך?'))}</h2>
      <p class="quiz-hint">לא חובה. השם מופיע רק בתוצאות שלך ולא נשלח לשום מקום.</p>
      <form class="quiz-name" data-act="finish">
        <label for="quiz-name-input" class="sr-only">שם פרטי</label>
        <input id="quiz-name-input" name="name" type="text" autocomplete="given-name" maxlength="30" placeholder="שם פרטי" value="${esc(st.name || '')}">
        <button type="submit" class="button">לראות את התוצאות שלי</button>
      </form>
    </div>`, '.quiz-q');
  }

  function renderLoading() {
    show(`<div class="quiz-card quiz-loading" role="status">
      <span class="quiz-spinner" aria-hidden="true"></span>
      <h2>מנתח את התשובות שלך...</h2>
      <p>בודק אכילת ערב, סופי שבוע, חלבון, שינה ועוד</p>
    </div>`);
    setTimeout(renderResults, matchMedia('(prefers-reduced-motion: reduce)').matches ? 200 : 1600);
  }

  function waLink(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }

  function renderResults() {
    const sc = scores();
    const top = sc.slice(0, 3);
    const rest = sc.slice(3);
    const name = (st.name || '').trim();
    const goal = GOAL[val('goal') || 'b'];
    const years = val('years');
    const tried = (st.a.tried || []).map(n => Q[3].opts[n].v);
    const allLow = top[0].pct < 35;
    const level = p => (p >= 60 ? ['גבוהה', 'high'] : p >= 35 ? ['בינונית', 'mid'] : ['נמוכה', 'low']);
    const first = REASONS[top[0].k].actions[0];

    const msgAlex = `היי אלכס${name ? ', אני ' + name : ''}. מילאתי את השאלון ״למה אני לא ${g('{מצליח|מצליחה}')} לרדת במשקל״ באתר.\nהסיבות העיקריות שיצאו לי:\n${top.map((t, i) => `${i + 1}. ${REASONS[t.k].title}`).join('\n')}\nהיעד שלי: ${goal[0]}.\nאשמח לשיחת ייעוץ קצרה`;
    const msgSelf = `התוצאות שלי בשאלון ״למה אני לא ${g('{מצליח|מצליחה}')} לרדת במשקל״ של PAPAFIT:\n${top.map((t, i) => `${i + 1}. ${REASONS[t.k].title}`).join('\n')}\nהצעד הראשון שלי: ${g(first)}\n${QUIZ_URL}`;

    const intro = allLow
      ? 'הבסיס שלך טוב יותר משל רוב האנשים שממלאים את השאלון. אין פה ״בעיה גדולה״ אחת, ולכן מה שעוצר אותך כנראה נמצא בפרטים הקטנים: כמויות שקשה להעריך בעין, קצב שנראה איטי מדי, או שינוי קטן שעוד לא קיבל מספיק זמן. אלה שלושת הכיוונים שהכי כדאי לבדוק אצלך.'
      : 'לפי התשובות שלך, יש שלושה דברים שעוצרים אותך יותר מכל השאר. החדשות הטובות: אף אחד מהם הוא לא ״חוסר כוח רצון״ ולא ״מטבוליזם הרוס״. כולם דברים שאפשר לשנות, בלי דיאטה קיצונית ובלי לוותר על ארוחת שישי.';

    let story = '';
    if (years === 'd' || tried.includes('extreme')) {
      story = `<section class="result-note"><h3>${esc(g('ולמה הפעם זה יכול להיות אחרת'))}</h3><p>${esc(g(years === 'd'
        ? 'אחרי כמה שנים של ירידות ועליות, קל להגיע למסקנה ש״אצלי זה פשוט לא עובד״. אבל כמעט כל מי שאני פוגש עם היסטוריה כזו לא נכשל בגלל הגוף, אלא בגלל שכל ניסיון נבנה לשבוע מושלם. כשבונים תוכנית שמחזיקה גם בשבוע עמוס, עם ילדים, אירועים וארוחת שישי, התוצאה נשארת.'
        : 'דיאטה קיצונית מורידה משקל מהר, אבל היא בנויה להיגמר. ברגע שהיא נגמרת, ההרגלים הישנים חוזרים ואיתם המשקל. המטרה הפעם היא לא לרדת הכי מהר, אלא לרדת בדרך {שתוכל|שתוכלי} להמשיך איתה גם אחרי שהמשקל ירד.'))}</p></section>`;
    }

    const card = (t, i) => {
      const r = REASONS[t.k];
      const lv = level(t.pct);
      return `<article class="result-reason">
        <div class="result-reason-head"><span class="result-rank" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <div><h3>${esc(g(r.title))}</h3><span class="result-level is-${lv[1]}">השפעה ${lv[0]}</span></div></div>
        ${r.why.map(p => `<p>${esc(g(p))}</p>`).join('')}
        <div class="result-actions"><strong>מה לעשות כבר השבוע</strong><ul>${r.actions.map(a => `<li>${esc(g(a))}</li>`).join('')}</ul></div>
        <p class="result-more"><a href="${r.link[0]}">${esc(r.link[1])}</a></p>
      </article>`;
    };

    const bars = sc.map(t => {
      const lv = level(t.pct);
      return `<li><span class="bar-label">${esc(REASONS[t.k].short)}</span><span class="bar-track" aria-hidden="true"><span class="bar-fill is-${lv[1]}" style="width:${Math.max(t.pct, 3)}%"></span></span><span class="bar-val">${lv[0]}</span></li>`;
    }).join('');

    show(`<div class="quiz-results">
      <header class="result-hero">
        <p class="eyebrow">התוצאות שלך</p>
        <h2>${name ? esc(name) + ', ' : ''}${esc(g(allLow ? 'זה מה שכדאי לבדוק אצלך' : 'זה מה שעוצר אותך'))}</h2>
        <p class="intro">${esc(g(intro))}</p>
        <ol class="result-summary">${top.map(t => `<li>${esc(g(REASONS[t.k].title))}</li>`).join('')}</ol>
      </header>

      <section class="result-profile" aria-labelledby="profile-title">
        <h3 id="profile-title">הפרופיל המלא שלך</h3>
        <p class="sub">עד כמה כל אחד מהגורמים משפיע אצלך, לפי התשובות.</p>
        <ul class="result-bars">${bars}</ul>
      </section>

      <section aria-labelledby="reasons-title">
        <h3 id="reasons-title" class="result-section-title">הסיבות העיקריות, ומה עושים איתן</h3>
        ${top.map(card).join('')}
      </section>

      <section class="result-first">
        <span class="guide-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></span>
        <div><h3>הצעד הראשון שלך</h3><p>${esc(g('אל {תנסה|תנסי} לתקן הכול מחר בבוקר. זה בדיוק מה שהפיל את הניסיונות הקודמים. {בחר|בחרי} דבר אחד, {עשה|עשי} אותו שבועיים, ורק אז {הוסף|הוסיפי} את הבא:'))}</p><p class="result-first-step">${esc(g(first))}</p></div>
      </section>

      <section class="result-timeline">
        <h3>כמה זמן זה אמור לקחת?</h3>
        <p>${esc(g(`היעד שלך הוא ${goal[0]}. בקצב בריא שאפשר להחזיק, בערך חצי קילו עד קילו בשבוע לפי נקודת ההתחלה, זה ${goal[1]}. זה אולי נשמע הרבה, אבל זה פחות מהזמן שעובר בין דיאטה לדיאטה.`))}</p>
      </section>

      ${story}

      <section class="callout result-cta" aria-labelledby="cta-title">
        <div class="result-cta-copy">
          <h2 id="cta-title">${esc(g(name ? `${name}, {רוצה|רוצה} שנבנה את זה יחד?` : '{רוצה|רוצה} שנבנה את זה יחד?'))}</h2>
          <p>${esc(g('השאלון מראה איפה הבעיה. בשיחת ייעוץ קצרה נעבור יחד על התוצאות שלך, נבין מה מתאים לשגרה שלך, ונחליט מאיפה הכי נכון להתחיל.'))}</p>
          <ul><li>15 דקות בטלפון</li><li>ללא עלות וללא התחייבות</li><li>אני עונה אישית, לא בוט ולא נציג</li></ul>
          <div class="result-cta-actions">
            <a class="button" data-cta="quiz_result" href="${waLink(msgAlex)}" target="_blank" rel="noopener noreferrer">${WA_ICON}לשלוח לאלכס את התוצאות</a>
          </div>
          <p class="result-cta-note">ההודעה כבר כתובה עם התוצאות שלך. רק ללחוץ ״שליחה״ בוואטסאפ.</p>
        </div>
        <figure class="result-cta-photo"><img src="/images/alex-avatar-new.webp" alt="אלכס קביטניצקי" width="400" height="400" loading="lazy" decoding="async"><figcaption><strong>אלכס קביטניצקי</strong>מלווה תזונה ובניית הרגלים להורים עסוקים · מעל 800 לקוחות</figcaption></figure>
      </section>

      <section class="result-stories" aria-labelledby="stories-title">
        <h3 id="stories-title">הם התחילו בדיוק מאותה נקודה</h3>
        <ul class="result-story-list">
          <li><img src="/images/success/guide-dima.webp" alt="תמונות ההתקדמות של דימה" width="924" height="850" loading="lazy" decoding="async"><p><strong>דימה</strong> <span class="story-badge">20 ק״ג</span> בחצי שנה</p></li>
          <li><img src="/images/success/guide-lihi.webp" alt="תמונות ההתקדמות של ליהי" width="533" height="518" loading="lazy" decoding="async"><p><strong>ליהי</strong> <span class="story-badge">8 ק״ג</span> בחצי שנה</p></li>
          <li><img src="/images/success/guide-dennis.webp" alt="תמונות ההתקדמות של דניס" width="860" height="850" loading="lazy" decoding="async"><p><strong>דניס</strong> <span class="story-badge">12 ק״ג</span> בארבעה וחצי חודשים</p></li>
        </ul>
        <p class="sub">התוצאות משתנות לפי נקודת ההתחלה, העקביות ונסיבות החיים.</p>
      </section>

      <section class="result-tools">
        <h3>${esc(g('ומה עוד {אתה יכול|את יכולה} לעשות עכשיו'))}</h3>
        <div class="result-tools-grid">
          <a class="result-tool" data-cta="quiz_share_self" href="https://api.whatsapp.com/send?text=${encodeURIComponent(msgSelf)}" target="_blank" rel="noopener noreferrer"><strong>לשמור את התוצאות</strong><span>שליחה לעצמך בוואטסאפ</span></a>
          <a class="result-tool" href="/calorie-calculator"><strong>לחשב את התקציב הקלורי שלי</strong><span>כמה לאכול ביום כדי לרדת, וכמה חלבון</span></a>
          <a class="result-tool" href="/weight-loss-guide"><strong>לקרוא את המדריך המלא</strong><span>9 עקרונות לירידה במשקל עם עבודה וילדים</span></a>
          <button type="button" class="result-tool" data-act="restart"><strong>למלא את השאלון מחדש</strong><span>או לתת למישהו אחר לנסות</span></button>
        </div>
      </section>

      <p class="result-disclaimer">התוצאות מבוססות על התשובות שלך בלבד ואינן אבחנה רפואית. אם יש מצב רפואי, תרופות, היריון או היסטוריה של הפרעת אכילה, חשוב להתייעץ עם רופא או דיאטנית קלינית.</p>
    </div>`, '.result-hero h2');
  }

  /* ---------- Flow ---------- */
  function start(fresh) {
    if (fresh) st = { i: 0, a: {}, name: '', done: false };
    track('quiz_start', {});
    save();
    st.done ? renderResults() : (st.i >= Q.length ? renderName() : renderQuestion());
  }

  function answer(n) {
    const q = Q[st.i];
    if (q.multi) {
      let sel = (st.a[q.id] || []).slice();
      const opt = q.opts[n];
      if (sel.includes(n)) sel = sel.filter(x => x !== n);
      else if (opt.only) sel = [n];
      else sel = sel.filter(x => !q.opts[x].only).concat(n);
      st.a[q.id] = sel;
      save();
      app.querySelectorAll('.quiz-opt').forEach(b => {
        const on = sel.includes(+b.dataset.n);
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-checked', String(on));
      });
      app.querySelector('.quiz-next').disabled = !sel.length;
      return;
    }
    st.a[q.id] = [n];
    app.querySelectorAll('.quiz-opt').forEach(b => { const on = +b.dataset.n === n; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); b.disabled = true; });
    setTimeout(next, matchMedia('(prefers-reduced-motion: reduce)').matches ? 60 : 260);
  }

  function next() {
    st.i += 1;
    save();
    st.i >= Q.length ? renderName() : renderQuestion();
  }

  app.addEventListener('click', e => {
    const opt = e.target.closest('.quiz-opt');
    if (opt) return answer(+opt.dataset.n);
    const act = e.target.closest('[data-act]');
    if (!act) return;
    const a = act.dataset.act;
    if (a === 'back') { st.i = Math.max(0, st.i - 1); st.done = false; save(); renderQuestion(); }
    else if (a === 'next') next();
    else if (a === 'restart') { st = { i: 0, a: {}, name: '', done: false }; save(); renderQuestion(); }
  });
  app.addEventListener('submit', e => {
    e.preventDefault();
    st.name = (e.target.elements.name.value || '').trim().slice(0, 30);
    st.done = true;
    save();
    const sc = scores();
    track('quiz_complete', { quiz_top_reason: sc[0].k, quiz_reasons: sc.slice(0, 3).map(x => x.k).join(',') });
    renderLoading();
  });

  /* ---------- Intro wiring ---------- */
  const WA_ICON = document.querySelector('#wa-icon-tpl')?.innerHTML || '';
  load();
  const startBtns = document.querySelectorAll('[data-quiz-start]');
  startBtns.forEach(b => b.addEventListener('click', () => start(b.dataset.quizStart === 'fresh' || !Object.keys(st.a).length)));
  const resume = document.getElementById('quiz-resume');
  if (resume && Object.keys(st.a).length) {
    resume.hidden = false;
    resume.textContent = st.done ? 'לצפייה בתוצאות הקודמות שלך' : 'להמשיך מאיפה שהפסקתי';
    resume.addEventListener('click', () => start(false));
  }
  if (location.hash === '#start') start(!Object.keys(st.a).length);
})();
