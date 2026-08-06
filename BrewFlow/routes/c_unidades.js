const express = require('express');
const router = express.Router();
const { obtenerUnidades, crearUnidad, cambiarEstadoUnidad } = require('../controllers/c_unidadMedidaController');
const { verificarToken, esInventario } = require('../middleware/authMiddleware');

router.get('/', verificarToken, esInventario, obtenerUnidades);
router.post('/', verificarToken, esInventario, crearUnidad);
router.patch('/:id/estado', verificarToken, esInventario, cambiarEstadoUnidad);

module.exports = router;
