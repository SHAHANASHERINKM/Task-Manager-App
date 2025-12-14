# Task Manager App — Frontend

This repository contains the frontend for the Task Manager App built with React and Vite.

## Overview

- UI for user authentication and task management (add, edit, delete, mark complete)
- Communicates with a backend API for persistence

---

## Prerequisites

- Node.js (18+ recommended)
- npm (bundled with Node.js)
- A running backend API (default expected at `http://localhost:5000/api/auth`)

If the backend runs at a different address, update the `API_URL` in `src/services/authService.js` and `src/services/taskService.js`, or switch them to use `VITE_API_URL`.

---

## Local setup

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

Open the address shown by Vite (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Environment / API URL

By default the frontend uses `http://localhost:5000/api/auth` as the backend base URL. Change it in:

- `src/services/authService.js`
- `src/services/taskService.js`

To make this configurable via Vite env, create a `.env` file and add:

```env
VITE_API_URL=http://localhost:5000/api/auth
```

Then update the service files to use `import.meta.env.VITE_API_URL`.

---

## Authentication & testing

- The frontend stores the JWT token in `localStorage` under the key `token`.
- Use the Register and Login pages to obtain a token when testing against your backend.

---

## Important files

- `src/pages/dashboard.jsx` — main task UI
- `src/pages/dashboard.css` — styles for dashboard
- `src/services/authService.js` — login/signup API calls
- `src/services/taskService.js` — task CRUD API calls

---

## GitHub — publish steps

1. Initialize git (if needed):

```bash
git init
```

2. Commit files:

```bash
git add .
git commit -m "chore: initial frontend commit"
```

3. Create a new GitHub repository (via website or `gh` CLI) and add remote:

```bash
git remote add origin <remote-url>
git branch -M main
git push -u origin main
```

---

## Contributing

- Create a feature branch: `git checkout -b feat/my-feature`
- Open a pull request and request reviews

---

## Troubleshooting

- If API calls fail, verify the backend is running and CORS is enabled.
- If authentication fails, ensure tokens are stored as `localStorage.setItem('token', <jwt>)`.

---

If you want I can:
- Switch the services to use `VITE_API_URL` and add a `.env.example` file
- Replace the existing `README.md` with this content
