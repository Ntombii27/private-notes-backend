import { useEffect, useState } from 'react';

// Handles both "new note" and "edit note", depending on whether `note` is set.
export default function NoteEditor({ note, onSave, onCancel, saving }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setTitle(note?.title ?? '');
    setContent(note?.content ?? '');
  }, [note]);

  const empty = !title.trim() && !content.trim();

  function handleSubmit(e) {
    e.preventDefault();
    if (empty) return;
    onSave({ title, content });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-sheet p-5">
      <h2 className="text-lg font-semibold">{note ? 'Edit note' : 'New note'}</h2>

      <label htmlFor="note-title" className="mt-4 block text-sm font-medium">Title</label>
      <input id="note-title" className="field mt-1" value={title}
        onChange={(e) => setTitle(e.target.value)} placeholder="Groceries, ideas, a thought…" />

      <label htmlFor="note-content" className="mt-4 block text-sm font-medium">Note</label>
      <textarea id="note-content" rows={8} className="field mt-1 resize-y"
        value={content} onChange={(e) => setContent(e.target.value)}
        placeholder="Write whatever you like." />

      <div className="mt-4 flex items-center gap-2">
        <button type="submit" disabled={empty || saving} className="btn btn-primary">
          {saving ? 'Saving…' : note ? 'Save changes' : 'Add note'}
        </button>
        {note && (
          <button type="button" onClick={onCancel} className="btn btn-quiet">Cancel</button>
        )}
      </div>
    </form>
  );
}
