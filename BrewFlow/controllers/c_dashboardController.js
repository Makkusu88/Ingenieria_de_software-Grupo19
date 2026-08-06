const db = require('../db');

const obtenerMetricasDashboard = async (req, res) => {
    try {
        const { rows: productosActivos } = await db.query(
            "SELECT COUNT(*)::int AS total FROM public.producto WHERE producto_estado = 'activo'"
        );
        const { rows: unidades } = await db.query(
            "SELECT COUNT(*)::int AS total FROM public.unidad_medida_personalizada WHERE unidad_medida_estado = 'activo'"
        );
        const { rows: proveedores } = await db.query(
            "SELECT COUNT(*)::int AS total FROM public.proveedor WHERE proveedor_estado = 'activo'"
        );
        const { rows: ubicaciones } = await db.query(
            "SELECT COUNT(*)::int AS total FROM public.ubicacion_bodega WHERE ubicacion_estado = 'activo'"
        );
        const { rows: porVencer } = await db.query(
            "SELECT COUNT(*)::int AS total FROM public.lote WHERE lote_fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'"
        );
        const { rows: vencidos } = await db.query(
            'SELECT COUNT(*)::int AS total FROM public.lote WHERE lote_fecha_vencimiento < CURRENT_DATE'
        );
        const { rows: salidasMes } = await db.query(
            "SELECT COALESCE(SUM(movimiento_cantidad), 0)::numeric(12,2) AS total FROM public.movimiento_stock WHERE movimiento_tipo = 'salida' AND movimiento_fecha >= date_trunc('month', CURRENT_DATE)"
        );

        const { rows: existencias } = await db.query(`
            SELECT
                p.producto_id,
                p.producto_codigo,
                p.producto_nombre,
                p.producto_categoria,
                p.producto_estado,
                p.producto_stock_actual,
                u.unidad_medida_codigo,
                COUNT(l.lote_id)::int AS lotes_registrados,
                MIN(l.lote_fecha_vencimiento) AS proximo_vencimiento
            FROM public.producto p
            JOIN public.unidad_medida_personalizada u ON u.unidad_medida_id = p.producto_unidad_medida_id
            LEFT JOIN public.lote l ON l.producto_id = p.producto_id AND l.lote_cantidad_disponible > 0
            GROUP BY p.producto_id, u.unidad_medida_codigo
            ORDER BY p.producto_stock_actual ASC, p.producto_nombre ASC
        `);

        res.json({
            resumen: {
                productos_activos: productosActivos[0].total,
                unidades_activas: unidades[0].total,
                proveedores_activos: proveedores[0].total,
                ubicaciones_activas: ubicaciones[0].total,
                lotes_proximos_vencer: porVencer[0].total,
                lotes_vencidos: vencidos[0].total,
                salidas_mes: salidasMes[0].total
            },
            detalles: existencias
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar el dashboard', error: error.message });
    }
};

module.exports = { obtenerMetricasDashboard };
