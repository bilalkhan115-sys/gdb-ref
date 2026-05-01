/* ============================================================
   GloForEx — Task Reference Guide
   task-reference-guide.js
   ============================================================ */

/* ── Task Data ─────────────────────────────────────────────── */
const TASKS = [
  // STG-1 Booking
  {
    id: 't2', task: 'Request booking confirmation', team: 'booking', teamLabel: 'Import Booking',
    auto: 'manual', autoLabel: 'Manual',
    deadline: { label: '14 days before ETD' },
    scope: { FR: true, DE: false, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Contact the carrier or agent to request formal confirmation that space has been allocated for this shipment.',
    dataToCheck: ['Carrier or agent contact details','Carrier shipment number and voyage details','Container type and quantity'],
    conditional: null
  },
  {
    id: 't1', task: 'Validate booking', team: 'booking', teamLabel: 'Import Booking',
    auto: 'full', autoLabel: 'Auto-complete',
    deadline: { label: '5 days before ETD' },
    scope: { FR: true, DE: false, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Confirm that all required booking fields are present and correct. For API bookings where all fields are populated, this task completes automatically. For manual or exception bookings, review the record and complete the task once validated.',
    dataToCheck: ['Consignee and shipper details','POL and POD','ETD and ETA','Carrier and service','Container type and count','Incoterm'],
    conditional: null
  },
  {
    id: 't3', task: 'Booking confirmation', team: 'booking', teamLabel: 'Import Booking',
    auto: 'manual', autoLabel: 'Manual',
    deadline: { label: '5 days before ETD' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Record and confirm that space has been formally released by the carrier. Complete this task once written confirmation is received.',
    dataToCheck: ['Booking reference from carrier','Vessel and voyage match','Container type and count confirmed','POL and POD match original booking'],
    conditional: 'DE: always mandatory. FR and NL: conditional on the customer — check whether confirmation is required before marking complete. Where confirmation has not been received and the deadline is approaching, escalate to the carrier.'
  },
  // STG-2 Departure
  {
    id: 't5', task: 'Departure shipment data', team: 'booking', teamLabel: 'Import Booking',
    auto: 'api-automated', autoLabel: 'API-automated',
    deadline: { label: '5 days before ETD' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Manually enter or verify all departure shipment data fields in MF. Complete the task once all required fields are populated and confirmed.',
    dataToCheck: ['POD and POL','ETD and ETA','Vessel name','Carrier','Carrier shipment number','Contract number'],
    conditional: 'Applies to non-API shipments only. If the shipment is agent-sourced via API, use the Check agent update task instead. If any field cannot be confirmed before the deadline, log this in the shipment notes and escalate.'
  },
  {
    id: 't4', task: 'Check agent update', team: 'booking', teamLabel: 'Import Booking',
    auto: 'recurring', autoLabel: 'Recurring',
    deadline: { label: '3 days before ETD' },
    scope: { FR: true, DE: false, NL: true, IT: false, PL: true },
    nonOps: false,
    action: 'Review the latest data pushed by the agent via the SnapLogic API and confirm it is correct. This task resets to Pending each time a new agent update is received — it does not need to be actioned if no update has come in.',
    dataToCheck: ['ETD and ETA','Vessel name','Carrier shipment number','Container number'],
    conditional: 'Applies to API shipments only — not applicable for manual bookings. DE and IT are not yet live for this task due to no agent integrations. If data received from the agent contradicts what is in MF, do not overwrite — raise with your team lead.'
  },
  {
    id: 't6', task: 'Agent Pre-alert', team: 'booking', teamLabel: 'Import Booking',
    auto: 'full', autoLabel: 'Auto-complete',
    deadline: { label: '2 days after ETD' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'No action required. This task completes automatically when the agent pre-alert is received with all required data. If the task remains Pending after the expected pre-alert date, follow up with the agent.',
    dataToCheck: ['HBL number','MBL number','Container number'],
    conditional: 'If the pre-alert arrives without one or more of the required fields, the task will remain Pending. In this case, contact the agent to request the missing information before the arrival deadline.'
  },
  // ATD-anchored
  {
    id: 't10', task: 'Verify insurance certificate', team: 'operations', teamLabel: 'Import Operations',
    auto: 'exception', autoLabel: 'Exception',
    deadline: { label: '10 days after ATD' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Check whether insurance applies to this shipment. If it does, retrieve the insurance certificate and verify it against the cargo details. Complete the task once verified, or mark not applicable if insurance is not required.',
    dataToCheck: ['Incoterm (insurance typically required for CIF/CIP)','Insured value and currency','Coverage scope matches cargo','Certificate validity dates'],
    conditional: 'This task is conditional on incoterm and country-specific rules. Check the Compliance tab Insurance flag in MF to determine applicability. MF configuration to drive task visibility by this flag is pending confirmation.'
  },
  // ETA-anchored (7 days before)
  {
    id: 't7', task: 'Verify commercial invoice & packing list', team: 'operations', teamLabel: 'Import Operations',
    auto: 'manual', autoLabel: 'Manual',
    deadline: { label: '7 days before ETA' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Retrieve the commercial invoice and packing list from the shipment documents and cross-check against MF shipment data. Complete the task once all fields are verified and consistent.',
    dataToCheck: ['Consignee and shipper names','Cargo description and HS code','Declared value and currency','Incoterm','Package count, net weight and gross weight'],
    conditional: 'If discrepancies are found between the invoice and MF data, do not complete the task — log the issue and contact the agent or customer to resolve. All fields must match before completion.'
  },
  {
    id: 't8', task: 'Verify Seaway bill', team: 'operations', teamLabel: 'Import Operations',
    auto: 'manual', autoLabel: 'Manual',
    deadline: { label: '5 days before ETA' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Verify the seaway bill against the MF shipment record. For API shipments, this task may auto-complete when the document is received from the agent. For manual shipments, review the document and complete manually once verified.',
    dataToCheck: ['Shipper and consignee parties','POL and POD','Container number','Cargo description and weight','Carrier and vessel details'],
    conditional: 'If the seaway bill is not yet received by 5 days before ETA, follow up with the agent. If the document arrives via API, check auto-completion status — manual review may still be needed if the API data is incomplete.'
  },
  {
    id: 't9', task: 'HBL / TLX release', team: 'operations', teamLabel: 'Import Operations',
    auto: 'full', autoLabel: 'Auto-complete',
    deadline: { label: '3 days before ETA' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'No action required. This task completes automatically when the HBL or TLX release is provided by the agent via API. If the task remains Pending, contact the agent to confirm release status.',
    dataToCheck: ['HBL or TLX release confirmation received','Release method (OBL surrender / TLX / SeaWaybill)'],
    conditional: 'If the release document arrives outside the API (e.g. via email), manually upload the document to the shipment record and complete the task.'
  },
  {
    id: 't11', task: 'Check / complete customs data', team: 'documentation', teamLabel: 'Import Documentation',
    auto: 'manual', autoLabel: 'Manual',
    deadline: { label: '7 days before ETA' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Carry out a pre-arrival check to confirm that all data required for customs entry is complete and accurate in MF. Complete the task once all fields are confirmed ready. All fields must be resolved by 7 days before ETA to avoid delaying the customs submission.',
    dataToCheck: ['HS codes','Declared value and currency','Country of origin','Incoterm','Package count, weight and dimensions','Consignee EORI number'],
    conditional: null
  },
  // STG-4 Customs
  {
    id: 't12', task: 'Send documents to Customs', team: 'documentation', teamLabel: 'Import Documentation',
    auto: 'manual', autoLabel: 'Manual',
    deadline: { label: '2 days before ETA' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Execute this task in MF to trigger the webhook that sends the customs package to the Customs system. Do not send documents outside MF — the task execution is the trigger for the automated submission.',
    dataToCheck: ['Customs data check completed','No Documentation related open items on the shipment'],
    conditional: 'If Customs rejects the submission, the task will automatically reset to Pending and the Dev Message Log will also be set to Pending. Review the rejection reason in the Dev Message Log, correct the data, and re-execute the task.'
  },
  {
    id: 't13', task: 'Customs clearance received', team: 'documentation', teamLabel: 'Import Documentation',
    auto: 'full', autoLabel: 'Auto-complete',
    deadline: { label: 'On ATA' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'No action required. This task is created and immediately completed automatically when clearance confirmation is received from the Customs API. This task is a prerequisite gate — STG-6 (Carrier Release) cannot begin until this task is complete.',
    dataToCheck: ['Clearance reference number','Clearance date and time'],
    conditional: 'If customs clearance is not received within the expected window after submission, check the Dev Message Log for any errors. If no error is logged, contact the customs broker or authority directly.'
  },
  // STG-5 Pre-arrival (t14 inactive)
  //{
    //id: 't14', task: 'ETA Warning', team: 'operations', teamLabel: 'Import Operations',
    //auto: 'recurring', autoLabel: 'Recurring',
    //deadline: null,
    //scope: { FR: false, DE: false, NL: false, IT: false, PL: false },
    //nonOps: false, inactive: true,
    //action: 'Review the ETA deviation and assess operational impact. Coordinate with the customer and any delivery partners to adjust planning. Complete the task once the situation has been assessed and the customer informed.',
    //dataToCheck: ['Revised ETA from MF live tracking','Original planned ETA','Deviation in days (early or late)','Downstream impact: carrier release, delivery planning, warehouse booking'],
    //conditional: 'This task becomes Pending automatically when MF live tracking shows the container arriving 7 or more days earlier or later than planned. It does not trigger for smaller deviations. If the deviation changes again, the task may reset.'
  //},
  // STG-6 Carrier Release
  {
    id: 't16', task: 'Request carrier release', team: 'operations', teamLabel: 'Import Operations',
    auto: 'manual', autoLabel: 'Manual',
    deadline: { label: '7 days before ETA' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Send a release request by email to the carrier. Complete this task in MF once the request has been sent.',
    dataToCheck: ['Carrier contact details','Container number(s)','MBL reference'],
    conditional: 'For some carriers a local invoice must be paid before receiving a release.'
  },
  {
    id: 't17', task: 'Carrier release confirmed', team: 'operations', teamLabel: 'Import Operations',
    auto: 'manual', autoLabel: 'Manual',
    deadline: { label: '3 days before ETA' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Check the port or carrier system to confirm that the container release has been granted. Complete this task in MF once release is confirmed.',
    dataToCheck: ['Release status in port/carrier system','PIN or release code if applicable','Free time start and end dates','Any holds (customs, freight, lien)'],
    conditional: 'Currently manual — future integration with S)One, Ci5, or Twiki is planned to auto-complete this task, but is out of scope for the current phase. If release is refused or delayed, log the reason and escalate to the carrier account manager.'
  },
  // STG-7 Delivery
  {
    id: 't18', task: 'Delivery planning / Arrival notification', team: 'operations', teamLabel: 'Import Operations',
    auto: 'manual', autoLabel: 'Manual',
    deadline: { label: '7 days before ETA' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: "Plan and coordinate the delivery ahead of the shipment's arrival. Notify the customer of the imminent arrival and confirm the estimated delivery date and time window. Use the OutSystems bulk tool to push the planned delivery date, time, and locations to MF.",
    dataToCheck: ['Customer contact and preferred notification method','Planned delivery date and time window','Delivery address in MF','Any special delivery instructions on the shipment'],
    conditional: 'If the customer has specific notification requirements (e.g. pre-advice window, delivery slot booking), check the customer profile before sending. If delivery cannot be planned within 2 days of ATA, log the reason and notify the customer of the delay.'
  },
  {
    id: 't20', task: 'Warehouse Inbound Order', team: 'operations', teamLabel: 'Import Operations',
    auto: 'exception', autoLabel: 'Exception',
    deadline: { label: '3 days before ATA' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Create and submit a Warehouse Inbound Order to the receiving warehouse. Coordinate with the warehouse to confirm the inbound slot and any handling requirements.',
    dataToCheck: ['Warehouse name and address','Inbound booking reference','Cargo description, weight, and dimensions','Handling instructions (hazardous, temperature, fragile)'],
    conditional: 'This task only applies where cargo is delivered to a warehouse before final delivery to the end customer. If the shipment goes direct to consignee, this task is not required.'
  },
  {
    id: 't19', task: 'Transport Delivery Order', team: 'operations', teamLabel: 'Import Operations',
    auto: 'manual', autoLabel: 'Manual',
    deadline: { label: '2 days before ATA' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Execute the Transport Delivery Order task in MF. This triggers an API call to push the planned delivery data to Qargo or the assigned trucker. The task turns green on a successful push.',
    dataToCheck: ['Delivery address and contact','Planned delivery date and time','Container number(s)','Trucker or transport partner assigned in MF'],
    conditional: 'If the task does not turn green after execution, the API push has failed. Check the Dev Message Log for an error entry and resolve before retrying. Do not contact the trucker directly to communicate delivery details — MF is the system of record.'
  },
  {
    id: 't21', task: 'LCL Devanning', team: 'operations', teamLabel: 'Import Operations',
    auto: 'manual', autoLabel: 'Manual',
    deadline: { label: '5 days after ATA' },
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: false,
    action: 'Coordinate the devanning of the LCL container at the CFS or terminal. Confirm that all cargo for this shipment has been identified and separated correctly. Complete the task in MF once devanning is confirmed.',
    dataToCheck: ['CFS or terminal contact and location','LCL cargo description and marks','Number of packages and weight','Any cargo condition issues noted during devanning'],
    conditional: 'LCL shipments only. Devanning is a prerequisite to customs clearance in the standard LCL flow — do not proceed to Submit documents to Customs until devanning is complete and the cargo is confirmed.'
  },
  {
    id: 't22', task: 'Request TCT + ERC (Le Havre only)', team: 'operations', teamLabel: 'Import Operations',
    auto: 'manual', autoLabel: 'Manual',
    deadline: { label: 'On customs clearance' },
    scope: { FR: true, DE: false, NL: false, IT: true, PL: false },
    nonOps: false,
    action: 'Submit requests for the TCT (PCR) and ERC (leeg retour) to the relevant port authority or terminal at Le Havre. Complete the task in MF once both requests have been submitted.',
    dataToCheck: ['Container number(s)','Customs clearance reference','Terminal or port authority contact at Le Havre','Return depot details for empty container'],
    conditional: 'Le Havre port operations only. This task is triggered on customs clearance. Not applicable for FR shipments entering through other ports (e.g. Marseille, Fos-sur-Mer).'
  },
  {
    id: 't15', task: 'Terminal update', team: 'operations', teamLabel: 'Import Operations',
    auto: 'manual', autoLabel: 'Manual',
    deadline: null,
    scope: { FR: true, DE: false, NL: false, IT: true, PL: false },
    nonOps: false,
    action: 'Check the terminal system for the latest container status and update MF accordingly. Confirm port availability, berthing, and discharge information where available.',
    dataToCheck: ['Terminal arrival / discharge status','Container availability for pickup','Terminal reference or PIN if required','Any demurrage or free time implications'],
    conditional: 'Applicable for FCL shipments entering via the ports of Marseille or Fos-sur-Mer (FR). Not applicable for DE, NL, or PL.'
  },
  {
    id: 't23', task: 'Return empty container monitoring', team: 'operations', teamLabel: 'Import Operations',
    auto: 'manual', autoLabel: 'Manual',
    deadline: null,
    scope: { FR: false, DE: true, NL: true, IT: false, PL: true },
    nonOps: false,
    action: 'Confirm that the empty container has been returned to the carrier depot and update MF accordingly. Complete the task once return is confirmed.',
    dataToCheck: ['Return depot location','Return reference or gate-out confirmation','Return deadline / last free day','Container condition at return'],
    conditional: "NL: mandatory. DE: recommended for record completeness. If the container is not returned by the carrier's free time deadline, detention charges will apply — monitor proactively."
  },
  // STG-8 Financial
  {
    id: 't24', task: 'Create invoice', team: 'financial', teamLabel: 'Financial Handling',
    auto: 'manual', autoLabel: 'Manual',
    deadline: null,
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: true,
    action: 'Create the outbound invoice to the customer in the financial system. Ensure all charges are captured correctly before issuing.',
    dataToCheck: ['All cost lines posted to the shipment','Customer billing details and purchase order reference','Applicable charge codes and VAT treatment','Agreed rates and any surcharges'],
    conditional: 'Do not issue the invoice until all cost lines are confirmed and the shipment is operationally complete. If any charges are pending (e.g. detention, waiting time), decide whether to hold the invoice or issue with a supplementary charge later.'
  },
  // Error Handling
  {
    id: 't25', task: 'Dev message log', team: 'error', teamLabel: 'Error Handling',
    auto: 'recurring', autoLabel: 'Recurring',
    deadline: null,
    scope: { FR: true, DE: true, NL: true, IT: true, PL: true },
    nonOps: true,
    action: 'Monitor the Dev Message Log on every shipment throughout the lifecycle. A Completed status is informational. A Pending status means an integration error or missing data requires your attention — review the log entry and resolve the issue.',
    dataToCheck: ['Log entry type (error / warning / info)','Affected task or integration point','Timestamp of the issue','Any related task that has also been reset to Pending'],
    conditional: 'This log is persistent on every shipment and runs in parallel to all operational stages. It does not follow a sequential order. If multiple log entries are Pending simultaneously, prioritise those related to customs or carrier release as these are on the critical path.<strong> IMPORTANT:</strong> Always set the Dev Message Log back to Completed (green) once you have addressed the described problem.'
  }
];

/* ── State ─────────────────────────────────────────────────── */
let activeCountry = 'all';
let activeTeam    = 'all';
let selectedTask  = null;

/* ── Constants ─────────────────────────────────────────────── */
const AUTO_ICONS = {
  'full': '⚡', 'api-automated': '🔗', 'recurring': '🔄', 'manual': '✋', 'exception': '⚠️'
};

const TEAM_ICONS = {
  'booking': '📋', 'operations': '🚢', 'documentation': '📄', 'financial': '💰', 'error': '🔔'
};

/* ── Filter Logic ──────────────────────────────────────────── */
function getFilteredTasks() {
  return TASKS.filter(t => {
    if (t.inactive) return false;
    if (activeCountry !== 'all' && !t.scope[activeCountry]) return false;
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

  tasks.forEach(task => {
    const item = document.createElement('div');
    item.className = 'task-item' + (selectedTask && selectedTask.id === task.id ? ' active' : '');
    item.dataset.taskId = task.id;
    item.innerHTML = `
      <div class="task-item-name">${task.task}</div>
      <span class="pill pill-${task.team}" style="font-size:9.5px;padding:2px 7px;">${task.teamLabel.replace('Import ', '')}</span>
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

  const scopeHTML = ['FR', 'DE', 'NL', 'IT', 'PL'].map(c =>
    `<span class="scope-badge ${task.scope[c] ? 'active' : 'inactive'}">${c}</span>`
  ).join('');

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
      <div class="scope-row">${scopeHTML}</div>
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

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderTaskList();
  renderDetail(null);
});
