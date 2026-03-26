// 1. Tab switching - Define ONCE and ensure it's accessible
function activateTab(tabId) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.panel');
  const tabCounter = document.getElementById('tabCounter');

  tabBtns.forEach(b => b.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));

  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  const panel = document.getElementById(`panel-${tabId}`);

  if (btn) {
    btn.classList.add('active');
    // Ensure the tab button stays in view on mobile
    btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    
    // Update counter
    const all = Array.from(tabBtns);
    const idx = all.indexOf(btn);
    if (tabCounter) {
      tabCounter.textContent = `${idx + 1} / ${all.length} tabs`;
    }
  }

  if (panel) {
    panel.classList.add('active');
  }
}

// 2. Initialize Listeners
document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.tab-btn');

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
    if (e.key === 'ArrowRight' && idx < all.length - 1) activateTab(all[idx+1].dataset.tab);
    if (e.key === 'ArrowLeft' && idx > 0) activateTab(all[idx-1].dataset.tab);
  });
});

// 3. Verb Search & Accordion (Simplified)
function toggleAccordion(letter) {
  const item = document.getElementById('acc-' + letter);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.accordion-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen && item) {
    item.classList.add('open');
    setTimeout(() => item.scrollIntoView({behavior: 'smooth', block: 'nearest'}), 50);
  }
}

const searchInput = document.getElementById('verb-search');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    document.querySelectorAll('.verb-row').forEach(row => {
      const v = (row.dataset.verb || '').toLowerCase();
      const m = (row.dataset.meaning || '').toLowerCase();
      row.classList.toggle('hidden', q && !v.includes(q) && !m.includes(q));
    });
    if (q) {
      document.querySelectorAll('.accordion-item').forEach(item => item.classList.add('open'));
    }
  });
}

// 4. THE SWIPE FIX
(function () {
  let startX = 0;
  let startY = 0;
  let startTime = 0;

  // Brave/Chrome often need the listener on a wrapper that actually receives the touch
  const area = document.getElementById('panelsContainer') || document.body;

  area.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = new Date().getTime();
  }, { passive: true }); // Use true for better performance unless you MUST prevent scroll

  area.addEventListener('touchend', function (e) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const elapsed = new Date().getTime() - startTime;

    const diffX = startX - endX;
    const diffY = startY - endY;

    // Thresholds: move at least 50px horizontally, less than 100px vertically, and fast enough
    if (Math.abs(diffX) > 50 && Math.abs(diffY) < 100 && elapsed < 300) {
      const tabs = Array.from(document.querySelectorAll('.tab-btn'));
      const active = document.querySelector('.tab-btn.active');
      const idx = tabs.indexOf(active);

      if (idx === -1) return;

      if (diffX > 0 && idx < tabs.length - 1) {
        // Swiped Left -> Go Right
        activateTab(tabs[idx + 1].dataset.tab);
      } else if (diffX < 0 && idx > 0) {
        // Swiped Right -> Go Left
        activateTab(tabs[idx - 1].dataset.tab);
      }
    }
  }, { passive: true });
})();