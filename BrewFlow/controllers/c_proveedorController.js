const db = require('../db');

const normalizarRut = (rut) => String(rut || '')
    .trim()
    .replace(/\./g, '')
    .replace(/\s+/g, '')
    .toUpperCase();

const tieneFormatoRutValido = (rut) => /^\d{7,8}-[0-9K]$/.test(normalizarRut(rut));

const tieneFormatoCorreoValido = (correo) => {
    if (!correo) return true; // El correo de contacto es opcional.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo).trim().toLowerCase());
};

const crearProveedor = async (req, res) => {
    const {
        rut,
        nombre,
        contacto_nom = null,
        contacto_tel = null,
        contacto_correo = null,
        condiciones_comerciales = null
    } = req.body;

    if (!rut || !nombre) {
        return res.status(400).json({ message: 'Debe indicar RUT y nombre del proveedor' });
    }

    const rutLimpio = normalizarRut(rut);
    const nombreLimpio = nombre.trim();
    const correoLimpio = contacto_correo ? contacto_correo.trim().toLowerCase() : null;

    if (!nombreLimpio) {
        return res.status(400).json({ message: 'El nombre del proveedor no puede quedar vacío' });
    }

    if (!tieneFormatoRutValido(rutLimpio)) {
        return res.status(400).json({
            message: 'El RUT debe tener formato válido, por ejemplo 76543210-1 o 12345678-K'
        });
    }

    if (!tieneFormatoCorreoValido(correoLimpio)) {
        return res.status(400).json({ message: 'El correo de contacto no tiene un formato válido' });
    }

    try {
        const { rows: existenteRows } = await db.query(
            'SELECT proveedor_id FROM public.proveedor WHERE LOWER(proveedor_rut) = LOWER($1)',
            [rutLimpio]
        );
        if (existenteRows.length > 0) {
            return res.status(400).json({ message: 'El proveedor ya se encuentra registrado con ese RUT' });
        }

        const { rows } = await db.query(`
            INSERT INTO public.proveedor (
                proveedor_rut,
                proveedor_nombre,
                proveedor_nombre_contacto,
                proveedor_telefono_contacto,
                proveedor_correo_contacto,
                proveedor_condiciones_comerciales
            ) VALUES ($1, $2, $3, $4, LOWER($5), $6)
            RETURNING *
        `, [rutLimpio, nombreLimpio, contacto_nom, contacto_tel, correoLimpio, condiciones_comerciales]);

        res.status(201).json({ message: 'Proveedor registrado correctamente', proveedor: rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar proveedor', error: error.message });
    }
};

const obtenerProveedores = async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT 
                pr.proveedor_id,
                pr.proveedor_rut,
                pr.proveedor_nombre,
                pr.proveedor_nombre_contacto,
                pr.proveedor_telefono_contacto,
                pr.proveedor_correo_contacto,
                pr.proveedor_condiciones_comerciales,
                pr.proveedor_estado,
                COUNT(DISTINCT pp.producto_id)::int AS productos_asociados
            FROM public.proveedor pr
            LEFT JOIN public.producto_proveedor pp ON pp.proveedor_id = pr.proveedor_id AND pp.estado = 'activo'
            GROUP BY pr.proveedor_id
            ORDER BY pr.proveedor_nombre ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener proveedores', error: error.message });
    }
};

const cambiarEstadoProveedor = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    if (!['activo', 'inactivo'].includes(estado)) return res.status(400).json({ message: 'Estado no válido' });

    try {
        const result = await db.query('UPDATE public.proveedor SET proveedor_estado = $1 WHERE proveedor_id = $2', [estado, id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Proveedor no encontrado' });
        res.json({ message: 'Estado del proveedor actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar proveedor', error: error.message });
    }
};

const eliminarProveedor = async (req, res) => {
    req.body.estado = 'inactivo';
    return cambiarEstadoProveedor(req, res);
};

module.exports = { crearProveedor, obtenerProveedores, cambiarEstadoProveedor, eliminarProveedor };
