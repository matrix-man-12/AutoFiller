import React, { useState, useEffect, useRef } from 'react';
import { 
  FolderGit2, 
  Settings2, 
  Trash2, 
  Plus, 
  Save, 
  XSquare, 
  ExternalLink 
} from 'lucide-react';

const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

export default function Options() {
  const [apps, setApps] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null); // 'app' or 'rule'
  const [saveStatus, setSaveStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  const saveTimeoutRef = useRef(null);

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
