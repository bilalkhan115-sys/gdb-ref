/* ============================================================
   GloForEx — Task Reference Guide
   task-reference-guide.js
   ============================================================ */

/* ── State ─────────────────────────────────────────────────── */
let TASKS           = [];
let CONFIG          = null;
let activeModality  = 'ocean';
let activeDirection = 'import';
let activeCountry   = 'all';
let activeTeam      = 'all';
let selectedTask    = null;
let compareMode     = false;
const compareTasks  = [];
const COMPARE_MAX   = 5;

/* ── Constants ─────────────────────────────────────────────── */
const AUTO_ICONS = {
  'full': '⚡', 'api-automated': '🔗', 'recurring': '🔄', 'manual': '✋', 'exception': '⚠️'
};

const TEAM_ICONS = {
  'booking': '📋', 'operations': '🚢', 'documentation': '📄', 'financial': '💰', 'error': '🔔'
};

/* ── Data loading ─────────────────────────────────────────── */
async function loadConfig() {
  const res = await fetch('./data/config.json');
  CONFIG = await res.json();
}

async function loadTasks(modality, direction) {
  const res = await fetch(`./data/${modality}/${direction}/tasks.json`);
  TASKS = await res.json();
}

/* ── Variant selector ─────────────────────────────────────── */
function renderVariantSelector() {
  const wrap = document.getElementById('variant-filters');
  if (!wrap || !CONFIG) return;

  const currentModality = CONFIG.modalities.find(m => m.id === activeModality);

  const modalityBtns = CONFIG.modalities.map(m =>
    `<button class="filter-btn${m.id === activeModality ? ' active' : ''}" onclick="setModality('${m.id}')">${m.label}</button>`
  ).join('');

  const directionBtns = currentModality ? currentModality.directions.map(d =>
    `<button class="filter-btn${d.id === activeDirection ? ' active' : ''}" onclick="setDirection('${d.id}')">${d.label}</button>`
  ).join('') : '';

  wrap.innerHTML =
    `<span class="filter-label">Modality</span>${modalityBtns}` +
    `<span class="filter-label" style="margin-left:16px;">Direction</span>${directionBtns}`;
}

async function setModality(modality) {
  const m = CONFIG.modalities.find(m => m.id === modality);
  if (!m) return;
  activeModality  = modality;
  activeDirection = m.directions[0].id;
  await switchVariant();
}

async function setDirection(direction) {
  activeDirection = direction;
  await switchVariant();
}

async function switchVariant() {
  await loadTasks(activeModality, activeDirection);
  activeCountry = 'all';
  activeTeam    = 'all';
  selectedTask  = null;

  const m = CONFIG.modalities.find(m => m.id === activeModality);
  const d = m?.directions.find(d => d.id === activeDirection);
  const eyebrow = document.getElementById('page-eyebrow');
  if (eyebrow && m && d) eyebrow.textContent = `Freight Forwarding · ${m.label} ${d.label}`;

  document.querySelectorAll('[data-country-filter]').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.countryFilter === 'all')
  );
  document.querySelectorAll('[data-team-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.teamFilter === 'all');
    btn.classList.remove('non-ops-inactive');
  });

  renderVariantSelector();
  renderTaskList();
  renderDetail(null);
  if (compareMode) renderCompareList();
}

/* ── Helpers ───────────────────────────────────────────────── */
function getTeamLabel(teamId) {
  if (teamId === 'all') return 'All teams';
  const task = TASKS.find(t => t.team === teamId);
  return task ? task.teamLabel : teamId;
}

function buildScopeHTML(task) {
  return ['FR', 'DE', 'NL', 'IT', 'PL'].map(c =>
    `<span class="scope-badge ${task.scope.includes(c) ? 'active' : 'inactive'}">${c}</span>`
  ).join('');
}

/* ── Filter Logic ──────────────────────────────────────────── */
function getFilteredTasks() {
  return TASKS.filter(t => {
    if (t.inactive) return false;
    if (activeCountry !== 'all' && !t.scope.includes(activeCountry)) return false;
    if (activeTeam !== 'all' && t.team !== activeTeam) return false;
    return true;
  });
}

function setCountryFilter(country) {
  activeCountry = country;
  document.querySelectorAll('[data-country-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.countryFilter === country);
  });
  renderTaskList();
  if (compareMode) renderCompareList();
}

