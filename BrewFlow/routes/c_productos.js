const express = require('express');
const router = express.Router();
const { obtenerProductos, crearProducto, cambiarEstadoProducto } = require('../controllers/c_productoController');
const { verificarToken, esInventario } = require('../middleware/authMiddleware');

router.get('/', verificarToken, esInventario, obtenerProductos);
router.post('/', verificarToken, esInventario, crearProducto);
router.patch('/:id/estado', verificarToken, esInventario, cambiarEstadoProducto);

module.exports = router;
