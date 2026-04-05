// ui.js - DOM Manipulation and Event Handling
import { DB } from './db.js';

// --- Icons (SVG Constants) ---
const ICONS = {
  plus: `<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  close: `<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  pencil: `<svg viewBox="0 0 24 24" style="width:16px;height:16px;"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`,
  bulb: `<svg viewBox="0 0 24 24"><path d="M9 21h6M9 18h6M10 15c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4c0 1.25-.5 2.45-1.5 3.5L10 15z"></path></svg>`,
  trendingUp: `<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
  trendingDown: `<svg viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>`,
  warning: `<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"></path></svg>`,
  star: `<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  eye: `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
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
    if (!categories || categories.length === 0) {
      const defaults = [
        { name: 'Food', description: 'Groceries, restaurants, snacks', isDefault: true },
        { name: 'Transport', description: 'Gas, transit, repairs', isDefault: true },
        { name: 'Utilities', description: 'Water, electricity, internet', isDefault: true },
        { name: 'Entertainment', description: 'Movies, games, hobbies', isDefault: true },
        { name: 'Shopping', description: 'Clothes, electronics, gifts', isDefault: true }
      ];
      for (const c of defaults) {
        await DB.addCategory(c);
      }
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
  renderSettingsCategories();
  renderSettingsBudgets();
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
      document.getElementById(`view-${targetId}`).classList.add('active');
      
      previousView = targetId;

      // Reset center button if on a normal tab
      const centerBtn = document.getElementById('nav-btn-add');
      if (centerBtn) {
        centerBtn.classList.remove('is-active');
        const iconWrap = centerBtn.querySelector('.icon');
        if (iconWrap) iconWrap.innerHTML = ICONS.plus;
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
      btn.textContent = 'Show';
    }

    btn.addEventListener('click', () => {
      const isActuallyHidden = container.style.height === '0px' || container.style.height === '0';
      if (isActuallyHidden) {
        container.style.height = 'auto';
        container.style.opacity = '1';
        btn.textContent = 'Hide';
        localStorage.setItem(storageKey, 'false');
      } else {
        container.style.height = '0';
        container.style.opacity = '0';
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
    const fabIcon = fab.querySelector('.icon');
    
    if (activeView === 'view-wallets') {
      const awContainer = document.getElementById('add-wallet-container');
      if(awContainer) {
        if (awContainer.style.display === 'block') {
          awContainer.style.display = 'none';
          fabIcon.innerHTML = ICONS.plus;
          editWalletId = null;
          document.getElementById('add-wallet-form').reset();
          document.querySelector('#add-wallet-form button[type="submit"]').textContent = 'Save';
        } else {
          awContainer.style.display = 'block';
          fabIcon.innerHTML = ICONS.close;
          editWalletId = null;
          document.getElementById('add-wallet-form').reset();
          document.querySelector('#add-wallet-form button[type="submit"]').textContent = 'Save';
        }
      }
    } else if (activeView === 'view-add') {
      // Acting as cancel/close for Add Transaction
      const backLink = document.querySelector(`.nav-link[data-target="${previousView}"]`);
      if (backLink) backLink.click();
    } else {
      // For Dashboard, Ledger, Analytics - go to add transaction
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById('view-add').classList.add('active');
      
      // Remove active from nav links since we are in Add mode
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      
      fabIcon.innerHTML = ICONS.close;
    }
  });
}

// --- Forms ---
function bindForms() {
  // Add Wallet
  const btnCancelWallet = document.getElementById('btn-cancel-wallet');
  const addWalletForm = document.getElementById('add-wallet-form');
  const awContainer = document.getElementById('add-wallet-container');

  btnCancelWallet.addEventListener('click', () => {
    editWalletId = null;
    awContainer.style.display = 'none';
    addWalletForm.reset();
    addWalletForm.querySelector('button[type="submit"]').textContent = 'Save';
    const fabIcon = document.querySelector('#global-fab .icon');
    if (fabIcon) fabIcon.innerHTML = ICONS.plus;
  });

  addWalletForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('wallet-name').value;
    const balance = parseFloat(document.getElementById('wallet-balance').value) || 0;
    
    if (editWalletId) {
      const existing = wallets.find(x => x.id === editWalletId);
      if (existing) {
        await DB.updateWallet({ ...existing, name, balance });
      }
    } else {
      await DB.addWallet({ name, balance, type: 'manual' });
    }
    
    editWalletId = null;
    addWalletForm.reset();
    addWalletForm.querySelector('button[type="submit"]').textContent = 'Save';
    awContainer.style.display = 'none';
    const fabIcon = document.querySelector('#global-fab .icon');
    if (fabIcon) fabIcon.innerHTML = ICONS.plus;
    await refreshData();
  });

  // Add Transaction
  const addTxForm = document.getElementById('add-transaction-form');
  
  // Set default date to now
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
      
      // Navigate to Dashboard
      document.querySelector('.nav-link[data-target="dashboard"]').click();
      await refreshData();
    } catch(err) {
      alert("Error adding transaction.");
      console.error(err);
    }
  });

  // Add Entry View Type Selector
  const addTxTypeBtns = document.querySelectorAll('#add-tx-type-selector .period-btn');
  addTxTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      addTxTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const type = btn.getAttribute('data-value');
      const transferGroup = document.getElementById('transfer-to-group');
      const catGroup = document.getElementById('category-group');
      
      if (type === 'transfer') {
        transferGroup.style.display = 'flex';
        catGroup.style.display = 'none';
      } else {
        transferGroup.style.display = 'none';
        catGroup.style.display = 'flex';
      }
    });
  });

  // Ledger Wallet Filter
  const ledgerWalletFilter = document.getElementById('ledger-wallet-filter');
  if (ledgerWalletFilter) ledgerWalletFilter.addEventListener('change', renderLedger);
  const ledgerSearch = document.getElementById('ledger-search');
  if (ledgerSearch) ledgerSearch.addEventListener('input', renderLedger);
  // Analytics Period Selector
  const analyticsPeriodBtns = document.querySelectorAll('#analytics-period-btns .period-btn');
  analyticsPeriodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      analyticsPeriodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAnalytics();
    });
  });

  const analyticsMode = document.getElementById('analytics-mode');
  if (analyticsMode) {
    analyticsMode.addEventListener('change', renderAnalytics);
  }

  // Settings - Add Category
  const addCategoryForm = document.getElementById('add-category-form');
  if (addCategoryForm) {
    addCategoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('cat-name').value.trim();
      const desc = document.getElementById('cat-desc').value.trim();
      if (name) {
        if (editCategoryName) {
          // Update
          await DB.updateCategory({ name, description: desc, isDefault: false });
          editCategoryName = null;
          addCategoryForm.querySelector('button[type="submit"]').textContent = 'Add';
        } else {
          // Add New
          await DB.addCategory({ name, description: desc, isDefault: false });
        }
        document.getElementById('cat-name').value = '';
        document.getElementById('cat-desc').value = '';
        document.getElementById('cat-name').readOnly = false;
        await refreshData();
      }
    });
  }

  // Settings - Restore DB
  const restoreFile = document.getElementById('restore-file');
  const restoreTrigger = document.getElementById('btn-restore-trigger');

  if (restoreFile && restoreTrigger) {
    restoreFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        restoreTrigger.style.display = 'block';
      } else {
        restoreTrigger.style.display = 'none';
      }
    });

    restoreTrigger.addEventListener('click', async () => {
      const file = restoreFile.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (!data.wallets || !data.transactions) throw new Error("Invalid format");
          
          if (!confirm("This will completely overwrite your current data. Are you absolutely sure?")) {
            return;
          }
          
          await DB.restoreData(data);
          
          restoreFile.value = '';
          restoreTrigger.style.display = 'none';
          alert("Restore complete! The app will reload.");
          document.querySelector('.nav-link[data-target="dashboard"]').click();
          await refreshData();
        } catch(err) {
          alert("Error restoring data: " + err.message);
        }
      };
      reader.readAsText(file);
    });
  }
}

