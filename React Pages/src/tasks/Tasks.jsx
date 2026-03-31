import React, { useState, useEffect, useRef } from 'react';
import {
  ListTodo, Plus, Trash2, X, Sun, Moon,
  CheckCircle2, AlertTriangle, Circle, Clock, AlertOctagon,
  ChevronDown, ChevronRight, ChevronLeft, Upload, Download,
  Edit3, Flag, StickyNote, CalendarDays, Zap, Bookmark, HelpCircle,
  Settings2, Archive
} from 'lucide-react';

const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

// ─── Constants ───────────────────────────────────────────────────────────────
const PRIORITIES = [
  { value: 'critical', label: 'Critical', color: '#D94F4F', bg: '#FEF2F2', border: '#FACBCB' },
  { value: 'high',     label: 'High',     color: '#C17F3C', bg: '#FFF8ED', border: '#FFD9A3' },
  { value: 'medium',   label: 'Medium',   color: '#4285C4', bg: '#EFF4FB', border: '#B8D3EE' },
  { value: 'low',      label: 'Low',      color: '#9A8C74', bg: '#FAF8F5', border: '#EBE4D8' },
];

const STATUSES = [
  { value: 'todo',        label: 'To Do',        icon: Circle,        color: '#9A8C74' },
  { value: 'in_progress', label: 'In Progress',  icon: Clock,         color: '#C17F3C' },
  { value: 'done',        label: 'Done',         icon: CheckCircle2,  color: '#5B9A6F' },
  { value: 'blocked',     label: 'Blocked',      icon: AlertOctagon,  color: '#D94F4F' },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const getPriority = (v) => PRIORITIES.find(p => p.value === v) || PRIORITIES[2];
const getStatus = (v) => STATUSES.find(s => s.value === v) || STATUSES[0];

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
function CustomSelect({ value, onChange, options, className = '', renderOption }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    if (isOpen) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2.5 border rounded-xl font-bold text-[13px] select-none cursor-pointer transition-all duration-200 ${isOpen ? 'ring-2 ring-primary-400/30' : ''}`}
        style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: isOpen ? 'var(--color-primary-400)' : 'var(--color-border)', color: 'var(--color-text-primary)' }}
      >
        <span className="truncate">{renderOption ? renderOption(selectedOption) : selectedOption?.label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--color-text-tertiary)' }} />
      </div>
      {isOpen && (
        <div className="absolute z-20 w-full mt-1.5 py-1 rounded-xl border shadow-lg overflow-y-auto max-h-52" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className="px-4 py-2 text-[13px] font-bold cursor-pointer transition-colors"
              style={{
                backgroundColor: opt.value === value ? 'var(--color-primary-50)' : 'transparent',
                color: opt.value === value ? 'var(--color-primary-700)' : 'var(--color-text-primary)'
              }}
            >
              {renderOption ? renderOption(opt) : opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Custom Date Picker ─────────────────────────────────────────────────────
function DatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const today = new Date();
  const selected = value ? new Date(value + 'T00:00:00') : null;
  const [viewYear, setViewYear] = useState(selected?.getFullYear() || today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    if (isOpen) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const isToday = (day) => day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isSelected = (day) => selected && day === selected.getDate() && viewMonth === selected.getMonth() && viewYear === selected.getFullYear();

  const displayStr = selected
    ? `${MONTHS[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}`
    : 'Select date…';

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-3 border rounded-xl font-semibold text-[13px] select-none cursor-pointer transition-all duration-200 ${isOpen ? 'ring-2 ring-primary-400/30 border-primary-400' : ''}`}
        style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: isOpen ? 'var(--color-primary-400)' : 'var(--color-border)', color: value ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}
      >
        <span className="flex items-center gap-2">
          <CalendarDays size={14} style={{ color: 'var(--color-text-tertiary)' }} />
          {displayStr}
        </span>
        {value && (
          <button onClick={(e) => { e.stopPropagation(); onChange(''); }} className="p-0.5 cursor-pointer rounded hover:bg-danger-50" style={{ color: 'var(--color-text-tertiary)' }}>
            <X size={12} />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-30 top-full mt-1.5 p-4 rounded-xl border shadow-xl w-72" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          {/* Month/Year nav */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1.5 rounded-lg cursor-pointer hover:bg-primary-50" style={{ color: 'var(--color-text-secondary)' }}><ChevronLeft size={16} /></button>
            <span className="text-[14px] font-extrabold" style={{ color: 'var(--color-text-primary)' }}>{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg cursor-pointer hover:bg-primary-50" style={{ color: 'var(--color-text-secondary)' }}><ChevronRight size={16} /></button>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold uppercase" style={{ color: 'var(--color-text-tertiary)' }}>{d}</div>
            ))}
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => (
              <div key={i} className="aspect-square flex items-center justify-center">
                {day ? (
                  <button
                    onClick={() => selectDay(day)}
                    className={`w-8 h-8 rounded-lg text-[12px] font-bold cursor-pointer transition-all ${
                      isSelected(day) ? 'bg-primary-500 text-white shadow-sm' :
                      isToday(day) ? 'border-2 border-primary-300' : 'hover:bg-primary-50'
                    }`}
                    style={!isSelected(day) && !isToday(day) ? { color: 'var(--color-text-primary)' } : isToday(day) && !isSelected(day) ? { color: 'var(--color-primary-600)' } : {}}
                  >
                    {day}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          {/* Quick actions */}
          <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <button onClick={() => { const t = new Date(); selectDay(t.getDate()); setViewMonth(t.getMonth()); setViewYear(t.getFullYear()); }} className="flex-1 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer border border-primary-200 bg-primary-50 text-primary-600">Today</button>
            <button onClick={() => { onChange(''); setIsOpen(false); }} className="flex-1 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-surface-raised)' }}>Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Priority Badge ─────────────────────────────────────────────────────────
function PriorityBadge({ priority, size = 'sm' }) {
  const p = getPriority(priority);
  const cls = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]';
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg font-bold border ${cls}`} style={{ backgroundColor: p.bg, color: p.color, borderColor: p.border }}>
      <Flag size={size === 'sm' ? 9 : 11} />
      {p.label}
    </span>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = getStatus(status);
  const Icon = s.icon;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold" style={{ color: s.color }}>
      <Icon size={13} />
      {s.label}
    </span>
  );
}

// ─── Subtask Progress Bar ───────────────────────────────────────────────────
function SubtaskProgress({ subtasks }) {
  if (!subtasks || subtasks.length === 0) return null;
  const done = subtasks.filter(s => s.done).length;
  const pct = Math.round((done / subtasks.length) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border-subtle)' }}>
        <div className="h-full rounded-full bg-success-500 transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-bold shrink-0" style={{ color: 'var(--color-text-tertiary)' }}>{done}/{subtasks.length}</span>
    </div>
  );
}

// ─── Task Modal (Add / Edit) ────────────────────────────────────────────────
function TaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState('');

  const isEdit = !!task?.id;

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks(prev => [...prev, { id: generateId('sub'), title: newSubtask.trim(), done: false, priority: 'medium', note: '' }]);
    setNewSubtask('');
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const done = status === 'done';
    onSave({
      id: task?.id || generateId('task'),
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      done,
      tags: task?.tags || [],
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: dueDate || null,
      subtasks,
    });
  };

  const inputCls = "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400 font-semibold text-[13px]";
  const inputStyle = { backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10 px-4" style={{ backgroundColor: 'var(--color-surface-overlay)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto flex flex-col border relative" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b rounded-t-2xl" style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-card)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-xl"><ListTodo size={18} className="text-primary-600" /></div>
            <div>
              <h2 className="text-[17px] font-extrabold" style={{ color: 'var(--color-text-primary)' }}>{isEdit ? 'Edit Task' : 'New Task'}</h2>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{isEdit ? 'Update task details' : 'Create a new task to track'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ color: 'var(--color-text-tertiary)' }}><X size={18} /></button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs to be done?" className={inputCls} style={inputStyle} />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Priority</label>
              <CustomSelect
                value={priority}
                onChange={setPriority}
                options={PRIORITIES}
                renderOption={(opt) => (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
                    {opt.label}
                  </span>
                )}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Status</label>
              <CustomSelect
                value={status}
                onChange={setStatus}
                options={STATUSES}
                renderOption={(opt) => {
                  const Icon = opt.icon;
                  return (
                    <span className="flex items-center gap-2">
                      <Icon size={13} style={{ color: opt.color }} />
                      {opt.label}
                    </span>
                  );
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Due Date</label>
            <DatePicker value={dueDate} onChange={setDueDate} />
          </div>

          <div>
            <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Notes / Reminder</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add notes, reminders, details…" rows={3} className={`${inputCls} resize-none`} style={inputStyle} />
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-[12px] font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>Subtasks ({subtasks.length})</label>
            <div className="space-y-2 mb-3">
              {subtasks.map((sub, idx) => (
                <div key={sub.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border-subtle)' }}>
                  <button onClick={() => setSubtasks(prev => prev.map((s, i) => i === idx ? { ...s, done: !s.done } : s))} className="cursor-pointer shrink-0">
                    {sub.done ? <CheckCircle2 size={16} className="text-success-500" /> : <Circle size={16} style={{ color: 'var(--color-text-tertiary)' }} />}
                  </button>
                  <input
                    type="text"
                    value={sub.title}
                    onChange={e => setSubtasks(prev => prev.map((s, i) => i === idx ? { ...s, title: e.target.value } : s))}
                    className={`flex-1 bg-transparent outline-none text-[13px] font-semibold ${sub.done ? 'line-through opacity-60' : ''}`}
                    style={{ color: 'var(--color-text-primary)' }}
                  />
                  <button onClick={() => setSubtasks(prev => prev.filter((_, i) => i !== idx))} className="p-1 cursor-pointer shrink-0 text-danger-400 hover:text-danger-600">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSubtask()}
                placeholder="Add a subtask…"
                className="flex-1 px-3 py-2 border rounded-lg text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400"
                style={inputStyle}
              />
              <button onClick={addSubtask} disabled={!newSubtask.trim()} className="px-3 py-2 bg-primary-50 text-primary-600 border border-primary-200 rounded-lg font-bold text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-surface-raised)' }}>
          <button onClick={onClose} className="px-5 py-2.5 text-[13px] font-bold rounded-xl border cursor-pointer" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}>Cancel</button>
          <button onClick={handleSave} disabled={!title.trim()} className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl cursor-pointer shadow-sm">
            <ListTodo size={15} />
            {isEdit ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Task Card ──────────────────────────────────────────────────────────────
function TaskCard({ task, onToggleDone, onToggleSubtask, onEdit, onDelete, compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const p = getPriority(task.priority);
  const totalSubs = task.subtasks?.length || 0;
  const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden ${compact ? 'opacity-70' : ''}`} style={{ backgroundColor: 'var(--color-surface-card)', borderColor: task.done ? 'var(--color-success-200)' : 'var(--color-border)' }}>
      {/* Top accent */}
      <div className="h-1" style={{ backgroundColor: p.color }} />

      <div className="p-5">
        {/* Row 1: Checkbox + Title + Badges */}
        <div className="flex items-start gap-3">
          <button onClick={() => onToggleDone(task.id)} className="mt-0.5 cursor-pointer shrink-0">
            {task.done
              ? <CheckCircle2 size={20} className="text-success-500" />
              : <Circle size={20} style={{ color: 'var(--color-text-tertiary)' }} />
            }
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className={`text-[14px] font-bold leading-snug ${task.done ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--color-text-primary)' }}>
                {task.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
              {task.dueDate && (
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${overdue ? 'text-danger-500' : ''}`} style={overdue ? {} : { color: 'var(--color-text-tertiary)' }}>
                  <CalendarDays size={10} />
                  {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onEdit(task)} className="p-1.5 rounded-lg cursor-pointer hover:bg-primary-50" title="Edit"><Edit3 size={14} style={{ color: 'var(--color-text-tertiary)' }} /></button>
            <button onClick={() => onDelete(task)} className="p-1.5 rounded-lg cursor-pointer hover:bg-danger-50" title="Delete"><Trash2 size={14} className="text-danger-400" /></button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-[12px] font-medium leading-relaxed mt-2 ml-8" style={{ color: 'var(--color-text-secondary)' }}>{task.description}</p>
        )}

        {/* Subtasks */}
        {totalSubs > 0 && (
          <div className="mt-3 ml-8">
            <SubtaskProgress subtasks={task.subtasks} />
            <button onClick={() => setExpanded(prev => !prev)} className="flex items-center gap-1.5 mt-2 text-[11px] font-bold cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
              {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              {totalSubs} subtask{totalSubs !== 1 ? 's' : ''}
            </button>
            <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${expanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="min-h-0 overflow-hidden space-y-1.5">
                {task.subtasks.map(sub => (
                  <div key={sub.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border-subtle)' }}>
                    <button onClick={() => onToggleSubtask(task.id, sub.id)} className="cursor-pointer shrink-0">
                      {sub.done ? <CheckCircle2 size={14} className="text-success-500" /> : <Circle size={14} style={{ color: 'var(--color-text-tertiary)' }} />}
                    </button>
                    <span className={`text-[12px] font-semibold flex-1 ${sub.done ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--color-text-primary)' }}>{sub.title}</span>
                    {sub.note && <StickyNote size={11} style={{ color: 'var(--color-text-tertiary)' }} title={sub.note} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Main Tasks Component ───────────────────────────────────────────────────
export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const importRef = useRef(null);

  const { theme, toggle: toggleTheme } = useTheme();

  // Load
  useEffect(() => {
    async function load() {
      if (typeof window.chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.local.get('tasks');
        if (result.tasks) setTasks(result.tasks);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Save
  const persist = async (data) => {
    setTasks(data);
    if (typeof window.chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.set({ tasks: data });
    }
  };

  // Split active vs completed
  const activeTasks = tasks.filter(t => t.status !== 'done');
  const completedTasks = tasks.filter(t => t.status === 'done');

  // Counts (only active tasks for sidebar counts, except done)
  const statusCounts = {
    all: activeTasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: completedTasks.length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  };

  // Filter + Sort (only on active tasks when not filtering by done)
  const baseList = filterStatus === 'done' ? completedTasks : activeTasks;
  const filtered = baseList.filter(t => {
    if (filterStatus !== 'all' && filterStatus !== 'done' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'priority') return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9);
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'status') {
      const so = { todo: 0, in_progress: 1, blocked: 2, done: 3 };
      return (so[a.status] ?? 9) - (so[b.status] ?? 9);
    }
    return 0;
  });

  // Handlers
  const handleSave = (task) => {
    const idx = tasks.findIndex(t => t.id === task.id);
    let updated;
    if (idx >= 0) {
      updated = [...tasks]; updated[idx] = task;
      setToast({ message: 'Task updated.', type: 'success' });
    } else {
      updated = [...tasks, task];
      setToast({ message: 'Task created!', type: 'success' });
    }
    persist(updated);
    setShowModal(false);
    setEditingTask(null);
  };

  const handleToggleDone = (taskId) => {
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      const newDone = !t.done;
      return { ...t, done: newDone, status: newDone ? 'done' : 'todo', updatedAt: new Date().toISOString() };
    });
    persist(updated);
  };

  const handleToggleSubtask = (taskId, subId) => {
    const updated = tasks.map(t => {
      if (t.id !== taskId) return t;
      const newSubs = t.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s);
      return { ...t, subtasks: newSubs, updatedAt: new Date().toISOString() };
    });
    persist(updated);
  };

  const handleEdit = (task) => { setEditingTask(task); setShowModal(true); };

  const handleDelete = (task) => {
    setDeleteModal({
      title: 'Delete Task',
      description: `"${task.title}" and all its subtasks will be permanently deleted.`,
      onConfirm: () => {
        persist(tasks.filter(t => t.id !== task.id));
        setDeleteModal(null);
        setToast({ message: 'Task deleted.', type: 'success' });
      }
    });
  };

  // Export
  const handleExport = () => {
    const payload = JSON.stringify({ version: 1, exportType: 'tasks', tasks }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'superx-tasks.json'; link.click();
    URL.revokeObjectURL(url);
    setToast({ message: `Exported ${tasks.length} task${tasks.length !== 1 ? 's' : ''}.`, type: 'success' });
  };

  // Import
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const imported = parsed.tasks || (Array.isArray(parsed) ? parsed : []);
        if (!Array.isArray(imported) || imported.length === 0) {
          setToast({ message: 'No tasks found in file.', type: 'warn' }); return;
        }
        const ids = new Set(tasks.map(t => t.id));
        const newTasks = imported.filter(t => !ids.has(t.id));
        if (newTasks.length === 0) { setToast({ message: 'All tasks already exist.', type: 'warn' }); return; }
        persist([...tasks, ...newTasks]);
        setToast({ message: `Imported ${newTasks.length} task${newTasks.length !== 1 ? 's' : ''}.`, type: 'success' });
      } catch {
        setToast({ message: 'Invalid JSON file.', type: 'warn' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Import (also handles combined JSON)
  const handleImportFile = async (e) => {
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
              if (updates.tasks) setTasks(updates.tasks);
              setToast({ message: `Imported: ${parts.join(', ')}.`, type: 'success' });
            } else {
              setToast({ message: 'Everything already exists.', type: 'warn' });
            }
          }
          e.target.value = '';
          return;
        }

        // Tasks-only import (fallback to handleImport)
        handleImport(e);
      } catch {
        setToast({ message: 'Invalid JSON file.', type: 'warn' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (loading) return null;

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ backgroundColor: 'var(--color-surface)' }}>
      <SvgBackground key={theme} />
      <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      {showModal && <TaskModal task={editingTask} onSave={handleSave} onClose={() => { setShowModal(false); setEditingTask(null); }} />}
      {deleteModal && <DeleteModal {...deleteModal} onCancel={() => setDeleteModal(null)} />}
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}

      {/* ── Sidebar ── */}
      <aside className="w-72 flex flex-col border-r shrink-0 z-10 relative" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 border-b" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-primary-500">Tasks</h1>
              <p className="text-[10px] font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>SuperX</p>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
          {/* Quick Nav (3 horizontal icons) */}
          <div className="flex gap-1.5 mt-3">
            <a href="options.html" title="AutoFiller" className="flex-1 flex items-center justify-center py-1.5 rounded-lg border hover:bg-primary-50 transition-colors cursor-pointer" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
              <Zap size={15} />
            </a>
            <a href="bookmarks.html" title="Bookmarks" className="flex-1 flex items-center justify-center py-1.5 rounded-lg border hover:bg-primary-50 transition-colors cursor-pointer" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
              <Bookmark size={15} />
            </a>
            <a href="help.html" title="Help & Docs" className="flex-1 flex items-center justify-center py-1.5 rounded-lg border hover:bg-primary-50 transition-colors cursor-pointer" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
              <HelpCircle size={15} />
            </a>
          </div>
        </div>

        {/* Add Task */}
        <div className="px-4 py-3">
          <button onClick={() => { setEditingTask(null); setShowModal(true); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold shadow-sm cursor-pointer text-[13px]">
            <Plus size={17} /> New Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {/* Status Filter */}
          <div className="mb-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--color-text-tertiary)' }}>Status</h4>
            <div className="space-y-0.5">
              {[{ value: 'all', label: 'Active Tasks', icon: ListTodo, color: 'var(--color-text-secondary)' }, ...STATUSES.filter(s => s.value !== 'done')].map(item => {
                const Icon = item.icon;
                const count = statusCounts[item.value] ?? 0;
                const active = filterStatus === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setFilterStatus(item.value)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-[13px] font-bold transition-colors"
                    style={{
                      backgroundColor: active ? 'var(--color-primary-50)' : 'transparent',
                      color: active ? 'var(--color-primary-700)' : 'var(--color-text-primary)'
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={14} style={{ color: active ? 'var(--color-primary-500)' : item.color }} />
                      {item.label}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: active ? 'var(--color-primary-200)' : 'var(--color-surface-raised)', color: active ? 'var(--color-primary-700)' : 'var(--color-text-tertiary)' }}>
                      {count}
                    </span>
                  </button>
                );
              })}
              {/* Completed section in sidebar */}
              <button
                onClick={() => setFilterStatus('done')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-[13px] font-bold transition-colors"
                style={{
                  backgroundColor: filterStatus === 'done' ? 'var(--color-primary-50)' : 'transparent',
                  color: filterStatus === 'done' ? 'var(--color-primary-700)' : 'var(--color-text-primary)'
                }}
              >
                <span className="flex items-center gap-2">
                  <Archive size={14} style={{ color: filterStatus === 'done' ? 'var(--color-primary-500)' : '#5B9A6F' }} />
                  Completed
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: filterStatus === 'done' ? 'var(--color-primary-200)' : 'var(--color-surface-raised)', color: filterStatus === 'done' ? 'var(--color-primary-700)' : 'var(--color-text-tertiary)' }}>
                  {completedTasks.length}
                </span>
              </button>
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--color-text-tertiary)' }}>Priority</h4>
            <div className="space-y-0.5">
              {[{ value: 'all', label: 'All Priorities', color: '#9A8C74' }, ...PRIORITIES].map(item => {
                const active = filterPriority === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setFilterPriority(item.value)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[13px] font-bold transition-colors"
                    style={{
                      backgroundColor: active ? 'var(--color-primary-50)' : 'transparent',
                      color: active ? 'var(--color-primary-700)' : 'var(--color-text-primary)'
                    }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cross-page nav removed from here */}

        {/* Import / Export at bottom */}
        <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <div className="flex gap-2">
            <button onClick={() => importRef.current?.click()} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg cursor-pointer border border-primary-200 bg-primary-50 text-primary-600">
              <Download size={13} /> Import
            </button>
            <button onClick={handleExport} disabled={tasks.length === 0} className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg cursor-pointer border border-primary-200 bg-primary-50 text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed">
              <Upload size={13} /> Export
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-[1]">
        {/* Top Bar */}
        <header className="h-16 border-b px-8 flex items-center justify-between shrink-0" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
            {filterStatus === 'all' ? 'Active Tasks' : filterStatus === 'done' ? 'Completed' : getStatus(filterStatus).label}
            <span className="text-[13px] font-bold ml-2" style={{ color: 'var(--color-text-tertiary)' }}>({sorted.length})</span>
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold" style={{ color: 'var(--color-text-tertiary)' }}>Sort by</span>
            <CustomSelect
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'priority', label: 'Priority' },
                { value: 'newest', label: 'Newest' },
                { value: 'dueDate', label: 'Due Date' },
                { value: 'status', label: 'Status' },
              ]}
              className="w-36"
            />
          </div>
        </header>

        {/* Task List */}
        <div className="flex-1 p-8 overflow-y-auto">
          {sorted.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-10 rounded-2xl border border-dashed" style={{ backgroundColor: 'var(--color-surface-card)', borderColor: 'var(--color-border-strong)' }}>
                {filterStatus === 'done' ? <Archive size={40} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} /> : <ListTodo size={40} className="mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />}
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  {filterStatus === 'done' ? 'No completed tasks' : tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
                </h3>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {filterStatus === 'done' ? 'Tasks you mark as done will appear here.' : tasks.length === 0 ? 'Click "New Task" to create your first task.' : 'Try different filters.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {sorted.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  compact={filterStatus === 'done'}
                  onToggleDone={handleToggleDone}
                  onToggleSubtask={handleToggleSubtask}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* Completed section on main view */}
          {filterStatus !== 'done' && completedTasks.length > 0 && (
            <div className="max-w-3xl mx-auto mt-8">
              <button
                onClick={() => setShowCompleted(prev => !prev)}
                className="flex items-center gap-2 text-[13px] font-bold cursor-pointer mb-3"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {showCompleted ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Archive size={14} />
                Completed ({completedTasks.length})
              </button>
              {showCompleted && (
                <div className="space-y-3 opacity-60">
                  {completedTasks.slice(0, 10).map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      compact
                      onToggleDone={handleToggleDone}
                      onToggleSubtask={handleToggleSubtask}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                  {completedTasks.length > 10 && (
                    <p className="text-center text-[12px] font-bold py-2" style={{ color: 'var(--color-text-tertiary)' }}>
                      + {completedTasks.length - 10} more — use "Completed" filter to see all
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
