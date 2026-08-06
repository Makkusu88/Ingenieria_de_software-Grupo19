const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Redirigir la raíz al login para evitar "Not found" en http://localhost:8080/
app.get('/', (req, res) => {
    res.redirect('/v_login.html');
});

// Rutas funcionales del Incremento 1
app.use('/api/auth', require('./routes/c_auth'));
app.use('/api/dashboard', require('./routes/c_dashboard'));
app.use('/api/admin/usuarios', require('./routes/c_usuarios'));
app.use('/api/mesas', require('./routes/c_mesas'));
app.use('/api/productos', require('./routes/c_productos'));
app.use('/api/lotes', require('./routes/c_lotes'));
app.use('/api/proveedores', require('./routes/c_proveedores'));
app.use('/api/movimientos', require('./routes/c_movimientos'));
app.use('/api/unidades', require('./routes/c_unidades'));
app.use('/api/ubicaciones', require('./routes/c_ubicaciones'));

app.get('/api/health', (req, res) => {
    res.json({ ok: true, message: 'BrewFlow API operativa' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor BrewFlow operativo en puerto ${PORT}`);
});
