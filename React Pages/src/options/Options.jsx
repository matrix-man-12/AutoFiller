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
  AlertTriangle,
  Sun,
  Moon,
  Globe,
  Layers,
  FileText
} from 'lucide-react';

const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

// ─── SVG Background ─────────────────────────────────────────────────────────
function SvgBackground() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const strokeColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(180,160,130,0.08)';
  
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      viewBox="0 0 1440 900"
    >
      {/* Topographic contour lines */}
      <path d="M0 340 Q360 280 720 350 Q1080 420 1440 320" fill="none" stroke={strokeColor} strokeWidth="1.5"/>
      <path d="M0 380 Q400 320 800 390 Q1100 440 1440 360" fill="none" stroke={strokeColor} strokeWidth="1.2"/>
      <path d="M0 420 Q300 370 650 430 Q1000 480 1440 400" fill="none" stroke={strokeColor} strokeWidth="1"/>
      <path d="M0 480 Q350 430 700 490 Q1050 540 1440 450" fill="none" stroke={strokeColor} strokeWidth="0.8"/>
      <path d="M0 540 Q380 500 750 540 Q1100 580 1440 510" fill="none" stroke={strokeColor} strokeWidth="0.6"/>
      <path d="M0 600 Q320 560 680 610 Q1020 650 1440 570" fill="none" stroke={strokeColor} strokeWidth="0.5"/>
      <path d="M0 660 Q400 640 780 660 Q1100 700 1440 640" fill="none" stroke={strokeColor} strokeWidth="0.4"/>
      
      {/* Secondary wave set offset */}
      <path d="M0 200 Q500 160 900 220 Q1200 260 1440 190" fill="none" stroke={strokeColor} strokeWidth="0.7"/>
      <path d="M0 240 Q420 200 850 260 Q1150 300 1440 230" fill="none" stroke={strokeColor} strokeWidth="0.5"/>
      <path d="M0 150 Q600 120 1000 170 Q1300 200 1440 140" fill="none" stroke={strokeColor} strokeWidth="0.4"/>
      
      {/* Subtle circles */}
      <circle cx="200" cy="700" r="160" fill="none" stroke={strokeColor} strokeWidth="0.6"/>
      <circle cx="200" cy="700" r="200" fill="none" stroke={strokeColor} strokeWidth="0.4"/>
      <circle cx="1200" cy="200" r="140" fill="none" stroke={strokeColor} strokeWidth="0.5"/>
      <circle cx="1200" cy="200" r="180" fill="none" stroke={strokeColor} strokeWidth="0.3"/>
    </svg>
  );
}

