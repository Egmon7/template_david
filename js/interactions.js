function getInfrastructuresForCommune(communeName) {
  const zones = DATA?.mapZones || [];
  const target = zones.find(z => z.name === communeName) || { name: communeName };
  return getAllInfrastructures().filter(i => matchCommune(i.zone, [target]));
}

function renderCommunePanel(communeName) {
  const zones = getMapZonesLive();
  const zone = zones.find(z => z.name === communeName);
  if (!zone) return '';
  const items = getInfrastructuresForCommune(communeName);

  const list = items.length
    ? items.map(i => `
        <li class="flex items-start justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/50">
          <div class="min-w-0">
            <p class="text-sm font-medium">${i.nom}</p>
            <p class="text-xs text-slate-500">${i.categorie}</p>
          </div>
          ${etatBadge(i.etat)}
        </li>`).join('')
    : `<li class="list-none">${emptyState('Aucune infrastructure dans cette commune')}</li>`;

  return `
    <div class="flex items-start justify-between gap-2">
      <div>
        <h3 class="text-base font-semibold">${zone.name}</h3>
        <p class="mt-0.5 text-xs text-slate-500">${items.length} infrastructure(s) recensée(s)</p>
      </div>
      ${riskBadge(zone.risk)}
    </div>
    <ul class="mt-4 max-h-[50vh] space-y-2 overflow-y-auto">${list}</ul>
    <a href="infrastructures.html?zone=${encodeURIComponent(communeName)}" class="mt-4 block text-center text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white">Voir dans le tableau →</a>`;
}

function openCommunePanel(communeName) {
  const panel = document.getElementById('commune-panel');
  const inner = document.getElementById('commune-panel-body');
  if (!panel || !inner) return;
  const zones = getMapZonesLive();
  const zone = zones.find(z => z.name === communeName);
  const items = getInfrastructuresForCommune(communeName);
  inner.innerHTML = renderCommunePanel(communeName);
  panel.classList.remove('translate-x-full');
  panel.setAttribute('aria-hidden', 'false');
  const hint = document.getElementById('map-detail-hint');
  if (hint && zone) {
    hint.innerHTML = `<strong class="text-slate-900 dark:text-white">${zone.name}</strong> — ${items.length} infrastructure(s) · risque ${zone.risk === 'high' ? 'élevé' : zone.risk === 'medium' ? 'modéré' : 'faible'}`;
  }
  document.querySelectorAll('[data-zone-name]').forEach(btn => {
    btn.classList.toggle('ring-2', btn.dataset.zoneName === communeName);
    btn.classList.toggle('ring-white', btn.dataset.zoneName === communeName);
  });
}

function closeCommunePanel() {
  const panel = document.getElementById('commune-panel');
  panel?.classList.add('translate-x-full');
  panel?.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('[data-zone-name]').forEach(btn => {
    btn.classList.remove('ring-2', 'ring-white');
  });
}

function bindInteractiveMap() {
  document.querySelectorAll('[data-zone-name]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCommunePanel(btn.dataset.zoneName);
    });
  });
  document.getElementById('commune-panel-close')?.addEventListener('click', closeCommunePanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCommunePanel();
  });
  document.getElementById('commune-grid')?.addEventListener('click', (e) => {
    const card = e.target.closest('[data-commune]');
    if (card) openCommunePanel(card.dataset.commune);
  });
}

function bindInfraFilters() {
  const table = document.getElementById('infra-table');
  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  const zoneSel = document.getElementById('filter-zone');
  const catSel = document.getElementById('filter-categorie');
  const etatSel = document.getElementById('filter-etat');
  const countEl = document.getElementById('filter-count');
  const tags = document.querySelectorAll('.filter-tag');

  const apply = () => {
    const zone = zoneSel?.value || '';
    const cat = catSel?.value || '';
    const etat = etatSel?.value || '';
    let visible = 0;
    rows.forEach(row => {
      const ok = (!zone || row.dataset.zone === zone)
        && (!cat || row.dataset.categorie === cat)
        && (!etat || row.dataset.etat === etat);
      row.classList.toggle('hidden', !ok);
      if (ok) visible++;
    });
    const empty = document.getElementById('infra-empty');
    const tableWrap = document.getElementById('infra-table-wrap');
    if (empty) empty.classList.toggle('hidden', visible > 0);
    if (tableWrap) tableWrap.classList.toggle('hidden', visible === 0);
    if (countEl) countEl.textContent = `${visible} résultat${visible > 1 ? 's' : ''}`;
  };

  [zoneSel, catSel, etatSel].forEach(el => el?.addEventListener('change', apply));

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      const cat = tag.dataset.categorie;
      if (catSel) catSel.value = catSel.value === cat ? '' : cat;
      tags.forEach(t => t.classList.toggle('ring-2', t.dataset.categorie === catSel?.value && catSel.value));
      tags.forEach(t => t.classList.toggle('ring-black', t.dataset.categorie === catSel?.value && catSel.value));
      apply();
    });
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get('zone') && zoneSel) {
    zoneSel.value = params.get('zone');
  }
  apply();
}

function bindPageInteractions() {
  bindInteractiveMap();
  bindInfraFilters();
}
