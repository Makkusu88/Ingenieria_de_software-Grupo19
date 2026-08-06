const db = require('../db');

const obtenerLotes = async (req, res) => {
    const productoId = req.query.producto_id;
    const params = [];
    let filtro = '';
    if (productoId) {
        params.push(productoId);
        filtro = 'WHERE l.producto_id = $1';
    }

    try {
        const { rows } = await db.query(`
            SELECT
                l.lote_id,
                l.lote_codigo,
                l.lote_cantidad_ingresada,
                l.lote_cantidad_disponible,
                l.lote_fecha_recepcion,
                l.lote_fecha_vencimiento,
                l.producto_id,
                p.producto_codigo,
                p.producto_nombre,
                p.producto_categoria,
                p.producto_unidad_medida_id,
                um.unidad_medida_codigo,
                l.proveedor_id,
                pr.proveedor_nombre,
                l.ubicacion_id,
                ub.ubicacion_codigo,
                ub.ubicacion_nombre,
                CASE
                    WHEN l.lote_fecha_vencimiento < CURRENT_DATE THEN 'vencido'
                    WHEN l.lote_fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' THEN 'por_vencer'
                    ELSE 'vigente'
                END AS estado_vencimiento
            FROM public.lote l
            LEFT JOIN public.producto p ON p.producto_id = l.producto_id
            LEFT JOIN public.unidad_medida_personalizada um ON um.unidad_medida_id = p.producto_unidad_medida_id
            LEFT JOIN public.proveedor pr ON pr.proveedor_id = l.proveedor_id
            LEFT JOIN public.ubicacion_bodega ub ON ub.ubicacion_id = l.ubicacion_id
            ${filtro}
            ORDER BY l.lote_fecha_vencimiento ASC NULLS LAST, l.lote_id DESC
        `, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener lotes', error: error.message });
    }
};

const registrarLote = async (req, res) => {
    const {
        lote_codigo,
        producto_id,
        proveedor_id,
        ubicacion_id = null,
        cantidad_ingresada,
        fecha_recepcion,
        fecha_vencimiento,
        observacion = null
    } = req.body;
    const cantidad = Number(cantidad_ingresada);

    if (!lote_codigo || !producto_id || !proveedor_id || !fecha_recepcion || !fecha_vencimiento) {
        return res.status(400).json({ message: 'Debe indicar lote, producto, proveedor, fecha de ingreso y fecha de vencimiento' });
    }
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
        return res.status(400).json({ message: 'La cantidad ingresada debe ser mayor que cero' });
    }

    const fIngreso = new Date(fecha_recepcion);
    const fVencimiento = new Date(fecha_vencimiento);
    if (Number.isNaN(fIngreso.getTime()) || Number.isNaN(fVencimiento.getTime())) {
        return res.status(400).json({ message: 'Formato de fecha no válido' });
    }
    if (fVencimiento <= fIngreso) {
        return res.status(400).json({ message: 'La fecha de vencimiento debe ser posterior a la fecha de ingreso' });
    }

    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const { rows: prodRows } = await client.query(
            "SELECT producto_id FROM public.producto WHERE producto_id = $1 AND producto_estado = 'activo' FOR UPDATE",
            [producto_id]
        );
        if (prodRows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'El producto seleccionado no existe o está inactivo' });
        }

        const { rows: provRows } = await client.query(
            "SELECT proveedor_id FROM public.proveedor WHERE proveedor_id = $1 AND proveedor_estado = 'activo'",
            [proveedor_id]
        );
        if (provRows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'El proveedor seleccionado no existe o está inactivo' });
        }

        if (ubicacion_id) {
            const { rows: ubiRows } = await client.query(
                "SELECT ubicacion_id FROM public.ubicacion_bodega WHERE ubicacion_id = $1 AND ubicacion_estado = 'activo'",
                [ubicacion_id]
            );
            if (ubiRows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'La ubicación seleccionada no existe o está inactiva' });
            }
        }

        const { rows } = await client.query(`
            INSERT INTO public.lote
            (lote_codigo, lote_cantidad_ingresada, lote_cantidad_disponible, lote_fecha_recepcion, lote_fecha_vencimiento, producto_id, proveedor_id, ubicacion_id, insumo_id)
            VALUES (UPPER($1), $2, $2, $3, $4, $5, $6, $7, NULL)
            RETURNING lote_id, lote_codigo
        `, [lote_codigo.trim(), cantidad, fecha_recepcion, fecha_vencimiento, producto_id, proveedor_id, ubicacion_id || null]);

        await client.query(`
            INSERT INTO public.producto_proveedor (producto_id, proveedor_id)
            VALUES ($1, $2)
            ON CONFLICT (producto_id, proveedor_id) DO UPDATE SET estado = 'activo', fecha_asociacion = CURRENT_DATE
        `, [producto_id, proveedor_id]);

        await client.query(
            'UPDATE public.producto SET producto_stock_actual = producto_stock_actual + $1 WHERE producto_id = $2',
            [cantidad, producto_id]
        );

        await client.query(`
            INSERT INTO public.movimiento_stock
            (movimiento_tipo, movimiento_fecha, movimiento_cantidad, movimiento_observacion, producto_id, lote_id, proveedor_id, usuario_id)
            VALUES ('ingreso', $1, $2, $3, $4, $5, $6, $7)
        `, [fecha_recepcion, cantidad, observacion, producto_id, rows[0].lote_id, proveedor_id, req.user.id]);

        await client.query('COMMIT');
        res.status(201).json({ message: 'Lote registrado, proveedor asociado y stock actualizado', lote: rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        if (error.code === '23505') return res.status(400).json({ message: 'Ya existe un lote con ese código' });
        res.status(500).json({ message: 'Error al registrar lote', error: error.message });
    } finally {
        client.release();
    }
};

module.exports = { obtenerLotes, registrarLote };
