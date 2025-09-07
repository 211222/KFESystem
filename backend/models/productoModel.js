// backend/models/productoModel.js
const db = require('../db');

exports.getAll = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    return rows;
  } catch (err) {
    throw err;
  }
};

exports.create = async (producto) => {
  const { nombre, precio, stock } = producto;
  const query = 'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)';
  try {
    const [result] = await db.query(query, [nombre, precio, stock]);
    return result;
  } catch (err) {
    throw err;
  }
};


exports.update = async (id, producto) => {
  const { nombre, precio, stock } = producto;
  const query = 'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?';
  try {
    const [result] = await db.query(query, [nombre, precio, stock, id]);
    return result;
  } catch (err) {
    throw err;
  }
};


exports.delete = async (id) => {
  const query = 'DELETE FROM productos WHERE id = ?';
  try {
    const [result] = await db.query(query, [id]);
    return result;
  } catch (err) {
    throw err;
  }
};





exports.obtenerMasVendidos = async () => {
  const query = `
     SELECT p.id, p.nombre, SUM(dv.cantidad) AS cantidadVendida
    FROM detalles_venta dv
    INNER JOIN productos p ON p.id = dv.producto_id
    GROUP BY dv.producto_id
    ORDER BY cantidadVendida DESC
    LIMIT 3
  `;
  try {
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    console.error('Error en modelo al obtener más vendidos:', error);
    throw error;
  }
};

