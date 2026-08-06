const API_URL = 'https://brewflow-api-666030731246.us-central1.run.app';
const token = localStorage.getItem('brewflow_token');
const rolNombre = localStorage.getItem('brewflow_rol_nombre') || '';
const usuarioNombre = localStorage.getItem('brewflow_usuario') || 'Usuario';

if (!token && !location.pathname.endsWith('/v_login.html')) {
    window.location.href = 'v_login.html';
}

const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
const jsonHeaders = token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' };

function cerrarSesion() {
    localStorage.removeItem('brewflow_token');
    localStorage.removeItem('brewflow_rol');
    localStorage.removeItem('brewflow_rol_nombre');
    localStorage.removeItem('brewflow_usuario');
    window.location.href = 'v_login.html';
}

function formatoFecha(valor) {
    if (!valor) return '-';
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? valor : fecha.toLocaleDateString('es-CL');
}

function formatoNumero(valor) {
    const numero = Number(valor || 0);
    return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(numero);
}

function setMensaje(id, texto, ok = true) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = texto;
    el.className = `mb-4 p-3 rounded text-sm border ${ok ? 'bg-green-900/40 border-green-600 text-green-100' : 'bg-red-900/40 border-red-600 text-red-100'}`;
    el.classList.remove('hidden');
}

function buildApiUrl(url) {
    if (/^https?:\/\//i.test(url)) {
        return url;
    }
    if (url.startsWith('/api')) {
        return `${API_URL}${url}`;
    }
    return url;
}

async function api(url, options = {}) {
    const response = await fetch(buildApiUrl(url), options);
    let data = null;
    try { data = await response.json(); } catch (e) { data = null; }
    if (response.status === 401 || response.status === 403) {
        if (data?.message) alert(data.message);
        if (response.status === 401) cerrarSesion();
    }
    if (!response.ok) throw new Error(data?.message || 'Error en la operación');
    return data;
}

function navHtml(titulo) {
    return `
    <aside class="w-72 min-h-screen bg-gray-950 border-r border-gray-800 p-5 fixed left-0 top-0 hidden lg:block">
        <h1 class="text-2xl font-bold text-amber-500">BrewFlow</h1>
        <p class="text-xs text-gray-400 mt-1">Incremento 1 · UR 1.1 a UR 4.3</p>
        <div class="mt-5 p-3 bg-gray-900 rounded border border-gray-800 text-sm text-gray-300">
            <div class="font-semibold text-white">${usuarioNombre}</div>
            <div class="uppercase text-xs text-amber-400 mt-1">${rolNombre || 'rol no informado'}</div>
        </div>
        <nav class="mt-6 space-y-1 text-sm">
            ${link('v_dashboard.html','Dashboard', titulo)}
            ${link('v_usuarios.html','Usuarios y roles', titulo)}
            ${link('v_unidades.html','Unidades de medida', titulo)}
            ${link('v_proveedores.html','Proveedores', titulo)}
            ${link('v_ubicaciones.html','Ubicaciones bodega', titulo)}
            ${link('v_productos.html','Productos perecibles', titulo)}
            ${link('v_lotes.html','Lotes', titulo)}
            ${link('v_ingresos.html','Ingresos de stock', titulo)}
            ${link('v_salidas.html','Salidas de stock', titulo)}
            ${link('v_movimientos.html','Historial movimientos', titulo)}
            ${link('v_salon.html','Salón / Mesas', titulo)}
        </nav>
        <button onclick="cerrarSesion()" class="mt-6 w-full bg-red-600 hover:bg-red-700 text-white rounded px-3 py-2">Cerrar sesión</button>
    </aside>
    <header class="lg:hidden bg-gray-950 border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-10">
        <span class="font-bold text-amber-500">BrewFlow</span>
        <button onclick="cerrarSesion()" class="text-sm bg-red-600 text-white rounded px-3 py-1">Salir</button>
    </header>`;
}

function link(href, texto, titulo) {
    const active = location.pathname.endsWith('/' + href) || texto === titulo;
    return `<a class="block px-3 py-2 rounded ${active ? 'bg-amber-500 text-gray-950 font-semibold' : 'text-gray-300 hover:bg-gray-900 hover:text-white'}" href="${href}">${texto}</a>`;
}

function montarLayout(titulo, subtitulo = '') {
    document.body.insertAdjacentHTML('afterbegin', navHtml(titulo));
    const main = document.getElementById('main');
    if (main) {
        main.insertAdjacentHTML('afterbegin', `<div class="mb-6"><h2 class="text-3xl font-bold text-white">${titulo}</h2><p class="text-gray-400 mt-1">${subtitulo}</p></div>`);
    }
}