function setTeamFilter(team) {
  activeTeam = team;
  document.querySelectorAll('[data-team-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.teamFilter === team);
    if (team === 'all') {
      btn.classList.remove('non-ops-inactive');
    } else {
      const isNonOps = ['financial', 'error'].includes(btn.dataset.teamFilter) && btn.dataset.teamFilter !== 'all';
      btn.classList.toggle('non-ops-inactive', isNonOps && team !== btn.dataset.teamFilter);
    }
  });
  renderTaskList();
  if (compareMode) renderCompareList();
}

/* ── Render task list ──────────────────────────────────────── */
function renderTaskList() {
  const list  = document.getElementById('task-list');
  const count = document.getElementById('task-count');
  const tasks = getFilteredTasks();

  if (selectedTask && !tasks.find(t => t.id === selectedTask.id)) {
    selectedTask = null;
    renderDetail(null);
  }

  list.innerHTML = '';

  if (tasks.length === 0) {
    list.innerHTML = '<div class="no-results">No tasks match the selected filters.</div>';
    count.textContent = '0 tasks';
    return;
  }

  count.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
  buildPrintLabel();

  tasks.forEach(task => {
    const item = document.createElement('div');
    item.className = 'task-item' + (selectedTask && selectedTask.id === task.id ? ' active' : '');
    item.dataset.taskId = task.id;
    item.innerHTML = `
      <div class="task-item-name">${task.task}</div>
      <span class="pill pill-${task.team}" style="font-size:9.5px;padding:2px 7px;">${task.teamLabel.replace(/^(Import|Export|Cross-Trade) /i, '')}</span>
    `;
    item.addEventListener('click', () => selectTask(task));
    list.appendChild(item);
  });
}

function selectTask(task) {
  selectedTask = task;
  document.querySelectorAll('.task-item').forEach(el => {
    el.classList.toggle('active', el.dataset.taskId === task.id);
  });
  renderDetail(task);
}

/* ── Render detail panel ───────────────────────────────────── */
function renderDetail(task) {
  const placeholder = document.getElementById('detail-placeholder');
  const panel       = document.getElementById('detail-panel');

  if (!task) {
    placeholder.classList.remove('hidden');
    panel.classList.remove('visible');
    return;
  }

  placeholder.classList.add('hidden');

  const deadlinePill = task.deadline ? `<span class="pill pill-deadline">⏱ ${task.deadline.label}</span>` : '';
  const autoPill     = `<span class="pill pill-auto-${task.auto}">${AUTO_ICONS[task.auto] || ''} ${task.autoLabel}</span>`;
  const teamPill     = `<span class="pill pill-${task.team}">${TEAM_ICONS[task.team] || ''} ${task.teamLabel}</span>`;
  const nonOpsPill   = task.nonOps ? `<span class="pill pill-non-ops">Non-ops</span>` : '';

  const checklistHTML = task.dataToCheck.map(item => `<li>${item}</li>`).join('');

  const conditionalCard = task.conditional ? `
    <div class="detail-card card-cond">
      <div class="detail-card-header"><span class="card-icon">⚠️</span>Conditions &amp; exceptions</div>
      <div class="detail-card-body">${task.conditional}</div>
    </div>` : '';

  panel.innerHTML = `
    <div class="detail-header">
      <div class="detail-title">${task.task}</div>
      <div class="scope-row">${buildScopeHTML(task)}</div>
      <div class="detail-pills" style="margin-top:10px;">${teamPill}${nonOpsPill}${deadlinePill}${autoPill}</div>
    </div>
    <div class="detail-body">
      <div class="detail-card card-action">
        <div class="detail-card-header"><span class="card-icon">▶</span>Action required</div>
        <div class="detail-card-body">${task.action}</div>
      </div>
      <div class="detail-card card-data">
        <div class="detail-card-header"><span class="card-icon">✓</span>Data to check</div>
        <div class="detail-card-body"><ul>${checklistHTML}</ul></div>
      </div>
      ${conditionalCard}
    </div>`;

  panel.classList.add('visible');
}

/* ── Compare mode ─────────────────────────────────────────── */
function toggleCompareMode() {
  compareMode = !compareMode;
  const btn = document.getElementById('compareModeBtn');
  if (btn) btn.classList.toggle('active', compareMode);

  const splitWrap   = document.querySelector('.split-wrap');
  const compareView = document.getElementById('compare-view');

  if (compareMode) {
    splitWrap.classList.add('hidden');
    compareView.classList.remove('hidden');
    renderCompareList();
    renderCompareGrid();
  } else {
    splitWrap.classList.remove('hidden');
    compareView.classList.add('hidden');
  }
}

