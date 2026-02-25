import { useState } from 'react';
import type { Note } from '../types';
import { apiClient } from '../api/client';

interface ColonyFormState {
  name: string;
  location: string;
  caretaker: string;
  notes: Note[];
}

const emptyForm = (): ColonyFormState => ({
  name: '',
  location: '',
  caretaker: '',
  notes: [],
});

const today = () => new Date().toISOString().slice(0, 10);

export default function CatAndColonyData() {
  const [form, setForm] = useState<ColonyFormState>(emptyForm());
  const [newNote, setNewNote] = useState({ note: '', author: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleField(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function addNote() {
    if (!newNote.note.trim() || !newNote.author.trim()) return;
    setForm(prev => ({
      ...prev,
      notes: [...prev.notes, { ...newNote, createdAt: today() }],
    }));
    setNewNote({ note: '', author: '' });
  }

  function removeNote(index: number) {
    setForm(prev => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name: form.name,
        location: form.location || undefined,
        caretakerName: form.caretaker || undefined,
        notes: form.notes,
      };

      await apiClient.post('/colonies', payload);

      setForm(emptyForm());
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Cat &amp; Colony Data</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Colony Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleField}
            placeholder="e.g. Riverside Colony"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1">
          <label htmlFor="location" className="text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={form.location}
            onChange={handleField}
            placeholder="e.g. 123 Main St, under the bridge"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Caretaker */}
        <div className="flex flex-col gap-1">
          <label htmlFor="caretaker" className="text-sm font-medium text-gray-700">
            Caretaker
          </label>
          <input
            id="caretaker"
            name="caretaker"
            type="text"
            value={form.caretaker}
            onChange={handleField}
            placeholder="Caretaker name"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Notes */}
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-gray-700">Notes</legend>

          {/* Existing notes list */}
          {form.notes.length > 0 && (
            <ul className="flex flex-col gap-2">
              {form.notes.map((n, i) => (
                <li key={i} className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm">
                  <div className="flex-1">
                    <p className="text-gray-800">{n.note}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{n.author} · {n.createdAt}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNote(i)}
                    className="text-gray-400 hover:text-red-500 text-xs mt-0.5 shrink-0"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Add note inputs */}
          <div className="flex flex-col gap-2 border border-gray-200 rounded px-3 py-3">
            <input
              type="text"
              value={newNote.note}
              onChange={e => setNewNote(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Note text"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
              type="text"
              value={newNote.author}
              onChange={e => setNewNote(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Author"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              type="button"
              onClick={addNote}
              disabled={!newNote.note.trim() || !newNote.author.trim()}
              className="self-start text-sm px-3 py-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add note
            </button>
          </div>
        </fieldset>

        {/* Feedback */}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">Colony created successfully.</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="self-start bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving…' : 'Save Colony'}
        </button>

      </form>
    </div>
  );
}
