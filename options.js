// options.js

let appData = { apps: [] };
let selectedItemId = null;
let selectedItemType = null; // 'app' | 'rule'

const els = {
  sidebarNav: document.getElementById('sidebar-nav'),
  editorTitle: document.getElementById('editor-title'),
  editorContainer: document.getElementById('editor-container'),
  addAppBtn: document.getElementById('add-app-btn'),
  deleteConfigBtn: document.getElementById('delete-config-btn'),
  saveStatusIndicator: document.getElementById('save-status-indicator')
};

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  renderSidebar();

  els.addAppBtn.addEventListener('click', handleAddApp);
  els.deleteConfigBtn.addEventListener('click', handleDeleteCurrentItem);

  // Auto-Save Listeners across all dynamic inputs in the editor payload
  els.editorContainer.addEventListener('input', handleAutoSave);
  els.editorContainer.addEventListener('change', handleAutoSave);
});

let _saveTimeout = null;
function handleAutoSave(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
    syncEditorStateToData();
    
    // Debounce to prevent flooding Chrome Storage write quotas
    clearTimeout(_saveTimeout);
    _saveTimeout = setTimeout(async () => {
      await persistData(false); // don't redraw the editor to stop cursor interrupts
      
      // Flash the Auto-Saved icon organically
      els.saveStatusIndicator.style.opacity = '1';
      setTimeout(() => {
        els.saveStatusIndicator.style.opacity = '0';
      }, 1500);
      
    }, 300);
  }
}

async function loadData() {
  const result = await chrome.storage.local.get('apps');
  appData.apps = result.apps || [];
}

async function persistData(reRenderSidebar = true) {
  await chrome.storage.local.set({ apps: appData.apps });
  if (reRenderSidebar) renderSidebar();
}

