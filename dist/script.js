const viewer = document.querySelector('#evidence-dialog');
const evidence = window.PT_EVIDENCE || [];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let currentItems = [];
let currentIndex = 0;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#icon-${name}`);
  svg.append(use);
  return svg;
}
function visual(item, fullSize = false) {
  if (!item.src) return element('p', 'image-unavailable', 'Image unavailable.');
  const image = element('img', fullSize ? 'viewer-image' : 'evidence-image');
  image.src = item.src;
  image.alt = item.alt || item.title;
  if (Number.isFinite(item.width) && Number.isFinite(item.height) && item.width > 0 && item.height > 0) {
    image.width = item.width;
    image.height = item.height;
  }
  image.loading = fullSize ? 'eager' : 'lazy';
  image.decoding = 'async';
  image.addEventListener('error', () => {
    image.replaceWith(element('p', 'image-unavailable', 'This image could not be loaded.'));
  }, { once: true });
  return image;
}
function makeCard(item, collection, compact = false) {
  const card = element('button', `${compact ? 'hero-proof-card' : 'evidence-card'} has-image`);
  card.type = 'button';
  card.dataset.evidenceId = item.id;
  card.setAttribute('aria-label', `View ${item.title}`);
  card.setAttribute('aria-haspopup', 'dialog');
  const caption = element('div', 'evidence-card-caption');
  caption.append(element('span', '', item.title), icon('arrow'));
  card.append(visual(item), caption);
  card.addEventListener('click', () => openViewer(item, collection.filter(entry => entry.src)));
  return card;
}
// Full-size viewing is optional; the before/after pairs are always visible in the page.
document.querySelectorAll('[data-growth-image]').forEach(link => {
  const item = evidence.find(entry => entry.id === link.dataset.growthImage && entry.category === 'growth' && entry.src);
  if (!item) return;
  const pair = evidence.filter(entry => entry.category === 'growth' && entry.pairId === item.pairId && entry.src);
  link.setAttribute('aria-haspopup', 'dialog');
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    link.focus({ preventScroll: true });
    openViewer(item, pair);
  });
});
const heroItems = evidence.filter(item => item.src && item.group === 'results' && item.label === 'AFTER').slice(0, 3);
document.querySelector('#hero-proof').replaceChildren(...heroItems.map(item => makeCard(item, heroItems, true)));

