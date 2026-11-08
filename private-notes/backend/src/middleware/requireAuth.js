import { supabase, clientForUser } from '../supabase.js';
import { COOKIE_NAME, cookieOptions } from '../cookie.js';

// Bouncer for protected routes: no valid token in the cookie, no entry.
export async function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'Please log in to continue.' });
  }

  // Ask Supabase whether this token is genuine and still valid.
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    res.clearCookie(COOKIE_NAME, cookieOptions);
    return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
  }

  req.user = data.user;
  req.db = clientForUser(token); // queries through this are covered by RLS
  next();
}
