import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Layout,
  Globe,
  Settings2,
  MousePointer2,
  Keyboard,
  Zap,
  Trash2,
  Bookmark,
  ListTodo,
  Search,
  Tag,
  Pin,
  CheckCircle2,
  Flag,
  CalendarDays,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

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
      <path d="M0 340 Q360 280 720 350 Q1080 420 1440 320" fill="none" stroke={strokeColor} strokeWidth="1.5" />
      <path d="M0 380 Q400 320 800 390 Q1100 440 1440 360" fill="none" stroke={strokeColor} strokeWidth="1.2" />
      <path d="M0 420 Q300 370 650 430 Q1000 480 1440 400" fill="none" stroke={strokeColor} strokeWidth="1" />
      <path d="M0 480 Q350 430 700 490 Q1050 540 1440 450" fill="none" stroke={strokeColor} strokeWidth="0.8" />
      <path d="M0 540 Q380 500 750 540 Q1100 580 1440 510" fill="none" stroke={strokeColor} strokeWidth="0.6" />
      <circle cx="200" cy="700" r="160" fill="none" stroke={strokeColor} strokeWidth="0.6" />
      <circle cx="1200" cy="200" r="140" fill="none" stroke={strokeColor} strokeWidth="0.5" />
    </svg>
  );
}

// ─── Quick Nav Card ─────────────────────────────────────────────────────────
function NavCard({ icon: Icon, title, description, href, color = 'text-primary-500' }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}
    >
      <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 shrink-0">
        <Icon size={22} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-extrabold" style={{ color: 'var(--color-text-primary)' }}>{title}</h4>
        <p className="text-[12px] font-medium mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
      </div>
      <ArrowRight size={16} className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </a>
  );
}

