const router = require('express').Router();
const { crearUsuario, obtenerUsuarios, obtenerRoles, actualizarEstadoUsuario, desbloquearUsuario } = require('../controllers/c_userController');
const { verificarToken, esGestionUsuarios } = require('../middleware/authMiddleware');

router.get('/roles', verificarToken, esGestionUsuarios, obtenerRoles);
router.get('/', verificarToken, esGestionUsuarios, obtenerUsuarios);
router.post('/', verificarToken, esGestionUsuarios, crearUsuario);
router.patch('/:id/estado', verificarToken, esGestionUsuarios, actualizarEstadoUsuario);
router.patch('/:id/desbloquear', verificarToken, esGestionUsuarios, desbloquearUsuario);

module.exports = router;
