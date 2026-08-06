const db = require('../db');

const obtenerUbicaciones = async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT
                u.ubicacion_id,
                u.ubicacion_codigo,
                u.ubicacion_nombre,
                u.ubicacion_tipo,
                u.ubicacion_padre_id,
                padre.ubicacion_nombre AS ubicacion_padre_nombre,
                u.ubicacion_estado
            FROM public.ubicacion_bodega u
            LEFT JOIN public.ubicacion_bodega padre ON padre.ubicacion_id = u.ubicacion_padre_id
            ORDER BY u.ubicacion_tipo ASC, u.ubicacion_codigo ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ubicaciones', error: error.message });
    }
};

const crearUbicacion = async (req, res) => {
    const { codigo, nombre, tipo, padre_id = null } = req.body;
    const tipos = ['zona', 'estante', 'nivel', 'posicion'];

    if (!codigo || !nombre || !tipo) {
        return res.status(400).json({ message: 'Debe indicar código, nombre y tipo de ubicación' });
    }

    const codigoLimpio = codigo.trim().toUpperCase();
    const nombreLimpio = nombre.trim();
    const padreIdNormalizado = padre_id ? Number(padre_id) : null;

    if (!codigoLimpio || !nombreLimpio) {
        return res.status(400).json({ message: 'Código y nombre de ubicación no pueden quedar vacíos' });
    }

    if (!tipos.includes(tipo)) {
        return res.status(400).json({ message: 'Tipo de ubicación no válido' });
    }

    if (padre_id && (!Number.isInteger(padreIdNormalizado) || padreIdNormalizado <= 0)) {
        return res.status(400).json({ message: 'La ubicación padre no tiene un identificador válido' });
    }

    try {
        if (padreIdNormalizado) {
            const { rows: padreRows } = await db.query(
                'SELECT ubicacion_id FROM public.ubicacion_bodega WHERE ubicacion_id = $1',
                [padreIdNormalizado]
            );

            if (padreRows.length === 0) {
                return res.status(400).json({ message: 'La ubicación padre no existe' });
            }
        }

        const { rows: duplicadas } = await db.query(`
            SELECT ubicacion_id
            FROM public.ubicacion_bodega
            WHERE LOWER(TRIM(ubicacion_nombre)) = LOWER($1)
              AND (
                    (ubicacion_padre_id IS NULL AND $2::integer IS NULL)
                    OR ubicacion_padre_id = $2::integer
                  )
            LIMIT 1
        `, [nombreLimpio, padreIdNormalizado]);

        if (duplicadas.length > 0) {
            return res.status(400).json({
                message: 'Ya existe una ubicación con ese nombre en el mismo nivel jerárquico'
            });
        }

        const { rows } = await db.query(`
            INSERT INTO public.ubicacion_bodega
            (ubicacion_codigo, ubicacion_nombre, ubicacion_tipo, ubicacion_padre_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [codigoLimpio, nombreLimpio, tipo, padreIdNormalizado]);

        res.status(201).json({
            message: 'Ubicación registrada correctamente',
            ubicacion: rows[0]
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Ya existe una ubicación con ese código' });
        }

        res.status(500).json({
            message: 'Error al registrar ubicación',
            error: error.message
        });
    }
};

const inactivarUbicacion = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("UPDATE public.ubicacion_bodega SET ubicacion_estado = 'inactivo' WHERE ubicacion_id = $1", [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Ubicación no encontrada' });
        res.json({ message: 'Ubicación inactivada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al inactivar ubicación', error: error.message });
    }
};

module.exports = { obtenerUbicaciones, crearUbicacion, inactivarUbicacion };
