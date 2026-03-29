import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Moon,
  Sun,
  Layout,
  Globe,
  Settings2,
  MousePointer2,
  Keyboard,
  Zap,
  BookOpen,
  Trash2
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
      <path d="M0 600 Q320 560 680 610 Q1020 650 1440 570" fill="none" stroke={strokeColor} strokeWidth="0.5" />
      <path d="M0 660 Q400 640 780 660 Q1100 700 1440 640" fill="none" stroke={strokeColor} strokeWidth="0.4" />
      <path d="M0 200 Q500 160 900 220 Q1200 260 1440 190" fill="none" stroke={strokeColor} strokeWidth="0.7" />
      <path d="M0 240 Q420 200 850 260 Q1150 300 1440 230" fill="none" stroke={strokeColor} strokeWidth="0.5" />
      <path d="M0 150 Q600 120 1000 170 Q1300 200 1440 140" fill="none" stroke={strokeColor} strokeWidth="0.4" />
      <circle cx="200" cy="700" r="160" fill="none" stroke={strokeColor} strokeWidth="0.6" />
      <circle cx="200" cy="700" r="200" fill="none" stroke={strokeColor} strokeWidth="0.4" />
      <circle cx="1200" cy="200" r="300" fill="none" stroke={strokeColor} strokeWidth="0.6" />
      <circle cx="1200" cy="200" r="350" fill="none" stroke={strokeColor} strokeWidth="0.4" />
    </svg>
  );
}

