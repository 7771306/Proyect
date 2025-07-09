//backend/models/productoModel.js

import { pool } from '../config/db.js';
export const getLibros = async () => {
const [rows] = await pool.query('SELECT * FROM libros');
return rows;
};
export const addLibro = async (libro) => {
const [result] = await pool.query('INSERT INTO libros SET ?',
[libro]);
return result;
};
export const updateLibro = async (id, libro) => {
const { titulo, stock, precio } = libro;
const [result] = await pool.query('UPDATE libros SET titulo = ?,stock = ?, precio = ? WHERE id = ?', [titulo, stock, precio, id]);
return result.affectedRows;
};
export const deleteLibro = async (id) => {
const [result] = await pool.query('DELETE FROM libros WHERE id = ?',
[id]);
return result.affectedRows;
};
