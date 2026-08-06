-- =============================================================
-- 7. Datos iniciales para pruebas del Incremento 1
-- =============================================================

INSERT INTO public.rol (rol_id, rol_nombre) VALUES
    (1, 'admin'),
    (2, 'operador_inventario'),
    (3, 'encargado_rrhh'),
    (4, 'supervisor'),
    (5, 'colaborador'),
    (6, 'mesero'),
    (7, 'cocina'),
    (8, 'caja');

INSERT INTO public.usuario (
    usuario_id,
    usuario_run,
    usuario_apellido_paterno,
    usuario_apellido_materno,
    usuario_nombres,
    usuario_correo,
    usuario_estado_cuenta,
    usuario_contrasena,
    rol_id
) VALUES
    (1, '12345678-9', 'Gonzalez', 'Lopez', 'Carlos', 'carlos@brewflow.cl', 'activo', '1234', 1),
    (2, '98765432-1', 'Perez', 'Soto', 'Ana', 'ana@brewflow.cl', 'activo', '1234', 2),
    (3, '11111111-1', 'Ramirez', 'Diaz', 'Pedro', 'pedro@brewflow.cl', 'activo', '1234', 4),
    (4, '22222222-2', 'Morales', 'Rojas', 'Carla', 'carla@brewflow.cl', 'activo', '1234', 3),
    (5, '33333333-3', 'Fernandez', 'Silva', 'Luis', 'luis@brewflow.cl', 'activo', '1234', 5);

INSERT INTO public.unidad_medida_personalizada (
    unidad_medida_id,
    unidad_medida_codigo,
    unidad_medida_nombre,
    unidad_medida_clasificacion,
    unidad_medida_estado
) VALUES
    (1, 'kg', 'Kilogramo', 'masa', 'activo'),
    (2, 'g', 'Gramo', 'masa', 'activo'),
    (3, 'litro', 'Litro', 'volumen', 'activo'),
    (4, 'ml', 'Mililitro', 'volumen', 'activo'),
    (5, 'unidad', 'Unidad', 'unidad', 'activo'),
    (6, 'barril', 'Barril', 'contenedor', 'activo');

INSERT INTO public.proveedor (
    proveedor_id,
    proveedor_rut,
    proveedor_nombre,
    proveedor_nombre_contacto,
    proveedor_telefono_contacto,
    proveedor_correo_contacto,
    proveedor_condiciones_comerciales,
    proveedor_estado
) VALUES
    (1, '76543210-1', 'Insumos del Sur', 'Juan Mora', '+56911111111', 'juan@insumos.cl', 'Pago a 30 dias. Entrega semanal.', 'activo'),
    (2, '76543210-2', 'Malteria Central', 'Rosa Vega', '+56922222222', 'rosa@malteria.cl', 'Pago a 15 dias. Descuento por volumen.', 'activo'),
    (3, '76543210-3', 'Verduras Aculeo', 'Marta Soto', '+56933333333', 'contacto@verdurasaculeo.cl', 'Entrega segun temporada.', 'activo');

INSERT INTO public.ubicacion_bodega (
    ubicacion_id,
    ubicacion_codigo,
    ubicacion_nombre,
    ubicacion_tipo,
    ubicacion_padre_id,
    ubicacion_estado
) VALUES
    (1, 'ZONA-FRIA', 'Zona fria', 'zona', NULL, 'activo'),
    (2, 'ZONA-FRIA-EST-01', 'Estante refrigerado 1', 'estante', 1, 'activo'),
    (3, 'ZONA-FRIA-EST-01-N1', 'Nivel 1 refrigerado', 'nivel', 2, 'activo'),
    (4, 'ZONA-SECA', 'Zona seca', 'zona', NULL, 'activo'),
    (5, 'ZONA-SECA-EST-01', 'Estante seco 1', 'estante', 4, 'activo');

INSERT INTO public.producto (
    producto_id,
    producto_codigo,
    producto_nombre,
    producto_precio,
    producto_categoria,
    producto_estado,
    producto_unidad_medida_id,
    producto_stock_actual
) VALUES
    (1, 'PROD-IPA', 'Cerveza Artesanal IPA', 4500.00, 'Cerveza', 'activo', 3, 0),
    (2, 'PROD-STOUT', 'Cerveza Stout', 4200.00, 'Cerveza', 'activo', 3, 0),
    (3, 'PROD-HAMB-CLASICA', 'Hamburguesa Clasica', 8900.00, 'Comida', 'activo', 5, 0),
    (4, 'PROD-PAPAS', 'Papas Fritas', 3500.00, 'Comida', 'activo', 1, 0);

