// Sterling · website concept by Basepoint
document.documentElement.classList.add('js');

const S = window.STERLING;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => '$' + Math.round(n).toLocaleString('en-CA');
const TYPE = { studio: 'Studio', one: '1 Bed', two: '2 Bed' };
const typeLong = p => (p.type === 'studio' ? 'Studio' : p.type === 'one' ? '1 bed' : '2 bed') + (p.den ? ' + den' : '') + ` · ${p.baths} bath`;
const page = document.body.dataset.page;

// ---------- header ----------
$('.menu-toggle')?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  $('.menu-toggle').setAttribute('aria-expanded', String(open));
});
$$('.menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
$$('[data-apply]').forEach(a => { a.href = S.apply; a.target = '_blank'; a.rel = 'noopener'; });
const C = window.BP_CONTACT || {};
$$('[data-phone]').forEach(a => { a.href = 'tel:' + C.phone; a.textContent = C.phoneLabel; });
$$('[data-email]').forEach(a => { a.href = 'mailto:' + C.email; a.textContent = C.email; });
$$('[data-residents]').forEach(a => { a.href = S.residents; a.target = '_blank'; a.rel = 'noopener'; });

// ---------- floating "back to the proposal" button ----------
const back = document.createElement('a');
back.className = 'back-fab';
back.href = '../index.html';
back.innerHTML = '<span class="back-arrow" aria-hidden="true">←</span><span class="back-text"><small>Concept by</small><img src="../assets/img/logos/basepoint.svg" alt="Basepoint"></span><span class="back-label">Back to the proposal</span>';
document.body.appendChild(back);

// ---------- reveal on scroll ----------
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { rootMargin: '0px 0px -8% 0px' }) : null;
$$('.reveal').forEach(el => (io ? io.observe(el) : el.classList.add('in')));

// ---------- shared numbers ----------
const avail = t => S.plans.filter(p => !t || p.type === t).flatMap(p => p.units.map(u => ({ ...u, plan: p })));
const fromRent = t => Math.min(...avail(t).map(u => u.rent));
$$('[data-count]').forEach(el => { el.textContent = avail(el.dataset.count === 'all' ? null : el.dataset.count).length; });
$$('[data-from]').forEach(el => { el.textContent = money(fromRent(el.dataset.from)); });
$$('[data-plans]').forEach(el => { el.textContent = S.plans.length; });

// ---------- offer calculator ----------
const calc = $('#calc');
if (calc) {
  const r = $('#calc-rent'), out = { rent: $('#c-rent'), paid: $('#c-paid'), net: $('#c-net'), save: $('#c-save') };
  const upd = () => {
    const rent = +r.value, { months, term } = S.offer;
    out.rent.textContent = money(rent);
    out.paid.textContent = `${term - months} of ${term}`;
    out.net.textContent = money(rent * (term - months) / term);
    out.save.textContent = money(rent * months);
  };
  r.addEventListener('input', upd); upd();
}

