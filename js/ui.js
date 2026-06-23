function card(title, value, sub = '', color = '', extraClass = '') {
  return `<div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 ${extraClass}">
    <p class="text-xs text-slate-500">${title}</p>
    <p class="mt-1 text-2xl font-semibold ${color}">${value}</p>
    ${sub ? `<p class="mt-1 text-xs text-slate-400">${sub}</p>` : ''}
  </div>`;
}

function emptyState(message) {
  return `<div class="flex flex-col items-center justify-center py-8 text-center">
    <svg class="mb-2 h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M5.25 7.5h13.5"/></svg>
    <p class="text-sm text-slate-500">${message}</p>
  </div>`;
}

function etatBadge(etat) {
  const map = {
    Critique: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    Dégradé: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    Moyen: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    Bon: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  };
  const cls = map[etat] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  return `<span class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}">${etat || '—'}</span>`;
}

function sparkline(items, valueKey = 'value') {
  const vals = items.map(i => i[valueKey]);
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" class="h-8 w-28" fill="none" aria-hidden="true">
    <polyline points="${pts}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white/70"/>
  </svg>`;
}

function interactiveZoneMap(zones, { compact = false, link = null, dense = false, mapId = 'zone-map' } = {}) {
  const h = compact ? 'min-h-[220px]' : dense ? 'min-h-[420px]' : 'min-h-[320px]';
  const dotSize = dense ? 'h-2.5 w-2.5 ring-2' : 'h-3 w-3 ring-4';
  const dots = zones.map(z => {
    const ring = z.risk === 'high' ? 'ring-red-400/60' : z.risk === 'medium' ? 'ring-amber-400/60' : 'ring-emerald-400/40';
    const fill = z.risk === 'high' ? 'bg-red-500' : z.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500';
    const pulse = z.risk === 'high' ? 'animate-pulse' : '';
    const riskLabel = z.risk === 'high' ? 'risque élevé' : z.risk === 'medium' ? 'risque modéré' : 'faible risque';
    return `<button type="button" data-zone-name="${z.name}" class="zone-dot group absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition hover:scale-125 focus:outline-none focus:ring-2 focus:ring-white" style="left:${z.x}%;top:${z.y}%">
      <span class="block rounded-full ${dotSize} ${fill} ${pulse} ${ring}"></span>
      <span class="zone-tooltip pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus:opacity-100 dark:bg-white dark:text-black">${z.name} · ${z.infra} infra · ${riskLabel}</span>
    </button>`;
  }).join('');
  const footer = link
    ? `<a href="${link}" class="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm backdrop-blur hover:bg-white dark:bg-slate-900/90 dark:text-slate-200">Ouvrir la cartographie →</a>`
    : '';
  return `<div id="${mapId}" class="relative ${h} overflow-hidden rounded-2xl bg-slate-950 text-white dark:bg-slate-900">
    <div class="absolute inset-0 opacity-20" style="background-image:radial-gradient(circle at 30% 40%,#3b82f6 0%,transparent 50%),radial-gradient(circle at 70% 60%,#10b981 0%,transparent 45%)"></div>
    <div class="absolute inset-0 opacity-[0.12]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:32px 32px"></div>
    <p class="absolute left-4 top-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">Kinshasa · ${zones.length} communes · cliquer pour détail</p>
    <div class="absolute right-4 top-4 flex flex-col gap-1 rounded-lg bg-black/40 px-2 py-1.5 text-[10px] backdrop-blur">
      <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-emerald-500"></span> Faible</span>
      <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-amber-500"></span> Modéré</span>
      <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-red-500"></span> Élevé</span>
    </div>
    ${dots}
    ${footer}
  </div>`;
}

function communePanelShell() {
  return `<aside id="commune-panel" class="fixed inset-y-0 right-0 z-50 w-[min(20rem,90vw)] translate-x-full border-l border-slate-200 bg-white p-5 shadow-xl transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900" aria-hidden="true">
    <button type="button" id="commune-panel-close" class="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Fermer">
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
    <div id="commune-panel-body" class="mt-8"></div>
  </aside>`;
}

function zoneMap(zones, opts = {}) {
  return interactiveZoneMap(zones, opts);
}

function riskBadge(risk) {
  const styles = {
    low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  };
  const labels = { low: 'Faible', medium: 'Modéré', high: 'Élevé' };
  return `<span class="rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[risk]}">${labels[risk]}</span>`;
}

function communeGrid(zones) {
  return `<div id="commune-grid" class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
    ${zones.map(z => `
      <button type="button" data-commune="${z.name}" class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
        <div class="min-w-0">
          <p class="truncate text-sm font-medium">${z.name}</p>
          <p class="text-xs text-slate-500">${z.infra} infrastructure${z.infra > 1 ? 's' : ''}</p>
        </div>
        ${riskBadge(z.risk)}
      </button>`).join('')}
  </div>`;
}

function sectorGauge(sectors) {
  const max = Math.max(...sectors.map(s => s.count), 1);
  const colors = { Routes: 'bg-blue-500', Eau: 'bg-cyan-500', Énergie: 'bg-amber-500', Santé: 'bg-rose-500', Éducation: 'bg-violet-500', Autres: 'bg-slate-400' };
  return `<div class="space-y-3">${sectors.map(s => `
    <div>
      <div class="mb-1 flex justify-between text-xs"><span class="font-medium">${s.name}</span><span class="text-slate-500">${s.count}</span></div>
      <div class="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div class="h-full rounded-full ${colors[s.name] || 'bg-slate-400'}" style="width:${Math.round(s.count / max * 100)}%"></div>
      </div>
    </div>`).join('')}</div>`;
}

function activityTimeline(activities) {
  const icons = { info: 'text-blue-500', success: 'text-emerald-500', warning: 'text-amber-500' };
  return `<ul class="space-y-4">${activities.slice(0, 4).map(a => `
    <li class="flex gap-3">
      <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full ${icons[a.type] || 'bg-slate-400'} bg-current"></span>
      <div>
        <p class="text-sm leading-snug">${a.text}</p>
        <p class="mt-0.5 text-xs text-slate-400">${a.time}</p>
      </div>
    </li>`).join('')}</ul>`;
}

function donutChart(segments) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  let offset = 0;
  const r = 40;
  const c = 2 * Math.PI * r;
  const slices = segments.map(s => {
    const pct = s.value / total;
    const dash = pct * c;
    const slice = `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${s.color}" stroke-width="20" stroke-dasharray="${dash} ${c}" stroke-dashoffset="${-offset}" transform="rotate(-90 50 50)"/>`;
    offset += dash;
    return slice;
  }).join('');
  const legend = segments.map(s => `
    <span class="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
      <span class="h-2 w-2 rounded-full" style="background:${s.color}"></span>${s.label} ${s.value}%
    </span>`).join('');
  return `<div class="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center">
    <svg viewBox="0 0 100 100" class="h-32 w-32 shrink-0">${slices}</svg>
    <div class="flex flex-col gap-2">${legend}</div>
  </div>`;
}

