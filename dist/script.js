const programmeDialog = document.querySelector('#details-dialog');
programmeDialog.querySelectorAll('.close, .close-button').forEach(button => button.addEventListener('click', () => programmeDialog.close()));
const evidence = window.PT_EVIDENCE;
const track = document.querySelector('#evidence-track');
const viewer = document.querySelector('#evidence-dialog');
let currentItems = [], currentIndex = 0;
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function placeholder(item) {
  const frame = element('div', `proof-art proof-art-${item.style}`);
  frame.setAttribute('aria-hidden', 'true');
  const icons = { payment:'↗', invoice:'≡', retainer:'↻', chat:'“', photo:'✳' };
  frame.append(element('span','proof-art-icon',icons[item.style]),element('span','proof-art-slot','Image coming soon'));
  return frame;
}
function visual(item, fullSize = false) {
  if (!item.src) return placeholder(item);
  const image = element('img',fullSize ? 'viewer-image' : 'evidence-image');
  image.src = item.src; image.alt = item.alt || item.title;
  image.loading = fullSize ? 'eager' : 'lazy';
  image.addEventListener('error', () => {
    const fallback = placeholder(item);
    fallback.querySelector('.proof-art-slot').textContent = 'Image could not be loaded';
    image.replaceWith(fallback);
  }, { once:true });
  return image;
}
function makeCard(item, collection, compact = false) {
  const button = element('button',compact ? 'hero-proof-card' : 'evidence-card');
  button.type = 'button';
  button.setAttribute('aria-label',`View ${item.title}${item.src ? '' : ' — image placeholder'}`);
  button.setAttribute('aria-haspopup','dialog');
  const caption = element('div','evidence-card-caption');
  const arrow = element('span','','↗');
  arrow.setAttribute('aria-hidden','true');
  caption.append(element('span','',item.title),arrow);
  button.append(visual(item),caption);
  button.addEventListener('click', () => openViewer(item,collection));
  return button;
}
function renderResults(filter = 'all') {
  const items = evidence.filter(item => item.group === 'results' && (filter === 'all' || item.category === filter));
  track.replaceChildren(...items.map(item => makeCard(item,items)));
  track.scrollLeft = 0;
}
function renderViewer() {
  const item = currentItems[currentIndex];
  document.querySelector('#viewer-stage').replaceChildren(visual(item,true));
  document.querySelector('#evidence-title').textContent = item.title;
  const description = document.querySelector('#evidence-description');
  description.textContent = item.src ? item.description || '' : '';
  description.hidden = !description.textContent;
  document.querySelector('#evidence-count').textContent = `${String(currentIndex+1).padStart(2,'0')} / ${String(currentItems.length).padStart(2,'0')}`;
  document.querySelector('#viewer-prev').disabled = currentItems.length < 2;
  document.querySelector('#viewer-next').disabled = currentItems.length < 2;
}
function openViewer(item,collection) {
  currentItems = collection; currentIndex = collection.findIndex(entry => entry.id === item.id);
  renderViewer(); viewer.showModal();
}
function moveViewer(direction) {
  currentIndex = (currentIndex + direction + currentItems.length) % currentItems.length;
  renderViewer();
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(filter => filter.setAttribute('aria-pressed',String(filter === button)));
  renderResults(button.dataset.filter);
}));
document.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => track.scrollBy({ left:Number(button.dataset.scroll)*track.clientWidth*.8, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })));
document.querySelector('#viewer-close').addEventListener('click', () => viewer.close());
document.querySelector('#viewer-prev').addEventListener('click', () => moveViewer(-1));
document.querySelector('#viewer-next').addEventListener('click', () => moveViewer(1));
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); moveViewer(event.key === 'ArrowLeft' ? -1 : 1);
  }
});
for (const dialog of [programmeDialog,viewer]) {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
}
// Native dialogs provide focus trapping, Escape dismissal, and focus restoration.
new MutationObserver(() => {
  document.body.style.overflow = viewer.open || programmeDialog.open ? 'hidden' : '';
}).observe(document.body,{ attributes:true,subtree:true,attributeFilter:['open'] });
renderResults();
const heroItems = evidence.filter(item => item.group === 'results').slice(0,3);
document.querySelector('#hero-proof').replaceChildren(...heroItems.map(item => makeCard(item,heroItems,true)));

