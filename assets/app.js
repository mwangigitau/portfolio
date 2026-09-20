const header = document.querySelector('[data-header]');
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.repo-card')];
const search = document.querySelector('[data-repo-search]');
const emptyState = document.querySelector('[data-empty-state]');
const year = document.querySelector('[data-year]');

let activeFilter = 'all';

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 18);
};

const filterRepositories = () => {
  const query = search?.value.trim().toLowerCase() ?? '';
  let visible = 0;

  cards.forEach((card) => {
    const languageMatches = activeFilter === 'all' || card.dataset.language === activeFilter;
    const textMatches = !query || `${card.dataset.search} ${card.textContent}`.toLowerCase().includes(query);
    const show = languageMatches && textMatches;
    card.hidden = !show;
    if (show) visible += 1;
  });

  if (emptyState) emptyState.hidden = visible !== 0;
};

filters.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    filterRepositories();
  });
});

search?.addEventListener('input', filterRepositories);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
filterRepositories();

if (year) year.textContent = new Date().getFullYear();
