//backend/routes/ventaRoutes.js

import express from 'express';
import { editarVenta, eliminarVenta, obtenerVentaPorId, obtenerVentas,
registrarVenta } from '../controllers/ventasController.js';
const router = express.Router();
// Obtener ventas
router.get('/', obtenerVentas);
// Registrar venta
router.post('/', registrarVenta);
// Editar venta
router.put('/:id', editarVenta);
// Eliminar venta
router.delete('/:id', eliminarVenta);
router.get('/:id', obtenerVentaPorId);
export default router;