function trafficLight(value, label) {
  const color = value >= 70 ? 'bg-red-500' : value >= 45 ? 'bg-amber-500' : 'bg-emerald-500';
  const text = value >= 70 ? 'Élevé' : value >= 45 ? 'Modéré' : 'Fluide';
  return `<div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <span class="flex h-10 w-10 items-center justify-center rounded-full ${color}">
      <span class="h-3 w-3 rounded-full bg-white/90"></span>
    </span>
    <div>
      <p class="text-sm font-medium">${label}</p>
      <p class="text-xs text-slate-500">${value}/100 · ${text}</p>
    </div>
  </div>`;
}

function envIndicatorCard(icon, label, value, tone, imported = false) {
  const tones = {
    good: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
    warn: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
    bad: 'text-red-600 bg-red-50 dark:bg-red-950/30',
  };
  return `<div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 ${imported ? 'ring-1 ring-emerald-200 dark:ring-emerald-900' : ''}">
    <div class="flex items-center gap-3">
      <span class="flex h-10 w-10 items-center justify-center rounded-lg text-lg ${tones[tone]}">${icon}</span>
      <div class="min-w-0 flex-1">
        <p class="text-xs text-slate-500">${label}${imported ? ' <span class="text-[9px] text-emerald-600">· import</span>' : ''}</p>
        <p class="text-xl font-semibold">${value}%</p>
      </div>
    </div>
    <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div class="h-full rounded-full ${tone === 'good' ? 'bg-emerald-500' : tone === 'warn' ? 'bg-amber-500' : 'bg-red-500'}" style="width:${value}%"></div>
    </div>
  </div>`;
}

