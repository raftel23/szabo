// ui.js - DOM Manipulation and Event Handling
import { DB } from './db.js';

// --- Icons (SVG Constants) ---
const ICONS = {
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  pencil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`,
  bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4c0 1.25-.5 2.45-1.5 3.5L10 15z"></path><path d="M9 21h6M9 18h6"></path></svg>`,
  trendingUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
  trendingDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"></path></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  eyeActive: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
  shopping: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
  coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
  transport: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="22" height="13" rx="2" ry="2"></rect><line x1="1" y1="8" x2="23" y2="8"></line><path d="M7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path><path d="M17 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></svg>`,
  repeat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>`,
  utils: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
};

// --- State ---
let wallets = [];
let transactions = [];
let previousView = 'dashboard';
let editWalletId = null;
let editCategoryName = null;
let editBudgetId = null;
let categories = [];
let budgets = [];
let goals = [];
let netWorthVisible = localStorage.getItem('szabo_nw_visible') !== 'false'; // Default to true
let activeDashboardTab = 'summary'; // New v1.1.0 state: summary | wallets | budgets

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('is-closing');
  modalEl.addEventListener('animationend', () => {
    modalEl.style.display = 'none';
    modalEl.classList.remove('is-closing');
  }, { once: true });
}

// --- Init UI ---
export async function initUI() {
  bindNavigation();
  bindForms();
  bindTypeSelector();
  bindExport();
  bindFAB();
  bindBudgetForm();
  bindGoalForm();
  bindHelp(); // v1.2.5
  initTheme();
  initDashboardToggles();
  initNetWorthVisibility();
  initDashboardTabs(); // v1.1.0
  bindCategoryForm(); // v1.1.0
  initLedgerFilters(); // v1.1.0
  bindMoreMenu(); // v1.2.0
  initAnalyticsControls(); // v1.2.0
  initDashboardTrendsControls(); // v1.2.0: Isolated Dashboard trends

  const btnCloseModal = document.getElementById('btn-close-tx-modal');
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      closeModal(document.getElementById('tx-modal'));
    });
  }

  // Load Initial Data
  await refreshData();
}

function bindGoalForm() {
  const form = document.getElementById('add-goal-form');
  const hasDeadlineInput = document.getElementById('goal-has-deadline');
  const deadlineInput = document.getElementById('goal-deadline');

  if (hasDeadlineInput && deadlineInput) {
    hasDeadlineInput.addEventListener('change', (e) => {
      deadlineInput.style.display = e.target.checked ? 'block' : 'none';
      if (!e.target.checked) deadlineInput.value = '';
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-goal-id').value;
      const name = document.getElementById('goal-name').value;
      const note = document.getElementById('goal-note').value;
      const targetAmount = parseFloat(document.getElementById('goal-target').value) || 0;
      const currentAmount = parseFloat(document.getElementById('goal-current').value) || 0;
      const deadline = hasDeadlineInput?.checked ? deadlineInput.value : null;
      
      if (id) {
        const existing = goals.find(g => g.id === id);
        if (existing) {
          existing.name = name;
          existing.note = note;
          existing.targetAmount = targetAmount;
          existing.currentAmount = currentAmount;
          existing.deadline = deadline;
          await DB.updateGoal(existing);
        }
      } else {
        await DB.addGoal({ name, note, targetAmount, currentAmount, deadline });
      }

      document.getElementById('edit-goal-id').value = '';
      form.reset();
      if(deadlineInput) deadlineInput.style.display = 'none';
      form.querySelector('button[type="submit"]').textContent = 'Save Goal';
      const btnCancel = document.getElementById('btn-cancel-goal');
      if(btnCancel) btnCancel.textContent = 'Clear';

      await refreshData();
    });
  }

  const btnCancel = document.getElementById('btn-cancel-goal');
  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      if(form) form.reset();
      document.getElementById('edit-goal-id').value = '';
      form.querySelector('button[type="submit"]').textContent = 'Save Goal';
      btnCancel.textContent = 'Clear';
      if(deadlineInput) deadlineInput.style.display = 'none';
    });
  }

  // Modals
  const fundModal = document.getElementById('fund-goal-modal');
  const btnCloseFund = document.getElementById('btn-close-fund-modal');
  const fundForm = document.getElementById('fund-goal-form');

  if (btnCloseFund && fundModal) {
    btnCloseFund.addEventListener('click', () => {
      closeModal(fundModal);
    });
    fundModal.addEventListener('click', (e) => {
      if (e.target === fundModal) closeModal(fundModal);
    });
  }

  // History Modal
  const historyModal = document.getElementById('goal-history-modal');
  const btnCloseHistory = document.getElementById('btn-close-history-modal');

  if (btnCloseHistory && historyModal) {
    btnCloseHistory.addEventListener('click', () => {
      closeModal(historyModal);
    });
    historyModal.addEventListener('click', (e) => {
      if (e.target === historyModal) closeModal(historyModal);
    });
  }

  if (fundForm && fundModal) {
    fundForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('fund-goal-id').value;
      const amtToAdd = parseFloat(document.getElementById('fund-amount').value) || 0;
      const goal = goals.find(g => g.id === id);
      if (goal) {
        goal.currentAmount += amtToAdd;
        await DB.updateGoal(goal);
        
        // Log History
        await DB.addGoalHistory({
          goal_id: id,
          amount: amtToAdd,
          date: new Date().toISOString()
        });

        closeModal(fundModal);
        fundForm.reset();
        await refreshData();
      }
    });
  }
}

window.openFundModal = function openFundModal(id) {
  const inputId = document.getElementById('fund-goal-id');
  const modal = document.getElementById('fund-goal-modal');
  const amountObj = document.getElementById('fund-amount');
  if (inputId && modal) {
    inputId.value = id;
    modal.style.display = 'flex';
    if(amountObj) amountObj.focus();
  }
}

