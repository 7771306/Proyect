//backend/controllers/ventaController.js

import {
  editarVenta as editarVentaModel,
  eliminarVenta as eliminarVentaModel,
  obtenerVentaPorId as obtenerVentaPorIdModel,
  obtenerVentas as obtenerVentasModel,
  registrarVenta as registrarVentaModel
} from '../models/ventaModel.js';

import { enviarReciboPorCorreo } from '../utils/correo.js';

// Registrar una venta
export const registrarVenta = async (req, res) => {
  const { usuario_id, metodo_pago, libros } = req.body;
  if (!usuario_id || !libros || libros.length === 0) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }
  try {
    const resultado = await registrarVentaModel(usuario_id, libros, metodo_pago);
    res.json({ mensaje: 'Venta registrada correctamente', ...resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una venta por ID
export const obtenerVentaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const venta = await obtenerVentaPorIdModel(id);

    if (!venta || venta.length === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json(venta[0]);
  } catch (error) {
    console.error('Error en obtenerVentaPorId:', error);
    res.status(500).json({ error: 'Error al obtener la venta' });
  }
};

// Obtener todas las ventas
export const obtenerVentas = async (req, res) => {
  try {
    const ventas = await obtenerVentasModel();
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar una venta
export const editarVenta = async (req, res) => {
  const id = req.params.id;
  const datosActualizados = req.body;
  console.log('Datos recibidos:', req.body);

  try {
    const resultado = await editarVentaModel(id, datosActualizados);
    res.json({ mensaje: 'Venta actualizada correctamente', resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar una venta
export const eliminarVenta = async (req, res) => {
  const id = req.params.id;

  try {
    const resultado = await eliminarVentaModel(id);
    res.json({ mensaje: 'Venta eliminada correctamente', resultado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

