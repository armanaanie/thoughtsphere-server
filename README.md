# ThoughtSphere — Backend (Phase 1: Auth)

## What's included in this phase
- Project scaffolding (TypeScript, Express, ESLint-friendly structure)
- MongoDB connection via Mongoose
- `User` model with:
  - Password hashing via `bcrypt` in a `pre('save')` hook (only re-hashes when password is modified)
  - `password` field excluded from queries by default (`select: false`)
  - `comparePassword()` instance method for login
  - `password` stripped from any `toJSON()` output as a safety net
- Full auth flow: **Register**, **Login**, **Logout**, **Get current user (`/me`)**
- JWT access + refresh tokens (refresh token set as an httpOnly cookie)
- Centralized error handling (`ApiError`, Zod errors, Mongoose validation/cast/duplicate-key errors all normalized into one response shape)
- Request validation via Zod
- Role-aware `auth()` middleware for protecting routes (`auth()` = any logged-in user, `auth('admin')` = admin only)

## Getting started

```bash
cd server
npm install
cp .env.example .env   # then fill in real values, especially JWT secrets and DATABASE_URL
npm run dev
```

Requires a running MongoDB instance (local `mongod` or MongoDB Atlas connection string).

## API Endpoints (so far)

| Method | Endpoint              | Auth required | Description                  |
|--------|------------------------|----------------|-------------------------------|
| POST   | /api/v1/auth/register  | No             | Create a new account          |
| POST   | /api/v1/auth/login     | No             | Log in, returns access token  |
| POST   | /api/v1/auth/logout    | No             | Clears refresh token cookie   |
| GET    | /api/v1/auth/me        | Yes            | Get the logged-in user's data |

### Example: Register

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"password123"}'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'
```

Response includes an `accessToken` — send it as `Authorization: Bearer <token>` on protected routes.

### Example: Get current user

```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

## Folder structure

```
src/
├── config/         # env vars + database connection
├── controllers/     # request/response handling only
├── services/        # business logic
├── models/          # Mongoose schemas
├── interfaces/       # TS types + Zod validation schemas
├── middleware/       # auth, error handling, validation
├── routes/           # route definitions
├── utils/            # ApiError, catchAsync, sendResponse, jwt helpers
└── app.ts            # app entry point
```

## Testing note
Model logic (password hashing, comparePassword, JWT, and Zod validation) was verified directly during development. A live end-to-end test against a running MongoDB instance is worth doing on your machine with `npm run dev` + the curl commands above, since this sandbox couldn't reach MongoDB's binary download servers for an in-memory test DB.

## What's next
Posts → Comments → Friends → Saved Posts → Notifications → Admin routes, each following the same controller/service/model pattern established here. Let me know which one to build next.