window.editGoal = function editGoal(id) {
  const g = goals.find(x => x.id === id);
  if (!g) return;
  
  // Switch to Goals Tab on Dashboard
  const goalsTab = document.querySelector('.card-tab[data-tab="goals"]');
  if (goalsTab) goalsTab.click();

  // Populate Dashboard Card Form
  const editIdEl = document.getElementById('edit-goal-id');
  const nameEl = document.getElementById('goal-name');
  const noteEl = document.getElementById('goal-note');
  const tAmtEl = document.getElementById('goal-target');
  const cAmtEl = document.getElementById('goal-current');
  const hasDlEl = document.getElementById('goal-has-deadline');
  const dlEl = document.getElementById('goal-deadline');
  
  if (editIdEl) editIdEl.value = g.id;
  if (nameEl) nameEl.value = g.name;
  if (noteEl) noteEl.value = g.note || '';
  if (tAmtEl) tAmtEl.value = g.targetAmount;
  if (cAmtEl) cAmtEl.value = g.currentAmount;
  
  if (hasDlEl && dlEl) {
    if (g.deadline) {
      hasDlEl.checked = true;
      dlEl.value = g.deadline;
      dlEl.style.display = 'block';
    } else {
      hasDlEl.checked = false;
      dlEl.value = '';
      dlEl.style.display = 'none';
    }
  }
  
  // Update Button Text
  const submitBtn = document.querySelector('#tab-goals button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'Update Goal';
  const cancelBtn = document.getElementById('btn-cancel-goal');
  if (cancelBtn) cancelBtn.textContent = 'Cancel';
  
  // Scroll to form
  document.querySelector('.net-worth-card').scrollIntoView({ behavior: 'smooth' });
}

window.openGoalHistoryModal = async function openGoalHistoryModal(id) {
  const g = goals.find(x => x.id === id);
  if (!g) return;

  const modal = document.getElementById('goal-history-modal');
  const title = document.getElementById('goal-history-title');
  const list = document.getElementById('goal-history-list');

  if (!modal || !list) return;

  title.textContent = `${g.name} - History`;
  list.innerHTML = '<p class="text-muted" style="text-align:center; padding: 20px;">Loading history...</p>';
  modal.style.display = 'flex';

  const history = await DB.getGoalHistory(id);
  // Sort DESC date
  history.sort((a,b) => new Date(b.date) - new Date(a.date));

  if (history.length === 0) {
    list.innerHTML = '<p class="text-muted" style="text-align:center; padding: 20px;">No funding history recorded yet.</p>';
    return;
  }

  list.innerHTML = '';
  history.forEach(h => {
    const item = document.createElement('div');
    item.className = 'glass-card';
    item.style.padding = '12px 16px';
    item.style.margin = '0';
    item.style.display = 'flex';
    item.style.justifyContent = 'space-between';
    item.style.alignItems = 'center';
    
    const d = new Date(h.date);
    const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    item.innerHTML = `
      <div style="display:flex; flex-direction:column;">
        <span style="font-size: 14px; font-weight:600;">Funded</span>
        <span style="font-size: 11px; opacity: 0.6;">${dateStr} • ${timeStr}</span>
      </div>
      <span style="font-size: 16px; font-weight:700; color:var(--success);">+ ${formatMoney(h.amount)}</span>
    `;
    list.appendChild(item);
  });

  // Prepend Goal Note if exists
  if (g.note) {
    const noteEl = document.createElement('div');
    noteEl.className = 'insight-card insight-blue';
    noteEl.style.padding = '12px 16px';
    noteEl.style.marginBottom = '20px';
    noteEl.style.borderRadius = '14px';
    noteEl.innerHTML = `
      <div class="insight-icon" style="width: 24px; height: 24px;">${ICONS.bulb}</div>
      <div class="insight-content">
        <h4 style="font-size: 12px; font-weight: 700; margin-bottom: 2px;">GOAL NOTE</h4>
        <p style="font-size: 12px; font-style: italic; color: var(--system-text); opacity: 0.8;">"${g.note}"</p>
      </div>
    `;
    list.prepend(noteEl);
  }

  // Add Predictive Analysis Card
  const predictionCard = renderPredictiveInsight(history, g);
  if (predictionCard) {
    list.prepend(predictionCard);
  }
}

function renderPredictiveInsight(history, goal) {
  if (history.length < 2) return null;
  if (goal.currentAmount >= goal.targetAmount) return null;

  // History is DESC (newest first)
  const newest = history[0];
  const oldest = history[history.length - 1];
  const timeSpanMs = new Date(newest.date) - new Date(oldest.date);
  const timeSpanDays = Math.max(1, timeSpanMs / (1000 * 60 * 60 * 24));

  // Calculate pace excluding the first entry's value?
  // Logic: User had some initial, then added X over Y days.
  const totalAddedSinceStart = history.slice(0, history.length - 1).reduce((sum, h) => sum + h.amount, 0);
  const dailyPace = totalAddedSinceStart / timeSpanDays;
  
  if (dailyPace <= 0) return null;

  const remaining = goal.targetAmount - goal.currentAmount;
  const daysToFinish = Math.ceil(remaining / dailyPace);
  const projectedFinish = new Date();
  projectedFinish.setDate(projectedFinish.getDate() + daysToFinish);

  let statusHtml = '';
  let type = 'blue';
  
  if (goal.deadline) {
    const deadlineDate = new Date(goal.deadline);
    const diffDays = (deadlineDate - projectedFinish) / (1000 * 60 * 60 * 24);
    
    if (diffDays < -1) {
      type = 'red';
      statusHtml = `<span style="color: var(--danger); font-weight: 800; font-size: 10px; margin-top: 4px;">⚠️ BEHIND SCHEDULE (~${Math.abs(Math.floor(diffDays))} days late)</span>`;
    } else if (diffDays < 7) {
      type = 'yellow';
      statusHtml = `<span style="color: var(--warning); font-weight: 800; font-size: 10px; margin-top: 4px;">⏳ DELAY RISK (Finishing very close to deadline)</span>`;
    } else {
      type = 'green';
      statusHtml = `<span style="color: var(--success); font-weight: 800; font-size: 10px; margin-top: 4px;">✅ ON TRACK (Ahead of target)</span>`;
    }
  }

  const card = document.createElement('div');
  card.className = `insight-card insight-${type}`;
  card.style.padding = '14px 16px';
  card.style.marginBottom = '20px';
  card.style.borderRadius = '14px';
  card.style.background = type === 'red' ? 'rgba(255, 69, 58, 0.05)' : (type === 'green' ? 'rgba(52, 199, 89, 0.05)' : 'rgba(0, 122, 255, 0.05)');
  
  const useDaily = timeSpanDays < 7 || daysToFinish < 7;
  const paceText = useDaily ? `₱${formatMoney(dailyPace)}/day` : `₱${formatMoney(dailyPace * 7)}/week`;

  card.innerHTML = `
    <div class="insight-icon" style="width: 32px; height: 32px; border-radius: 50%; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">${ICONS.star}</div>
    <div class="insight-content">
      <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 2px;">SZABO PREDICTION ADVISE</h4>
      <p style="font-size: 12px; line-height: 1.4; color: var(--system-text);">
        Based on your pace of <b>${paceText}</b>, you are projected to reach your goal 
        <b>${(() => {
          const now = new Date();
          const isThisMonth = projectedFinish.getMonth() === now.getMonth() && projectedFinish.getFullYear() === now.getFullYear();
          if (isThisMonth) return "this month";
          return "by " + projectedFinish.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        })()}</b>.
      </p>
      ${statusHtml}
    </div>
  `;
  return card;
}

function renderGoals() {
  const list = document.getElementById('settings-goals-list');
  const insightsContainer = document.getElementById('goal-insights-container');
  if (!list) return;
  list.innerHTML = '';
  if (insightsContainer) insightsContainer.innerHTML = '';
  
  if (goals.length === 0) {
    if (activeDashboardTab === 'goals') {
      list.innerHTML = '<p class="text-muted" style="padding: 10px;">No goals yet. Start tracking a new milestone above.</p>';
    }
    return;
  }

  // Generate Smart Goal Insight
  if (insightsContainer && activeDashboardTab === 'goals') {
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalPct = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
    
    let insight = null;

    // Check for Velocity Alerts first (Priority)
    const overdueGoals = goals.filter(g => g.deadline && new Date(g.deadline) < new Date() && g.currentAmount < g.targetAmount);
    const timeRelevantGoals = goals.filter(g => g.deadline && new Date(g.deadline) >= new Date() && g.currentAmount < g.targetAmount).map(g => {
      const remaining = g.targetAmount - g.currentAmount;
      const days = Math.max(1, Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24)));
      const velocity = remaining / (days / 7); // weekly requirement
      return { ...g, velocity, daysRemaining: days };
    }).sort((a,b) => (a.daysRemaining / a.targetAmount) - (b.daysRemaining / b.targetAmount));

    if (overdueGoals.length > 0) {
      insight = { title: 'Overdue Milestone', text: `Target date for "${overdueGoals[0].name}" has passed. Consider refactoring your timeline.`, type: 'red', icon: ICONS.warning };
    } else if (timeRelevantGoals.length > 0 && timeRelevantGoals[0].daysRemaining <= 7) {
      const g = timeRelevantGoals[0];
      const daily = (g.targetAmount - g.currentAmount) / g.daysRemaining;
      insight = { title: 'Imminent Deadline', text: `"${g.name}" is due in ${g.daysRemaining} days. You need ₱${formatMoney(daily)}/day to finish on time.`, type: 'yellow', icon: ICONS.clock };
    } else if (totalPct >= 100) {
      insight = { title: 'All Targets Reached', text: 'Stunning discipline! You have fully funded all your active goals.', type: 'green', icon: ICONS.star };
    } else if (totalPct >= 50 && goals.length > 1) {
      insight = { title: 'Halfway to Dreams', text: `You are ${totalPct.toFixed(0)}% across all your savings milestones. Keep the momentum going!`, type: 'blue', icon: ICONS.trendingUp };
    } else {
      const sorted = [...goals].sort((a,b) => {
        const pA = a.targetAmount > 0 ? a.currentAmount/a.targetAmount : 0;
        const pB = b.targetAmount > 0 ? b.currentAmount/b.targetAmount : 0;
        return pB - pA;
      });
      const closest = sorted.filter(g => g.currentAmount < g.targetAmount)[0];
      if (closest) {
        const remaining = closest.targetAmount - closest.currentAmount;
        insight = { title: 'Goal in Sight', text: `You are just ₱${formatMoney(remaining)} away from finishing "${closest.name}".`, type: 'yellow', icon: ICONS.bulb };
      }
    }

    if (insight) {
      const card = document.createElement('div');
      const animClass = insight.type === 'yellow' ? 'pulse-yellow' : (insight.type === 'green' ? 'pulse-green' : '');
      card.className = `insight-card insight-${insight.type} ${animClass}`;
      card.style.margin = '0';
      card.style.padding = '12px';
      card.style.borderRadius = '16px';
      card.innerHTML = `
        <div class="insight-icon" style="width: 32px; height: 32px;">${insight.icon}</div>
        <div class="insight-content">
          <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 2px;">${insight.title}</h4>
          <p style="font-size: 11px; line-height: 1.3;">${insight.text}</p>
        </div>
      `;
      insightsContainer.appendChild(card);
    }
  }

  goals.forEach(g => {
    const card = document.createElement('div');
    card.className = 'glass-card goal-card-clickable';
    card.style.padding = '16px';
    card.style.position = 'relative';
    card.style.marginBottom = '12px';
    card.style.cursor = 'pointer';
    
    // Calculate percentage correctly with a maximum cap of 100
    const pctRaw = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 100;
    const pct = Math.min(Math.max(pctRaw, 0), 100).toFixed(1);
    const isCompleted = g.currentAmount >= g.targetAmount;

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: stretch; margin-bottom: 8px;">
        <div style="display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1;">
          <span style="font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;" title="${g.name}">${g.name} ${isCompleted ? '🎉' : ''}</span>
          <span style="font-size: 11px; opacity: 0.7;">${formatMoney(g.currentAmount)} / ${formatMoney(g.targetAmount)}</span>
          ${g.deadline ? (() => {
            const isOverdue = new Date(g.deadline) < new Date();
            const remaining = g.targetAmount - g.currentAmount;
            const contentColor = isOverdue && remaining > 0 ? 'var(--system-red)' : 'inherit';
            const days = Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            
            let velocityText = '';
            if (remaining > 0) {
              if (isOverdue) velocityText = 'Overdue';
              else if (days < 2) velocityText = 'Due Soon';
              else if (days <= 7) velocityText = `₱${formatMoney(remaining / days)}/day needed`;
              else velocityText = `₱${formatMoney(remaining / (days / 7))}/week needed`;
            }

            return `
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px; overflow: hidden; color: ${contentColor};">
                <span style="font-size: 10px; opacity: 0.7; display: flex; align-items: center; gap: 4px; white-space: nowrap;">🎯 ${new Date(g.deadline).toLocaleDateString()}</span>
                ${velocityText ? `<span style="font-size: 10px; font-weight: 700; opacity: 0.9; background: rgba(0,0,0,0.05); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">${velocityText}</span>` : ''}
              </div>
            `;
          })() : ''}
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; justify-content: space-between; align-items: flex-end; flex-shrink: 0; padding-left: 8px;">
          <div style="display: flex; gap: 8px;">
            <button class="edit-btn" style="background: none; border: none; color: var(--system-accent); cursor: pointer; padding: 0 4px; display: flex; align-items: center; justify-content: center;">
              <span style="width: 18px; height: 18px; display: block;">${ICONS.pencil}</span>
            </button>
            <button class="del-btn" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 0 4px; display: flex; align-items: center; justify-content: center;">
              <span style="width: 18px; height: 18px; display: block;">${ICONS.trash}</span>
            </button>
          </div>
          <button class="fund-btn" style="background: rgba(255, 255, 255, 0.1); border: 1.5px solid var(--system-accent); color: var(--system-accent); font-weight: 600; cursor: pointer; border-radius: 8px; padding: 4px 10px; font-size: 11px;">+ Fund</button>
        </div>
      </div>
      <div style="width: 100%; height: 8px; background: rgba(var(--system-card-rgb), 0.2); border-radius: 4px; overflow: hidden; margin-top: 8px;">
        <div class="progress-glow-bar" style="height: 100%; width: ${pct}%; background: ${isCompleted ? '#34C759' : '#007AFF'}; border-radius: 4px; transition: width 0.3s;"></div>
      </div>
      <div style="text-align: right; margin-top: 4px;"><span style="font-size: 10px; opacity: 0.8; font-weight: 700; color: ${isCompleted ? '#34C759' : 'inherit'}">${Math.floor(pctRaw)}%</span></div>
    `;

    card.addEventListener('click', (e) => {
      // Don't trigger if a button was clicked
      if (e.target.closest('button')) return;
      openGoalHistoryModal(g.id);
    });

    card.querySelector('.fund-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openFundModal(g.id);
    });
    card.querySelector('.edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      editGoal(g.id);
    });
    card.querySelector('.del-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm(`Delete the goal "${g.name}"?`)) {
        await DB.deleteGoal(g.id);
        await refreshData();
      }
    });

    list.appendChild(card);
  });
}


async function refreshData() {
  wallets = await DB.getWallets();
  transactions = await DB.getTransactions();
  budgets = await DB.getBudgets();
  goals = await DB.getGoals();
  try {
    categories = await DB.getCategories();
    const defaults = [
      { name: 'Paycheck', description: 'Monthly salary or income', type: 'income', isDefault: true },
      { name: 'Food', description: 'Groceries, restaurants, snacks', type: 'expense', isDefault: true },
      { name: 'Transport', description: 'Gas, transit, repairs', type: 'expense', isDefault: true },
      { name: 'Utilities', description: 'Water, electricity, internet', type: 'expense', isDefault: true },
      { name: 'Entertainment', description: 'Movies, games, hobbies', type: 'expense', isDefault: true },
      { name: 'Shopping', description: 'Clothes, electronics, gifts', type: 'expense', isDefault: true }
    ];

    categories = await DB.getCategories();
    let updated = false;
    for (const d of defaults) {
      if (!categories.find(c => c.name === d.name)) {
        await DB.addCategory(d);
        updated = true;
      }
    }
    if (updated) {
      categories = await DB.getCategories();
    }
  } catch(e) {
    categories = [];
  }

  // Sort DESC date
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  renderWallets();
  renderWalletSelects();
  renderDashboard();
  renderLedger();
  renderAnalytics();
  renderCategories();
  renderBudgets();
  renderGoals();
  updateCategoryDatalist();
  updateBudgetCategorySelect();
}

// --- Navigation ---
function bindNavigation() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      
      const centerBtn = document.getElementById('nav-btn-add');
      const iconWrap = centerBtn?.querySelector('.icon');

      if (targetId === 'add') {
        const isCurrentlyAdd = document.getElementById('view-add').classList.contains('active');
        if (isCurrentlyAdd) {
          document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
          document.getElementById(`view-${previousView}`).classList.add('active');
          document.querySelector(`.nav-link[data-target="${previousView}"]`)?.classList.add('active');
          if (iconWrap) iconWrap.innerHTML = ICONS.plus;
          centerBtn.classList.remove('is-active');
        } else {
          document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
          document.getElementById('view-add').classList.add('active');
          links.forEach(l => l.classList.remove('active'));
          if (iconWrap) iconWrap.innerHTML = ICONS.close;
          centerBtn.classList.add('is-active');
        }
        return;
      }

      // Standard Navigation
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      if (centerBtn) {
        centerBtn.classList.remove('is-active');
        if (iconWrap) iconWrap.innerHTML = ICONS.plus;
      }

      const targetView = document.getElementById(`view-${targetId}`);
      if (targetView) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        targetView.classList.add('active');
        previousView = targetId;
      }

      // v1.2.0 Specific Refresh Logic
      if (targetId === 'analytics') renderAnalytics();
      if (targetId === 'dashboard') {
        const firstTab = document.querySelector('.dashboard-tab');
        if (firstTab) firstTab.click();
      }
    });
  });
}

function bindMoreMenu() {
  const menuItems = document.querySelectorAll('#view-more .menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.getAttribute('data-target');
      const section = document.getElementById(`view-${target}`);
      if (section) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        section.classList.add('active');
        previousView = target;
      }
    });
  });
}

function initAnalyticsControls() {
  const periodBtns = document.querySelectorAll('#main-analytics-period-btns .card-tab');
  periodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      periodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAnalytics();
    });
  });

  const modeSelect = document.getElementById('main-analytics-mode');
  if (modeSelect) modeSelect.addEventListener('change', renderAnalytics);
}

function initDashboardTrendsControls() {
  const periodBtns = document.querySelectorAll('#dashboard-period-btns .period-btn');
  periodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      periodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderDashboardTrends();
    });
  });

  const modeSelect = document.getElementById('dashboard-analytics-mode');
  if (modeSelect) modeSelect.addEventListener('change', renderDashboardTrends);
}

function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme') || 'light';
  
  if (storedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.checked = true;
  }

  if (themeToggle) {
    themeToggle.addEventListener('change', (e) => {
      const isDark = e.target.checked;
      const newTheme = isDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

function initDashboardToggles() {
  const sections = [
    { btnId: 'btn-toggle-insights', containerId: 'dashboard-insights-container', storageKey: 'insights-hidden' },
    { btnId: 'btn-toggle-activity', containerId: 'dashboard-recent-list', storageKey: 'activity-hidden' },
    { btnId: 'btn-toggle-categories', containerId: 'settings-categories-wrapper', storageKey: 'categories-hidden' }
  ];

  sections.forEach(({ btnId, containerId, storageKey }) => {
    const btn = document.getElementById(btnId);
    const container = document.getElementById(containerId);
    if (!btn || !container) return;

    const isHidden = localStorage.getItem(storageKey) === 'true';
    if (isHidden) {
      container.style.height = '0';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      container.style.overflow = 'hidden';
      btn.textContent = 'Show';
    }

    btn.addEventListener('click', () => {
      const isActuallyHidden = container.style.height === '0px' || container.style.height === '0';
      if (isActuallyHidden) {
        container.style.height = 'auto';
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
        container.style.overflow = 'visible';
        btn.textContent = 'Hide';
        localStorage.setItem(storageKey, 'false');
      } else {
        container.style.height = '0';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
        container.style.overflow = 'hidden';
        btn.textContent = 'Show';
        localStorage.setItem(storageKey, 'true');
      }
    });
  });
}

function initNetWorthVisibility() {
  const btn = document.getElementById('btn-toggle-nw-visibility');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    netWorthVisible = !netWorthVisible;
    localStorage.setItem('szabo_nw_visible', netWorthVisible);
    renderDashboard();
  });
}

function bindFAB() {
  const fab = document.getElementById('global-fab');
  if (!fab) return;
  
  fab.addEventListener('click', () => {
    const activeView = document.querySelector('.view.active').id;
    
    if (activeView === 'view-categories') {
      // For categories, scroll to top form
      const form = document.getElementById('add-category-form');
      if (form) form.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Default: Go to Add view
      const addLink = document.querySelector('.nav-link[data-target="add"]');
      if (addLink) addLink.click();
    }
  });
}

// --- Forms ---
function bindForms() {
  // 1. Integrated Wallet Form (Dashboard Blue Card)
  const addWalletForm = document.getElementById('add-wallet-form');
  if (addWalletForm) {
    addWalletForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-wallet-id').value;
      const name = document.getElementById('wallet-name').value;
      const balance = parseFloat(document.getElementById('wallet-balance').value) || 0;
      
      if (id) {
        await DB.updateWallet({ id, name, balance });
      } else {
        await DB.addWallet({ name, balance });
      }
      
      document.getElementById('edit-wallet-id').value = '';
      addWalletForm.reset();
      addWalletForm.querySelector('button[type="submit"]').textContent = 'Save Wallet';
      document.getElementById('btn-cancel-wallet').textContent = 'Clear';
      
      await refreshData();
      renderWallets();
    });
  }

  // Wallet Cancel
  const btnCancelWallet = document.getElementById('btn-cancel-wallet');
  if (btnCancelWallet) {
    btnCancelWallet.addEventListener('click', () => {
      const form = document.getElementById('add-wallet-form');
      form.reset();
      document.getElementById('edit-wallet-id').value = '';
      form.querySelector('button[type="submit"]').textContent = 'Save Wallet';
      btnCancelWallet.textContent = 'Clear';
      // Stay on the current tab (Wallets)
    });
  }

  // 2. Category Form (Handled by bindCategoryForm in initUI)

  // 3. Add Transaction Form
  const addTxForm = document.getElementById('add-transaction-form');
  if (addTxForm) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('trans-date').value = now.toISOString().slice(0,16);

    addTxForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const activeTypeBtn = document.querySelector('#add-tx-type-selector .period-btn.active');
      const type = activeTypeBtn ? activeTypeBtn.getAttribute('data-value') : 'expense';
      const amount = parseFloat(document.getElementById('trans-amount').value);
      const wallet_id = document.getElementById('trans-wallet').value;
      const date = document.getElementById('trans-date').value;
      const note = document.getElementById('trans-note').value;
      
      const tx = { amount, wallet_id, date, note, type };
      
      if (type === 'transfer') {
        tx.wallet_to = document.getElementById('trans-wallet-to').value;
        if (tx.wallet_to === wallet_id) {
          alert("Cannot transfer to the same wallet.");
          return;
        }
        tx.category = 'Transfer';
      } else {
        tx.category = document.getElementById('trans-category').value || 'Uncategorized';
      }

      try {
        await DB.addTransaction(tx);
        addTxForm.reset();
        document.getElementById('trans-date').value = new Date().toISOString().slice(0,16);
        document.querySelector('.nav-link[data-target="dashboard"]').click();
        await refreshData();
      } catch(err) {
        alert("Error adding transaction.");
        console.error(err);
      }
    });
  }

  // 4. Ledger & Analytics Controls
  const ledgerFilter = document.getElementById('ledger-wallet-filter');
  if (ledgerFilter) ledgerFilter.addEventListener('change', renderLedger);
  const ledgerSearch = document.getElementById('ledger-search');
  if (ledgerSearch) ledgerSearch.addEventListener('input', renderLedger);

  const analyticsPeriodBtns = document.querySelectorAll('#analytics-period-btns .period-btn');
  analyticsPeriodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      analyticsPeriodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAnalytics();
    });
  });

  const analyticsMode = document.getElementById('analytics-mode');
  if (analyticsMode) analyticsMode.addEventListener('change', renderAnalytics);

  // 5. Data Restore
  const restoreFile = document.getElementById('restore-file');
  const restoreTrigger = document.getElementById('btn-restore-trigger');
  if (restoreFile && restoreTrigger) {
    restoreFile.addEventListener('change', (e) => {
      restoreTrigger.style.display = e.target.files[0] ? 'block' : 'none';
    });

    restoreTrigger.addEventListener('click', async () => {
      const file = restoreFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (!confirm("This will overwrite your current data. Proceed?")) return;
          await DB.restoreData(data);
          restoreFile.value = '';
          restoreTrigger.style.display = 'none';
          alert("Restore complete!");
          document.querySelector('.nav-link[data-target="dashboard"]').click();
          await refreshData();
        } catch(err) {
          alert("Error: " + err.message);
        }
      };
      reader.readAsText(file);
    });
  }
}

function bindTypeSelector() {
  const container = document.getElementById('add-tx-type-selector');
  if (!container) return;

  const buttons = container.querySelectorAll('.period-btn');
  const transferGroup = document.getElementById('transfer-to-group');
  const catGroup = document.getElementById('category-group');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update UI active classes
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const val = btn.getAttribute('data-value');
      if (val === 'transfer') {
        if (transferGroup) transferGroup.style.display = 'flex';
        if (catGroup) catGroup.style.display = 'none';
      } else {
        if (transferGroup) transferGroup.style.display = 'none';
        if (catGroup) catGroup.style.display = 'flex';
        // v1.1.0: Dynamically filter category suggestions
        updateCategoryDatalist(val);
      }
    });
  });
}

function bindExport() {
  const btn = document.getElementById('btn-export');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    const data = { wallets, transactions, budgets, categories, goals };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `szabo_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Provide Tactile Feedback
    const originalText = btn.textContent;
    btn.textContent = 'Exported! ✅';
    btn.style.color = '#34C759';
    btn.style.borderColor = '#34C759';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  });

  const btnCSV = document.getElementById('btn-export-csv');
  if (btnCSV) {
    btnCSV.addEventListener('click', () => {
      exportToCSV();
    });
  }
}

