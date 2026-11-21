# Smart Todo

A full-stack todo app with user login, private per-user todos, and an AI button that breaks a task into small steps.

Built while learning backend development (Node.js, Express, MongoDB) from the Chai aur Code series by Hitesh Choudhary.

## Features

- Register, login and logout with JWT stored in an httpOnly cookie
- Every todo belongs to its owner: you can only see and change your own todos
- Add todos with a priority (low, medium, high)
- Mark todos complete or incomplete, and delete them
- Today and Pending tabs, plus a collapsible Completed section
- Input validation on register, login and todos
- **AI Break down:** press the button on a task and Gemini splits it into 3 to 5 small steps (the API key stays on the server)

## Tech stack

| Part | Tools |
|---|---|
| Backend | Node.js, Express 5, ES Modules |
| Database | MongoDB Atlas with Mongoose |
| Auth | bcryptjs, jsonwebtoken, cookie-parser |
| AI | Google Gemini API (called from the server) |
| Frontend | Plain HTML, CSS and JavaScript (served by Express from `public/`) |

## Folder structure

```
public/            frontend (index.html, login.html, script.js, auth.js, style.css)
src/
  controllers/     user.controller.js, todo.controller.js
  db/              MongoDB connection
  middlewares/     auth.middleware.js (verifyJWT)
  models/          user.model.js, todo.model.js
  routes/          user.routes.js, todo.routes.js
  utils/           ApiError, ApiResponse, asyncHandler, gemini.js
  validators/      user.validator.js
  app.js           Express app, routes, error handler
  index.js         starts the server
```

## Run it locally

1. Clone the repo and install packages

   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your own values (never commit `.env`)

   ```
   PORT=5500
   MONGODB_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=a_long_random_string
   ACCESS_TOKEN_EXPIRY=1d
   GEMINI_API_KEY=your_gemini_api_key
   ```

   Use the same variable names as in your `.env.example`.

3. Start the server

   ```bash
   npm run dev
   ```

4. Open `http://localhost:5500/login.html`, register, log in, and start adding todos.

## API

Base path: `/api/v1`

**Users**

| Method | Endpoint | What it does | Login needed |
|---|---|---|---|
| POST | `/users/register` | Create an account | No |
| POST | `/users/login` | Log in, sets the cookie | No |
| GET | `/users/me` | Current user | Yes |
| POST | `/users/logout` | Clears the cookie | Yes |

**Todos** (all need login, and only touch the logged-in user's todos)

| Method | Endpoint | What it does |
|---|---|---|
| GET | `/todos` | List my todos |
| POST | `/todos` | Create a todo (`content`, `priority`) |
| PATCH | `/todos/:id` | Mark complete or incomplete |
| DELETE | `/todos/:id` | Delete a todo |
| POST | `/todos/:id/breakdown` | AI steps for a todo |

Errors come back in one format: `{ success: false, statusCode, message }`.

## What I learned

Express routing and middleware, Mongoose schemas and relations, password hashing, JWT and cookies, protecting routes, owner-only data access, validation, error handling, calling an external API safely (retries, keeping keys on the server), and connecting a frontend with `fetch`.

## Pending

- [ ] Deploy (Render)