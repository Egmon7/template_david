let DATA = null;
let currentPage = 'dashboard';
let importedRows = [];

const PAGES = [
  { id: 'dashboard', label: 'Tableau de bord', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'infrastructures', label: 'Gestion des infrastructures', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'planning', label: 'Planification urbaine', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
  { id: 'map', label: 'Cartographie et SIG', icon: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317-.159-.69-.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z' },
  { id: 'mobility', label: 'Mobilité et transport', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25' },
  { id: 'environment', label: 'Environnement', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-1.92 0-3.746-.52-5.374-1.42' },
  { id: 'socioeco', label: 'Activités socio-économiques', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75' },
  { id: 'projects', label: 'Gestion des projets', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'reports', label: 'Rapports et statistiques', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { id: 'notifications', label: 'Notifications', icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0' },
  { id: 'users', label: 'Utilisateurs et rôles', icon: 'M15 19.128a7.38 7.38 0 010-13.256M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
  { id: 'settings', label: 'Paramètres', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

function toggleSidebar(open) {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  if (open) {
    sb.classList.remove('-translate-x-full');
    ov.classList.remove('hidden');
  } else {
    sb.classList.add('-translate-x-full');
    ov.classList.add('hidden');
  }
}

function initTheme() {
  const saved = localStorage.getItem('projet_theme') || 'light';
  document.documentElement.classList.toggle('dark', saved === 'dark');
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('projet_theme', dark ? 'dark' : 'light');
  });
}

function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = PAGES.map(p => `
    <button type="button" data-page="${p.id}" onclick="navigate('${p.id}')"
      class="nav-item flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
      <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="${p.icon}"/></svg>
      <span class="truncate">${p.label}</span>
    </button>
  `).join('');
}

function setActiveNav(id) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('nav-active', el.dataset.page === id);
    el.classList.toggle('text-slate-600', el.dataset.page !== id);
  });
}

function navigate(page) {
  currentPage = page;
  location.hash = page;
  setActiveNav(page);
  toggleSidebar(false);
  const el = document.getElementById('app-content');
  const renderers = {
    dashboard: renderDashboard,
    infrastructures: renderInfrastructures,
    planning: renderPlanning,
    map: renderMap,
    mobility: renderMobility,
    environment: renderEnvironment,
    socioeco: renderSocioeco,
    projects: renderProjects,
    reports: renderReports,
    notifications: renderNotifications,
    users: renderUsers,
    settings: renderSettings,
  };
  el.innerHTML = (renderers[page] || renderDashboard)();
  if (page === 'infrastructures') bindImportHandlers();
  if (page === 'settings') bindImportHandlers();
}

function card(title, value, sub, color = '') {
  return `<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
    <p class="text-xs text-slate-500">${title}</p>
    <p class="mt-1 text-2xl font-semibold ${color}">${value}</p>
    ${sub ? `<p class="mt-1 text-xs text-slate-400">${sub}</p>` : ''}
  </div>`;
}

function barChart(items, valueKey = 'value', labelKey = 'month', maxH = 120) {
  const max = Math.max(...items.map(i => i[valueKey]));
  return `<div class="flex h-[${maxH}px] items-end gap-2">${items.map(i => {
    const h = Math.round((i[valueKey] / max) * 100);
    return `<div class="flex flex-1 flex-col items-center gap-1">
      <div class="w-full rounded-t bg-black/80 dark:bg-white/80" style="height:${h}%"></div>
      <span class="text-[10px] text-slate-400">${i[labelKey]}</span>
    </div>`;
  }).join('')}</div>`;
}

function renderDashboard() {
  const s = DATA.dashboard.stats;
  const session = getSession();
  return `
    <div class="mb-6">
      <h1 class="text-xl font-semibold">Bienvenue, ${session?.nom || 'Utilisateur'}</h1>
      <p class="text-sm text-slate-500">Vue d'ensemble de la plateforme urbaine</p>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      ${card('Infrastructures totales', s.totalInfrastructures.toLocaleString('fr-FR'))}
      ${card('Infrastructures critiques', s.critical, '', 'text-red-600')}
      ${card('Projets en cours', s.projectsInProgress)}
      ${card('Zones à risque', s.riskZones, '', 'text-amber-600')}
    </div>
    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Évolution des infrastructures</h2>
        <div class="mt-4">${barChart(DATA.dashboard.evolution)}</div>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Répartition par secteur</h2>
        <div class="mt-4 space-y-3">${(() => {
          const max = Math.max(...DATA.dashboard.bySector.map(s => s.count));
          return DATA.dashboard.bySector.map(s => `
          <div>
            <div class="mb-1 flex justify-between text-xs"><span>${s.name}</span><span>${s.count}</span></div>
            <div class="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div class="${s.color} h-full rounded-full" style="width:${Math.round(s.count / max * 100)}%"></div>
            </div>
          </div>`).join('');
        })()}</div>
      </div>
    </div>
    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Activités récentes</h2>
        <ul class="mt-4 space-y-3">${DATA.dashboard.recentActivities.map(a => `
          <li class="flex gap-3 text-sm">
            <span class="shrink-0 text-xs text-slate-400">${a.time}</span>
            <span class="text-slate-600 dark:text-slate-300">${a.text}</span>
          </li>`).join('')}</ul>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Alertes prioritaires</h2>
        <ul class="mt-4 space-y-3">${DATA.dashboard.priorityAlerts.map(a => {
          const c = a.level === 'critical' ? 'bg-red-100 text-red-800' : a.level === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700';
          return `<li class="rounded-lg px-3 py-2 text-sm ${c}"><strong>${a.title}</strong> — ${a.zone}</li>`;
        }).join('')}</ul>
      </div>
    </div>`;
}

function infraTable(rows) {
  if (!rows.length) return '<p class="text-sm text-slate-500">Aucune donnée.</p>';
  const keys = Object.keys(rows[0]);
  return `<div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
    <table class="w-full min-w-[640px] text-left text-sm">
      <thead class="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
        <tr>${keys.map(k => `<th class="px-4 py-3 font-medium">${k}</th>`).join('')}</tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
        ${rows.map(r => `<tr class="bg-white dark:bg-slate-900">${keys.map(k => `<td class="px-4 py-3">${r[k] ?? '—'}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function renderInfrastructures() {
  const all = [...DATA.infrastructures, ...importedRows];
  const cats = DATA.categories;
  return `
    <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold">Gestion des infrastructures</h1>
        <p class="text-sm text-slate-500">${all.length} éléments suivis</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <label class="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
          Importer CSV / JSON
          <input type="file" accept=".csv,.json" class="import-file hidden">
        </label>
        <a href="data/exemple-infrastructures.csv" download class="rounded-lg border border-slate-200 px-3 py-2 text-xs dark:border-slate-700">Exemple CSV</a>
        <a href="data/exemple-infrastructures.json" download class="rounded-lg border border-slate-200 px-3 py-2 text-xs dark:border-slate-700">Exemple JSON</a>
      </div>
    </div>
    <div id="import-result" class="mb-4 hidden rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"></div>
    <div class="mb-4 flex flex-wrap gap-2">${cats.map(c => `<span class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">${c}</span>`).join('')}</div>
    <div class="mb-6 grid gap-4 sm:grid-cols-3">
      ${card('Taux dégradation moyen', Math.round(all.reduce((a, i) => a + (i.degradation || 0), 0) / all.length) + '%')}
      ${card('Pannes ce mois', all.reduce((a, i) => a + (i.pannes || 0), 0))}
      ${card('Budget maintenance', (all.reduce((a, i) => a + (i.maintenance || 0), 0)).toLocaleString('fr-FR') + ' $')}
    </div>
    ${infraTable(all.map(i => ({ Nom: i.nom, Catégorie: i.categorie, État: i.etat, Zone: i.zone, 'Dégradation %': i.degradation, Pannes: i.pannes, 'Maintenance $': i.maintenance })))}`;
}

function renderPlanning() {
  const p = DATA.planning;
  return `
    <h1 class="mb-6 text-xl font-semibold">Planification urbaine</h1>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      ${card('Zones résidentielles', p.residential + '%')}
      ${card('Zones commerciales', p.commercial + '%')}
      ${card('Zones industrielles', p.industrial + '%')}
      ${card('Densité population', p.populationDensity.toLocaleString('fr-FR') + '/km²')}
    </div>
    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Occupation du sol</h2>
        <div class="mt-4 space-y-3">
          <div><div class="mb-1 flex justify-between text-xs"><span>Résidentiel</span><span>${p.residential}%</span></div><div class="h-2 rounded-full bg-slate-100"><div class="h-full w-[${p.residential}%] rounded-full bg-blue-500"></div></div></div>
          <div><div class="mb-1 flex justify-between text-xs"><span>Commercial</span><span>${p.commercial}%</span></div><div class="h-2 rounded-full bg-slate-100"><div class="h-full w-[${p.commercial}%] rounded-full bg-emerald-500"></div></div></div>
          <div><div class="mb-1 flex justify-between text-xs"><span>Industriel</span><span>${p.industrial}%</span></div><div class="h-2 rounded-full bg-slate-100"><div class="h-full w-[${p.industrial}%] rounded-full bg-amber-500"></div></div></div>
        </div>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Évolution des quartiers (%)</h2>
        <div class="mt-4">${barChart(p.neighborhoodEvolution.map(n => ({ month: n.quartier, value: n.growth })))}</div>
        <p class="mt-3 text-xs text-slate-500">Terrains disponibles : ${p.availableLand} ha</p>
      </div>
    </div>`;
}

function renderMap() {
  const zones = DATA.mapZones;
  return `
    <h1 class="mb-6 text-xl font-semibold">Cartographie et SIG</h1>
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="relative min-h-[400px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 lg:col-span-2 dark:border-slate-800 dark:bg-slate-800/50">
        <div class="absolute inset-0 opacity-30" style="background-image:linear-gradient(#94a3b8 1px,transparent 1px),linear-gradient(90deg,#94a3b8 1px,transparent 1px);background-size:24px 24px"></div>
        ${zones.map(z => {
          const col = z.risk === 'high' ? 'bg-red-500' : z.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500';
          return `<div class="absolute ${col} flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg" style="left:${z.x}%;top:${z.y}%" title="${z.name}"></div>
            <span class="absolute text-[10px] font-medium text-slate-600 dark:text-slate-300" style="left:${z.x}%;top:calc(${z.y}% + 12px);transform:translateX(-50%)">${z.name}</span>`;
        }).join('')}
        <p class="absolute bottom-3 left-3 text-xs text-slate-500">Couches : infrastructures · quartiers · zones à risque · thermique</p>
      </div>
      <div class="space-y-4">
        <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-sm font-medium">Statistiques par zone</h2>
          <ul class="mt-4 space-y-3">${zones.map(z => `
            <li class="flex justify-between text-sm">
              <span>${z.name}</span>
              <span class="text-slate-500">${z.infra} infra · ${z.risk}</span>
            </li>`).join('')}</ul>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-sm font-medium">Légende</h2>
          <div class="mt-3 space-y-2 text-xs">
            <div class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-emerald-500"></span> Faible risque</div>
            <div class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-amber-500"></span> Risque moyen</div>
            <div class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-red-500"></span> Risque élevé</div>
          </div>
        </div>
      </div>
    </div>`;
}

function metricRow(label, value) {
  return `<div class="mb-3"><div class="mb-1 flex justify-between text-xs"><span>${label}</span><span>${value}%</span></div>
    <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-full rounded-full bg-black dark:bg-white" style="width:${value}%"></div></div></div>`;
}

function renderMobility() {
  const m = DATA.mobility;
  return `<h1 class="mb-6 text-xl font-semibold">Mobilité et transport</h1>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      ${card('Indice trafic', m.trafficIndex + '/100')}
      ${card('État des routes', m.roadCondition + '%')}
      ${card('Temps déplacement', m.avgTravelTime + ' min')}
      ${card('Accessibilité', m.accessibility + '%')}
    </div>
    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Indicateurs</h2>
        <div class="mt-4">${metricRow('Trafic', m.trafficIndex)}${metricRow('Routes', m.roadCondition)}${metricRow('Accessibilité', m.accessibility)}</div>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Points d'embouteillage</h2>
        <ul class="mt-4 space-y-2">${m.congestionHotspots.map(h => `<li class="rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">${h}</li>`).join('')}</ul>
      </div>
    </div>`;
}

function renderEnvironment() {
  const e = DATA.environment;
  return `<h1 class="mb-6 text-xl font-semibold">Environnement</h1>
    <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div class="grid gap-6 sm:grid-cols-2">
        ${metricRow('Gestion des déchets', e.wasteManagement)}
        ${metricRow('Pollution de l\'air', e.airPollution)}
        ${metricRow('Pollution sonore', e.noisePollution)}
        ${metricRow('Eaux usées', e.wastewater)}
        ${metricRow('Risque inondation', e.floodRisk)}
        ${metricRow('Espaces verts', e.greenSpaces)}
      </div>
    </div>`;
}

function renderSocioeco() {
  const s = DATA.socioeco;
  const items = [
    ['Commerce', s.commerce], ['Agriculture urbaine', s.urbanAgriculture], ['Artisanat', s.crafts],
    ['Industrie', s.industry], ['Services', s.services], ['Santé (établ.)', s.health],
    ['Éducation (établ.)', s.education], ['Taux emploi', s.employment + '%'], ['Revenu moyen', s.avgIncome + ' $'],
  ];
  return `<h1 class="mb-6 text-xl font-semibold">Activités socio-économiques</h1>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${items.map(([l, v]) => card(l, typeof v === 'number' && v > 100 ? v.toLocaleString('fr-FR') : v)).join('')}</div>`;
}

function renderProjects() {
  const cols = { todo: 'À faire', inprogress: 'En cours', review: 'Revue', done: 'Terminé' };
  const colors = { todo: 'border-slate-200', inprogress: 'border-blue-200', review: 'border-amber-200', done: 'border-emerald-200' };
  return `<h1 class="mb-6 text-xl font-semibold">Gestion des projets de rénovation</h1>
    <div class="grid gap-4 md:grid-cols-4">
      ${Object.entries(cols).map(([key, title]) => `
        <div class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
          <h2 class="mb-3 text-xs font-medium text-slate-500">${title}</h2>
          <div class="space-y-2">${DATA.projects.filter(p => p.status === key).map(p => `
            <div class="rounded-lg border bg-white p-3 ${colors[key]} dark:bg-slate-900">
              <p class="text-sm font-medium">${p.title}</p>
              <p class="mt-1 text-xs text-slate-500">${p.priority} · ${p.budget.toLocaleString('fr-FR')} $</p>
              <div class="mt-2 h-1.5 rounded-full bg-slate-100"><div class="h-full rounded-full bg-black dark:bg-white" style="width:${p.progress}%"></div></div>
            </div>`).join('')}</div>
        </div>`).join('')}
    </div>`;
}

function renderReports() {
  return `<h1 class="mb-6 text-xl font-semibold">Rapports et statistiques</h1>
    <div class="mb-6 flex gap-2">
      <button type="button" class="rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black" onclick="alert('Export PDF simulé — rapport généré.')">Export PDF</button>
      <button type="button" class="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700" onclick="alert('Export Excel simulé — fichier .xlsx téléchargé.')">Export Excel</button>
    </div>
    <div class="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-slate-200 bg-slate-50 text-xs dark:border-slate-800 dark:bg-slate-800/50">
          <tr><th class="px-4 py-3">Période</th><th class="px-4 py-3">Type</th><th class="px-4 py-3">Statut</th><th class="px-4 py-3"></th></tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          ${DATA.reports.map(r => `<tr><td class="px-4 py-3">${r.month}</td><td class="px-4 py-3">${r.type}</td><td class="px-4 py-3 text-emerald-600">${r.status}</td>
            <td class="px-4 py-3"><button class="text-xs text-slate-500 hover:text-black" onclick="alert('Ouverture du rapport ${r.month}')">Voir</button></td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-sm font-medium">Aperçu statistiques</h2>
      <div class="mt-4">${barChart(DATA.dashboard.evolution)}</div>
    </div>`;
}

function renderNotifications() {
  return `<h1 class="mb-6 text-xl font-semibold">Notifications</h1>
    <ul class="space-y-2">${DATA.notifications.map(n => `
      <li class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 ${n.read ? 'opacity-60' : ''}">
        <span class="h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-slate-300' : 'bg-blue-500'}"></span>
        <div class="flex-1"><p class="text-sm font-medium">${n.title}</p><p class="text-xs text-slate-500">${n.time}</p></div>
      </li>`).join('')}</ul>`;
}

function renderUsers() {
  return `<h1 class="mb-6 text-xl font-semibold">Utilisateurs et rôles</h1>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${DATA.users.map(u => `
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-sm font-medium text-white dark:bg-white dark:text-black">${u.avatar}</span>
          <div><p class="font-medium">${u.nom}</p><p class="text-xs text-slate-500">${u.role}</p></div>
        </div>
        <p class="mt-3 text-xs text-slate-400">${u.email}</p>
      </div>`).join('')}</div>`;
}

function renderSettings() {
  return `<h1 class="mb-6 text-xl font-semibold">Paramètres</h1>
    <div class="max-w-lg space-y-6">
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Import de données</h2>
        <p class="mt-1 text-xs text-slate-500">Envoyez un fichier CSV ou JSON pour enrichir les infrastructures.</p>
        <label class="mt-4 inline-flex cursor-pointer rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black">
          Choisir un fichier
          <input type="file" accept=".csv,.json" class="import-file hidden">
        </label>
        <div id="import-result-settings" class="mt-3 hidden text-sm text-emerald-600"></div>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Comptes de démonstration</h2>
        <ul class="mt-3 space-y-2 text-xs text-slate-500">
          <li>admin@projet.cd — Jean Mbala (Administrateur)</li>
          <li>sarah@projet.cd — Sarah Ilunga</li>
          <li>patrick@projet.cd — Patrick Kabasele</li>
          <li>grace@projet.cd — Grâce Mbuyi</li>
          <li>david@projet.cd — David Tshibangu</li>
        </ul>
      </div>
    </div>`;
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = line.split(',').map(v => v.trim());
    const row = {};
    headers.forEach((h, i) => {
      const key = h.toLowerCase();
      if (key === 'nom') row.nom = vals[i];
      else if (key === 'categorie') row.categorie = vals[i];
      else if (key === 'etat') row.etat = vals[i];
      else if (key === 'zone') row.zone = vals[i];
      else if (key === 'degradation') row.degradation = Number(vals[i]) || 0;
      else if (key === 'pannes') row.pannes = Number(vals[i]) || 0;
      else if (key === 'maintenance') row.maintenance = Number(vals[i]) || 0;
      else row[h] = vals[i];
    });
    return row;
  });
}

function handleFileImport(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      let rows = [];
      if (file.name.endsWith('.json')) {
        const parsed = JSON.parse(e.target.result);
        rows = Array.isArray(parsed) ? parsed : [parsed];
        rows = rows.map(r => ({
          nom: r.nom, categorie: r.categorie, etat: r.etat, zone: r.zone,
          degradation: r.degradation || 0, pannes: r.pannes || 0, maintenance: r.maintenance || 0,
        }));
      } else {
        rows = parseCSV(e.target.result);
      }
      importedRows = [...importedRows, ...rows];
      const msg = `${rows.length} enregistrement(s) importé(s) avec succès.`;
      ['import-result', 'import-result-settings'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.textContent = msg; el.classList.remove('hidden'); }
      });
      if (currentPage === 'infrastructures') navigate('infrastructures');
    } catch (err) {
      alert('Erreur de lecture du fichier : ' + err.message);
    }
  };
  reader.readAsText(file);
}

function bindImportHandlers() {
  document.querySelectorAll('.import-file').forEach(input => {
    input.onchange = (e) => {
      const f = e.target.files[0];
      if (f) handleFileImport(f);
      e.target.value = '';
    };
  });
}

async function init() {
  if (!requireAuth()) return;
  initTheme();
  const session = getSession();
  document.getElementById('user-avatar').textContent = session.avatar;
  document.getElementById('user-name').textContent = session.nom;

  try {
    const res = await fetch('data/mock-data.json');
    DATA = res.ok ? await res.json() : window.MOCK_DATA;
  } catch {
    DATA = window.MOCK_DATA;
  }

  buildSidebar();
  const hash = location.hash.replace('#', '');
  navigate(PAGES.some(p => p.id === hash) ? hash : 'dashboard');

  document.getElementById('global-search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      navigate('infrastructures');
    }
  });

  window.addEventListener('hashchange', () => {
    const h = location.hash.replace('#', '');
    if (PAGES.some(p => p.id === h)) navigate(h);
  });
}

init();
