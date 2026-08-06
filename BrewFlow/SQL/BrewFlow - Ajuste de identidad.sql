-- =============================================================
-- 8. Ajuste de secuencias identity después de insertar datos explícitos
-- =============================================================

SELECT setval(pg_get_serial_sequence('public.rol', 'rol_id'), COALESCE((SELECT MAX(rol_id) FROM public.rol), 1), true);
SELECT setval(pg_get_serial_sequence('public.usuario', 'usuario_id'), COALESCE((SELECT MAX(usuario_id) FROM public.usuario), 1), true);
SELECT setval(pg_get_serial_sequence('public.unidad_medida_personalizada', 'unidad_medida_id'), COALESCE((SELECT MAX(unidad_medida_id) FROM public.unidad_medida_personalizada), 1), true);
SELECT setval(pg_get_serial_sequence('public.proveedor', 'proveedor_id'), COALESCE((SELECT MAX(proveedor_id) FROM public.proveedor), 1), true);
SELECT setval(pg_get_serial_sequence('public.ubicacion_bodega', 'ubicacion_id'), COALESCE((SELECT MAX(ubicacion_id) FROM public.ubicacion_bodega), 1), true);
SELECT setval(pg_get_serial_sequence('public.producto', 'producto_id'), COALESCE((SELECT MAX(producto_id) FROM public.producto), 1), true);
SELECT setval(pg_get_serial_sequence('public.insumo', 'insumo_id'), COALESCE((SELECT MAX(insumo_id) FROM public.insumo), 1), true);
SELECT setval(pg_get_serial_sequence('public.lote', 'lote_id'), COALESCE((SELECT MAX(lote_id) FROM public.lote), 1), true);
SELECT setval(pg_get_serial_sequence('public.movimiento_stock', 'movimiento_id'), COALESCE((SELECT MAX(movimiento_id) FROM public.movimiento_stock), 1), true);
SELECT setval(pg_get_serial_sequence('public.merma', 'merma_id'), COALESCE((SELECT MAX(merma_id) FROM public.merma), 1), true);
SELECT setval(pg_get_serial_sequence('public.receta', 'receta_id'), COALESCE((SELECT MAX(receta_id) FROM public.receta), 1), true);
SELECT setval(pg_get_serial_sequence('public.mesa', 'mesa_id'), COALESCE((SELECT MAX(mesa_id) FROM public.mesa), 1), true);
SELECT setval(pg_get_serial_sequence('public.pedido', 'pedido_id'), COALESCE((SELECT MAX(pedido_id) FROM public.pedido), 1), true);
SELECT setval(pg_get_serial_sequence('public.registro_pago', 'registro_pago_id'), COALESCE((SELECT MAX(registro_pago_id) FROM public.registro_pago), 1), true);
SELECT setval(pg_get_serial_sequence('public.arqueo_caja', 'arqueo_caja_id'), COALESCE((SELECT MAX(arqueo_caja_id) FROM public.arqueo_caja), 1), true);

COMMIT;

-- =============================================================
-- Credenciales de prueba
--   Correo:     carlos@brewflow.cl
--   Contraseña: 1234
-- =============================================================
