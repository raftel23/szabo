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
  utils: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>`
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
let netWorthVisible = localStorage.getItem('szabo_nw_visible') !== 'false'; // Default to true
let activeDashboardTab = 'summary'; // New v1.1.0 state: summary | wallets | budgets

// --- Init UI ---
export async function initUI() {
  bindNavigation();
  bindForms();
  bindTypeSelector();
  bindExport();
  bindFAB();
  bindBudgetForm();
  initTheme();
  initDashboardToggles();
  initNetWorthVisibility();
  initDashboardTabs(); // v1.1.0
  bindCategoryForm(); // v1.1.0
  initLedgerFilters(); // v1.1.0

  const btnCloseModal = document.getElementById('btn-close-tx-modal');
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      document.getElementById('tx-modal').style.display = 'none';
    });
  }

  // Load Initial Data
  await refreshData();
}

async function refreshData() {
  wallets = await DB.getWallets();
  transactions = await DB.getTransactions();
  budgets = await DB.getBudgets();
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
      
      // If clicking center ADD button, handle contextually
      if (targetId === 'add') {
        const centerBtn = document.getElementById('nav-btn-add');
        const iconWrap = centerBtn.querySelector('.icon');
        const isCurrentlyAdd = document.getElementById('view-add').classList.contains('active');

        if (isCurrentlyAdd) {
          // CANCEL/CLOSE: Go back to previous view
          document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
          document.getElementById(`view-${previousView}`).classList.add('active');
          document.querySelector(`.nav-link[data-target="${previousView}"]`).classList.add('active');
          iconWrap.innerHTML = ICONS.plus;
          centerBtn.classList.remove('is-active');
        } else {
          // OPEN ADD: Save current as previous if not already add
          if (previousView === 'wallets') {
            // New Wallet form logic
            const form = document.getElementById('add-wallet-container');
            if (form) form.style.display = form.style.display === 'block' ? 'none' : 'block';
          } else {
            // Open Transaction View
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById('view-add').classList.add('active');
            links.forEach(l => l.classList.remove('active'));
            iconWrap.innerHTML = ICONS.close;
            centerBtn.classList.add('is-active');
          }
        }
        return;
      }

      // Update Active Nav
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Update Views
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      const targetView = document.getElementById(`view-${targetId}`);
      if (targetView) targetView.classList.add('active');
      
      previousView = targetId;

      // Special: If navigating to Dashboard, default to summary tab
      if (targetId === 'dashboard') {
        const summaryTab = document.querySelector('.card-tab[data-tab="summary"]');
        if (summaryTab) summaryTab.click();
      }

      // Reset center button if on a normal tab
      const centerBtn = document.getElementById('nav-btn-add');
      if (centerBtn) {
        centerBtn.classList.remove('is-active');
        const iconWrap = centerBtn.querySelector('.icon');
        if (iconWrap) {
          iconWrap.innerHTML = targetId === 'add' ? ICONS.close : ICONS.plus;
        }
      }
    });
  });
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
    const data = { wallets, transactions, budgets, categories };
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

      // Re-render contextually
      if (target === 'summary') {
        renderDashboard();
      } else if (target === 'wallets') {
        renderWallets();
      } else if (target === 'budgets') {
        renderBudgets();
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

  // Sync Analytics & Summary Components
  renderAnalytics();
  renderSmartInsights();
}

function eyeActiveIcon() { return `<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:white;stroke-width:2.5;fill:none;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`; }
function eyeOffIcon() { return `<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:white;stroke-width:2.5;fill:none;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x1="23" y2="23"></line></svg>`; }



function renderSmartInsights() {
  const container = document.getElementById('dashboard-insights-container');
  if (!container) return;
  container.innerHTML = '';

  const alertsEnabled = localStorage.getItem('szabo_budget_alerts') === 'true';
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const getStats = (list) => {
    let inc = 0, exp = 0;
    const cats = {};
    list.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      if (t.type === 'expense') {
        exp += t.amount;
        cats[t.category] = (cats[t.category] || 0) + t.amount;
      }
    });
    return { inc, exp, cats };
  };

  const currentMonthTrans = transactions.filter(t => new Date(t.date) >= currentMonthStart);
  const prevMonthTrans = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= prevMonthStart && d <= prevMonthEnd;
  });

  const cur = getStats(currentMonthTrans);
  const pre = getStats(prevMonthTrans);

  const insights = [];

  // Logic 1: Basic Cash Flow (Current Month)
  if (currentMonthTrans.length > 0) {
    if (cur.exp > cur.inc && cur.inc > 0) {
      insights.push({ title: 'Spending Alert', text: `You've spent ${formatMoney(cur.exp - cur.inc)} more than you earned this month.`, type: 'red', icon: ICONS.warning });
    } else if (cur.inc > cur.exp) {
      insights.push({ title: 'Positive Cash Flow', text: `Great! You have a surplus of ${formatMoney(cur.inc - cur.exp)} so far.`, type: 'green', icon: ICONS.star });
    }
  }

  // Logic 2: Budget Intelligence (OPT-IN)
  if (alertsEnabled && budgets.length > 0) {
    const daysPassed = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    budgets.forEach(b => {
      const spent = cur.cats[b.category] || 0;
      const perc = (spent / b.amount) * 100;
      const timePerc = (daysPassed / daysInMonth) * 100;

      if (perc > 100) {
        insights.push({ title: `${b.category} Overload`, text: `You're over budget for ${b.category} by ${formatMoney(spent - b.amount)}.`, type: 'red', icon: ICONS.warning });
      } else if (perc > timePerc + 20) {
        insights.push({ title: 'Slow down!', text: `You've used ${perc.toFixed(0)}% of your ${b.category} budget, but only ${timePerc.toFixed(0)}% of the month has passed.`, type: 'yellow', icon: ICONS.bulb });
      }
    });
  }

  // Logic 3: Month-over-Month (MoM) Comparison
  if (prevMonthTrans.length > 0) {
    const daysPassed = now.getDate();
    const daysInPrev = prevMonthEnd.getDate();
    
    const curDailyAvg = cur.exp / daysPassed;
    const preDailyAvg = pre.exp / daysInPrev;

    // 3.1 Overall velocity comparison
    if (curDailyAvg < preDailyAvg * 0.9) {
      const saved = (preDailyAvg - curDailyAvg) * daysPassed;
      insights.push({
        title: 'Spending Velocity',
        text: `Awesome! You're spending about ${formatMoney(saved)} less than last month at this stage.`,
        type: 'green',
        icon: ICONS.trendingDown
      });
    } else if (curDailyAvg > preDailyAvg * 1.1) {
      insights.push({
        title: 'Spending Check',
        text: `Your daily spend is higher than last month. Consider reviewing your top categories.`,
        type: 'yellow',
        icon: ICONS.trendingUp
      });
    }
  }

  // Logic 3: Top Current Category (If not handled by drift)
  const sortedCats = Object.entries(cur.cats).sort((a,b) => b[1] - a[1]);
  if (sortedCats.length > 0 && insights.length < 5) {
    const topCat = sortedCats[0];
    const perc = ((topCat[1] / cur.exp) * 100).toFixed(0);
    insights.push({ title: 'Top expenditure', text: `${topCat[0]} is your #1 expense, taking up ${perc}% of your budget.`, type: 'blue', icon: ICONS.trendingUp });
  }

  if (insights.length === 0) {
    insights.push({ title: 'Welcome to Szabo!', text: 'Add your first transaction to unlock smart financial coaching.', type: 'blue', icon: ICONS.bulb });
  }

  insights.slice(0, 5).forEach(ins => {
    const card = document.createElement('div');
    const animClass = ins.type === 'red' ? 'pulse-red' : (ins.type === 'yellow' ? 'pulse-yellow' : (ins.type === 'green' ? 'pulse-green' : ''));
    card.className = `insight-card insight-${ins.type} ${animClass}`;
    card.innerHTML = `
      <div class="insight-icon">${ins.icon}</div>
      <div class="insight-content">
        <h4>${ins.title}</h4>
        <p>${ins.text}</p>
      </div>
    `;
    container.appendChild(card);
  });
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
  const activePeriodBtn = document.querySelector('#analytics-period-btns .period-btn.active');
  const periodDays = activePeriodBtn ? parseInt(activePeriodBtn.getAttribute('data-value'), 10) : 30;
  
  if (isNaN(periodDays)) {
    console.error("Invalid periodDays detected in Analytics");
    return;
  }
  const mode = document.getElementById('analytics-mode').value;

  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - (periodDays - 1));
  cutoff.setHours(0,0,0,0);

  // 1. Filter and Aggregate
  const filtered = transactions.filter(t => new Date(t.date) >= cutoff);
  
  let totalSpent = 0;
  let totalIncome = 0;
  
  // Decide Bucketing
  let bucketCount = periodDays;
  let bucketType = 'day'; 
  if (periodDays === 90) { bucketCount = 13; bucketType = 'week'; }
  if (periodDays === 365) { bucketCount = 12; bucketType = 'month'; }

  const incomeBuckets = new Array(bucketCount).fill(0);
  const expenseBuckets = new Array(bucketCount).fill(0);
  const labels = new Array(bucketCount).fill('');


  
  for (let i = 0; i < bucketCount; i++) {
    let d = new Date(cutoff);
    if (bucketType === 'day') d.setDate(d.getDate() + i);
    if (bucketType === 'week') d.setDate(d.getDate() + (i * 7));
    if (bucketType === 'month') d.setMonth(d.getMonth() + i);
    
    // Formatting label
    if (bucketType === 'day') labels[i] = d.getDate();
    if (bucketType === 'week') labels[i] = 'W' + (i+1);
    if (bucketType === 'month') labels[i] = d.toLocaleString('default', { month: 'short' });

    // Sum transactions in this bucket
    filtered.forEach(t => {
      const tDate = new Date(t.date);
      let match = false;
      if (bucketType === 'day') {
        match = tDate.toDateString() === d.toDateString();
      } else if (bucketType === 'week') {
        const nextWeek = new Date(d);
        nextWeek.setDate(nextWeek.getDate() + 7);
        match = tDate >= d && tDate < nextWeek;
      } else {
        match = tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear();
      }

      if (match) {
        if (t.type === 'income') incomeBuckets[i] += t.amount;
        if (t.type === 'expense') expenseBuckets[i] += t.amount;
      }
    });

    if (mode === 'cumulative' && i > 0) {
      incomeBuckets[i] += incomeBuckets[i-1];
      expenseBuckets[i] += expenseBuckets[i-1];
    }
  }

  // Update Summary Cards
  filtered.forEach(t => {
    if (t.type === 'income') totalIncome += t.amount;
    if (t.type === 'expense') totalSpent += t.amount;
  });

  const spentEl = document.getElementById('total-spent-amount');
  const incEl = document.getElementById('total-income-amount');
  if (spentEl) spentEl.textContent = formatMoney(totalSpent);
  if (incEl) incEl.textContent = formatMoney(totalIncome);

  // 2. Render Chart
  renderLineChart(incomeBuckets, expenseBuckets, labels);

  // 3. Render List
  renderAnalyticsList(filtered);
}

