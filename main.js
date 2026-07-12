const GA_MEASUREMENT_ID = '[completar]';
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#main-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

const banner = document.querySelector('.cookie-banner');
const choice = localStorage.getItem('lc-cookie-consent');
if (!choice) banner.hidden = false;
function loadAnalytics() {
  if (!/^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID)) return;
  const script = document.createElement('script');
  script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments)}
  gtag('js', new Date()); gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
}
if (choice === 'accepted') loadAnalytics();
document.querySelector('.accept-cookies')?.addEventListener('click', () => { localStorage.setItem('lc-cookie-consent','accepted'); banner.hidden = true; loadAnalytics(); });
document.querySelector('.reject-cookies')?.addEventListener('click', () => { localStorage.setItem('lc-cookie-consent','rejected'); banner.hidden = true; });
document.querySelector('.cookie-settings')?.addEventListener('click', () => { banner.hidden = false; });
