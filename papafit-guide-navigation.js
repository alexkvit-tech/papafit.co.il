const guideMenu = document.getElementById('mobile-menu');
const guideMenuButton = document.querySelector('[aria-controls="mobile-menu"]');

function setGuideMenu(open) {
  guideMenu.hidden = !open;
  guideMenuButton.setAttribute('aria-expanded', String(open));
  const ru = document.documentElement.lang === 'ru';
  guideMenuButton.querySelector('.sr-only').textContent = open ? (ru ? 'Закрыть меню' : 'סגירת תפריט') : (ru ? 'Открыть меню' : 'פתיחת תפריט');
}

guideMenuButton.addEventListener('click', () => setGuideMenu(guideMenu.hidden));
guideMenu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setGuideMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !guideMenu.hidden) {
    setGuideMenu(false);
    guideMenuButton.focus();
  }
});
matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
  if (event.matches) setGuideMenu(false);
});
