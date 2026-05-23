import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "FruitApi123456",
  database: process.env.DB_NAME || "fruitdb",
  waitForConnections: true,
  connectionLimit: 10,
})

export async function initDB() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS fruits (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      in_season BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export default pool