export default function Help() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('autofiller-theme-dark', newTheme === 'dark');
  };

  return (
    <div className="flex flex-col min-h-screen relative" style={{ backgroundColor: 'var(--color-surface)' }}>
      <SvgBackground key={theme} />

      {/* ── Navbar ── */}
      <a
        href="options.html"
        className="absolute right-4 top-4 flex items-center justify-center p-2.5 px-4 transition-colors cursor-pointer border font-bold gap-2 text-primary-600 text-xs rounded-lg border-primary-200 hover:border-primary-300 bg-primary-50"
        title="Open Settings"
      >
        <Settings2 size={16} /> <span className="hidden sm:inline">Settings</span>
      </a>

      {/* ── Main Content ── */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 relative z-10 space-y-10 selection:bg-primary-200/40">

        {/* Intro */}
        <div className="text-center md:text-left md:flex items-center gap-8 mb-4">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-black tracking-tight leading-tight" style={{ color: 'var(--color-text-primary)' }}>Expedite Your Forms.</h2>
            <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              AutoFiller is engineered to accelerate workflows by saving you from monotonous testing and redundant form inputs entirely via powerful, configurable URL rules.
            </p>
          </div>
        </div>

        {/* Section 1: Architecture */}
        <section
          className="p-8 rounded-3xl shadow-sm border overflow-hidden relative"
          style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-500 rounded-t-3xl" />
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-600 dark:bg-primary-500/10 dark:border-primary-500/20 dark:text-primary-400">
              <Layout size={24} />
            </div>
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>1. Core Vocabulary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest text-xs">Application</h4>
              <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>A high-level organizational folder used to group related rules together (e.g., "Internal CRM", "Staging Server").</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest text-xs">URL Rule</h4>
              <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>The routing logic dictating on which specific web pages AutoFiller should intervene. Links URLs to field matchers.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest text-xs">Field Map</h4>
              <p className="text-[13px] font-medium leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>A precise CSS mapping telling AutoFiller how to find a specific input on a webpage and what value to insert.</p>
            </div>
          </div>
        </section>

        {/* Section 2: URL Masking */}
        <section
          className="p-8 rounded-3xl shadow-sm border"
          style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-600 dark:bg-primary-500/10 dark:border-primary-500/20 dark:text-primary-400">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>2. Target Routing (Match Types)</h3>
          </div>
          <p className="text-[14px] font-medium leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Each Rule can target multiple active domains via flexible Match Types so you don't need to rebuild identical form inputs for every sub-domain.
          </p>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border flex gap-4 items-start" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <div>
                <h4 className="font-bold text-[14px] mb-1" style={{ color: 'var(--color-text-primary)' }}>Exact Match</h4>
                <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>String requires perfect 1:1 character equality. Fails abruptly if query parameters (<code>?id=123</code>) are present unless fully mapped.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border flex gap-4 items-start" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <div>
                <h4 className="font-bold text-[14px] mb-1" style={{ color: 'var(--color-text-primary)' }}>Starts With</h4>
                <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>Excellent for root routing structures. Intercepts any page branching off a root structure entirely (e.g., <code>http://localhost:3000/</code>).</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border flex gap-4 items-start" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0"></div>
              <div>
                <h4 className="font-bold text-[14px] mb-1" style={{ color: 'var(--color-text-primary)' }}>Wildcard (*)</h4>
                <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>Replaces any variability with a generic star. Tremendously useful for dynamic routing boundaries and localized test ports. Example: <code>http://localhost:*/api/*/edit</code>.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Field Targets */}
        <section
          className="p-8 rounded-3xl shadow-sm border"
          style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-600 dark:bg-primary-500/10 dark:border-primary-500/20 dark:text-primary-400">
              <MousePointer2 size={24} />
            </div>
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>3. CSS Form Modifiers</h3>
          </div>
          <p className="text-[14px] font-medium leading-relaxed mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            To locate elements, AutoFiller queries using standard querySelector CSS syntax. Right-click any physical input to 'Inspect' its DOM attributes for precision.
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
                <tr className="transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-5 py-4 font-bold" style={{ color: 'var(--color-text-primary)' }}>By ID (Most Stable)</td>
                  <td className="px-5 py-4"><code className="px-2 py-1 rounded bg-warm-200/50 dark:bg-black/30 font-mono-code text-[12px] font-bold text-primary-600 dark:text-primary-400">#element-id</code></td>
                  <td className="px-5 py-4 hidden sm:table-cell" style={{ color: 'var(--color-text-secondary)' }}><code>&lt;input id="username" /&gt;</code> &rarr; <code>#username</code></td>
                </tr>
                <tr className="transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-5 py-4 font-bold" style={{ color: 'var(--color-text-primary)' }}>By Exact Class</td>
                  <td className="px-5 py-4"><code className="px-2 py-1 rounded bg-warm-200/50 dark:bg-black/30 font-mono-code text-[12px] font-bold text-primary-600 dark:text-primary-400">.class-name</code></td>
                  <td className="px-5 py-4 hidden sm:table-cell" style={{ color: 'var(--color-text-secondary)' }}><code>&lt;input class="email-input" /&gt;</code> &rarr; <code>.email-input</code></td>
                </tr>
                <tr className="transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-5 py-4 font-bold" style={{ color: 'var(--color-text-primary)' }}>By Name Node</td>
                  <td className="px-5 py-4"><code className="px-2 py-1 rounded bg-warm-200/50 dark:bg-black/30 font-mono-code text-[12px] font-bold text-primary-600 dark:text-primary-400">input[name="value"]</code></td>
                  <td className="px-5 py-4 hidden sm:table-cell" style={{ color: 'var(--color-text-secondary)' }}><code>&lt;input name="first_name" /&gt;</code> &rarr; <code>input[name="first_name"]</code></td>
                </tr>
                <tr className="transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-5 py-4 font-bold" style={{ color: 'var(--color-text-primary)' }}>Nested Relational</td>
                  <td className="px-5 py-4"><code className="px-2 py-1 rounded bg-warm-200/50 dark:bg-black/30 font-mono-code text-[12px] font-bold text-primary-600 dark:text-primary-400">.parent .child</code></td>
                  <td className="px-5 py-4 hidden sm:table-cell" style={{ color: 'var(--color-text-secondary)' }}><code>&lt;form class="card"&gt;&lt;input id="pass"&gt;...</code> &rarr; <code>.card #pass</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Hotkeys */}
        <section
          className="p-8 rounded-3xl shadow-sm border"
          style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-600 dark:bg-primary-500/10 dark:border-primary-500/20 dark:text-primary-400">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary)' }}>4. Engine Executions</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-5">
            <div
              className="flex-1 p-6 border rounded-2xl text-center space-y-4"
              style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex justify-center mb-3 text-primary-500"><Keyboard size={28} /></div>
              <p className="font-extrabold text-[15px]" style={{ color: 'var(--color-text-primary)' }}>Inject Routine</p>
              <div className="flex items-center justify-center gap-2 font-mono-code text-sm font-bold opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
                <kbd className="px-2.5 py-1.5 border rounded-lg bg-surface shadow-sm">Ctrl</kbd> +
                <kbd className="px-2.5 py-1.5 border rounded-lg bg-surface shadow-sm">Space</kbd>
              </div>
            </div>
            <div
              className="flex-1 p-6 border rounded-2xl text-center space-y-4"
              style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex justify-center mb-3 text-danger-400"><Trash2 size={28} /></div>
              <p className="font-extrabold text-[15px]" style={{ color: 'var(--color-text-primary)' }}>Wipe Sequence</p>
              <div className="flex items-center justify-center gap-2 font-mono-code text-sm font-bold opacity-80" style={{ color: 'var(--color-text-secondary)' }}>
                <kbd className="px-2 py-1.5 border rounded-lg bg-surface shadow-sm text-xs">Ctrl</kbd> +
                <kbd className="px-2 py-1.5 border rounded-lg bg-surface shadow-sm text-xs">Shift</kbd> +
                <kbd className="px-2 py-1.5 border rounded-lg bg-surface shadow-sm text-xs">Space</kbd>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer
        className="w-full mt-auto border-t py-8 mt-12 mb-12"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-[12px] font-bold" style={{ color: 'var(--color-text-tertiary)' }}>
          <span>AutoFiller Developer Tools</span>
          <span>v1.0.0</span>
        </div>
      </footer>

    </div>
  );
}
