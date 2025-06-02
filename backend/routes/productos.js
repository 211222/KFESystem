// backend/routes/productos.js
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

router.get('/', productosController.getAll);
router.post('/add', productosController.create);
router.put('/put/:id', productosController.update);
router.delete('/del/:id', productosController.delete);
router.get('/mas-vendidos', productosController.getMasVendidos);


module.exports = router;
