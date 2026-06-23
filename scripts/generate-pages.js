const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'pages');
fs.mkdirSync(dir, { recursive: true });

const head = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>B.E.A.U</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script>tailwind.config={darkMode:'class',theme:{extend:{fontFamily:{sans:['Inter','system-ui','sans-serif']}}}};</script>
  <style>html,body{height:100%;overflow-x:hidden}body{font-family:Inter,system-ui,sans-serif}.nav-active{background:rgb(241 245 249);color:rgb(15 23 42);font-weight:500}.dark .nav-active{background:rgb(30 41 59);color:white}@media(min-width:1024px){html,body{height:auto;overflow-x:hidden;overflow-y:auto}}</style>
</head>
<body>
`;

const scripts = `
  <script src="../js/mock-data.js"></script>
  <script src="../js/permissions.js"></script>
  <script src="../js/auth.js"></script>
  <script src="../js/data.js"></script>
  <script src="../js/ui.js"></script>
  <script src="../js/import.js"></script>
  <script src="../js/layout.js"></script>
  <script src="../js/renders.js"></script>
  <script src="../js/interactions.js"></script>
  <script src="../js/projects.js"></script>
`;

const xlsxScript = `  <script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>\n`;

const pages = [
  ['dashboard.html', 'Tableau de bord', 'renderDashboard', null],
  ['geographie-demographie.html', 'Géographie & démographie', 'renderGeography', "bindImportHandlers(() => location.reload(), 'geo')"],
  ['urbanisme.html', 'Urbanisme & aménagement', 'renderUrbanism', "bindImportHandlers(() => location.reload(), 'urbanism')"],
  ['infrastructures.html', 'Infrastructures & équipements', 'renderInfrastructures', "bindImportHandlers(() => location.reload(), 'infra')"],
  ['economie-mobilite.html', 'Économie, mobilité & administration', 'renderEconomyMobility', "bindImportHandlers(() => location.reload(), 'socio')"],
  ['environnement.html', 'Environnement & patrimoines', 'renderEnvironment', "bindImportHandlers(() => location.reload(), 'env')"],
  ['sources.html', 'Sources & documents', 'renderSources', null],
  ['cartographie.html', 'Cartographie SIG', 'renderMap', null],
  ['projets.html', 'Gestion des projets', 'renderProjects', 'bindProjectHandlers()'],
  ['rapports.html', 'Rapports et statistiques', 'renderReports', null],
  ['notifications.html', 'Notifications', 'renderNotifications', null],
  ['utilisateurs.html', 'Utilisateurs et rôles', 'renderUsers', null],
  ['parametres.html', 'Paramètres', 'renderSettings', 'bindImportHandlers(() => { window.location.href = \"infrastructures.html\"; })'],
];

const redirects = [
  ['planification.html', 'urbanisme.html'],
  ['mobilite.html', 'economie-mobilite.html'],
  ['socio-economique.html', 'economie-mobilite.html'],
];

pages.forEach(([file, title, render, after]) => {
  const afterPart = after ? `, () => { ${after} }` : '';
  const init = `<script>initPage('${file}', '${title}', ${render}${afterPart});</script>`;
  const needsXlsx = ['infrastructures.html', 'parametres.html', 'environnement.html', 'economie-mobilite.html', 'geographie-demographie.html', 'urbanisme.html'].includes(file);
  const html = head + (needsXlsx ? xlsxScript : '') + scripts + init + '\n</body>\n</html>\n';
  fs.writeFileSync(path.join(dir, file), html);
  console.log('Created', file);
});

redirects.forEach(([from, to]) => {
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${to}"><script>location.replace('${to}')</script></head><body></body></html>\n`;
  fs.writeFileSync(path.join(dir, from), html);
  console.log('Redirect', from, '->', to);
});
