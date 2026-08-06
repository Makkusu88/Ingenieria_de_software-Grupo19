const express = require('express');
const router = express.Router();
const { registrarIngreso, registrarSalida, obtenerMovimientos } = require('../controllers/c_movimientoController');
const { verificarToken, esInventario } = require('../middleware/authMiddleware');

router.get('/', verificarToken, esInventario, obtenerMovimientos);
router.post('/ingresos', verificarToken, esInventario, registrarIngreso);
router.post('/salidas', verificarToken, esInventario, registrarSalida);

module.exports = router;
