# Submission helper

## Form fields
- Frontend Repository URL: (your GitHub link for the `frontend` folder or repo)
- Backend Repository URL: (your GitHub link for the `backend` folder or repo)
- Deployed Application URL: (your Vercel link)
- Loom Recording URL: (your Loom link)

Tip: you can push both folders to one repo, or two separate repos. Make sure they're public, and that no `.env` file is committed.

---

## Additional Notes (paste this, then edit the bits in brackets so it sounds like you)

I built Private Notes with React, Tailwind, Express and Supabase. You can sign up, log in, and create, edit, delete and search your own notes.

The part I'm most proud of is the security. The login token is stored in an HTTP-only cookie, an Express middleware checks it on every notes request, and Supabase Row Level Security makes sure the database only ever returns rows where `user_id` matches the logged-in user. I tested this with two accounts to confirm one can't see the other's notes.

What tripped me up: [cookies across two domains. Locally everything worked, but once the frontend and backend were on different hosts I had to switch the cookie to SameSite=None and Secure, add CORS with credentials, and set trust proxy on the server.] Add one or two real problems you hit here.

Beyond the brief I added a `/api/auth/me` route so the page stays logged in after a refresh, a search box, and a confirm step before deleting.

Note: the backend is on a free tier, so the first request after a quiet spell can take around 30 seconds to wake up.

---

## Loom script (about 3 minutes)

Speak naturally. Don't read this word for word.

**0:00 Intro**
"Hi, I'm Ntombifuthi. This is my Private Notes app, built with React, Tailwind, Express and Supabase. Let me walk you through it."

**0:15 Register**
Open the register page. Sign up with a new email. "Here I'm creating an account. It validates the email and password before sending anything to the server."

**0:40 Login**
Log in. "When I log in, Express checks my details with Supabase and sends back a JWT, which it stores in an HTTP-only cookie."
Open DevTools > Application > Cookies and point at the `access_token` cookie with the HttpOnly box ticked.

**1:10 Dashboard CRUD**
Create two notes. Edit one. Search for a word. Delete one and show the confirm step.
"Each of these is a call to a protected route on my Express API."

**1:50 Protected route**
Log out, then try opening `/dashboard` directly. "I get sent back to login. And if I call `/api/notes` with no cookie, the API returns a 401."
Optional: open the backend URL + `/api/notes` in a new tab to show the 401 message.

**2:15 Row Level Security**
Open Supabase > Table Editor > notes, then Authentication > Policies. "This is the RLS rule: a user can only see or change rows where `user_id` equals their own ID."
Log in with a second account and show it sees none of the first account's notes.

**2:45 Wrap up**
"The code is on GitHub and the app is live. One thing I'd add next is refresh tokens. Thanks for watching."
