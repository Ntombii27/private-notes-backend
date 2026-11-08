import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
router.use(requireAuth); // every notes route needs a logged-in user

function cleanNote(body = {}) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  return { title, content };
}

// GET /api/notes  -> everything I've written, newest edit first
router.get('/', async (req, res) => {
  const { data, error } = await req.db
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) return res.status(500).json({ error: 'Could not load your notes.' });
  res.json({ notes: data });
});

// POST /api/notes  -> add a note
router.post('/', async (req, res) => {
  const { title, content } = cleanNote(req.body);

  if (!title && !content) {
    return res.status(400).json({ error: 'A note needs a title or some text.' });
  }

  const { data, error } = await req.db
    .from('notes')
    .insert({ title, content, user_id: req.user.id })
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Could not save your note.' });
  res.status(201).json({ note: data });
});

// PUT /api/notes/:id  -> edit a note
router.put('/:id', async (req, res) => {
  const { title, content } = cleanNote(req.body);

  if (!title && !content) {
    return res.status(400).json({ error: 'A note needs a title or some text.' });
  }

  const { data, error } = await req.db
    .from('notes')
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error: 'Could not update your note.' });
  // RLS hides other people's rows, so "not yours" and "doesn't exist" look the same. That's on purpose.
  if (!data) return res.status(404).json({ error: 'Note not found.' });
  res.json({ note: data });
});

// DELETE /api/notes/:id  -> remove a note
router.delete('/:id', async (req, res) => {
  const { data, error } = await req.db
    .from('notes')
    .delete()
    .eq('id', req.params.id)
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error: 'Could not delete your note.' });
  if (!data) return res.status(404).json({ error: 'Note not found.' });
  res.json({ message: 'Note deleted.' });
});

export default router;