function renderLineChart(income, expense, labels) {
  const chart = document.getElementById('spending-chart');
  if (!chart) return;
  chart.innerHTML = '';

  const maxVal = Math.max(...income, ...expense, 100) * 1.1;
  const width = 400;
  const height = 200;
  
  // Build SVG content string to ensure correct namespace parsing via innerHTML
  let svgContent = `
    <defs>
      <linearGradient id="gradient-income" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--success)" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="var(--success)" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="gradient-expense" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--danger)" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="var(--danger)" stop-opacity="0"/>
      </linearGradient>
    </defs>
  `;

  // Grid Lines
  for (let i = 0; i <= 4; i++) {
    const y = height - (i * (height / 4));
    svgContent += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" class="chart-grid-line" style="stroke: var(--border-separator); stroke-dasharray: 2 2;" />`;
  }

  const getPoints = (data) => {
    if (data.length < 2) return [];
    return data.map((v, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - (v / maxVal) * height
    }));
  };

  const drawSeries = (data, type) => {
    const pts = getPoints(data);
    if (pts.length < 2) return;
    const pathData = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    const areaData = `${pathData} L ${pts[pts.length-1].x} ${height} L ${pts[0].x} ${height} Z`;
    
    svgContent += `<path d="${areaData}" class="chart-area-${type}" />`;
    svgContent += `<path d="${pathData}" class="chart-line-${type}" />`;
  };

  drawSeries(income, 'income');
  drawSeries(expense, 'expense');

  chart.innerHTML = svgContent;

  // Labels (Added after innerHTML to use DOM-based alignment if needed, though they could be stringed too)
  labels.forEach((label, i) => {
    if (labels.length > 15 && i % 4 !== 0) return;
    if (labels.length > 7 && labels.length <= 15 && i % 2 !== 0) return;
    const x = (i / (labels.length - 1)) * width;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', height + 15);
    text.setAttribute('text-anchor', i === 0 ? 'start' : (i === labels.length - 1 ? 'end' : 'middle'));
    text.setAttribute('class', 'chart-axis-label');
    text.style.fill = 'var(--system-text-muted)';
    text.style.fontSize = '10px';
    text.textContent = label;
    chart.appendChild(text);
  });
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
