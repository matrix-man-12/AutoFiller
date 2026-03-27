import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderGit2, 
  Settings2, 
  Trash2, 
  Plus, 
  Save, 
  XSquare, 
  ExternalLink,
  Upload,
  Download,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

// ─── Export Modal ───────────────────────────────────────────────────────────
function ExportModal({ apps, onClose }) {
  // Selection state: { [appId]: { checked: bool, rules: { [ruleId]: bool } } }
  const [sel, setSel] = useState(() => {
    const init = {};
    apps.forEach(app => {
      init[app.id] = { checked: true, rules: {} };
      app.rules.forEach(r => { init[app.id].rules[r.id] = true; });
    });
    return init;
  });
  const [expanded, setExpanded] = useState({});

  const allAppsChecked = apps.every(a => sel[a.id]?.checked);

  const toggleAll = () => {
    const next = !allAppsChecked;
    const updated = {};
    apps.forEach(app => {
      updated[app.id] = { checked: next, rules: {} };
      app.rules.forEach(r => { updated[app.id].rules[r.id] = next; });
    });
    setSel(updated);
  };

  const toggleApp = (appId) => {
    setSel(prev => {
      const next = !prev[appId].checked;
      const rules = {};
      apps.find(a => a.id === appId).rules.forEach(r => { rules[r.id] = next; });
      return { ...prev, [appId]: { checked: next, rules } };
    });
  };

  const toggleRule = (appId, ruleId) => {
    setSel(prev => {
      const newRules = { ...prev[appId].rules, [ruleId]: !prev[appId].rules[ruleId] };
      const someChecked = Object.values(newRules).some(Boolean);
      return { ...prev, [appId]: { checked: someChecked, rules: newRules } };
    });
  };

  const toggleExpand = (appId) => setExpanded(prev => ({ ...prev, [appId]: !prev[appId] }));

  const handleExport = () => {
    const exportApps = apps
      .filter(a => sel[a.id]?.checked)
      .map(a => ({
        ...a,
        rules: a.rules.filter(r => sel[a.id]?.rules[r.id])
      }));

    if (exportApps.length === 0) return;

    const payload = JSON.stringify({ version: 1, apps: exportApps }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'autofiller-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const totalSelected = apps.filter(a => sel[a.id]?.checked).length;
  const totalRulesSelected = apps.reduce((acc, a) =>
    acc + (a.rules.filter(r => sel[a.id]?.rules[r.id]).length), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-xl">
              <Upload size={18} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold text-gray-900">Export Settings</h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Choose what to include in the export file</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Select all */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            onClick={toggleAll}
            className="flex items-center gap-2 text-[13px] font-bold text-primary-700 hover:text-primary-800 transition-colors cursor-pointer"
          >
            {allAppsChecked
              ? <CheckSquare size={16} className="text-primary-600" />
              : <Square size={16} className="text-gray-400" />
            }
            {allAppsChecked ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-[12px] font-semibold text-gray-500">
            {totalSelected} app{totalSelected !== 1 ? 's' : ''} · {totalRulesSelected} rule{totalRulesSelected !== 1 ? 's' : ''}
          </span>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-[340px] px-4 py-3 space-y-1">
          {apps.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-[13px] font-semibold">No apps to export.</div>
          ) : (
            apps.map(app => (
              <div key={app.id} className="rounded-xl border border-gray-100 overflow-hidden">
                {/* App row */}
                <div className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => toggleApp(app.id)}
                    className="shrink-0 cursor-pointer"
                  >
                    {sel[app.id]?.checked
                      ? <CheckSquare size={17} className="text-primary-600" />
                      : <Square size={17} className="text-gray-300" />
                    }
                  </button>
                  <FolderGit2 size={15} className="text-gray-400 shrink-0" />
                  <span className="flex-1 text-[13px] font-bold text-gray-800 truncate">{app.name || 'Untitled App'}</span>
                  {app.rules.length > 0 && (
                    <button
                      onClick={() => toggleExpand(app.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {expanded[app.id]
                        ? <ChevronDown size={15} />
                        : <ChevronRight size={15} />
                      }
                    </button>
                  )}
                  <span className="text-[11px] font-bold text-gray-400 ml-1">
                    {app.rules.filter(r => sel[app.id]?.rules[r.id]).length}/{app.rules.length} rules
                  </span>
                </div>

                {/* Rules sub-list */}
                {expanded[app.id] && app.rules.length > 0 && (
                  <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 space-y-1.5">
                    {app.rules.map(rule => (
                      <label key={rule.id} className="flex items-center gap-3 cursor-pointer group">
                        <button onClick={() => toggleRule(app.id, rule.id)} className="shrink-0 cursor-pointer">
                          {sel[app.id]?.rules[rule.id]
                            ? <CheckSquare size={15} className="text-primary-500" />
                            : <Square size={15} className="text-gray-300" />
                          }
                        </button>
                        <Settings2 size={13} className="text-gray-400 shrink-0" />
                        <span className="text-[12px] font-semibold text-gray-600 truncate group-hover:text-gray-800 transition-colors">
                          {rule.urlPattern || 'No URL pattern'}
                        </span>
                        <span className="ml-auto text-[10px] font-bold text-gray-400 shrink-0">{rule.fields.length} fields</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={totalSelected === 0}
            className="flex items-center gap-2 px-5 py-2 text-[13px] font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <Upload size={15} />
            Export {totalSelected > 0 ? `(${totalSelected} app${totalSelected !== 1 ? 's' : ''})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, type = 'success', onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-[13px] font-bold animate-in fade-in slide-in-from-bottom-4 duration-300 ${
      type === 'success'
        ? 'bg-white border-success-500/30 text-gray-800'
        : 'bg-white border-danger-300 text-gray-800'
    }`}>
      {type === 'success'
        ? <CheckCircle2 size={17} className="text-success-500 shrink-0" />
        : <AlertTriangle size={17} className="text-yellow-500 shrink-0" />
      }
      {message}
      <button onClick={onDismiss} className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer">
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Options() {
  const [apps, setApps] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null); // 'app' or 'rule'
  const [saveStatus, setSaveStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  const saveTimeoutRef = useRef(null);
  const importInputRef = useRef(null);

  // Load Data
  useEffect(() => {
    async function initLoader() {
      if (typeof window.chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.local.get('apps');
        if (result.apps) setApps(result.apps);
      } else {
        console.warn("Dev mode: Standard initial data.");
      }
      setLoading(false);
    }
    initLoader();
  }, []);

  // Save Data Function triggered aggressively by edits
  const persistData = async (newApps) => {
    setApps(newApps);
    if (typeof window.chrome !== 'undefined' && chrome.storage) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        await chrome.storage.local.set({ apps: newApps });
        setSaveStatus(true);
        setTimeout(() => setSaveStatus(false), 2000);
      }, 400); // 400ms debounce
    }
  }

  // ─── Import Handler ────────────────────────────────────────────────────────
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const importedApps = Array.isArray(parsed) ? parsed : (parsed.apps ?? []);

        if (!Array.isArray(importedApps) || importedApps.length === 0) {
          setToast({ message: 'No valid apps found in the file.', type: 'warn' });
          return;
        }

        setApps(prev => {
          // Build lookup maps for fast collision checks
          const existingAppMap = new Map(prev.map(a => [a.id, a]));
          const allExistingRuleIds = new Set(prev.flatMap(a => a.rules.map(r => r.id)));

          let addedApps = 0;
          let addedRules = 0;

          // Start with a deep-cloned copy of existing apps so we can mutate safely
          const result = prev.map(a => ({ ...a, rules: [...a.rules] }));

          for (const importedApp of importedApps) {
            if (existingAppMap.has(importedApp.id)) {
              // App already exists → merge rules into it
              const existingApp = result.find(a => a.id === importedApp.id);
              const existingRuleIdsInApp = new Set(existingApp.rules.map(r => r.id));

              for (const rule of (importedApp.rules ?? [])) {
                if (!existingRuleIdsInApp.has(rule.id)) {
                  // Rule is new to this app — also ensure no global ID collision
                  const safeRule = allExistingRuleIds.has(rule.id)
                    ? { ...rule, id: generateId('rule') }
                    : rule;
                  existingApp.rules.push(safeRule);
                  allExistingRuleIds.add(safeRule.id);
                  addedRules++;
                }
                // If rule id already in this app → skip (no overwrite)
              }
            } else {
              // Brand-new app → append it, de-collide any rule ids
              const sanitizedRules = (importedApp.rules ?? []).map(rule => {
                if (allExistingRuleIds.has(rule.id)) {
                  const newId = generateId('rule');
                  allExistingRuleIds.add(newId);
                  return { ...rule, id: newId };
                }
                allExistingRuleIds.add(rule.id);
                return rule;
              });
              result.push({ ...importedApp, rules: sanitizedRules });
              addedApps++;
              addedRules += sanitizedRules.length;
            }
          }

          // Persist merged result
          if (typeof window.chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ apps: result });
          }

          // Toast message
          if (addedApps === 0 && addedRules === 0) {
            setToast({ message: 'Everything in this file already exists — nothing was added.', type: 'warn' });
          } else {
            const parts = [];
            if (addedApps > 0) parts.push(`${addedApps} app${addedApps !== 1 ? 's' : ''}`);
            if (addedRules > 0) parts.push(`${addedRules} rule${addedRules !== 1 ? 's' : ''}`);
            setToast({ message: `Imported: ${parts.join(', ')}.`, type: 'success' });
          }

          return result;
        });
      } catch {
        setToast({ message: 'Invalid JSON file — could not import.', type: 'warn' });
      }
    };
    reader.readAsText(file);
    // Reset so same file can be re-imported if needed
    e.target.value = '';
  };

  const handleAddApp = () => {
    const newApp = {
      id: generateId('app'),
      name: 'New Application',
      enabled: true,
      rules: []
    };
    const cloned = [...apps, newApp];
    persistData(cloned);
    setSelectedItemType('app');
    setSelectedItemId(newApp.id);
  };

  const handleAddRule = (appId) => {
    const cloned = [...apps];
    const appIndex = cloned.findIndex(a => a.id === appId);
    if (appIndex === -1) return;

    const newRule = {
      id: generateId('rule'),
      urlPattern: '',
      matchType: 'wildcard',
      enabled: true,
      fields: []
    };
    cloned[appIndex].rules.push(newRule);
    persistData(cloned);
    setSelectedItemType('rule');
    setSelectedItemId(newRule.id);
  };

  const currentApp = selectedItemType === 'app' ? apps.find(a => a.id === selectedItemId) : null;
  const currentRule = selectedItemType === 'rule' ? 
    apps.flatMap(a => a.rules).find(r => r.id === selectedItemId) : null;
  
  const updateAppField = (appId, field, value) => {
    const cloned = [...apps];
    const idx = cloned.findIndex(a => a.id === appId);
    if (idx !== -1) {
      cloned[idx][field] = value;
      persistData(cloned);
    }
  };

  const updateRuleField = (ruleId, field, value) => {
    const cloned = [...apps];
    for (let a of cloned) {
      const r = a.rules.find(rx => rx.id === ruleId);
      if (r) {
        r[field] = value;
        persistData(cloned);
        return;
      }
    }
  };

  const addFieldMapping = (ruleId) => {
    const cloned = [...apps];
    for (let a of cloned) {
      const r = a.rules.find(rx => rx.id === ruleId);
      if (r) {
        r.fields.push({
          id: generateId('field'),
          selector: '',
          content: '',
          appendTimestamp: false,
          enabled: true
        });
        persistData(cloned);
        return;
      }
    }
  };

  const updateMappingField = (ruleId, fieldId, prop, value) => {
    const cloned = [...apps];
    for (let a of cloned) {
      const r = a.rules.find(rx => rx.id === ruleId);
      if (r) {
        const mapping = r.fields.find(f => f.id === fieldId);
        if (mapping) {
          mapping[prop] = value;
          persistData(cloned);
          return;
        }
      }
    }
  };

  const deleteMapping = (ruleId, fieldId) => {
    if (!window.confirm('Permanently remove this DOM field mapping?')) return;
    const cloned = [...apps];
    for (let a of cloned) {
      const r = a.rules.find(rx => rx.id === ruleId);
      if (r) {
        r.fields = r.fields.filter(f => f.id !== fieldId);
        persistData(cloned);
        return;
      }
    }
  };

  const handleDeleteCurrent = () => {
    if (!window.confirm('Permanently delete this configuration branch?')) return;
    let cloned = [...apps];
    if (selectedItemType === 'app') {
      cloned = cloned.filter(a => a.id !== selectedItemId);
    } else if (selectedItemType === 'rule') {
      cloned.forEach(a => {
        a.rules = a.rules.filter(r => r.id !== selectedItemId);
      });
    }
    persistData(cloned);
    setSelectedItemId(null);
    setSelectedItemType(null);
  };

  if (loading) return null;

  return (
    <div className="flex h-full w-full font-sans text-gray-900 bg-gray-50 overflow-hidden">

      {/* Hidden file input for import */}
      <input
        ref={importInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal apps={apps} onClose={() => setShowExportModal(false)} />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      {/* Sidebar UI */}
      <aside className="w-80 flex flex-col bg-white border-r border-gray-200 shadow-sm z-10 shrink-0">
        <div className="p-6 pb-5 border-b border-gray-200">
          <h1 className="text-[26px] font-extrabold text-primary-600 tracking-tight">AutoFiller</h1>
          <p className="text-sm font-semibold text-gray-500 mt-0.5">Architecture Configuration</p>
          <a 
            href="../help.html" 
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 mt-5 py-2 px-3.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <ExternalLink size={14} /> Documentation
          </a>

          {/* Import / Export buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => importInputRef.current?.click()}
              title="Import settings from a JSON file (merges with existing)"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
            >
              <Download size={13} />
              Import
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              title="Export settings to a JSON file"
              disabled={apps.length === 0}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-primary-50 hover:bg-primary-100 border border-primary-200 hover:border-primary-300 text-primary-700 text-xs font-bold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Upload size={13} />
              Export
            </button>
          </div>
        </div>

        <div className="p-4">
          <button 
            onClick={handleAddApp}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-[10px] font-bold shadow-sm transition-all hover:-translate-y-px cursor-pointer cursor-pointer"
          >
            <Plus size={18} /> Add Root App
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-6 space-y-4">
          {apps.length === 0 ? (
            <div className="text-center mt-8 text-gray-400 text-[13px] font-semibold bg-gray-50 py-4 rounded-xl border border-dashed border-gray-200">
              No Apps configured.
            </div>
          ) : (
            apps.map(app => (
              <div key={app.id} className="space-y-1">
                {/* App Header Row */}
                <div 
                  onClick={() => { setSelectedItemType('app'); setSelectedItemId(app.id); }}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    selectedItemId === app.id && selectedItemType === 'app' ? "bg-primary-50 text-primary-700" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-[14px]">
                    <FolderGit2 size={16} className={selectedItemType === 'app' && selectedItemId === app.id ? "text-primary-600" : "text-gray-400"} />
                    <span className="truncate w-36">{app.name || 'Untitled App'}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${app.enabled ? "bg-gray-200 text-gray-700" : "bg-danger-100 text-danger-600"}`}>
                    {app.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>

                {/* Rules Sub-list */}
                {app.rules.map(r => (
                  <div 
                    key={r.id}
                    onClick={() => { setSelectedItemType('rule'); setSelectedItemId(r.id); }}
                    className={`ml-5 flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                      selectedItemId === r.id && selectedItemType === 'rule' ? "bg-primary-50 text-primary-700" : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-[13px] font-semibold truncate">
                      <Settings2 size={14} className={selectedItemType === 'rule' && selectedItemId === r.id ? "text-primary-500" : "text-gray-400"}/>
                      <span className="truncate w-[120px]">{r.urlPattern || 'New Rule'}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${r.enabled ? "bg-gray-200 text-gray-600" : "bg-danger-100 text-danger-600"}`}>
                      {r.enabled ? 'ON' : 'OFF'}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Editor UI */}
      <main className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
        
        {/* Editor Top Bar */}
        <header className="h-[88px] bg-white border-b border-gray-200 px-10 flex items-center justify-between shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)] z-0">
          <h2 className="text-[22px] font-extrabold tracking-tight text-gray-800">
            {selectedItemType === 'app' ? "Configure Root Provider" : selectedItemType === 'rule' ? "Target Routing Mechanism" : "Initialization Request"}
          </h2>
          <div className="flex items-center gap-6">
            <span className={`flex items-center gap-1.5 text-[13px] font-bold text-success-500 transition-all duration-300 ${saveStatus ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
              <Save size={16} /> Secure Auto-Save Active
            </span>
            {selectedItemId && (
              <button 
                onClick={handleDeleteCurrent}
                className="flex items-center gap-2 bg-white border border-danger-200 text-danger-500 hover:bg-danger-50 hover:border-danger-300 hover:text-danger-600 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer shadow-sm hover:shadow"
              >
                <Trash2 size={16} />
                Drop Node
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Editor Pane */}
        <div className="flex-1 p-10 overflow-y-auto">
          {!selectedItemId && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
                <FolderGit2 size={40} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">No Node Selected</h3>
                <p className="text-[14px] text-gray-500 font-medium">Click "Add Root App" on the sidebar to begin building the payload ruleset.</p>
              </div>
            </div>
          )}

          {/* APP EDITOR */}
          {selectedItemType === 'app' && currentApp && (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100 border-t-4 border-t-primary-500">
                <div className="mb-8">
                  <label className="block text-sm font-extrabold text-gray-700 mb-2.5">Application Title Reference</label>
                  <input 
                    type="text" 
                    value={currentApp.name} 
                    onChange={(e) => updateAppField(currentApp.id, 'name', e.target.value)}
                    placeholder="e.g. Identity Management Core"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-[3px] focus:ring-primary-500/20 focus:border-primary-500 hover:border-gray-300 font-semibold text-gray-800 transition-all shadow-sm"
                  />
                </div>
                
                <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <label className="relative inline-flex items-center cursor-pointer disabled:opacity-50">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={currentApp.enabled} 
                      onChange={(e) => updateAppField(currentApp.id, 'enabled', e.target.checked)}
                    />
                    <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success-500 shadow-inner"></div>
                  </label>
                  <div>
                    <h4 className="text-[14px] font-extrabold text-gray-800">Master Killswitch Configuration</h4>
                    <p className="text-[12px] font-medium text-gray-500 mt-0.5">Disable this node to automatically kill all internal active rule instances.</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 text-right">
                  <button 
                    onClick={() => handleAddRule(currentApp.id)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-50 hover:bg-primary-100 text-primary-700 font-extrabold rounded-xl transition-all cursor-pointer"
                  >
                    <Plus size={18} /> Spawn Target Rule Sub-Node
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RULE EDITOR */}
          {selectedItemType === 'rule' && currentRule && (
             <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
               {/* URL Meta Block */}
               <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100 border-t-4 border-t-primary-500 mb-10 text-left">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                  <h3 className="text-xl font-extrabold text-gray-800">Target Mechanism Constraints</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-extrabold text-gray-600">Active Listener</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={currentRule.enabled} onChange={(e) => updateRuleField(currentRule.id, 'enabled', e.target.checked)}/>
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success-500 shadow-inner"></div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-56 shrink-0">
                    <label className="block text-[13px] font-extrabold text-gray-500 mb-2">Evaluator Protocol</label>
                    <select 
                      value={currentRule.matchType}
                      onChange={(e) => updateRuleField(currentRule.id, 'matchType', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl focus:outline-none focus:ring-[3px] focus:ring-primary-500/20 focus:border-primary-500 font-bold text-gray-700 transition-colors"
                    >
                      <option value="exact">Strict Exact Routing</option>
                      <option value="startsWith">Loose Starts With</option>
                      <option value="wildcard">Generic Wildcard (*)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-extrabold text-gray-500 mb-2">Constraint Expression / Uniform Resource Locator</label>
                    <input 
                      type="text" 
                      value={currentRule.urlPattern}
                      onChange={(e) => updateRuleField(currentRule.id, 'urlPattern', e.target.value)}
                      placeholder="e.g. http://localhost:*/api/v1/*/auth"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl focus:outline-none focus:ring-[3px] focus:ring-primary-500/20 focus:border-primary-500 font-semibold text-gray-800 transition-all"
                    />
                  </div>
                </div>
               </div>

               {/* Field Mappings Block */}
               <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                   <h3 className="text-xl font-extrabold text-gray-800">Payload Traversal Mappings</h3>
                   <button 
                     onClick={() => addFieldMapping(currentRule.id)}
                     className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800 font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                   >
                     <Plus size={18} className="text-primary-600" /> New Injection Instance
                   </button>
                </div>

                <div className="space-y-4">
                  {currentRule.fields.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <Settings2 size={32} className="mx-auto text-gray-300 mb-3" />
                      <h4 className="text-[15px] font-extrabold text-gray-600 mb-1">No Virtual DOM constraints resolved.</h4>
                      <p className="text-[14px] text-gray-500 font-medium">Map logic to internal nodes to initiate autofill algorithms.</p>
                    </div>
                  ) : (
                    currentRule.fields.map((field) => (
                      <div key={field.id} className="group relative flex flex-col md:flex-row items-center gap-4 p-5 bg-white border border-gray-200 rounded-[14px] hover:border-primary-400 hover:shadow-md transition-all shadow-sm">
                        
                        {/* Dynamic Floating ID */}
                        <div className="absolute -top-2.5 left-4 bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold border border-gray-200 hidden md:block">Node_ID: {field.id}</div>

                        <div className="flex flex-col items-center gap-1">
                          <label className="relative inline-flex items-center cursor-pointer" title="Enable Field">
                            <input type="checkbox" className="sr-only peer" checked={field.enabled} onChange={(e) => updateMappingField(currentRule.id, field.id, 'enabled', e.target.checked)}/>
                            <div className="w-[38px] h-[22px] bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-primary-500 shadow-inner"></div>
                          </label>
                        </div>

                        <div className="flex-1 w-full relative group">
                          <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-400 mb-1.5">CSS / XPath Traverser</label>
                          <input type="text" value={field.selector} onChange={(e) => updateMappingField(currentRule.id, field.id, 'selector', e.target.value)} placeholder="#username or //div/input" className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none font-semibold text-[14px] font-mono text-gray-700 transition-colors"/>
                        </div>

                        <div className="flex-1 w-full">
                          <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-400 mb-1.5">Static Text Injection Payload</label>
                          <input type="text" value={field.content} onChange={(e) => updateMappingField(currentRule.id, field.id, 'content', e.target.value)} placeholder="Type simulation data..." className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-[3px] focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none font-semibold text-[14px] font-mono text-primary-700 transition-colors"/>
                        </div>

                        <div className="flex items-center justify-center shrink-0 w-max pt-6">
                          <label className="flex items-center justify-center gap-2 cursor-pointer bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm">
                            <input type="checkbox" checked={field.appendTimestamp} onChange={(e) => updateMappingField(currentRule.id, field.id, 'appendTimestamp', e.target.checked)} className="w-[18px] h-[18px] cursor-pointer text-primary-600 rounded focus:ring-primary-500 accent-primary-600"/>
                            <span className="text-[13px] font-extrabold text-gray-700">Timestamp</span>
                          </label>
                        </div>

                        <div className="pt-6">
                          <button onClick={() => deleteMapping(currentRule.id, field.id)} className="p-2.5 bg-white border border-gray-200 text-gray-400 hover:bg-danger-50 hover:border-danger-200 hover:text-danger-600 rounded-lg transition-colors cursor-pointer shadow-sm" title="Eradicate Node Mapping">
                            <XSquare size={20} />
                          </button>
                        </div>

                      </div>
                    ))
                  )}
                </div>
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
