# Ingenieria_de_software-Grupo19
Esta versión implementa en código el alcance desde UR 1.1 hasta UR 4.3 del Documento 0.

1. Requisitos implementados
UR 1.1: login con correo institucional @brewflow.cl, contraseña, verificación contra PostgreSQL y estado activo antes de permitir acceso.
UR 1.2: perfiles diferenciados: admin, operador_inventario, encargado_rrhh, supervisor y colaborador, con middleware de permisos por rol.
UR 2.1: registro de unidades de medida personalizadas con identificador único y clasificación.
UR 2.2: registro de proveedores con identificación, contacto y condiciones comerciales, evitando duplicidad por RUT.
UR 2.3: gestión de ubicaciones físicas jerárquicas de bodega: zona, estante, nivel y posición.
UR 3.1: registro de productos perecibles con código único, nombre, categoría, unidad de medida y estado activo/inactivo.
UR 3.2: asociación producto-lote-proveedor mediante integridad referencial.
UR 3.3: registro de lotes por producto, fecha de ingreso, vencimiento y cantidad disponible.
UR 4.1: validación de fecha de vencimiento válida.
UR 4.2: registro de ingreso de stock con producto, cantidad, lote, proveedor y fecha.
UR 4.3: registro de salidas por venta, consumo interno, merma, descarte o ajuste.
2. Instalación
Restaurar primero brewflow.sql en PostgreSQL.
Revisar el archivo .env:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=12345
DB_NAME=brewflow_db
JWT_SECRET=brewflow_dev_secret
PORT=8080
Instalar dependencias y ejecutar:
npm install
npm start
Abrir:
http://localhost:8080/v_login.html
Usuario inicial de pruebas:

Correo: carlos@brewflow.cl
Contraseña: 1234
Rol: admin
3. Pantallas principales
v_login.html: inicio de sesión.
v_dashboard.html: resumen operativo.
v_usuarios.html: usuarios y perfiles.
v_unidades.html: unidades de medida personalizadas.
v_proveedores.html: proveedores.
v_ubicaciones.html: ubicaciones jerárquicas de bodega.
v_productos.html: productos perecibles.
v_lotes.html: registro y consulta de lotes.
v_ingresos.html: ingreso de stock.
v_salidas.html: salida de stock.
v_movimientos.html: historial de ingresos y salidas.
v_salon.html: visualización de mesas.
4. Orden sugerido para probar la demo
Iniciar sesión con carlos@brewflow.cl / 1234.
Registrar una unidad de medida, por ejemplo barril.
Registrar un proveedor nuevo.
Crear una ubicación de bodega.
Registrar un producto perecible activo.
Registrar un ingreso de stock indicando producto, cantidad, lote, proveedor y fecha.
Verificar que el producto aumenta su stock en el dashboard o en productos.
Registrar una salida de stock por venta, merma, descarte o consumo interno.
Revisar el historial de movimientos.
Crear un usuario con rol operador_inventario, cerrar sesión y probar que puede acceder a inventario pero no a gestión de usuarios.
5. Verificación directa en PostgreSQL
Algunas consultas útiles:

SELECT * FROM public.unidad_medida_personalizada ORDER BY unidad_medida_id DESC;
SELECT * FROM public.proveedor ORDER BY proveedor_id DESC;
SELECT * FROM public.ubicacion_bodega ORDER BY ubicacion_id DESC;
SELECT producto_codigo, producto_nombre, producto_stock_actual FROM public.producto ORDER BY producto_id DESC;
SELECT lote_codigo, producto_id, proveedor_id, lote_cantidad_disponible FROM public.lote ORDER BY lote_id DESC;
SELECT movimiento_tipo, movimiento_motivo, movimiento_cantidad, producto_id, lote_id FROM public.movimiento_stock ORDER BY movimiento_id DESC;

6. Video del proyecto
El motivo de subirlo en youtube fue por el peso del archivo y como grupo se decidio subir el link en este apartado

https://youtu.be/Mbi93V0dH_k
