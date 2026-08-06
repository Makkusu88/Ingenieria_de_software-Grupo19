const express = require('express');
const router = express.Router();
const { crearUbicacion, obtenerUbicaciones, inactivarUbicacion } = require('../controllers/c_ubicacionController');
const { verificarToken, esInventario } = require('../middleware/authMiddleware');

router.get('/', verificarToken, esInventario, obtenerUbicaciones);
router.post('/', verificarToken, esInventario, crearUbicacion);
router.put('/inactivar/:id', verificarToken, esInventario, inactivarUbicacion);

module.exports = router;
