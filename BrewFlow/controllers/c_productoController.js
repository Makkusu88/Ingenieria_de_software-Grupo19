const db = require('../db');

const obtenerProductos = async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT
                p.producto_id,
                p.producto_codigo,
                p.producto_nombre,
                p.producto_precio,
                p.producto_categoria,
                p.producto_estado,
                p.producto_stock_actual,
                p.producto_unidad_medida_id,
                u.unidad_medida_codigo,
                u.unidad_medida_nombre,
                u.unidad_medida_clasificacion,
                COUNT(DISTINCT pp.proveedor_id)::int AS proveedores_asociados
            FROM public.producto p
            JOIN public.unidad_medida_personalizada u ON u.unidad_medida_id = p.producto_unidad_medida_id
            LEFT JOIN public.producto_proveedor pp ON pp.producto_id = p.producto_id AND pp.estado = 'activo'
            GROUP BY p.producto_id, u.unidad_medida_id
            ORDER BY p.producto_nombre ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

const crearProducto = async (req, res) => {
    const {
        codigo,
        nombre,
        categoria,
        unidad_medida_id,
        estado = 'activo',
        precio = 0
    } = req.body;

    if (!codigo || !nombre || !categoria || !unidad_medida_id) {
        return res.status(400).json({ message: 'Debe indicar código, nombre, categoría y unidad de medida' });
    }
    if (!['activo', 'inactivo'].includes(estado)) {
        return res.status(400).json({ message: 'Estado de producto no válido' });
    }
    if (Number(precio) < 0) {
        return res.status(400).json({ message: 'El precio no puede ser negativo' });
    }

    try {
        const { rows: unidadRows } = await db.query(
            "SELECT unidad_medida_id FROM public.unidad_medida_personalizada WHERE unidad_medida_id = $1 AND unidad_medida_estado = 'activo'",
            [unidad_medida_id]
        );
        if (unidadRows.length === 0) return res.status(400).json({ message: 'La unidad de medida seleccionada no existe o está inactiva' });

        const { rows } = await db.query(`
            INSERT INTO public.producto
            (producto_codigo, producto_nombre, producto_precio, producto_categoria, producto_estado, producto_unidad_medida_id)
            VALUES (UPPER($1), $2, $3, $4, $5, $6)
            RETURNING *
        `, [codigo.trim(), nombre.trim(), Number(precio), categoria.trim(), estado, unidad_medida_id]);

        res.status(201).json({ message: 'Producto perecible registrado correctamente', producto: rows[0] });
    } catch (error) {
        if (error.code === '23505') return res.status(400).json({ message: 'Ya existe un producto con ese código' });
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};

const cambiarEstadoProducto = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    if (!['activo', 'inactivo'].includes(estado)) return res.status(400).json({ message: 'Estado no válido' });

    try {
        const result = await db.query('UPDATE public.producto SET producto_estado = $1 WHERE producto_id = $2', [estado, id]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ message: 'Estado del producto actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
};

module.exports = { obtenerProductos, crearProducto, cambiarEstadoProducto };
