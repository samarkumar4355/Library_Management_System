# Library Management Backend

A REST API for managing the library's book catalogue. It uses Express and MongoDB
(through Mongoose).

## Run locally

From this directory:

```bash
npm install
```

Create a `.env` file with your MongoDB connection string:

```env
MONGO_URI=mongodb://127.0.0.1:27017/library_management
PORT=5000
```

`MONGO_URI` is required; `PORT` is optional and defaults to `5000`. Start the
server and run the tests with:

```bash
npm start
npm test
```

## What's included

- Express app with JSON/form parsing, CORS, a health check, and centralized
  error responses.
- MongoDB connection setup and a Mongoose `Book` model. Books have a title,
  author, unique ISBN, category, total copies, and available copies; timestamps
  are recorded automatically.
- Book creation, listing/search/filtering, lookup by ID, updates, and deletion.
- Jest and Supertest API tests (the book model is mocked).

## API

Health check: `GET /health` returns `{ "status": "ok" }`.

All book routes use `/api/books`:

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/books` | Create a book |
| `GET` | `/api/books` | List books |
| `GET` | `/api/books/:id` | Get one book |
| `PUT` | `/api/books/:id` | Update a book |
| `DELETE` | `/api/books/:id` | Delete a book |

The create endpoint expects `title`, `author`, `isbn`, `category`, `totalCopies`,
and `availableCopies`. Copy counts cannot be negative, available copies cannot
exceed total copies, and ISBN values must be unique. To filter the list, use
`search` (matches title, author, or ISBN), `category`, and `available=true` or
`available=false`.

Example:

```bash
curl "http://localhost:5000/api/books?search=clean&available=true"
```