async function exportToCSV() {
  const headers = ['Date', 'Type', 'Category', 'Wallet', 'Amount', 'Note'];
  const rows = transactions.map(tx => [
    new Date(tx.date).toLocaleDateString() + ' ' + new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    tx.type.toUpperCase(),
    tx.category,
    getWalletName(tx.wallet_id),
    tx.amount.toFixed(2),
    (tx.note || '').replace(/,/g, ';') // Escape commas
  ]);

  let csvContent = headers.join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `szabo_audit_${new Date().toISOString().split('T')[0]}.csv`);
  a.click();
  URL.revokeObjectURL(url);
}

// --- Render Functions ---
function getWalletName(id) {
  const w = wallets.find(x => x.id === id);
  return w ? w.name : 'Unknown';
}

function formatMoney(num, type) {
  const absNum = Math.abs(num);
  const formatted = '₱' + absNum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (type === 'expense') return '−' + formatted; // Using true minus sign
  if (type === 'income') return '+' + formatted;
  return formatted;
}

function renderWallets() {
  const list = document.getElementById('wallets-list');
  if (!list) return;
  list.innerHTML = '';
  
  if (wallets.length === 0) {
    if (activeDashboardTab === 'wallets') {
      list.innerHTML = '<p class="text-muted" style="padding: 10px;">No wallets yet. Use the form above to create one.</p>';
    }
    return;
  }

  wallets.forEach(w => {
    const card = document.createElement('div');
    card.className = 'glass-card wallet-card';
    card.style.padding = '16px';
    card.style.position = 'relative';
    card.style.background = 'rgba(var(--system-card-rgb), 0.6)';
    card.style.marginBottom = '12px';
    
    card.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 13px; font-weight: 500; color: var(--system-text-muted);">${w.name}</span>
        <span style="font-size: 20px; font-weight: 700; color: var(--system-text);">${formatMoney(w.balance)}</span>
      </div>
      <div style="position: absolute; top: 12px; right: 12px; display: flex; gap: 8px;">
        <button class="edit-wallet-btn" style="background: none; border: none; color: var(--system-accent); cursor: pointer; padding: 4px;">${ICONS.pencil}</button>
        <button class="delete-wallet-btn btn-delete" style="padding: 4px;">${ICONS.trash}</button>
      </div>
    `;

    card.querySelector('.edit-wallet-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      editWallet(w.id);
    });

    card.querySelector('.delete-wallet-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm(`Delete ${w.name}? This will NOT delete transactions linked to it.`)) {
        await DB.deleteWallet(w.id);
        await refreshData();
        renderWallets();
      }
    });

    list.appendChild(card);
  });
}

function editWallet(id) {
  const w = wallets.find(x => x.id === id);
  if (!w) return;
  
  // Switch to Wallet Tab on Dashboard
  const walletTab = document.querySelector('.card-tab[data-tab="wallets"]');
  if (walletTab) walletTab.click();

  // Populate Dashboard Card Form
  const editIdEl = document.getElementById('edit-wallet-id');
  const nameEl = document.getElementById('wallet-name');
  const balEl = document.getElementById('wallet-balance');
  
  if (editIdEl) editIdEl.value = w.id;
  if (nameEl) nameEl.value = w.name;
  if (balEl) balEl.value = w.balance;
  
  // Update Button Text
  const submitBtn = document.querySelector('#tab-wallets button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'Update Wallet';
  const cancelBtn = document.getElementById('btn-cancel-wallet');
  if (cancelBtn) cancelBtn.textContent = 'Cancel';
  
  // Scroll to form
  document.querySelector('.net-worth-card').scrollIntoView({ behavior: 'smooth' });
}

function renderWalletSelects() {
  const selects = ['trans-wallet', 'trans-wallet-to', 'ledger-wallet-filter'];
  
  selects.forEach(id => {
    const s = document.getElementById(id);
    if (!s) return;
    const currentVal = s.value;
    
    // Preserve 'all' option for filter
    if (id === 'ledger-wallet-filter') {
      s.innerHTML = '<option value="all">All Wallets</option>';
    } else {
      s.innerHTML = '';
    }

    wallets.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.id;
      opt.textContent = `${w.name} (${formatMoney(w.balance)})`;
      s.appendChild(opt);
    });
    
    // Try to restore previous selection
    if (currentVal && Array.from(s.options).some(o => o.value === currentVal)) {
      s.value = currentVal;
    }
  });
}

function buildTxItem(tx) {
  const item = document.createElement('div');
  item.className = `tx-item tx-${tx.type}`;
  
  // Find Icon
  let icon = ICONS.bulb;
  if (tx.type === 'transfer') {
    icon = ICONS.repeat;
  } else {
    // Match category icon
    const cat = categories.find(c => c.name === tx.category);
    if (cat && cat.icon) {
      icon = cat.icon;
    } else {
      const lowerCat = tx.category.toLowerCase();
      if (lowerCat.includes('food')) icon = ICONS.shopping;
      else if (lowerCat.includes('transport') || lowerCat.includes('gas')) icon = ICONS.transport;
      else if (lowerCat.includes('utility') || lowerCat.includes('bill')) icon = ICONS.utils;
      else if (lowerCat.includes('shopping')) icon = ICONS.shopping;
      else if (lowerCat.includes('coffee') || lowerCat.includes('drink')) icon = ICONS.coffee;
      else if (ICONS[lowerCat]) icon = ICONS[lowerCat];
      // Final fallback is already set to ICONS.bulb at initialization
    }
  }

  let title = tx.category;
  let meta = `${getWalletName(tx.wallet_id)}`;
  
  if (tx.type === 'transfer') {
    title = 'Transfer';
    meta = `${getWalletName(tx.wallet_id)} → ${getWalletName(tx.wallet_to)}`;
  }

  if (tx.note) {
    meta += ` • ${tx.note}`;
  }

  item.innerHTML = `
    <div class="tx-icon-wrapper ${tx.type}">
      ${icon}
    </div>
    <div class="tx-content">
      <span class="tx-title">${title}</span>
      <span class="tx-meta">${meta}</span>
    </div>
    <div class="tx-amount ${tx.type}">
      ${formatMoney(tx.amount, tx.type)}
    </div>
  `;

  // Right-click or long-press to delete
  item.addEventListener('contextmenu', async (e) => {
    e.preventDefault();
    if (confirm(`Delete this transaction?`)) {
      await DB.deleteTransaction(tx.id);
      await refreshData();
      renderLedger();
      renderDashboard();
    }
  });

  // Tap to view details
  item.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof showTxModal === 'function') showTxModal(tx);
  });

  return item;
}

function initDashboardTabs() {
  const tabs = document.querySelectorAll('.card-tab');
  const summaryContent = document.getElementById('dashboard-summary-content');
  const walletsWrapper = document.getElementById('dashboard-wallets-list-wrapper');
  const budgetsWrapper = document.getElementById('dashboard-budgets-list-wrapper');

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.currentTarget.dataset.tab;
      activeDashboardTab = target;

      // Update Tab UI
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update Card Content Visibility (Internal Blue Card)
      document.querySelectorAll('.dashboard-tab-content').forEach(c => c.style.display = 'none');
      const activeContent = document.getElementById(`tab-${target}`);
      if (activeContent) activeContent.style.display = 'block';

      // Toggle External Dashboard Context
      if (summaryContent) summaryContent.style.display = target === 'summary' ? 'block' : 'none';
      if (walletsWrapper) walletsWrapper.style.display = target === 'wallets' ? 'block' : 'none';
      if (budgetsWrapper) budgetsWrapper.style.display = target === 'budgets' ? 'block' : 'none';
      const goalsWrapper = document.getElementById('dashboard-goals-list-wrapper');
      if (goalsWrapper) goalsWrapper.style.display = target === 'goals' ? 'block' : 'none';

      // Re-render contextually
      if (target === 'summary') {
        renderDashboard();
      } else if (target === 'wallets') {
        renderWallets();
      } else if (target === 'budgets') {
        renderBudgets();
      } else if (target === 'goals') {
        renderGoals();
      }
    });
  });
}



window.showTxModal = function showTxModal(tx) {
  const modal = document.getElementById('tx-modal');
  const body = document.getElementById('tx-modal-body');
  if (!modal || !body) return;
  
  let title = tx.category;
  if (tx.type === 'transfer') title = 'Transfer';
  
  const dStr = new Date(tx.date).toLocaleDateString();
  let sign = tx.type === 'expense' ? '-' : (tx.type === 'income' ? '+' : '');
  
  body.innerHTML = `
    <p><strong>Type:</strong> <span style="text-transform: capitalize;">${tx.type}</span></p>
    <p><strong>Category:</strong> ${title}</p>
    <p><strong>Amount:</strong> <span class="text-${tx.type === 'expense' ? 'danger' : 'success'}">${sign}${formatMoney(tx.amount)}</span></p>
    <p><strong>Date:</strong> ${new Date(tx.date).toLocaleString()}</p>
    <p><strong>Wallet:</strong> ${getWalletName(tx.wallet_id)} ${tx.type === 'transfer' ? '➔ ' + getWalletName(tx.wallet_to) : ''}</p>
    <div style="background: rgba(212, 175, 55, 0.1); padding: 0.8rem; border-radius: 4px; border-left: 2px solid var(--accent-gold); white-space: pre-wrap; margin-top: 1rem; word-break: break-word;">${tx.note}</div>
  `;
  
  modal.style.display = 'flex';
}

function eyeActiveIcon() { return `<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:white;stroke-width:2.5;fill:none;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`; }
function eyeOffIcon() { return `<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:white;stroke-width:2.5;fill:none;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`; }

function renderDashboard() {
  if (activeDashboardTab !== 'summary') return;

  const list = document.getElementById('dashboard-recent-list');
  if (!list) return;
  list.innerHTML = '';
  
  // Privacy Toggle Setup
  const nwToggle = document.getElementById('btn-toggle-nw-visibility');
  if (nwToggle) {
    nwToggle.innerHTML = netWorthVisible ? eyeActiveIcon() : eyeOffIcon();
  }

  // NW Amount Logic
  const total = wallets.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  const nwEl = document.getElementById('net-worth-amount');
  if (nwEl) {
    nwEl.textContent = netWorthVisible ? formatMoney(total) : '₱ • • • • •';
    nwEl.classList.remove('text-danger', 'text-success');
    if (netWorthVisible) nwEl.classList.add(total >= 0 ? 'text-success' : 'text-danger');
  }

  // Calculate Monthly Summary
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyTrans = transactions.filter(t => new Date(t.date) >= monthStart);
  
  let monthIncome = 0;
  let monthExpense = 0;
  monthlyTrans.forEach(t => {
    if (t.type === 'income') monthIncome += t.amount;
    if (t.type === 'expense') monthExpense += t.amount;
  });

  const mIncEl = document.getElementById('month-income-amount');
  const mExpEl = document.getElementById('month-expense-amount');
  if (mIncEl) mIncEl.textContent = formatMoney(monthIncome);
  if (mExpEl) mExpEl.textContent = formatMoney(monthExpense);

  // Recent Activity
  const recent = [...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  recent.forEach(tx => list.appendChild(buildTxItem(tx)));

  // Sync Summary Components
  // (Trends and Insights now live exclusively in the Analytics Hub)
}

function formatDateGroup(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const txDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (txDate.getTime() === today.getTime()) return 'Today';
  if (txDate.getTime() === yesterday.getTime()) return 'Yesterday';

  return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

function initLedgerFilters() {
  const startInput = document.getElementById('ledger-start-date');
  const endInput = document.getElementById('ledger-end-date');
  if (!startInput || !endInput) return;

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  
  // Format to YYYY-MM-DD for input[type="date"]
  const formatDate = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  startInput.value = formatDate(firstDay);
  endInput.value = formatDate(now);

  [startInput, endInput].forEach(el => {
    el.addEventListener('change', renderLedger);
  });
}

function renderLedger() {
  const list = document.getElementById('ledger-list');
  if (!list) return;
  list.innerHTML = '';
  
  const filter = document.getElementById('ledger-wallet-filter').value;
  const searchInput = document.getElementById('ledger-search');
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const startDate = document.getElementById('ledger-start-date')?.value;
  const endDate = document.getElementById('ledger-end-date')?.value;

  let filtered = [...transactions].sort((a,b) => new Date(b.date) - new Date(a.date));

  // 1. Date Range Filter
  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0,0,0,0);
    filtered = filtered.filter(t => new Date(t.date) >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23,59,59,999);
    filtered = filtered.filter(t => new Date(t.date) <= end);
  }

  if (filter !== 'all') {
    filtered = filtered.filter(t => t.wallet_id === filter || t.wallet_to === filter);
  }

  if (searchTerm) {
    filtered = filtered.filter(t => {
      const cat = (t.category || 'Transfer').toLowerCase();
      const amt = String(t.amount);
      const note = (t.note || '').toLowerCase();
      return cat.includes(searchTerm) || amt.includes(searchTerm) || note.includes(searchTerm);
    });
  }

  if (filtered.length === 0) {
    list.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--system-text-muted);">No entries yet.</div>';
    return;
  }

  let lastDateGroup = '';
  filtered.forEach(tx => {
    const groupName = formatDateGroup(tx.date);
    
    if (groupName !== lastDateGroup) {
      const headerDiv = document.createElement('div');
      headerDiv.className = 'ledger-date-group';
      headerDiv.innerHTML = `<span class="ledger-date-header">${groupName}</span>`;
      list.appendChild(headerDiv);
      lastDateGroup = groupName;
    }

    list.appendChild(buildTxItem(tx));
  });
}

function renderAnalytics() {
  const activePeriodBtn = document.querySelector('#main-analytics-period-btns .card-tab.active');
  const periodDays = activePeriodBtn ? parseInt(activePeriodBtn.getAttribute('data-value'), 10) : 30;
  const mode = document.getElementById('main-analytics-mode')?.value || 'daily';

  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - (periodDays - 1));
  cutoff.setHours(0,0,0,0);

  // 1. Data Aggregation
  const filtered = transactions.filter(t => new Date(t.date) >= cutoff);
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryStats = {};

  filtered.forEach(t => {
    if (t.type === 'income') totalIncome += t.amount;
    if (t.type === 'expense') {
      totalExpense += t.amount;
      categoryStats[t.category] = (categoryStats[t.category] || 0) + t.amount;
    }
  });

  // 2. Hero: Savings Rate (v1.2.9: Precise Burn Rate)
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  const rateEl = document.getElementById('analytics-savings-rate');
  const rateTitleWrap = document.querySelector('.analytics-card .text-muted'); // Targeting the "SAVINGS RATE" small label
  
  if (rateEl) {
    const isNegative = savingsRate < 0;
    rateEl.textContent = `${savingsRate.toFixed(0)}%`;
    // Red if < 0, Yellow if 0-20, White/Green if > 20
    rateEl.style.color = savingsRate > 20 ? 'white' : (savingsRate >= 0 ? '#FFCC00' : '#FF453A');
    
    if (rateTitleWrap) {
      rateTitleWrap.textContent = isNegative ? 'BURN RATE (DEBT)' : 'SAVINGS RATE';
    }
  }

  const incEl = document.getElementById('total-income-amount');
  const expEl = document.getElementById('total-spent-amount');
  if (incEl) incEl.textContent = formatMoney(totalIncome);
  if (expEl) expEl.textContent = formatMoney(totalExpense);

  // 3. Bucket Chart Logic
  let bucketCount = Math.min(periodDays, 30); // Cap view complexity for small screen
  let bucketType = 'day';
  if (periodDays > 30 && periodDays <= 90) { bucketCount = 13; bucketType = 'week'; }
  if (periodDays > 90) { bucketCount = 12; bucketType = 'month'; }

  const incomeBuckets = new Array(bucketCount).fill(0);
  const expenseBuckets = new Array(bucketCount).fill(0);
  const labels = new Array(bucketCount).fill('');

  // Bucketing algorithm (Robust v2)
  for (let i = 0; i < bucketCount; i++) {
    const d = new Date(cutoff);
    if (bucketType === 'day') d.setDate(d.getDate() + i);
    else if (bucketType === 'week') d.setDate(d.getDate() + (i * 7));
    else if (bucketType === 'month') d.setMonth(d.getMonth() + i);
    
    d.setHours(0,0,0,0);
    const bucketTime = d.getTime();
    
    labels[i] = bucketType === 'day' ? d.getDate() : (bucketType === 'week' ? `W${i+1}` : d.toLocaleString('default', {month:'short'}));

    filtered.forEach(t => {
      const tDate = new Date(t.date);
      tDate.setHours(0,0,0,0);
      const tTime = tDate.getTime();
      
      let match = false;
      if (bucketType === 'day') match = tTime === bucketTime;
      else if (bucketType === 'week') match = tTime >= bucketTime && tTime < bucketTime + 7*24*60*60*1000;
      else match = tTime >= bucketTime && tTime < new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();

      if (match) {
        if (t.type === 'income') incomeBuckets[i] += Number(t.amount);
        if (t.type === 'expense') expenseBuckets[i] += Number(t.amount);
      }
    });

    if (mode === 'cumulative' && i > 0) {
      incomeBuckets[i] += incomeBuckets[i-1];
      expenseBuckets[i] += expenseBuckets[i-1];
    }
  }

  renderLineChart(incomeBuckets, expenseBuckets, labels, 'main-spending-chart');
  renderDonutChart(categoryStats);
  renderAnalyticsInsights(totalIncome, totalExpense, categoryStats, periodDays);
}

function renderDashboardTrends() {
  const activePeriodBtn = document.querySelector('#dashboard-period-btns .period-btn.active');
  const periodDays = activePeriodBtn ? parseInt(activePeriodBtn.getAttribute('data-value'), 10) : 30;
  const mode = document.getElementById('dashboard-analytics-mode')?.value || 'absolute';

  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - (periodDays - 1));
  cutoff.setHours(0,0,0,0);

  const filtered = transactions.filter(t => new Date(t.date) >= cutoff);
  
  let bucketCount = periodDays <= 7 ? 7 : (periodDays <= 30 ? 30 : 12);
  let bucketType = periodDays > 90 ? 'month' : 'day';

  const incomeBuckets = new Array(bucketCount).fill(0);
  const expenseBuckets = new Array(bucketCount).fill(0);
  const labels = new Array(bucketCount).fill('');

  for (let i = 0; i < bucketCount; i++) {
    const d = new Date(cutoff);
    if (bucketType === 'day') d.setDate(d.getDate() + i);
    else d.setMonth(d.getMonth() + i);
    
    d.setHours(0,0,0,0);
    const bucketTime = d.getTime();
    labels[i] = bucketType === 'day' ? d.getDate() : d.toLocaleString('default', {month:'short'});

    filtered.forEach(t => {
      const tDate = new Date(t.date);
      tDate.setHours(0,0,0,0);
      if (tDate.getTime() === bucketTime) {
        if (t.type === 'income') incomeBuckets[i] += Number(t.amount);
        if (t.type === 'expense') expenseBuckets[i] += Number(t.amount);
      }
    });

    if (mode === 'cumulative' && i > 0) {
      incomeBuckets[i] += incomeBuckets[i-1];
      expenseBuckets[i] += expenseBuckets[i-1];
    }
  }

  renderLineChart(incomeBuckets, expenseBuckets, labels, 'main-spending-chart');
}

function renderAnalyticsInsights(income, expense, categoryStats, days, containerId = 'analytics-insights-container') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const insights = [];
  const now = new Date();
  
  // 1. Precise Month-to-Date (MTD) setup
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthSamePoint = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  
  // MTD Transactions
  const mtdTrans = transactions.filter(t => new Date(t.date) >= monthStart);
  let curInc = 0, curExp = 0;
  const curCats = {};
  mtdTrans.forEach(t => {
    if (t.type === 'income') curInc += t.amount;
    if (t.type === 'expense') {
      curExp += t.amount;
      curCats[t.category] = (curCats[t.category] || 0) + t.amount;
    }
  });

  // Previous Month (Same Point)
  const preMTDTrans = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= prevMonthStart && d <= prevMonthSamePoint;
  });
  let preInc = 0, preExp = 0;
  preMTDTrans.forEach(t => {
    if (t.type === 'income') preInc += t.amount;
    if (t.type === 'expense') preExp += t.amount;
  });

  // --- GUARANTEED INSIGHT 1: VELOCITY ---
  if (preExp > 0) {
    const diff = curExp - preExp;
    const perc = Math.abs(((curExp / preExp) - 1) * 100);
    if (diff < 0) {
      insights.push({ title: 'Spending Velocity', text: `Excellent! You're currently ${perc.toFixed(0)}% below your spending at this stage last month. (₱${formatMoney(Math.abs(diff))} lead)`, type: 'green', icon: ICONS.trendingDown });
    } else if (diff > 0) {
      insights.push({ title: 'Spending Velocity', text: `Heads up: You're ${perc.toFixed(0)}% ahead of your spending from last month. (₱${formatMoney(diff)} deficit)`, type: diff > 500 ? 'yellow' : 'blue', icon: ICONS.trendingUp });
    } else {
      insights.push({ title: 'On Track', text: `Your spending matches your pace from last month exactly. Stable as a rock!`, type: 'blue', icon: ICONS.star });
    }
  } else {
    insights.push({ title: 'First Month Mojo', text: `Welcome to your first full audit month! Add more entries to see your growth velocity here.`, type: 'blue', icon: ICONS.bulb });
  }

  // --- GUARANTEED INSIGHT 2: CASH FLOW ---
  if (curInc > 0) {
    const diff = curInc - curExp;
    if (diff > 0) {
      const saveRate = (diff / curInc) * 100;
      insights.push({ title: 'Cash Flow Surplus', text: `Great work! You have a ₱${formatMoney(diff)} surplus so far. Savings Rate: ${saveRate.toFixed(0)}%.`, type: 'green', icon: ICONS.star });
    } else if (diff < 0) {
      insights.push({ title: 'Burn Rate Alert', text: `You've spent ₱${formatMoney(Math.abs(diff))} more than you earned this month. Consider a 7-day spend-fast.`, type: 'red', icon: ICONS.warning });
    } else {
      insights.push({ title: 'Break-Even Status', text: `You've spent exactly what you earned so far. Consider trimming expenses to build a surplus.`, type: 'yellow', icon: ICONS.trendingUp });
    }
  } else {
    insights.push({ title: 'Income Strategy', text: `Log your income to see your real-time Savings Rate and Financial Fortress score.`, type: 'blue', icon: ICONS.bulb });
  }

  // --- GUARANTEED INSIGHT 3: PROJECTION OR TOP CATEGORY ---
  const daysPassed = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const projectedExp = (curExp / Math.max(1, daysPassed)) * daysInMonth;

  if (curInc > 0 && curExp > 0) {
    const projectedSavings = curInc - projectedExp;
    if (projectedSavings > 0) {
      insights.push({ title: 'Smart Forecast', text: `At this rate, you're projected to end the month with a ₱${formatMoney(projectedSavings)} surplus.`, type: 'blue', icon: ICONS.bulb });
    } else {
      insights.push({ title: 'Month-End Check', text: `Watch out: Based on your pace, you might end the month with a ₱${formatMoney(Math.abs(projectedSavings))} deficit.`, type: 'red', icon: ICONS.warning });
    }
  } else {
    // Fallback: Top Category Analysis
    const sortedCats = Object.entries(curCats).sort((a,b) => b[1] - a[1]);
    if (sortedCats.length > 0) {
      const top = sortedCats[0];
      const perc = ((top[1] / Math.max(1, curExp)) * 100).toFixed(0);
      insights.push({ title: `Top Expenditure`, text: `${top[0]} accounts for ${perc}% of your spending this month. Is it worth it?`, type: 'blue', icon: ICONS.trendingUp });
    } else {
      insights.push({ title: 'Szabo Tip', text: `The ledger is the truth. Keep logging to unlock high-fidelity financial forecasting!`, type: 'blue', icon: ICONS.bulb });
    }
  }

  // Final Render (Exactly 3)
  insights.slice(0, 3).forEach(ins => {
    const card = document.createElement('div');
    const animClass = ins.type === 'red' ? 'pulse-red' : (ins.type === 'yellow' ? 'pulse-yellow' : (ins.type === 'green' ? 'pulse-green' : ''));
    card.className = `insight-card insight-${ins.type} ${animClass}`;
    card.style.margin = '0';
    card.style.padding = '12px';
    card.style.borderRadius = '16px';
    card.innerHTML = `
      <div class="insight-icon" style="width: 32px; height: 32px;">${ins.icon}</div>
      <div class="insight-content">
        <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 2px;">${ins.title}</h4>
        <p style="font-size: 11px; line-height: 1.3;">${ins.text}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderDonutChart(categoryStats) {
  const container = document.getElementById('category-donut-chart');
  const legend = document.getElementById('category-legend');
  if (!container || !legend) return;

  const entries = Object.entries(categoryStats).sort((a,b) => b[1] - a[1]);
  const total = entries.reduce((sum, e) => sum + e[1], 0);

  if (total === 0) {
    container.innerHTML = '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:10px; color:var(--system-text-muted);">No Expense Data</div>';
    legend.innerHTML = '';
    return;
  }

  const colors = ['#007AFF', '#5856D6', '#AF52DE', '#FF2D55', '#FF9500', '#FFCC00', '#34C759'];
  let currentOffset = 0;
  let svg = `<svg viewBox="0 0 42 42" width="100%" height="100%" class="donut-chart">
    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border-separator)" stroke-width="2"></circle>`;
  
  let legendHtml = '';

  entries.forEach(([cat, amt], i) => {
    const percent = (amt / total) * 100;
    const color = colors[i % colors.length];
    
    if (percent > 0) {
      svg += `<circle cx="21" cy="21" r="15.915" fill="transparent" 
        stroke="${color}" stroke-width="6" 
        stroke-dasharray="${percent} ${100 - percent}" 
        stroke-dashoffset="${-currentOffset}"
        class="donut-segment">
        <title>${cat}: ${formatMoney(amt)}</title>
      </circle>`;
      currentOffset += percent;
    }

    if (i < 5) {
      legendHtml += `
        <div style="display:flex; align-items:center; justify-content:space-between; font-size:11px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:8px; height:8px; border-radius:100%; background:${color};"></div>
            <span style="font-weight:500;">${cat}</span>
          </div>
          <span class="text-muted">${percent.toFixed(0)}%</span>
        </div>
      `;
    }
  });

  svg += `
    <g class="donut-text">
        <text x="21" y="21" text-anchor="middle" dominant-baseline="central" style="font-size: 6px; font-weight:700; fill:var(--system-text);">${((total/1000).toFixed(1))}k</text>
    </g>
  </svg>`;

  container.innerHTML = svg;
  legend.innerHTML = legendHtml;
}


function renderLineChart(income, expense, labels, containerId = 'main-spending-chart') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const totalSum = income.reduce((a,b) => a+b, 0) + expense.reduce((a,b) => a+b, 0);
  if (totalSum === 0) {
    container.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--system-text-muted); font-size:13px; font-style:italic;">No trend data for this period</div>`;
    return;
  }

  const maxVal = Math.max(...income, ...expense, 100) * 1.25;
  const width = 400;
  const height = 200;
  const marginY = 30; // Safety margin to prevent clipping
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 -20 ${width} ${height + 60}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.overflow = 'visible';

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  // Avoid innerHTML on SVG elements for better compatibility
  const createGradient = (id, color) => {
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.setAttribute('id', id); grad.setAttribute('x1', 0); grad.setAttribute('y1', 0); grad.setAttribute('x2', 0); grad.setAttribute('y2', 1);
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%'); stop1.setAttribute('stop-color', color); stop1.setAttribute('stop-opacity', '0.3');
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%'); stop2.setAttribute('stop-color', color); stop2.setAttribute('stop-opacity', '0');
    grad.appendChild(stop1); grad.appendChild(stop2);
    return grad;
  };
  defs.appendChild(createGradient('grad-inc', 'var(--success)'));
  defs.appendChild(createGradient('grad-exp', 'var(--danger)'));
  svg.appendChild(defs);

  // Grid Lines
  for (let i = 0; i <= 4; i++) {
    const y = (height - marginY) - (i * ((height - marginY*2) / 4)) + marginY;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', 0); line.setAttribute('y1', y);
    line.setAttribute('x2', width); line.setAttribute('y2', y);
    line.setAttribute('stroke', 'var(--border-separator)');
    line.setAttribute('stroke-dasharray', '2 2');
    svg.appendChild(line);
  }

  const getPoints = (data) => data.map((v, i) => ({
    x: (i / Math.max(1, data.length - 1)) * width,
    y: (height - marginY) - (v / maxVal) * (height - marginY*2)
  }));

  const drawSeries = (data, type) => {
    const pts = getPoints(data);
    if (pts.length < 2) return;
    const pathData = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    
    const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', `${pathData} L ${pts[pts.length-1].x} ${height - marginY} L ${pts[0].x} ${height - marginY} Z`);
    area.setAttribute('fill', `url(#grad-${type === 'income' ? 'inc' : 'exp'})`);
    area.setAttribute('class', `chart-area-${type}`);
    svg.appendChild(area);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', pathData);
    line.setAttribute('class', `chart-line-${type}`);
    svg.appendChild(line);
  };

  drawSeries(income, 'income');
  drawSeries(expense, 'expense');

  labels.forEach((label, i) => {
    if (labels.length > 15 && i % 4 !== 0) return;
    if (labels.length > 7 && labels.length <= 15 && i % 2 !== 0) return;
    const x = (i / Math.max(1, labels.length - 1)) * width;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', height + 25);
    text.setAttribute('text-anchor', i === 0 ? 'start' : (i === labels.length - 1 ? 'end' : 'middle'));
    text.setAttribute('class', 'chart-axis-label');
    text.textContent = label;
    svg.appendChild(text);
  });

  container.appendChild(svg);
}