// ─── Delete Confirmation Modal ───────────────────────────────────────────────
function DeleteModal({ title, description, onConfirm, onCancel }) {
  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-surface-overlay)' }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div 
        className="w-full max-w-sm mx-4 rounded-2xl shadow-2xl overflow-hidden border"
        style={{ 
          backgroundColor: 'var(--color-surface-card)', 
          borderColor: 'var(--color-border)' 
        }}
      >
        <div className="p-6 text-center">
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--color-danger-50)' }}
          >
            <AlertTriangle size={28} className="text-danger-500" />
          </div>
          <h3 
            className="text-lg font-bold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {title}
          </h3>
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {description}
          </p>
        </div>
        <div 
          className="flex gap-3 px-6 py-4 border-t"
          style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-raised)' }}
        >
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 text-sm font-bold rounded-xl border cursor-pointer"
            style={{ 
              backgroundColor: 'var(--color-surface-card)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 text-sm font-bold rounded-xl cursor-pointer text-white bg-danger-500 hover:bg-danger-600 border border-danger-500 hover:border-danger-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Export Modal ───────────────────────────────────────────────────────────
function ExportModal({ apps, onClose }) {
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center" 
      style={{ backgroundColor: 'var(--color-surface-overlay)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden border"
        style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-xl">
              <Upload size={18} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Export Settings</h2>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Choose what to include in the export file</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Select all */}
        <div 
          className="px-6 py-3 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-raised)' }}
        >
          <button
            onClick={toggleAll}
            className="flex items-center gap-2 text-[13px] font-bold text-primary-600 cursor-pointer"
          >
            {allAppsChecked
              ? <CheckSquare size={16} className="text-primary-600" />
              : <Square size={16} style={{ color: 'var(--color-text-tertiary)' }} />
            }
            {allAppsChecked ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-[12px] font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
            {totalSelected} app{totalSelected !== 1 ? 's' : ''} · {totalRulesSelected} rule{totalRulesSelected !== 1 ? 's' : ''}
          </span>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-[340px] px-4 py-3 space-y-1">
          {apps.length === 0 ? (
            <div className="text-center py-10 text-[13px] font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>No apps to export.</div>
          ) : (
            apps.map(app => (
              <div key={app.id} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border-subtle)' }}>
                {/* App row */}
                <div 
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ backgroundColor: 'var(--color-surface-card)' }}
                >
                  <button
                    onClick={() => toggleApp(app.id)}
                    className="shrink-0 cursor-pointer"
                  >
                    {sel[app.id]?.checked
                      ? <CheckSquare size={17} className="text-primary-600" />
                      : <Square size={17} style={{ color: 'var(--color-text-tertiary)' }} />
                    }
                  </button>
                  <FolderGit2 size={15} style={{ color: 'var(--color-text-tertiary)' }} className="shrink-0" />
                  <span className="flex-1 text-[13px] font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>{app.name || 'Untitled App'}</span>
                  {app.rules.length > 0 && (
                    <button
                      onClick={() => toggleExpand(app.id)}
                      className="cursor-pointer"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      {expanded[app.id]
                        ? <ChevronDown size={15} />
                        : <ChevronRight size={15} />
                      }
                    </button>
                  )}
                  <span className="text-[11px] font-bold ml-1" style={{ color: 'var(--color-text-tertiary)' }}>
                    {app.rules.filter(r => sel[app.id]?.rules[r.id]).length}/{app.rules.length} rules
                  </span>
                </div>

                {/* Rules sub-list */}
                {expanded[app.id] && app.rules.length > 0 && (
                  <div 
                    className="border-t px-4 py-2 space-y-1.5"
                    style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-raised)' }}
                  >
                    {app.rules.map(rule => (
                      <label key={rule.id} className="flex items-center gap-3 cursor-pointer group">
                        <button onClick={() => toggleRule(app.id, rule.id)} className="shrink-0 cursor-pointer">
                          {sel[app.id]?.rules[rule.id]
                            ? <CheckSquare size={15} className="text-primary-500" />
                            : <Square size={15} style={{ color: 'var(--color-text-tertiary)' }} />
                          }
                        </button>
                        <Globe size={13} style={{ color: 'var(--color-text-tertiary)' }} className="shrink-0" />
                        <span className="text-[12px] font-semibold truncate" style={{ color: 'var(--color-text-secondary)' }}>
                          {rule.urlPattern || 'No URL pattern'}
                        </span>
                        <span className="ml-auto text-[10px] font-bold shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>{rule.fields.length} fields</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-end gap-3 px-6 py-4 border-t"
          style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-raised)' }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 text-[13px] font-bold rounded-xl border cursor-pointer"
            style={{ 
              backgroundColor: 'var(--color-surface-card)', 
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)' 
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={totalSelected === 0}
            className="flex items-center gap-2 px-5 py-2 text-[13px] font-bold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl cursor-pointer shadow-sm"
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
    <div 
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-[13px] font-bold ${
        type === 'success'
          ? 'border-success-500/30'
          : 'border-danger-300'
      }`}
      style={{ backgroundColor: 'var(--color-surface-card)', color: 'var(--color-text-primary)' }}
    >
      {type === 'success'
        ? <CheckCircle2 size={17} className="text-success-500 shrink-0" />
        : <AlertTriangle size={17} className="text-primary-400 shrink-0" />
      }
      {message}
      <button onClick={onDismiss} className="ml-2 cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Theme Toggle Hook ───────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('autofiller-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('autofiller-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  return { theme, toggle };
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
  const [deleteModal, setDeleteModal] = useState(null); // { title, description, onConfirm }
  const [sidebarCollapsed, setSidebarCollapsed] = useState({});

  const { theme, toggle: toggleTheme } = useTheme();

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
    setDeleteModal({
      title: 'Remove Field',
      description: 'This field mapping will be permanently deleted. This action cannot be undone.',
      onConfirm: () => {
        const cloned = [...apps];
        for (let a of cloned) {
          const r = a.rules.find(rx => rx.id === ruleId);
          if (r) {
            r.fields = r.fields.filter(f => f.id !== fieldId);
            persistData(cloned);
            break;
          }
        }
        setDeleteModal(null);
      }
    });
  };

  const handleDeleteCurrent = () => {
    const itemName = selectedItemType === 'app' 
      ? (currentApp?.name || 'this application')
      : (currentRule?.urlPattern || 'this URL rule');
    
    setDeleteModal({
      title: selectedItemType === 'app' ? 'Delete Application' : 'Delete URL Rule',
      description: `"${itemName}" and all its contents will be permanently deleted. This action cannot be undone.`,
      onConfirm: () => {
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
        setDeleteModal(null);
      }
    });
  };

  const toggleSidebarApp = (appId) => {
    setSidebarCollapsed(prev => ({ ...prev, [appId]: !prev[appId] }));
  };

  if (loading) return null;

  return (
    <div className="flex h-full w-full overflow-hidden relative" style={{ backgroundColor: 'var(--color-surface)' }}>

      {/* SVG Background */}
      <SvgBackground key={theme} />

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

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteModal 
          title={deleteModal.title}
          description={deleteModal.description}
          onConfirm={deleteModal.onConfirm}
          onCancel={() => setDeleteModal(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      {/* ─── Sidebar ─── */}
      <aside 
        className="w-72 flex flex-col border-r shrink-0 z-10 relative"
        style={{ 
          backgroundColor: 'var(--color-surface-card)', 
          borderColor: 'var(--color-border)' 
        }}
      >
        {/* Brand Header */}
        <div 
          className="px-5 pt-6 pb-5 border-b"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-extrabold tracking-tight text-primary-500">AutoFiller</h1>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg cursor-pointer"
              style={{ color: 'var(--color-text-secondary)' }}
              title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
          <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Settings</p>

          {/* Utility Row */}
          <div className="flex gap-2 mt-4">
            <a 
              href="../help.html" 
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 py-2 px-3 text-primary-600 text-xs font-bold rounded-lg cursor-pointer border border-primary-200 hover:border-primary-300 bg-primary-50"
            >
              <ExternalLink size={13} /> Docs
            </a>
            <button
              onClick={() => importInputRef.current?.click()}
              title="Import settings from a JSON file"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg cursor-pointer border"
              style={{ 
                backgroundColor: 'var(--color-surface-raised)', 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)'
              }}
            >
              <Download size={13} />
              Import
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              disabled={apps.length === 0}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border border-primary-200 bg-primary-50 text-primary-600"
            >
              <Upload size={13} />
              Export
            </button>
          </div>
        </div>

        {/* Add Application */}
        <div className="px-4 py-3">
          <button 
            onClick={handleAddApp}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold shadow-sm cursor-pointer"
          >
            <Plus size={17} /> Add Application
          </button>
        </div>

        {/* Application List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-6 space-y-1">
          {apps.length === 0 ? (
            <div 
              className="text-center mt-6 text-[13px] font-semibold py-4 rounded-xl border border-dashed"
              style={{ 
                color: 'var(--color-text-tertiary)', 
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface-raised)'
              }}
            >
              No applications configured.
            </div>
          ) : (
            apps.map(app => (
              <div key={app.id} className="space-y-0.5">
                {/* App Row */}
                <div 
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer group"
                  style={{
                    backgroundColor: selectedItemId === app.id && selectedItemType === 'app'
                      ? 'var(--color-primary-50, #FFF8ED)' 
                      : 'transparent',
                    color: selectedItemId === app.id && selectedItemType === 'app' 
                      ? 'var(--color-primary-700, #8B5526)' 
                      : 'var(--color-text-primary)'
                  }}
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleSidebarApp(app.id); }}
                    className="shrink-0 cursor-pointer p-0.5"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {sidebarCollapsed[app.id] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <div 
                    className="flex-1 flex items-center gap-2 min-w-0"
                    onClick={() => { setSelectedItemType('app'); setSelectedItemId(app.id); }}
                  >
                    <Layers size={15} className={selectedItemType === 'app' && selectedItemId === app.id ? 'text-primary-500' : ''} style={selectedItemType === 'app' && selectedItemId === app.id ? {} : { color: 'var(--color-text-tertiary)' }} />
                    <span className="truncate text-[13px] font-bold">{app.name || 'Untitled'}</span>
                  </div>
                  <span 
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      app.enabled 
                        ? 'bg-success-100 text-success-700' 
                        : 'bg-danger-100 text-danger-600'
                    }`}
                  >
                    {app.enabled ? 'ON' : 'OFF'}
                  </span>
                </div>

                {/* URL Rules Sub-list (collapsible) */}
                {!sidebarCollapsed[app.id] && app.rules.map(r => (
                  <div 
                    key={r.id}
                    onClick={() => { setSelectedItemType('rule'); setSelectedItemId(r.id); }}
                    className="ml-7 flex items-center justify-between px-3 py-2 rounded-md cursor-pointer"
                    style={{
                      backgroundColor: selectedItemId === r.id && selectedItemType === 'rule'
                        ? 'var(--color-primary-50, #FFF8ED)'
                        : 'transparent',
                      color: selectedItemId === r.id && selectedItemType === 'rule'
                        ? 'var(--color-primary-700, #8B5526)'
                        : 'var(--color-text-secondary)'
                    }}
                  >
                    <div className="flex items-center gap-2 text-[12px] font-semibold truncate min-w-0">
                      <Globe size={13} className={selectedItemType === 'rule' && selectedItemId === r.id ? 'text-primary-500' : ''} style={selectedItemType === 'rule' && selectedItemId === r.id ? {} : { color: 'var(--color-text-tertiary)' }} />
                      <span className="truncate">{r.urlPattern || 'New Rule'}</span>
                    </div>
                    <span 
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        r.enabled ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-600'
                      }`}
                    >
                      {r.enabled ? 'ON' : 'OFF'}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-[1]">
        
        {/* Top Bar */}
        <header 
          className="h-16 border-b px-8 flex items-center justify-between shrink-0"
          style={{ 
            backgroundColor: 'var(--color-surface-card)', 
            borderColor: 'var(--color-border)' 
          }}
        >
          <h2 className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            {selectedItemType === 'app' ? 'Application Settings' : selectedItemType === 'rule' ? 'URL Rule' : 'Welcome'}
          </h2>
          <div className="flex items-center gap-4">
            <span 
              className={`flex items-center gap-1.5 text-[13px] font-bold text-success-500 ${saveStatus ? 'opacity-100' : 'opacity-0'}`}
              style={{ transition: 'opacity 0.3s ease' }}
            >
              <Save size={15} /> Saved
            </span>
            {selectedItemId && (
              <button 
                onClick={handleDeleteCurrent}
                className="flex items-center gap-2 border text-danger-500 hover:bg-danger-50 px-3.5 py-2 rounded-lg font-bold cursor-pointer text-sm"
                style={{ borderColor: 'var(--color-danger-200, #FACBCB)' }}
              >
                <Trash2 size={15} />
                Delete
              </button>
            )}
          </div>
        </header>

        {/* Editor Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {!selectedItemId && (
            <div className="h-full flex items-center justify-center">
              <div 
                className="text-center p-10 rounded-2xl border border-dashed"
                style={{ 
                  backgroundColor: 'var(--color-surface-card)',
                  borderColor: 'var(--color-border-strong)'
                }}
              >
                <Layers size={40} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Select an Application</h3>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Click "Add Application" on the sidebar to get started.</p>
              </div>
            </div>
          )}

          {/* ── APP EDITOR ── */}
          {selectedItemType === 'app' && currentApp && (
            <div className="max-w-2xl mx-auto">
              <div 
                className="p-7 rounded-2xl shadow-sm border"
                style={{ 
                  backgroundColor: 'var(--color-surface-card)',
                  borderColor: 'var(--color-border)'
                }}
              >
                {/* Top accent bar */}
                <div className="w-full h-1 bg-primary-400 rounded-full mb-7" />

                <div className="mb-7">
                  <label className="block text-sm font-bold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Application Name</label>
                  <input 
                    type="text" 
                    value={currentApp.name} 
                    onChange={(e) => updateAppField(currentApp.id, 'name', e.target.value)}
                    placeholder="e.g. My Login Page"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 font-semibold text-[15px]"
                    style={{ 
                      backgroundColor: 'var(--color-surface-raised)', 
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                </div>
                
                <div 
                  className="flex items-center gap-4 p-5 rounded-xl border"
                  style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border-subtle)' }}
                >
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={currentApp.enabled} 
                      onChange={(e) => updateAppField(currentApp.id, 'enabled', e.target.checked)}
                    />
                    <div className="w-12 h-6 bg-warm-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-warm-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success-500 shadow-inner"></div>
                  </label>
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Enable / Disable</h4>
                    <p className="text-[12px] font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>When disabled, all URL rules under this application are paused.</p>
                  </div>
                </div>

                <div className="mt-7 pt-7 border-t text-right" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <button 
                    onClick={() => handleAddRule(currentApp.id)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-50 hover:bg-primary-100 text-primary-600 font-bold rounded-xl cursor-pointer border border-primary-200"
                  >
                    <Plus size={17} /> Add URL Rule
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── RULE EDITOR ── */}
          {selectedItemType === 'rule' && currentRule && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* URL Matching Card */}
              <div 
                className="p-7 rounded-2xl shadow-sm border"
                style={{ 
                  backgroundColor: 'var(--color-surface-card)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <div className="w-full h-1 bg-primary-400 rounded-full mb-7" />

                <div className="flex justify-between items-center mb-6 pb-5 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <h3 className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>URL Matching</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold" style={{ color: 'var(--color-text-secondary)' }}>Enabled</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={currentRule.enabled} onChange={(e) => updateRuleField(currentRule.id, 'enabled', e.target.checked)}/>
                      <div className="w-11 h-6 bg-warm-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success-500 shadow-inner"></div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full md:w-48 shrink-0">
                    <label className="block text-[13px] font-bold mb-2" style={{ color: 'var(--color-text-secondary)' }}>Match Type</label>
                    <select 
                      value={currentRule.matchType}
                      onChange={(e) => updateRuleField(currentRule.id, 'matchType', e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 font-bold text-sm"
                      style={{ 
                        backgroundColor: 'var(--color-surface-raised)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      <option value="exact">Exact Match</option>
                      <option value="startsWith">Starts With</option>
                      <option value="wildcard">Wildcard (*)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-bold mb-2" style={{ color: 'var(--color-text-secondary)' }}>URL Pattern</label>
                    <input 
                      type="text" 
                      value={currentRule.urlPattern}
                      onChange={(e) => updateRuleField(currentRule.id, 'urlPattern', e.target.value)}
                      placeholder="e.g. http://localhost:3000/login"
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 font-semibold text-sm"
                      style={{ 
                        backgroundColor: 'var(--color-surface-raised)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Field Mappings Card */}
              <div 
                className="p-7 rounded-2xl shadow-sm border"
                style={{ 
                  backgroundColor: 'var(--color-surface-card)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
                  <h3 className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Field Mappings</h3>
                  <button 
                    onClick={() => addFieldMapping(currentRule.id)}
                    className="flex items-center gap-1.5 px-4 py-2.5 border font-bold rounded-lg cursor-pointer shadow-sm text-sm"
                    style={{ 
                      backgroundColor: 'var(--color-surface-card)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    <Plus size={17} className="text-primary-500" /> Add Field
                  </button>
                </div>

                <div className="space-y-4">
                  {currentRule.fields.length === 0 ? (
                    <div 
                      className="text-center py-10 rounded-2xl border-2 border-dashed"
                      style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}
                    >
                      <FileText size={32} className="mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
                      <h4 className="text-[15px] font-bold mb-1" style={{ color: 'var(--color-text-secondary)' }}>No fields added yet</h4>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>Add fields to auto-fill input elements on this page.</p>
                    </div>
                  ) : (
                    currentRule.fields.map((field) => (
                      <div 
                        key={field.id} 
                        className="group relative flex flex-col md:flex-row items-center gap-4 p-5 border rounded-xl shadow-sm"
                        style={{ 
                          backgroundColor: 'var(--color-surface-card)',
                          borderColor: 'var(--color-border)'
                        }}
                      >
                        {/* Field ID Badge */}
                        <div 
                          className="absolute -top-2.5 left-4 px-2 py-0.5 rounded text-[10px] font-bold border hidden md:block font-mono-code"
                          style={{ 
                            backgroundColor: 'var(--color-surface-raised)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text-tertiary)'
                          }}
                        >
                          ID: {field.id}
                        </div>

                        {/* Enable toggle */}
                        <div className="flex flex-col items-center gap-1">
                          <label className="relative inline-flex items-center cursor-pointer" title="Enable Field">
                            <input type="checkbox" className="sr-only peer" checked={field.enabled} onChange={(e) => updateMappingField(currentRule.id, field.id, 'enabled', e.target.checked)}/>
                            <div className="w-[38px] h-[22px] bg-warm-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-primary-500 shadow-inner"></div>
                          </label>
                        </div>

                        {/* Selector */}
                        <div className="flex-1 w-full">
                          <label className="block text-[11px] uppercase tracking-wider font-bold mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Selector</label>
                          <input 
                            type="text" 
                            value={field.selector} 
                            onChange={(e) => updateMappingField(currentRule.id, field.id, 'selector', e.target.value)} 
                            placeholder="#username or //div/input" 
                            className="w-full px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 focus:outline-none font-semibold text-sm font-mono-code"
                            style={{ 
                              backgroundColor: 'var(--color-surface-raised)',
                              borderColor: 'var(--color-border)',
                              color: 'var(--color-text-primary)'
                            }}
                          />
                        </div>

                        {/* Fill Value */}
                        <div className="flex-1 w-full">
                          <label className="block text-[11px] uppercase tracking-wider font-bold mb-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Fill Value</label>
                          <input 
                            type="text" 
                            value={field.content} 
                            onChange={(e) => updateMappingField(currentRule.id, field.id, 'content', e.target.value)} 
                            placeholder="Value to fill..." 
                            className="w-full px-3.5 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 focus:outline-none font-semibold text-sm font-mono-code"
                            style={{ 
                              backgroundColor: 'var(--color-surface-raised)',
                              borderColor: 'var(--color-border)',
                              color: 'var(--color-text-primary)'
                            }}
                          />
                        </div>

                        {/* Timestamp checkbox */}
                        <div className="flex items-center justify-center shrink-0 w-max pt-5">
                          <label 
                            className="flex items-center justify-center gap-2 cursor-pointer px-3 py-2.5 rounded-lg border shadow-sm"
                            style={{ 
                              backgroundColor: 'var(--color-surface-raised)',
                              borderColor: 'var(--color-border)'
                            }}
                          >
                            <input 
                              type="checkbox" 
                              checked={field.appendTimestamp} 
                              onChange={(e) => updateMappingField(currentRule.id, field.id, 'appendTimestamp', e.target.checked)} 
                              className="w-[18px] h-[18px] cursor-pointer rounded accent-primary-500"
                            />
                            <span className="text-[13px] font-bold" style={{ color: 'var(--color-text-primary)' }}>Timestamp</span>
                          </label>
                        </div>

                        {/* Delete field */}
                        <div className="pt-5">
                          <button 
                            onClick={() => deleteMapping(currentRule.id, field.id)} 
                            className="p-2.5 border text-danger-400 hover:bg-danger-50 hover:border-danger-200 hover:text-danger-600 rounded-lg cursor-pointer shadow-sm"
                            style={{ borderColor: 'var(--color-border)' }}
                            title="Remove Field"
                          >
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
