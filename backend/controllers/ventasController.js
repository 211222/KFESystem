const db = require('../db');
const ventasModel = require('../models/ventaModel');

exports.crearVenta = async (req, res) => {
  const { productos } = req.body;

  if (!productos || productos.length === 0) {
    return res.status(400).json({ message: 'La venta debe tener al menos un producto.' });
  }

  for (const producto of productos) {
    if (!producto.producto_id) {
      return res.status(400).json({ message: `Falta el ID de un producto: ${JSON.stringify(producto)}` });
    }
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const ventaId = await ventasModel.crearVenta(connection);
    await ventasModel.insertarDetallesVenta(connection, ventaId, productos);

    for (const producto of productos) {
      const stockActual = await ventasModel.obtenerStockProducto(connection, producto.producto_id);
      if (stockActual === undefined) {
        throw new Error(`Producto con id ${producto.producto_id} no existe`);
      }
      if (stockActual < producto.cantidad) {
        throw new Error(`Stock insuficiente para el producto id ${producto.producto_id}`);
      }
      await ventasModel.actualizarStock(connection, producto.producto_id, producto.cantidad);
    }

    await connection.commit();
    res.status(201).json({ message: 'Venta registrada correctamente', ventaId });

  } catch (error) {
    await connection.rollback();
    console.error('Error en la venta:', error);
    res.status(500).json({ message: error.message || 'Error al registrar la venta' });
  } finally {
    connection.release();
  }
};
