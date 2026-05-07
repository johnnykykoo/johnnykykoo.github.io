/* ==========================================================================
   Johnny Koo — interactions
   ========================================================================== */

// Sticky nav border on scroll
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 4) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Collapsible cards — toggle is-open, allow only one open at a time (optional)
const cards = document.querySelectorAll('[data-card]');
const SINGLE_OPEN = false; // change to true if only one card should be open at a time

cards.forEach(card => {
  const trigger = card.querySelector('[data-card-trigger]');
  if (!trigger) return;
  trigger.setAttribute('aria-expanded', 'false');
  trigger.addEventListener('click', () => {
    const willOpen = !card.classList.contains('is-open');
    if (SINGLE_OPEN && willOpen) {
      cards.forEach(c => {
        c.classList.remove('is-open');
        c.querySelector('[data-card-trigger]')?.setAttribute('aria-expanded', 'false');
      });
    }
    card.classList.toggle('is-open', willOpen);
    trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });
});

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}
