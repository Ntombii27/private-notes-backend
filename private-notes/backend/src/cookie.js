const isProd = process.env.NODE_ENV === 'production';

// In production the frontend and backend usually sit on different domains
// (e.g. Vercel + Render), so the cookie has to be SameSite=None and Secure.
// Locally, "lax" is fine and works over plain http.
export const cookieOptions = {
  httpOnly: true, // JavaScript in the browser can never read this cookie
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
};

export const COOKIE_NAME = 'access_token';
