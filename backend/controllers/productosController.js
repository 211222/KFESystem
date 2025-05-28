// backend/controllers/productosController.js
const productoModel = require('../models/productoModel');

exports.getAll = async (req, res) => {
  try {
    const productos = await productoModel.getAll();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};


exports.create = async (req, res) => {
  const { nombre, precio, stock } = req.body;
  try {
    await productoModel.create({ nombre, precio, stock });
    res.json({ message: 'Producto creado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock } = req.body;

  try {
    await productoModel.update(id, { nombre, precio, stock });
    res.json({ message: 'Producto actualizado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};


exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    await productoModel.delete(id);
    res.json({ message: 'Producto eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

