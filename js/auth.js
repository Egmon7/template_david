const DEMO_USERS = {
  'admin@projet.cd': { nom: 'Jean Mbala', roleId: 'admin', avatar: 'JM' },
  'sarah@projet.cd': { nom: 'Sarah Ilunga', roleId: 'infra', avatar: 'SI' },
  'patrick@projet.cd': { nom: 'Patrick Kabasele', roleId: 'sig', avatar: 'PK' },
  'grace@projet.cd': { nom: 'Grâce Mbuyi', roleId: 'env', avatar: 'GM' },
  'david@projet.cd': { nom: 'David Tshibangu', roleId: 'projet', avatar: 'DT' },
};

function getRoleId(session) {
  if (!session) return 'visiteur';
  if (session.roleId) return session.roleId;
  const legacy = {
    Administrateur: 'admin',
    'Responsable Infrastructures': 'infra',
    'Analyste SIG': 'sig',
    'Responsable Environnement': 'env',
    'Chef de Projet': 'projet',
    Visiteur: 'visiteur',
  };
  return legacy[session.role] || 'visiteur';
}

function getDemoUser(email) {
  const key = email.trim().toLowerCase();
  if (DEMO_USERS[key]) return { email: key, ...DEMO_USERS[key] };
  return {
    email: key,
    nom: key.split('@')[0] || 'Utilisateur',
    roleId: 'visiteur',
    avatar: (key[0] || 'U').toUpperCase(),
  };
}

function login(email, password) {
  const profile = getDemoUser(email);
  const session = {
    email: profile.email,
    nom: profile.nom,
    roleId: profile.roleId,
    role: getRoleLabel(profile.roleId),
    avatar: profile.avatar,
    loggedAt: Date.now(),
  };
  sessionStorage.setItem('projet_session', JSON.stringify(session));
  return session;
}

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem('projet_session'));
  } catch {
    return null;
  }
}

function canAccessPage(pageId) {
  const session = getSession();
  if (!session) return false;
  return roleCanAccess(getRoleId(session), pageId);
}

function canAccessFile(file) {
  const pageId = getPageIdFromFile(file);
  return pageId ? canAccessPage(pageId) : false;
}

function getDefaultPageFile() {
  const session = getSession();
  return getHomePageFile(getRoleId(session));
}

function getLoginUrl() {
  return window.location.pathname.includes('/pages/') ? '../login.html' : 'login.html';
}

function logout() {
  sessionStorage.removeItem('projet_session');
  window.location.href = getLoginUrl();
}

function requireAuth() {
  if (!getSession()) {
    window.location.href = getLoginUrl();
    return false;
  }
  return true;
}

function requirePageAccess(file) {
  if (!canAccessFile(file)) {
    window.location.href = getDefaultPageFile();
    return false;
  }
  return true;
}
