import { Router } from 'express';
import { supabase } from '../supabase.js';
import { COOKIE_NAME, cookieOptions } from '../cookie.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const looksLikeEmail = (v) => typeof v === 'string' && /^\S+@\S+\.\S+$/.test(v);

router.post('/signup', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!looksLikeEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Your password needs at least 6 characters.' });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // If "Confirm email" is switched on in Supabase, there's no session yet.
  const needsConfirmation = !data.session;
  res.status(201).json({
    message: needsConfirmation
      ? 'Account created. Check your inbox to confirm your email, then log in.'
      : 'Account created. You can log in now.',
    needsConfirmation,
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Enter your email and password.' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return res.status(401).json({ error: "That email and password don't match." });
  }

  res.cookie(COOKIE_NAME, data.session.access_token, {
    ...cookieOptions,
    maxAge: data.session.expires_in * 1000, // cookie dies when the token does
  });

  res.json({ user: { id: data.user.id, email: data.user.email } });
});

router.post('/logout', requireAuth, (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.json({ message: 'Logged out.' });
});

// Not in the brief, but the React app needs a way to ask
// "am I still logged in?" when the page reloads.
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email } });
});

export default router;