function socioActivityCard(icon, label, value, imported = false) {
  const display = typeof value === 'string' ? value : (typeof value === 'number' && value > 100 ? value.toLocaleString('fr-FR') : value);
  return `<div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 ${imported ? 'ring-1 ring-emerald-200 dark:ring-emerald-900' : ''}">
    <span class="text-xl">${icon}</span>
    <p class="mt-2 text-xs text-slate-500">${label}${imported ? ' <span class="text-[9px] text-emerald-600">· import</span>' : ''}</p>
    <p class="mt-1 text-xl font-semibold">${display}</p>
  </div>`;
}

function projectStatusBadge(status) {
  const map = {
    todo: ['À faire', 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'],
    inprogress: ['En cours', 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'],
    review: ['Revue', 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'],
    done: ['Terminé', 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'],
  };
  const [label, cls] = map[status] || ['—', 'bg-slate-100 text-slate-600'];
  return `<span class="rounded-full px-2.5 py-0.5 text-[10px] font-medium ${cls}">${label}</span>`;
}

function reportPreview(stats, sectors) {
  return `<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="border-b border-slate-100 pb-4 dark:border-slate-800">
      <p class="text-[10px] font-medium uppercase tracking-widest text-slate-400">Aperçu du rapport</p>
      <h3 class="mt-1 text-lg font-semibold">Rapport urbain — Kinshasa</h3>
      <p class="text-xs text-slate-500">Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>
    <div class="mt-4 grid gap-4 sm:grid-cols-3">
      <div><p class="text-2xl font-semibold">${stats.total}</p><p class="text-xs text-slate-500">Infrastructures</p></div>
      <div><p class="text-2xl font-semibold text-red-600">${stats.critical}</p><p class="text-xs text-slate-500">Critiques</p></div>
      <div><p class="text-2xl font-semibold">${stats.avgDegradation}%</p><p class="text-xs text-slate-500">Dégradation moy.</p></div>
    </div>
    <div class="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
      <p class="text-xs font-medium text-slate-500">Top secteurs</p>
      <ul class="mt-2 space-y-1 text-sm">${sectors.sort((a, b) => b.count - a.count).slice(0, 3).map(s => `<li class="flex justify-between"><span>${s.name}</span><span class="text-slate-500">${s.count}</span></li>`).join('')}</ul>
    </div>
  </div>`;
}

function notificationType(title) {
  const t = title.toLowerCase();
  if (t.includes('alerte') || t.includes('critique')) return { type: 'alerte', label: 'Alerte', color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' };
  if (t.includes('rapport')) return { type: 'rapport', label: 'Rapport', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' };
  if (t.includes('import') || t.includes('sig')) return { type: 'import', label: 'Import', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' };
  if (t.includes('projet') || t.includes('validé')) return { type: 'projet', label: 'Projet', color: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300' };
  return { type: 'info', label: 'Info', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' };
}

function attentionItem({ level, title, detail, href, cta }) {
  const stripe = level === 'critical' ? 'bg-red-500' : level === 'high' ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600';
  return `<a href="${href}" class="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
    <span class="w-1 shrink-0 self-stretch rounded-full ${stripe}"></span>
    <div class="min-w-0 flex-1">
      <p class="text-sm font-medium leading-snug group-hover:underline">${title}</p>
      <p class="mt-0.5 text-xs text-slate-500">${detail}</p>
    </div>
    <span class="shrink-0 self-center text-xs text-slate-400 transition group-hover:text-slate-900 dark:group-hover:text-white">${cta} →</span>
  </a>`;
}

function sectorTile(name, count, accent) {
  return `<div class="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <span class="text-[11px] font-medium uppercase tracking-wide text-slate-400">${name}</span>
    <span class="mt-3 text-2xl font-medium tracking-tight ${accent}">${count.toLocaleString('fr-FR')}</span>
  </div>`;
}

function quickAccess(href, label, desc) {
  return `<a href="${href}" class="group flex min-w-[140px] flex-1 flex-col rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900">
    <span class="text-sm font-medium group-hover:underline">${label}</span>
    <span class="mt-0.5 text-xs text-slate-500">${desc}</span>
  </a>`;
}

function barChart(items, valueKey = 'value', labelKey = 'month') {
  const max = Math.max(...items.map(i => i[valueKey]), 1);
  return `<div class="flex h-[120px] items-end gap-2">${items.map(i => {
    const h = Math.round((i[valueKey] / max) * 100);
    return `<div class="flex flex-1 flex-col items-center gap-1">
      <div class="w-full rounded-t bg-black/80 dark:bg-white/80" style="height:${h}%"></div>
      <span class="text-[10px] text-slate-400">${i[labelKey]}</span>
    </div>`;
  }).join('')}</div>`;
}

function importTriggerButton() {
  return `<button type="button" id="import-open-btn" class="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black">
    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
    Importer les données
  </button>`;
}

function importModalsShell(communes, categories, opts = {}) {
  const typeLabel = opts.typeLabel || "Type d'infrastructure";
  const intro = opts.intro || "Renseignez la commune, le type et le fichier à importer.";
  const options = categories.map(c => {
    if (typeof c === 'string') return `<option value="${c}">${c}</option>`;
    return `<option value="${c.key}">${c.label}</option>`;
  }).join('');
  return `
  <div id="import-modal" class="fixed inset-0 z-[60] hidden" aria-hidden="true">
    <div id="import-modal-backdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    <div class="relative flex min-h-full items-center justify-center p-4">
      <div role="dialog" aria-labelledby="import-modal-title" class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <h2 id="import-modal-title" class="text-lg font-semibold">Importer des données</h2>
        <p class="mt-1 text-xs text-slate-500">${intro}</p>
        <div class="mt-5 space-y-4">
          <div>
            <label class="text-xs font-medium text-slate-500">Commune</label>
            <select id="import-commune" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
              <option value="">— Choisir une commune —</option>
              ${communes.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-slate-500">${typeLabel}</label>
            <select id="import-categorie" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
              <option value="">— Choisir un type —</option>
              ${options}
            </select>
          </div>
          <div>
            <label class="text-xs font-medium text-slate-500">Fichier</label>
            <input type="file" id="import-file-input" accept=".csv,.json,.xlsx,.xls" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs dark:border-slate-700 dark:bg-slate-950 dark:file:bg-slate-800">
            <p class="mt-1 text-[10px] text-slate-400">CSV, Excel (.xlsx) ou JSON</p>
          </div>
          <p id="import-form-error" class="hidden rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300"></p>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button type="button" id="import-cancel-btn" class="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">Annuler</button>
          <button type="button" id="import-next-btn" class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">Continuer</button>
        </div>
      </div>
    </div>
  </div>

  <div id="import-confirm-modal" class="fixed inset-0 z-[60] hidden" aria-hidden="true">
    <div id="import-confirm-backdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    <div class="relative flex min-h-full items-center justify-center p-4">
      <div role="dialog" aria-labelledby="import-confirm-title" class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <h2 id="import-confirm-title" class="text-lg font-semibold">Confirmer l'import</h2>
        <p class="mt-1 text-xs text-slate-500">Vérifiez les informations avant validation.</p>
        <dl id="import-confirm-summary" class="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800/50"></dl>
        <div class="mt-6 flex justify-end gap-2">
          <button type="button" id="import-confirm-back-btn" class="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">Retour</button>
          <button type="button" id="import-confirm-btn" class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Confirmer l'import</button>
        </div>
      </div>
    </div>
  </div>`;
}

function projectFormModal(communes, categories) {
  const communeOpts = communes.map(c => `<option value="${c}">${c}</option>`).join('');
  const categoryOpts = categories.map(c => `<option value="${c}">${c}</option>`).join('');
  return `
  <div id="project-form-modal" class="fixed inset-0 z-[60] hidden" aria-hidden="true">
    <div id="project-form-backdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    <div class="relative flex min-h-full items-center justify-center p-4">
      <div role="dialog" aria-labelledby="project-form-title" class="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <h2 id="project-form-title" class="text-lg font-semibold">Nouveau projet</h2>
        <p class="mt-1 text-xs text-slate-500">Renseignez les informations du projet urbain.</p>
        <form id="project-form" class="mt-5 space-y-4">
          <input type="hidden" id="project-id" value="">
          <div>
            <label for="project-title" class="text-xs font-medium text-slate-500">Intitulé *</label>
            <input id="project-title" type="text" required class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Ex. Réfection voirie secteur 3">
          </div>
          <div>
            <label for="project-description" class="text-xs font-medium text-slate-500">Description</label>
            <textarea id="project-description" rows="3" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Objectifs, périmètre, partenaires…"></textarea>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="project-status" class="text-xs font-medium text-slate-500">État</label>
              <select id="project-status" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                <option value="todo">À faire</option>
                <option value="inprogress">En cours</option>
                <option value="review">Revue</option>
                <option value="done">Terminé</option>
              </select>
            </div>
            <div>
              <label for="project-priority" class="text-xs font-medium text-slate-500">Priorité</label>
              <select id="project-priority" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                <option value="Basse">Basse</option>
                <option value="Moyenne" selected>Moyenne</option>
                <option value="Haute">Haute</option>
                <option value="Critique">Critique</option>
              </select>
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="project-budget" class="text-xs font-medium text-slate-500">Budget ($)</label>
              <input id="project-budget" type="number" min="0" step="1000" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="450000">
            </div>
            <div>
              <label for="project-progress" class="text-xs font-medium text-slate-500">Avancement (<span id="project-progress-label">0</span>%)</label>
              <input id="project-progress" type="range" min="0" max="100" value="0" class="mt-3 w-full accent-black dark:accent-white">
            </div>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="project-commune" class="text-xs font-medium text-slate-500">Commune</label>
              <select id="project-commune" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                <option value="">—</option>${communeOpts}
              </select>
            </div>
            <div>
              <label for="project-category" class="text-xs font-medium text-slate-500">Catégorie infrastructure</label>
              <select id="project-category" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                <option value="">—</option>${categoryOpts}
              </select>
            </div>
          </div>
          <p id="project-form-error" class="hidden text-xs text-red-600"></p>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" id="project-cancel-btn" class="rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">Annuler</button>
            <button type="submit" id="project-save-btn" class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>`;
}

function infraFilterBar(zones, categories, etats) {
  return `<div class="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
    <div class="min-w-[120px] flex-1">
      <label class="text-[11px] font-medium text-slate-500">Zone</label>
      <select id="filter-zone" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
        <option value="">Toutes</option>${zones.map(z => `<option value="${z}">${z}</option>`).join('')}
      </select>
    </div>
    <div class="min-w-[120px] flex-1">
      <label class="text-[11px] font-medium text-slate-500">Catégorie</label>
      <select id="filter-categorie" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
        <option value="">Toutes</option>${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
    </div>
    <div class="min-w-[120px] flex-1">
      <label class="text-[11px] font-medium text-slate-500">État</label>
      <select id="filter-etat" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
        <option value="">Tous</option>${etats.map(e => `<option value="${e}">${e}</option>`).join('')}
      </select>
    </div>
    <p id="filter-count" class="text-xs text-slate-500"></p>
  </div>`;
}

function infraTableRows(items) {
  if (!items.length) {
    return `<div id="infra-empty">${emptyState('Aucune infrastructure dans cette zone')}</div>`;
  }
  return `<div id="infra-table-wrap" class="max-h-[22rem] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
    <table id="infra-table" class="w-full min-w-[960px] text-left text-sm">
      <thead class="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800">
        <tr>
          <th class="px-4 py-3 font-medium">Nom</th>
          <th class="px-4 py-3 font-medium">Commune</th>
          <th class="px-4 py-3 font-medium">Catégorie</th>
          <th class="px-4 py-3 font-medium">État</th>
          <th class="px-4 py-3 font-medium">Réf.</th>
          <th class="px-4 py-3 font-medium">Responsable</th>
          <th class="px-4 py-3 font-medium">Indicateur</th>
          <th class="px-4 py-3 font-medium">Dégrad.</th>
          <th class="px-4 py-3 font-medium">Inspection</th>
          <th class="px-4 py-3 font-medium">Observations</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
        ${items.map(i => `
          <tr class="bg-white dark:bg-slate-900 ${i.imported ? 'bg-emerald-50/60 dark:bg-emerald-950/20' : ''}" data-zone="${i.zone || ''}" data-categorie="${i.categorie || ''}" data-etat="${i.etat || ''}">
            <td class="px-4 py-3 font-medium">${i.nom}${i.imported ? ' <span class="rounded bg-emerald-100 px-1 text-[9px] text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" title="${i.importCommune || i.zone} · ${i.importCategorie || i.categorie}">Import</span>' : ''}</td>
            <td class="px-4 py-3 text-slate-600">${i.zone}</td>
            <td class="px-4 py-3 text-slate-600">${i.categorie}</td>
            <td class="px-4 py-3">${etatBadge(i.etat)}</td>
            <td class="px-4 py-3 font-mono text-xs text-slate-500">${i.reference || '—'}</td>
            <td class="px-4 py-3 text-xs text-slate-600">${i.responsable || '—'}</td>
            <td class="px-4 py-3 text-xs">${i.metriqueLabel ? `${i.metriqueValue}${i.metriqueUnit ? ' ' + i.metriqueUnit : ''}` : '—'}<span class="block text-[10px] text-slate-400">${i.metriqueLabel || ''}</span></td>
            <td class="px-4 py-3">${i.degradation}%</td>
            <td class="px-4 py-3 text-xs text-slate-500">${i.dateInspection ? new Date(i.dateInspection).toLocaleDateString('fr-FR') : '—'}</td>
            <td class="max-w-[180px] truncate px-4 py-3 text-xs text-slate-500" title="${(i.observations || '').replace(/"/g, '&quot;')}">${i.observations || '—'}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <div id="infra-empty" class="hidden">${emptyState('Aucune infrastructure ne correspond aux filtres')}</div>`;
}

function infraTable(rows) {
  if (!rows.length) return emptyState('Aucune donnée.');
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

function metricRow(label, value) {
  return `<div class="mb-3"><div class="mb-1 flex justify-between text-xs"><span>${label}</span><span>${value}%</span></div>
    <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-full rounded-full bg-black dark:bg-white" style="width:${value}%"></div></div></div>`;
}

function congestionMap(hotspots) {
  const positions = [
    { x: 45, y: 35 }, { x: 62, y: 48 }, { x: 38, y: 72 },
  ];
  return `<div class="relative min-h-[200px] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/50">
    <div class="absolute inset-0 opacity-20" style="background-image:linear-gradient(#94a3b8 1px,transparent 1px),linear-gradient(90deg,#94a3b8 1px,transparent 1px);background-size:20px 20px"></div>
    ${hotspots.map((h, i) => {
      const p = positions[i % positions.length];
      return `<div class="absolute -translate-x-1/2 -translate-y-1/2" style="left:${p.x}%;top:${p.y}%">
        <span class="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-red-500/80 text-[9px] font-bold text-white ring-4 ring-red-300/50">!</span>
        <p class="mt-1 max-w-[80px] text-center text-[9px] font-medium text-slate-700 dark:text-slate-300">${h}</p>
      </div>`;
    }).join('')}
  </div>`;
}
