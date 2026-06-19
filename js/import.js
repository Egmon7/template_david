let pendingImport = null;
let activeImportMode = 'infra';

const IMPORT_MODES = {
  infra: {
    typeLabel: "Type d'infrastructure",
    confirmTypeLabel: 'Infrastructure',
    intro: "Renseignez la commune, le type d'infrastructure et le fichier à importer.",
    missingType: "Veuillez sélectionner un type d'infrastructure.",
    emptyRows: 'Aucune ligne valide. Le fichier doit contenir au moins une colonne « nom ».',
    addRows: (rows, ctx) => addImportedRows(rows, { commune: ctx.commune, categorie: ctx.typeLabel || ctx.categorie }),
    normalize(raw, ctx) {
      const lower = {};
      Object.entries(raw).forEach(([k, v]) => { lower[k.toLowerCase().trim()] = v; });
      const commune = lower.commune || lower.zone || ctx.commune || '';
      const categorie = lower.categorie || lower.catégorie || ctx.typeLabel || '';
      return {
        nom: lower.nom || lower.name || '',
        categorie,
        etat: lower.etat || lower.état || 'Moyen',
        zone: commune,
        degradation: Number(lower.degradation || lower.dégradation || 0) || 0,
        pannes: Number(lower.pannes || 0) || 0,
        maintenance: Number(lower.maintenance || 0) || 0,
        reference: lower.reference || lower.référence || '',
        responsable: lower.responsable || '',
        date_inspection: lower.date_inspection || lower.date || '',
        observations: lower.observations || lower.observation || '',
      };
    },
    isValidRow(row) {
      return Boolean(row.nom);
    },
    successMsg: (n, ctx) => `${n} fiche(s) importée(s) pour ${ctx.commune} · ${ctx.typeLabel}.`,
  },
  env: {
    typeLabel: "Type d'information",
    confirmTypeLabel: 'Information',
    intro: "Renseignez la commune, le type d'indicateur environnemental et le fichier à importer.",
    missingType: "Veuillez sélectionner un type d'information.",
    emptyRows: 'Aucune ligne valide. Le fichier doit contenir une colonne « valeur » (ou « value »).',
    addRows: (rows, ctx) => addImportedEnvRows(rows, ctx),
    normalize(raw, ctx) {
      const lower = {};
      Object.entries(raw).forEach(([k, v]) => { lower[k.toLowerCase().trim()] = v; });
      const valeur = lower.valeur ?? lower.value ?? lower.valeur_pct ?? lower.pourcentage ?? lower.montant;
      const parsed = Number(String(valeur ?? '').replace(',', '.'));
      return {
        commune: lower.commune || lower.zone || ctx.commune || '',
        typeKey: ctx.typeKey || '',
        typeLabel: ctx.typeLabel || '',
        nom: lower.nom || lower.label || lower.libelle || lower.libellé || 'Mesure',
        valeur: Number.isFinite(parsed) ? parsed : NaN,
        observations: lower.observations || lower.observation || '',
      };
    },
    isValidRow(row) {
      return Number.isFinite(row.valeur);
    },
    successMsg: (n, ctx) => `${n} mesure(s) importée(s) — ${ctx.commune} · ${ctx.typeLabel}.`,
  },
  socio: {
    typeLabel: "Type d'information",
    confirmTypeLabel: 'Information',
    intro: "Renseignez la commune, le type d'activité socio-économique et le fichier à importer.",
    missingType: "Veuillez sélectionner un type d'information.",
    emptyRows: 'Aucune ligne valide. Le fichier doit contenir une colonne « valeur » (ou « value »).',
    addRows: (rows, ctx) => addImportedSocioRows(rows, ctx),
    normalize(raw, ctx) {
      const lower = {};
      Object.entries(raw).forEach(([k, v]) => { lower[k.toLowerCase().trim()] = v; });
      const valeur = lower.valeur ?? lower.value ?? lower.montant ?? lower.nombre;
      const parsed = Number(String(valeur ?? '').replace(',', '.'));
      return {
        commune: lower.commune || lower.zone || ctx.commune || '',
        typeKey: ctx.typeKey || '',
        typeLabel: ctx.typeLabel || '',
        nom: lower.nom || lower.label || lower.libelle || lower.libellé || 'Mesure',
        valeur: Number.isFinite(parsed) ? parsed : NaN,
        observations: lower.observations || lower.observation || '',
      };
    },
    isValidRow(row) {
      return Number.isFinite(row.valeur);
    },
    successMsg: (n, ctx) => `${n} mesure(s) importée(s) — ${ctx.commune} · ${ctx.typeLabel}.`,
  },
};

function getImportContext() {
  const commune = document.getElementById('import-commune')?.value || '';
  const sel = document.getElementById('import-categorie');
  const typeKey = sel?.value || '';
  const typeLabel = sel?.selectedOptions?.[0]?.textContent?.trim() || typeKey;
  return { commune, categorie: typeLabel, typeKey, typeLabel };
}

function showFormError(msg) {
  const el = document.getElementById('import-form-error');
  if (!el) return;
  if (msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

function updateBodyScrollLock() {
  const open = !document.getElementById('import-modal')?.classList.contains('hidden')
    || !document.getElementById('import-confirm-modal')?.classList.contains('hidden');
  document.body.classList.toggle('overflow-hidden', open);
}

function toggleModal(id, open) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.toggle('hidden', !open);
  modal.setAttribute('aria-hidden', open ? 'false' : 'true');
  updateBodyScrollLock();
}

function resetImportForm() {
  const commune = document.getElementById('import-commune');
  const categorie = document.getElementById('import-categorie');
  const file = document.getElementById('import-file-input');
  if (commune) commune.value = '';
  if (categorie) categorie.value = '';
  if (file) file.value = '';
  showFormError('');
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.match(/("([^"]|"")*"|[^,]*)/g)?.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"').trim()) || line.split(',');
    const row = {};
    headers.forEach((h, i) => { row[h] = vals[i]?.trim() ?? ''; });
    return row;
  });
}

