/* ═══════════════════════════════════════════════════════════════════
   1000 French Imperative Phrases — Modern UI Logic
   ═══════════════════════════════════════════════════════════════════ */

// ─── 1. Theme toggle (persisted in sessionStorage for session) ───
(function initTheme() {
  const saved = sessionStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  sessionStorage.setItem('theme', next);
}

// ─── 2. Sidebar toggle ───
function toggleSidebar() {
  document.body.classList.toggle('sidebar-collapsed');
  // Remember on desktop only
  if (window.innerWidth > 900) {
    sessionStorage.setItem('sidebar', document.body.classList.contains('sidebar-collapsed') ? 'closed' : 'open');
  }
}

// Restore sidebar state on load (desktop only, default open)
(function initSidebar() {
  if (window.innerWidth > 900) {
    const state = sessionStorage.getItem('sidebar');
    if (state === 'closed') document.body.classList.add('sidebar-collapsed');
  } else {
    // Mobile: default collapsed
    document.body.classList.add('sidebar-collapsed');
  }
})();

// ─── 3. Parent group collapse/expand ───
function toggleGroup(btn) {
  const group = btn.closest('.group');
  group.classList.toggle('open');
}

// ─── 4. Tab activation ───
function activateTab(tabId) {
  const panels = document.querySelectorAll('.panel');
  const items = document.querySelectorAll('.sidebar-item');

  panels.forEach(p => p.classList.remove('active'));
  items.forEach(b => b.classList.remove('active'));

  const panel = document.getElementById(`panel-${tabId}`);
  const item = document.querySelector(`.sidebar-item[data-tab="${tabId}"]`);

  if (panel) {
    panel.classList.add('active');
    // Scroll main content to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (item) {
    item.classList.add('active');
    // Open parent group if not open
    const group = item.closest('.group');
    if (group && !group.classList.contains('open')) {
      group.classList.add('open');
    }
  }

  // Close sidebar on mobile after selecting
  if (window.innerWidth <= 900) {
    document.body.classList.add('sidebar-collapsed');
  }

  // Persist last active tab for the session
  sessionStorage.setItem('activeTab', tabId);
}

// ─── 5. Init ───
document.addEventListener('DOMContentLoaded', () => {
  // Wire sidebar items
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => activateTab(item.dataset.tab));
  });

  // Restore last tab or default to set-1
  const last = sessionStorage.getItem('activeTab') || 'set-1';
  activateTab(last);

  // Keyboard nav — arrow keys move between tabs
  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

    const allItems = Array.from(document.querySelectorAll('.sidebar-item'));
    const active = document.querySelector('.sidebar-item.active');
    const idx = allItems.indexOf(active);
    if (idx === -1) return;

    if (e.key === 'ArrowRight' && idx < allItems.length - 1) {
      activateTab(allItems[idx + 1].dataset.tab);
    }
    if (e.key === 'ArrowLeft' && idx > 0) {
      activateTab(allItems[idx - 1].dataset.tab);
    }
  });

  // Close sidebar on mobile when clicking overlay
  document.addEventListener('click', e => {
    if (window.innerWidth > 900) return;
    if (document.body.classList.contains('sidebar-collapsed')) return;
    // Click outside sidebar closes it
    if (!e.target.closest('.sidebar') && !e.target.closest('.hamburger')) {
      document.body.classList.add('sidebar-collapsed');
    }
  });
});

// ─── 6. Accordion (A-Z verbs) ───
function toggleAccordion(letter) {
  const item = document.getElementById('acc-' + letter);
  if (!item) return;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.accordion-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) {
    item.classList.add('open');
    setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  }
}

// ─── 7. Verb search ───
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('verb-search');
  if (!searchInput) return;
  searchInput.addEventListener('input', function () {
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
});

// ─── 8. Swipe navigation (mobile) ───
(function () {
  let startX = 0, startY = 0, startTime = 0;
  const area = document.body;

  area.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
  }, { passive: true });

  area.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;
    const elapsed = Date.now() - startTime;

    if (Math.abs(diffX) > 60 && Math.abs(diffY) < 80 && elapsed < 350) {
      const items = Array.from(document.querySelectorAll('.sidebar-item'));
      const active = document.querySelector('.sidebar-item.active');
      const idx = items.indexOf(active);
      if (idx === -1) return;
      if (diffX > 0 && idx < items.length - 1) {
        activateTab(items[idx + 1].dataset.tab);
      } else if (diffX < 0 && idx > 0) {
        activateTab(items[idx - 1].dataset.tab);
      }
    }
  }, { passive: true });
})();
