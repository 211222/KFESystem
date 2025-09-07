const db = require('../db');

exports.crearVenta = async (connection) => {
  const [result] = await connection.query('INSERT INTO ventas (fecha) VALUES (NOW())');
  return result.insertId;
};

exports.insertarDetallesVenta = async (connection, ventaId, productos) => {
  const values = productos.map(p => [ventaId, p.producto_id, p.cantidad]);
  await connection.query(
    'INSERT INTO detalles_venta (venta_id, producto_id, cantidad) VALUES ?',
    [values]
  );
};

exports.obtenerStockProducto = async (connection, producto_id) => {
  const [rows] = await connection.query(
    'SELECT stock FROM productos WHERE id = ?',
    [producto_id]
  );
  return rows[0]?.stock;
};

exports.actualizarStock = async (connection, producto_id, cantidadVendida) => {
  await connection.query(
    'UPDATE productos SET stock = stock - ? WHERE id = ?',
    [cantidadVendida, producto_id]
  );
};
