const express = require('express');
const router = express.Router();
const { obtenerMesas, actualizarEstadoMesa } = require('../controllers/c_mesaController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/', verificarToken, obtenerMesas);
router.patch('/:id/estado', verificarToken, actualizarEstadoMesa);

module.exports = router;