const PAGE_FILES = {
  dashboard: 'dashboard.html',
  geography: 'geographie-demographie.html',
  urbanism: 'urbanisme.html',
  infrastructures: 'infrastructures.html',
  economymob: 'economie-mobilite.html',
  environment: 'environnement.html',
  sources: 'sources.html',
  map: 'cartographie.html',
  projects: 'projets.html',
  reports: 'rapports.html',
  notifications: 'notifications.html',
  users: 'utilisateurs.html',
  settings: 'parametres.html',
};

const PAGE_LABELS = {
  dashboard: 'Tableau de bord',
  geography: 'Géographie',
  urbanism: 'Urbanisme',
  infrastructures: 'Infrastructures',
  economymob: 'Économie & mobilité',
  environment: 'Environnement',
  sources: 'Sources',
  map: 'Cartographie SIG',
  projects: 'Projets',
  reports: 'Rapports',
  notifications: 'Notifications',
  users: 'Utilisateurs',
  settings: 'Paramètres',
};

const ROLES = {
  admin: {
    label: 'Administrateur',
    pages: Object.keys(PAGE_FILES),
  },
  infra: {
    label: 'Responsable Infrastructures',
    pages: ['dashboard', 'infrastructures', 'sources', 'reports', 'notifications', 'settings'],
  },
  sig: {
    label: 'Analyste SIG',
    pages: ['dashboard', 'geography', 'urbanism', 'map', 'sources', 'reports', 'notifications', 'settings'],
  },
  env: {
    label: 'Responsable Environnement',
    pages: ['dashboard', 'environment', 'economymob', 'sources', 'reports', 'notifications', 'settings'],
  },
  projet: {
    label: 'Chef de Projet',
    pages: ['dashboard', 'projects', 'urbanism', 'economymob', 'sources', 'reports', 'notifications', 'settings'],
  },
  visiteur: {
    label: 'Visiteur',
    pages: ['dashboard', 'notifications', 'settings'],
  },
};

function getPageIdFromFile(file) {
  return Object.keys(PAGE_FILES).find(id => PAGE_FILES[id] === file);
}

function getRoleLabel(roleId) {
  return ROLES[roleId]?.label || ROLES.visiteur.label;
}

function roleCanAccess(roleId, pageId) {
  const role = ROLES[roleId] || ROLES.visiteur;
  return role.pages.includes(pageId);
}

function getAllowedPageIds(roleId) {
  return (ROLES[roleId] || ROLES.visiteur).pages;
}

function getHomePageFile(roleId) {
  const pages = getAllowedPageIds(roleId);
  return PAGE_FILES[pages[0]] || 'dashboard.html';
}
