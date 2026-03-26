document.addEventListener('DOMContentLoaded', function () {

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

activateTab('set-1');

// Keyboard
document.addEventListener('keydown', e => {
  if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;

  const active = document.querySelector('.tab-btn.active');
  const all = Array.from(tabBtns);
  const idx = all.indexOf(active);

  if (e.key === 'ArrowRight' && idx < all.length - 1) activateTab(all[idx+1].dataset.tab);
  if (e.key === 'ArrowLeft' && idx > 0) activateTab(all[idx-1].dataset.tab);
});

// Swipe
let touchStartX = 0;

document.body.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

document.body.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].clientX;

  const diff = touchStartX - touchEndX;
  const threshold = 50;

  const visibleTabs = Array.from(document.querySelectorAll('.tab-btn'));
  const active = document.querySelector('.tab-btn.active');
  const idx = visibleTabs.indexOf(active);

  if (idx === -1) return;

  if (diff > threshold && idx < visibleTabs.length - 1) {
    activateTab(visibleTabs[idx + 1].dataset.tab);
  }

  if (diff < -threshold && idx > 0) {
    activateTab(visibleTabs[idx - 1].dataset.tab);
  }

}, { passive: true });

});
