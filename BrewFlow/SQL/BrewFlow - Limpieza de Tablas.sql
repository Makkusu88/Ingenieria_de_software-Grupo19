BEGIN;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = public;

-- =============================================================
-- 1. Limpieza de objetos existentes
-- =============================================================

DROP TABLE IF EXISTS public.arqueo_caja CASCADE;
DROP TABLE IF EXISTS public.registro_pago CASCADE;
DROP TABLE IF EXISTS public.detalle_pedido CASCADE;
DROP TABLE IF EXISTS public.pedido CASCADE;
DROP TABLE IF EXISTS public.mesa CASCADE;
DROP TABLE IF EXISTS public.merma CASCADE;
DROP TABLE IF EXISTS public.movimiento_stock CASCADE;
DROP TABLE IF EXISTS public.producto_proveedor CASCADE;
DROP TABLE IF EXISTS public.lote CASCADE;
DROP TABLE IF EXISTS public.insumo CASCADE;
DROP TABLE IF EXISTS public.receta CASCADE;
DROP TABLE IF EXISTS public.producto CASCADE;
DROP TABLE IF EXISTS public.ubicacion_bodega CASCADE;
DROP TABLE IF EXISTS public.proveedor CASCADE;
DROP TABLE IF EXISTS public.unidad_medida_personalizada CASCADE;
DROP TABLE IF EXISTS public.usuario CASCADE;
DROP TABLE IF EXISTS public.rol CASCADE;

DROP TYPE IF EXISTS public.merma_motivo_enum CASCADE;
DROP TYPE IF EXISTS public.mesa_estado_enum CASCADE;
DROP TYPE IF EXISTS public.pago_estado_enum CASCADE;
DROP TYPE IF EXISTS public.pago_metodo_enum CASCADE;
DROP TYPE IF EXISTS public.pedido_estado_enum CASCADE;
DROP TYPE IF EXISTS public.rol_nombre_enum CASCADE;
DROP TYPE IF EXISTS public.unidad_medida_enum CASCADE;
DROP TYPE IF EXISTS public.usuario_estado_enum CASCADE;