import './styles/themes.css'
import './styles/main.css'
import './styles/layout.css'
import './styles/components.css'

import { initDB } from './js/db.js'
import { initUI } from './js/ui.js'

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initDB();
    initUI();
  } catch (err) {
    console.error("Failed to initialize Szabo Financial Tracker", err);
    alert("Database initialization error. Please ensure you are not in Private/Incognito mode.");
  }
});
