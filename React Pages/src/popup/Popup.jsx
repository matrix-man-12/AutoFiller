import React, { useState, useEffect, useRef } from 'react';
import { Zap, Eraser, Settings, HelpCircle, Sun, Moon, Bookmark, ListTodo, BookmarkPlus, Upload, Download, CheckCircle2, AlertTriangle, X, Package } from 'lucide-react';

export default function Popup() {
  const [theme, setTheme] = useState(() => localStorage.getItem('autofiller-theme') || 'light');
  const [bookmarkStatus, setBookmarkStatus] = useState(null); // 'saving' | 'saved' | 'exists' | 'error'
  const [toast, setToast] = useState(null); // { message, type }
  const importRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('autofiller-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // ── Auto-dismiss toast ──
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // ── AutoFill / AutoClear ──
  const handleAutoFill = () => {
    if (chrome?.runtime) { chrome.runtime.sendMessage({ action: 'trigger_autofill' }); window.close(); }
    else console.log('AutoFill Triggered (Dev Mode)');
  };
  const handleAutoClear = () => {
    if (chrome?.runtime) { chrome.runtime.sendMessage({ action: 'trigger_autoclear' }); window.close(); }
    else console.log('AutoClear Triggered (Dev Mode)');
  };

  // ── Open pages ──
  const openPage = (page) => {
    if (chrome?.tabs) chrome.tabs.create({ url: chrome.runtime.getURL(`dist/${page}`), active: true });
    else window.open(page, '_blank');
  };
  const openOptions = () => {
    if (chrome?.runtime) chrome.runtime.openOptionsPage();
    else window.open('../options.html', '_blank');
  };

  // ── Bookmark This Page ──
  const bookmarkThisPage = async () => {
    setBookmarkStatus('saving');
    try {
      let tabUrl = '', tabTitle = '';
      if (chrome?.tabs) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) { tabUrl = tab.url || ''; tabTitle = tab.title || ''; }
      } else {
        tabUrl = 'https://example.com'; tabTitle = 'Dev Mode Page';
      }
      if (!tabUrl || tabUrl.startsWith('chrome://') || tabUrl.startsWith('chrome-extension://')) {
        setBookmarkStatus('error'); setTimeout(() => setBookmarkStatus(null), 2000); return;
      }
      if (chrome?.storage) {
        const result = await chrome.storage.local.get('bookmarks');
        const bookmarks = result.bookmarks || [];
        if (bookmarks.some(b => b.url === tabUrl)) {
          setBookmarkStatus('exists'); setTimeout(() => setBookmarkStatus(null), 2000); return;
        }
        bookmarks.push({
          id: `bm_${Math.random().toString(36).substr(2, 9)}`,
          url: tabUrl, title: tabTitle, description: '', tags: [],
          pinned: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        });
        await chrome.storage.local.set({ bookmarks });
      }
      setBookmarkStatus('saved'); setTimeout(() => setBookmarkStatus(null), 2000);
    } catch { setBookmarkStatus('error'); setTimeout(() => setBookmarkStatus(null), 2000); }
  };

  // ── Export All Settings ──
  const handleExportAll = async () => {
    try {
      let apps = [], bookmarks = [], tasks = [];
      if (chrome?.storage) {
        const result = await chrome.storage.local.get(['apps', 'bookmarks', 'tasks']);
        apps = result.apps || [];
        bookmarks = result.bookmarks || [];
        tasks = result.tasks || [];
      }
      const payload = JSON.stringify({ version: 1, exportType: 'full', exportDate: new Date().toISOString(), apps, bookmarks, tasks }, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'superx-all-settings.json'; link.click();
      URL.revokeObjectURL(url);
      setToast({ message: 'All settings exported!', type: 'success' });
    } catch {
      setToast({ message: 'Export failed.', type: 'error' });
    }
  };

  // ── Import All Settings ──
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!chrome?.storage) { setToast({ message: 'Not in extension context.', type: 'error' }); return; }

        const result = await chrome.storage.local.get(['apps', 'bookmarks', 'tasks']);
        const updates = {};
        let parts = [];

        // Handle apps
        if (parsed.apps && Array.isArray(parsed.apps)) {
          const existing = result.apps || [];
          const existingIds = new Set(existing.map(a => a.id));
          const newApps = parsed.apps.filter(a => !existingIds.has(a.id));
          if (newApps.length > 0) {
            updates.apps = [...existing, ...newApps];
            parts.push(`${newApps.length} app${newApps.length !== 1 ? 's' : ''}`);
          }
        }

        // Handle bookmarks
        if (parsed.bookmarks && Array.isArray(parsed.bookmarks)) {
          const existing = result.bookmarks || [];
          const existingIds = new Set(existing.map(b => b.id));
          const newBms = parsed.bookmarks.filter(b => !existingIds.has(b.id));
          if (newBms.length > 0) {
            updates.bookmarks = [...existing, ...newBms];
            parts.push(`${newBms.length} bookmark${newBms.length !== 1 ? 's' : ''}`);
          }
        }

        // Handle tasks
        if (parsed.tasks && Array.isArray(parsed.tasks)) {
          const existing = result.tasks || [];
          const existingIds = new Set(existing.map(t => t.id));
          const newTasks = parsed.tasks.filter(t => !existingIds.has(t.id));
          if (newTasks.length > 0) {
            updates.tasks = [...existing, ...newTasks];
            parts.push(`${newTasks.length} task${newTasks.length !== 1 ? 's' : ''}`);
          }
        }

        if (Object.keys(updates).length > 0) {
          await chrome.storage.local.set(updates);
          setToast({ message: `Imported: ${parts.join(', ')}.`, type: 'success' });
        } else {
          setToast({ message: 'Everything already exists.', type: 'warn' });
        }
      } catch {
        setToast({ message: 'Invalid JSON file.', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const bookmarkLabel = bookmarkStatus === 'saving' ? 'Saving…'
    : bookmarkStatus === 'saved' ? 'Bookmarked ✓'
    : bookmarkStatus === 'exists' ? 'Already saved'
    : bookmarkStatus === 'error' ? 'Cannot bookmark'
    : 'Bookmark This Page';

  return (
    <div className="flex flex-col w-full" style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* Hidden import input */}
      <input ref={importRef} type="file" accept=".json,application/json" className="hidden" onChange={handleImportFile} />

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border-subtle)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-primary-500 leading-none">Super X</h2>
            <p className="text-[11px] font-semibold mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Quick Actions</p>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-secondary)' }} title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>

      {/* AutoFill / AutoClear buttons */}
      <div className="px-4 pt-4 pb-2 space-y-2.5">
        <button onClick={handleAutoFill} className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold shadow-sm cursor-pointer">
          <Zap size={17} className="fill-white" /> AutoFill Now
        </button>
        <button onClick={handleAutoClear} className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-danger-500 hover:bg-danger-600 text-white rounded-xl font-bold shadow-sm cursor-pointer">
          <Eraser size={17} /> Clear Fields
        </button>
      </div>

      {/* Divider */}
      <div className="px-4 py-1"><div className="h-px" style={{ backgroundColor: 'var(--color-border-subtle)' }} /></div>

      {/* Bookmark This Page */}
      <div className="px-4 py-1.5">
        <button
          onClick={bookmarkThisPage}
          disabled={bookmarkStatus === 'saving'}
          className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-sm cursor-pointer border transition-all shadow-sm ${
            bookmarkStatus === 'saved' ? 'bg-success-50 border-success-200 text-success-700'
            : bookmarkStatus === 'exists' ? 'bg-primary-50 border-primary-200 text-primary-600'
            : bookmarkStatus === 'error' ? 'bg-danger-50 border-danger-200 text-danger-600'
            : 'border-primary-200 bg-primary-50 text-primary-600 hover:bg-primary-100'
          }`}
        >
          {bookmarkStatus === 'saved' ? <CheckCircle2 size={15} /> : <BookmarkPlus size={15} />}
          {bookmarkLabel}
        </button>
      </div>

      {/* Divider */}
      <div className="px-4 py-1"><div className="h-px" style={{ backgroundColor: 'var(--color-border-subtle)' }} /></div>

      {/* Navigation: Bookmarks + Tasks */}
      <div className="flex gap-2 px-4 py-2">
        <button
          onClick={() => openPage('bookmarks.html')}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg font-bold cursor-pointer text-sm"
          style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        >
          <Bookmark size={15} className="text-primary-500" /> Bookmarks
        </button>
        <button
          onClick={() => openPage('tasks.html')}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg font-bold cursor-pointer text-sm"
          style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        >
          <ListTodo size={15} className="text-primary-500" /> Tasks
        </button>
      </div>

      {/* Navigation: Settings + Help */}
      <div className="flex gap-2 px-4 py-1">
        <button
          onClick={openOptions}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg font-bold cursor-pointer text-sm"
          style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        >
          <Settings size={15} style={{ color: 'var(--color-text-secondary)' }} /> Settings
        </button>
        <a
          href="help.html" target="_blank" title="Help & Docs"
          className="flex items-center justify-center p-2.5 rounded-lg cursor-pointer border"
          style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
        >
          <HelpCircle size={17} />
        </a>
      </div>

      {/* Divider */}
      <div className="px-4 py-1"><div className="h-px" style={{ backgroundColor: 'var(--color-border-subtle)' }} /></div>

      {/* Export All / Import All */}
      <div className="flex gap-2 px-4 py-3">
        <button
          onClick={() => importRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 border rounded-lg font-bold cursor-pointer text-xs"
          style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
        >
          <Download size={13} /> Import All
        </button>
        <button
          onClick={handleExportAll}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 border rounded-lg font-bold cursor-pointer text-xs"
          style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
        >
          <Upload size={13} /> Export All
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`mx-4 mb-3 flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-bold border ${
            toast.type === 'success' ? 'border-success-200 bg-success-50 text-success-700'
            : toast.type === 'warn' ? 'border-primary-200 bg-primary-50 text-primary-600'
            : 'border-danger-200 bg-danger-50 text-danger-600'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => setToast(null)} className="cursor-pointer"><X size={12} /></button>
        </div>
      )}
    </div>
  );
}
