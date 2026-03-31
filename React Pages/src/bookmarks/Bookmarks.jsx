import React, { useState, useEffect, useRef } from 'react';
import {
  Bookmark, Search, Plus, Trash2, X, Globe,
  ExternalLink, Upload, Download, Sun, Moon, Pin, PinOff,
  CheckCircle2, AlertTriangle, Edit3, Tag, BookmarkPlus,
  Grid, List, ChevronDown, ArrowLeft
} from 'lucide-react';

const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

// ─── Tag Color Palette ───────────────────────────────────────────────────────
const TAG_PALETTE = [
  { bg: '#FFF8ED', text: '#8B5526', border: '#FFD9A3' },
  { bg: '#FEF2F2', text: '#A33535', border: '#FACBCB' },
  { bg: '#F0F7F2', text: '#3D7550', border: '#B8DCC0' },
  { bg: '#EFF4FB', text: '#2A5A8A', border: '#B8D3EE' },
  { bg: '#F5F0FF', text: '#6D28D9', border: '#DDD6FE' },
  { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  { bg: '#F0FDFA', text: '#0F766E', border: '#99F6E4' },
  { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
];
function getTagStyle(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length];
}

// ─── SVG Background ─────────────────────────────────────────────────────────
function SvgBackground() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const s = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(180,160,130,0.08)';
  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 900">
      <path d="M0 340 Q360 280 720 350 Q1080 420 1440 320" fill="none" stroke={s} strokeWidth="1.5"/>
      <path d="M0 380 Q400 320 800 390 Q1100 440 1440 360" fill="none" stroke={s} strokeWidth="1.2"/>
      <path d="M0 420 Q300 370 650 430 Q1000 480 1440 400" fill="none" stroke={s} strokeWidth="1"/>
      <path d="M0 480 Q350 430 700 490 Q1050 540 1440 450" fill="none" stroke={s} strokeWidth="0.8"/>
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
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-[13px] font-bold ${type === 'success' ? 'border-success-500/30' : 'border-danger-300'}`}
      style={{ backgroundColor: 'var(--color-surface-card)', color: 'var(--color-text-primary)' }}
    >
      {type === 'success'
        ? <CheckCircle2 size={17} className="text-success-500 shrink-0" />
        : <AlertTriangle size={17} className="text-primary-400 shrink-0" />}
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
          <button onClick={onConfirm} className="flex-1 py-2.5 px-4 text-sm font-bold rounded-xl cursor-pointer text-white bg-danger-500 hover:bg-danger-600 border border-danger-500 hover:border-danger-600">Delete</button>
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

// ─── Tag Input ───────────────────────────────────────────────────────────────
function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input); }
    if (e.key === 'Backspace' && !input && tags.length > 0) onChange(tags.slice(0, -1));
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 items-center px-3 py-2 border rounded-xl min-h-[44px] cursor-text transition-all focus-within:ring-2 focus-within:ring-primary-400/30 focus-within:border-primary-400"
      style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map(tag => {
        const style = getTagStyle(tag);
        return (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border" style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}>
            <Tag size={10} />
            {tag}
            <button onClick={(e) => { e.stopPropagation(); onChange(tags.filter(t => t !== tag)); }} className="ml-0.5 cursor-pointer hover:opacity-70">
              <X size={10} />
            </button>
          </span>
        );
      })}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input.trim() && addTag(input)}
        placeholder={tags.length === 0 ? 'Type a tag + Enter…' : ''}
        className="flex-1 min-w-[80px] bg-transparent outline-none text-[13px] font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      />
    </div>
  );
}

// ─── Bookmark Modal (Add / Edit) ─────────────────────────────────────────────
function BookmarkModal({ bookmark, onSave, onClose }) {
  const [url, setUrl] = useState(bookmark?.url || '');
  const [title, setTitle] = useState(bookmark?.title || '');
  const [description, setDescription] = useState(bookmark?.description || '');
  const [tags, setTags] = useState(bookmark?.tags || []);

  const isEdit = !!bookmark?.id;

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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-xl"><BookmarkPlus size={18} className="text-primary-600" /></div>
            <div>
              <h2 className="text-[17px] font-extrabold" style={{ color: 'var(--color-text-primary)' }}>{isEdit ? 'Edit Bookmark' : 'Add Bookmark'}</h2>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{isEdit ? 'Update bookmark details' : 'Save a new URL for quick access'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}><X size={18} /></button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[420px]">
          <div>
            <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>URL *</label>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Page title…" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What's this page about?" rows={3} className={`${inputCls} resize-none`} style={inputStyle} />
          </div>
          <div>
            <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Tags</label>
            <TagInput tags={tags} onChange={setTags} />
            <p className="text-[11px] font-medium mt-1.5" style={{ color: 'var(--color-text-tertiary)' }}>Press Enter or comma to add a tag</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-raised)' }}>
          <button onClick={onClose} className="px-5 py-2.5 text-[13px] font-bold rounded-xl border cursor-pointer" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>Cancel</button>
          <button onClick={handleSave} disabled={!url.trim()} className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl cursor-pointer shadow-sm">
            <Bookmark size={15} />
            {isEdit ? 'Update' : 'Save Bookmark'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bookmark Card ───────────────────────────────────────────────────────────
function BookmarkCard({ bookmark, onEdit, onDelete, onTogglePin }) {
  const domain = (() => { try { return new URL(bookmark.url).hostname; } catch { return bookmark.url; } })();

  return (
    <div
      className="group relative flex flex-col p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200"
      style={{ backgroundColor: 'var(--color-surface-card)', borderColor: bookmark.pinned ? 'var(--color-primary-300)' : 'var(--color-border)' }}
    >
      {/* Pin indicator */}
      {bookmark.pinned && (
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-sm">
          <Pin size={11} className="text-white fill-white" />
        </div>
      )}

      {/* Domain + Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface-raised)' }}>
            <Globe size={13} style={{ color: 'var(--color-text-tertiary)' }} />
          </div>
          <span className="text-[11px] font-bold truncate" style={{ color: 'var(--color-text-tertiary)' }}>{domain}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onTogglePin(bookmark.id)} className="p-1.5 rounded-lg cursor-pointer hover:bg-primary-50" title={bookmark.pinned ? 'Unpin' : 'Pin'}>
            {bookmark.pinned ? <PinOff size={13} className="text-primary-500" /> : <Pin size={13} style={{ color: 'var(--color-text-tertiary)' }} />}
          </button>
          <button onClick={() => onEdit(bookmark)} className="p-1.5 rounded-lg cursor-pointer hover:bg-primary-50" title="Edit">
            <Edit3 size={13} style={{ color: 'var(--color-text-tertiary)' }} />
          </button>
          <button onClick={() => onDelete(bookmark)} className="p-1.5 rounded-lg cursor-pointer hover:bg-danger-50" title="Delete">
            <Trash2 size={13} className="text-danger-400" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-bold leading-snug mb-1.5 line-clamp-2" style={{ color: 'var(--color-text-primary)' }}>
        {bookmark.title || 'Untitled'}
      </h3>

      {/* Description */}
      {bookmark.description && (
        <p className="text-[12px] font-medium leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
          {bookmark.description}
        </p>
      )}

      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {bookmark.tags.map(tag => {
            const s = getTagStyle(tag);
            return (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border" style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}>
                {tag}
              </span>
            );
          })}
        </div>
      )}

      {/* URL + Open */}
      <div className="mt-auto pt-3 border-t flex items-center gap-2" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noreferrer"
          className="flex-1 text-[11px] font-semibold truncate hover:underline text-primary-600"
          title={bookmark.url}
        >
          {bookmark.url}
        </a>
        <a href={bookmark.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-primary-50 shrink-0 cursor-pointer" title="Open in new tab">
          <ExternalLink size={13} className="text-primary-500" />
        </a>
      </div>
    </div>
  );
}

// ─── Custom Select (reuse pattern) ──────────────────────────────────────────
function CustomSelect({ value, onChange, options, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2.5 border rounded-xl font-bold text-[13px] select-none cursor-pointer transition-all duration-200 ${isOpen ? 'ring-2 ring-primary-400/30' : ''}`}
        style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: isOpen ? 'var(--color-primary-400)' : 'var(--color-border)', color: 'var(--color-text-primary)' }}
      >
        <span className="truncate">{selectedOption?.label || 'Select…'}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--color-text-tertiary)' }} />
      </div>
      {isOpen && (
        <div className="absolute z-20 w-full mt-1.5 py-1 rounded-xl border shadow-lg overflow-y-auto max-h-48" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className="px-4 py-2 text-[13px] font-bold cursor-pointer transition-colors"
              style={{
                backgroundColor: opt.value === value ? 'var(--color-primary-50, #FFF8ED)' : 'transparent',
                color: opt.value === value ? 'var(--color-primary-700, #8B5526)' : 'var(--color-text-primary)'
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Bookmarks Component ────────────────────────────────────────────────
export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const importRef = useRef(null);

  const { theme, toggle: toggleTheme } = useTheme();

  // Load
  useEffect(() => {
    async function load() {
      if (typeof window.chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.local.get('bookmarks');
        if (result.bookmarks) setBookmarks(result.bookmarks);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Save
  const persist = async (data) => {
    setBookmarks(data);
    if (typeof window.chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.set({ bookmarks: data });
    }
  };

  // Search
  const filtered = bookmarks.filter(bm => {
    if (!searchQuery.trim()) return true;
    const keywords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const searchText = [bm.url, bm.title, bm.description, ...(bm.tags || [])].join(' ').toLowerCase();
    return keywords.every(kw => searchText.includes(kw));
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'alpha') return (a.title || '').localeCompare(b.title || '');
    return 0;
  });

  // Handlers
  const handleSave = (bm) => {
    const idx = bookmarks.findIndex(b => b.id === bm.id);
    let updated;
    if (idx >= 0) {
      updated = [...bookmarks];
      updated[idx] = bm;
      setToast({ message: 'Bookmark updated.', type: 'success' });
    } else {
      updated = [...bookmarks, bm];
      setToast({ message: 'Bookmark saved!', type: 'success' });
    }
    persist(updated);
    setShowModal(false);
    setEditingBookmark(null);
  };

  const handleEdit = (bm) => { setEditingBookmark(bm); setShowModal(true); };

  const handleDelete = (bm) => {
    setDeleteModal({
      title: 'Delete Bookmark',
      description: `"${bm.title || bm.url}" will be permanently deleted.`,
      onConfirm: () => {
        persist(bookmarks.filter(b => b.id !== bm.id));
        setDeleteModal(null);
        setToast({ message: 'Bookmark deleted.', type: 'success' });
      }
    });
  };

  const handleTogglePin = (id) => {
    const updated = bookmarks.map(b => b.id === id ? { ...b, pinned: !b.pinned } : b);
    persist(updated);
  };

  // Export bookmarks only
  const handleExport = () => {
    const payload = JSON.stringify({ version: 1, exportType: 'bookmarks', bookmarks }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'autofiller-bookmarks.json';
    link.click();
    URL.revokeObjectURL(url);
    setToast({ message: `Exported ${bookmarks.length} bookmark${bookmarks.length !== 1 ? 's' : ''}.`, type: 'success' });
  };

  // Import bookmarks
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const importedBms = parsed.bookmarks || (Array.isArray(parsed) ? parsed : []);
        if (!Array.isArray(importedBms) || importedBms.length === 0) {
          setToast({ message: 'No bookmarks found in file.', type: 'warn' });
          return;
        }
        const existingIds = new Set(bookmarks.map(b => b.id));
        const newBms = importedBms.filter(b => !existingIds.has(b.id));
        if (newBms.length === 0) {
          setToast({ message: 'All bookmarks already exist.', type: 'warn' });
          return;
        }
        const merged = [...bookmarks, ...newBms];
        persist(merged);
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

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen relative" style={{ backgroundColor: 'var(--color-surface)' }}>
      <SvgBackground key={theme} />
      <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

      {showModal && (
        <BookmarkModal
          bookmark={editingBookmark}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingBookmark(null); }}
        />
      )}
      {deleteModal && <DeleteModal {...deleteModal} onCancel={() => setDeleteModal(null)} />}
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <a href="popup.html" title="Back to Popup" className="p-2 rounded-lg cursor-pointer border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                <ArrowLeft size={16} />
              </a>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-primary-500">Bookmarks</h1>
                <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                  {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''} saved
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => importRef.current?.click()} className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg cursor-pointer border border-primary-200 bg-primary-50 text-primary-600">
                <Download size={13} /> Import
              </button>
              <button onClick={handleExport} disabled={bookmarks.length === 0} className="flex items-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg cursor-pointer border border-primary-200 bg-primary-50 text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed">
                <Upload size={13} /> Export
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-secondary)' }} title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>
          </div>

          {/* Search + Controls */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by URL, title, description, tags…"
                className="w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 font-semibold text-[13px]"
                style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'newest', label: 'Newest first' },
                { value: 'oldest', label: 'Oldest first' },
                { value: 'alpha', label: 'A → Z' },
              ]}
              className="w-40"
            />
            <div className="flex border rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
              <button onClick={() => setViewMode('grid')} className={`p-2.5 cursor-pointer ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : ''}`} style={viewMode !== 'grid' ? { color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-surface-card)' } : {}}>
                <Grid size={15} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2.5 cursor-pointer border-l ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : ''}`} style={viewMode !== 'list' ? { color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' } : { borderColor: 'var(--color-border)' }}>
                <List size={15} />
              </button>
            </div>
            <button
              onClick={() => { setEditingBookmark(null); setShowModal(true); }}
              className="flex items-center gap-2 py-3 px-5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold shadow-sm cursor-pointer text-[13px] shrink-0"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Quick tag filters */}
          {allTags.length > 0 && (
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {allTags.slice(0, 15).map(tag => {
                const isActive = searchQuery.toLowerCase().includes(tag);
                const s = getTagStyle(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(prev => prev.toLowerCase().includes(tag) ? prev.replace(tag, '').trim() : `${prev} ${tag}`.trim())}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-all"
                    style={{
                      backgroundColor: isActive ? s.text : s.bg,
                      color: isActive ? '#fff' : s.text,
                      borderColor: s.border,
                    }}
                  >
                    <Tag size={9} /> {tag}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-6 relative z-[1]">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center p-10 rounded-2xl border border-dashed" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border-strong)' }}>
              <Bookmark size={40} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {searchQuery ? 'No matching bookmarks' : 'No bookmarks yet'}
              </h3>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {searchQuery ? 'Try different keywords or clear your search.' : 'Click "Add" to save your first bookmark.'}
              </p>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'flex flex-col gap-3'
          }>
            {sorted.map(bm => (
              <BookmarkCard key={bm.id} bookmark={bm} onEdit={handleEdit} onDelete={handleDelete} onTogglePin={handleTogglePin} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
