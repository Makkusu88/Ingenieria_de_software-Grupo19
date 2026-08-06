const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL
// Se recomienda usar variables de entorno por seguridad (.env)
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'brewflow_db',
    max: 10
});

// Verificación de conexión inicial (útil para logs de despliegue)
pool.connect()
    .then(client => {
        console.log('Conexión exitosa a la base de datos BrewFlow (PostgreSQL)');
        client.release();
    })
    .catch(err => {
        console.error('Error conectando a la base de datos:', err.message);
    });

module.exports = pool;
