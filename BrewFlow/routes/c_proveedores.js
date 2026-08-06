const express = require('express');
const router = express.Router();
const { crearProveedor, obtenerProveedores, cambiarEstadoProveedor, eliminarProveedor } = require('../controllers/c_proveedorController');
const { verificarToken, esInventario } = require('../middleware/authMiddleware');

router.get('/', verificarToken, esInventario, obtenerProveedores);
router.post('/', verificarToken, esInventario, crearProveedor);
router.patch('/:id/estado', verificarToken, esInventario, cambiarEstadoProveedor);
router.delete('/:id', verificarToken, esInventario, eliminarProveedor);

module.exports = router;