INSERT INTO public.insumo (
    insumo_id,
    insumo_nombre,
    insumo_stock_actual,
    insumo_stock_critico,
    insumo_unidad_medida,
    producto_id
) VALUES
    (1, 'Lupulo', 50, 10, 'kg', 1),
    (2, 'Malta', 100, 20, 'kg', 1),
    (3, 'Carne', 30, 5, 'kg', 3),
    (4, 'Papa', 40, 8, 'kg', 4);

INSERT INTO public.lote (
    lote_id,
    lote_codigo,
    lote_cantidad_ingresada,
    lote_cantidad_disponible,
    lote_fecha_recepcion,
    lote_fecha_vencimiento,
    producto_id,
    proveedor_id,
    ubicacion_id,
    insumo_id
) VALUES
    (1, 'LOTE-IPA-001', 100.00, 50.00, '2026-06-02', '2026-12-31', 1, 1, 3, 1),
    (2, 'LOTE-STOUT-001', 200.00, 100.00, '2026-06-02', '2026-12-31', 2, 2, 5, 2),
    (3, 'LOTE-HAMB-001', 30.00, 30.00, '2026-06-02', '2026-07-15', 3, 3, 3, 3),
    (4, 'LOTE-PAPAS-001', 40.00, 40.00, '2026-06-02', '2026-07-20', 4, 3, 3, 4);

UPDATE public.proveedor SET lote_id = 1 WHERE proveedor_id = 1;
UPDATE public.proveedor SET lote_id = 2 WHERE proveedor_id = 2;
UPDATE public.proveedor SET lote_id = 3 WHERE proveedor_id = 3;

INSERT INTO public.producto_proveedor (producto_id, proveedor_id, fecha_asociacion, estado) VALUES
    (1, 1, CURRENT_DATE, 'activo'),
    (2, 2, CURRENT_DATE, 'activo'),
    (3, 3, CURRENT_DATE, 'activo'),
    (4, 3, CURRENT_DATE, 'activo');

INSERT INTO public.movimiento_stock (
    movimiento_id,
    movimiento_tipo,
    movimiento_motivo,
    movimiento_fecha,
    movimiento_cantidad,
    movimiento_observacion,
    producto_id,
    lote_id,
    proveedor_id,
    usuario_id
) VALUES
    (1, 'ingreso', NULL, '2026-06-02 10:00:00', 50.00, 'Carga inicial de inventario', 1, 1, 1, 1),
    (2, 'ingreso', NULL, '2026-06-02 10:05:00', 100.00, 'Carga inicial de inventario', 2, 2, 2, 1),
    (3, 'ingreso', NULL, '2026-06-02 10:10:00', 30.00, 'Carga inicial de inventario', 3, 3, 3, 1),
    (4, 'ingreso', NULL, '2026-06-02 10:15:00', 40.00, 'Carga inicial de inventario', 4, 4, 3, 1);

UPDATE public.producto p
SET producto_stock_actual = COALESCE(x.stock, 0)
FROM (
    SELECT producto_id, SUM(lote_cantidad_disponible)::numeric(12,2) AS stock
    FROM public.lote
    GROUP BY producto_id
) x
WHERE p.producto_id = x.producto_id;

INSERT INTO public.merma (merma_id, merma_cantidad, merma_fecha, merma_motivo, merma_observacion, insumo_id) VALUES
    (1, 5, '2026-06-02', 'vencimiento', 'Lupulo vencido', 1),
    (2, 2, '2026-06-02', 'derrame', 'Derrame en bodega', 2);

INSERT INTO public.mesa (mesa_id, mesa_numero, mesa_estado, mesa_capacidad, usuario_id) VALUES
    (1, 1, 'disponible', 4, NULL),
    (2, 2, 'disponible', 4, NULL),
    (3, 3, 'disponible', 6, NULL),
    (4, 4, 'disponible', 2, NULL),
    (5, 5, 'disponible', 8, NULL);

INSERT INTO public.pedido (pedido_id, pedido_fecha_hora, pedido_estado, pedido_total_neto, mesa_id) VALUES
    (1, '2026-06-02 15:59:34', 'pendiente', 13400.00, 1),
    (2, '2026-06-02 16:10:00', 'entregado', 8900.00, 2);

INSERT INTO public.registro_pago (registro_pago_id, registro_pago_monto, registro_pago_metodo, registro_pago_estado_dte, pedido_id) VALUES
    (1, 13400.00, 'tarjeta', 'pagado', 1),
    (2, 8900.00, 'efectivo', 'pagado', 2);

INSERT INTO public.arqueo_caja (
    arqueo_caja_id,
    arqueo_caja_fecha_cierre,
    arqueo_caja_monto_esperado,
    arqueo_caja_monto_declarado,
    arqueo_caja_discrepancia_porcentual,
    registro_pago_id
) VALUES
    (1, '2026-06-02 16:00:20', 22300.00, 22300.00, 0.00, 1);
