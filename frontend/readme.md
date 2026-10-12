# Library Management System — Frontend

A responsive Single-Page Application (SPA) for the Twirling Lotus Library Management System, built with **React 19**, **Vite 8**, **React Router v7**, and **Vanilla CSS**.

This frontend communicates with a RESTful Node.js / Express / MongoDB backend (defaulting to the deployed Render backend service) and includes deployment configurations for static hosting on **Vercel** and **Cloudflare Workers**.

---

## Table of Contents

1. [Feature Architecture & Active Routes](#1-feature-architecture--active-routes)
2. [Prerequisites & Installation](#2-prerequisites--installation)
3. [Folder Structure](#3-folder-structure)
4. [Environment Variables & API Configuration](#4-environment-variables--api-configuration)
5. [Running Locally](#5-running-locally)
6. [React Architecture & Data Flow (Viva Defense Guide)](#6-react-architecture--data-flow-viva-defense-guide)
7. [API Integration & Endpoint Reference](#7-api-integration--endpoint-reference)
8. [Authentication & Session Behavior](#8-authentication--session-behavior)
9. [Book Catalogue & Cover System](#9-book-catalogue--cover-system)
10. [Student Circulation & Loan Management](#10-student-circulation--loan-management)
11. [Admin Book Management (CRUD)](#11-admin-book-management-crud)
12. [Styling & Design System](#12-styling--design-system)
13. [Build, Lint & Validation Scripts](#13-build-lint--validation-scripts)
14. [Vercel Deployment Configuration](#14-vercel-deployment-configuration)
15. [Cloudflare Workers Deployment Configuration](#15-cloudflare-workers-deployment-configuration)
16. [Troubleshooting Common Issues](#16-troubleshooting-common-issues)
17. [Project Status & Team Responsibilities](#17-project-status--team-responsibilities)

---

## 1. Feature Architecture & Active Routes

All application pages are wired directly into React Router in `frontend/src/App.jsx` and navigated via `frontend/src/components/NavBar.jsx`.

### Active Routes

| Route | Component | Navigation Link | Purpose & Functionality |
|---|---|---|---|
| `/` | `Home.jsx` | `Home` | Landing page featuring the library brand hero banner (`Hero.jsx`) and the searchable book catalogue grid (`Sec1Catalouge.jsx`). |
| `/books` | `Sec1Catalouge.jsx` | `Catalogue` | Full-page book catalogue with live search, three-tier cover resolution, real-time stock counts, and one-click student borrowing. |
| `/return` | `Return.jsx` | `My Books` | Student loan dashboard displaying active book loans, formatted due dates, status pills, and one-click return processing. |
| `/login` | `Login.jsx` | `Login` | Authentication portal with controlled login and registration forms, session storage, and user profile management with logout. |
| `/admin` | `AdminBooks.jsx` | `Admin` | Administrative book management interface for adding, editing, and deleting books with Bearer token authorization. |
| `/borrow` | `Borrow.jsx` | *(Direct route)* | Administrative book issuance form for assigning book records to user IDs with specific due dates and transaction confirmation cards. |

### Routing Reality & Security Scope

- **Navigation Header (`NavBar.jsx`):** Persistent brand header with the lotus logo (`/lotus.svg`) and client links to `/`, `/books`, `/return`, `/login`, and an admin badge link to `/admin`.
- **Public Client Routing:** React Router v7 routes are public Single-Page Application views. There are no client-side `PrivateRoute` wrappers or hidden links.
- **Backend Authorization Enforcement:** Access to restricted operations (e.g. issuing books, returning transactions, modifying book records) is validated on the backend via JWT Bearer tokens passed in HTTP request headers.

---

## 2. Prerequisites & Installation

### Prerequisites

- **Node.js:** `^20.19.0` or `>=22.12.0` (as required by the installed Vite 8.3 engine specification in `package.json`).
- **npm:** `v9.x` or higher.

### Installation

From the repository root:

```bash
npm --prefix frontend install
```

Or from the `frontend/` directory:

```bash
cd frontend
npm install
```

This installs runtime dependencies (`react`, `react-dom`, `react-router-dom`) and developer tools (`vite`, `eslint`, `wrangler`).

---

## 3. Folder Structure

```text
frontend/
├── public/                     # Static assets served untouched at root
│   ├── default-cover.svg       # SVG fallback book cover illustration
│   ├── favicon.svg             # Browser tab icon
│   ├── icons.svg               # SVG icons bundle
│   └── lotus.svg               # Twirling Lotus brand logo
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── BookForm.jsx / .css        # Admin book add/edit form with copy validation
│   │   ├── BookList.jsx / .css        # Admin books table layout with Edit/Delete actions
│   │   ├── CatalogueFilter.jsx / .css # Standalone category & availability filter controls
│   │   ├── Hero.jsx / .css            # Landing banner with CTA button
│   │   ├── LoginForm.jsx / .css       # Controlled login form (email, password)
│   │   ├── NavBar.jsx / .css          # Top navigation bar with active NavLink states
│   │   ├── RegisterForm.jsx / .css    # Controlled registration form (name, gender, email, password)
│   │   ├── Sec1a.jsx / .css           # BookCard component with cover display & borrow action
│   │   ├── Sec1Catalouge.jsx / .css   # Catalogue container with live search & book grid
│   │   └── TransactionCard.jsx / .css # Circulation transaction summary card
│   ├── pages/                  # Page-level route views
│   │   ├── AdminBooks.jsx / .css      # Admin book management CRUD page (wired at /admin)
│   │   ├── Borrow.jsx / .css          # Admin book issuance page (wired at /borrow)
│   │   ├── Home.jsx / .css            # Landing page (Hero + Catalogue, wired at /)
│   │   ├── Login.jsx / .css           # Auth page (Login/Register/Profile, wired at /login)
│   │   └── Return.jsx / .css          # Student loan tracking page (wired at /return)
│   ├── config.js               # Central API URL resolver (defaults to Render backend)
│   ├── App.jsx / .css          # Root BrowserRouter setup, layout, and footer
│   ├── index.css               # Global CSS reset, typography, and design tokens
│   └── main.jsx                # React DOM entry point (createRoot)
├── .env.example                # Template for environment variables
├── .gitignore                  # Git ignore rules (.env, .wrangler, dist, node_modules)
├── eslint.config.js            # Flat ESLint configuration (ignores dist and .wrangler)
├── index.html                  # HTML entry shell with Google Fonts
├── package.json                # Project dependencies and npm scripts
├── vercel.json                 # Vercel SPA client rewrite configuration
├── vite.config.js              # Vite configuration (React plugin)
└── wrangler.jsonc              # Cloudflare Workers static assets configuration
```

---

## 4. Environment Variables & API Configuration

The frontend centralizes all API endpoint resolution in [src/config.js](./src/config.js).

### Configuration Resolver

```javascript
const envUrl = (import.meta.env.VITE_API_URL || '').trim();
const rawUrl = (envUrl || 'https://library-management-system-2-7fc2.onrender.com/api').replace(/\/+$/, '');

export const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;
export const BOOKS_API_URL = `${API_URL}/books`;
```

- **Default Endpoint:** If `VITE_API_URL` is omitted, the frontend automatically points to the deployed Render backend:
  `https://library-management-system-2-7fc2.onrender.com/api`
- **Normalization:** Strips surrounding whitespace and trailing slashes.
- **Prefix Safety:** If a custom domain omits `/api`, `config.js` appends `/api`. If it already ends with `/api`, it preserves it without duplicating `/api/api`.

### Environment Variable Specification

| Variable Name | Required | Default Value | Example Local Development Value |
|---|---|---|---|
| `VITE_API_URL` | Optional | `https://library-management-system-2-7fc2.onrender.com/api` | `http://localhost:5000/api` |

> **Build-Time Injection Notice:**
> In Vite applications, `import.meta.env.VITE_*` variables are statically replaced in JavaScript bundles at build time. When changing `.env`, restart the development server (`npm run dev`) or recompile the build (`npm run build`).

---

## 5. Running Locally

### 1. Start the Frontend

From the repository root:

```bash
npm --prefix frontend run dev
```

The frontend development server starts at **`http://localhost:5173`**.

By default, the application connects directly to the live deployed Render backend, allowing full catalogue browsing, cover resolution, and authentication out of the box without running a local backend.

### 2. (Optional) Connect to a Local Backend

To develop against a local Express backend running on port 5000:

1. Start the backend:
   ```bash
   npm --prefix backend start
   ```
2. Create a `frontend/.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Restart Vite (`npm --prefix frontend run dev`).

---

## 6. React Architecture & Data Flow (Viva Defense Guide)

Use these explanations to demonstrate mastery of modern React concepts during viva examinations:

### 1. Component Hierarchy

```text
index.html
  └── main.jsx (ReactDOM.createRoot)
        └── App.jsx (<BrowserRouter>)
              ├── <NavBar /> (Permanent header: /, /books, /return, /login, /admin)
              ├── <main className="app-main">
              │     ├── Route "/"       ──> <Home /> (<Hero /> + <Sec1Catalouge />)
              │     ├── Route "/books"  ──> <Sec1Catalouge /> (<BookCard />)
              │     ├── Route "/borrow" ──> <Borrow /> (<TransactionCard />)
              │     ├── Route "/return" ──> <Return /> (My Books loan cards)
              │     ├── Route "/login"  ──> <Login /> (<LoginForm /> / <RegisterForm />)
              │     └── Route "/admin"  ──> <AdminBooks /> (<BookForm /> + <BookList />)
              └── <footer className="app-footer">
```

### 2. Core React Concepts Demonstrated in the Code

- **One-Way Data Flow (Props):**
  - Parents pass state down to children as props; children communicate upward via event handler callbacks.
  - *Example:* `Sec1Catalouge` passes individual book records and an `onBorrow` handler callback down to `BookCard ({ book, onBorrow })`.
  - *Example:* `AdminBooks` passes the `books` array, `onEdit`, and `onDelete` callbacks to `BookList`.
- **Component State (`useState`):**
  - Keeps component UI reactive to data changes.
  - *Example:* `Sec1Catalouge` maintains `search` text input, `books` array, and loading/error states.
  - *Example:* `AdminBooks` tracks `editingBook` (`null` for new books, book object for edits).
- **Side Effects (`useEffect`):**
  - Handles asynchronous HTTP operations triggered on mount or state dependency changes.
  - *Example:* In `Sec1Catalouge.jsx`, `useEffect` fetches books from `${API_URL}/books${query}` whenever `[search, refreshCount]` changes.
  - *Example:* In `Return.jsx`, `useEffect` fetches user loans whenever `[token, refreshCount]` changes.
- **The `refreshCount` Trigger Pattern:**
  - Instead of duplicating fetch logic across handler functions, components use a numeric `refreshCount` state counter (e.g. `setRefreshCount(c => c + 1)`).
  - Passing `refreshCount` into `useEffect` dependency arrays ensures that mutations (borrowing a book, returning a loan, saving an admin edit) cleanly trigger an automatic re-fetch of fresh data.
- **Controlled Forms:**
  - Form inputs are bound directly to React state (`value={form.title}` and `onChange={handleChange}`), ensuring React remains the single source of truth for form data.
- **List Rendering & Keys (`.map()`):**
  - Transforms array data into JSX elements.
  - Every rendered list element uses a unique database ID key (`key={book._id}` or `key={loan._id}`), enabling React's reconciliation engine to efficiently update the DOM without re-rendering unchanged elements.
- **Conditional Rendering:**
  - Renders UI based on state conditions:
    - Loading states: `loading && <p>Loading...</p>`
    - Dynamic button states: `isAvailable ? 'Borrow' : 'Currently unavailable'`
    - Authenticated states: `!token ? <LoginPrompt /> : <LoansGrid />`

---

## 7. API Integration & Endpoint Reference

The following table documents every API endpoint called by the frontend codebase, verified against the actual backend routes and controllers:

| Component | Method | Endpoint | Query / Request Body | Headers | Auth Required? | Purpose & Backend Handler |
|---|---|---|---|---|---|---|
| `Sec1Catalouge.jsx` | `GET` | `${API_URL}/books` | `?search=<text>` (optional) | None | No | List books with search query (`bookController.getAllBooks`) |
| `Sec1Catalouge.jsx` | `POST` | `${API_URL}/circulation/borrow` | JSON: `{ bookId }` | `Content-Type: application/json` | **Yes** (Bearer Token) | Student self-service borrow action |
| `Return.jsx` | `GET` | `${API_URL}/circulation/my-loans` | None | None | **Yes** (Bearer Token) | Fetch active loans for logged-in user |
| `Return.jsx` | `POST` | `${API_URL}/circulation/return/:id` | None | None | **Yes** (Bearer Token) | Student loan return action (`circulationController.returnBook`) |
| `Borrow.jsx` | `POST` | `${API_URL}/circulation/issue` | JSON: `{ bookId, userId, dueDate }` | `Content-Type: application/json` | **Yes** (Admin Bearer Token) | Administrative book issuance (`circulationController.issueBook`) |
| `AdminBooks.jsx` | `GET` | `${API_URL}/books` | None | None | No | Fetch all books for admin table (`bookController.getAllBooks`) |
| `AdminBooks.jsx` | `POST` | `${API_URL}/books` | JSON: `{ title, author, isbn, category, totalCopies, availableCopies }` | `Content-Type: application/json` | **Yes** (Bearer Token) | Create new book record (`bookController.createBook`) |
| `AdminBooks.jsx` | `PUT` | `${API_URL}/books/:id` | JSON: `{ title, author, isbn, category, totalCopies, availableCopies }` | `Content-Type: application/json` | **Yes** (Bearer Token) | Update book record (`bookController.updateBook`) |
| `AdminBooks.jsx` | `DELETE` | `${API_URL}/books/:id` | None | None | **Yes** (Bearer Token) | Delete book record (`bookController.deleteBook`) |
| `Login.jsx` | `POST` | `${API_URL}/auth/register` | JSON: `{ name, gender, email, password }` | `Content-Type: application/json` | No | User registration (`authRoutes /register`) |
| `Login.jsx` | `POST` | `${API_URL}/auth/login` | JSON: `{ email, password }` | `Content-Type: application/json` | No | User login returning JWT (`authRoutes /login`) |
| `Login.jsx` | `GET` | `${API_URL}/auth/` | None | None | **Yes** (Bearer Token) | Fetch authenticated user profile (`authRoutes /`) |

---

## 8. Authentication & Session Behavior

### 1. Registration Flow
In `RegisterForm.jsx`, submitting `{ name, gender, email, password }` sends a `POST` request to `${API_URL}/auth/register`. On HTTP 201, it prompts the user and automatically switches to the login view.

### 2. Login & Token Storage
In `LoginForm.jsx`, submitting credentials sends a `POST` request to `${API_URL}/auth/login`. On HTTP 200:
1. The JWT token is saved to browser storage: `localStorage.setItem('token', data.token)`.
2. A follow-up `GET ${API_URL}/auth/` request with `Authorization: Bearer ${data.token}` fetches the user profile.
3. The user profile is persisted: `localStorage.setItem('user', JSON.stringify(userData.user))`.
4. Component state is updated: `setUser(userData.user)`.

### 3. Session Restoration & Logout
- **Initial Load:** `Login.jsx` restores session state on mount via `useState(JSON.parse(localStorage.getItem('user')))`.
- **Token Usage Across Pages:** Other pages (`Sec1Catalouge.jsx`, `Return.jsx`, `AdminBooks.jsx`, `Borrow.jsx`) read `localStorage.getItem('token')` to authorize their respective API calls.
- **Logout:** Clicking "Log Out" executes `handleLogout()`, removing `'token'` and `'user'` from `localStorage` and resetting `user` state to `null`.
- **Stateless Nature:** Logout is client-side; no backend token invalidation endpoint is called because JWT tokens are stateless.

### 4. Known Architecture Boundaries
- **No Global Auth Context:** While `localStorage` stores the token, there is no global React Context or Redux store broadcasting auth changes across components.
- **No Client Route Guarding:** Routes like `/admin` and `/borrow` can be directly navigated to in the browser; security enforcement occurs at the API layer when requests lack valid admin tokens.

---

## 9. Book Catalogue & Cover System

### 1. Live Keyword Search
In `Sec1Catalouge.jsx`, typing into the search input dynamically updates the query string `${API_URL}/books?search=...`. Searching is executed server-side in MongoDB across `title`, `author`, and `isbn` fields using case-insensitive regex patterns.

### 2. Three-Tier Book Cover Resolution
In `Sec1a.jsx` (`BookCard`), book covers are resolved using a resilient three-tier hierarchy:
1. **Explicit Database Cover:** Uses `book.coverImage` if provided by the backend record.
2. **Open Library Covers API:** If `coverImage` is absent, the component sanitizes the ISBN (`book.isbn.replace(/[^0-9X]/gi, '')`) and requests the medium cover from Open Library:
   `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-M.jpg`
3. **Graceful CSS Fallback:** If the external image fails to load or the book lacks a valid ISBN, an `onError` handler flips `hasError = true`, rendering an integrated card fallback with the library lotus logo (`/lotus.svg`), title, and author.

### 3. One-Click Student Borrowing
- When a user clicks **"Borrow"** on an available book card:
  - If unauthenticated (`!token`), React Router automatically redirects to `/login` via `navigate('/login')`.
  - If authenticated, sends `POST ${API_URL}/circulation/borrow` with `{ bookId: book._id }` and the user's Bearer token.
  - On success, increments `refreshCount` to update available copy counts immediately.

---

## 10. Student Circulation & Loan Management

### 1. "My Books" Dashboard (`Return.jsx`)
- Available at `/return`.
- **Unauthenticated State:** Prompts the student to log in with a direct link to `/login`.
- **Authenticated State:** Fetches the student's active loans from `GET ${API_URL}/circulation/my-loans`.
- **Loan Cards:** Displays book title, author, formatted due date (`toLocaleDateString()`), and status pill (`Issued`).
- **Return Action:** Clicking "Return" sends `POST ${API_URL}/circulation/return/${loanId}` with the user token, updating stock and loan status.

### 2. Administrative Book Issuing (`Borrow.jsx`)
- Available at `/borrow`.
- Allows library staff to issue a book by providing `bookId`, `userId`, `dueDate`, and an admin authorization token.
- Submits `POST ${API_URL}/circulation/issue`.
- Upon creation, renders a `TransactionCard.jsx` summary displaying transaction ID, book ID, user ID, due date, and status.

---

## 11. Admin Book Management (CRUD)

Located at `/admin` (`AdminBooks.jsx`), this interface provides complete catalogue management:

- **Create:** Submitting `BookForm` with title, author, ISBN, category, total copies, and available copies sends `POST ${API_URL}/books`.
- **Edit:** Clicking "Edit" in `BookList` loads the record into `editingBook` state. `BookForm` switches to edit mode, allowing changes and submitting `PUT ${API_URL}/books/${id}`.
- **Delete:** Clicking "Delete" prompts a native confirmation dialog (`window.confirm`) and sends `DELETE ${API_URL}/books/${id}`.
- **Client-Side Validation:** `BookForm` enforces `min="0"` on copy counts and requires all essential fields.
- **Authorization:** `sendRequest()` includes `Authorization: Bearer ${token}` with every mutation request.

---

## 12. Styling & Design System

The application uses **Vanilla CSS** with scoped stylesheets and a unified token system:

- **CSS Variables & Design Tokens (`src/index.css`):**
  - `--bg`: Background canvas color.
  - `--text` & `--text-h`: High-contrast body and heading typography colors.
  - `--border` & `--accent-border`: Border definitions for cards, tables, and inputs.
  - `--accent`: Brand highlight color.
  - `--shadow`: Elevation shadows for cards and interactive components.
- **Typography:** Uses Google Font `Plus Jakarta Sans` imported via `index.html`.
- **Component Styles:** Each component imports its own dedicated stylesheet (e.g. `Hero.css`, `Sec1a.css`, `BookList.css`, `Return.css`).
- **Micro-Animations:** Interactive cards use hover elevation (`transform: translateY(-2px);`) and smooth transition effects.

---

## 13. Build, Lint & Validation Scripts

All scripts are defined in [package.json](./package.json):

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Starts local development server with Hot Module Replacement (HMR). |
| `build` | `vite build` | Compiles and minifies the production bundle into `frontend/dist/`. |
| `lint` | `eslint .` | Runs ESLint across all JavaScript/JSX files. |
| `preview` | `vite preview` | Serves the production `dist/` bundle locally using Vite. |
| `deploy:cf` | `npm run build && wrangler deploy` | Compiles the frontend and deploys static assets to Cloudflare Workers. |
| `preview:cf` | `npm run build && wrangler dev` | Compiles the frontend and starts a local Wrangler development server to preview Cloudflare Workers static asset serving and SPA routing locally. |

### Validation Commands

Run these from the repository root:

```bash
# 1. Run ESLint (0 errors, 0 warnings)
npm --prefix frontend run lint

# 2. Compile production bundle
npm --prefix frontend run build

# 3. Validate Cloudflare configuration (dry-run without deploying)
npm --prefix frontend run deploy:cf -- --dry-run
```

---

## 14. Vercel Deployment Configuration

The frontend includes configuration prepared for Vercel static hosting.

### 1. Dashboard Settings

When importing the repository in Vercel:
- **Root Directory:** `frontend` *(Required: the Vite application is in a subfolder)*
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 2. Environment Variables

Under **Project Settings → Environment Variables**:
- **Key:** `VITE_API_URL`
- **Value:** `https://library-management-system-2-7fc2.onrender.com/api` (or custom deployed backend domain)
- Apply to: Production and Preview.

### 3. SPA Route Fallback (`vercel.json`)

Single-Page Applications require all non-asset requests to rewrite to `index.html` so that React Router can handle routing on the client side. This is handled by [vercel.json](./vercel.json):

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This prevents 404 errors when directly navigating to or refreshing routes like `/books`, `/return`, `/login`, and `/admin`.

---

## 15. Cloudflare Workers Deployment Configuration

The frontend is configured for Cloudflare Workers using modern **Static Assets**.

### 1. Configuration File (`frontend/wrangler.jsonc`)

[wrangler.jsonc](./wrangler.jsonc):

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "library-management-system-frontend",
  "compatibility_date": "2026-10-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

- **`assets.directory`:** Points to `./dist`, Vite's compiled output.
- **`not_found_handling: "single-page-application"`:** Automatically serves `index.html` for deep links (`/books`, `/return`, `/login`, `/admin`), providing native SPA client routing.

### 2. Local Simulation & Dry Run

```bash
# Validate static asset parsing without uploading:
npm --prefix frontend run deploy:cf -- --dry-run

# Run local Wrangler preview server:
npm --prefix frontend run preview:cf
```

---

## 16. Troubleshooting Common Issues

### 1. Deployed Render Backend Initial Delay ("Cold Start")
- **Symptom:** Initial catalogue load takes 30–50 seconds or browser console shows a temporary network timeout.
- **Cause:** Render free tier web services spin down after periods of inactivity.
- **Solution:** Allow 30–60 seconds for the Render backend container to spin up, or visit the backend health check (`https://library-management-system-2-7fc2.onrender.com/health`) in your browser to wake the service.

### 2. "Failed to fetch" on Local Backend
- **Symptom:** API calls fail when running locally.
- **Cause:** Local backend Express server is not running, or running on an unexpected port (port 5000 vs 5001).
- **Solution:** Verify the backend is running (`npm --prefix backend start`), check the port in your terminal, and set `VITE_API_URL=http://localhost:5000/api` in `frontend/.env`.

### 3. Changes to `.env` Not Reflected
- **Symptom:** Updating `VITE_API_URL` has no effect.
- **Cause:** Vite statically bakes environment variables into compiled bundles at build time.
- **Solution:** Restart the development server (`npm run dev`) or recompile the production build (`npm run build`).

### 4. HTTP 404 on Page Reload in Production
- **Symptom:** Direct URLs like `/books` or `/admin` return a 404 error from the host.
- **Cause:** Static hosts attempt to locate a physical file matching the path unless SPA rewrite rules are defined.
- **Solution:** Ensure `vercel.json` (for Vercel) or `wrangler.jsonc` (for Cloudflare) is present in `frontend/`.

---

## 17. Project Status & Team Responsibilities

As documented in [TASKS.md](../TASKS.md), development responsibilities are distributed across three team members:

### Team Member Scope Breakdown

- **Member 1 — Prakhar Raj (Book Management Backend):**
  - Mongoose Book schema (title, author, ISBN, category, copies).
  - Book CRUD APIs (`POST`, `GET`, `PUT`, `DELETE` at `/api/books`).
  - Validation rules (unique ISBN, non-negative copy counts).
  - Search and category filters in MongoDB.
  - Automated tests for book management endpoints.
- **Member 2 — Bhavesh Pandey (Authentication, Authorization & Circulation Backend):**
  - User model and authentication APIs (`/api/auth/register`, `/api/auth/login`).
  - JWT authentication middleware and protected profile endpoint (`/api/auth/`).
  - Role-based authorization middleware (`admin` vs `user`).
  - Book circulation APIs (issuing and returning records, stock decrement/increment).
  - Automated tests for authentication and circulation workflows.
- **Member 3 — Ujjwal Raj (React Frontend & Deployment Configuration):**
  - React + Vite SPA scaffold, navigation bar, and React Router integration (`/`, `/books`, `/return`, `/login`, `/admin`, `/borrow`).
  - Authentication views (`Login.jsx`, `LoginForm.jsx`, `RegisterForm.jsx`) with token/profile storage and session lifecycle.
  - Searchable book catalogue (`Sec1Catalouge.jsx`) with three-tier cover resolution (`Sec1a.jsx`).
  - Admin book management interface (`AdminBooks.jsx`, `BookForm.jsx`, `BookList.jsx`) with client-side copy validation and Bearer authorization.
  - Student circulation interface (one-click borrowing, "My Books" loan tracking and returns in `Return.jsx`).
  - Centralized API URL resolution in `config.js` with Render deployed backend defaults.
  - Production deployment configuration and verification for Vercel (`vercel.json`) and Cloudflare Workers (`wrangler.jsonc`).
