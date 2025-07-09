//backend/models/libros.model.js

import { pool } from "../config/db.js";

export const getLibroById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, titulo, autor, categoria_id, año, imgen, stock, precio FROM libros WHERE id = ?`,
    [id]
  );
  return rows[0];
};

export const getAllLibros = async () => {
  const [rows] = await pool.query(`
    SELECT 
      libros.id, 
      libros.titulo, 
      libros.autor, 
      libros.año, 
      libros.imgen,
      libros.stock, 
      libros.precio,
      categorias.nombre AS categoria
    FROM libros
    JOIN categorias ON libros.categoria_id = categorias.id
  `);
  return rows;
};

export const createLibro = async (libro) => {
  const { titulo, autor, categoria_id, año, imgen, stock, precio } = libro;
  const [result] = await pool.query(
    `INSERT INTO libros (titulo, autor, categoria_id, año, imgen, stock, precio)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [titulo, autor, categoria_id, año, imgen, stock, precio]
  );
  return result.insertId;
};

export const updateLibro = async (id, libro) => {
  const { titulo, autor, categoria_id, año, imgen, stock, precio } = libro;
  const [result] = await pool.query(
    `UPDATE libros SET 
      titulo = ?, 
      autor = ?, 
      categoria_id = ?, 
      año = ?, 
      imgen = ?,
      stock = ?, 
      precio = ? 
    WHERE id = ?`,
    [titulo, autor, categoria_id, año, imgen, stock, precio, id]
  );
  return result.affectedRows;
};

// Eliminar un libro
export const deleteLibro = async (id) => {
  const [result] = await pool.query("DELETE FROM libros WHERE id = ?", [id]);
  return result.affectedRows;
};

// Obtener todas las categorías (id + nombre)
export const getCategorias = async () => {
  const [rows] = await pool.query("SELECT id, nombre FROM categorias");
  return rows;
};
