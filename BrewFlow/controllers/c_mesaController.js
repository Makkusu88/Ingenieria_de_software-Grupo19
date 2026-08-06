const db = require('../db');

const obtenerMesas = async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM public.mesa ORDER BY mesa_numero ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener mesas" });
    }
};

const actualizarEstadoMesa = async (req, res) => {
    const { id } = req.params;
    const { nuevo_estado } = req.body; 
    const estadosPermitidos = ['disponible', 'ocupada', 'reservada', 'inactiva']; 

    if (!estadosPermitidos.includes(nuevo_estado)) {
        return res.status(400).json({ message: "Estado no válido" });
    }

    try {
        await db.query(
            'UPDATE public.mesa SET mesa_estado = $1, usuario_id = $2 WHERE mesa_id = $3',
            [nuevo_estado, req.user.id, id]
        );
        res.json({ message: "Mesa actualizada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error en la base de datos" });
    }
};

module.exports = { obtenerMesas, actualizarEstadoMesa };