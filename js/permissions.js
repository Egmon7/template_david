const PAGE_FILES = {
  dashboard: 'dashboard.html',
  infrastructures: 'infrastructures.html',
  planning: 'planification.html',
  map: 'cartographie.html',
  mobility: 'mobilite.html',
  environment: 'environnement.html',
  socioeco: 'socio-economique.html',
  projects: 'projets.html',
  reports: 'rapports.html',
  notifications: 'notifications.html',
  users: 'utilisateurs.html',
  settings: 'parametres.html',
};

const PAGE_LABELS = {
  dashboard: 'Tableau de bord',
  infrastructures: 'Infrastructures',
  planning: 'Planification',
  map: 'Cartographie SIG',
  mobility: 'Mobilité',
  environment: 'Environnement',
  socioeco: 'Socio-économique',
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
    pages: ['dashboard', 'infrastructures', 'reports', 'notifications', 'settings'],
  },
  sig: {
    label: 'Analyste SIG',
    pages: ['dashboard', 'planning', 'map', 'reports', 'notifications', 'settings'],
  },
  env: {
    label: 'Responsable Environnement',
    pages: ['dashboard', 'environment', 'socioeco', 'reports', 'notifications', 'settings'],
  },
  projet: {
    label: 'Chef de Projet',
    pages: ['dashboard', 'projects', 'planning', 'mobility', 'reports', 'notifications', 'settings'],
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
