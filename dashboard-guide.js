/* ============================================================
   GloForEx — Dashboard Guide
   dashboard-guide.js
   ============================================================ */

const STEPS = [
  {
    num: 1,
    title: "Start from the Dashboard",
    desc: "Your daily starting point for all task work in MyFreight.",
    screenshot: "1st",
    hotspots: [
      { num: 1, left: "11%", top: "10%" },
      { num: 2, left: "35%", top: "10%" },
      { num: 3, left: "12%", top: "46%" }
    ],
    callouts: [
      { num: 1, type: "info", text: "<strong>Tasks overdue</strong> — the most important panel. This shows how many tasks are past their due date and need immediate attention. These are shown as red tasks in the dashboard." },
      { num: 2, type: "info", text: "<strong>Tasks pending</strong> — shows the total count of pending (yellow) tasks across all shipments." },
      { num: 3, type: "info", text: "<strong>Task list</strong> — the main working area below the stat panels. This is where you find, filter, and action your tasks." }
    ],
    instruction: "Open MyFreight and navigate to the Dashboard from the top navigation bar. The four stat panels at the top give you an immediate overview of your workload. Focus on <strong>Overdue Tasks</strong> (red) first — these need to be resolved as a priority before working through pending (yellow) or To Do (blue) tasks."
  },
  {
    num: 2,
    title: "Select your Task category",
    desc: "Filter the task list to show only the tasks relevant to this category.",
    screenshot: "2nd",
    hotspots: [
      { num: 1, left: "14%", top: "46%" },
      { num: 2, left: "17%", top: "65%" }
    ],
    callouts: [
      { num: 1, type: "info", text: "<strong>Task category filter</strong> — click the first filter box (labelled with the current task category name) to open this dropdown. Select the task category that matches the type of task you want to search for." },
      { num: 2, type: "info", text: "Available categories: <strong>Import Bookings, Import Documentation, Import Operations, Financial Handling.</strong> Each maps to a specific set of tasks in the process." }
    ],
    instruction: "Click the first filter box on the left of the filter row (it shows the currently active task category name). A dropdown will appear listing all available task categories. Select the one that corresponds to the type of task you are working on (booking, documentation etc.). The task list will immediately refresh to show only tasks assigned to that category."
  },
  {
    num: 3,
    title: "Review open tasks for a specific category",
    desc: "Read the task list and identify which tasks need to be worked on.",
    screenshot: "3rd",
    hotspots: [
      { num: 1, left: "8%",  top: "15%" },
      { num: 2, left: "96%", top: "25%" },
      { num: 3, left: "25%", top: "50%" }
    ],
    callouts: [
      { num: 1, type: "info", text: "<strong>Task name</strong> — The name of the specific task. The Task Reference Guide explains what checks or actions each task requires." },
      { num: 2, type: "info", text: "<strong>Due date</strong> (last column) — tasks shown in red or with a past date are overdue. Sort by due date to prioritise." },
      { num: 3, type: "info", text: "<strong>Departure / Arrival / Customer</strong> — use these columns to understand the shipment context before deciding what to action first." }
    ],
    instruction: "Scan the task list for your task category. The <strong>Due Date</strong> column (far right) is your priority guide — overdue tasks appear with dates in the past and should be actioned first. You can also see departure port, arrival port, load type, customer name, and shipment references to help you triage the list."
  },
  {
    num: 4,
    title: "Important: the 'Unassigned only' checkbox",
    desc: "Always enable this before selecting a task category — it's the most common usage mistake.",
    screenshot: "4th",
    isWarning: true,
    hotspots: [
      { num: "!", warn: true, left: "58%", top: "8%" },
      { num: 1,              left: "48%", top: "8%" },
      { num: 2,              left: "44%", top: "65%" }
    ],
    callouts: [
      { num: "!", type: "warn", text: "<strong>If 'Unassigned only' is not ticked</strong> when you select a task category, MyFreight automatically adds your username to the assignee filter. This means you only see tasks already assigned to you — hiding all unassigned tasks from the list." },
      { num: 1, type: "info", text: "<strong>Correct starting point:</strong> tick 'Unassigned only' before selecting your task category. Your name will appear in the second filter box but will be dimmed — this means it is active as a filter label but is being ignored, because you are specifically searching for unassigned tasks." },
      { num: 2, type: "info", text: "<strong>Result when misconfigured</strong> (shown here): the task list shows 'No data' — not because there are no tasks, but because the assignee filter is hiding them." }
    ],
    instruction: "Before selecting a task category, always check that <strong>'Unassigned only'</strong> is ticked in the top-right of the task section. This ensures you see the full pool of open, unassigned tasks for your task category — which is the correct starting point for daily task work. If the list appears empty after selecting your task category, this is the first thing to check."
  },
  {
    num: 5,
    title: "Assign tasks to yourself or a colleague",
    desc: "Select the tasks you'll work on and assign them via the action bar.",
    screenshot: "5th",
    hotspots: [
      { num: 1, left: "3%",  top: "38%" },
      { num: 2, left: "48%", top: "85%" },
      { num: 3, left: "70%", top: "85%" }
    ],
    callouts: [
      { num: 1, type: "info", text: "<strong>Checkboxes</strong> — tick one or more rows to select tasks. You can select multiple tasks in one go to batch-assign them." },
      { num: 2, type: "info", text: "<strong>Bottom action bar</strong> — appears automatically once at least one task is selected. Shows the count of selected tasks and the available actions." },
      { num: 3, type: "info", text: "<strong>Assignee menu</strong> — click here to assign selected tasks. The menu shows a hierarchy: task category → individual. Navigate to your name or a colleague's name to assign." }
    ],
    instruction: "Tick the checkboxes on the rows you intend to work on. A floating action bar will appear at the bottom of the screen showing how many tasks are selected. Click the assignee area in the action bar to open the task category/person hierarchy, then select your name (or a colleague's) to assign all selected tasks in one action. Once assigned, the tasks will show your name in the Assignee column."
  },
  {
    num: 6,
    title: "Work your assigned tasks",
    desc: "Switch to your personal view and click through to each shipment.",
    screenshot: "6th",
    hotspots: [
      { num: 1, left: "47%", top: "40%" },
      { num: 2, left: "8%",  top: "65%" }
    ],
    callouts: [
      { num: 1, type: "info", text: "Uncheck <strong>'Unassigned only'</strong> — this switches the view to show tasks assigned to you personally, since your name is already in the assignee filter." },
      { num: 2, type: "info", text: "<strong>Click any task row</strong> — this takes you directly to the shipment record in MyFreight where you can perform the required action." },
      { num: 3, type: "info", text: "Not sure what a task requires? Consult the <strong>Task Reference Guide</strong> — it documents the exact action, data to check, and conditions for every task in the process." }
    ],
    instruction: "Once you've assigned tasks to yourself, untick <strong>'Unassigned only'</strong> to switch to your personal task view. Your assigned tasks will now appear in the list. Click on any row to open the shipment directly — MyFreight will take you to the relevant record where you can carry out the required action. Use the Task Reference Guide if you need a reminder of what each task requires before you start."
  }
];

