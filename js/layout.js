const APP_NAME = 'B.E.A.U';
const APP_TAGLINE = "Bureau d'études d'aménagement et d'urbanisme";

const PAGES = [
  { id: 'dashboard', file: 'dashboard.html', label: 'Tableau de bord', section: 'accueil', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'geography', file: 'geographie-demographie.html', label: 'Géographie & démographie', section: 'domaines', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
  { id: 'urbanism', file: 'urbanisme.html', label: 'Urbanisme & aménagement', section: 'domaines', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
  { id: 'infrastructures', file: 'infrastructures.html', label: 'Infrastructures & équipements', section: 'domaines', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'economymob', file: 'economie-mobilite.html', label: 'Économie, mobilité & admin.', section: 'domaines', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0H3.75m0 0h15M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25' },
  { id: 'environment', file: 'environnement.html', label: 'Environnement & patrimoines', section: 'domaines', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3' },
  { id: 'sources', file: 'sources.html', label: 'Sources & documents', section: 'domaines', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { id: 'map', file: 'cartographie.html', label: 'Cartographie SIG', section: 'outils', icon: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317-.159-.69-.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z' },
  { id: 'projects', file: 'projets.html', label: 'Gestion des projets', section: 'pilotage', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'reports', file: 'rapports.html', label: 'Rapports et statistiques', section: 'pilotage', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { id: 'notifications', file: 'notifications.html', label: 'Notifications', section: 'pilotage', icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0' },
  { id: 'users', file: 'utilisateurs.html', label: 'Utilisateurs et rôles', section: 'pilotage', icon: 'M15 19.128a7.38 7.38 0 010-13.256M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
  { id: 'settings', file: 'parametres.html', label: 'Paramètres', section: 'pilotage', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

const NAV_SECTION_LABELS = {
  domaines: 'Domaines d\'étude',
  outils: 'Outils',
  pilotage: 'Pilotage',
};

function toggleSidebar(open) {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  if (!sb) return;
  const isMobile = window.matchMedia('(max-width: 1023px)').matches;
  const shouldOpen = open === undefined ? sb.classList.contains('-translate-x-full') : open;

  if (shouldOpen) {
    sb.classList.remove('-translate-x-full');
    ov?.classList.remove('hidden');
    if (isMobile) {
      document.body.classList.add('overflow-hidden');
      const shell = document.getElementById('app-shell');
      shell?.classList.remove('overflow-y-auto');
      shell?.classList.add('overflow-hidden');
    }
  } else {
    sb.classList.add('-translate-x-full');
    ov?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    const shell = document.getElementById('app-shell');
    shell?.classList.remove('overflow-hidden');
    shell?.classList.add('overflow-y-auto');
  }
}

function initSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  if (!sb) return;

  document.getElementById('menu-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  ov?.addEventListener('click', () => toggleSidebar(false));

  document.querySelectorAll('#sidebar-nav a').forEach((link) => {
    link.addEventListener('click', () => toggleSidebar(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleSidebar(false);
  });

  window.addEventListener('resize', () => {
    const shell = document.getElementById('app-shell');
    if (window.matchMedia('(min-width: 1024px)').matches) {
      sb.classList.remove('-translate-x-full');
      ov?.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      shell?.classList.remove('overflow-hidden');
      if (!shell?.classList.contains('overflow-y-auto')) shell?.classList.add('overflow-y-auto');
    } else if (ov?.classList.contains('hidden')) {
      sb.classList.add('-translate-x-full');
      shell?.classList.remove('overflow-hidden');
      shell?.classList.add('overflow-y-auto');
    }
  });
}

function initTheme() {
  const saved = localStorage.getItem('projet_theme') || 'light';
  document.documentElement.classList.toggle('dark', saved === 'dark');
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('projet_theme', dark ? 'dark' : 'light');
  });
}

function buildSidebar(activeFile) {
  let html = '';
  let lastSection = null;
  PAGES.filter(p => canAccessPage(p.id)).forEach(p => {
    if (p.section && p.section !== 'accueil' && p.section !== lastSection) {
      const label = NAV_SECTION_LABELS[p.section];
      if (label) {
        html += `<p class="mb-1 mt-4 px-3 text-[10px] font-medium uppercase tracking-wider text-slate-400 first:mt-0">${label}</p>`;
      }
      lastSection = p.section;
    }
    const active = p.file === activeFile ? 'nav-active' : 'text-slate-600 dark:text-slate-400';
    html += `<a href="${p.file}" class="nav-item flex items-center gap-2.5 rounded-lg px-3 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white ${active}">
      <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="${p.icon}"/></svg>
      <span class="truncate">${p.label}</span>
    </a>`;
  });
  return html;
}

function getShell(activeFile, session) {
  const showNotifications = canAccessPage('notifications');
  const showSettings = canAccessPage('settings');
  const showInfraSearch = canAccessPage('infrastructures');
  return `
  <div id="app-layout" class="flex h-[100dvh] overflow-hidden lg:h-auto lg:min-h-screen lg:overflow-visible">
    <div id="sidebar-overlay" class="fixed inset-0 z-40 hidden bg-black/50 lg:hidden" aria-hidden="true"></div>
    <aside id="sidebar" class="fixed inset-y-0 left-0 z-50 flex h-full w-[min(18rem,88vw)] -translate-x-full flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:max-h-screen lg:w-64 lg:shrink-0 lg:translate-x-0 lg:shadow-none dark:border-slate-800 dark:bg-slate-900">
      <div class="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        <div class="block leading-tight">
          <span class="text-base font-semibold tracking-tight">${APP_NAME}</span>
          <span class="mt-0.5 block text-[10px] font-normal text-slate-400">${APP_TAGLINE}</span>
        </div>
        <button type="button" class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800" onclick="toggleSidebar(false)" aria-label="Fermer le menu">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <nav id="sidebar-nav" class="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain p-3 text-sm">${buildSidebar(activeFile)}</nav>
      <div class="shrink-0 border-t border-slate-200 px-3 py-2 dark:border-slate-800">
        <p class="truncate px-3 text-xs font-medium">${session.nom}</p>
        <p class="truncate px-3 text-[11px] text-slate-400">${session.role}</p>
      </div>
      <div class="shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
        <button type="button" onclick="logout()" class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">
          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>
          Déconnexion
        </button>
      </div>
    </aside>
    <div id="app-shell" class="flex h-full min-w-0 flex-1 flex-col overflow-y-auto overscroll-y-contain lg:h-auto lg:overflow-visible">
      <header class="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-white/95 px-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95 sm:gap-3 sm:px-4 lg:px-6">
        <button type="button" id="menu-btn" class="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800" aria-label="Menu">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        ${showInfraSearch ? `<div class="relative hidden min-w-0 flex-1 sm:block sm:max-w-md">
          <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input id="global-search" type="search" placeholder="Rechercher une infrastructure…" class="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-slate-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800">
        </div>` : ''}
        <div class="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
          ${showNotifications ? `<a href="notifications.html" class="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
            <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </a>` : ''}
          <select id="lang-select" class="hidden rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs sm:block dark:border-slate-700 dark:bg-slate-800">
            <option value="fr">FR</option><option value="en">EN</option>
          </select>
          <button type="button" id="theme-toggle" class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Thème">
            <svg class="h-5 w-5 dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>
            <svg class="hidden h-5 w-5 dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>
          </button>
          <div class="relative">
            <button type="button" id="user-menu-btn" class="flex items-center gap-2 rounded-lg border border-slate-200 py-1 pl-1 pr-2 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" aria-label="Menu utilisateur" aria-expanded="false">
              <span id="user-avatar" class="flex h-7 w-7 items-center justify-center rounded-md bg-black text-xs font-medium text-white dark:bg-white dark:text-black"></span>
              <span class="hidden min-w-0 sm:block">
                <span id="user-name" class="block max-w-[110px] truncate text-xs font-medium"></span>
                <span id="user-role" class="block max-w-[110px] truncate text-[10px] text-slate-400"></span>
              </span>
              <svg class="hidden h-3.5 w-3.5 text-slate-400 sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div id="user-menu" class="absolute right-0 top-full z-50 mt-1 hidden w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <div class="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                <p id="user-menu-name" class="truncate text-sm font-medium"></p>
                <p id="user-menu-role" class="truncate text-xs text-slate-500"></p>
              </div>
              ${showSettings ? `<a href="parametres.html" class="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">Paramètres</a>` : ''}
              <button type="button" onclick="logout()" class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">Déconnexion</button>
            </div>
          </div>
        </div>
      </header>
      <main id="main-content" class="flex-1 overflow-x-hidden p-4 lg:p-6"></main>
    </div>
  </div>`;
}

function initUserMenu(session) {
  const btn = document.getElementById('user-menu-btn');
  const menu = document.getElementById('user-menu');
  if (!btn || !menu) return;

  document.getElementById('user-menu-name').textContent = session.nom;
  document.getElementById('user-menu-role').textContent = session.role;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
  });

  document.addEventListener('click', () => {
    menu.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
  });
}

async function initPage(activeFile, pageTitle, renderContent, afterRender) {
  if (!requireAuth()) return;
  if (!requirePageAccess(activeFile)) return;

  const session = getSession();
  document.title = pageTitle + ' — ' + APP_NAME;
  document.body.innerHTML = getShell(activeFile, session);
  document.body.className = 'h-[100dvh] overflow-hidden bg-slate-50 text-slate-900 antialiased lg:h-auto lg:overflow-visible dark:bg-slate-950 dark:text-slate-100';

  document.getElementById('user-avatar').textContent = session.avatar;
  document.getElementById('user-name').textContent = session.nom;
  document.getElementById('user-role').textContent = session.role;
  initUserMenu(session);
  initSidebar();

  initTheme();
  await loadData();

  document.getElementById('main-content').innerHTML = renderContent();
  document.getElementById('global-search')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim() && canAccessPage('infrastructures')) {
      window.location.href = 'infrastructures.html';
    }
  });

  if (afterRender) afterRender();
  bindPageInteractions();
}
