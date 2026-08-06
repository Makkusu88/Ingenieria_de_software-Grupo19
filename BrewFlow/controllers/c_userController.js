const db = require('../db');
const bcrypt = require('bcryptjs');

const crearUsuario = async (req, res) => {
    const { run, nombres, ap_paterno, ap_materno = null, correo, contrasena, rol_id, estado = 'activo' } = req.body;

    if (!run || !nombres || !ap_paterno || !correo || !contrasena || !rol_id) {
        return res.status(400).json({ message: 'Debe completar RUN, nombres, apellido paterno, correo, contraseña y rol' });
    }

    if (!String(correo).toLowerCase().endsWith('@brewflow.cl')) {
        return res.status(400).json({ message: 'El correo debe pertenecer al dominio oficial @brewflow.cl' });
    }

    if (!['activo', 'inactivo'].includes(estado)) {
        return res.status(400).json({ message: 'El estado debe ser activo o inactivo' });
    }

    try {
        const { rows: rolRows } = await db.query('SELECT rol_id FROM public.rol WHERE rol_id = $1', [rol_id]);
        if (rolRows.length === 0) {
            return res.status(400).json({ message: 'El rol seleccionado no existe' });
        }

        const hash = await bcrypt.hash(contrasena, 10);
        const { rows } = await db.query(`
            INSERT INTO public.usuario (
                usuario_run,
                usuario_nombres,
                usuario_apellido_paterno,
                usuario_apellido_materno,
                usuario_correo,
                "usuario_contrasena",
                rol_id,
                usuario_estado_cuenta
            ) VALUES ($1, $2, $3, $4, LOWER($5), $6, $7, $8)
            RETURNING usuario_id, usuario_run, usuario_nombres, usuario_apellido_paterno, usuario_correo, usuario_estado_cuenta, rol_id
        `, [run.trim(), nombres.trim(), ap_paterno.trim(), ap_materno, correo.trim(), hash, rol_id, estado]);

        res.status(201).json({ message: 'Usuario creado exitosamente en PostgreSQL', usuario: rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El RUN o correo ya existe en el sistema' });
        }
        res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT 
                u.usuario_id,
                u.usuario_run,
                u.usuario_nombres,
                u.usuario_apellido_paterno,
                u.usuario_apellido_materno,
                u.usuario_correo,
                u.usuario_estado_cuenta,
                u.rol_id,
                r.rol_nombre::text AS rol_nombre
            FROM public.usuario u
            JOIN public.rol r ON u.rol_id = r.rol_id
            ORDER BY u.usuario_id DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};

const obtenerRoles = async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT rol_id, rol_nombre::text AS rol_nombre
            FROM public.rol
            ORDER BY rol_id ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener roles', error: error.message });
    }
};

const actualizarEstadoUsuario = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['activo', 'inactivo'].includes(estado)) {
        return res.status(400).json({ message: 'Estado no válido' });
    }

    try {
        const result = await db.query(
            'UPDATE public.usuario SET usuario_estado_cuenta = $1 WHERE usuario_id = $2',
            [estado, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: `Usuario marcado como ${estado}` });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar estado de usuario', error: error.message });
    }
};

const desbloquearUsuario = async (req, res) => {
    req.body.estado = 'activo';
    return actualizarEstadoUsuario(req, res);
};

module.exports = { crearUsuario, obtenerUsuarios, obtenerRoles, actualizarEstadoUsuario, desbloquearUsuario };