export default function Help() {
  const [theme, setTheme] = useState(() => localStorage.getItem('autofiller-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('autofiller-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="flex flex-col min-h-screen relative" style={{ backgroundColor: 'var(--color-surface)' }}>
      <SvgBackground key={theme} />

      {/* ── Top Nav ── */}
      <div className="sticky top-0 z-30 border-b" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-primary-500">Help & Docs</h1>
            <p className="text-[10px] font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>Super X</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="options.html" className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg cursor-pointer border border-primary-200 bg-primary-50 text-primary-600">
              <Zap size={13} /> AutoFiller
            </a>
            <a href="bookmarks.html" className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg cursor-pointer border border-primary-200 bg-primary-50 text-primary-600">
              <Bookmark size={13} /> Bookmarks
            </a>
            <a href="tasks.html" className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg cursor-pointer border border-primary-200 bg-primary-50 text-primary-600">
              <ListTodo size={13} /> Tasks
            </a>
            <button onClick={toggleTheme} className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-10 relative z-10 space-y-10 selection:bg-primary-200/40">

        {/* Intro */}
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight leading-tight" style={{ color: 'var(--color-text-primary)' }}>Welcome to Super X</h2>
          <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Super X is a developer productivity suite that combines three powerful tools into one extension: <strong>AutoFiller</strong> for form automation, <strong>Bookmarks</strong> for URL management with fast multi-keyword search, and <strong>Tasks</strong> for project tracking with subtasks and priorities.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NavCard icon={Zap} title="AutoFiller" description="Auto-fill forms with configurable URL rules" href="options.html" />
          <NavCard icon={Bookmark} title="Bookmarks" description="Save & search URLs with tags" href="bookmarks.html" />
          <NavCard icon={ListTodo} title="Tasks" description="Track tasks with subtasks & priorities" href="tasks.html" />
        </div>

        {/* ═══════ SECTION 1: AutoFiller ═══════ */}
        <section className="p-8 rounded-3xl shadow-sm border overflow-hidden relative" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-500 rounded-t-3xl" />
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-600"><Layout size={24} /></div>
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>AutoFiller — Core Vocabulary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-black text-primary-600 uppercase tracking-widest text-xs">Application</h4>
              <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>A high-level organizational folder to group related URL rules together (e.g., "Internal CRM", "Staging Server").</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-primary-600 uppercase tracking-widest text-xs">URL Rule</h4>
              <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>The routing logic dictating on which specific web pages AutoFiller should activate. Links URLs to field mappings.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-primary-600 uppercase tracking-widest text-xs">Field Map</h4>
              <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>A precise CSS selector mapping telling AutoFiller how to find an input on a page and what value to auto-fill into it.</p>
            </div>
          </div>
        </section>

        {/* Section 2: URL Masking */}
        <section className="p-8 rounded-3xl shadow-sm border" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-600"><Globe size={24} /></div>
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>AutoFiller — Match Types</h3>
          </div>
          <p className="text-[14px] font-medium leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Each Rule can target multiple domains via flexible Match Types so you don't need to rebuild identical form inputs for every sub-domain.
          </p>
          <div className="space-y-4">
            {[
              { name: 'Exact Match', desc: 'Requires perfect 1:1 character equality. Fails if query parameters are present unless fully mapped.' },
              { name: 'Starts With', desc: 'Intercepts any page branching off a root URL structure entirely (e.g., http://localhost:3000/).' },
              { name: 'Wildcard (*)', desc: 'Replaces any variability with a star. Excellent for dynamic routing. Example: http://localhost:*/api/*/edit' },
            ].map(item => (
              <div key={item.name} className="p-4 rounded-xl border flex gap-4 items-start" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0"></div>
                <div>
                  <h4 className="font-bold text-[14px] mb-1" style={{ color: 'var(--color-text-primary)' }}>{item.name}</h4>
                  <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: CSS Selectors */}
        <section className="p-8 rounded-3xl shadow-sm border" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-600"><MousePointer2 size={24} /></div>
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>AutoFiller — CSS Selectors</h3>
          </div>
          <p className="text-[14px] font-medium leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            AutoFiller uses standard <code>querySelector</code> CSS syntax to locate input elements. Right-click any input and "Inspect" its DOM attributes for precision. The <strong>label field</strong> in settings is the auto-fill text that will be injected into the matched element.
          </p>
          <div className="border rounded-2xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface-raised)' }}>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)' }}>Type</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)' }}>Format</th>
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border)' }}>Example HTML</th>
                </tr>
              </thead>
              <tbody className="text-[13px] font-medium">
                {[
                  { type: 'By ID (Most Stable)', format: '#element-id', example: '<input id="username" /> → #username' },
                  { type: 'By Exact Class', format: '.class-name', example: '<input class="email-input" /> → .email-input' },
                  { type: 'By Name Node', format: 'input[name="value"]', example: '<input name="first_name" /> → input[name="first_name"]' },
                  { type: 'Nested Relational', format: '.parent .child', example: '<form class="card"><input id="pass">... → .card #pass' },
                ].map((row, i) => (
                  <tr key={i} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="px-5 py-4 font-bold" style={{ color: 'var(--color-text-primary)' }}>{row.type}</td>
                    <td className="px-5 py-4"><code className="px-2 py-1 rounded bg-warm-200/50 dark:bg-black/30 font-mono-code text-[12px] font-bold text-primary-600 dark:text-primary-400">{row.format}</code></td>
                    <td className="px-5 py-4 hidden sm:table-cell" style={{ color: 'var(--color-text-secondary)' }}><code>{row.example}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Hotkeys */}
        <section className="p-8 rounded-3xl shadow-sm border" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-600"><Zap size={24} /></div>
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Keyboard Shortcuts</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1 p-6 border rounded-2xl text-center space-y-4" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
              <div className="flex justify-center mb-3 text-primary-500"><Keyboard size={28} /></div>
              <p className="font-extrabold text-[15px]" style={{ color: 'var(--color-text-primary)' }}>AutoFill</p>
              <div className="flex items-center justify-center gap-2 font-mono-code text-sm font-bold opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
                <kbd className="px-2.5 py-1.5 border rounded-lg bg-surface shadow-sm text-xs">Alt</kbd> +
                <kbd className="px-3 py-1.5 border rounded-lg bg-surface shadow-sm text-xs">A</kbd>
              </div>
            </div>
            <div className="flex-1 p-6 border rounded-2xl text-center space-y-4" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
              <div className="flex justify-center mb-3 text-danger-400"><Trash2 size={28} /></div>
              <p className="font-extrabold text-[15px]" style={{ color: 'var(--color-text-primary)' }}>Clear Fields</p>
              <div className="flex items-center justify-center gap-2 font-mono-code text-sm font-bold opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
                <kbd className="px-2.5 py-1.5 border rounded-lg bg-surface shadow-sm text-xs">Alt</kbd> +
                <kbd className="px-3 py-1.5 border rounded-lg bg-surface shadow-sm text-xs">S</kbd>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ SECTION 5: Bookmarks ═══════ */}
        <section className="p-8 rounded-3xl shadow-sm border overflow-hidden relative" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-500 rounded-t-3xl" />
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-600"><Bookmark size={24} /></div>
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Bookmarks — URL Manager</h3>
          </div>
          <p className="text-[14px] font-medium leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Save any URL with custom titles, descriptions, and tags. The standout feature is <strong>fast multi-keyword search</strong> — every word you type is matched against the URL, title, description, and tags simultaneously using AND-logic.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: Search, title: 'Multi-Keyword Search', desc: 'Type multiple words separated by spaces. All keywords must match across URL, title, description, or tags.' },
              { icon: Tag, title: 'Tag System', desc: 'Add colored tags for quick categorization. Use tag filter chips in the header for instant filtering.' },
              { icon: Pin, title: 'Pin & Organize', desc: 'Pin important bookmarks to the top. Switch between grid and list views. Sort by newest, oldest, or alphabetical.' },
              { icon: Globe, title: 'Quick Bookmark', desc: 'Use "Bookmark This Page" from the popup to instantly save the current tab with one click.' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 items-start p-4 rounded-xl border" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
                <item.icon size={18} className="text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[14px] mb-1" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h4>
                  <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ SECTION 6: Tasks ═══════ */}
        <section className="p-8 rounded-3xl shadow-sm border overflow-hidden relative" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-500 rounded-t-3xl" />
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-600"><ListTodo size={24} /></div>
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Tasks — Project Tracker</h3>
          </div>
          <p className="text-[14px] font-medium leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            A full-featured task management system designed for developers. Create tasks, break them into subtasks, set priorities and statuses, and track progress — all within the extension.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: CheckCircle2, title: 'Subtasks & Progress', desc: 'Break tasks into subtasks with individual checkboxes. A visual progress bar tracks overall completion.' },
              { icon: Flag, title: '4 Priority Levels', desc: 'Critical, High, Medium, Low — each with a distinct color accent for quick visual scanning.' },
              { icon: CalendarDays, title: 'Due Dates & Overdue', desc: 'Use the custom calendar picker to set due dates. Overdue tasks are highlighted in red for attention.' },
              { icon: ListTodo, title: 'Status Workflow', desc: 'To Do → In Progress → Done / Blocked. Completed tasks move to a dedicated section to keep your main view clean.' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 items-start p-4 rounded-xl border" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
                <item.icon size={18} className="text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[14px] mb-1" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h4>
                  <p className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Import/Export */}
        <section className="p-8 rounded-3xl shadow-sm border" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-600"><Settings2 size={24} /></div>
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>Import & Export</h3>
          </div>
          <p className="text-[14px] font-medium leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Each module (AutoFiller, Bookmarks, Tasks) supports individual import/export as JSON files. You can also use <strong>"Export All" / "Import All"</strong> from the popup to backup or restore all data at once. Imports are non-destructive — they merge new data and skip duplicates.
          </p>
          <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
            <h4 className="font-bold text-[13px] mb-2" style={{ color: 'var(--color-text-primary)' }}>Export file naming</h4>
            <ul className="text-[12px] font-medium space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
              <li>• AutoFiller settings → via the Settings page Export button</li>
              <li>• Bookmarks → <code>superx-bookmarks.json</code></li>
              <li>• Tasks → <code>superx-tasks.json</code></li>
              <li>• All combined → <code>superx-all-settings.json</code></li>
            </ul>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer
        className="w-full mt-auto border-t py-8 mt-12 mb-12"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-[12px] font-bold" style={{ color: 'var(--color-text-tertiary)' }}>
          <span>Super X Developer Tools</span>
          <span>v2.0.0</span>
        </div>
      </footer>

    </div>
  );
}