// ---------- homes finder ----------
if (page === 'homes') {
  const grid = $('#plans'), count = $('#count');
  const state = { type: 'all', availOnly: true, den: false, sort: 'price' };
  const hash = location.hash.replace('#', '');
  if (TYPE[hash]) state.type = hash;

  const sync = () => {
    $$('[data-type]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.type === state.type)));
    $('#avail-only').checked = state.availOnly;
    $('#den-only').checked = state.den;
  };
  function render() {
    let list = S.plans.filter(p => (state.type === 'all' || p.type === state.type) && (!state.availOnly || p.units.length) && (!state.den || p.den));
    list.sort(state.sort === 'size' ? (a, b) => b.min - a.min : state.sort === 'avail' ? (a, b) => b.units.length - a.units.length || a.from - b.from : (a, b) => a.from - b.from);
    const homes = list.reduce((n, p) => n + p.units.length, 0);
    count.textContent = `${list.length} floor plan${list.length === 1 ? '' : 's'} · ${homes} home${homes === 1 ? '' : 's'} available`;
    grid.innerHTML = list.length ? list.map(p => `
      <article class="plan">
        <button class="plan-img" data-open="${p.code}" aria-label="Open floor plan ${p.code}">
          ${p.img ? `<img src="img/plans/${p.img}.webp" alt="Floor plan ${p.code}" loading="lazy">` : '<span class="noplan">Floor plan<br>on request</span>'}
        </button>
        <div class="plan-body">
          <div class="plan-top"><h3>Plan ${p.code}</h3>${p.den ? '<span class="badge badge-den">+ Den</span>' : `<span class="badge">${TYPE[p.type]}</span>`}</div>
          <div class="plan-meta">${typeLong(p)} · ${p.sqft} sq ft</div>
          <div class="plan-price">${money(p.units.length ? Math.min(...p.units.map(u => u.rent)) : p.from)} <small>/ month</small></div>
          <div class="plan-avail ${p.units.length ? 'on' : 'off'}">${p.units.length ? `${p.units.length} available now · #${p.units.map(u => u.no).join(', #')}` : 'None available right now'}</div>
          <div class="plan-actions">
            <button class="btn btn-line" data-open="${p.code}">Details</button>
            ${p.units.length ? `<a class="btn btn-navy" href="book-a-tour.html?plan=${p.code}">Book a tour</a>` : `<a class="btn btn-navy" href="book-a-tour.html?plan=${p.code}&waitlist=1">Get notified</a>`}
          </div>
        </div>
      </article>`).join('') : '<p class="empty">No plans match. Try turning off a filter.</p>';
  }
  $$('[data-type]').forEach(b => b.addEventListener('click', () => { state.type = b.dataset.type; history.replaceState(null, '', state.type === 'all' ? location.pathname : '#' + state.type); sync(); render(); }));
  $('#avail-only').addEventListener('change', e => { state.availOnly = e.target.checked; render(); });
  $('#den-only').addEventListener('change', e => { state.den = e.target.checked; render(); });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
  sync(); render();

  // plan sheet
  const sheet = $('#sheet');
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-open]');
    if (!b) return;
    const p = S.plans.find(x => x.code === b.dataset.open);
    const { months, term } = S.offer;
    $('#sheet-img').innerHTML = p.img ? `<img src="img/plans/${p.img}.webp" alt="Floor plan ${p.code}">` : '<span class="noplan">Floor plan on request</span>';
    $('#sheet-body').innerHTML = `
      <span class="eyebrow">${TYPE[p.type]}${p.den ? ' + den' : ''}</span>
      <h2>Plan ${p.code}</h2>
      <p class="plan-meta">${typeLong(p)} · ${p.sqft} sq ft · private balcony or patio</p>
      ${p.units.length ? `
        <ul class="unit-list">${p.units.map(u => `
          <li><b>Home #${u.no} · ${money(u.rent)}/mo</b><span>${u.sqft} sq ft · ${money(u.rent * (term - months) / term)}/mo net effective with ${months} months free*</span>
            <div class="btns"><a class="btn btn-navy" href="book-a-tour.html?plan=${p.code}&unit=${u.no}">Tour</a><a class="btn btn-line" href="${S.apply}" target="_blank" rel="noopener">Apply</a></div></li>`).join('')}
        </ul>
        <p class="sheet-note">*Example on a ${term}-month lease with the first ${months} months free, where offered. Terms set by Sterling.</p>` : `
        <p class="lede" style="font-size:15px">No homes on this plan are available right now. Starting rent was ${money(p.from)}/month.</p>
        <p style="margin-top:22px"><a class="btn btn-navy" href="book-a-tour.html?plan=${p.code}&waitlist=1">Tell me when one opens</a></p>`}
      ${p.img ? '' : '<p class="sheet-note">We\'ll send you the drawing for this plan on request.</p>'}`;
    sheet.showModal();
  });
  $('.sheet-close').addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
}

// ---------- neighbourhood map (Leaflet, free tiles, no API key) ----------
// Tries each tile provider in order and switches to the next one if tiles fail to load.
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
const ESRI_ATTR = 'Powered by <a href="https://www.esri.com">Esri</a> &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors';
const TILES = [
  { url: ESRI + 'World_Street_Map/MapServer/tile/{z}/{y}/{x}', opts: { maxZoom: 19, attribution: ESRI_ATTR } },
  { url: ESRI + 'Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', labels: ESRI + 'Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', opts: { maxZoom: 16, attribution: ESRI_ATTR } },
  { url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', opts: { subdomains: 'abc', maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, tiles by <a href="https://www.hotosm.org/">HOT</a>' } },
];
if (page === 'area' && window.L && $('#map')) {
  const map = L.map('map', { scrollWheelZoom: false, zoomControl: true }).setView([S.home.lat, S.home.lng], 15);
  let tileIdx = 0, layers = [], errors = 0;
  const useTiles = i => {
    layers.forEach(l => map.removeLayer(l));
    errors = 0;
    const t = TILES[i];
    layers = [L.tileLayer(t.url, t.opts)];
    if (t.labels) layers.push(L.tileLayer(t.labels, { maxZoom: t.opts.maxZoom, pane: 'shadowPane' }));
    layers.forEach(l => l.addTo(map));
    map.setMaxZoom(t.opts.maxZoom);
    layers[0].on('tileerror', () => { if (++errors >= 3 && tileIdx < TILES.length - 1) useTiles(++tileIdx); });
  };
  useTiles(0);

  const home = L.marker([S.home.lat, S.home.lng], {
    icon: L.divIcon({ className: '', html: '<div class="pin pin-home"><img src="img/sterling-logo-navy.svg" alt="">Sterling</div>', iconSize: null, iconAnchor: [14, 20] }),
    zIndexOffset: 1000, keyboard: false,
  }).addTo(map).bindPopup(`<b>${S.home.name}</b>${S.home.note}`);

  const groups = { transit: L.layerGroup(), parks: L.layerGroup(), shops: L.layerGroup() };
  const markers = {};
  S.places.forEach(p => {
    const m = L.marker([p.lat, p.lng], {
      icon: L.divIcon({ className: '', html: `<div class="pin pin-${p.cat}"><b>${p.n}</b></div>`, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28] }),
      title: p.name,
    }).bindPopup(`<b>${p.n}. ${p.name}</b>${p.note}`);
    m.addTo(groups[p.cat]);
    markers[p.n] = { m, cat: p.cat };
  });
  Object.values(groups).forEach(g => g.addTo(map));

  const fit = layers => map.fitBounds(L.featureGroup(layers).getBounds(), { padding: [36, 36], maxZoom: 16 });
  const fitAll = () => { map.invalidateSize(); fit([home, ...Object.values(markers).map(x => x.m)]); };
  fitAll();
  window.addEventListener('load', fitAll);

  $$('.map-bar [data-cat]').forEach(b => b.addEventListener('click', () => {
    const cat = b.dataset.cat;
    $$('.map-bar [data-cat]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    Object.entries(groups).forEach(([k, g]) => (cat === 'all' || k === cat ? g.addTo(map) : map.removeLayer(g)));
    fit([home, ...Object.values(markers).filter(x => cat === 'all' || x.cat === cat).map(x => x.m)]);
  }));

  $$('#places [data-pin]').forEach(btn => btn.addEventListener('click', () => {
    const { m, cat } = markers[btn.dataset.pin];
    if (!map.hasLayer(groups[cat])) groups[cat].addTo(map);
    $('#map').scrollIntoView({ behavior: 'smooth', block: 'center' });
    map.flyTo(m.getLatLng(), 16, { duration: 0.6 });
    setTimeout(() => m.openPopup(), 650);
  }));
}

// ---------- gallery ----------
if (page === 'gallery') {
  const gal = $('#gal'), lb = $('#lb'), lbImg = $('#lb-img'), lbCap = $('#lb-cap');
  const cats = ['All', ...new Set(S.gallery.map(g => g[1]))];
  let cur = 'All', shown = [], idx = 0;
  $('#gal-bar').innerHTML = cats.map(c => `<button class="chip" data-cat="${c}" aria-pressed="${c === 'All'}">${c} <small>${c === 'All' ? S.gallery.length : S.gallery.filter(g => g[1] === c).length}</small></button>`).join('');
  function render() {
    shown = S.gallery.filter(g => cur === 'All' || g[1] === cur);
    gal.innerHTML = shown.map((g, i) => `<a href="img/gallery/${g[0]}.webp" data-i="${i}"><img src="img/gallery/${g[0]}-t.webp" alt="${g[2]}" loading="lazy"><span>${g[2]}</span></a>`).join('');
  }
  $('#gal-bar').addEventListener('click', e => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    cur = b.dataset.cat;
    $$('[data-cat]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    render();
  });
  const show = i => { idx = (i + shown.length) % shown.length; const g = shown[idx]; lbImg.src = `img/gallery/${g[0]}.webp`; lbImg.alt = g[2]; lbCap.textContent = `${g[2]} · ${idx + 1} / ${shown.length}`; };
  gal.addEventListener('click', e => { const a = e.target.closest('a'); if (!a) return; e.preventDefault(); show(+a.dataset.i); lb.showModal(); });
  $('.lb-prev').addEventListener('click', () => show(idx - 1));
  $('.lb-next').addEventListener('click', () => show(idx + 1));
  $('.lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); x0 = null; });
  render();
}

// ---------- book a tour ----------
if (page === 'tour') {
  const form = $('#tour-form'), q = new URLSearchParams(location.search);
  const planSel = $('#plan'), unitSel = $('#unit'), typeSel = $('#type');
  planSel.innerHTML = '<option value="">Not sure yet</option>' + S.plans.map(p => `<option value="${p.code}">Plan ${p.code} · ${typeLong(p)} · ${p.sqft} sq ft${p.units.length ? ` · ${p.units.length} available` : ''}</option>`).join('');
  const fillUnits = () => {
    const p = S.plans.find(x => x.code === planSel.value);
    const list = p ? p.units : avail(typeSel.value || null);
    unitSel.innerHTML = '<option value="">Any available home</option>' + list.map(u => `<option value="${u.no}">Home #${u.no} · ${money(u.rent)}/mo${u.plan ? ` · Plan ${u.plan.code}` : ''}</option>`).join('');
  };
  typeSel.addEventListener('change', () => { planSel.value = ''; fillUnits(); });
  planSel.addEventListener('change', () => { const p = S.plans.find(x => x.code === planSel.value); if (p) typeSel.value = p.type; fillUnits(); });
  if (q.get('plan')) { planSel.value = q.get('plan'); const p = S.plans.find(x => x.code === q.get('plan')); if (p) typeSel.value = p.type; }
  if (q.get('type') && TYPE[q.get('type')]) typeSel.value = q.get('type');
  fillUnits();
  if (q.get('unit')) unitSel.value = q.get('unit');
  if (q.get('waitlist')) { $('#tour-title').textContent = 'Get notified when a home opens'; $('#kind').value = 'Waitlist'; }

  // next 14 days (Sterling tours run Mon–Sat in this concept)
  const days = $('#days'), dateIn = $('#date');
  const fmt = new Intl.DateTimeFormat('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
  let d = new Date(); d.setHours(12, 0, 0, 0);
  const opts = [];
  while (opts.length < 12) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) opts.push(new Date(d)); }
  days.innerHTML = opts.map((o, i) => `<button type="button" class="day" data-date="${fmt.format(o)}" aria-pressed="${i === 0}">${o.toLocaleDateString('en-CA', { weekday: 'short' })}<b>${o.getDate()}</b>${o.toLocaleDateString('en-CA', { month: 'short' })}</button>`).join('');
  dateIn.value = fmt.format(opts[0]);
  days.addEventListener('click', e => { const b = e.target.closest('.day'); if (!b) return; $$('.day', days).forEach(x => x.setAttribute('aria-pressed', String(x === b))); dateIn.value = b.dataset.date; });
  $$('.seg').forEach(seg => seg.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', seg).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    $('#' + seg.dataset.for).value = b.dataset.v;
  }));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.classList.add('tried'); form.querySelector(':invalid')?.focus(); return; }
    const f = Object.fromEntries(new FormData(form));
    const fields = {
      Request: f.kind, Name: f.name, Email: f.email, Phone: f.phone,
      'Home type': TYPE[f.type] || 'Any', Plan: f.plan || 'Not sure', Home: f.unit ? '#' + f.unit : 'Any available',
      'Preferred day': f.date, 'Preferred time': f.time, 'Tour type': f.tourtype,
      'Move-in': f.movein, Pets: f.pets, Message: f.message,
    };
    const btn = form.querySelector('[type=submit]');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const how = await window.BP_send(`Sterling ${f.kind.toLowerCase()} request · ${f.name}`, fields);
      sessionStorage.setItem('sterling-tour', JSON.stringify({ how, fields }));
      setTimeout(() => { location.href = 'thank-you.html'; }, how === 'mail' ? 900 : 0);
    } catch {
      btn.disabled = false; btn.textContent = 'Send request';
      $('#send-err').hidden = false;
    }
  });
}

// ---------- thank you ----------
if (page === 'thanks') {
  let data = null;
  try { data = JSON.parse(sessionStorage.getItem('sterling-tour')); } catch {}
  if (data) {
    const f = data.fields;
    $('#ty-name').textContent = f.Name ? `, ${f.Name.split(' ')[0]}` : '';
    $('#ty-note').textContent = data.how === 'mail'
      ? 'Your email app opened with your request. Press send and it comes straight to Michael, who confirms by text or email.'
      : 'Michael has your request and will confirm your tour by text or email.';
    $('#ty-sum').innerHTML = Object.entries(f).filter(([, v]) => v).map(([k, v]) => `<dt>${k}</dt><dd>${String(v).replace(/</g, '&lt;')}</dd>`).join('');
    $('#ty-summary').hidden = false;
  }
}
