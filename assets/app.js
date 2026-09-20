/* Portfolio interactions: header state, scroll progress, scrollspy,
   mobile navigation, repository filtering and reveal animations. */

const header = document.querySelector('[data-header]');
const progress = document.querySelector('.scroll-progress span');
const navLinks = [...document.querySelectorAll('.nav a, .mobile-nav a')].filter((link) => link.hash);
const navToggle = document.querySelector('[data-nav-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const search = document.querySelector('[data-repo-search]');
const emptyState = document.querySelector('[data-empty-state]');
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.repo-card')];
const year = document.querySelector('[data-year]');

let activeFilter = 'all';

/* ------------------------------------------------------------ header state */
const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 16);

  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(y / max, 1) : 0;
    progress.style.setProperty('--p', ratio.toFixed(4));
  }

  updateScrollspy(y);
};

/* -------------------------------------------------------------- scrollspy */
const sections = [...document.querySelectorAll('main section[id]')];

const updateScrollspy = (y) => {
  if (!sections.length) return;
  const line = y + (header?.offsetHeight ?? 74) + 120;

  let current = '';
  sections.forEach((section) => {
    if (section.offsetTop <= line) current = section.id;
  });

  navLinks.forEach((link) => {
    const active = link.hash === `#${current}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
};

/* ----------------------------------------------------------- mobile menu */
const setMenu = (open) => {
  if (!mobileNav || !navToggle) return;
  mobileNav.hidden = !open;
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
};

navToggle?.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1080) setMenu(false);
});

/* ------------------------------------------------------- repo filtering */
const filterRepositories = () => {
  const query = search?.value.trim().toLowerCase() ?? '';
  let visible = 0;

  cards.forEach((card) => {
    const languageMatches = activeFilter === 'all' || card.dataset.language === activeFilter;
    const haystack = `${card.dataset.search ?? ''} ${card.textContent}`.toLowerCase();
    const show = languageMatches && (!query || haystack.includes(query));
    card.hidden = !show;
    if (show) visible += 1;
  });

  if (emptyState) emptyState.hidden = visible !== 0;
};

filters.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter ?? 'all';
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    filterRepositories();
  });
});

search?.addEventListener('input', filterRepositories);

/* --------------------------------------------------------------- reveals */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px' });

const reveals = [...document.querySelectorAll('.reveal')];
reveals.forEach((element) => {
  const siblings = [...(element.parentElement?.children ?? [])].filter((child) => child.classList.contains('reveal'));
  const index = siblings.indexOf(element);
  element.style.setProperty('--d', `${Math.max(index, 0) * 70}ms`);
  observer.observe(element);
});

/* ------------------------------------------------------------------ init */
if (year) year.textContent = new Date().getFullYear();

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    onScroll();
    ticking = false;
  });
}, { passive: true });

onScroll();
filterRepositories();
