import { useState, useEffect, useCallback } from 'react';
import type { Volunteer } from '../types';
import { apiClient } from '../api/client';

interface VolunteerFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetNumberAndName: string;
  city: string;
  zip: string;
}

const ZIP_RE = /^\d{5}(-\d{4})?$/;

const emptyForm = (): VolunteerFormState => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  streetNumberAndName: '',
  city: '',
  zip: '',
});

function VolunteerForm({
  initial,
  onSave,
  onCancel,
  submitLabel,
}: {
  initial?: VolunteerFormState;
  onSave: (d: VolunteerFormState) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [form, setForm] = useState<VolunteerFormState>(initial ?? emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field(key: keyof VolunteerFormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.zip && !ZIP_RE.test(form.zip)) {
      setError('Zip code must be 5 digits (12345) or ZIP+4 format (12345-6789)');
      return;
    }
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
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.firstName}
            onChange={field('firstName')}
            placeholder="Jane"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={field('lastName')}
            placeholder="Smith"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          required
          value={form.email}
          onChange={field('email')}
          placeholder="jane@example.com"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          value={form.phone}
          onChange={field('phone')}
          placeholder="555-555-5555"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Street Number and Name</label>
        <input
          type="text"
          value={form.streetNumberAndName}
          onChange={field('streetNumberAndName')}
          placeholder="123 Main St"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={form.city}
            onChange={field('city')}
            placeholder="Springfield"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Zip Code</label>
          <input
            type="text"
            value={form.zip}
            onChange={field('zip')}
            placeholder="12345"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  // 'none' | 'create' | '<volunteerId>'
  const [mode, setMode] = useState<string>('none');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<Volunteer[]>('/volunteers');
      setVolunteers(data);
    } catch { /* empty state handles it */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function buildAddress(form: VolunteerFormState) {
    const { streetNumberAndName, city, zip } = form;
    if (!streetNumberAndName && !city && !zip) return undefined;
    return {
      streetNumberAndName: streetNumberAndName || undefined,
      city: city || undefined,
      zip: zip || undefined,
    };
  }

  async function handleCreate(form: VolunteerFormState) {
    await apiClient.post('/volunteers', {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || undefined,
      address: buildAddress(form),
    });
    setMode('none');
    await load();
  }

  async function handleEdit(id: string, form: VolunteerFormState) {
    await apiClient.patch(`/volunteers/${id}`, {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || undefined,
      address: buildAddress(form),
    });
    setMode('none');
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Volunteers</h1>
        {mode !== 'create' && (
          <button
            onClick={() => setMode('create')}
            className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-700"
          >
            + New Volunteer
          </button>
        )}
      </div>

      {/* Create form */}
      {mode === 'create' && (
        <div className="mb-6 border border-gray-200 rounded p-5 max-w-xl">
          <h2 className="text-base font-semibold mb-4">New Volunteer</h2>
          <VolunteerForm
            submitLabel="Save volunteer"
            onSave={handleCreate}
            onCancel={() => setMode('none')}
          />
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading volunteers…</p>
      ) : volunteers.length === 0 && mode !== 'create' ? (
        <p className="text-sm text-gray-400">No volunteers yet. Click "+ New Volunteer" to add one.</p>
      ) : (
        <div className="flex flex-col gap-2 max-w-xl">
          {volunteers.map(v => (
            <div key={v.id} className="border border-gray-200 rounded">
              <div className="flex items-start justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {v.firstName} {v.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{v.email}</p>
                  {v.phone && <p className="text-xs text-gray-500">{v.phone}</p>}
                  {v.address && (
                    <p className="text-xs text-gray-500">
                      {[v.address.streetNumberAndName, v.address.city, v.address.zip]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setMode(prev => prev === v.id ? 'none' : v.id)}
                  className="text-xs text-gray-500 hover:text-gray-900 shrink-0"
                >
                  {mode === v.id ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {mode === v.id && (
                <div className="border-t border-gray-100 px-4 py-4">
                  <VolunteerForm
                    initial={{
                      firstName: v.firstName,
                      lastName: v.lastName,
                      email: v.email,
                      phone: v.phone ?? '',
                      streetNumberAndName: v.address?.streetNumberAndName ?? '',
                      city: v.address?.city ?? '',
                      zip: v.address?.zip ?? '',
                    }}
                    submitLabel="Save changes"
                    onSave={form => handleEdit(v.id, form)}
                    onCancel={() => setMode('none')}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
