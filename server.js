require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const port = process.env.PORT || 3000;
const origins = (process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map(value => value.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Requests from Postman, curl and server-to-server clients have no Origin.
    if (!origin || origins.length === 0 || origins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("This browser origin is not allowed by the API."));
  }
}));
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const studentNumber = process.env.STUDENT_NUMBER || "REPLACE WITH YOUR STUDENT NUMBER";
  res.type("html").send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Study Support Requests API Guide</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f5f6fb;color:#202844;font:15px Arial,sans-serif;line-height:1.6}
main{max-width:980px;margin:40px auto;padding:0 20px}.hero{background:linear-gradient(120deg,#262451,#6256cf);color:white;padding:30px;border-radius:14px}
.eyebrow{font-size:11px;letter-spacing:2px;color:#d4d0ff;font-weight:bold}.hero h1{margin:8px 0;font-size:30px}.hero p{color:#e0def6;margin:0}
.card{background:white;border:1px solid #e5e8f0;border-radius:12px;padding:22px;margin-top:18px}
h2{font-size:19px;margin:0 0 12px}a{color:#5c50c8}code,pre{background:#f2f3f8;border-radius:5px;padding:3px 6px;overflow-wrap:anywhere}
table{width:100%;border-collapse:collapse;text-align:left}th,td{padding:10px;border-bottom:1px solid #eceef4;font-size:13px}th{background:#f7f8fb;color:#626d84}
.method{font-weight:bold;color:#5c50c8}pre{padding:15px;line-height:1.5;overflow-x:auto}
.note{background:#f1efff;border-left:4px solid #6557d9;padding:12px 14px;border-radius:5px;font-size:13px}
small{color:#7e879d}.footer{color:#8991a4;font-size:12px;margin:22px 0}
@media(max-width:600px){main{margin:20px auto;padding:0 12px}.hero{padding:22px}.hero h1{font-size:24px}.card{padding:15px}.table-scroll{overflow-x:auto}table{min-width:620px}}
</style>
</head>
<body><main>
<section class="hero"><div class="eyebrow">ICT251 · ACTIVITY 7</div><h1>Study Support Requests API</h1>
<p>An independent REST API for creating and managing student academic support requests.</p></section>
<section class="card"><h2>Project information</h2>
<p><strong>Project:</strong> Study Support Requests</p>
<p><strong>University:</strong> Mulungushi University</p>
<p><strong>Student number:</strong> ${escapeHtml(studentNumber)}</p>
<p><strong>API base URL:</strong> <a href="${baseUrl}">${baseUrl}</a></p>
<p><strong>Health check:</strong> <a href="${baseUrl}/health">${baseUrl}/health</a></p>
<p><strong>All records:</strong> <a href="${baseUrl}/api/records">${baseUrl}/api/records</a></p></section>
<section class="card"><h2>Available routes</h2><div class="table-scroll"><table>
<thead><tr><th>Method</th><th>Route</th><th>Purpose</th><th>Success</th></tr></thead><tbody>
<tr><td class="method">GET</td><td>/</td><td>API guide</td><td>200</td></tr>
<tr><td class="method">GET</td><td>/health</td><td>Server and database health</td><td>200</td></tr>
<tr><td class="method">GET</td><td>/api/records</td><td>Read all records</td><td>200</td></tr>
<tr><td class="method">GET</td><td>/api/records/:id</td><td>Read one record</td><td>200</td></tr>
<tr><td class="method">POST</td><td>/api/records</td><td>Create a record</td><td>201</td></tr>
<tr><td class="method">PUT</td><td>/api/records/:id</td><td>Replace all editable fields</td><td>200</td></tr>
<tr><td class="method">DELETE</td><td>/api/records/:id</td><td>Delete a record</td><td>200</td></tr>
</tbody></table></div></section>
<section class="card"><h2>Record format</h2><p>POST and PUT must contain all four editable fields. Do not send an <code>id</code>; the database generates it.</p>
<pre>{
  "title": "Help with Java arrays",
  "category": "Programming",
  "description": "I need help understanding arrays in Java.",
  "status": "Pending"
}</pre>
<p><strong>Validation:</strong> title 3–80 characters; category 2–40 characters; description 5–300 characters. Text is trimmed before length checks.</p>
<p><strong>Allowed statuses:</strong> Pending, In progress, Completed.</p></section>
<section class="card"><h2>Response codes</h2><p><code>200</code> successful read, update or delete · <code>201</code> record created · <code>400</code> invalid input, malformed JSON or invalid ID · <code>404</code> record or route not found · <code>500</code> unexpected server error · <code>503</code> database unavailable.</p>
<p class="note">A hosted free service may pause while idle. The first request can take a little time to start the service.</p></section>
<p class="footer">Study Support Requests · ICT251 Frontend and Backend Development</p>
</main></body></html>`);
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
}

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check database error:", error);
    res.status(503).json({ status: "error", database: "unavailable", message: "Database is unavailable." });
  }
});

app.use("/api/records", require("./routes/records"));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  console.error("Request error:", error);
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Malformed JSON request body." });
  }
  if (error.message && error.message.includes("origin is not allowed")) {
    return res.status(403).json({ message: error.message });
  }
  return res.status(500).json({ message: "An unexpected server error occurred." });
});

async function startServer() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS records (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        title VARCHAR(80) NOT NULL,
        category VARCHAR(40) NOT NULL,
        description VARCHAR(300) NOT NULL,
        status VARCHAR(20) NOT NULL
          CHECK (status IN ('Pending', 'In progress', 'Completed')),
        CONSTRAINT title_length
          CHECK (char_length(btrim(title)) BETWEEN 3 AND 80),
        CONSTRAINT category_length
          CHECK (char_length(btrim(category)) BETWEEN 2 AND 40),
        CONSTRAINT description_length
          CHECK (char_length(btrim(description)) BETWEEN 5 AND 300)
      );
    `);

    console.log("Records table is ready.");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Study Support API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

startServer();