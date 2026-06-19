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

function handleFileImport(file, onSuccess) {
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
      addImportedRows(rows);
      const msg = `${rows.length} enregistrement(s) importé(s) avec succès.`;
      document.querySelectorAll('#import-result, #import-result-settings').forEach(el => {
        if (el) { el.textContent = msg; el.classList.remove('hidden'); }
      });
      if (onSuccess) onSuccess(rows);
    } catch (err) {
      alert('Erreur de lecture du fichier : ' + err.message);
    }
  };
  reader.readAsText(file);
}

function bindImportHandlers(onSuccess) {
  document.querySelectorAll('.import-file').forEach(input => {
    input.onchange = (e) => {
      const f = e.target.files[0];
      if (f) handleFileImport(f, onSuccess);
      e.target.value = '';
    };
  });
}
