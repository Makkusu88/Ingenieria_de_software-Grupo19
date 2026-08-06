const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(403).json({ message: 'Token requerido. Inicie sesión para continuar.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'brewflow_dev_secret');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Sesión expirada o token no válido' });
    }
};

const normalizarRol = rol => String(rol || '').trim().toLowerCase();

const requerirRoles = (...rolesPermitidos) => {
    const permitidos = rolesPermitidos.map(normalizarRol);
    return (req, res, next) => {
        const rolUsuario = normalizarRol(req.user?.rol_nombre);
        if (rolUsuario === 'admin' || permitidos.includes(rolUsuario)) {
            return next();
        }
        return res.status(403).json({
            message: 'Acceso denegado: su perfil no tiene permisos para esta funcionalidad',
            rol_requerido: permitidos,
            rol_actual: rolUsuario || null
        });
    };
};

const esAdmin = requerirRoles('admin');
const esGestionUsuarios = requerirRoles('admin', 'encargado_rrhh');
const esInventario = requerirRoles('admin', 'operador_inventario', 'supervisor');
const esSupervisorOInventario = requerirRoles('admin', 'operador_inventario', 'supervisor');

module.exports = {
    verificarToken,
    requerirRoles,
    esAdmin,
    esGestionUsuarios,
    esInventario,
    esSupervisorOInventario
};
