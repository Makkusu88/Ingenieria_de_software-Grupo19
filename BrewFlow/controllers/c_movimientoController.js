const db = require('../db');
const { registrarLote } = require('./c_loteController');

const registrarIngreso = async (req, res) => {
    return registrarLote(req, res);
};

const registrarSalida = async (req, res) => {
    const { lote_id, producto_id, cantidad, motivo, fecha = new Date().toISOString(), observacion = null } = req.body;
    const cantidadSalida = Number(cantidad);
    const motivosPermitidos = ['venta', 'consumo_interno', 'merma', 'descarte'];

    if (!lote_id || !producto_id || !cantidad || !motivo) {
        return res.status(400).json({ message: 'Debe indicar producto, lote, cantidad y motivo de salida' });
    }
    if (!motivosPermitidos.includes(motivo)) {
        return res.status(400).json({ message: 'Motivo de salida no válido' });
    }
    if (!Number.isFinite(cantidadSalida) || cantidadSalida <= 0) {
        return res.status(400).json({ message: 'La cantidad de salida debe ser mayor que cero' });
    }

    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const { rows: loteRows } = await client.query(`
            SELECT lote_id, producto_id, proveedor_id, lote_cantidad_disponible
            FROM public.lote
            WHERE lote_id = $1 AND producto_id = $2
            FOR UPDATE
        `, [lote_id, producto_id]);

        if (loteRows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'El lote no corresponde al producto seleccionado' });
        }

        const lote = loteRows[0];
        if (Number(lote.lote_cantidad_disponible) < cantidadSalida) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Stock insuficiente en el lote seleccionado' });
        }

        await client.query(
            'UPDATE public.lote SET lote_cantidad_disponible = lote_cantidad_disponible - $1 WHERE lote_id = $2',
            [cantidadSalida, lote_id]
        );

        await client.query(
            'UPDATE public.producto SET producto_stock_actual = GREATEST(producto_stock_actual - $1, 0) WHERE producto_id = $2',
            [cantidadSalida, producto_id]
        );

        const { rows } = await client.query(`
            INSERT INTO public.movimiento_stock
            (movimiento_tipo, movimiento_motivo, movimiento_fecha, movimiento_cantidad, movimiento_observacion, producto_id, lote_id, proveedor_id, usuario_id)
            VALUES ('salida', $1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING movimiento_id
        `, [motivo, fecha, cantidadSalida, observacion, producto_id, lote_id, lote.proveedor_id, req.user.id]);

        await client.query('COMMIT');
        res.status(201).json({ message: 'Salida de stock registrada correctamente', movimiento_id: rows[0].movimiento_id });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Error al registrar salida de stock', error: error.message });
    } finally {
        client.release();
    }
};

const obtenerMovimientos = async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT
                m.movimiento_id,
                m.movimiento_tipo,
                m.movimiento_motivo,
                m.movimiento_fecha,
                m.movimiento_cantidad,
                m.movimiento_observacion,
                p.producto_codigo,
                p.producto_nombre,
                l.lote_codigo,
                pr.proveedor_nombre,
                u.usuario_correo
            FROM public.movimiento_stock m
            JOIN public.producto p ON p.producto_id = m.producto_id
            LEFT JOIN public.lote l ON l.lote_id = m.lote_id
            LEFT JOIN public.proveedor pr ON pr.proveedor_id = m.proveedor_id
            LEFT JOIN public.usuario u ON u.usuario_id = m.usuario_id
            ORDER BY m.movimiento_fecha DESC, m.movimiento_id DESC
            LIMIT 100
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener movimientos', error: error.message });
    }
};

module.exports = { registrarIngreso, registrarSalida, obtenerMovimientos };
