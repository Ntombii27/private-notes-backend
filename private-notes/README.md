# Private Notes

A small full-stack notes app where every note belongs to one person and nobody else can see it.

**Stack:** React + Vite, Tailwind CSS, Node.js + Express, Supabase (Postgres + Auth)

## How it works

1. React sends your email and password to Express.
2. Express asks Supabase Auth to check them.
3. Supabase returns a JWT. Express stores it in an **HTTP-only cookie**, so JavaScript in the browser can't read it.
4. On every notes request, a middleware reads the cookie and asks Supabase if the token is valid.
5. Express then talks to the database *as that user*, so **Row Level Security** only returns rows where `user_id` matches the logged-in user.

Even if my Express code had a bug, the database itself would still refuse to show someone else's notes.

## API

| Method | Route | Protected | What it does |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Create an account |
| POST | `/api/auth/login` | No | Log in and set the cookie |
| POST | `/api/auth/logout` | Yes | Clear the cookie |
| GET | `/api/auth/me` | Yes | Check who is logged in (used on page reload) |
| GET | `/api/notes` | Yes | List my notes |
| POST | `/api/notes` | Yes | Create a note |
| PUT | `/api/notes/:id` | Yes | Edit a note |
| DELETE | `/api/notes/:id` | Yes | Delete a note |

## Run it locally

### 1. Supabase
1. Create a project at supabase.com.
2. Open **SQL Editor**, paste in `backend/schema.sql`, and run it.
3. For easier testing, go to **Authentication > Providers > Email** and turn off "Confirm email".
4. From **Project Settings > API**, copy the Project URL and the `anon` public key.

### 2. Backend
```bash
cd backend
cp .env.example .env     # then fill in your Supabase URL and anon key
npm install
npm run dev              # http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

## Deploying

**Backend (Render or Railway)**
- Root directory: `backend`, build: `npm install`, start: `npm start`
- Environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `NODE_ENV=production`, and `CLIENT_URL` set to your Vercel URL (no trailing slash)

**Frontend (Vercel)**
- Root directory: `frontend`
- Environment variable: `VITE_API_URL` set to your backend URL
- Deploy the frontend first to get its URL, then put that URL in the backend's `CLIENT_URL`

**Cookie note:** in production the cookie is `Secure` and `SameSite=None` so it works across the two domains. Some browsers block third-party cookies by default; if login seems to "not stick" in Safari or Brave, that's why.

## What I'd add next
- Refresh tokens so sessions last longer than an hour
- Rate limiting on the login route
- Tags and pinned notes
