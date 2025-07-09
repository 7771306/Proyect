//backend/config/db.js

import dotenv from 'dotenv';
import mysql from "mysql2/promise";

dotenv.config();

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "A159753",
  database: "proyecto",
  waitForConnections: true,
  connectionLimit: process.env.DB_CONN_LIMIT || 10,
  queueLimit: 0
});

try {
  const connection = await pool.getConnection();
  console.log("✅ Conexión a la base de datos MySQL exitosa");
  connection.release();
} catch (error) {
  console.error("❌ Error al conectar a la base de datos:", error.message);
}