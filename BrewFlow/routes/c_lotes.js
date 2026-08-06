const express = require('express');
const router = express.Router();
const { obtenerLotes, registrarLote } = require('../controllers/c_loteController');
const { verificarToken, esInventario } = require('../middleware/authMiddleware');

router.get('/', verificarToken, esInventario, obtenerLotes);
router.post('/', verificarToken, esInventario, registrarLote);

module.exports = router;