function generateId(prefix) {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

// --- RENDERING ---

function renderSidebar() {
  els.sidebarNav.innerHTML = '';

  if (appData.apps.length === 0) {
    els.sidebarNav.innerHTML = '<p style="color:#9ca3af; font-size:13px; text-align:center; margin-top:20px;">No Apps yet</p>';
    return;
  }

  appData.apps.forEach(app => {
    const appEl = document.createElement('div');
    appEl.className = 'tree-app';
    
    const headerEl = document.createElement('div');
    headerEl.className = `tree-app-header ${selectedItemId === app.id ? 'active' : ''}`;
    headerEl.innerHTML = `
      <span>${escapeHTML(app.name || 'Untitled App')}</span>
      <span class="badge ${app.enabled ? '' : 'disabled'}">${app.enabled ? 'ON' : 'OFF'}</span>
    `;
    headerEl.addEventListener('click', () => selectItem('app', app.id));
    appEl.appendChild(headerEl);

    if (app.rules && app.rules.length > 0) {
      app.rules.forEach(rule => {
        const ruleEl = document.createElement('div');
        ruleEl.className = `tree-rule ${selectedItemId === rule.id ? 'active' : ''}`;
        
        const displayUrl = rule.urlPattern ? (rule.urlPattern.length > 25 ? rule.urlPattern.substring(0, 25) + '...' : rule.urlPattern) : 'New Rule';
        
        ruleEl.innerHTML = `
          <span>${escapeHTML(displayUrl)}</span>
          <span class="badge ${rule.enabled ? '' : 'disabled'}">${rule.enabled ? 'ON' : 'OFF'}</span>
        `;
        ruleEl.addEventListener('click', () => selectItem('rule', rule.id));
        appEl.appendChild(ruleEl);
      });
    }

    els.sidebarNav.appendChild(appEl);
  });
}

function selectItem(type, id) {
  if (selectedItemId) {
    syncEditorStateToData();
  }
  
  selectedItemType = type;
  selectedItemId = id;
  
  renderSidebar();
  renderEditor();
}

function renderEditor() {
  els.editorContainer.innerHTML = '';
  els.deleteConfigBtn.style.display = 'inline-flex';

  if (selectedItemType === 'app') {
    const app = appData.apps.find(a => a.id === selectedItemId);
    if (!app) return;
    
    els.editorTitle.textContent = 'Configure App';
    els.deleteConfigBtn.textContent = 'Delete App';

    els.editorContainer.innerHTML = `
      <div class="form-card">
        <div class="form-group">
          <label>App Name</label>
          <input type="text" id="edit-app-name" value="${escapeHTML(app.name)}" placeholder="e.g. Local Dashboard">
        </div>
        <div class="form-group toggle-container">
          <label class="switch">
            <input type="checkbox" id="edit-app-enabled" ${app.enabled ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
          <span>Enable all rules within this App</span>
        </div>
        <div style="margin-top: 30px;">
          <button id="add-rule-btn" class="btn primary-btn" style="width: auto;">+ Add New Rule to ${escapeHTML(app.name)}</button>
        </div>
      </div>
    `;

    document.getElementById('add-rule-btn').addEventListener('click', () => handleAddRule(app.id));

  } else if (selectedItemType === 'rule') {
    let parentApp = null;
    let rule = null;

    appData.apps.forEach(a => {
      const found = a.rules.find(r => r.id === selectedItemId);
      if (found) {
        parentApp = a;
        rule = found;
      }
    });

    if (!rule) return;

    els.editorTitle.textContent = 'Configure Rule';
    els.deleteConfigBtn.textContent = 'Delete Rule';

    els.editorContainer.innerHTML = `
      <div class="form-card">
        <div class="form-group toggle-container">
          <label class="switch">
            <input type="checkbox" id="edit-rule-enabled" ${rule.enabled ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
          <span>Enable this URL Rule</span>
        </div>
        
        <div class="flex-row">
          <div class="form-group" style="width: 150px;">
            <label>Match Type</label>
            <select id="edit-rule-matchtype">
              <option value="exact" ${rule.matchType === 'exact' ? 'selected' : ''}>Exact Match</option>
              <option value="startsWith" ${rule.matchType === 'startsWith' ? 'selected' : ''}>Starts With</option>
              <option value="wildcard" ${rule.matchType === 'wildcard' ? 'selected' : ''}>Wildcard (*)</option>
            </select>
          </div>
          <div class="form-group flex-1">
            <label>URL Pattern Matcher</label>
            <input type="text" id="edit-rule-url" value="${escapeHTML(rule.urlPattern)}" placeholder="http://localhost:*/users/*/edit">
          </div>
        </div>
      </div>

      <div class="form-card">
        <div class="fields-header">
          <h3 style="margin:0; font-size:18px; font-weight:700;">Field Mappings</h3>
          <button id="add-field-btn" class="btn secondary-btn">+ Add Field Mapping</button>
        </div>
        <div id="fields-list"></div>
      </div>
    `;

    const fieldsListEl = document.getElementById('fields-list');
    
    if (rule.fields.length === 0) {
      fieldsListEl.innerHTML = '<p style="color:#9ca3af; font-size:14px; text-align:center;">No fields mapped. Click "Add Field Mapping" above.</p>';
    } else {
      rule.fields.forEach((field, index) => {
        const fieldEl = document.createElement('div');
        fieldEl.className = 'field-item';
        fieldEl.innerHTML = `
          <div class="toggle-container" style="margin:0;" title="Enable/Disable Field">
            <label class="switch" style="width: 40px; height: 22px;">
              <input type="checkbox" class="field-enabled" data-index="${index}" ${field.enabled ? 'checked' : ''}>
              <span class="slider" style="border-radius:20px;"></span>
            </label>
          </div>
          <div>
            <label>CSS Selector</label>
            <input type="text" class="field-selector" data-index="${index}" value="${escapeHTML(field.selector)}" placeholder="#email or .user-input">
          </div>
          <div>
            <label>Content to Fill</label>
            <input type="text" class="field-content" data-index="${index}" value="${escapeHTML(field.content)}" placeholder="Value to insert">
          </div>
          <div style="display:flex; align-items:center; gap: 8px; padding-top: 24px;">
            <input type="checkbox" class="field-timestamp" data-index="${index}" style="width:16px;height:16px;" ${field.appendTimestamp ? 'checked' : ''}>
            <span style="font-size:13px; font-weight:700; color:#4b5563;">Timestamp</span>
          </div>
          <div style="padding-top:24px;">
            <button class="icon-btn delete-field-btn" data-index="${index}" title="Remove Field">✕</button>
          </div>
        `;
        fieldsListEl.appendChild(fieldEl);
      });
    }

    document.getElementById('add-field-btn').addEventListener('click', () => handleAddField(rule.id));
    
    document.querySelectorAll('.delete-field-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        handleDeleteField(rule.id, idx);
      });
    });
  }
}

