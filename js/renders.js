function renderDashboard() {
  const s = DATA.dashboard.stats;
  const stats = getInfraStats();
  const session = getSession();
  const roleId = getRoleId(session);
  const env = DATA.environment;
  const mob = DATA.mobility;
  const zones = getMapZonesLive();
  const evolution = getEvolutionLive();
  const sectors = getSectorCounts();
  const activities = getRecentActivityLive();

  const highRiskCount = zones.filter(z => z.risk === 'high').length;

  const criticalInfra = canAccessPage('infrastructures')
    ? getAllInfrastructures().filter(isCriticalInfra)
    : [];
  const alerts = [
    ...(canAccessPage('infrastructures') ? DATA.dashboard.priorityAlerts.map(a => ({
      level: a.level, title: a.title, detail: a.zone, href: 'infrastructures.html', cta: 'Voir',
    })) : []),
    ...getImportAlerts(),
    ...criticalInfra.filter(i => !i.imported).slice(0, 2).map(i => ({
      level: 'critical', title: i.nom, detail: `${i.zone} · dégradation ${i.degradation}%`,
      href: 'infrastructures.html', cta: 'Inspecter',
    })),
  ].slice(0, 5);

  const quickLinks = [
    canAccessPage('infrastructures') && { file: 'infrastructures.html', label: 'Infrastructures', desc: `${stats.total} actifs` },
    canAccessPage('map') && { file: 'cartographie.html', label: 'Cartographie', desc: '24 communes' },
    canAccessPage('projects') && { file: 'projets.html', label: 'Projets', desc: `${s.projectsInProgress} en cours` },
    canAccessPage('reports') && { file: 'rapports.html', label: 'Rapports', desc: 'Exporter les données' },
    canAccessPage('environment') && { file: 'environnement.html', label: 'Environnement', desc: `Indice ${env.greenSpaces}%` },
    canAccessPage('mobility') && { file: 'mobilite.html', label: 'Mobilité', desc: `Accessibilité ${mob.accessibility}%` },
    canAccessPage('planning') && { file: 'planification.html', label: 'Planification', desc: 'Zones et densité' },
  ].filter(Boolean);

  const roleTagline = {
    admin: 'vue complète de la ville.',
    infra: 'vos infrastructures en un coup d\'œil.',
    sig: 'vos données géographiques.',
    env: 'l\'état environnemental.',
    projet: 'vos projets urbains.',
    visiteur: 'aperçu limité de la plateforme.',
  };

  const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const firstName = (session?.nom || 'Utilisateur').split(' ')[0];
  const growth = evolution.length > 1
    ? Math.round(((evolution.at(-1).value - evolution[0].value) / evolution[0].value) * 100)
    : 0;

  const alertsBlock = alerts.length ? `
        <div class="flex flex-1 flex-col gap-2">${alerts.map(attentionItem).join('')}</div>
        ${canAccessPage('notifications') ? '<a href="notifications.html" class="mt-4 text-center text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white">Toutes les notifications →</a>' : ''}`
    : `<p class="flex flex-1 items-center text-sm text-slate-500">Aucune alerte pour votre périmètre.</p>`;

  const mapBlock = canAccessPage('map') ? `
      <div class="lg:col-span-8">
        ${interactiveZoneMap(zones, { link: 'cartographie.html', dense: true, compact: true })}
      </div>` : '';

  const pulseItems = [
    canAccessPage('mobility') && { label: 'Mobilité', value: mob.accessibility, color: 'bg-black dark:bg-white' },
    canAccessPage('environment') && { label: 'Espaces verts', value: env.greenSpaces, color: 'bg-emerald-500' },
    canAccessPage('environment') && { label: 'Risque inondation', value: env.floodRisk, color: 'bg-amber-500' },
    canAccessPage('projects') && { label: 'Projets actifs', value: s.projectsInProgress, bar: false },
  ].filter(Boolean);

  return `
    ${communePanelShell()}
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <p class="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">Centre de situation</p>
          <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">${session.role}</span>
        </div>
        <h1 class="mt-2 text-3xl font-medium leading-[1.1] tracking-tight md:text-4xl">
          ${firstName},<br>
          <span class="text-slate-400">${roleTagline[roleId] || roleTagline.visiteur}</span>
        </h1>
      </div>
      <div class="text-right text-sm text-slate-500">
        <p class="capitalize">${dateStr}</p>
        <p class="mt-0.5 text-xs">Kinshasa · sync il y a 8 min</p>
      </div>
    </div>

    <div class="mt-8 grid gap-4 lg:grid-cols-12">
      <div class="relative overflow-hidden rounded-2xl bg-black p-6 text-white lg:col-span-7 dark:bg-white dark:text-black">
        <div class="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl dark:bg-black/10"></div>
        <p class="relative text-xs font-medium uppercase tracking-widest text-white/50 dark:text-black/50">Résumé de Kinshasa</p>
        <p class="relative mt-2 text-sm text-white/70 dark:text-black/60">Données recensées dans la plateforme.</p>
        <div class="relative mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div><p class="text-3xl font-medium">24</p><p class="mt-0.5 text-[11px] text-white/50 dark:text-black/50">communes</p></div>
          ${canAccessPage('infrastructures') ? `<div>
            <p class="text-3xl font-medium">${stats.total}</p>
            <p class="mt-0.5 text-[11px] text-white/50 dark:text-black/50">infrastructures</p>
          </div>
          <div>
            <p class="text-3xl font-medium text-amber-400 dark:text-amber-600">${stats.critical}</p>
            <p class="mt-0.5 text-[11px] text-white/50 dark:text-black/50">points critiques</p>
          </div>` : ''}
          ${canAccessPage('map') ? `<div>
            <p class="text-3xl font-medium text-red-400 dark:text-red-600">${highRiskCount}</p>
            <p class="mt-0.5 text-[11px] text-white/50 dark:text-black/50">communes à risque élevé</p>
          </div>` : ''}
          ${canAccessPage('projects') ? `<div>
            <p class="text-3xl font-medium">${s.projectsInProgress}</p>
            <p class="mt-0.5 text-[11px] text-white/50 dark:text-black/50">projets en cours</p>
          </div>` : ''}
        </div>
        ${canAccessPage('infrastructures') ? `<div class="relative mt-6 border-t border-white/10 pt-4 dark:border-black/10">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-xs text-white/50 dark:text-black/50">Évolution du recensement</p>
              <p class="mt-1 text-sm font-medium">${growth >= 0 ? '+' : ''}${growth}% sur 6 mois</p>
            </div>
            ${sparkline(evolution)}
          </div>
        </div>` : ''}
      </div>

      <div class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-medium">À traiter en priorité</h2>
          ${alerts.length ? `<span class="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-950 dark:text-red-300">${alerts.length} signal${alerts.length > 1 ? 's' : ''}</span>` : ''}
        </div>
        ${alertsBlock}
      </div>
    </div>

    ${(mapBlock || pulseItems.length) ? `<div class="mt-6 grid gap-6 lg:grid-cols-12">
      ${mapBlock}
      <div class="flex flex-col gap-6 ${canAccessPage('map') ? 'lg:col-span-4' : 'lg:col-span-12'}">
        ${pulseItems.length ? `<div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-sm font-medium">Pulse urbain</h2>
          <ul class="mt-4 space-y-4">${pulseItems.map(item => item.bar === false
            ? `<li><div class="flex justify-between text-xs"><span class="text-slate-500">${item.label}</span><span class="font-medium">${item.value}</span></div></li>`
            : `<li>
              <div class="flex justify-between text-xs"><span class="text-slate-500">${item.label}</span><span class="font-medium">${item.value}%</span></div>
              <div class="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-full rounded-full ${item.color}" style="width:${item.value}%"></div></div>
            </li>`).join('')}</ul>
        </div>` : ''}
        <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-sm font-medium">Activités récentes</h2>
          <div class="mt-4">${activityTimeline(activities)}</div>
        </div>
      </div>
    </div>` : ''}

    ${canAccessPage('infrastructures') && sectors.some(s => s.count > 0) ? `<div class="mt-8 grid gap-6 lg:grid-cols-2">
      <div>
        <h2 class="text-sm font-medium text-slate-500">Répartition par secteur</h2>
        <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          ${sectors.filter(s => s.count > 0).map((sec, i) => sectorTile(sec.name, sec.count, i === 0 ? 'text-blue-600 dark:text-blue-400' : '')).join('')}
        </div>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Jauges par secteur</h2>
        <div class="mt-4">${sectorGauge(sectors.filter(s => s.count > 0))}</div>
      </div>
    </div>` : ''}

    ${quickLinks.length ? `<div class="mt-8">
      <h2 class="text-sm font-medium text-slate-500">Accès rapides</h2>
      <div class="mt-3 flex flex-wrap gap-3">
        ${quickLinks.map(l => quickAccess(l.file, l.label, l.desc)).join('')}
      </div>
    </div>` : ''}`;
}

