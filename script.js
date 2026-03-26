document.addEventListener('DOMContentLoaded', function () {

// ── Tabs ─────────────────────────────
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.panel');

function activateTab(tabId) {
tabBtns.forEach(b => b.classList.remove('active'));
panels.forEach(p => p.classList.remove('active'));

```
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
```

}

tabBtns.forEach(btn => {
btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

// Activate first tab
activateTab('set-1');

// ── Keyboard Navigation ──────────────
document.addEventListener('keydown', e => {
if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;

```
const active = document.querySelector('.tab-btn.active');
const all = Array.from(tabBtns);
const idx = all.indexOf(active);

if (e.key === 'ArrowRight' && idx < all.length - 1) {
  activateTab(all[idx + 1].dataset.tab);
}

if (e.key === 'ArrowLeft' && idx > 0) {
  activateTab(all[idx - 1].dataset.tab);
}
```

});

// ── Swipe Navigation (Mobile) ────────
let touchStartX = 0;
let touchStartY = 0;

const swipeArea = document.querySelector('.panels'); // 👈 IMPORTANT

if (swipeArea) {

  swipeArea.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  swipeArea.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    const threshold = 40;

    // ❌ Ignore vertical scroll
    if (Math.abs(diffY) > Math.abs(diffX)) return;

    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const active = document.querySelector('.tab-btn.active');
    const idx = tabs.indexOf(active);

    if (idx === -1) return;

    // 👉 LEFT swipe → next
    if (diffX > threshold && idx < tabs.length - 1) {
      activateTab(tabs[idx + 1].dataset.tab);
    }

    // 👉 RIGHT swipe → previous
    if (diffX < -threshold && idx > 0) {
      activateTab(tabs[idx - 1].dataset.tab);
    }

  }, { passive: true });

}
// ── Accordion ───────────────────────
window.toggleAccordion = function(letter) {
const item = document.getElementById('acc-' + letter);
if (!item) return;

```
const isOpen = item.classList.contains('open');

document.querySelectorAll('.accordion-item.open')
  .forEach(el => el.classList.remove('open'));

if (!isOpen) {
  item.classList.add('open');
  setTimeout(() => {
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}
```

};

// ── Verb Search ─────────────────────
const searchInput = document.getElementById('verb-search');
if (searchInput) {
searchInput.addEventListener('input', function () {
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
});
```

}

// ── Download ────────────────────────
window.downloadPage = function () {
const html = document.documentElement.outerHTML;
const blob = new Blob([html], { type: 'text/html;charset=utf-8' });

```
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = '1000-French-Imperative-Phrases.html';
a.click();
```

};

});
