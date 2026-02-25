import { useState, useEffect, useCallback } from 'react';
import type { Colony, Cat, Note } from '../types';
import { apiClient } from '../api/client';

// ─── Cat form ──────────────────────────────────────────────────────────────────

type CatFormData = { name: string; sex: string; color: string };

function CatForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: CatFormData;
  onSave: (d: CatFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CatFormData>(
    initial ?? { name: '', sex: 'unknown', color: '' },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-2 bg-gray-50 border border-gray-200 rounded p-4 flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Mittens"
            className="border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Sex</label>
          <select
            value={form.sex}
            onChange={e => setForm(p => ({ ...p, sex: e.target.value }))}
            className="border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="unknown">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Color</label>
          <input
            type="text"
            value={form.color}
            onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
            placeholder="e.g. Orange tabby"
            className="border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : 'Save cat'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm px-3 py-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

const today = () => new Date().toISOString().slice(0, 10);

interface ColonyFormState {
  name: string;
  location: string;
  caretakerName: string;
  notes: Note[];
}

const emptyColonyForm = (): ColonyFormState => ({
  name: '',
  location: '',
  caretakerName: '',
  notes: [],
});

export default function CatAndColonyData() {
  // Colony list
  const [colonies, setColonies] = useState<Colony[]>([]);
  const [coloniesLoading, setColoniesLoading] = useState(true);

  // Selected colony
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedColony = colonies.find(c => c.id === selectedId) ?? null;

  // Colony create form
  const [showCreate, setShowCreate] = useState(false);
  const [colonyForm, setColonyForm] = useState<ColonyFormState>(emptyColonyForm());
  const [newNote, setNewNote] = useState({ note: '', author: '' });
  const [colonySubmitting, setColonySubmitting] = useState(false);
  const [colonyError, setColonyError] = useState<string | null>(null);

  // Cats
  const [cats, setCats] = useState<Cat[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);

  // catFormMode: 'none' | 'add' | '<catId>' (editing that cat)
  const [catFormMode, setCatFormMode] = useState<string>('none');

  // ── Load colonies ─────────────────────────────────────────────────────────────
  const loadColonies = useCallback(async () => {
    setColoniesLoading(true);
    try {
      const data = await apiClient.get<Colony[]>('/colonies');
      setColonies(data);
    } catch { /* handled by empty state */ }
    finally { setColoniesLoading(false); }
  }, []);

  useEffect(() => { loadColonies(); }, [loadColonies]);

  // ── Load cats ─────────────────────────────────────────────────────────────────
  const loadCats = useCallback(async (colonyId: string) => {
    setCatsLoading(true);
    setCats([]);
    setCatFormMode('none');
    try {
      const data = await apiClient.get<Cat[]>(`/colonies/${colonyId}/cats`);
      setCats(data);
    } catch { /* handled by empty state */ }
    finally { setCatsLoading(false); }
  }, []);

  function selectColony(id: string) {
    setSelectedId(id);
    setShowCreate(false);
    loadCats(id);
  }

  // ── Create colony ─────────────────────────────────────────────────────────────
  function addNote() {
    if (!newNote.note.trim() || !newNote.author.trim()) return;
    setColonyForm(p => ({
      ...p,
      notes: [...p.notes, { ...newNote, createdAt: today() }],
    }));
    setNewNote({ note: '', author: '' });
  }

  function removeNote(i: number) {
    setColonyForm(p => ({ ...p, notes: p.notes.filter((_, idx) => idx !== i) }));
  }

  async function handleCreateColony(e: React.FormEvent) {
    e.preventDefault();
    setColonySubmitting(true);
    setColonyError(null);
    try {
      const colony = await apiClient.post<Colony>('/colonies', {
        name: colonyForm.name,
        location: colonyForm.location || undefined,
        caretakerName: colonyForm.caretakerName || undefined,
        notes: colonyForm.notes,
      });
      setColonies(prev => [...prev, colony]);
      setColonyForm(emptyColonyForm());
      setShowCreate(false);
      selectColony(colony.id);
    } catch (err) {
      setColonyError(err instanceof Error ? err.message : 'Failed to create colony');
    } finally {
      setColonySubmitting(false);
    }
  }

  // ── Add / edit cats ───────────────────────────────────────────────────────────
  async function handleAddCat(data: CatFormData) {
    if (!selectedId) return;
    await apiClient.post(`/colonies/${selectedId}/cats`, data);
    setCatFormMode('none');
    await loadCats(selectedId);
  }

  async function handleEditCat(catId: string, data: CatFormData) {
    if (!selectedId) return;
    await apiClient.patch(`/colonies/${selectedId}/cats/${catId}`, data);
    setCatFormMode('none');
    await loadCats(selectedId);
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Cat &amp; Colony Data</h1>
        <button
          onClick={() => { setShowCreate(true); setSelectedId(null); }}
          className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-700"
        >
          + New Colony
        </button>
      </div>

      {/* ── Create colony form ─────────────────────────────────────────────────── */}
      {showCreate && (
        <div className="mb-6 border border-gray-200 rounded p-5 max-w-xl">
          <h2 className="text-base font-semibold mb-4">New Colony</h2>
          <form onSubmit={handleCreateColony} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Colony Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={colonyForm.name}
                onChange={e => setColonyForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Riverside Colony"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={colonyForm.location}
                onChange={e => setColonyForm(p => ({ ...p, location: e.target.value }))}
                placeholder="e.g. 123 Main St, under the bridge"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Caretaker</label>
              <input
                type="text"
                value={colonyForm.caretakerName}
                onChange={e => setColonyForm(p => ({ ...p, caretakerName: e.target.value }))}
                placeholder="Caretaker name"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <fieldset className="flex flex-col gap-3">
              <legend className="text-sm font-medium text-gray-700">Notes</legend>
              {colonyForm.notes.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {colonyForm.notes.map((n, i) => (
                    <li key={i} className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                      <div className="flex-1">
                        <p className="text-gray-800">{n.note}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{n.author} · {n.createdAt}</p>
                      </div>
                      <button type="button" onClick={() => removeNote(i)}
                        className="text-gray-400 hover:text-red-500 text-xs shrink-0">
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-col gap-2 border border-gray-200 rounded px-3 py-3">
                <input type="text" value={newNote.note}
                  onChange={e => setNewNote(p => ({ ...p, note: e.target.value }))}
                  placeholder="Note text"
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
                <input type="text" value={newNote.author}
                  onChange={e => setNewNote(p => ({ ...p, author: e.target.value }))}
                  placeholder="Author"
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
                <button type="button" onClick={addNote}
                  disabled={!newNote.note.trim() || !newNote.author.trim()}
                  className="self-start text-sm px-3 py-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                  Add note
                </button>
              </div>
            </fieldset>

            {colonyError && <p className="text-sm text-red-600">{colonyError}</p>}

            <div className="flex gap-2">
              <button type="submit" disabled={colonySubmitting}
                className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {colonySubmitting ? 'Saving…' : 'Save Colony'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)}
                className="text-sm px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Colony list ────────────────────────────────────────────────────────── */}
      {coloniesLoading ? (
        <p className="text-sm text-gray-500">Loading colonies…</p>
      ) : colonies.length === 0 && !showCreate ? (
        <p className="text-sm text-gray-400">No colonies yet. Click "+ New Colony" to get started.</p>
      ) : (
        <div className="flex flex-col gap-1 mb-6 max-w-xl">
          {colonies.map(colony => (
            <button
              key={colony.id}
              onClick={() => selectColony(colony.id)}
              className={`text-left px-4 py-3 rounded border text-sm transition-colors ${
                selectedId === colony.id
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 hover:border-gray-400 text-gray-800'
              }`}
            >
              <span className="font-medium">{colony.name}</span>
              {colony.location && (
                <span className={`ml-2 text-xs ${selectedId === colony.id ? 'text-gray-300' : 'text-gray-500'}`}>
                  {colony.location}
                </span>
              )}
              {colony.caretakerName && (
                <span className={`ml-2 text-xs ${selectedId === colony.id ? 'text-gray-300' : 'text-gray-500'}`}>
                  · {colony.caretakerName}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Colony detail + cats ───────────────────────────────────────────────── */}
      {selectedColony && (
        <div className="max-w-xl border border-gray-200 rounded p-5">

          {/* Colony summary */}
          <div className="mb-5 pb-4 border-b border-gray-100">
            <h2 className="font-semibold text-base">{selectedColony.name}</h2>
            {selectedColony.location && (
              <p className="text-sm text-gray-500 mt-0.5">{selectedColony.location}</p>
            )}
            {selectedColony.caretakerName && (
              <p className="text-sm text-gray-500">Caretaker: {selectedColony.caretakerName}</p>
            )}
          </div>

          {/* Cats section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Cats</h3>
              {catFormMode !== 'add' && (
                <button
                  onClick={() => setCatFormMode('add')}
                  className="text-xs px-2.5 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  + Add cat
                </button>
              )}
            </div>

            {catsLoading ? (
              <p className="text-sm text-gray-500">Loading cats…</p>
            ) : cats.length === 0 && catFormMode !== 'add' ? (
              <p className="text-sm text-gray-400">No cats yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {cats.map(cat => (
                  <li key={cat.id}>
                    <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50 border border-gray-200 rounded text-sm">
                      <div>
                        <span className="font-medium">{cat.name ?? 'Unnamed'}</span>
                        <span className="text-gray-500 ml-2 text-xs">
                          {cat.sex}{cat.color ? ` · ${cat.color}` : ''}
                        </span>
                      </div>
                      <button
                        onClick={() => setCatFormMode(prev => prev === cat.id ? 'none' : cat.id)}
                        className="text-xs text-gray-500 hover:text-gray-900"
                      >
                        {catFormMode === cat.id ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                    {catFormMode === cat.id && (
                      <CatForm
                        initial={{ name: cat.name ?? '', sex: cat.sex, color: cat.color ?? '' }}
                        onSave={data => handleEditCat(cat.id, data)}
                        onCancel={() => setCatFormMode('none')}
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}

            {catFormMode === 'add' && (
              <CatForm
                onSave={handleAddCat}
                onCancel={() => setCatFormMode('none')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