function renderAnalyticsList(filtered) {
  const list = document.getElementById('analytics-list');
  if (!list) return;
  list.innerHTML = '';
  
  if (filtered.length === 0) {
    list.innerHTML = '<p class="text-muted" style="text-align:center; padding: 20px;">No transactions in this period.</p>';
    return;
  }

  // Sort by date desc for the list
  const sorted = [...filtered].sort((a,b) => new Date(b.date) - new Date(a.date));
  sorted.forEach(tx => list.appendChild(buildTxItem(tx)));
}

function updateCategoryDatalist(filterType = 'expense') {
  const dl = document.getElementById('category-list');
  if(!dl) return;
  dl.innerHTML = '';
  
  // Also handle 'transfer' mode (no categories needed)
  if (filterType === 'transfer') return;

  const filtered = categories.filter(c => !c.type || c.type === filterType);
  filtered.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    dl.appendChild(opt);
  });
}

function renderCategories() {
  const list = document.getElementById('settings-categories-list');
  if (!list) return;
  list.innerHTML = '';
  
  categories.forEach(c => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.padding = '12px 16px';
    card.style.background = 'rgba(var(--system-card-rgb), 0.6)';
    card.style.marginBottom = '8px';
    
    let actions = '';
    if (!c.isDefault) {
      actions = `
        <div style="display:flex; gap:12px;">
          <button class="edit-cat-btn" style="background:none; border:none; color:var(--system-accent); cursor:pointer;">${ICONS.pencil}</button>
          <button class="delete-cat-btn btn-delete" style="padding: 4px;">${ICONS.trash}</button>
        </div>
      `;
    }

    const typeColor = c.type === 'income' ? 'var(--success)' : 'var(--danger)';
    const typeLabel = c.type ? c.type.toUpperCase() : 'EXPENSE';

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h4 style="margin:0; font-size:15px;">${c.name}</h4>
            <span style="font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${typeColor}15; color: ${typeColor}; border: 1px solid ${typeColor}30;">
              ${typeLabel}
            </span>
            ${c.isDefault ? '<span class="text-muted" style="font-size:10px; font-weight:400;">(Core)</span>' : ''}
          </div>
          <p style="margin: 2px 0 0 0; font-size: 13px; color: var(--system-text-muted);">${c.description || 'No description'}</p>
        </div>
        ${actions}
      </div>
    `;

    if (!c.isDefault) {
      card.querySelector('.delete-cat-btn').addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent card edit trigger
        if (confirm(`Delete category "${c.name}"? Historical transactions will remain but future tracking for this name will stop.`)) {
          await DB.deleteCategory(c.name);
          await refreshData();
          renderCategories();
        }
      });

      // Entire card click for edit
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        editCategoryName = c.name;
        document.getElementById('cat-name').value = c.name;
        document.getElementById('cat-name').readOnly = true; 
        document.getElementById('cat-desc').value = c.description || '';
        document.getElementById('cat-type').value = c.type || 'expense';
        document.getElementById('add-category-form').querySelector('button[type="submit"]').textContent = 'Update Label';
        document.getElementById('cat-desc').focus();
        // Scroll to form
        document.getElementById('add-category-form').scrollIntoView({ behavior: 'smooth' });
      });
    }

    list.appendChild(card);
  });
}

function updateBudgetCategorySelect() {
  const s = document.getElementById('budget-category');
  if (!s) return;
  s.innerHTML = '<option value="" disabled selected>Select Category</option>';
  
  // v1.1.0: Only show 'expense' categories for budget planning
  const filtered = categories.filter(c => !c.type || c.type === 'expense');
  
  filtered.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    s.appendChild(opt);
  });
}

function bindBudgetForm() {
  const form = document.getElementById('add-budget-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const category = document.getElementById('budget-category').value;
      const amount = parseFloat(document.getElementById('budget-amount').value);
      if (category && !isNaN(amount)) {
        await DB.setBudget({ category, amount });
        form.reset();
        await refreshData();
      }
    });
  }

  const toggle = document.getElementById('budget-alerts-toggle');
  if (toggle) {
    toggle.checked = localStorage.getItem('szabo_budget_alerts') === 'true';
    toggle.addEventListener('change', (e) => {
      localStorage.setItem('szabo_budget_alerts', e.target.checked);
      renderSmartInsights();
    });
  }

  const btnClearBudget = document.getElementById('btn-clear-budget');
  if (btnClearBudget) {
    btnClearBudget.addEventListener('click', () => {
      document.getElementById('add-budget-form').reset();
    });
  }
}

function renderBudgets() {
  // Only render for the dashboard section now
  const list = document.getElementById('dashboard-budgets-section');
  if (!list) return;
  // Dashboard-specific rendering is handled by renderDashboardBudgets below
  renderDashboardBudgets();
}

function renderDashboardBudgets() {
  const container = document.getElementById('dashboard-budgets-section');
  if (!container) return;
  container.innerHTML = '';

  if (budgets.length === 0) return;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const curTrans = transactions.filter(t => new Date(t.date) >= monthStart && t.type === 'expense');

  const catTotals = {};
  curTrans.forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });

  budgets.forEach(b => {
    const spent = catTotals[b.category] || 0;
    const perc = Math.min((spent / b.amount) * 100, 100);
    const left = Math.max(b.amount - spent, 0);

    let color = 'green';
    if (perc > 70) color = 'yellow';
    if (perc >= 95) color = 'red';

    const item = document.createElement('div');
    item.className = 'budget-item';
    item.innerHTML = `
      <div class="budget-info">
        <span class="budget-label">${b.category}</span>
        <span class="budget-meta">${perc >= 100 ? 'Over Budget' : formatMoney(left) + ' left'}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill ${color}" style="width: ${perc}%"></div>
      </div>
    `;
    container.appendChild(item);
  });
}

function bindCategoryForm() {
  const form = document.getElementById('add-category-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('cat-name').value.trim();
    const description = document.getElementById('cat-desc').value.trim();
    const type = document.getElementById('cat-type').value;

    if (editCategoryName) {
      await DB.updateCategory({ name, description, type, isDefault: false });
      editCategoryName = null;
      form.querySelector('button[type="submit"]').textContent = 'Add Category';
      document.getElementById('cat-name').readOnly = false;
    } else {
      // Check if already exists
      if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        alert('This category name already exists.');
        return;
      }
      await DB.addCategory({ name, description, type, isDefault: false });
    }
    
    form.reset();
    await refreshData();
    renderCategories();
    // Refresh datalist based on the currently selected transaction tab
    const activeTxType = document.querySelector('#add-tx-type-selector .period-btn.active')?.getAttribute('data-value') || 'expense';
    updateCategoryDatalist(activeTxType);
  });
}

// SIG (Szabo Interactive Guide)
let activeHelpStep = 0;
const helpSteps = [
  {
    title: "Welcome aboard!",
    text: "I'm your financial coach. Together, we're going to transform your relationship with money. Ready to see how?",
    icon: "👋"
  },
  {
    title: "The Truth Card",
    text: "Your Dashboard is the 'Truth.' It shows your real Net Worth. High numbers are great, but CONSISTENCY is your real goal here.",
    icon: "📊"
  },
  {
    title: "The Ledger",
    text: "Every transaction tells your story. Use filters to find where you're overspending and where you're winning.",
    icon: "📖"
  },
  {
    title: "Predictive Advisor",
    text: "Check your Goals often! My assistant analyzes your behavior and tells you exactly when you'll reach your destination based on your current pace.",
    icon: "🔮"
  },
  {
    title: "Take Szabo Everywhere",
    text: "For the best experience, tap your browser's share icon and select 'Add to Home Screen.' I'll sit right on your phone as a premium app!",
    icon: "📲"
  }
];

function bindHelp() {
  const btnHelp = document.getElementById('btn-open-help');
  const btnNext = document.getElementById('btn-help-next');
  const btnPrev = document.getElementById('btn-help-prev');
  const modal = document.getElementById('help-guide-modal');

  if (btnHelp) {
    btnHelp.onclick = (e) => {
      e.preventDefault();
      openHelpGuide();
    };
  }

  if (btnNext) {
    btnNext.onclick = () => {
      if (activeHelpStep < helpSteps.length - 1) {
        activeHelpStep++;
        renderHelpStep();
      } else {
        closeModal(document.getElementById('help-guide-modal'));
      }
    };
  }

  if (btnPrev) {
    btnPrev.onclick = () => {
      if (activeHelpStep > 0) {
        activeHelpStep--;
        renderHelpStep();
      }
    };
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  }
}

function openHelpGuide() {
  activeHelpStep = 0;
  const modal = document.getElementById('help-guide-modal');
  if (modal) {
    modal.style.display = 'flex';
    renderHelpStep();
  }
}

function renderHelpStep() {
  const step = helpSteps[activeHelpStep];
  const container = document.getElementById('help-guide-content');
  const dotsContainer = document.getElementById('help-guide-dots');
  const btnNext = document.getElementById('btn-help-next');
  const btnPrev = document.getElementById('btn-help-prev');
  
  if (!container) return;

  // Render Dots
  dotsContainer.innerHTML = helpSteps.map((_, i) => `
    <div style="width: 6px; height: 6px; border-radius: 50%; background: ${i === activeHelpStep ? 'var(--system-accent)' : 'rgba(var(--system-card-rgb), 0.2)'}; transition: all 0.3s ease; transform: scale(${i === activeHelpStep ? 1.5 : 1});"></div>
  `).join('');

  // Handle Buttons
  btnPrev.style.display = activeHelpStep === 0 ? 'none' : 'block';
  btnNext.textContent = activeHelpStep === helpSteps.length - 1 ? 'Start Winning' : 'Next Step';

  // Render Content with Coach Tone
  container.innerHTML = `
    <div style="text-align: center; animation: modalSlideDown 0.4s ease-out;">
      <div style="font-size: 54px; margin-bottom: 24px;">${step.icon}</div>
      <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 12px; color: var(--system-text); letter-spacing: -0.5px;">${step.title}</h3>
      <p style="font-size: 15px; line-height: 1.6; color: var(--system-text-muted); margin-bottom: 0;">${step.text}</p>
    </div>
  `;
}