function renderInfrastructures() {
  const all = getAllInfrastructures();
  const stats = getInfraStats();
  const opts = getFilterOptions();

  return `
    <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div><h1 class="text-xl font-semibold">Gestion des infrastructures</h1><p class="text-sm text-slate-500">${stats.total} élément${stats.total > 1 ? 's' : ''} recensé${stats.total > 1 ? 's' : ''}</p></div>
      <div class="flex flex-wrap gap-2">
        <label class="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900">Importer CSV / JSON<input type="file" accept=".csv,.json" class="import-file hidden"></label>
        <a href="../data/exemple-infrastructures.csv" download class="rounded-lg border border-slate-200 px-3 py-2 text-xs dark:border-slate-700">Exemple CSV</a>
        <a href="../data/exemple-infrastructures.json" download class="rounded-lg border border-slate-200 px-3 py-2 text-xs dark:border-slate-700">Exemple JSON</a>
      </div>
    </div>
    <div id="import-result" class="mb-4 hidden rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"></div>
    <div class="mb-4 flex flex-wrap gap-2">
      ${opts.categories.map(c => `<button type="button" class="filter-tag rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700" data-categorie="${c}">${c}</button>`).join('')}
    </div>
    ${infraFilterBar(opts.zones, opts.categories, opts.etats)}
    <div class="mb-6 grid gap-4 sm:grid-cols-3">
      ${card('Taux dégradation moyen', stats.avgDegradation + '%')}
      ${card('Pannes ce mois', stats.totalPannes)}
      ${card('Budget maintenance', stats.totalMaintenance.toLocaleString('fr-FR') + ' $')}
    </div>
    ${infraTableRows(all)}`;
}

