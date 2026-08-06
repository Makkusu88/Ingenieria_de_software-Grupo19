const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

const login = async (req, res) => {
    const { usuario_correo, usuario_contrasena } = req.body;

    if (!usuario_correo || !usuario_contrasena) {
        return res.status(400).json({ message: 'Debe ingresar correo institucional y contraseña' });
    }

    try {
        const correo = usuario_correo.trim().toLowerCase();

        if (!correo.endsWith('@brewflow.cl')) {
            return res.status(400).json({ message: 'Acceso denegado: utilice un correo perteneciente al dominio oficial @brewflow.cl' });
        }

        const { rows } = await db.query(`
            SELECT 
                u.usuario_id,
                u.usuario_run,
                u.usuario_nombres,
                u.usuario_apellido_paterno,
                u.usuario_correo,
                u.usuario_estado_cuenta,
                u."usuario_contrasena" AS usuario_contrasena,
                u.rol_id,
                r.rol_nombre::text AS rol_nombre
            FROM public.usuario u
            JOIN public.rol r ON r.rol_id = u.rol_id
            WHERE LOWER(u.usuario_correo) = $1
        `, [correo]);

        const user = rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        if (user.usuario_estado_cuenta !== 'activo') {
            return res.status(403).json({ message: 'Cuenta inactiva. Contacte al administrador.' });
        }

        const storedPassword = user.usuario_contrasena;
        const passwordOk = typeof storedPassword === 'string' && storedPassword.startsWith('$2')
            ? await bcrypt.compare(usuario_contrasena, storedPassword)
            : usuario_contrasena === storedPassword;

        if (!passwordOk) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            {
                id: user.usuario_id,
                rol_id: user.rol_id,
                rol_nombre: user.rol_nombre
            },
            process.env.JWT_SECRET || 'brewflow_dev_secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
        );

        return res.json({
            token,
            rol: user.rol_id,
            rol_nombre: user.rol_nombre,
            usuario: {
                id: user.usuario_id,
                correo: user.usuario_correo,
                nombres: user.usuario_nombres,
                apellido_paterno: user.usuario_apellido_paterno,
                estado: user.usuario_estado_cuenta
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const logout = async (req, res) => {
    return res.json({ message: 'Sesión cerrada correctamente' });
};

module.exports = { login, logout };
