PAPAFIT v18 | lead magnets | based on v17

Upload the extracted contents to the same Cloudflare project, exactly as before.

New pages (Hebrew):
- /weight-loss-quiz      "למה אתה לא מצליח לרדת במשקל?" 15-question quiz with personal results,
                         explanations, weekly actions and a WhatsApp CTA prefilled with the results
- /calorie-calculator    personal calorie-balance calculator (maintenance, daily target, protein,
                         weekly budget with Friday dinner, time to goal) with a WhatsApp CTA

Integration:
- New "מחשבון קלוריות" tab in the main menu (desktop + mobile)
- Quiz banner on the home page (after "נשמע מוכר?"), card inside every Hebrew article,
  links on /articles and inside the guide
- sitemap.xml, llms.txt and _headers updated

Tracking (GTM, only after cookie consent): papafit_quiz_start, papafit_quiz_complete,
papafit_calculator_complete; WhatsApp clicks arrive as papafit_generate_lead with
button_location quiz_result / calc_result / quiz_share_self / calc_share_self.
No data is stored on a server; answers stay in the visitor's browser.

Calculator fixes (review round 1):
- Sex field must be chosen: inline red message + summary of all invalid fields
- Small/low-activity people (maintenance less than 200 kcal above the safe minimum)
  get a dedicated message (more movement, strength, talk to Alex) instead of a "lose" number
- Old results are hidden whenever the form has an error
- Time to goal = plain arithmetic at the starting pace, with a note that it slows down
- Russian version: /ru/calorie-calculator, "Калькулятор калорий" tab in the Russian menu,
  HE/RU switch buttons link between the two calculator pages

Round 2:
- Russian quiz: /ru/weight-loss-quiz (full translation, same scoring), banner on /ru,
  card in every Russian article, link on /ru/articles and inside /ru/weight-loss-guide
- HE/RU switch buttons link between the two quiz pages
- Design: the black boxes (quiz preview, quiz/calculator CTA, calculator main number)
  replaced with light warm cards (soft orange gradient, thin border, soft shadow)

Round 3 - strength program builder:
- /strength-program: 7 questions (goal, gym/home/bodyweight, experience, days 2-5,
  minutes per workout, sensitive knees/back/shoulders) -> full weekly program with
  exercises, sets, reps, RIR, rest, weekly sets per muscle vs. recommended range,
  max 8 hard sets per muscle per workout, "am I progressing? yes/no" rule for adding sets
- Send to myself on WhatsApp, print / save as PDF, or consult Alex (prefilled message)
- Linked from the home quiz banner, /articles, quiz + calculator results and guide principle 8
- Tracking: papafit_strength_start, papafit_strength_complete, papafit_strength_print;
  WhatsApp clicks: strength_result / strength_share_self
