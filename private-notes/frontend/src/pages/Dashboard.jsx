import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import NoteEditor from '../components/NoteEditor.jsx';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // the note being edited, or null for "new"
  const [saving, setSaving] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const [query, setQuery] = useState('');

  // If any request says "401", the session is gone, so send them to log in.
  function handleError(err) {
    if (err.status === 401) {
      logout().finally(() => navigate('/login'));
      return;
    }
    setError(err.message);
  }

  useEffect(() => {
    api
      .getNotes()
      .then((res) => setNotes(res.notes))
      .catch(handleError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(values) {
    setError('');
    setSaving(true);
    try {
      if (editing) {
        const { note } = await api.updateNote(editing.id, values);
        setNotes((prev) => [note, ...prev.filter((n) => n.id !== note.id)]);
        setEditing(null);
      } else {
        const { note } = await api.createNote(values);
        setNotes((prev) => [note, ...prev]);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await api.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (editing?.id === id) setEditing(null);
    } catch (err) {
      handleError(err);
    } finally {
      setConfirmingId(null);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => `${n.title} ${n.content}`.toLowerCase().includes(q));
  }, [notes, query]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-6">
      <header className="flex items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your notes</h1>
          <p className="text-sm text-muted">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="btn btn-quiet">Log out</button>
      </header>

      {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="md:sticky md:top-6 md:self-start">
          <NoteEditor note={editing} onSave={handleSave} onCancel={() => setEditing(null)} saving={saving} />
        </div>

        <section aria-label="Saved notes">
          <label htmlFor="search" className="sr-only">Search notes</label>
          <input id="search" type="search" className="field" placeholder="Search your notes"
            value={query} onChange={(e) => setQuery(e.target.value)} />

          {loading ? (
            <p className="mt-6 text-muted">Loading your notes…</p>
          ) : notes.length === 0 ? (
            <p className="mt-6 text-muted">Nothing here yet. Write your first note on the left.</p>
          ) : visible.length === 0 ? (
            <p className="mt-6 text-muted">No notes match “{query}”.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {visible.map((note) => (
                <li key={note.id} className={`py-4 pl-4 ${editing?.id === note.id ? 'border-l-4 border-pine bg-pine/5' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">{note.title || 'Untitled'}</h3>
                    <time className="shrink-0 text-xs text-muted" dateTime={note.updated_at}>
                      {formatDate(note.updated_at)}
                    </time>
                  </div>
                  <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-ink/80">{note.content}</p>

                  <div className="mt-3 flex items-center gap-1 text-sm">
                    {confirmingId === note.id ? (
                      <>
                        <span className="mr-2 text-muted">Delete this note?</span>
                        <button onClick={() => handleDelete(note.id)} className="btn !px-3 !py-1.5 bg-danger text-white hover:opacity-90">Delete</button>
                        <button onClick={() => setConfirmingId(null)} className="btn btn-quiet !px-3 !py-1.5">Keep it</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditing(note); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="btn btn-quiet !px-3 !py-1.5">Edit</button>
                        <button onClick={() => setConfirmingId(note.id)}
                          className="btn btn-quiet !px-3 !py-1.5 text-danger">Delete</button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