const SCREENSHOTS = ['1st.png', '2nd.png', '3rd.png', '4th.png', '5th.png', '6th.png'];

let current = 0;

function getScreenshotFile(idx) {
  return SCREENSHOTS[idx] || '';
}

function buildDots() {
  const wrap = document.getElementById('progressDots');
  wrap.innerHTML = '';
  STEPS.forEach((s, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i < current ? ' done' : '') + (i === current ? ' active' : '');
    d.title = `Step ${i + 1}: ${s.title}`;
    d.onclick = () => jumpStep(i);
    wrap.appendChild(d);
  });
}

function jumpStep(i) {
  current = i;
  render();
}

function goStep(dir) {
  const next = current + dir;
  if (next < 0 || next > STEPS.length) return;
  current = next;
  render();
}

function render() {
  buildDots();
  document.getElementById('stepCounter').textContent =
    current < STEPS.length ? `Step ${current + 1} of ${STEPS.length}` : 'Complete';

  const btnPrev   = document.getElementById('btnPrev');
  const btnNext   = document.getElementById('btnNext');
  const navRow    = document.getElementById('navRow');
  const container = document.getElementById('stepContainer');

  btnPrev.disabled = current === 0;

  if (current >= STEPS.length) {
    navRow.style.display = 'none';
    container.innerHTML = `
      <div class="completion">
        <div class="completion-card">
          <div class="completion-icon">✅</div>
          <h2 class="completion-title">You're ready to use the Dashboard</h2>
          <p class="completion-text">You've completed the MyFreight Dashboard walkthrough. You now know how to filter tasks by task category, use the Unassigned only setting correctly, assign tasks, and navigate to shipments.</p>
          <div class="completion-steps">
            ${STEPS.map((s, i) => `<div class="recap-item"><div class="recap-num">Step ${i + 1}</div><div class="recap-label">${s.title}</div></div>`).join('')}
          </div>
          <button class="restart-btn" onclick="restartGuide()">↩ Start again</button>
        </div>
      </div>`;
    return;
  }

  navRow.style.display = 'flex';
  const isLast = current === STEPS.length - 1;
  btnNext.textContent = isLast ? 'Finish ✓' : 'Next →';
  btnNext.className = isLast ? 'nav-btn done-btn' : 'nav-btn primary';

  const step = STEPS[current];

  const calloutsHTML = step.callouts.map(c => `
    <div class="callout ${c.type === 'warn' ? 'warn' : ''}">
      <div class="callout-num">${c.num}</div>
      <div class="callout-text">${c.text}</div>
    </div>`).join('');

  let screenshotBlock = '';
  if (step.screenshot) {
    const ordinals = { '1st': 0, '2nd': 1, '3rd': 2, '4th': 3, '5th': 4, '6th': 5 };
    const imgIdx = ordinals[step.screenshot];
    const hotspotsHTML = (step.hotspots || []).map(h =>
      `<div class="hotspot-num${h.warn ? ' warn' : ''}" style="left:${h.left};top:${h.top}">${h.num}</div>`
    ).join('');
    screenshotBlock = `
      <div class="screenshot-area">
        <div class="screenshot-frame" style="position:relative;">
          <img src="${getScreenshotFile(imgIdx)}"
               alt="Step ${step.num} screenshot"
               data-hotspots="${encodeURIComponent(JSON.stringify(step.hotspots || []))}"
               onclick="openLightbox(this.src, JSON.parse(decodeURIComponent(this.dataset.hotspots)))"
               onerror="this.style.display='none';this.parentNode.style.background='#1a2236';this.parentNode.style.minHeight='180px';" />
          ${hotspotsHTML}
        </div>
      </div>`;
  }

  const warningBlock = step.isWarning ? `
    <div class="warning-box">
      <div class="warning-icon">⚠️</div>
      <div class="warning-text">
        <strong>Common mistake:</strong> if you select a task category without ticking <strong>'Unassigned only'</strong> first, MyFreight adds your username to the assignee filter automatically — hiding all unassigned tasks and showing you only your own. Always tick this setting first.
      </div>
    </div>` : '';

  container.innerHTML = `
    <div class="step-card">
      <div class="step-header">
        <div class="step-num">${step.num}</div>
        <div class="step-header-text">
          <div class="step-title">${step.title}</div>
          <div class="step-desc">${step.desc}</div>
        </div>
      </div>
      ${screenshotBlock}
      <div class="callouts">${calloutsHTML}</div>
      <div class="instruction">
        <div class="instruction-label">What to do</div>
        <div class="instruction-text">${step.instruction}</div>
      </div>
      ${warningBlock}
    </div>`;
}

function restartGuide() {
  current = 0;
  document.getElementById('navRow').style.display = 'flex';
  render();
}

/* ── Lightbox ── */
window.openLightbox = function(src, hotspots) {
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');

  if (!hotspots || hotspots.length === 0) {
    lbImg.src = src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    return;
  }

  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    hotspots.forEach(h => {
      const x = parseFloat(h.left) / 100 * canvas.width;
      const y = parseFloat(h.top)  / 100 * canvas.height;
      const r = Math.round(canvas.width * 0.01);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = h.warn ? '#F5A623' : '#0073FF';
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(r * 1.1)}px Montserrat, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(h.num), x, y);
    });

    lbImg.src = canvas.toDataURL('image/png');
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  img.src = src;
}

window.closeLightbox = function(e) {
  if (e && e.target === document.getElementById('lightbox-img')) return;
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  render();
});
