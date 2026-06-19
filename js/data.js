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

function addImportedRows(rows, context = {}) {
  const stamped = rows.map(r => ({
    ...r,
    zone: r.zone || context.commune || '',
    categorie: r.categorie || context.categorie || '',
    importCommune: context.commune || r.zone,
    importCategorie: context.categorie || r.categorie,
  }));
  const all = [...getImportedRows(), ...stamped];
  sessionStorage.setItem('projet_imported', JSON.stringify(all));
  sessionStorage.setItem('projet_last_import', JSON.stringify({
    count: stamped.length,
    total: all.length,
    at: Date.now(),
    commune: context.commune,
    categorie: context.categorie,
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
  const base = (DATA?.infrastructures || []).map(enrichInfraDetails);
  const imported = getImportedRows().map((r, i) => enrichInfraDetails({ ...r, imported: true, id: `imp-${i}` }));
  return [...base, ...imported];
}

function getCommuneNames() {
  return (DATA?.mapZones || []).map(z => z.name).sort((a, b) => a.localeCompare(b, 'fr'));
}

function getInfraCategories() {
  return DATA?.categories || [];
}

const METRIQUE_BY_CATEGORIE = {
  'Routes et voiries': { key: 'longueur_km', label: 'Longueur', unit: 'km' },
  'Ponts': { key: 'portee_m', label: 'Portée', unit: 'm' },
  "Réseaux d'eau potable": { key: 'debit_m3j', label: 'Débit', unit: 'm³/j' },
  'Réseaux électriques': { key: 'puissance_kva', label: 'Puissance', unit: 'kVA' },
  'Écoles': { key: 'eleves', label: 'Élèves', unit: '' },
  'Hôpitaux': { key: 'lits', label: 'Lits', unit: '' },
  'Marchés': { key: 'emplacements', label: 'Emplacements', unit: '' },
  'Bâtiments administratifs': { key: 'surface_m2', label: 'Surface', unit: 'm²' },
  'Espaces verts': { key: 'surface_ha', label: 'Surface', unit: 'ha' },
  'Installations sportives': { key: 'capacite', label: 'Capacité', unit: 'places' },
};

const RESPONSABLES_PAR_COMMUNE = {
  'Gombe': 'Ing. Mukendi T.',
  'Lingwala': 'Ing. Kabila M.',
  'Limete': 'Mme Ilunga S.',
  'Matete': 'Ing. Mbuyi G.',
  'Kasa-Vubu': 'M. Tshibangu D.',
  'Bandalungwa': 'Ing. Ngoy P.',
  'Lemba': 'Mme Kabasele A.',
  'Masina': 'Ing. Kalonji R.',
};

const OBSERVATIONS_PAR_TYPE = {
  'Routes et voiries': ['Nids-de-poule signalés secteur nord', 'Revêtement à refaire sur 800 m', 'Drainage latéral insuffisant', 'Trafic lourd — surveillance renforcée'],
  "Réseaux d'eau potable": ['Fuite mineure colmatée', 'Pression basse aux heures de pointe', 'Pompe de secours à vérifier', 'Qualité eau conforme dernier prélèvement'],
  'Réseaux électriques': ['Transformateur sous charge', 'Câblage vieillissant — remplacement prévu', 'Coupures fréquentes quartier adjacent', 'Comptage individuel en cours'],
  'Hôpitaux': ['Stock médicaments à renforcer', 'Bloc opératoire opérationnel', 'Besoin personnel infirmier supplémentaire', 'Ambulance disponible 24h/24'],
  'Écoles': ['Effectif en hausse — extension envisagée', 'Toiture réparée récemment', 'Latrines à moderniser', 'Connexion internet instable'],
};

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < (s || '').length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h);
}

function enrichInfraDetails(item) {
  if (!item || item._enriched) return item;
  const h = hashStr(`${item.nom}|${item.zone}|${item.categorie}`);
  const meta = METRIQUE_BY_CATEGORIE[item.categorie] || { key: 'capacite', label: 'Capacité', unit: 'u.' };
  const zoneKey = Object.keys(RESPONSABLES_PAR_COMMUNE).find(z => matchCommune(item.zone, [{ name: z }]));
  const obsPool = OBSERVATIONS_PAR_TYPE[item.categorie] || ['État général conforme au dernier audit', 'Maintenance préventive planifiée', 'Aucune anomalie majeure signalée'];
  const daysAgo = 15 + (h % 120);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);

  const metriqueValue = item[meta.key] ?? item.metrique ?? (meta.unit === 'km' ? 1.2 + (h % 80) / 10 : 20 + (h % 200));

  return {
    ...item,
    reference: item.reference || `KIN-${(item.zone || 'XX').slice(0, 3).toUpperCase()}-${String((item.id || h) % 10000).padStart(4, '0')}`,
    responsable: item.responsable || RESPONSABLES_PAR_COMMUNE[zoneKey] || `Agent terrain — ${item.zone || 'Kinshasa'}`,
    dateInspection: item.date_inspection || item.dateInspection || d.toISOString().slice(0, 10),
    observations: item.observations || obsPool[h % obsPool.length],
    metriqueLabel: meta.label,
    metriqueValue,
    metriqueUnit: meta.unit,
    _enriched: true,
  };
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
    const ctx = [lastImport.commune, lastImport.categorie].filter(Boolean).join(' · ');
    activities.unshift({
      time: 'Import récent',
      text: ctx
        ? `${lastImport.count} fiche(s) importée(s) — ${ctx}`
        : `${lastImport.count} infrastructure(s) ajoutée(s) — ${lastImport.total} au total cette session`,
      type: 'success',
    });
  }
  return activities;
}