function renderPlanning() {
  const p = DATA.planning;
  const donut = donutChart([
    { label: 'Résidentiel', value: p.residential, color: '#3b82f6' },
    { label: 'Commercial', value: p.commercial, color: '#10b981' },
    { label: 'Industriel', value: p.industrial, color: '#f59e0b' },
  ]);
  return `<h1 class="mb-6 text-xl font-semibold">Planification urbaine</h1>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      ${card('Zones résidentielles', p.residential + '%')}${card('Zones commerciales', p.commercial + '%')}
      ${card('Zones industrielles', p.industrial + '%')}${card('Densité population', p.populationDensity.toLocaleString('fr-FR') + '/km²')}
    </div>
    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Occupation du sol</h2>
        <div class="mt-6">${donut}</div>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Répartition par type</h2>
        <div class="mt-4 space-y-3">
          ${[['Résidentiel', p.residential, 'bg-blue-500'], ['Commercial', p.commercial, 'bg-emerald-500'], ['Industriel', p.industrial, 'bg-amber-500']].map(([l, v, c]) => `
          <div><div class="mb-1 flex justify-between text-xs"><span>${l}</span><span>${v}%</span></div>
          <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-full rounded-full ${c}" style="width:${v}%"></div></div></div>`).join('')}
        </div>
        <p class="mt-4 text-xs text-slate-500">Terrains disponibles : ${p.availableLand} ha</p>
        <div class="mt-4">${barChart(p.neighborhoodEvolution.map(n => ({ month: n.quartier.slice(0, 6), value: n.growth })))}</div>
      </div>
    </div>`;
}

function renderMap() {
  const zones = getMapZonesLive();
  const high = zones.filter(z => z.risk === 'high').length;
  const medium = zones.filter(z => z.risk === 'medium').length;
  const low = zones.filter(z => z.risk === 'low').length;
  const totalInfra = zones.reduce((a, z) => a + z.infra, 0);

  return `
    ${communePanelShell()}
    <div class="mb-6">
      <h1 class="text-xl font-semibold">Cartographie et SIG</h1>
      <p class="mt-1 text-sm text-slate-500">Kinshasa — ${zones.length} communes · cliquez sur un point pour le détail</p>
    </div>

    <div class="mb-4 grid gap-3 sm:grid-cols-4">
      ${card('Communes', zones.length)}
      ${card('Infrastructures', totalInfra.toLocaleString('fr-FR'))}
      ${card('Risque élevé', high, '', 'text-red-600')}
      ${card('Risque modéré', medium, '', 'text-amber-600')}
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        ${interactiveZoneMap(zones, { dense: true })}
        <p class="mt-2 text-xs text-slate-400">Survolez ou cliquez un point — ${low} commune${low > 1 ? 's' : ''} à faible risque</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Légende</h2>
        <ul class="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <li class="flex items-center gap-2"><span class="h-3 w-3 rounded-full bg-emerald-500"></span><strong class="text-slate-900 dark:text-white">Faible</strong> — situation normale</li>
          <li class="flex items-center gap-2"><span class="h-3 w-3 rounded-full bg-amber-500"></span><strong class="text-slate-900 dark:text-white">Modéré</strong> — surveillance</li>
          <li class="flex items-center gap-2"><span class="h-3 w-3 rounded-full bg-red-500"></span><strong class="text-slate-900 dark:text-white">Élevé</strong> — intervention prioritaire</li>
        </ul>
        <div id="map-detail-hint" class="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800">
          Sélectionnez une commune sur la carte ou dans la liste ci-dessous.
        </div>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="mb-3 text-sm font-medium text-slate-500">Les 24 communes de Kinshasa</h2>
      ${communeGrid(zones)}
    </div>`;
}

function renderMobility() {
  const m = DATA.mobility;
  return `<h1 class="mb-6 text-xl font-semibold">Mobilité et transport</h1>
    <div class="grid gap-4 sm:grid-cols-2">
      ${trafficLight(m.trafficIndex, 'Indice trafic')}
      ${trafficLight(m.roadCondition, 'État des routes')}
      ${trafficLight(100 - m.accessibility, 'Congestion')}
      ${trafficLight(Math.min(m.avgTravelTime * 2, 100), 'Temps de déplacement')}
    </div>
    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Carte des embouteillages</h2>
        <div class="mt-4">${congestionMap(m.congestionHotspots)}</div>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Points d'embouteillage</h2>
        <ul class="mt-4 space-y-2">${m.congestionHotspots.map(h => `
          <li class="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm dark:bg-red-950/30">
            <span class="mr-2 h-2 w-2 rounded-full bg-red-500"></span>${h}
          </li>`).join('')}</ul>
        <div class="mt-4">${metricRow('Accessibilité', m.accessibility)}</div>
      </div>
    </div>`;
}

function renderEnvironment() {
  const e = DATA.environment;
  const tone = (v, invert) => {
    const x = invert ? 100 - v : v;
    return x >= 65 ? 'good' : x >= 40 ? 'warn' : 'bad';
  };
  return `<h1 class="mb-6 text-xl font-semibold">Environnement</h1>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      ${envIndicatorCard('♻️', 'Gestion des déchets', e.wasteManagement, tone(e.wasteManagement))}
      ${envIndicatorCard('💨', 'Qualité de l\'air', e.airPollution, tone(e.airPollution, true))}
      ${envIndicatorCard('🔊', 'Pollution sonore', e.noisePollution, tone(e.noisePollution, true))}
      ${envIndicatorCard('💧', 'Eaux usées', e.wastewater, tone(e.wastewater))}
      ${envIndicatorCard('🌊', 'Risque inondation', e.floodRisk, tone(e.floodRisk, true))}
      ${envIndicatorCard('🌳', 'Espaces verts', e.greenSpaces, tone(e.greenSpaces))}
    </div>`;
}

function renderSocioeco() {
  const s = DATA.socioeco;
  const items = [
    ['🏪', 'Commerce', s.commerce], ['🌾', 'Agriculture urbaine', s.urbanAgriculture],
    ['🔨', 'Artisanat', s.crafts], ['🏭', 'Industrie', s.industry],
    ['💼', 'Services', s.services], ['🏥', 'Santé', s.health],
    ['🎓', 'Éducation', s.education], ['👔', 'Emploi', s.employment + '%'],
    ['💰', 'Revenu moyen', s.avgIncome + ' $'],
  ];
  return `<h1 class="mb-6 text-xl font-semibold">Activités socio-économiques</h1>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${items.map(([icon, l, v]) => socioActivityCard(icon, l, v)).join('')}</div>`;
}

function renderProjects() {
  const active = DATA.projects.filter(p => p.status !== 'done').length;
  const statusOrder = { inprogress: 0, review: 1, todo: 2, done: 3 };
  const sorted = [...DATA.projects].sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));

  return `<h1 class="mb-2 text-xl font-semibold">Gestion des projets</h1>
    <p class="mb-6 text-sm text-slate-500">${active} projet${active > 1 ? 's' : ''} actif${active > 1 ? 's' : ''} sur ${DATA.projects.length}</p>
    <div class="space-y-4">
      ${sorted.map(p => `
        <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="font-medium">${p.title}</h3>
                ${projectStatusBadge(p.status)}
              </div>
              <p class="mt-1 text-xs text-slate-500">${p.priority} · ${p.budget.toLocaleString('fr-FR')} $</p>
            </div>
            <span class="text-sm font-semibold">${p.progress}%</span>
          </div>
          <div class="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div class="h-full rounded-full ${p.status === 'done' ? 'bg-emerald-500' : p.status === 'inprogress' ? 'bg-blue-500' : 'bg-black dark:bg-white'}" style="width:${p.progress}%"></div>
          </div>
        </div>`).join('')}
    </div>`;
}

function renderReports() {
  const stats = getInfraStats();
  const sectors = getSectorCounts();
  return `<h1 class="mb-6 text-xl font-semibold">Rapports et statistiques</h1>
    <div class="mb-6 flex gap-2">
      <button type="button" class="rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black" onclick="alert('Export PDF simulé.')">Export PDF</button>
      <button type="button" class="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700" onclick="alert('Export Excel simulé.')">Export Excel</button>
    </div>
    <div class="grid gap-6 lg:grid-cols-2">
      ${reportPreview(stats, sectors)}
      <div class="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs dark:border-slate-800 dark:bg-slate-800/50">
            <tr><th class="px-4 py-3">Période</th><th class="px-4 py-3">Type</th><th class="px-4 py-3">Statut</th></tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            ${DATA.reports.map(r => `<tr class="bg-white dark:bg-slate-900"><td class="px-4 py-3">${r.month}</td><td class="px-4 py-3">${r.type}</td><td class="px-4 py-3 text-emerald-600">${r.status}</td></tr>`).join('')}
          </tbody>
        </table>
        <div class="p-5">
          <h2 class="text-sm font-medium">Évolution</h2>
          <div class="mt-4">${barChart(getEvolutionLive())}</div>
        </div>
      </div>
    </div>`;
}

function renderNotifications() {
  const groups = { alerte: [], rapport: [], import: [], projet: [], info: [] };
  DATA.notifications.forEach(n => {
    const { type } = notificationType(n.title);
    groups[type].push(n);
  });
  const labels = { alerte: 'Alertes', rapport: 'Rapports', import: 'Imports & SIG', projet: 'Projets', info: 'Informations' };

  return `<h1 class="mb-6 text-xl font-semibold">Notifications</h1>
    <div class="space-y-6">
      ${Object.entries(groups).filter(([, items]) => items.length).map(([type, items]) => `
        <div>
          <h2 class="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">${labels[type]}</h2>
          <ul class="space-y-2">${items.map(n => {
            const meta = notificationType(n.title);
            return `<li class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 ${n.read ? 'opacity-60' : ''}">
              <span class="rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.color}">${meta.label}</span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium">${n.title}</p>
                <p class="text-xs text-slate-500">${n.time}</p>
              </div>
              ${!n.read ? '<span class="h-2 w-2 shrink-0 rounded-full bg-blue-500"></span>' : ''}
            </li>`;
          }).join('')}</ul>
        </div>`).join('')}
    </div>`;
}

function renderUsers() {
  const roleIds = Object.keys(ROLES);
  const pageIds = Object.keys(PAGE_LABELS);

  return `<h1 class="mb-2 text-xl font-semibold">Utilisateurs et rôles</h1>
    <p class="mb-6 text-sm text-slate-500">Matrice des permissions par rôle sur la plateforme.</p>

    <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${DATA.users.map(u => {
      const roleId = Object.entries(DEMO_USERS).find(([email]) => email === u.email)?.[1]?.roleId
        || Object.keys(ROLES).find(id => ROLES[id].label === u.role) || 'visiteur';
      const count = getAllowedPageIds(roleId).length;
      return `
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-sm font-medium text-white dark:bg-white dark:text-black">${u.avatar}</span>
          <div><p class="font-medium">${u.nom}</p><p class="text-xs text-slate-500">${u.role}</p></div>
        </div>
        <p class="mt-3 text-xs text-slate-400">${u.email}</p>
        <p class="mt-2 text-xs text-slate-500">${count} page${count > 1 ? 's' : ''} autorisée${count > 1 ? 's' : ''}</p>
      </div>`;
    }).join('')}</div>

    <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
          <tr>
            <th class="px-4 py-3 font-medium">Rôle</th>
            ${pageIds.map(id => `<th class="px-3 py-3 font-medium">${PAGE_LABELS[id]}</th>`).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          ${roleIds.map(roleId => `
            <tr class="bg-white dark:bg-slate-900">
              <td class="px-4 py-3 font-medium">${ROLES[roleId].label}</td>
              ${pageIds.map(pageId => {
                const ok = roleCanAccess(roleId, pageId);
                return `<td class="px-3 py-3 text-center text-xs ${ok ? 'text-emerald-600' : 'text-slate-300 dark:text-slate-600'}">${ok ? '✓' : '—'}</td>`;
              }).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function renderSettings() {
  const showImport = canAccessPage('infrastructures');
  return `<h1 class="mb-6 text-xl font-semibold">Paramètres</h1>
    <div class="max-w-lg space-y-6">
      ${showImport ? `<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Import de données</h2>
        <p class="mt-1 text-xs text-slate-500">Envoyez un fichier CSV ou JSON pour enrichir les infrastructures.</p>
        <label class="mt-4 inline-flex cursor-pointer rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black">Choisir un fichier<input type="file" accept=".csv,.json" class="import-file hidden"></label>
        <div id="import-result-settings" class="mt-3 hidden text-sm text-emerald-600"></div>
      </div>` : ''}
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Votre compte</h2>
        <p class="mt-2 text-sm font-medium">${getSession()?.nom}</p>
        <p class="text-xs text-slate-500">${getSession()?.role}</p>
        <p class="mt-1 text-xs text-slate-400">${getSession()?.email}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-sm font-medium">Comptes de démonstration</h2>
        <ul class="mt-3 space-y-2 text-xs text-slate-500">
          <li>admin@projet.cd — Jean Mbala · Administrateur</li>
          <li>sarah@projet.cd — Sarah Ilunga · Responsable Infrastructures</li>
          <li>patrick@projet.cd — Patrick Kabasele · Analyste SIG</li>
          <li>grace@projet.cd — Grâce Mbuyi · Responsable Environnement</li>
          <li>david@projet.cd — David Tshibangu · Chef de Projet</li>
        </ul>
      </div>
    </div>`;
}
