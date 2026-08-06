const express = require('express');
const router = express.Router();
const { obtenerMetricasDashboard } = require('../controllers/c_dashboardController');
const { verificarToken, requerirRoles } = require('../middleware/authMiddleware');

router.get('/resumen', verificarToken, requerirRoles('admin', 'operador_inventario', 'supervisor', 'colaborador'), obtenerMetricasDashboard);

module.exports = router;
