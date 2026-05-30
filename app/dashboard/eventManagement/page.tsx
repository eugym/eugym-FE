"use client";

import { useState } from "react";
import { Plus, X, CalendarDays, Users, Tag, MapPin, Clock, AlertTriangle, Trash2, Pencil, Eye } from "lucide-react";
import { Table, ITableBody, ITableHead, ITableDropdownOptions } from "@/components/table";
import Button from "@/components/ui/Button";
import { useEventsStore } from "@/app/store/events";
import type { GymEvent, EventCategory, EventStatus } from "@/app/store/events";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const CATEGORIES: EventCategory[] = [
  "Yoga","HIIT","Outdoor","Bootcamp","Nutrition","Swimming","CrossFit","Cycling","Running","General",
];

const STATUSES: EventStatus[] = ["upcoming","ongoing","completed","cancelled"];

const CATEGORY_COLOR: Record<EventCategory, string> = {
  Yoga:      "bg-purple-50 text-purple-700 border-purple-200",
  HIIT:      "bg-rose-50 text-rose-700 border-rose-200",
  Outdoor:   "bg-sky-50 text-sky-700 border-sky-200",
  Bootcamp:  "bg-orange-50 text-orange-700 border-orange-200",
  Nutrition: "bg-teal-50 text-teal-700 border-teal-200",
  Swimming:  "bg-cyan-50 text-cyan-700 border-cyan-200",
  CrossFit:  "bg-indigo-50 text-indigo-700 border-indigo-200",
  Cycling:   "bg-amber-50 text-amber-700 border-amber-200",
  Running:   "bg-green-50 text-green-700 border-green-200",
  General:   "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_COLOR: Record<EventStatus, string> = {
  upcoming:  "bg-sky-50 text-sky-700 border-sky-200",
  ongoing:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const fmt = (n: number) => `₦${n.toLocaleString("en-NG")}`;

function fmt12(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function timeRange(s: string, e: string) {
  return `${fmt12(s)} – ${fmt12(e)}`;
}

function displayDate(iso: string) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-NG", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

// ─────────────────────────────────────────────
// Inline badge (used in table cells)
// ─────────────────────────────────────────────
function Chip({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Event form (shared by Create + Edit)
// ─────────────────────────────────────────────
interface EventFormData {
  title: string;
  category: EventCategory;
  type: "Free" | "Paid";
  price: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: string;
  description: string;
  status: EventStatus;
}

const EMPTY_FORM: EventFormData = {
  title: "", category: "General", type: "Free", price: "",
  date: "", startTime: "", endTime: "",
  location: "", capacity: "", description: "", status: "upcoming",
};

function eventToForm(e: GymEvent): EventFormData {
  return {
    title: e.title, category: e.category, type: e.type,
    price: e.price ? String(e.price) : "",
    date: e.date, startTime: e.startTime, endTime: e.endTime,
    location: e.location, capacity: String(e.capacity),
    description: e.description, status: e.status,
  };
}

function formValid(f: EventFormData) {
  return (
    f.title.trim() && f.date && f.startTime && f.endTime &&
    f.location.trim() && Number(f.capacity) >= 1 &&
    (f.type === "Free" || Number(f.price) > 0)
  );
}

interface EventFormProps {
  data: EventFormData;
  onChange: (d: EventFormData) => void;
  showStatus?: boolean;
}

function EventForm({ data, onChange, showStatus }: EventFormProps) {
  const set = <K extends keyof EventFormData>(k: K, v: EventFormData[K]) =>
    onChange({ ...data, [k]: v });

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="form-label">Event Title *</label>
        <input
          value={data.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Beach Yoga Session"
          className="form-input"
        />
      </div>

      {/* Category + Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Category *</label>
          <select value={data.category} onChange={(e) => set("category", e.target.value as EventCategory)} className="form-input">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Type *</label>
          <div className="flex mt-1 rounded-lg border border-gray-200 overflow-hidden">
            {(["Free","Paid"] as const).map((t) => (
              <button
                key={t} type="button"
                onClick={() => set("type", t)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  data.type === t
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price (conditional) */}
      {data.type === "Paid" && (
        <div>
          <label className="form-label">Price (₦) *</label>
          <input
            type="number" min="1" value={data.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="e.g. 5000"
            className="form-input"
          />
        </div>
      )}

      {/* Date + Times */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3 sm:col-span-1">
          <label className="form-label">Date *</label>
          <input type="date" value={data.date} onChange={(e) => set("date", e.target.value)} className="form-input" />
        </div>
        <div>
          <label className="form-label">Start Time *</label>
          <input type="time" value={data.startTime} onChange={(e) => set("startTime", e.target.value)} className="form-input" />
        </div>
        <div>
          <label className="form-label">End Time *</label>
          <input type="time" value={data.endTime} onChange={(e) => set("endTime", e.target.value)} className="form-input" />
        </div>
      </div>

      {/* Location + Capacity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="form-label">Location *</label>
          <input value={data.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Tarkwa Bay Beach, Lagos" className="form-input" />
        </div>
        <div>
          <label className="form-label">Capacity *</label>
          <input type="number" min="1" value={data.capacity} onChange={(e) => set("capacity", e.target.value)} placeholder="e.g. 30" className="form-input" />
        </div>
      </div>

      {/* Status (edit only) */}
      {showStatus && (
        <div>
          <label className="form-label">Status</label>
          <select value={data.status} onChange={(e) => set("status", e.target.value as EventStatus)} className="form-input">
            {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="form-label">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Describe what attendees can expect…"
          className="form-input resize-none"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Create / Edit modal
// ─────────────────────────────────────────────
function EventModal({ title, form, onChange, onSubmit, onClose, submitting, showStatus }: {
  title: string;
  form: EventFormData;
  onChange: (d: EventFormData) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitting?: boolean;
  showStatus?: boolean;
}) {
  return (
    <ModalShell title={title} onClose={onClose} wide>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <EventForm data={form} onChange={onChange} showStatus={showStatus} />
      </div>
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <Button type="button" onClick={onSubmit} loading={submitting} disabled={!formValid(form)}>
          {title.startsWith("Edit") ? "Save Changes" : "Create Event"}
        </Button>
      </div>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────
// View details modal
// ─────────────────────────────────────────────
function ViewModal({ event, onClose, onEdit, onCancel, onDelete }: {
  event: GymEvent;
  onClose: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const isCancellable = event.status === "upcoming" || event.status === "ongoing";

  return (
    <ModalShell title="Event Details" onClose={onClose} wide>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Chip label={event.category} cls={CATEGORY_COLOR[event.category]} />
          <Chip
            label={event.type === "Paid" && event.price ? fmt(event.price) : "Free"}
            cls={event.type === "Free"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"}
          />
          <Chip
            label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            cls={STATUS_COLOR[event.status]}
          />
        </div>

        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>

        <div className="space-y-2.5 text-sm text-gray-600">
          <DetailRow icon={<CalendarDays size={14} />} label="Date"     value={displayDate(event.date)} />
          <DetailRow icon={<Clock size={14} />}         label="Time"     value={timeRange(event.startTime, event.endTime)} />
          <DetailRow icon={<MapPin size={14} />}        label="Location" value={event.location} />
          <DetailRow icon={<Users size={14} />}         label="Capacity" value={`${event.spotsLeft} spots left of ${event.capacity}`} />
          <DetailRow icon={<Tag size={14} />}           label="Created"  value={new Date(event.createdAt).toLocaleDateString("en-NG")} />
        </div>

        {event.description && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2 justify-end shrink-0">
        {event.status !== "cancelled" && (
          <>
            <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <Pencil size={13} /> Edit
            </button>
            {isCancellable && (
              <button onClick={onCancel} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-amber-200 rounded-lg text-amber-600 hover:bg-amber-50">
                <AlertTriangle size={13} /> Cancel Event
              </button>
            )}
          </>
        )}
        <button onClick={onDelete} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────
// Confirm modal (delete / cancel)
// ─────────────────────────────────────────────
function ConfirmModal({ heading, body, confirmLabel, danger = true, onConfirm, onClose }: {
  heading: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <ModalShell title={heading} onClose={onClose}>
      <div className="px-6 py-4">
        <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
      </div>
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${
            danger ? "bg-red-600 hover:bg-red-700" : "bg-amber-500 hover:bg-amber-600"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </ModalShell>
  );
}

// ─────────────────────────────────────────────
// Modal shell
// ─────────────────────────────────────────────
function ModalShell({ title, onClose, children, wide }: {
  title: string; onClose: () => void; children: React.ReactNode; wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className={`bg-white w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-md"} rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>
      <span className="text-gray-400 w-16 shrink-0">{label}</span>
      <span className="font-medium text-gray-700">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
type ModalMode = "create" | "edit" | "view" | "delete" | "cancel" | null;

export default function EventManagement() {
  const { events, addEvent, updateEvent, deleteEvent, cancelEvent } = useEventsStore();

  const [mode, setMode]         = useState<ModalMode>(null);
  const [target, setTarget]     = useState<GymEvent | null>(null);
  const [form, setForm]         = useState<EventFormData>(EMPTY_FORM);
  const [submitting, setSubmit] = useState(false);

  // ── Derived stats ──
  const total    = events.length;
  const upcoming = events.filter((e) => e.status === "upcoming").length;
  const free     = events.filter((e) => e.type === "Free").length;
  const paid     = events.filter((e) => e.type === "Paid").length;

  // ── Open helpers ──
  function openCreate() { setForm(EMPTY_FORM); setTarget(null); setMode("create"); }
  function openEdit(e: GymEvent) { setForm(eventToForm(e)); setTarget(e); setMode("edit"); }
  function openView(e: GymEvent) { setTarget(e); setMode("view"); }
  function openDelete(e: GymEvent) { setTarget(e); setMode("delete"); }
  function openCancel(e: GymEvent) { setTarget(e); setMode("cancel"); }
  function close() { setMode(null); setTarget(null); }

  // ── Resolve event from table row ──
  function byId(row: ITableBody) {
    return events.find((e) => e.id === row.id) ?? null;
  }

  // ── Submit handlers ──
  async function handleCreate() {
    setSubmit(true);
    await new Promise((r) => setTimeout(r, 600));
    addEvent({
      title: form.title.trim(),
      category: form.category,
      type: form.type,
      price: form.type === "Paid" ? Number(form.price) : undefined,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location.trim(),
      capacity: Number(form.capacity),
      description: form.description.trim(),
      status: "upcoming",
    });
    setSubmit(false);
    close();
  }

  async function handleEdit() {
    if (!target) return;
    setSubmit(true);
    await new Promise((r) => setTimeout(r, 600));
    updateEvent(target.id, {
      title: form.title.trim(),
      category: form.category,
      type: form.type,
      price: form.type === "Paid" ? Number(form.price) : undefined,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location.trim(),
      capacity: Number(form.capacity),
      description: form.description.trim(),
      status: form.status,
    });
    setSubmit(false);
    close();
  }

  function handleDelete() { if (target) { deleteEvent(target.id); close(); } }
  function handleCancel() { if (target) { cancelEvent(target.id); close(); } }

  // ── Table data ──
  const headers: ITableHead[] = [
    { name: "title",    label: "Event" },
    { name: "category", label: "Category" },
    { name: "typePrice",label: "Type / Price" },
    { name: "date",     label: "Date" },
    { name: "time",     label: "Time" },
    { name: "location", label: "Location" },
    { name: "spots",    label: "Spots" },
    { name: "eventStatus", label: "Status" },
  ];

  const body: ITableBody[] = events.map((e) => ({
    id: e.id,
    title: (
      <div>
        <p className="font-medium text-gray-900 text-sm">{e.title}</p>
        {e.description && (
          <p className="text-xs text-gray-400 line-clamp-1 max-w-[180px]">
            {e.description.slice(0, 50)}{e.description.length > 50 ? "…" : ""}
          </p>
        )}
      </div>
    ),
    category: <Chip label={e.category} cls={CATEGORY_COLOR[e.category]} />,
    typePrice: (
      <Chip
        label={e.type === "Paid" && e.price ? fmt(e.price) : "Free"}
        cls={e.type === "Free"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-amber-50 text-amber-700 border-amber-200"}
      />
    ),
    date: displayDate(e.date),
    time: timeRange(e.startTime, e.endTime),
    location: e.location,
    spots: `${e.spotsLeft} / ${e.capacity}`,
    eventStatus: (
      <Chip
        label={e.status.charAt(0).toUpperCase() + e.status.slice(1)}
        cls={STATUS_COLOR[e.status]}
      />
    ),
  }));

  const dropdownOptions: ITableDropdownOptions[] = [
    {
      label: "View Details",
      action: (row) => { const e = byId(row); if (e) openView(e); },
    },
    {
      label: "Edit",
      action: (row) => { const e = byId(row); if (e) openEdit(e); },
    },
    {
      label: "Cancel Event",
      action: (row) => {
        const e = byId(row);
        if (e && (e.status === "upcoming" || e.status === "ongoing")) openCancel(e);
      },
    },
    {
      label: "Delete",
      action: (row) => { const e = byId(row); if (e) openDelete(e); },
      danger: true,
    },
  ];

  // ── Filter options for the Table ──
  const filterOptions = [
    ...STATUSES.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s, column: "eventStatus" })),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Event Management</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Create and manage all platform events
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus size={15} /> Create Event
          </Button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Events" value={total} />
          <StatCard label="Upcoming" value={upcoming} />
          <StatCard label="Free Events" value={free} />
          <StatCard label="Paid Events" value={paid} />
        </div>

        {/* Table */}
        <Table
          headers={headers}
          body={body}
          title="All Events"
          subTitle={`${total} event${total !== 1 ? "s" : ""} on the platform`}
          showSerialNumber
          allowSearchBar
          dropdownOptions={dropdownOptions}
        />
      </div>

      {/* ── Modals ── */}
      {mode === "create" && (
        <EventModal
          title="Create New Event"
          form={form}
          onChange={setForm}
          onSubmit={handleCreate}
          onClose={close}
          submitting={submitting}
        />
      )}

      {mode === "edit" && target && (
        <EventModal
          title={`Edit Event — ${target.title}`}
          form={form}
          onChange={setForm}
          onSubmit={handleEdit}
          onClose={close}
          submitting={submitting}
          showStatus
        />
      )}

      {mode === "view" && target && (
        <ViewModal
          event={target}
          onClose={close}
          onEdit={() => { openEdit(target); }}
          onCancel={() => { openCancel(target); }}
          onDelete={() => { openDelete(target); }}
        />
      )}

      {mode === "delete" && target && (
        <ConfirmModal
          heading="Delete Event"
          body={`Are you sure you want to permanently delete "${target.title}"? This action cannot be undone and registered users will lose their spots.`}
          confirmLabel="Yes, Delete"
          danger
          onConfirm={handleDelete}
          onClose={close}
        />
      )}

      {mode === "cancel" && target && (
        <ConfirmModal
          heading="Cancel Event"
          body={`Are you sure you want to cancel "${target.title}"? The event will be marked as cancelled and will no longer be visible to users.`}
          confirmLabel="Yes, Cancel Event"
          danger={false}
          onConfirm={handleCancel}
          onClose={close}
        />
      )}
    </div>
  );
}
