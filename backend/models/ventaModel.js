//backend/models/ventaModel.js
import { pool } from '../config/db.js';

// ================= REGISTRAR VENTA ===================
export const registrarVenta = async (usuario_id, libros, metodo_pago = 'efectivo') => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    let total = 0;

    // Validar stock y calcular total
    const preciosPorLibro = {};

    for (const item of libros) {
      const [prodRows] = await conn.query(
        'SELECT precio, stock FROM libros WHERE id = ?',
        [item.id_libro]
      );
      if (prodRows.length === 0) throw new Error(`Libro ${item.id_libro} no encontrado`);
      const { precio, stock } = prodRows[0];
      if (item.cantidad > stock) throw new Error('Stock insuficiente');
      total += precio * item.cantidad;

      // Guardar precio para reutilizar
      preciosPorLibro[item.id_libro] = precio;
    }

    // Registrar la venta
    const [ventaResult] = await conn.query(
      'INSERT INTO ventas (usuario_id, total, metodo_pago, fecha) VALUES (?, ?, ?, CURDATE())',
      [usuario_id, total, metodo_pago]
    );
    const id_venta = ventaResult.insertId;

    // Registrar los detalles y descontar stock
    for (const item of libros) {
      const precio = preciosPorLibro[item.id_libro];

      await conn.query(
        'INSERT INTO venta_detalles (id_venta, id_libro, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [id_venta, item.id_libro, item.cantidad, precio]
      );

      await conn.query(
        'UPDATE libros SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.id_libro]
      );
    }

    await conn.commit();
    return { id_venta, total };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

// ============== OBTENER TODAS LAS VENTAS =================
export const obtenerVentas = async () => {
  const [results] = await pool.query(`
    SELECT 
      v.id AS id_venta,
      u.nombre AS usuario,
      p.titulo AS libro,
      d.cantidad,
      d.precio_unitario,
      (d.cantidad * d.precio_unitario) AS subtotal,
      v.total,
      v.fecha,
      v.metodo_pago
    FROM ventas v
    JOIN usuarios u ON v.usuario_id = u.id
    JOIN venta_detalles d ON d.id_venta = v.id
    JOIN libros p ON d.id_libro = p.id
    ORDER BY v.fecha DESC
  `);
  return results;
};

// ============== OBTENER VENTA POR ID =================
export const obtenerVentaPorId = async (id) => {
  const conn = await pool.getConnection();
  try {
    const [venta] = await conn.query(`
      SELECT 
        v.id, 
        v.usuario_id, 
        d.id_libro, 
        d.cantidad
      FROM ventas v
      JOIN venta_detalles d ON v.id = d.id_venta
      WHERE v.id = ?
    `, [id]);
    return venta;
  } finally {
    conn.release();
  }
};

// ============== EDITAR VENTA =================
export const editarVenta = async (id, datos) => {
  const { usuario_id, id_libro, cantidad } = datos;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Obtener datos del libro
    const [prodRows] = await conn.query(
      'SELECT precio, stock FROM libros WHERE id = ?',
      [id_libro]
    );
    if (prodRows.length === 0) throw new Error(`Libro ${id_libro} no encontrado`);
    const { precio, stock } = prodRows[0];

    // Obtener detalle original
    const [ventaDetRes] = await conn.query(
      'SELECT cantidad, id_libro FROM venta_detalles WHERE id_venta = ?',
      [id]
    );
    if (ventaDetRes.length === 0) throw new Error('Detalle de venta no encontrado');

    const detalleOriginal = ventaDetRes[0];
    const cantidadAnterior = detalleOriginal.cantidad;

    // Revertir stock anterior
    await conn.query(
      'UPDATE libros SET stock = stock + ? WHERE id = ?',
      [cantidadAnterior, detalleOriginal.id_libro]
    );

    // Verificar stock disponible
    if (cantidad > stock + cantidadAnterior) {
      throw new Error('Stock insuficiente para la nueva cantidad');
    }

    // Actualizar detalle
    await conn.query(
      `UPDATE venta_detalles
       SET id_libro = ?, cantidad = ?, precio_unitario = ?
       WHERE id_venta = ?`,
      [id_libro, cantidad, precio, id]
    );

    // Calcular nuevo total
    const [totales] = await conn.query(
      'SELECT SUM(cantidad * precio_unitario) AS total FROM venta_detalles WHERE id_venta = ?',
      [id]
    );
    const nuevoTotal = totales[0].total || 0;

    // Actualizar venta
    await conn.query(
      `UPDATE ventas
       SET usuario_id = ?, total = ?
       WHERE id = ?`,
      [usuario_id, nuevoTotal, id]
    );

    // Actualizar stock con nueva cantidad
    await conn.query(
      'UPDATE libros SET stock = stock - ? WHERE id = ?',
      [cantidad, id_libro]
    );

    await conn.commit();
    return { id };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// ============== ELIMINAR VENTA =================
export const eliminarVenta = async (id) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Obtener detalles de la venta
    const [detalles] = await conn.query(
      'SELECT id_libro, cantidad FROM venta_detalles WHERE id_venta = ?',
      [id]
    );
    if (detalles.length === 0) throw new Error('Detalle de venta no encontrado');

    // Revertir stock
    for (const detalle of detalles) {
      await conn.query(
        'UPDATE libros SET stock = stock + ? WHERE id = ?',
        [detalle.cantidad, detalle.id_libro]
      );
    }

    // Eliminar detalles
    await conn.query('DELETE FROM venta_detalles WHERE id_venta = ?', [id]);

    // Eliminar venta
    await conn.query('DELETE FROM ventas WHERE id = ?', [id]);

    await conn.commit();
    return { id };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};