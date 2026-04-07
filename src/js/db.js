// db.js - IndexedDB Wrapper

const DB_NAME = 'SzaboLedger';
const DB_VERSION = 4;

let db;

export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => reject(event.target.error);

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Wallets Store
      if (!db.objectStoreNames.contains('wallets')) {
        const walletStore = db.createObjectStore('wallets', { keyPath: 'id' });
        walletStore.createIndex('name', 'name', { unique: false });
      }

      // Transactions Store
      if (!db.objectStoreNames.contains('transactions')) {
        const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
        txStore.createIndex('wallet_id', 'wallet_id', { unique: false });
        txStore.createIndex('date', 'date', { unique: false });
        txStore.createIndex('type', 'type', { unique: false });
      }

      // Budgets Store
      if (!db.objectStoreNames.contains('budgets')) {
        db.createObjectStore('budgets', { keyPath: 'category' });
      }

      // Categories Store
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'name' });
      }

      // Goals Store
      if (!db.objectStoreNames.contains('goals')) {
        db.createObjectStore('goals', { keyPath: 'id' });
      }

      // Goal History Store
      if (!db.objectStoreNames.contains('goal_history')) {
        const historyStore = db.createObjectStore('goal_history', { keyPath: 'id' });
        historyStore.createIndex('goal_id', 'goal_id', { unique: false });
      }
    };
  });
}

// ----- Core Helpers -----
function runTx(storeName, mode, callback) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    let result;
    
    transaction.oncomplete = () => resolve(result);
    transaction.onerror = (e) => reject(e.target.error);
    
    // Callback can perform store operations and optionally set `result`
    const request = callback(store);
    if (request) {
      request.onsuccess = (e) => { result = e.target.result; };
    }
  });
}

function getAll(storeName) {
  return runTx(storeName, 'readonly', (store) => store.getAll());
}

function put(storeName, item) {
  return runTx(storeName, 'readwrite', (store) => store.put(item));
}

function get(storeName, key) {
  return runTx(storeName, 'readonly', (store) => store.get(key));
}

function clearStore(storeName) {
  return runTx(storeName, 'readwrite', (store) => store.clear());
}

export const DB = {
  // Wallets
  getWallets: () => getAll('wallets'),
  addWallet: (wallet) => put('wallets', { 
    id: crypto.randomUUID(), 
    ...wallet 
  }),
  updateWallet: (wallet) => put('wallets', wallet),
  getWallet: (id) => get('wallets', id),
  deleteWallet: (id) => runTx('wallets', 'readwrite', (store) => store.delete(id)),

  // Transactions
  getTransactions: () => getAll('transactions'),
  addTransaction: async (tx) => {
    const txData = { id: crypto.randomUUID(), ...tx };
    await put('transactions', txData);
    
    // Update Wallet Balances Logically
    const w = await get('wallets', tx.wallet_id);
    if (w) {
      if (tx.type === 'income') w.balance += tx.amount;
      else if (tx.type === 'expense') w.balance -= tx.amount;
      else if (tx.type === 'transfer') {
        w.balance -= tx.amount; // Withdraw from origin
        const wTo = await get('wallets', tx.wallet_to);
        if (wTo) {
          wTo.balance += tx.amount;
          await put('wallets', wTo);
        }
      }
      await put('wallets', w);
    }
    return txData;
  },

  // Budgets
  getBudgets: () => getAll('budgets'),
  setBudget: (budget) => put('budgets', budget),
  deleteBudget: (category) => runTx('budgets', 'readwrite', (store) => store.delete(category)),

  // Categories
  getCategories: () => getAll('categories'),
  addCategory: (category) => put('categories', category), // { name, description, isDefault }
  updateCategory: (category) => put('categories', category),
  deleteCategory: (name) => runTx('categories', 'readwrite', (store) => store.delete(name)),

  // Goals
  getGoals: () => getAll('goals'),
  addGoal: (goal) => put('goals', { id: crypto.randomUUID(), ...goal }),
  updateGoal: (goal) => put('goals', goal),
  deleteGoal: async (id) => {
    await runTx('goal_history', 'readwrite', (store) => {
      const index = store.index('goal_id');
      const request = index.openCursor(IDBKeyRange.only(id));
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    });
    return runTx('goals', 'readwrite', (store) => store.delete(id));
  },

  // Goal History
  getGoalHistory: async (goalId) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('goal_history', 'readonly');
      const store = transaction.objectStore('goal_history');
      const index = store.index('goal_id');
      const request = index.getAll(IDBKeyRange.only(goalId));
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  },
  addGoalHistory: (item) => put('goal_history', { id: crypto.randomUUID(), ...item }),
  deleteGoalHistory: async (goalId) => {
    return runTx('goal_history', 'readwrite', (store) => {
      const index = store.index('goal_id');
      const request = index.openCursor(IDBKeyRange.only(goalId));
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    });
  },

  // System
  clearStore: (storeName) => clearStore(storeName),
  restoreData: async (data) => {
    await clearStore('wallets');
    await clearStore('transactions');
    try { await clearStore('categories'); } catch(e){}
    try { await clearStore('budgets'); } catch(e){}
    try { await clearStore('goals'); } catch(e){}
    try { await clearStore('goal_history'); } catch(e){}

    if(data.wallets) {
      for(const w of data.wallets) await put('wallets', w);
    }
    if(data.transactions) {
      for(const t of data.transactions) await put('transactions', t);
    }
    if(data.categories) {
      for(const c of data.categories) await put('categories', c);
    }
    if(data.budgets) {
      for(const b of data.budgets) await put('budgets', b);
    }
    if(data.goals) {
      for(const g of data.goals) await put('goals', g);
    }
    if(data.goal_history) {
      for(const h of data.goal_history) await put('goal_history', h);
    }
  }
};
