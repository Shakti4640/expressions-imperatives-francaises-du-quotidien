// Tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.panel');

function activateTab(tabId) {
tabBtns.forEach(b => b.classList.remove('active'));
panels.forEach(p => p.classList.remove('active'));

const btn = document.querySelector('.tab-btn[data-tab="' + tabId + '"]');
const panel = document.getElementById('panel-' + tabId);

if (btn) {
btn.classList.add('active');
btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

if (panel) panel.classList.add('active');

const idx = Array.from(tabBtns).indexOf(btn);
const counter = document.getElementById('tabCounter');
if (counter) {
counter.textContent = (idx + 1) + ' / ' + tabBtns.length + ' tabs';
}
}

tabBtns.forEach(btn => {
btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

// Activate first tab
activateTab('set-1');

// Keyboard nav
document.addEventListener('keydown', e => {
if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;

const active = document.querySelector('.tab-btn.active');
const all = Array.from(tabBtns);
const idx = all.indexOf(active);

if (e.key === 'ArrowRight' && idx < all.length - 1) {
activateTab(all[idx+1].dataset.tab);
}

if (e.key === 'ArrowLeft' && idx > 0) {
activateTab(all[idx-1].dataset.tab);
}
});

// Accordion
function toggleAccordion(letter) {
const item = document.getElementById('acc-' + letter);
const isOpen = item.classList.contains('open');

document.querySelectorAll('.accordion-item.open')
.forEach(el => el.classList.remove('open'));

if (!isOpen) {
item.classList.add('open');
setTimeout(() => {
item.scrollIntoView({behavior: 'smooth', block: 'nearest'});
}, 50);
}
}

// Verb search
const searchEl = document.getElementById('verb-search');
if (searchEl) {
searchEl.addEventListener('input', function() {
const q = this.value.toLowerCase().trim();

```
document.querySelectorAll('.verb-row').forEach(row => {
  const v = row.dataset.verb || '';
  const m = row.dataset.meaning || '';

  if (!q || v.includes(q) || m.includes(q)) {
    row.classList.remove('hidden');
  } else {
    row.classList.add('hidden');
  }
});

if (q) {
  document.querySelectorAll('.accordion-item')
    .forEach(item => item.classList.add('open'));
}
```

});
}

// Download
function downloadPage() {
const html = document.documentElement.outerHTML;
const blob = new Blob([html], {type: 'text/html;charset=utf-8'});

const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = '1000-French-Imperative-Phrases.html';
a.click();
}

// ── Swipe Navigation (WORKING) ─────────────
(function initSwipe() {

const area = document.querySelector('.panels') || document.body;

let startX = 0;
let startY = 0;

area.addEventListener('touchstart', e => {
startX = e.touches[0].clientX;
startY = e.touches[0].clientY;
}, { passive: true });

area.addEventListener('touchend', e => {
const endX = e.changedTouches[0].clientX;
const endY = e.changedTouches[0].clientY;

```
const diffX = startX - endX;
const diffY = startY - endY;

// Ignore vertical scroll
if (Math.abs(diffY) > Math.abs(diffX)) return;

const threshold = 25;

const tabs = Array.from(document.querySelectorAll('.tab-btn'));
const active = document.querySelector('.tab-btn.active');
const idx = tabs.indexOf(active);

if (idx === -1) return;

if (diffX > threshold && idx < tabs.length - 1) {
  activateTab(tabs[idx + 1].dataset.tab);
}

if (diffX < -threshold && idx > 0) {
  activateTab(tabs[idx - 1].dataset.tab);
}
```

}, { passive: true });

})();
