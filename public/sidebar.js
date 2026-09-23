document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --brooks-bg: #f3f6fb;
      --brooks-bg-2: #edf3fb;
      --brooks-panel: #ffffff;
      --brooks-panel-2: #f8fbff;
      --brooks-card: #ffffff;
      --brooks-border: #dfe7f0;
      --brooks-border-soft: #cfe0f4;
      --brooks-text: #1f2937;
      --brooks-muted: #5d6b7a;
      --brooks-accent: #2d6cdf;
      --brooks-accent-2: #1a4f8a;
      --brooks-button: linear-gradient(135deg, #4e96ff 0%, #2d6cdf 100%);
      --brooks-button-hover: linear-gradient(135deg, #64a9ff 0%, #3679eb 100%);
    }

    body {
      margin: 0 !important;
      display: flex;
      min-height: 100vh;
      background: linear-gradient(180deg, var(--brooks-bg) 0%, var(--brooks-bg-2) 100%);
      color: var(--brooks-text);
      font-family: Arial, sans-serif;
    }
    #sidebar {
      width: 200px;
      background: linear-gradient(180deg, #ffffff 0%, #f5f9ff 100%);
      border-right: 1px solid var(--brooks-border);
      box-sizing: border-box;
      position: sticky;
      top: 0;
      height: 100vh;
      flex-shrink: 0;
      transition: width 0.15s ease;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: inset -1px 0 0 rgba(26, 79, 138, 0.08);
    }
    #sidebar.collapsed { width: 62px; }
    #sidebarHeader { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border-bottom: 1px solid var(--brooks-border); margin-bottom: 10px; flex-shrink: 0; }
    #sidebar.collapsed #sidebarHeader { padding: 16px 8px; justify-content: center; }
    #sidebar .brand { color: var(--brooks-accent-2); font-weight: bold; font-size: 15px; white-space: nowrap; overflow: hidden; }
    #sidebar.collapsed .brand { display: none; }
    #sidebarToggle { background: #edf3fb; border: 1px solid var(--brooks-border-soft); color: var(--brooks-text); cursor: pointer; font-size: 16px; padding: 4px 8px; border-radius: 6px; flex-shrink: 0; }
    #sidebarToggle:hover { background: #e2ebf8; }
    #sidebarLinks { flex: 1; overflow-y: auto; }
    #sidebar a { display: block; padding: 11px 18px; color: var(--brooks-muted); text-decoration: none; font-size: 14px; border-left: 3px solid transparent; white-space: nowrap; overflow: hidden; transition: all 0.15s ease; }
    #sidebar.collapsed a { padding: 10px 0; text-align: center; font-size: 11px; }
    #sidebar a:hover { background: rgba(45, 108, 223, 0.06); color: var(--brooks-accent-2); }
    #sidebar a.active { background: rgba(45, 108, 223, 0.08); color: var(--brooks-accent-2); border-left: 3px solid var(--brooks-accent-2); }
    #sidebar.collapsed a.active { border-left: none; border-top: 3px solid var(--brooks-accent-2); }
    #mainContent { flex: 1; padding: 30px; box-sizing: border-box; max-width: 1200px; background: transparent; }
  `;
  document.head.appendChild(style);

  const path = window.location.pathname;
  const links = [
    { href: '/assets.html', label: 'Assets', short: 'AST' },
    { href: '/add-asset.html', label: '+ Add Asset', short: '+ADD' },
    { href: '/bulk-add-asset.html', label: 'Bulk Add', short: 'BADD' },
    { href: '/consumable.html', label: 'Consumable', short: 'CONS' },
    { href: '/settings.html', label: 'Settings', short: 'SET' }
  ];

  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

  const sidebar = document.createElement('div');
  sidebar.id = 'sidebar';
  if (isCollapsed) sidebar.classList.add('collapsed');

  const linksHtml = links.map(l =>
    `<a href="${l.href}" class="${path === l.href ? 'active' : ''}" data-full="${l.label}" data-short="${l.short}">${isCollapsed ? l.short : l.label}</a>`
  ).join('');

  sidebar.innerHTML = `
    <div id="sidebarHeader">
      <span class="brand">Brooks IT Inventory</span>
      <button id="sidebarToggle">${isCollapsed ? '\u2192' : '\u2190'}</button>
    </div>
    <div id="sidebarLinks">${linksHtml}</div>
  `;

  const wrapper = document.createElement('div');
  wrapper.id = 'mainContent';
  while (document.body.firstChild) {
    wrapper.appendChild(document.body.firstChild);
  }
  document.body.appendChild(sidebar);
  document.body.appendChild(wrapper);

  document.getElementById('sidebarToggle').addEventListener('click', function() {
    const collapsed = sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', collapsed);
    document.getElementById('sidebarToggle').textContent = collapsed ? '\u2192' : '\u2190';
    sidebar.querySelectorAll('a').forEach(a => {
      a.textContent = collapsed ? a.dataset.short : a.dataset.full;
    });
  });
});