const ENV_IMPORT_TYPES = [
  { key: 'wasteManagement', label: 'Gestion des déchets' },
  { key: 'airPollution', label: "Qualité de l'air" },
  { key: 'noisePollution', label: 'Pollution sonore' },
  { key: 'wastewater', label: 'Eaux usées' },
  { key: 'floodRisk', label: "Risque d'inondation" },
  { key: 'greenSpaces', label: 'Espaces verts' },
];

const SOCIO_IMPORT_TYPES = [
  { key: 'commerce', label: 'Commerce' },
  { key: 'urbanAgriculture', label: 'Agriculture urbaine' },
  { key: 'crafts', label: 'Artisanat' },
  { key: 'industry', label: 'Industrie' },
  { key: 'services', label: 'Services' },
  { key: 'health', label: 'Santé' },
  { key: 'education', label: 'Éducation' },
  { key: 'employment', label: 'Emploi' },
  { key: 'avgIncome', label: 'Revenu moyen' },
];

function getImportedEnvRows() {
  try {
    return JSON.parse(sessionStorage.getItem('beau_imported_env') || '[]');
  } catch {
    return [];
  }
}

function addImportedEnvRows(rows, context = {}) {
  const stamped = rows.map(r => ({
    ...r,
    commune: r.commune || context.commune || '',
    typeKey: r.typeKey || context.typeKey || '',
    typeLabel: r.typeLabel || context.typeLabel || '',
    imported: true,
  }));
  const all = [...getImportedEnvRows(), ...stamped];
  sessionStorage.setItem('beau_imported_env', JSON.stringify(all));
  return all;
}

function getImportedSocioRows() {
  try {
    return JSON.parse(sessionStorage.getItem('beau_imported_socio') || '[]');
  } catch {
    return [];
  }
}

function addImportedSocioRows(rows, context = {}) {
  const stamped = rows.map(r => ({
    ...r,
    commune: r.commune || context.commune || '',
    typeKey: r.typeKey || context.typeKey || '',
    typeLabel: r.typeLabel || context.typeLabel || '',
    imported: true,
  }));
  const all = [...getImportedSocioRows(), ...stamped];
  sessionStorage.setItem('beau_imported_socio', JSON.stringify(all));
  return all;
}

function mergeImportedMetrics(base, imports) {
  const data = { ...base };
  const updatedKeys = new Set();
  const byKey = {};
  imports.forEach((r) => {
    if (!r.typeKey) return;
    if (!byKey[r.typeKey]) byKey[r.typeKey] = [];
    byKey[r.typeKey].push(Number(r.valeur) || 0);
  });
  Object.entries(byKey).forEach(([key, vals]) => {
    if (data[key] === undefined || !vals.length) return;
    data[key] = Math.round(vals.reduce((a, v) => a + v, 0) / vals.length);
    updatedKeys.add(key);
  });
  return { data, updatedKeys };
}

function getEnvironmentLive() {
  return mergeImportedMetrics(DATA?.environment || {}, getImportedEnvRows());
}

function getSocioecoLive() {
  return mergeImportedMetrics(DATA?.socioeco || {}, getImportedSocioRows());
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
