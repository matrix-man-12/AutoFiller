import React, { useState, useEffect } from 'react';
import {
  Moon, Sun, Layout, Globe, Settings2, MousePointer2, Keyboard,
  Zap, Trash2, Bookmark, ListTodo, Search, Tag, Pin,
  CheckCircle2, Flag, CalendarDays, HelpCircle, ArrowRight,
  Upload, Download, ExternalLink, AlertTriangle, X
} from 'lucide-react';

// ─── SVG Background ─────────────────────────────────────────────────────────
function SvgBackground() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const s = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(180,160,130,0.08)';
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 900">
      <path d="M0 340 Q360 280 720 350 Q1080 420 1440 320" fill="none" stroke={s} strokeWidth="1.5"/>
      <path d="M0 420 Q300 370 650 430 Q1000 480 1440 400" fill="none" stroke={s} strokeWidth="1"/>
      <path d="M0 540 Q380 500 750 540 Q1100 580 1440 510" fill="none" stroke={s} strokeWidth="0.6"/>
      <circle cx="200" cy="700" r="160" fill="none" stroke={s} strokeWidth="0.6"/>
      <circle cx="1200" cy="200" r="140" fill="none" stroke={s} strokeWidth="0.5"/>
    </svg>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, type = 'success', onDismiss }) {
  useEffect(() => { const t = setTimeout(onDismiss, 3500); return () => clearTimeout(t); }, [onDismiss]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-[13px] font-bold ${type === 'success' ? 'border-success-500/30' : 'border-danger-300'}`} style={{ backgroundColor: 'var(--color-surface-card)', color: 'var(--color-text-primary)' }}>
      {type === 'success' ? <CheckCircle2 size={17} className="text-success-500 shrink-0" /> : <AlertTriangle size={17} className="text-primary-400 shrink-0" />}
      {message}
      <button onClick={onDismiss} className="ml-2 cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}><X size={14} /></button>
    </div>
  );
}

// ─── AutoFiller Docs ────────────────────────────────────────────────────────
function AutoFillerDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-3" style={{ color: 'var(--color-text-primary)' }}>AutoFiller</h2>
        <p className="text-[14px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          AutoFiller automates form filling across your web applications. Configure URL rules with CSS selectors and let SuperX inject values into input fields instantly — on local dev servers, staging environments, or production pages.
        </p>
      </div>

      {/* Core Vocabulary */}
      <section className="p-6 rounded-2xl shadow-sm border overflow-hidden relative" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 rounded-t-2xl" />
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-primary-50 border border-primary-100"><Layout size={20} className="text-primary-600" /></div>
          <h3 className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Core Vocabulary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { title: 'Application', desc: 'A top-level organizational folder to group related URL rules (e.g., "Internal CRM", "Staging Server"). Each application can be enabled/disabled independently.' },
            { title: 'URL Rule', desc: 'Routing logic that determines which web pages AutoFiller activates on. Each rule contains one or more URL patterns and a set of field mappings.' },
            { title: 'Field Map', desc: 'A CSS selector + value pair. The selector locates an input element on the page, and the label text is the value that gets auto-filled into it.' },
          ].map(item => (
            <div key={item.title} className="space-y-2">
              <h4 className="font-black text-primary-600 uppercase tracking-widest text-xs">{item.title}</h4>
              <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Match Types */}
      <section className="p-6 rounded-2xl shadow-sm border" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-primary-50 border border-primary-100"><Globe size={20} className="text-primary-600" /></div>
          <h3 className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>URL Match Types</h3>
        </div>
        <p className="text-[14px] font-medium leading-relaxed mb-5" style={{ color: 'var(--color-text-secondary)' }}>
          Each URL Rule supports multiple matching strategies. You can mix different match types within a single rule for maximum flexibility.
        </p>
        <div className="space-y-3">
          {[
            { name: 'Exact Match', desc: 'Requires a perfect 1:1 character match. Use for specific pages where you need precise targeting. Query parameters must match exactly.' },
            { name: 'Starts With', desc: 'Matches any page whose URL begins with the given prefix. Great for catching all pages under a base path (e.g., http://localhost:3000/).' },
            { name: 'Wildcard (*)', desc: 'Uses asterisk (*) to match any variable segment. Perfect for dynamic routes like http://localhost:*/api/*/edit — each * matches any characters.' },
          ].map(item => (
            <div key={item.name} className="p-4 rounded-xl border flex gap-4 items-start" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
              <div>
                <h4 className="font-bold text-[14px] mb-1" style={{ color: 'var(--color-text-primary)' }}>{item.name}</h4>
                <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CSS Selectors */}
      <section className="p-6 rounded-2xl shadow-sm border" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-primary-50 border border-primary-100"><MousePointer2 size={20} className="text-primary-600" /></div>
          <h3 className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>CSS Selectors for Field Mapping</h3>
        </div>
        <p className="text-[14px] font-medium leading-relaxed mb-5" style={{ color: 'var(--color-text-secondary)' }}>
          AutoFiller uses standard CSS <code className="px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 text-[12px] font-bold">querySelector</code> syntax to find input elements. Right-click any input → "Inspect" to see its HTML attributes. The <strong>label field</strong> in settings is the auto-fill text that gets injected into the matched element.
        </p>
        <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-raised)' }}>
                <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)' }}>Selector Type</th>
                <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)' }}>Format</th>
                <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)' }}>Example</th>
              </tr>
            </thead>
            <tbody className="text-[13px] font-medium">
              {[
                { type: 'By ID (Most Stable)', format: '#element-id', example: '<input id="username" /> → #username' },
                { type: 'By Class', format: '.class-name', example: '<input class="email-field" /> → .email-field' },
                { type: 'By Name Attribute', format: 'input[name="val"]', example: '<input name="first_name" /> → input[name="first_name"]' },
                { type: 'Nested / Relational', format: '.parent .child', example: '<form class="card"><input id="pass"> → .card #pass' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-4 py-3 font-bold" style={{ color: 'var(--color-text-primary)' }}>{row.type}</td>
                  <td className="px-4 py-3"><code className="px-2 py-1 rounded bg-primary-50 text-[12px] font-bold text-primary-600">{row.format}</code></td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ color: 'var(--color-text-secondary)' }}><code className="text-[12px]">{row.example}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="p-6 rounded-2xl shadow-sm border" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-primary-50 border border-primary-100"><Zap size={20} className="text-primary-600" /></div>
          <h3 className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Keyboard Shortcuts</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 p-5 border rounded-xl text-center space-y-3" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
            <div className="flex justify-center text-primary-500"><Keyboard size={24} /></div>
            <p className="font-extrabold text-[14px]" style={{ color: 'var(--color-text-primary)' }}>AutoFill Page</p>
            <div className="flex items-center justify-center gap-2 text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
              <kbd className="px-2.5 py-1.5 border rounded-lg text-xs" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-card)' }}>Alt</kbd> +
              <kbd className="px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-card)' }}>A</kbd>
            </div>
          </div>
          <div className="flex-1 p-5 border rounded-xl text-center space-y-3" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
            <div className="flex justify-center text-danger-400"><Trash2 size={24} /></div>
            <p className="font-extrabold text-[14px]" style={{ color: 'var(--color-text-primary)' }}>Clear Fields</p>
            <div className="flex items-center justify-center gap-2 text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
              <kbd className="px-2.5 py-1.5 border rounded-lg text-xs" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-card)' }}>Alt</kbd> +
              <kbd className="px-3 py-1.5 border rounded-lg text-xs" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-card)' }}>S</kbd>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="p-6 rounded-2xl shadow-sm border" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-primary-50 border border-primary-100"><Settings2 size={20} className="text-primary-600" /></div>
          <h3 className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Getting Started</h3>
        </div>
        <ol className="space-y-3 text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          {[
            'Open the AutoFiller settings page and click "Add Application" to create a new group.',
            'Give your application a meaningful name (e.g., "Dev Login Forms").',
            'Inside the application, add a URL Rule with one or more URL patterns.',
            'Choose a match type (Exact, Starts With, or Wildcard) for each URL pattern.',
            'Add field mappings: enter a CSS selector to target the input, and the label text as the auto-fill value.',
            'Enable the application and navigate to a matching page — press Alt+A to auto-fill!',
            'Use Import/Export to backup your configurations or share them with teammates.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-[11px] font-bold shrink-0">{i + 1}</span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

// ─── Bookmarks Docs ─────────────────────────────────────────────────────────
function BookmarksDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-3" style={{ color: 'var(--color-text-primary)' }}>Bookmarks</h2>
        <p className="text-[14px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Save any URL with custom titles, descriptions, and tags. The standout feature is <strong>fast multi-keyword search</strong> — every word you type is matched against the URL, title, description, and tags simultaneously using AND-logic.
        </p>
      </div>

      <section className="p-6 rounded-2xl shadow-sm border overflow-hidden relative" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 rounded-t-2xl" />
        <h3 className="text-lg font-extrabold mb-5" style={{ color: 'var(--color-text-primary)' }}>Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Search, title: 'Multi-Keyword Search', desc: 'Type multiple words separated by spaces. ALL keywords must match across URL, title, description, or tags. For example, "react docs api" will find bookmarks that contain all three words anywhere in their metadata.' },
            { icon: Tag, title: 'Tag System', desc: 'Add colored tags for instant categorization. Tags appear as filter chips in the sidebar — click any tag to toggle filtering. Each tag gets a unique color based on its name for quick visual scanning.' },
            { icon: Pin, title: 'Pin & Organize', desc: 'Pin important bookmarks to the top of any sorted list. Switch between grid view (card layout) and list view (compact rows). Sort by newest, oldest, or alphabetical order.' },
            { icon: ExternalLink, title: 'Quick Bookmark Shortcut', desc: 'Press Alt+B to instantly save the current browser tab. You can also use the "Bookmark This Page" button in the popup. To customize the Alt+B shortcut, visit chrome://extensions/shortcuts in your browser.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 items-start p-4 rounded-xl border" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
              <item.icon size={18} className="text-primary-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[14px] mb-1" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h4>
                <p className="text-[12px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-6 rounded-2xl shadow-sm border" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <h3 className="text-lg font-extrabold mb-5" style={{ color: 'var(--color-text-primary)' }}>How to Use</h3>
        <ol className="space-y-3 text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          {[
            'Open the Bookmarks page from the popup or sidebar navigation.',
            'Click "Add Bookmark" to save a new URL. Enter the URL, title, description, and tags.',
            'Use the search bar to find bookmarks instantly — type any keywords from URL, title, description, or tags.',
            'Click tag chips in the sidebar to filter by specific tags.',
            'Pin important bookmarks to keep them at the top of the list.',
            'Switch between Grid and List views using the toggle buttons.',
            'Press Alt+B anytime to instantly save the current page to your bookmarks.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-[11px] font-bold shrink-0">{i + 1}</span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

// ─── Tasks Docs ─────────────────────────────────────────────────────────────
function TasksDocs() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-3" style={{ color: 'var(--color-text-primary)' }}>Tasks</h2>
        <p className="text-[14px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          A full-featured task management system built for developers. Create tasks, break them into subtasks, set priorities and statuses, assign due dates, and track progress — all within the extension without leaving your browser.
        </p>
      </div>

      <section className="p-6 rounded-2xl shadow-sm border overflow-hidden relative" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 rounded-t-2xl" />
        <h3 className="text-lg font-extrabold mb-5" style={{ color: 'var(--color-text-primary)' }}>Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: CheckCircle2, title: 'Subtasks & Progress', desc: 'Break any task into subtasks with individual checkboxes. A visual progress bar on each card shows completion percentage. Subtasks can be added, renamed, and removed at any time.' },
            { icon: Flag, title: '4 Priority Levels', desc: 'Critical (red), High (amber), Medium (blue), Low (muted) — each with a distinct color accent strip on the task card. Use the sidebar priority filter to focus on what matters.' },
            { icon: CalendarDays, title: 'Due Dates & Overdue', desc: 'Use the custom themed calendar picker to set due dates. Overdue tasks are highlighted in red for immediate visual attention. Clear or change dates anytime from the edit modal.' },
            { icon: ListTodo, title: 'Status Workflow & Archive', desc: 'To Do → In Progress → Done / Blocked. Completed tasks automatically move to a separate "Completed" section at the bottom, keeping your active view clean and focused.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 items-start p-4 rounded-xl border" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
              <item.icon size={18} className="text-primary-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[14px] mb-1" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h4>
                <p className="text-[12px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-6 rounded-2xl shadow-sm border" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <h3 className="text-lg font-extrabold mb-5" style={{ color: 'var(--color-text-primary)' }}>How to Use</h3>
        <ol className="space-y-3 text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          {[
            'Open the Tasks page from the popup or sidebar navigation.',
            'Click "New Task" to create a task. Fill in a title, priority, status, due date, and optional notes.',
            'Add subtasks within the creation modal to break down complex work.',
            'Use the sidebar filters to view tasks by status (Active, In Progress, Blocked) or priority level.',
            'Click the checkbox on any task card to mark it as done — it moves to the "Completed" section.',
            'Click "Completed" in the sidebar to view all finished tasks.',
            'Sort tasks by priority, newest, due date, or status using the top bar dropdown.',
            'Edit or delete any task using the icons on the task card.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-[11px] font-bold shrink-0">{i + 1}</span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

// ─── Import/Export Docs ─────────────────────────────────────────────────────
function ImportExportInfo() {
  return (
    <section className="p-6 rounded-2xl shadow-sm border mt-8" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-primary-50 border border-primary-100"><Upload size={20} className="text-primary-600" /></div>
        <h3 className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Import & Export</h3>
      </div>
      <p className="text-[13px] font-medium leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
        Each page (AutoFiller, Bookmarks, Tasks) has its own Import/Export buttons at the bottom of the sidebar. Additionally, the popup has <strong>"Export All"</strong> and <strong>"Import All"</strong> buttons that handle all three features in a single combined JSON file. Imports are always non-destructive — they merge new entries and skip duplicates.
      </p>
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
        <h4 className="font-bold text-[13px] mb-2" style={{ color: 'var(--color-text-primary)' }}>Export File Names</h4>
        <ul className="text-[12px] font-medium space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
          <li>• AutoFiller settings → via the Settings page Export button</li>
          <li>• Bookmarks only → <code className="px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 text-[11px] font-bold">superx-bookmarks.json</code></li>
          <li>• Tasks only → <code className="px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 text-[11px] font-bold">superx-tasks.json</code></li>
          <li>• All combined → <code className="px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 text-[11px] font-bold">superx-all-settings.json</code></li>
        </ul>
      </div>
    </section>
  );
}

// ─── Data Management ────────────────────────────────────────────────────────
function DataManagement({ setToast }) {
  const [clearApps, setClearApps] = useState(false);
  const [clearBookmarks, setClearBookmarks] = useState(false);
  const [clearTasks, setClearTasks] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const canClear = clearApps || clearBookmarks || clearTasks;

  const handleClear = async () => {
    if (!canClear) return;
    if (typeof window.chrome !== 'undefined' && chrome.storage) {
      if (clearApps) await chrome.storage.local.remove('apps');
      if (clearBookmarks) await chrome.storage.local.remove('bookmarks');
      if (clearTasks) await chrome.storage.local.remove('tasks');
      setToast({ message: 'Selected data cleared successfully.', type: 'success' });
      setClearApps(false);
      setClearBookmarks(false);
      setClearTasks(false);
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-3" style={{ color: 'var(--color-text-primary)' }}>Data Management</h2>
        <p className="text-[14px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Select specific features below to permanently clear their data from your browser storage. This action cannot be undone. Always export a backup first!
        </p>
      </div>

      <section className="p-6 rounded-2xl shadow-sm border border-danger-200" style={{ backgroundColor: 'var(--color-surface-card)' }}>
        <div className="flex items-center gap-3 mb-5">
           <div className="p-2.5 rounded-xl bg-danger-50 text-danger-600"><Trash2 size={20} /></div>
           <h3 className="text-lg font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Clear Stored Data</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
           <div 
             onClick={() => setClearApps(!clearApps)} 
             className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-start gap-2 ${clearApps ? 'border-danger-400 bg-danger-50' : 'hover:scale-[1.02]'}`} 
             style={clearApps ? {} : { borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-raised)' }}
           >
             <div className={`p-2 rounded-lg transition-colors ${clearApps ? 'bg-danger-500 text-white shadow-sm' : 'bg-black/5 dark:bg-white/10'}`} style={!clearApps ? { color: 'var(--color-text-secondary)' } : {}}>
               <Zap size={18} />
             </div>
             <span className="font-extrabold text-[13px] mt-1" style={{ color: clearApps ? 'var(--color-danger-700)' : 'var(--color-text-primary)' }}>AutoFiller</span>
             {clearApps ? (
               <span className="text-[10px] font-bold text-danger-500 uppercase tracking-widest mt-auto pt-2">Selected</span>
             ) : (
               <span className="text-[10px] font-bold uppercase tracking-widest mt-auto pt-2 opacity-0">Select</span>
             )}
           </div>

           <div 
             onClick={() => setClearBookmarks(!clearBookmarks)} 
             className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-start gap-2 ${clearBookmarks ? 'border-danger-400 bg-danger-50' : 'hover:scale-[1.02]'}`} 
             style={clearBookmarks ? {} : { borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-raised)' }}
           >
             <div className={`p-2 rounded-lg transition-colors ${clearBookmarks ? 'bg-danger-500 text-white shadow-sm' : 'bg-black/5 dark:bg-white/10'}`} style={!clearBookmarks ? { color: 'var(--color-text-secondary)' } : {}}>
               <Bookmark size={18} />
             </div>
             <span className="font-extrabold text-[13px] mt-1" style={{ color: clearBookmarks ? 'var(--color-danger-700)' : 'var(--color-text-primary)' }}>Bookmarks</span>
             {clearBookmarks ? (
               <span className="text-[10px] font-bold text-danger-500 uppercase tracking-widest mt-auto pt-2">Selected</span>
             ) : (
               <span className="text-[10px] font-bold uppercase tracking-widest mt-auto pt-2 opacity-0">Select</span>
             )}
           </div>

           <div 
             onClick={() => setClearTasks(!clearTasks)} 
             className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-start gap-2 ${clearTasks ? 'border-danger-400 bg-danger-50' : 'hover:scale-[1.02]'}`} 
             style={clearTasks ? {} : { borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-raised)' }}
           >
             <div className={`p-2 rounded-lg transition-colors ${clearTasks ? 'bg-danger-500 text-white shadow-sm' : 'bg-black/5 dark:bg-white/10'}`} style={!clearTasks ? { color: 'var(--color-text-secondary)' } : {}}>
               <ListTodo size={18} />
             </div>
             <span className="font-extrabold text-[13px] mt-1" style={{ color: clearTasks ? 'var(--color-danger-700)' : 'var(--color-text-primary)' }}>Tasks</span>
             {clearTasks ? (
               <span className="text-[10px] font-bold text-danger-500 uppercase tracking-widest mt-auto pt-2">Selected</span>
             ) : (
               <span className="text-[10px] font-bold uppercase tracking-widest mt-auto pt-2 opacity-0">Select</span>
             )}
           </div>
        </div>

        {isConfirming ? (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-danger-300 bg-danger-50 text-danger-900 shadow-sm transition-all duration-300 flex-wrap">
             <AlertTriangle size={24} className="shrink-0 text-danger-600" />
             <div className="flex-1 min-w-[200px]">
               <p className="font-bold text-[14px] mb-1">Are you absolutely sure?</p>
               <p className="text-xs font-medium text-danger-700">This will wipe your selected data. It cannot be recovered.</p>
             </div>
             <div className="flex gap-2">
               <button onClick={() => setIsConfirming(false)} className="px-4 py-2 border border-danger-300 rounded-lg text-xs font-bold cursor-pointer hover:bg-danger-100 text-danger-800">Cancel</button>
               <button onClick={handleClear} className="px-4 py-2 bg-danger-600 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-danger-700 shadow-sm">Yes, Delete Data</button>
             </div>
          </div>
        ) : (
          <button 
             onClick={() => setIsConfirming(true)} 
             disabled={!canClear}
             className="px-6 py-2.5 bg-danger-50 text-danger-600 border border-danger-200 font-bold rounded-lg cursor-pointer hover:bg-danger-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors text-[14px]"
          >
            Clear Selected Data
          </button>
        )}
      </section>
    </div>
  );
}

