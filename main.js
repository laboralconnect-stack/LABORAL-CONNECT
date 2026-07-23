const GA_MEASUREMENT_ID = '[completar]';
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#main-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav?.querySelectorAll('a, button').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year')?.replaceChildren(String(new Date().getFullYear()));

const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

const banner = document.querySelector('.cookie-banner');
const choice = localStorage.getItem('lc-cookie-consent');
if (banner && (!choice || location.hash === '#configurar-cookies')) banner.hidden = false;
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

const adviceModal = document.querySelector('.advice-modal');
const adviceDialog = document.querySelector('.advice-dialog');
const adviceForm = document.querySelector('.advice-form');
const adviceConsent = adviceForm?.querySelector('[name="consentimiento"]');
const adviceSubmit = adviceForm?.querySelector('.advice-submit');
const adviceError = adviceForm?.querySelector('.form-error');
const adviceSuccess = adviceModal?.querySelector('.advice-success');
let adviceTrigger = null;

function syncAdviceSubmit() {
  if (adviceSubmit) adviceSubmit.disabled = !adviceConsent?.checked;
}

function openAdviceModal(event) {
  adviceTrigger = event.currentTarget;
  if (adviceSuccess && !adviceSuccess.hidden) {
    adviceSuccess.hidden = true;
    adviceForm.hidden = false;
    adviceError.hidden = true;
    syncAdviceSubmit();
  }
  adviceModal.hidden = false;
  adviceModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  adviceModal.querySelector('input:not([type="hidden"])')?.focus();
}

function closeAdviceModal() {
  adviceModal.hidden = true;
  adviceModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  adviceTrigger?.focus();
}

document.querySelectorAll('[data-open-advice]').forEach(button => button.addEventListener('click', openAdviceModal));
adviceModal?.querySelectorAll('[data-close-advice]').forEach(button => button.addEventListener('click', closeAdviceModal));
adviceConsent?.addEventListener('change', syncAdviceSubmit);
syncAdviceSubmit();

document.addEventListener('keydown', event => {
  if (adviceModal?.hidden) return;
  if (event.key === 'Escape') { closeAdviceModal(); return; }
  if (event.key !== 'Tab') return;
  const focusable = [...adviceDialog.querySelectorAll('button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href]')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

adviceForm?.addEventListener('submit', async event => {
  event.preventDefault();
  adviceError.hidden = true;
  if (!adviceForm.checkValidity()) { adviceForm.reportValidity(); return; }
  const originalText = adviceSubmit.textContent;
  adviceSubmit.disabled = true;
  adviceSubmit.textContent = 'Enviando…';
  try {
    const response = await fetch(adviceForm.action, {
      method: 'POST',
      body: new FormData(adviceForm),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Formspree response was not successful');
    adviceForm.hidden = true;
    adviceSuccess.hidden = false;
    adviceSuccess.focus();
    adviceForm.reset();
  } catch (error) {
    adviceError.hidden = false;
    adviceError.focus?.();
  } finally {
    adviceSubmit.textContent = originalText;
    syncAdviceSubmit();
  }
});

const whatsappFloat = document.querySelector('.whatsapp-float');
const pageFooter = document.querySelector('footer');
if (whatsappFloat && pageFooter && 'IntersectionObserver' in window) {
  const footerObserver = new IntersectionObserver(entries => {
    whatsappFloat.classList.toggle('footer-visible', entries[0].isIntersecting);
  }, { threshold: 0.01 });
  footerObserver.observe(pageFooter);
}
