const db = require('../db');

const obtenerUnidades = async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT 
                unidad_medida_id,
                unidad_medida_codigo,
                unidad_medida_nombre,
                unidad_medida_clasificacion,
                unidad_medida_estado
            FROM public.unidad_medida_personalizada
            ORDER BY unidad_medida_nombre ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener unidades de medida', error: error.message });
    }
};

const crearUnidad = async (req, res) => {
    const { codigo, nombre, clasificacion } = req.body;
    const clasificaciones = ['masa', 'volumen', 'unidad', 'contenedor', 'otro'];

    if (!codigo || !nombre || !clasificacion) {
        return res.status(400).json({ message: 'Debe indicar código, nombre y clasificación' });
    }

    const codigoLimpio = codigo.trim().toLowerCase();
    const nombreLimpio = nombre.trim();

    if (!codigoLimpio || !nombreLimpio) {
        return res.status(400).json({ message: 'Código y nombre no pueden quedar vacíos' });
    }

    if (!clasificaciones.includes(clasificacion)) {
        return res.status(400).json({ message: 'Clasificación no válida' });
    }

    try {
        const { rows: duplicadas } = await db.query(`
            SELECT unidad_medida_id, unidad_medida_codigo, unidad_medida_nombre
            FROM public.unidad_medida_personalizada
            WHERE LOWER(TRIM(unidad_medida_codigo)) = LOWER($1)
               OR LOWER(TRIM(unidad_medida_nombre)) = LOWER($2)
            LIMIT 1
        `, [codigoLimpio, nombreLimpio]);

        if (duplicadas.length > 0) {
            const duplicada = duplicadas[0];

            if (duplicada.unidad_medida_codigo.toLowerCase() === codigoLimpio) {
                return res.status(400).json({ message: 'Ya existe una unidad con ese código' });
            }

            return res.status(400).json({ message: 'Ya existe una unidad con ese nombre' });
        }

        const { rows } = await db.query(`
            INSERT INTO public.unidad_medida_personalizada
            (unidad_medida_codigo, unidad_medida_nombre, unidad_medida_clasificacion)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [codigoLimpio, nombreLimpio, clasificacion]);

        res.status(201).json({
            message: 'Unidad de medida registrada correctamente',
            unidad: rows[0]
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Ya existe una unidad de medida con esos datos' });
        }

        res.status(500).json({
            message: 'Error al registrar unidad de medida',
            error: error.message
        });
    }
};

const cambiarEstadoUnidad = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    if (!['activo', 'inactivo'].includes(estado)) return res.status(400).json({ message: 'Estado no válido' });

    try {
        const result = await db.query(
            'UPDATE public.unidad_medida_personalizada SET unidad_medida_estado = $1 WHERE unidad_medida_id = $2',
            [estado, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ message: 'Unidad no encontrada' });
        res.json({ message: 'Estado de unidad actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar unidad', error: error.message });
    }
};

module.exports = { obtenerUnidades, crearUnidad, cambiarEstadoUnidad };
