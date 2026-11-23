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