function toggleCompareTask(task) {
  const idx = compareTasks.findIndex(t => t.id === task.id);
  if (idx > -1) {
    compareTasks.splice(idx, 1);
  } else {
    if (compareTasks.length >= COMPARE_MAX) return;
    compareTasks.push(task);
  }
  renderCompareList();
  renderCompareGrid();
}

function renderCompareList() {
  const list  = document.getElementById('compare-task-list');
  const count = document.getElementById('compare-task-count');
  const hint  = document.getElementById('compare-hint');
  const tasks = getFilteredTasks();

  list.innerHTML = '';
  count.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;

  const remaining = COMPARE_MAX - compareTasks.length;
  hint.textContent = compareTasks.length === 0
    ? `Select up to ${COMPARE_MAX} tasks`
    : remaining === 0
      ? 'Max tasks selected'
      : `${remaining} slot${remaining !== 1 ? 's' : ''} remaining`;

  tasks.forEach(task => {
    const compareIdx = compareTasks.findIndex(t => t.id === task.id);
    const inCompare  = compareIdx > -1;
    const atMax      = compareTasks.length >= COMPARE_MAX;

    const item = document.createElement('div');
    item.className = `compare-task-item${inCompare ? ' in-compare' : ''}`;
    if (!inCompare && atMax) item.style.opacity = '0.45';

    const badgeHTML = inCompare
      ? `<span class="compare-num-badge">${compareIdx + 1}</span>`
      : `<span class="pill pill-${task.team}" style="font-size:9.5px;padding:2px 7px;">${task.teamLabel.replace(/^(Import|Export|Cross-Trade) /i, '')}</span>`;

    item.innerHTML = `
      <div class="compare-task-item-name">${task.task}</div>
      ${badgeHTML}`;

    if (inCompare || !atMax) {
      item.addEventListener('click', () => toggleCompareTask(task));
    }

    list.appendChild(item);
  });
}

function renderCompareGrid() {
  const grid        = document.getElementById('compare-grid');
  const placeholder = document.getElementById('compare-placeholder');

  if (compareTasks.length === 0) {
    placeholder.style.display = 'flex';
    grid.classList.remove('visible');
    grid.innerHTML = '';
    return;
  }

  placeholder.style.display = 'none';
  grid.classList.add('visible');

  grid.innerHTML = compareTasks.map((task, i) => {
    const deadlinePill = task.deadline
      ? `<span class="pill pill-deadline">⏱ ${task.deadline.label}</span>` : '';
    const autoPill   = `<span class="pill pill-auto-${task.auto}">${AUTO_ICONS[task.auto] || ''} ${task.autoLabel}</span>`;
    const teamPill   = `<span class="pill pill-${task.team}">${TEAM_ICONS[task.team] || ''} ${task.teamLabel}</span>`;
    const nonOpsPill = task.nonOps ? `<span class="pill pill-non-ops">Non-ops</span>` : '';

    const checksHTML = task.dataToCheck.map(c => `<li>${c}</li>`).join('');

    const conditionalCard = task.conditional ? `
      <div class="detail-card card-cond">
        <div class="detail-card-header"><span class="card-icon">⚠️</span>Conditions &amp; exceptions</div>
        <div class="detail-card-body">${task.conditional}</div>
      </div>` : '';

    return `
      <div class="compare-col">
        <div class="compare-col-header">
          <button class="compare-remove-btn" onclick="removeCompareTask('${task.id}')">×</button>
          <div class="compare-col-num">Task ${i + 1} of ${compareTasks.length}</div>
          <div class="compare-col-title">${task.task}</div>
          <div class="compare-col-scope">${buildScopeHTML(task)}</div>
          <div class="compare-col-pills">${teamPill}${nonOpsPill}${deadlinePill}${autoPill}</div>
        </div>
        <div class="detail-card card-action">
          <div class="detail-card-header"><span class="card-icon">▶</span>Action required</div>
          <div class="detail-card-body">${task.action}</div>
        </div>
        <div class="detail-card card-data">
          <div class="detail-card-header"><span class="card-icon">✓</span>Data to check</div>
          <div class="detail-card-body"><ul>${checksHTML}</ul></div>
        </div>
        ${conditionalCard}
      </div>`;
  }).join('');
}

