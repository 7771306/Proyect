//backend/controllers/libros.controller.js

import * as Libro from "../models/libros.model.js";

// Obtener todos los libros con info relacionada
export const getLibros = async (req, res, next) => {
  try {
    const libros = await Libro.getAllLibros();
    res.json(libros);
  } catch (err) {
    next(err);
  }
};

// Crear un nuevo libro
export const createLibro = async (req, res, next) => {
  try {
    // Asegúrate que req.body incluya 'autor' (texto) no 'autor_id'
    const id = await Libro.createLibro(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
};

// Obtener libro por ID
export const obtenerLibroPorId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const libro = await Libro.getLibroById(id);

    if (!libro) {
      return res.status(404).send("Libro no encontrado");
    }

    res.json(libro);
  } catch (error) {
    console.error("❌ Error en obtenerLibroPorId:", error);
    res.status(500).send("Error al buscar el libro");
  }
};

// Actualizar libro existente
export const updateLibro = async (req, res, next) => {
  try {
    // Asegúrate que req.body use 'autor' (texto) no 'autor_id'
    const result = await Libro.updateLibro(req.params.id, req.body);
    res.json({ updated: result });
  } catch (err) {
    next(err);
  }
};

// Eliminar libro
export const deleteLibro = async (req, res, next) => {
  try {
    const result = await Libro.deleteLibro(req.params.id);
    res.json({ deleted: result });
  } catch (err) {
    next(err);
  }
};

// Obtener categorías para el formulario
export const getCategorias = async (req, res, next) => {
  try {
    const categorias = await Libro.getCategorias();
    res.json(categorias);
  } catch (err) {
    next(err);
  }
};

import { pool } from "../config/db.js";

export const getLibrosPorCategoria = async (req, res, next) => {
  const { categoriaId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT libros.*,categorias.nombre AS categoria
FROM libros
JOIN categorias ON libros.categoria_id = categorias.id
WHERE categoria_id = ?
`,
      [categoriaId]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};