-- =============================================================
-- 2. Tipos enumerados
-- =============================================================

CREATE TYPE public.usuario_estado_enum AS ENUM (
    'activo',
    'inactivo'
);

CREATE TYPE public.rol_nombre_enum AS ENUM (
    'admin',
    'operador_inventario',
    'encargado_rrhh',
    'supervisor',
    'colaborador',
    'mesero',
    'cocina',
    'caja'
);

CREATE TYPE public.unidad_medida_enum AS ENUM (
    'kg',
    'g',
    'litro',
    'ml',
    'unidad'
);

CREATE TYPE public.mesa_estado_enum AS ENUM (
    'disponible',
    'ocupada',
    'reservada',
    'inactiva'
);

CREATE TYPE public.pedido_estado_enum AS ENUM (
    'pendiente',
    'en_preparacion',
    'listo',
    'entregado',
    'cancelado'
);

CREATE TYPE public.pago_estado_enum AS ENUM (
    'pendiente',
    'pagado',
    'anulado'
);

CREATE TYPE public.pago_metodo_enum AS ENUM (
    'efectivo',
    'tarjeta',
    'transferencia'
);

CREATE TYPE public.merma_motivo_enum AS ENUM (
    'vencimiento',
    'derrame',
    'error_preparacion',
    'otro'
);
