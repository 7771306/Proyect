//backend/middleware/errorHandler.js

export default function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Ocurrió un error en el servidor" });
}
