let DATA = null;

const SECTOR_MAP = {
  'Routes et voiries': 'Routes',
  'Ponts': 'Routes',
  "Réseaux d'eau potable": 'Eau',
  'Réseaux électriques': 'Énergie',
  'Écoles': 'Éducation',
  'Hôpitaux': 'Santé',
  'Marchés': 'Autres',
  'Bâtiments administratifs': 'Autres',
  'Espaces verts': 'Autres',
  'Installations sportives': 'Autres',
};

function getImportedRows() {
  try {
    return JSON.parse(sessionStorage.getItem('projet_imported') || '[]');
  } catch {
    return [];
  }
}

function addImportedRows(rows) {
  const all = [...getImportedRows(), ...rows];
  sessionStorage.setItem('projet_imported', JSON.stringify(all));
  sessionStorage.setItem('projet_last_import', JSON.stringify({
    count: rows.length,
    total: all.length,
    at: Date.now(),
  }));
  return all;
}

function getLastImport() {
  try {
    return JSON.parse(sessionStorage.getItem('projet_last_import') || 'null');
  } catch {
    return null;
  }
}

function getAllInfrastructures() {
  const base = DATA?.infrastructures || [];
  const imported = getImportedRows().map((r, i) => ({ ...r, imported: true, id: `imp-${i}` }));
  return [...base, ...imported];
}

function normalizeZone(s) {
  return s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function matchCommune(zoneName, communes) {
  if (!zoneName || !communes?.length) return null;
  const z = normalizeZone(zoneName);
  return communes.find((c) => {
    const n = normalizeZone(c.name);
    return n === z || n.startsWith(z) || z.startsWith(n) || n.includes(z) || z.includes(n.split('-')[0]);
  });
}

function isCriticalInfra(item) {
  return item.etat === 'Critique' || (item.degradation || 0) >= 70;
}

function getInfraStats() {
  const all = getAllInfrastructures();
  return {
    total: all.length,
    critical: all.filter(isCriticalInfra).length,
    importedCount: getImportedRows().length,
    listedCount: all.length,
    avgDegradation: all.length
      ? Math.round(all.reduce((a, i) => a + (i.degradation || 0), 0) / all.length)
      : 0,
    totalPannes: all.reduce((a, i) => a + (i.pannes || 0), 0),
    totalMaintenance: all.reduce((a, i) => a + (i.maintenance || 0), 0),
  };
}

function getSectorCounts() {
  const buckets = { Routes: 0, Eau: 0, Énergie: 0, Santé: 0, Éducation: 0, Autres: 0 };
  getAllInfrastructures().forEach((item) => {
    const key = SECTOR_MAP[item.categorie] || 'Autres';
    buckets[key] = (buckets[key] || 0) + 1;
  });
  return Object.entries(buckets).map(([name, count]) => ({ name, count }));
}

function getEvolutionLive() {
  const count = getAllInfrastructures().length;
  const base = DATA?.dashboard?.evolution || [];
  if (!base.length) return [{ month: 'Actuel', value: count }];
  const steps = base.length;
  const start = Math.max(1, Math.round(count * 0.82));
  return base.map((e, i) => ({
    month: e.month,
    value: i === steps - 1 ? count : Math.round(start + (count - start) * (i / (steps - 1 || 1))),
  }));
}

function getMapZonesLive() {
  const zones = (DATA?.mapZones || []).map((z) => ({ ...z, infra: 0 }));
  const all = getAllInfrastructures();

  all.forEach((item) => {
    const commune = matchCommune(item.zone, zones);
    if (commune) commune.infra += 1;
  });

  zones.forEach((z) => {
    const inZone = all.filter((i) => matchCommune(i.zone, [z]));
    if (!inZone.length) return;
    const avgDeg = inZone.reduce((a, i) => a + (i.degradation || 0), 0) / inZone.length;
    if (inZone.some(isCriticalInfra) || avgDeg >= 65) z.risk = 'high';
    else if (avgDeg >= 40) z.risk = 'medium';
    else z.risk = 'low';
  });

  return zones;
}

function getFilterOptions() {
  const all = getAllInfrastructures();
  const zones = [...new Set(all.map(i => i.zone).filter(Boolean))].sort();
  const categories = [...new Set(all.map(i => i.categorie).filter(Boolean))].sort();
  const etats = [...new Set(all.map(i => i.etat).filter(Boolean))].sort();
  return { zones, categories, etats };
}

function getImportAlerts() {
  return getImportedRows()
    .filter(isCriticalInfra)
    .map((i) => ({
      level: 'critical',
      title: i.nom,
      detail: `${i.zone} · import récent · dégradation ${i.degradation}%`,
      href: 'infrastructures.html',
      cta: 'Voir',
    }));
}

function getRecentActivityLive() {
  const activities = [...(DATA?.dashboard?.recentActivities || [])];
  const lastImport = getLastImport();
  if (lastImport) {
    activities.unshift({
      time: 'Import récent',
      text: `${lastImport.count} infrastructure(s) ajoutée(s) — ${lastImport.total} au total cette session`,
      type: 'success',
    });
  }
  return activities;
}

async function loadData() {
  if (DATA) return DATA;
  try {
    const res = await fetch('../data/mock-data.json');
    DATA = res.ok ? await res.json() : window.MOCK_DATA;
  } catch {
    DATA = window.MOCK_DATA;
  }
  return DATA;
}