// ─── Main Help Component ────────────────────────────────────────────────────
export default function Help() {
  const [theme, setTheme] = useState(() => localStorage.getItem('autofiller-theme') || 'light');
  const [activeTab, setActiveTab] = useState('autofiller');
  const [toast, setToast] = useState(null);
  const importRef = React.useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('autofiller-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // ── Export All Settings ──
  const handleExportAll = async () => {
    try {
      let apps = [], bookmarks = [], tasks = [];
      if (typeof window.chrome !== 'undefined' && chrome.storage) {
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
        if (typeof window.chrome !== 'undefined' && chrome.storage) {
          const result = await chrome.storage.local.get(['apps', 'bookmarks', 'tasks']);
          const updates = {};
          let parts = [];

          if (parsed.apps && Array.isArray(parsed.apps)) {
            const existing = result.apps || [];
            const existingIds = new Set(existing.map(a => a.id));
            const newApps = parsed.apps.filter(a => !existingIds.has(a.id));
            if (newApps.length > 0) { updates.apps = [...existing, ...newApps]; parts.push(`${newApps.length} app(s)`); }
          }
          if (parsed.bookmarks && Array.isArray(parsed.bookmarks)) {
            const existing = result.bookmarks || [];
            const existingIds = new Set(existing.map(b => b.id));
            const newBms = parsed.bookmarks.filter(b => !existingIds.has(b.id));
            if (newBms.length > 0) { updates.bookmarks = [...existing, ...newBms]; parts.push(`${newBms.length} bookmark(s)`); }
          }
          if (parsed.tasks && Array.isArray(parsed.tasks)) {
            const existing = result.tasks || [];
            const existingIds = new Set(existing.map(t => t.id));
            const newTasks = parsed.tasks.filter(t => !existingIds.has(t.id));
            if (newTasks.length > 0) { updates.tasks = [...existing, ...newTasks]; parts.push(`${newTasks.length} task(s)`); }
          }

          if (Object.keys(updates).length > 0) {
            await chrome.storage.local.set(updates);
            setToast({ message: `Imported: ${parts.join(', ')}.`, type: 'success' });
          } else {
            setToast({ message: 'Everything already exists.', type: 'success' });
          }
        }
      } catch {
        setToast({ message: 'Invalid JSON file.', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const tabs = [
    { key: 'autofiller', label: 'AutoFiller', icon: Zap },
    { key: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { key: 'tasks', label: 'Tasks', icon: ListTodo },
    { key: 'data', label: 'Data Management', icon: Settings2 },
  ];

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ backgroundColor: 'var(--color-surface)' }}>
      <SvgBackground key={theme} />

      {/* ── Sidebar ── */}
      <aside className="w-72 flex flex-col border-r shrink-0 z-10 relative" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        {/* Brand Header */}
        <div className="px-5 pt-6 pb-5 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-primary-500">Help & Docs</h1>
              <p className="text-[10px] font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>SuperX</p>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-secondary)' }} title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
          {/* Quick Nav (3 horizontal icons) */}
          <div className="flex gap-1.5 mt-3">
            <a href="options.html" title="AutoFiller" className="flex-1 flex items-center justify-center py-1.5 rounded-lg border hover:bg-primary-50 transition-colors cursor-pointer" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
              <Zap size={15} />
            </a>
            <a href="tasks.html" title="Tasks" className="flex-1 flex items-center justify-center py-1.5 rounded-lg border hover:bg-primary-50 transition-colors cursor-pointer" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
              <ListTodo size={15} />
            </a>
            <a href="bookmarks.html" title="Bookmarks" className="flex-1 flex items-center justify-center py-1.5 rounded-lg border hover:bg-primary-50 transition-colors cursor-pointer" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
              <Bookmark size={15} />
            </a>
          </div>
        </div>

        {/* Documentation tabs */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <h4 className="text-[10px] font-bold uppercase tracking-wider mb-3 px-1" style={{ color: 'var(--color-text-tertiary)' }}>Documentation</h4>
          <div className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-[14px] font-bold transition-all"
                  style={{
                    backgroundColor: active ? 'var(--color-primary-50)' : 'transparent',
                    color: active ? 'var(--color-primary-700)' : 'var(--color-text-primary)',
                    borderLeft: active ? '3px solid var(--color-primary-500)' : '3px solid transparent',
                  }}
                >
                  <Icon size={18} style={{ color: active ? 'var(--color-primary-500)' : 'var(--color-text-tertiary)' }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigate */}
        <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <div className="flex gap-2">
            <button onClick={() => importRef.current?.click()} title="Import All" className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-lg cursor-pointer border border-primary-200 bg-primary-50 text-primary-600">
              <Download size={13} />
            </button>
            <button onClick={handleExportAll} title="Export All" className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-lg cursor-pointer border border-primary-200 bg-primary-50 text-primary-600">
              <Upload size={13} />
            </button>
            <a href="help.html" title="Help & Docs" className="flex-1 flex items-center justify-center py-2 px-2 rounded-lg border bg-primary-50 text-primary-600 transition-colors cursor-pointer" style={{ borderColor: 'var(--color-primary-200)' }}>
              <HelpCircle size={15} />
            </a>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-[1]">
        <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
        {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}
        {/* Top Bar (h-16, matching other pages) */}
        <header className="h-16 border-b px-8 flex items-center justify-between shrink-0" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            {tabs.find(t => t.key === activeTab)?.label} Documentation
          </h2>
          <span className="text-[12px] font-bold" style={{ color: 'var(--color-text-tertiary)' }}>SuperX v2.0.0</span>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {activeTab === 'autofiller' && <AutoFillerDocs />}
            {activeTab === 'bookmarks' && <BookmarksDocs />}
            {activeTab === 'tasks' && <TasksDocs />}
            {activeTab === 'data' && <DataManagement setToast={setToast} />}
            {activeTab !== 'data' && <ImportExportInfo />}
          </div>
        </div>
      </main>
    </div>
  );
}
