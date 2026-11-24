const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Configure it in your local .env file before starting the API.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Render PostgreSQL connections normally require SSL in production.
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

pool.on("error", error => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

module.exports = pool;