// --- ACTIONS ---

function handleAddApp() {
  const newApp = {
    id: generateId('app'),
    name: 'New Application',
    enabled: true,
    rules: []
  };
  appData.apps.push(newApp);
  selectItem('app', newApp.id);
  persistData(true);
}

function handleAddRule(appId) {
  const app = appData.apps.find(a => a.id === appId);
  if (!app) return;

  const newRule = {
    id: generateId('rule'),
    urlPattern: '',
    matchType: 'wildcard',
    enabled: true,
    fields: []
  };
  app.rules.push(newRule);
  selectItem('rule', newRule.id);
  persistData(true);
}

function handleAddField(ruleId) {
  syncEditorStateToData();

  let rule = null;
  appData.apps.forEach(a => {
    const found = a.rules.find(r => r.id === ruleId);
    if (found) rule = found;
  });
  if (!rule) return;

  rule.fields.push({
    id: generateId('field'),
    selector: '',
    content: '',
    appendTimestamp: false,
    enabled: true
  });
  
  persistData(true);
  renderEditor();
}

function handleDeleteField(ruleId, fieldIndex) {
  // Explicit Alert User Confirmation for Fields
  if (!confirm("Are you sure you want to permanently remove this field mapping?")) return;

  syncEditorStateToData();

  let rule = null;
  appData.apps.forEach(a => {
    const found = a.rules.find(r => r.id === ruleId);
    if (found) rule = found;
  });
  if (!rule) return;

  rule.fields.splice(fieldIndex, 1);
  persistData(true);
  renderEditor();
}

function handleDeleteCurrentItem() {
  // Explicit Alert User Confirmation for Rules/Apps
  if (confirm("Are you sure you want to delete this configuration completely?")) {
    if (selectedItemType === 'app') {
      appData.apps = appData.apps.filter(a => a.id !== selectedItemId);
    } else if (selectedItemType === 'rule') {
      appData.apps.forEach(a => {
        a.rules = a.rules.filter(r => r.id !== selectedItemId);
      });
    }
    selectedItemId = null;
    selectedItemType = null;
    
    els.editorContainer.innerHTML = `
      <div class="empty-state">
         <p>Configuration deleted. Choose another item from the sidebar.</p>
      </div>`;
    els.deleteConfigBtn.style.display = 'none';
    els.editorTitle.textContent = 'AutoFiller Options';

    persistData(true);
  }
}

// Pulls values from DOM and updates the in-memory appData
function syncEditorStateToData() {
  if (selectedItemType === 'app') {
    const app = appData.apps.find(a => a.id === selectedItemId);
    const appNameInput = document.getElementById('edit-app-name');
    const appEnabledInput = document.getElementById('edit-app-enabled');
    if (app && appNameInput) {
      app.name = appNameInput.value;
      app.enabled = appEnabledInput.checked;
    }
  } else if (selectedItemType === 'rule') {
    let rule = null;
    appData.apps.forEach(a => {
      const found = a.rules.find(r => r.id === selectedItemId);
      if (found) rule = found;
    });

    const ruleUrlInput = document.getElementById('edit-rule-url');
    if (rule && ruleUrlInput) {
      rule.urlPattern = ruleUrlInput.value;
      rule.matchType = document.getElementById('edit-rule-matchtype').value;
      rule.enabled = document.getElementById('edit-rule-enabled').checked;

      // Sync fields
      const fieldEnableds = document.querySelectorAll('.field-enabled');
      const fieldSelectors = document.querySelectorAll('.field-selector');
      const fieldContents = document.querySelectorAll('.field-content');
      const fieldTimestamps = document.querySelectorAll('.field-timestamp');

      fieldSelectors.forEach((el, i) => {
        rule.fields[i].enabled = fieldEnableds[i].checked;
        rule.fields[i].selector = el.value;
        rule.fields[i].content = fieldContents[i].value;
        rule.fields[i].appendTimestamp = fieldTimestamps[i].checked;
      });
    }
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
