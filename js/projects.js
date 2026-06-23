function toggleProjectModal(open) {
  const modal = document.getElementById('project-form-modal');
  if (!modal) return;
  modal.classList.toggle('hidden', !open);
  modal.setAttribute('aria-hidden', open ? 'false' : 'true');
  document.body.classList.toggle('overflow-hidden', open);
}

function showProjectResult(msg, isError) {
  const el = document.getElementById('project-result');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden', 'border-emerald-200', 'bg-emerald-50', 'text-emerald-800', 'border-red-200', 'bg-red-50', 'text-red-800');
  if (isError) el.classList.add('border-red-200', 'bg-red-50', 'text-red-800');
  else el.classList.add('border-emerald-200', 'bg-emerald-50', 'text-emerald-800');
}

function showProjectFormError(msg) {
  const el = document.getElementById('project-form-error');
  if (!el) return;
  if (msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

function fillProjectForm(project) {
  document.getElementById('project-id').value = project?.id || '';
  document.getElementById('project-title').value = project?.title || '';
  document.getElementById('project-description').value = project?.description || '';
  document.getElementById('project-status').value = project?.status || 'todo';
  document.getElementById('project-priority').value = project?.priority || 'Moyenne';
  document.getElementById('project-budget').value = project?.budget ?? '';
  const progress = project?.progress ?? 0;
  document.getElementById('project-progress').value = progress;
  document.getElementById('project-progress-label').textContent = progress;
  document.getElementById('project-commune').value = project?.commune || '';
  document.getElementById('project-category').value = project?.category || '';
  document.getElementById('project-form-title').textContent = project ? 'Modifier le projet' : 'Nouveau projet';
  showProjectFormError('');
}

function openProjectForm(project) {
  fillProjectForm(project || null);
  toggleProjectModal(true);
  document.getElementById('project-title')?.focus();
}

function readProjectForm() {
  return {
    title: document.getElementById('project-title')?.value.trim() || '',
    description: document.getElementById('project-description')?.value.trim() || '',
    status: document.getElementById('project-status')?.value || 'todo',
    priority: document.getElementById('project-priority')?.value || 'Moyenne',
    budget: document.getElementById('project-budget')?.value,
    progress: document.getElementById('project-progress')?.value,
    commune: document.getElementById('project-commune')?.value || '',
    category: document.getElementById('project-category')?.value || '',
  };
}

function bindProjectHandlers() {
  const modal = document.getElementById('project-form-modal');
  if (!modal) return;

  document.getElementById('project-add-btn')?.addEventListener('click', () => openProjectForm());

  document.querySelectorAll('.project-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.projectId;
      const project = getAllProjects().find(p => String(p.id) === String(id));
      if (project) openProjectForm(project);
    });
  });

  document.getElementById('project-cancel-btn')?.addEventListener('click', () => toggleProjectModal(false));
  document.getElementById('project-form-backdrop')?.addEventListener('click', () => toggleProjectModal(false));

  document.getElementById('project-progress')?.addEventListener('input', (e) => {
    const label = document.getElementById('project-progress-label');
    if (label) label.textContent = e.target.value;
  });

  document.getElementById('project-status')?.addEventListener('change', (e) => {
    if (e.target.value === 'done') {
      const slider = document.getElementById('project-progress');
      const label = document.getElementById('project-progress-label');
      if (slider) slider.value = 100;
      if (label) label.textContent = '100';
    }
  });

  document.getElementById('project-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = readProjectForm();
    if (!data.title) return showProjectFormError('L\'intitulé du projet est obligatoire.');

    const id = document.getElementById('project-id')?.value;
    if (id) {
      updateProject(id, data);
      showProjectResult('Projet mis à jour.', false);
    } else {
      addProject(data);
      showProjectResult('Projet créé.', false);
    }
    toggleProjectModal(false);
    document.getElementById('main-content').innerHTML = renderProjects();
    bindProjectHandlers();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modal.classList.contains('hidden')) toggleProjectModal(false);
  });
}