function bindTypeSelector() {
  const radios = document.querySelectorAll('input[name="type"]');
  const labels = document.querySelectorAll('.type-btn');
  const transferGroup = document.getElementById('transfer-to-group');
  const catGroup = document.getElementById('category-group');

  radios.forEach(r => {
    r.addEventListener('change', (e) => {
      // Update UI active classes
      labels.forEach(l => l.classList.remove('active'));
      r.parentElement.classList.add('active');

      if (e.target.value === 'transfer') {
        transferGroup.style.display = 'flex';
        catGroup.style.display = 'none';
      } else {
        transferGroup.style.display = 'none';
        catGroup.style.display = 'flex';
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
  list.innerHTML = '';
  
  if (wallets.length === 0) {
    list.innerHTML = '<p class="text-muted">No wallets yet. Create one.</p>';
    document.getElementById('net-worth-amount').textContent = formatMoney(0);
    const walletsTotalEl = document.getElementById('wallets-total-amount');
    if (walletsTotalEl) walletsTotalEl.textContent = formatMoney(0);
    return;
  }

  wallets.forEach(w => {
    const d = document.createElement('div');
    d.className = 'wallet-card';
    d.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; width: 100%;">
        <div>
          <span class="w-name">${w.name}</span>
          <div class="w-bal" style="margin-top: 4px;">${formatMoney(w.balance)}</div>
        </div>
        <button class="btn btn-sm btn-outline edit-wallet-btn" style="padding: 8px; border:none; cursor:pointer;" data-id="${w.id}">
          ${ICONS.pencil}
        </button>
      </div>
    `;
    list.appendChild(d);
    
    d.querySelector('.edit-wallet-btn').addEventListener('click', () => {
      editWalletId = w.id;
      document.getElementById('wallet-name').value = w.name;
      document.getElementById('wallet-balance').value = w.balance;
      
      const form = document.getElementById('add-wallet-form');
      form.querySelector('button[type="submit"]').textContent = 'Update Wallet';
      
      const awContainer = document.getElementById('add-wallet-container');
      awContainer.style.display = 'block';
      
      const fabIcon = document.querySelector('#global-fab .icon');
      if (fabIcon) fabIcon.innerHTML = ICONS.close;
    });
  });

  const total = wallets.reduce((acc, curr) => acc + curr.balance, 0);
  document.getElementById('net-worth-amount').textContent = formatMoney(total);
  const walletsTotalEl = document.getElementById('wallets-total-amount');
  if (walletsTotalEl) walletsTotalEl.textContent = formatMoney(total);
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
  const d = document.createElement('div');
  d.className = `tx-item tx-${tx.type}`;
  
  let title = tx.category;
  if (tx.type === 'transfer') {
    title = `Transfer to ${getWalletName(tx.wallet_to)}`;
  }

  let metaBase = `${new Date(tx.date).toLocaleDateString()} - ${getWalletName(tx.wallet_id)}`;
  let noteHtml = '';
  
  if (tx.note) {
    const fullMetaStr = `${metaBase} • ${tx.note}`;
    if (fullMetaStr.length > 60) {
      // Truncate note to keep total visible text around 60
      const truncateAt = Math.max(0, 50 - metaBase.length);
      noteHtml = ` • ${tx.note.substring(0, truncateAt)}...`;
    } else {
      noteHtml = ` • ${tx.note}`;
    }
  }

  d.innerHTML = `
    <div class="tx-left" style="pointer-events: none;">
      <span class="tx-title">${title}</span>
      <span class="tx-meta" style="word-wrap: break-word;">${metaBase}${noteHtml}</span>
    </div>
    <div class="tx-right" style="pointer-events: none;">
      <span class="tx-amt">${formatMoney(tx.amount, tx.type)}</span>
    </div>
  `;
  
  d.style.cursor = 'pointer';
  d.addEventListener('click', (e) => {
    e.preventDefault();
    showTxModal(tx);
  });
  
  return d;
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
  const list = document.getElementById('dashboard-recent-list');
  list.innerHTML = '';
  
  // Privacy Toggle Setup
  const nwToggle = document.getElementById('btn-toggle-nw-visibility');
  if (nwToggle) {
    nwToggle.innerHTML = netWorthVisible ? ICONS.eye : ICONS.eyeOff;
    const svg = nwToggle.querySelector('svg');
    if (svg) {
      svg.style.width = '18px';
      svg.style.height = '18px';
      svg.style.stroke = 'white';
      svg.style.fill = 'none';
      svg.style.strokeWidth = '2';
    }
  }

  const recent = transactions.slice(0, 5);
  if (recent.length === 0) {
    list.innerHTML = '<p class="text-muted">No recent activity.</p>';
  }
  
  recent.forEach(tx => list.appendChild(buildTxItem(tx)));

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

  const total = wallets.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  const nwEl = document.getElementById('net-worth-amount');
  if (nwEl) {
    nwEl.textContent = netWorthVisible ? formatMoney(total) : '₱ • • • • •';
  }

  const asOfEl = document.getElementById('as-of-date');
  if (asOfEl) {
    const today = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    asOfEl.textContent = `As of ${today.toLocaleDateString('default', options)}`;
  }

  renderDashboardBudgets();
  renderSmartInsights();
}

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
  if (sortedCats.length > 0 && insights.length < 3) {
    const topCat = sortedCats[0];
    const perc = ((topCat[1] / cur.exp) * 100).toFixed(0);
    insights.push({ title: 'Top expenditure', text: `${topCat[0]} is your #1 expense, taking up ${perc}% of your budget.`, type: 'blue', icon: ICONS.trendingUp });
  }

  if (insights.length === 0) {
    insights.push({ title: 'Welcome to Szabo!', text: 'Add your first transaction to unlock smart financial coaching.', type: 'blue', icon: ICONS.bulb });
  }

  // Render top 3
  insights.slice(0, 3).forEach(ins => {
    const card = document.createElement('div');
    card.className = `insight-card insight-${ins.type}`;
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

function renderLedger() {
  const list = document.getElementById('ledger-list');
  list.innerHTML = '';
  
  const filter = document.getElementById('ledger-wallet-filter').value;
  const searchInput = document.getElementById('ledger-search');
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = transactions;
  if (filter !== 'all') {
    filtered = filtered.filter(t => t.wallet_id === filter || t.wallet_to === filter);
  }

  if (searchTerm) {
    filtered = filtered.filter(t => {
      const cat = (t.category || 'Transfer').toLowerCase();
      const amt = String(t.amount);
      const dateStr = new Date(t.date).toLocaleDateString().toLowerCase();
      const note = (t.note || '').toLowerCase();
      
      return cat.includes(searchTerm) || amt.includes(searchTerm) || dateStr.includes(searchTerm) || note.includes(searchTerm);
    });
  }

  if (filtered.length === 0) {
    list.innerHTML = '<p class="text-muted">No transactions found.</p>';
    return;
  }

  filtered.forEach(tx => list.appendChild(buildTxItem(tx)));
}

function renderAnalytics() {
  const activePeriodBtn = document.querySelector('#analytics-period-btns .period-btn.active');
  const periodDays = activePeriodBtn ? parseInt(activePeriodBtn.getAttribute('data-value'), 10) : 30;
  
  if (isNaN(periodDays)) {
    console.error("Invalid periodDays detected in Analytics");
    return;
  }
  const mode = document.getElementById('analytics-mode').value;

  const cutoff = new Date();
  cutoff.setHours(0,0,0,0);
  cutoff.setDate(cutoff.getDate() - (periodDays - 1));

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

  const now = new Date();
  
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

function updateCategoryDatalist() {
  const dl = document.getElementById('category-list');
  if(!dl) return;
  dl.innerHTML = '';
  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    dl.appendChild(opt);
  });
}

function renderSettingsCategories() {
  const list = document.getElementById('settings-categories-list');
  if (!list) return;
  list.innerHTML = '';
  
  categories.forEach(c => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.padding = '12px 16px';
    card.style.marginBottom = '8px';
    
    let actions = '';
    if (!c.isDefault) {
      actions = `
        <div style="display:flex; gap:12px;">
          <button class="edit-cat-btn" style="background:none; border:none; color:var(--system-accent); cursor:pointer;">${ICONS.pencil}</button>
          <button class="delete-cat-btn" style="background:none; border:none; color:var(--danger); cursor:pointer;">
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `;
    }

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h4 style="margin:0; font-size:15px;">${c.name} ${c.isDefault ? '<span class="text-muted" style="font-size:10px; font-weight:400; margin-left:4px;">(Core)</span>' : ''}</h4>
          <p style="margin: 2px 0 0 0; font-size: 13px; color: var(--system-text-muted);">${c.description || 'No description'}</p>
        </div>
        ${actions}
      </div>
    `;

    if (!c.isDefault) {
      card.querySelector('.delete-cat-btn').addEventListener('click', async () => {
        if (confirm(`Delete category "${c.name}"? This won't delete historical transactions but might affect future tracking.`)) {
          await DB.deleteCategory(c.name);
          await refreshData();
        }
      });

      card.querySelector('.edit-cat-btn').addEventListener('click', () => {
        editCategoryName = c.name;
        document.getElementById('cat-name').value = c.name;
        document.getElementById('cat-name').readOnly = true; // KeyPath cannot be changed
        document.getElementById('cat-desc').value = c.description || '';
        document.getElementById('add-category-form').querySelector('button[type="submit"]').textContent = 'Update';
        document.getElementById('cat-desc').focus();
      });
    }

    list.appendChild(card);
  });
}

function updateBudgetCategorySelect() {
  const s = document.getElementById('budget-category');
  if (!s) return;
  s.innerHTML = '<option value="" disabled selected>Select Category</option>';
  categories.forEach(c => {
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
}

function renderSettingsBudgets() {
  const list = document.getElementById('settings-budgets-list');
  if (!list) return;
  list.innerHTML = '';
  
  if (budgets.length === 0) {
    list.innerHTML = '<p class="text-muted" style="padding:0 1rem; font-size:13px;">No active budgets set.</p>';
    return;
  }

  budgets.forEach(b => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.padding = '12px 16px';
    card.style.display = 'flex';
    card.style.justifyContent = 'space-between';
    card.style.alignItems = 'center';
    card.style.marginBottom = '8px';
    
    card.innerHTML = `
      <div>
        <h4 style="margin:0; font-size:15px;">${b.category}</h4>
        <p style="margin:2px 0 0 0; font-size:13px; color:var(--system-text-muted);">Limit: ${formatMoney(b.amount)}/mo</p>
      </div>
      <button class="delete-budget-btn" style="background:none; border:none; color:var(--danger); cursor:pointer;">
        <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
      </button>
    `;

    card.querySelector('.delete-budget-btn').addEventListener('click', async () => {
      if (confirm(`Remove budget for ${b.category}?`)) {
        await DB.deleteBudget(b.category);
        await refreshData();
      }
    });

    list.appendChild(card);
  });
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
