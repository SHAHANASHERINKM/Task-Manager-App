

# Task Manager App

Comprehensive project README for the Task Manager App. This repository contains a Node/Express backend (API) and a React + Vite frontend. The sections below focus on the backend and how to run, configure, and consume the API. A short frontend quick-start is also included.

---

## Repository layout

- `Backend/` — Express app and API (entry: `Backend/app.js`, routes and models under `Backend/Server/`)
- `Frontend/` — React + Vite app (UI for authentication and task management)

---

## Quick overview

This application provides user authentication and a tasks CRUD API. Users register and login to receive a JWT, then create, read, update, and delete tasks. Tasks are stored in MongoDB and associated with the user that created them.

---

## Backend (API)

### Tech stack

- Node.js
- Express
- MongoDB (via Mongoose)
- JSON Web Tokens (JWT) for authentication

### Important files

- `Backend/app.js` — application entry, CORS and route mounting
- `Backend/Server/routes/siteRoutes.js` — REST endpoints
- `Backend/Server/controller/siteController.js` — handlers and business logic
- `Backend/Server/midleware/auth.js` — JWT auth middleware (expects `Authorization: Bearer <token>`)
- `Backend/Server/models/database.js` — connects to MongoDB using `MONGO_URI`
- `Backend/Server/models/user.js` — user schema
- `Backend/Server/models/tasks.js` — task schema

### Environment variables

Create a `.env` file in the `Backend/` folder with at least:

```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-strong-secret>
PORT=5000
```

Notes:
- `MONGO_URI` is required for MongoDB connection.
- `JWT_SECRET` is used to sign and verify authentication tokens.
- `PORT` is optional and defaults to `5000`.

### Install & run (backend)

Open a terminal and run:

```bash
cd Backend
npm install
# development (auto-restart with nodemon):
npm run dev
# or production:
npm start
```

The server listens on `process.env.PORT || 5000`. Default CORS origin is set in `Backend/app.js`; adjust the `cors()` config to match your frontend host.

### API Endpoints (summary)

Base path: `/api/auth`

- POST `/api/auth/signup` — Register a new user
	- Body: `{ name, email, password }`
	- Returns: user object (no token)

- POST `/api/auth/login` — Login user
	- Body: `{ email, password }`
	- Returns: `{ token, user }` (token should be sent in `Authorization` header)

- POST `/api/auth/task` — Create task (protected)
	- Headers: `Authorization: Bearer <token>`
	- Body: `{ title, description, status?, dueDate?, priority? }`
	- Defaults: `status = 'Pending'`, `priority = 'Low'` (note: model enum uses `['Low','Medium','High']`)

- GET `/api/auth/tasks` — Get all tasks for authenticated user (protected)

- GET `/api/auth/tasksByStatus?status=Pending|Completed` — Filter tasks by status (protected)

- PUT `/api/auth/task/:id` — Update task (protected)
	- Body: any of `{ title, description, status, priority, dueDate }`

- DELETE `/api/auth/task/:id` — Delete task (protected)

Responses are JSON objects with `success`, `message`, and `data` fields where applicable. The auth middleware expects the header `Authorization: Bearer <token>` and sets `req.userId` on success.

### Notes & gotchas

- Password strength is validated on signup; failing validation returns `400` with a message.
- `Backend/Server/models/tasks.js` defines `priority` default as `"low"` while other code expects capitalized values — consider normalizing this field if you rely on exact string matching.
- If API calls fail, verify `MONGO_URI`, `JWT_SECRET`, and that MongoDB is reachable.

---

## Frontend (brief)

The frontend lives in `Frontend/` and is implemented with React + Vite. It includes pages for login, registration, and a dashboard for managing tasks.

Quick start:

```bash
cd Frontend
npm install
npm run dev
```

The frontend expects the backend API base URL. By default the services may point to `http://localhost:5000/api/auth`; update the service files or use an env variable (e.g. `VITE_API_URL`) to change the base URL.

---

## Testing & verification

- Manual: use Postman / curl to exercise the endpoints. Example login request:

```bash
curl -X POST http://localhost:5000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"you@example.com","password":"YourPass1!"}'
```

- After login, include the returned token in requests:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/auth/tasks
```

---

## Contributing

- Create a branch: `git checkout -b feat/your-feature`
- Make changes and open a Pull Request.
- Run the backend locally and add tests or manual verification steps for API changes.

---

## Troubleshooting

- CORS errors: update the `origin` in `Backend/app.js` or use a permissive configuration during development.
- MongoDB connection errors: verify `MONGO_URI`, network access, and that MongoDB is running.
- JWT errors: ensure `JWT_SECRET` is set and tokens are passed in `Authorization` header.

---

## Screenshots

<img width="1894" height="878" alt="image" src="https://github.com/user-attachments/assets/8fdd6c5d-f742-47ed-8ca9-70c6336bdc9f" />

<img width="1890" height="888" alt="image" src="https://github.com/user-attachments/assets/6bc98536-64c6-4996-a9b1-9b502294199c" />
<img width="1913" height="878" alt="image" src="https://github.com/user-attachments/assets/daeeaf86-c65f-40d8-800e-bdfd9c19a43f" />

