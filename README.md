# ICT251 Activity 7 — Study Support Requests API

This is the independent Node.js backend for the same **Study Support Requests** system used in Activity 6.

## Technology
- Node.js and npm
- Express
- PostgreSQL with `pg`
- `cors` and `dotenv`

> The assignment's setup command installs `pg`, and its SQL examples use PostgreSQL `$1` placeholders. This project therefore uses PostgreSQL. It does not use SQLite.

## Project structure

```text
activity7-backend/
├── routes/
│   └── records.js
├── .env.example
├── .gitignore
├── db.js
├── package.json
├── README.md
├── schema.sql
├── seed.sql
└── server.js
```

## 1. Create a PostgreSQL database

Create a PostgreSQL database locally or using a hosted PostgreSQL provider. Copy its connection string.

For a local database, the URL commonly looks like:

```text
postgresql://postgres:YOUR_PASSWORD@localhost:5432/study_support
```

## 2. Configure environment variables

Copy `.env.example` to `.env`, then set `DATABASE_URL` to your real database connection string. Replace the student number placeholder.

Do not upload `.env` to GitHub.

## 3. Create the table and insert sample records

Run `schema.sql` against your database first, then run `seed.sql`.

You can use pgAdmin's Query Tool or the `psql` command-line tool. Example:

```bash
psql "YOUR_DATABASE_URL" -f schema.sql
psql "YOUR_DATABASE_URL" -f seed.sql
```

The seed script inserts eight fictional records and avoids inserting the same sample titles again.

## 4. Install and run

Open a terminal in this project folder:

```bash
npm install
npm start
```

Open `http://localhost:3000` for the API guide. Check `http://localhost:3000/health`.

## 5. Required API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | API guide |
| GET | `/health` | Database health check |
| GET | `/api/records` | Get all records |
| GET | `/api/records/:id` | Get one record |
| POST | `/api/records` | Create a record |
| PUT | `/api/records/:id` | Update all editable fields |
| DELETE | `/api/records/:id` | Delete a record |

POST and PUT require JSON with all four fields. Do not send `id`:

```json
{
  "title": "Help with Java arrays",
  "category": "Programming",
  "description": "I need help understanding arrays in Java.",
  "status": "Pending"
}
```

Allowed statuses: `Pending`, `In progress`, `Completed`.

## 6. Test with Postman

Set the request header `Content-Type: application/json` for POST and PUT.

1. `GET http://localhost:3000/health` — expect 200 and database connected.
2. `GET http://localhost:3000/api/records` — expect 200 and an array.
3. `POST http://localhost:3000/api/records` with the JSON body above — expect 201; note the returned ID.
4. `GET http://localhost:3000/api/records/ID` — expect 200 and the created record.
5. `PUT http://localhost:3000/api/records/ID` with all four fields — expect 200 and the same ID.
6. `DELETE http://localhost:3000/api/records/ID` — expect 200 and `{"message":"Record deleted."}`.
7. GET that ID again — expect 404.
8. Try an invalid title or status — expect 400 and a JSON message.
9. Try a positive ID that does not exist — GET, PUT and DELETE should return 404.

## 7. Deploy

1. Create a PostgreSQL database with a persistent hosted provider.
2. Run `schema.sql` and `seed.sql` against that hosted database.
3. Create a private or public GitHub repository and push this project. Include `package.json`; do not commit `.env` or `node_modules`.
4. In Render, create a **Web Service** connected to the repository.
5. Build command: `npm install`
6. Start command: `npm start`
7. Set environment variables in Render:
   - `DATABASE_URL` — hosted PostgreSQL connection string
   - `NODE_ENV` — `production`
   - `STUDENT_NUMBER` — your student number
   - `CLIENT_ORIGINS` — your Activity 6 Netlify URL (optional for Activity 7 API-client testing; useful for Activity 8)
8. Deploy and test `/`, `/health` and every CRUD route using the live service URL.

The API's local filesystem is not used for records; PostgreSQL stores them persistently. A free hosted web service may pause when idle, so its first request can take time to start.

## Before submitting

- Replace the student number placeholder in the API guide by setting `STUDENT_NUMBER`.
- Confirm the live base URL opens the API guide.
- Confirm `/health` reports a successful database check.
- Test all CRUD routes online.
- Submit the live backend base URL, not the GitHub repository URL or ZIP file.
"# campus-issues" 