function removeCompareTask(id) {
  const idx = compareTasks.findIndex(t => t.id === id);
  if (idx > -1) compareTasks.splice(idx, 1);
  renderCompareList();
  renderCompareGrid();
}

/* ── Print ─────────────────────────────────────────────────── */
function buildPrintLabel() {
  const tasks        = getFilteredTasks();
  const countryLabel = activeCountry === 'all' ? 'All countries' : activeCountry;
  const teamLabel    = getTeamLabel(activeTeam);
  const el = document.getElementById('print-bar-label');
  if (el) el.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''} · ${countryLabel} · ${teamLabel}`;
}

function printTasks() {
  const tasks        = getFilteredTasks();
  const countryLabel = activeCountry === 'all' ? 'All countries' : activeCountry;
  const teamLabel    = getTeamLabel(activeTeam);
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const AUTO_LABELS = {
    'full': 'Auto-complete', 'api-automated': 'API-automated',
    'recurring': 'Recurring', 'manual': 'Manual', 'exception': 'Exception'
  };

  const tasksHTML = tasks.map(task => {
    const scopeBadges = ['FR', 'DE', 'NL', 'IT', 'PL'].map(c =>
      `<span class="pr-scope ${task.scope.includes(c) ? 'pr-scope-on' : 'pr-scope-off'}">${c}</span>`
    ).join('');

    const deadlinePill = task.deadline
      ? `<span class="pr-pill pr-pill-deadline">⏱ ${task.deadline.label}</span>` : '';
    const autoPill   = `<span class="pr-pill pr-pill-auto pr-auto-${task.auto}">${AUTO_LABELS[task.auto]}</span>`;
    const teamPill   = `<span class="pr-pill pr-pill-team pr-team-${task.team}">${task.teamLabel}</span>`;
    const nonOpsPill = task.nonOps ? `<span class="pr-pill pr-pill-nonops">Non-ops</span>` : '';

    const checklistHTML = task.dataToCheck.map(item => `<li>${item}</li>`).join('');

    const conditionalBlock = task.conditional ? `
      <div class="pr-card pr-card-cond">
        <div class="pr-card-head">Conditions &amp; exceptions</div>
        <div class="pr-card-body">${task.conditional}</div>
      </div>` : '';

    return `
      <div class="pr-task">
        <div class="pr-task-header">
          <div class="pr-task-title">${task.task}</div>
          <div class="pr-task-meta">
            <div class="pr-scope-row">${scopeBadges}</div>
            <div class="pr-pills">${teamPill}${nonOpsPill}${deadlinePill}${autoPill}</div>
          </div>
        </div>
        <div class="pr-cards">
          <div class="pr-card pr-card-action">
            <div class="pr-card-head">Action required</div>
            <div class="pr-card-body">${task.action}</div>
          </div>
          <div class="pr-card pr-card-data">
            <div class="pr-card-head">Data to check</div>
            <div class="pr-card-body"><ul>${checklistHTML}</ul></div>
          </div>
          ${conditionalBlock}
        </div>
      </div>`;
  }).join('');

  const printView = document.getElementById('print-view');
  printView.innerHTML = `
    <div class="pr-cover">
      <div class="pr-cover-brand">GDB Logistics · MyFreight</div>
      <div class="pr-cover-title">Task Reference Guide</div>
      <div class="pr-cover-meta">
        <span>${tasks.length} task${tasks.length !== 1 ? 's' : ''}</span>
        <span class="pr-cover-dot">·</span>
        <span>${countryLabel}</span>
        <span class="pr-cover-dot">·</span>
        <span>${teamLabel}</span>
        <span class="pr-cover-dot">·</span>
        <span>Generated ${dateStr}</span>
      </div>
    </div>
    ${tasksHTML}`;

  window.print();
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();
  await loadTasks(activeModality, activeDirection);

  const m = CONFIG.modalities.find(m => m.id === activeModality);
  const d = m?.directions.find(d => d.id === activeDirection);
  const eyebrow = document.getElementById('page-eyebrow');
  if (eyebrow && m && d) eyebrow.textContent = `Freight Forwarding · ${m.label} ${d.label}`;

  renderVariantSelector();
  renderTaskList();
  renderDetail(null);
});
