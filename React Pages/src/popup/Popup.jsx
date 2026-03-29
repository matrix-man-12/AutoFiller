import React, { useState, useEffect } from 'react';
import { Zap, Eraser, Settings, HelpCircle, Sun, Moon } from 'lucide-react';

export default function Popup() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('autofiller-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('autofiller-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleAutoFill = () => {
    if (chrome && chrome.runtime) {
      chrome.runtime.sendMessage({ action: 'trigger_autofill' });
      window.close();
    } else {
      console.log('AutoFill Triggered (Dev Mode)');
    }
  };

  const handleAutoClear = () => {
    if (chrome && chrome.runtime) {
      chrome.runtime.sendMessage({ action: 'trigger_autoclear' });
      window.close();
    } else {
      console.log('AutoClear Triggered (Dev Mode)');
    }
  };

  const openOptions = () => {
    if (chrome && chrome.runtime) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('../options.html', '_blank');
    }
  };

  return (
    <div 
      className="flex flex-col w-full"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      {/* Header strip */}
      <div 
        className="px-5 pt-5 pb-4 border-b"
        style={{ 
          backgroundColor: 'var(--color-surface-card)', 
          borderColor: 'var(--color-border-subtle)' 
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-primary-500 leading-none">AutoFiller</h2>
            <p className="text-[11px] font-semibold mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Quick Actions</p>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 pt-4 pb-3 space-y-2.5">
        <button 
          onClick={handleAutoFill}
          className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold shadow-sm cursor-pointer"
        >
          <Zap size={17} className="fill-white" />
          AutoFill Now
        </button>

        <button 
          onClick={handleAutoClear}
          className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-danger-500 hover:bg-danger-600 text-white rounded-xl font-bold shadow-sm cursor-pointer"
        >
          <Eraser size={17} />
          Clear Fields
        </button>
      </div>

      {/* Divider */}
      <div className="px-4">
        <div className="h-px" style={{ backgroundColor: 'var(--color-border-subtle)' }} />
      </div>

      {/* Bottom row */}
      <div className="flex gap-2 px-4 py-3">
        <button 
          onClick={openOptions}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg font-bold cursor-pointer text-sm"
          style={{ 
            backgroundColor: 'var(--color-surface-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)'
          }}
        >
          <Settings size={15} style={{ color: 'var(--color-text-secondary)' }} />
          Settings
        </button>
        <a 
          href="help.html" 
          target="_blank" 
          title="Help & Docs"
          className="flex items-center justify-center p-2.5 rounded-lg cursor-pointer border"
          style={{ 
            backgroundColor: 'var(--color-surface-raised)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-secondary)'
          }}
        >
          <HelpCircle size={17} />
        </a>
      </div>
    </div>
  );
}