// Purchase buttons become direct Selar links when the real product URL is supplied.
const course = window.PT_COURSE || {};
function validSelarUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['selar.com','selar.co','www.selar.com','www.selar.co'].includes(url.hostname) ? url.href : null;
  } catch { return null; }
}
const checkoutUrl = validSelarUrl(course.selarUrl);
document.querySelectorAll('[data-purchase]').forEach(link => {
  if (checkoutUrl) {
    link.href = checkoutUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.addEventListener('click', event => { event.preventDefault(); programmeDialog.showModal(); });
  }
});
if (checkoutUrl) document.querySelector('#checkout-note').textContent = 'Purchase securely on Selar';
const priceNode = document.querySelector('#course-price');
const discountBlock = document.querySelector('#discount-block');
const money = new Intl.NumberFormat('en-NG',{style:'currency',currency:course.currency || 'NGN',maximumFractionDigits:0});
const deadline = Date.parse(course.discountEndsAt);
const hasPrice = Number.isFinite(course.price) && course.price > 0;
function updateOffer() {
  const remaining = deadline - Date.now();
  const discounted = checkoutUrl && hasPrice && Number.isFinite(course.discountPrice) && course.discountPrice > 0 && course.discountPrice < course.price && Number.isFinite(deadline) && remaining > 0;
  priceNode.hidden = !hasPrice;
  priceNode.replaceChildren();
  if (hasPrice) {
    if (discounted) priceNode.append(element('del','',money.format(course.price)));
    priceNode.append(element('strong','',money.format(discounted ? course.discountPrice : course.price)));
  }
  discountBlock.hidden = !discounted;
  if (!discounted) return false;
  document.querySelector('#discount-label').textContent = `Save ${money.format(course.price-course.discountPrice)}`;
  const seconds = Math.floor(remaining/1000);
  const units = [[Math.floor(seconds/86400),'Days'],[Math.floor(seconds/3600)%24,'Hours'],[Math.floor(seconds/60)%60,'Mins'],[seconds%60,'Secs']];
  document.querySelector('#countdown').replaceChildren(...units.map(([value,label]) => {
    const unit=element('div','countdown-unit');unit.append(element('b','',String(value).padStart(2,'0')),element('span','',label));return unit;
  }));
  document.querySelector('#offer-deadline').textContent = 'Ends '+new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short',timeZone:'Africa/Lagos'}).format(deadline)+' (Lagos time)';
  return true;
}
updateOffer();
const offerInterval = setInterval(() => { if (!updateOffer()) clearInterval(offerInterval); },1000);

// Show the shortcut once the visitor has scrolled beyond the opening content.
const backToTop = document.querySelector('#back-to-top');
function updateBackToTop() {
  backToTop.hidden = window.scrollY < 400;
}
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
backToTop.addEventListener('click', () => {
  const homeLink = document.querySelector('.nav .wordmark');
  homeLink.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});

// A disclosure menu keeps ordinary navigation links keyboard accessible.
const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('#main-navigation');
const mobileNavigation = matchMedia('(max-width: 60rem)');
function setMenuOpen(open, restoreFocus = false) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mainNavigation.hidden = mobileNavigation.matches && !open;
  if (restoreFocus) menuToggle.focus();
}
function updateNavigation() {
  menuToggle.hidden = !mobileNavigation.matches;
  setMenuOpen(false);
}
menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
mainNavigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  if (!mobileNavigation.matches) return;
  const target = document.querySelector(link.getAttribute('href'));
  setMenuOpen(false);
  if (programmeDialog.open || viewer.open) return;
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') setMenuOpen(false, true);
});
document.addEventListener('click', event => {
  if (menuToggle.getAttribute('aria-expanded') === 'true' && !event.target.closest('.nav')) setMenuOpen(false);
});
mobileNavigation.addEventListener('change', updateNavigation);
updateNavigation();