function renderViewer() {
  const item = currentItems[currentIndex];
  document.querySelector('#viewer-stage').replaceChildren(visual(item, true));
  document.querySelector('#evidence-title').textContent = item.title;
  const description = document.querySelector('#evidence-description');
  description.textContent = item.description || '';
  description.hidden = !description.textContent;
  document.querySelector('#evidence-count').textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(currentItems.length).padStart(2, '0')}`;
  document.querySelector('#viewer-prev').disabled = currentItems.length < 2;
  document.querySelector('#viewer-next').disabled = currentItems.length < 2;
}
function openViewer(item, collection) {
  if (!collection.length) return;
  currentItems = collection;
  currentIndex = collection.findIndex(entry => entry.id === item.id);
  if (currentIndex < 0) return;
  renderViewer();
  viewer.showModal();
}
function moveViewer(direction) {
  if (!currentItems.length) return;
  currentIndex = (currentIndex + direction + currentItems.length) % currentItems.length;
  renderViewer();
}
document.querySelector('#viewer-close').addEventListener('click', () => viewer.close());
document.querySelector('#viewer-prev').addEventListener('click', () => moveViewer(-1));
document.querySelector('#viewer-next').addEventListener('click', () => moveViewer(1));
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    moveViewer(event.key === 'ArrowLeft' ? -1 : 1);
  }
});
viewer.addEventListener('click', event => {
  if (event.target !== viewer) return;
  const box = viewer.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) viewer.close();
});
new MutationObserver(() => {
  document.body.style.overflow = viewer.open ? 'hidden' : '';
}).observe(viewer, { attributes: true, attributeFilter: ['open'] });

// The confirmed product URL turns every enrolment control into the same direct checkout link.
const course = window.PT_COURSE || {};
function validSelarUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && ['selar.com', 'selar.co', 'www.selar.com', 'www.selar.co'].includes(url.hostname) ? url.href : null;
  } catch { return null; }
}
const checkoutUrl = validSelarUrl(course.selarUrl);
// The Selar homepage is temporary; the supplied product URL will replace it for all CTAs.
const selarDestination = checkoutUrl || 'https://selar.com/';
document.querySelectorAll('[data-purchase]').forEach(link => {
  link.href = selarDestination;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.removeAttribute('aria-haspopup');
  link.setAttribute('aria-describedby', 'checkout-note');
});
document.querySelector('#checkout-note').textContent = checkoutUrl ? 'Purchase securely on Selar. Opens in a new tab.' : 'Opens Selar in a new tab.';
const priceNode = document.querySelector('#course-price');
const priceLabels = document.querySelectorAll('[data-price]');
const money = new Intl.NumberFormat('en-NG', { style: 'currency', currency: course.currency || 'NGN', maximumFractionDigits: 0 });
if (Number.isFinite(course.price) && course.price > 0) {
  priceNode.replaceChildren(element('strong', '', money.format(course.price)));
  priceLabels.forEach(label => { label.textContent = money.format(course.price); });
}

// A disclosure menu keeps ordinary navigation links keyboard accessible.
const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('#main-navigation');
const mobileNavigation = matchMedia('(max-width: 60rem)');
mainNavigation.setAttribute('data-collapsible', '');
function setMenuOpen(open, restoreFocus = false) {
  const expanded = mobileNavigation.matches && open;
  const collapsed = mobileNavigation.matches && !expanded;
  menuToggle.setAttribute('aria-expanded', String(expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  mainNavigation.classList.toggle('is-open', expanded);
  mainNavigation.inert = collapsed;
  if (collapsed) mainNavigation.setAttribute('aria-hidden', 'true');
  else mainNavigation.removeAttribute('aria-hidden');
  if (restoreFocus) menuToggle.focus();
}
function updateNavigation() {
  menuToggle.hidden = !mobileNavigation.matches;
  setMenuOpen(false);
}
menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
mainNavigation.querySelectorAll('a').forEach(link => link.addEventListener('click', async event => {
  if (!mobileNavigation.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  setMenuOpen(false);
  if (event.defaultPrevented || viewer.open || link.hasAttribute('data-purchase')) return;
  const href = link.getAttribute('href');
  const target = href.startsWith('#') && document.getElementById(href.slice(1));
  if (!target) return;
  event.preventDefault();
  await Promise.allSettled(mainNavigation.getAnimations().map(animation => animation.finished));
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  if (location.hash !== href) history.pushState(null, '', href);
  target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') setMenuOpen(false, true);
});
document.addEventListener('click', event => {
  if (menuToggle.getAttribute('aria-expanded') === 'true' && !event.target.closest('.nav')) setMenuOpen(false);
});
mobileNavigation.addEventListener('change', updateNavigation);
updateNavigation();

// The strip itself supports persistent pointer/keyboard pausing without a separate button.
const ribbon = document.querySelector('.ribbon');
const ribbonViewport = ribbon.querySelector('.ribbon-viewport');
const ribbonTrack = ribbon.querySelector('.ribbon-track');
const ribbonGroup = ribbon.querySelector('.ribbon-group');
const ribbonHelp = document.querySelector('#ribbon-motion-help');
const ribbonLabels = Array.from(ribbonGroup.querySelectorAll('span'), label => label.textContent.trim()).join('. ');
const ribbonCopy = ribbonGroup.cloneNode(true);
ribbonCopy.setAttribute('aria-hidden', 'true');
ribbonTrack.append(ribbonCopy);
let ribbonPaused = false;
function updateRibbonPause() {
  ribbon.classList.toggle('is-paused', ribbonPaused);
  if (!reducedMotion.matches) {
    ribbonViewport.setAttribute('aria-pressed', String(ribbonPaused));
    ribbonViewport.title = ribbonPaused ? 'Click or press Enter or Space to resume scrolling' : 'Click or press Enter or Space to pause scrolling';
  }
}
function updateRibbon() {
  const moving = !reducedMotion.matches;
  // Each copy spans at least the viewport, keeping the loop seamless on wide screens.
  ribbonTrack.style.setProperty('--ribbon-width', `${ribbonViewport.clientWidth}px`);
  ribbon.classList.toggle('is-scrolling', moving);
  ribbonViewport.setAttribute('role', moving ? 'button' : 'region');
  ribbonViewport.setAttribute('aria-label', ribbonLabels);
  ribbonHelp.textContent = moving ? 'Click or press Enter or Space to pause or resume scrolling.' : 'Use the arrow keys to read all course highlights.';
  if (!moving) {
    ribbonViewport.removeAttribute('aria-pressed');
    ribbonViewport.removeAttribute('title');
  }
  const overflows = ribbonGroup.offsetWidth > ribbonViewport.clientWidth;
  ribbonViewport.tabIndex = moving || overflows ? 0 : -1;
  updateRibbonPause();
}
function toggleRibbonPause() {
  if (reducedMotion.matches) return;
  ribbonPaused = !ribbonPaused;
  updateRibbonPause();
}
ribbonViewport.addEventListener('click', toggleRibbonPause);
ribbonViewport.addEventListener('keydown', event => {
  if (reducedMotion.matches || !['Enter', ' '].includes(event.key)) return;
  event.preventDefault();
  toggleRibbonPause();
});
const ribbonResizeObserver = new ResizeObserver(updateRibbon);
ribbonResizeObserver.observe(ribbon);
ribbonResizeObserver.observe(ribbonGroup);
reducedMotion.addEventListener('change', updateRibbon);
updateRibbon();

// Below-the-fold sections reveal once. Keyboard focus and reduced motion always expose content.
let sectionObserver = null;
function updateSectionMotion() {
  if (sectionObserver) sectionObserver.disconnect();
  const sections = document.querySelectorAll('main > .section:not(.hero), main > .next');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    sections.forEach(section => section.classList.remove('reveal-on-scroll'));
    return;
  }
  sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      sectionObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -24px 0px', threshold: 0 });
  sections.forEach(section => {
    if (section.classList.contains('is-visible')) return;
    if (section.getBoundingClientRect().top < window.innerHeight) {
      section.classList.add('is-visible');
      return;
    }
    section.classList.add('reveal-on-scroll');
    sectionObserver.observe(section);
  });
}
reducedMotion.addEventListener('change', updateSectionMotion);
updateSectionMotion();

// Keep the reference's enrolment bar available between the main purchase controls.
const hero = document.querySelector('.hero');
const stickyEnrol = document.querySelector('#sticky-enrol');
const backToTop = document.querySelector('#back-to-top');
const checkoutPanel = document.querySelector('.course-offer');
const finalCta = document.querySelector('.next [data-purchase]');
const pageFooter = document.querySelector('footer');
let scrollFrame = 0;
function inViewport(node) {
  const box = node.getBoundingClientRect();
  return box.top < window.innerHeight && box.bottom > 0;
}
function updateScrollControls() {
  scrollFrame = 0;
  backToTop.hidden = window.scrollY < 400;
  const focused = stickyEnrol.contains(document.activeElement);
  stickyEnrol.hidden = !focused && (hero.getBoundingClientRect().bottom > 0 || inViewport(checkoutPanel) || inViewport(finalCta) || inViewport(pageFooter));
  if (!stickyEnrol.hidden) {
    document.body.style.setProperty('--enrolment-bar-height', `${Math.ceil(stickyEnrol.getBoundingClientRect().height)}px`);
  }
  document.body.classList.toggle('has-sticky-enrol', !stickyEnrol.hidden);
}
function scheduleScrollControls() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollControls);
}
window.addEventListener('scroll', scheduleScrollControls, { passive: true });
window.addEventListener('resize', scheduleScrollControls, { passive: true });
const scrollResizeObserver = new ResizeObserver(scheduleScrollControls);
scrollResizeObserver.observe(document.querySelector('main'));
scrollResizeObserver.observe(stickyEnrol);
scrollResizeObserver.observe(pageFooter);
stickyEnrol.addEventListener('focusout', scheduleScrollControls);
updateScrollControls();
backToTop.addEventListener('click', () => {
  document.querySelector('.nav .wordmark').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});