function parseExcel(buffer) {
  if (typeof XLSX === 'undefined') throw new Error('Support Excel indisponible');
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheetName = wb.SheetNames.find(n => !/instruction/i.test(n)) || wb.SheetNames[0];
  return XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' });
}

function parseFile(file, context) {
  const mode = IMPORT_MODES[activeImportMode];
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let rawRows = [];
        if (ext === 'json') {
          const parsed = JSON.parse(e.target.result);
          rawRows = Array.isArray(parsed) ? parsed : [parsed];
        } else if (ext === 'xlsx' || ext === 'xls') {
          rawRows = parseExcel(e.target.result);
        } else {
          rawRows = parseCSV(e.target.result);
        }
        const rows = rawRows
          .map(r => mode.normalize(r, context))
          .filter(r => mode.isValidRow(r));
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Impossible de lire le fichier'));
    if (ext === 'xlsx' || ext === 'xls') reader.readAsArrayBuffer(file);
    else reader.readAsText(file);
  });
}

function showImportResult(msg, isError) {
  document.querySelectorAll('#import-result, #import-result-settings').forEach(el => {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden', 'border-emerald-200', 'bg-emerald-50', 'text-emerald-800', 'border-red-200', 'bg-red-50', 'text-red-800');
    if (isError) el.classList.add('border-red-200', 'bg-red-50', 'text-red-800');
    else el.classList.add('border-emerald-200', 'bg-emerald-50', 'text-emerald-800');
  });
}

function renderConfirmSummary(pending) {
  const dl = document.getElementById('import-confirm-summary');
  const mode = IMPORT_MODES[activeImportMode];
  if (!dl) return;
  dl.innerHTML = `
    <div class="flex justify-between gap-4"><dt class="text-slate-500">Commune</dt><dd class="font-medium text-right">${pending.context.commune}</dd></div>
    <div class="flex justify-between gap-4"><dt class="text-slate-500">${mode.confirmTypeLabel}</dt><dd class="font-medium text-right">${pending.context.typeLabel}</dd></div>
    <div class="flex justify-between gap-4"><dt class="text-slate-500">Fichier</dt><dd class="font-medium text-right">${pending.fileName}</dd></div>
    <div class="flex justify-between gap-4"><dt class="text-slate-500">Lignes détectées</dt><dd class="font-medium text-right">${pending.rows.length}</dd></div>`;
}

async function onImportNext() {
  const context = getImportContext();
  const mode = IMPORT_MODES[activeImportMode];
  const fileInput = document.getElementById('import-file-input');
  const file = fileInput?.files?.[0];

  if (!context.commune) return showFormError('Veuillez sélectionner une commune.');
  if (!context.typeKey) return showFormError(mode.missingType);
  if (!file) return showFormError('Veuillez choisir un fichier à importer.');

  showFormError('');
  const btn = document.getElementById('import-next-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Lecture…'; }

  try {
    const rows = await parseFile(file, context);
    if (!rows.length) {
      showFormError(mode.emptyRows);
      return;
    }
    pendingImport = { context, rows, fileName: file.name };
    toggleModal('import-modal', false);
    renderConfirmSummary(pendingImport);
    toggleModal('import-confirm-modal', true);
  } catch (err) {
    showFormError('Erreur : ' + err.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Continuer'; }
  }
}

function onConfirmImport(onSuccess) {
  if (!pendingImport) return;
  const { context, rows } = pendingImport;
  const mode = IMPORT_MODES[activeImportMode];
  mode.addRows(rows, context);
  toggleModal('import-confirm-modal', false);
  showImportResult(mode.successMsg(rows.length, context), false);
  pendingImport = null;
  resetImportForm();
  if (onSuccess) onSuccess(rows);
}

function bindImportPanel(onSuccess) {
  document.getElementById('import-open-btn')?.addEventListener('click', () => {
    resetImportForm();
    toggleModal('import-modal', true);
  });

  document.getElementById('import-cancel-btn')?.addEventListener('click', () => {
    toggleModal('import-modal', false);
    resetImportForm();
  });

  document.getElementById('import-modal-backdrop')?.addEventListener('click', () => {
    toggleModal('import-modal', false);
    resetImportForm();
  });

  document.getElementById('import-next-btn')?.addEventListener('click', onImportNext);

  document.getElementById('import-confirm-back-btn')?.addEventListener('click', () => {
    toggleModal('import-confirm-modal', false);
    toggleModal('import-modal', true);
  });

  document.getElementById('import-confirm-backdrop')?.addEventListener('click', () => {
    toggleModal('import-confirm-modal', false);
    pendingImport = null;
  });

  document.getElementById('import-confirm-btn')?.addEventListener('click', () => onConfirmImport(onSuccess));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('import-confirm-modal')?.classList.contains('hidden')) {
      toggleModal('import-confirm-modal', false);
      pendingImport = null;
    } else if (!document.getElementById('import-modal')?.classList.contains('hidden')) {
      toggleModal('import-modal', false);
      resetImportForm();
    }
  });
}

function bindImportHandlers(onSuccess, mode = 'infra') {
  activeImportMode = mode;
  bindImportPanel(onSuccess);
}
