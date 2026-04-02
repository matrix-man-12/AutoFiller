import React, { useState, useEffect, useRef } from 'react';
import {
  Bookmark, Search, Plus, Trash2, X, Globe,
  ExternalLink, Upload, Download, Sun, Moon, Pin, PinOff,
  CheckCircle2, AlertTriangle, Edit3, Tag, BookmarkPlus,
  Grid, List, ChevronDown, Zap, ListTodo, HelpCircle
} from 'lucide-react';

const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

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

// ─── Delete Modal ────────────────────────────────────────────────────────────
function DeleteModal({ title, description, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-overlay)' }} onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="w-full max-w-sm mx-4 rounded-2xl shadow-2xl overflow-hidden border" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--color-danger-50)' }}>
            <AlertTriangle size={28} className="text-danger-500" />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-raised)' }}>
          <button onClick={onCancel} className="flex-1 py-2.5 px-4 text-sm font-bold rounded-xl border cursor-pointer" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 px-4 text-sm font-bold rounded-xl cursor-pointer text-white bg-danger-500 hover:bg-danger-600 border border-danger-500">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Theme Hook ──────────────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('autofiller-theme') || 'light');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('autofiller-theme', theme); }, [theme]);
  const toggle = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  return { theme, toggle };
}

// ─── Custom Select ──────────────────────────────────────────────────────────
function CustomSelect({ value, onChange, options, className = '', renderOption, compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    if (isOpen) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen]);

  const py = compact ? 'py-2' : 'py-2.5';
  const rounded = compact ? 'rounded-lg' : 'rounded-xl';

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 ${py} border ${rounded} font-bold text-[13px] select-none cursor-pointer transition-all duration-200 ${isOpen ? 'ring-2 ring-primary-400/30' : ''}`}
        style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: isOpen ? 'var(--color-primary-400)' : 'var(--color-border)', color: 'var(--color-text-primary)' }}
      >
        <span className="truncate text-left">{renderOption ? renderOption(selectedOption) : selectedOption?.label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--color-text-tertiary)' }} />
      </div>
      {isOpen && (
        <div className="absolute z-20 w-full mt-1.5 py-1 rounded-xl border shadow-lg overflow-y-auto max-h-52" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          {options.map(opt => (
            <div key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} className="px-4 py-2 text-[13px] font-bold cursor-pointer" style={{ backgroundColor: opt.value === value ? 'var(--color-primary-50)' : 'transparent', color: opt.value === value ? 'var(--color-primary-700)' : 'var(--color-text-primary)' }}>
              {renderOption ? renderOption(opt) : opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tag Color Helper ───────────────────────────────────────────────────────
function getTagStyle(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return {
    bg: `hsl(${hue}, 40%, 95%)`,
    text: `hsl(${hue}, 50%, 35%)`,
    border: `hsl(${hue}, 35%, 85%)`,
  };
}

// ─── Bookmark Modal ─────────────────────────────────────────────────────────
function BookmarkModal({ bookmark, onSave, onClose }) {
  const [url, setUrl] = useState(bookmark?.url || '');
  const [title, setTitle] = useState(bookmark?.title || '');
  const [description, setDescription] = useState(bookmark?.description || '');
  const [tags, setTags] = useState(bookmark?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const isEdit = !!bookmark?.id;

  const addTag = () => {
    if (tags.length >= 8) return;
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) { setTags(prev => [...prev, t]); setTagInput(''); }
  };

  const handleSave = () => {
    if (!url.trim()) return;
    onSave({
      id: bookmark?.id || generateId('bm'),
      url: url.trim(),
      title: title.trim() || url.trim(),
      description: description.trim(),
      tags,
      pinned: bookmark?.pinned || false,
      createdAt: bookmark?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const inputCls = "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 font-semibold text-[13px]";
  const inputStyle = { backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-overlay)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden border" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-xl"><Bookmark size={18} className="text-primary-600" /></div>
            <div>
              <h2 className="text-[17px] font-extrabold" style={{ color: 'var(--color-text-primary)' }}>{isEdit ? 'Edit Bookmark' : 'New Bookmark'}</h2>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{isEdit ? 'Update bookmark details' : 'Save a URL to your collection'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[480px]">
          <div>
            <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>URL *</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Page title" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional notes…" rows={2} className={`${inputCls} resize-none`} style={inputStyle} />
          </div>
          <div>
            <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Tags</label>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map(tag => {
                  const s = getTagStyle(tag);
                  return (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border" style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}>
                      <Tag size={9} /> {tag}
                      <button onClick={() => setTags(prev => prev.filter(t => t !== tag))} className="ml-0.5 cursor-pointer"><X size={10} /></button>
                    </span>
                  );
                })}
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} disabled={tags.length >= 8} placeholder={tags.length >= 8 ? "Maximum 8 tags reached" : "Add a tag…"} className="flex-1 px-3 py-2 border rounded-lg text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed" style={inputStyle} />
              <button onClick={addTag} disabled={!tagInput.trim() || tags.length >= 8} className="px-3 py-2 bg-primary-50 text-primary-600 border border-primary-200 rounded-lg font-bold text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"><Plus size={14} /></button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-raised)' }}>
          <button onClick={onClose} className="px-5 py-2.5 text-[13px] font-bold rounded-xl border cursor-pointer" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>Cancel</button>
          <button onClick={handleSave} disabled={!url.trim()} className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl cursor-pointer shadow-sm">
            <BookmarkPlus size={15} /> {isEdit ? 'Update' : 'Save Bookmark'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bookmark Card ──────────────────────────────────────────────────────────
function BookmarkCard({ bookmark, onEdit, onDelete, onTogglePin }) {
  const domain = (() => { try { return new URL(bookmark.url).hostname; } catch { return bookmark.url; } })();
  return (
    <div className="rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: bookmark.pinned ? 'var(--color-primary-300)' : 'var(--color-border)' }}>
      {bookmark.pinned && <div className="h-1 bg-primary-400" />}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold leading-snug truncate" style={{ color: 'var(--color-text-primary)' }}>{bookmark.title || bookmark.url}</h3>
            <a href={bookmark.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold mt-1 hover:underline truncate max-w-full" style={{ color: 'var(--color-text-tertiary)' }}>
              <Globe size={10} className="shrink-0" /> {domain} <ExternalLink size={9} className="shrink-0" />
            </a>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button onClick={() => onTogglePin(bookmark.id)} className="p-1.5 rounded-lg cursor-pointer hover:bg-primary-50" title={bookmark.pinned ? 'Unpin' : 'Pin'}>
              {bookmark.pinned ? <Pin size={13} className="text-primary-500" /> : <PinOff size={13} style={{ color: 'var(--color-text-tertiary)' }} />}
            </button>
            <button onClick={() => onEdit(bookmark)} className="p-1.5 rounded-lg cursor-pointer hover:bg-primary-50" title="Edit"><Edit3 size={13} style={{ color: 'var(--color-text-tertiary)' }} /></button>
            <button onClick={() => onDelete(bookmark)} className="p-1.5 rounded-lg cursor-pointer hover:bg-danger-50" title="Delete"><Trash2 size={13} className="text-danger-400" /></button>
          </div>
        </div>
        {bookmark.description && <p className="text-[12px] font-medium leading-relaxed mb-2 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{bookmark.description}</p>}
        {bookmark.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {bookmark.tags.map(tag => {
              const s = getTagStyle(tag);
              return <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border" style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}><Tag size={8} />{tag}</span>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Bookmarks Component ───────────────────────────────────────────────
export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const importRef = useRef(null);

  const { theme, toggle: toggleTheme } = useTheme();

  // Load & Listen
  useEffect(() => {
    async function load() {
      if (typeof window.chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.local.get('bookmarks');
        if (result.bookmarks) setBookmarks(result.bookmarks);
      }
      setLoading(false);
    }
    load();

    const handleStorageChange = (changes, area) => {
      if (area === 'local' && changes.bookmarks) {
        setBookmarks(changes.bookmarks.newValue || []);
      }
    };

    if (typeof window.chrome !== 'undefined' && chrome.storage) {
      chrome.storage.onChanged.addListener(handleStorageChange);
    }

    return () => {
      if (typeof window.chrome !== 'undefined' && chrome.storage) {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    };
  }, []);

  // Save
  const persist = async (data) => {
    setBookmarks(data);
    if (typeof window.chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.set({ bookmarks: data });
    }
  };

  // CRUD handlers
  const handleSave = (bookmark) => {
    const idx = bookmarks.findIndex(b => b.id === bookmark.id);
    let updated;
    if (idx >= 0) {
      updated = [...bookmarks]; updated[idx] = bookmark;
      setToast({ message: 'Bookmark updated.', type: 'success' });
    } else {
      updated = [...bookmarks, bookmark];
      setToast({ message: 'Bookmark saved!', type: 'success' });
    }
    persist(updated);
    setShowModal(false);
    setEditingBookmark(null);
  };

  const handleEdit = (bookmark) => { setEditingBookmark(bookmark); setShowModal(true); };

  const handleDelete = (bookmark) => {
    setDeleteModal({
      title: 'Delete Bookmark',
      description: `"${bookmark.title || bookmark.url}" will be permanently deleted.`,
      onConfirm: () => {
        persist(bookmarks.filter(b => b.id !== bookmark.id));
        setDeleteModal(null);
        setToast({ message: 'Bookmark deleted.', type: 'success' });
      }
    });
  };

  const handleTogglePin = (id) => {
    persist(bookmarks.map(b => b.id === id ? { ...b, pinned: !b.pinned, updatedAt: new Date().toISOString() } : b));
  };

  // Export (bookmarks only)
  const handleExport = () => {
    const payload = JSON.stringify({ version: 1, exportType: 'bookmarks', bookmarks }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'superx-bookmarks.json'; link.click();
    URL.revokeObjectURL(url);
    setToast({ message: `Exported ${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''}.`, type: 'success' });
  };

  // Import (bookmarks only — also handles combined JSON)
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);

        // If it's a combined export, import ALL data across all features
        if (parsed.exportType === 'full') {
          if (typeof window.chrome !== 'undefined' && chrome.storage) {
            const result = await chrome.storage.local.get(['apps', 'bookmarks', 'tasks']);
            const updates = {};
            let parts = [];
            if (parsed.apps?.length) {
              const existing = result.apps || [];
              const ids = new Set(existing.map(a => a.id));
              const newItems = parsed.apps.filter(a => !ids.has(a.id));
              if (newItems.length) { updates.apps = [...existing, ...newItems]; parts.push(`${newItems.length} app(s)`); }
            }
            if (parsed.bookmarks?.length) {
              const existing = result.bookmarks || [];
              const ids = new Set(existing.map(b => b.id));
              const newItems = parsed.bookmarks.filter(b => !ids.has(b.id));
              if (newItems.length) { updates.bookmarks = [...existing, ...newItems]; parts.push(`${newItems.length} bookmark(s)`); }
            }
            if (parsed.tasks?.length) {
              const existing = result.tasks || [];
              const ids = new Set(existing.map(t => t.id));
              const newItems = parsed.tasks.filter(t => !ids.has(t.id));
              if (newItems.length) { updates.tasks = [...existing, ...newItems]; parts.push(`${newItems.length} task(s)`); }
            }
            if (Object.keys(updates).length) {
              await chrome.storage.local.set(updates);
              if (updates.bookmarks) setBookmarks(updates.bookmarks);
              setToast({ message: `Imported: ${parts.join(', ')}.`, type: 'success' });
            } else {
              setToast({ message: 'Everything already exists.', type: 'warn' });
            }
          }
          e.target.value = '';
          return;
        }

        // Bookmarks-only import
        const importedBms = parsed.bookmarks || (Array.isArray(parsed) ? parsed : []);
        if (!Array.isArray(importedBms) || importedBms.length === 0) {
          setToast({ message: 'No bookmarks found in file.', type: 'warn' }); return;
        }
        const existingIds = new Set(bookmarks.map(b => b.id));
        const newBms = importedBms.filter(b => !existingIds.has(b.id));
        if (newBms.length === 0) { setToast({ message: 'All bookmarks already exist.', type: 'warn' }); return; }
        persist([...bookmarks, ...newBms]);
        setToast({ message: `Imported ${newBms.length} bookmark${newBms.length !== 1 ? 's' : ''}.`, type: 'success' });
      } catch {
        setToast({ message: 'Invalid JSON file.', type: 'warn' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // All unique tags
  const allTags = [...new Set(bookmarks.flatMap(b => b.tags || []))].sort();

  // Search + Sort
  const searched = bookmarks.filter(bm => {
    if (!searchQuery.trim()) return true;
    const keywords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const haystack = [bm.url, bm.title, bm.description, ...(bm.tags || [])].join(' ').toLowerCase();
    return keywords.every(kw => haystack.includes(kw));
  });

  const sorted = [...searched].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'alpha') return (a.title || a.url).localeCompare(b.title || b.url);
    return 0;
  });

  if (loading) return null;

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ backgroundColor: 'var(--color-surface)' }}>
      <SvgBackground key={theme} />
      <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

      {showModal && <BookmarkModal bookmark={editingBookmark} onSave={handleSave} onClose={() => { setShowModal(false); setEditingBookmark(null); }} />}
      {deleteModal && <DeleteModal {...deleteModal} onCancel={() => setDeleteModal(null)} />}
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}

      {/* ── Sidebar (matches AutoFiller & Tasks layout) ── */}
      <aside className="w-72 flex flex-col border-r shrink-0 z-10 relative" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        {/* Brand Header */}
        <div className="px-5 pt-6 pb-5 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-primary-500">Bookmarks</h1>
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
            <a href="bookmarks.html" title="Bookmarks" className="flex-1 flex items-center justify-center py-1.5 rounded-lg border bg-primary-50 text-primary-600 transition-colors cursor-pointer" style={{ borderColor: 'var(--color-primary-200)' }}>
              <Bookmark size={15} />
            </a>
          </div>
        </div>

        {/* Add Bookmark */}
        <div className="px-4 py-3">
          <button onClick={() => { setEditingBookmark(null); setShowModal(true); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold shadow-sm cursor-pointer text-[13px]">
            <Plus size={17} /> Add Bookmark
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search bookmarks…"
              className="w-full pl-9 pr-8 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 font-semibold text-[12px]"
              style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {allTags.length > 0 && (
            <div className="mb-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--color-text-tertiary)' }}>Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {allTags.slice(0, 20).map(tag => {
                  const isActive = searchQuery.toLowerCase().includes(tag);
                  const s = getTagStyle(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(prev => prev.toLowerCase().includes(tag) ? prev.replace(tag, '').trim() : `${prev} ${tag}`.trim())}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-all"
                      style={{ backgroundColor: isActive ? s.text : s.bg, color: isActive ? '#fff' : s.text, borderColor: s.border }}
                    >
                      <Tag size={8} /> {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sort + View */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider px-1" style={{ color: 'var(--color-text-tertiary)' }}>Sort</h4>
            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              compact={true}
              options={[
                { value: 'newest', label: 'Newest first' },
                { value: 'oldest', label: 'Oldest first' },
                { value: 'alpha', label: 'A → Z' },
              ]}
            />
            <div className="flex border rounded-lg overflow-hidden mt-2" style={{ borderColor: 'var(--color-border)' }}>
              <button onClick={() => setViewMode('grid')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold cursor-pointer ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : ''}`} style={viewMode !== 'grid' ? { color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-surface-card)' } : {}}>
                <Grid size={13} /> Grid
              </button>
              <button onClick={() => setViewMode('list')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold cursor-pointer border-l ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : ''}`} style={viewMode !== 'list' ? { color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' } : { borderColor: 'var(--color-border)' }}>
                <List size={13} /> List
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 p-3 rounded-lg border" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border-subtle)' }}>
            <p className="text-[11px] font-bold" style={{ color: 'var(--color-text-tertiary)' }}>
              {bookmarks.length} total · {bookmarks.filter(b => b.pinned).length} pinned · {allTags.length} tags
            </p>
          </div>
        </div>

        {/* Navigation moved to top */}

        {/* Import / Export at bottom */}
        <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <div className="flex gap-2">
            <button onClick={() => importRef.current?.click()} title="Import" className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-lg cursor-pointer border border-primary-200 bg-primary-50 text-primary-600">
              <Download size={13} />
            </button>
            <button onClick={handleExport} disabled={bookmarks.length === 0} title="Export" className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-lg cursor-pointer border border-primary-200 bg-primary-50 text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed">
              <Upload size={13} />
            </button>
            <a href="help.html" title="Help & Docs" className="flex-1 flex items-center justify-center py-2 px-2 rounded-lg border hover:bg-primary-50 transition-colors cursor-pointer" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
              <HelpCircle size={15} />
            </a>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-[1]">
        {/* Top Bar (matching AutoFiller/Tasks h-16 bar) */}
        <header className="h-16 border-b px-8 flex items-center justify-between shrink-0" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            {searchQuery ? 'Search Results' : 'All Bookmarks'}
            <span className="text-[13px] font-bold ml-2" style={{ color: 'var(--color-text-tertiary)' }}>({sorted.length})</span>
          </h2>
        </header>

        {/* Bookmark Cards */}
        <div className="flex-1 p-8 overflow-y-auto">
          {sorted.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-10 rounded-2xl border border-dashed" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border-strong)' }}>
                <Bookmark size={40} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  {searchQuery ? 'No matching bookmarks' : 'No bookmarks yet'}
                </h3>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {searchQuery ? 'Try different keywords or clear your search.' : 'Click "Add Bookmark" to save your first URL.'}
                </p>
              </div>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto' : 'flex flex-col gap-3 max-w-4xl mx-auto'}>
              {sorted.map(bm => (
                <BookmarkCard key={bm.id} bookmark={bm} onEdit={handleEdit} onDelete={handleDelete} onTogglePin={handleTogglePin} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
