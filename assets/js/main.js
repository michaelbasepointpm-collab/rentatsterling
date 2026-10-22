// Sterling leasing proposal · Basepoint

// Contact details come from assets/js/talk.js (BP_CONTACT)
const C = window.BP_CONTACT || {};
document.querySelectorAll('[data-phone]').forEach(a => { a.href = 'tel:' + C.phone; a.textContent = C.phoneLabel; });
document.querySelectorAll('[data-email]').forEach(a => { a.href = 'mailto:' + C.email; a.textContent = C.email; });
if (!window.BP_online) document.querySelector('.person-card')?.classList.add('away');
const book = document.getElementById('book-call');
if (book) {
  book.href = window.BP_bookCallHref;
  if (C.calendly) { book.target = '_blank'; book.rel = 'noopener'; }
}

// Screenshot viewer
const viewer = document.getElementById('viewer');
const viewerImg = viewer.querySelector('img');
document.addEventListener('click', e => {
  const t = e.target.closest('[data-full]');
  if (!t) return;
  viewerImg.src = t.dataset.full;
  viewerImg.alt = t.querySelector('img')?.alt || '';
  viewer.showModal();
});
viewer.addEventListener('click', e => {
  if (e.target === viewer || e.target.classList.contains('viewer-close')) viewer.close();
});
