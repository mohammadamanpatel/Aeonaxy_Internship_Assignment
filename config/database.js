const { Pool } = require('pg');

const dbConnect = () => {
    // Create a connection pool
    const pool = new Pool({
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        port: process.env.PGPORT,
        ssl: {
            rejectUnauthorized: false, // This option is required for self-signed certificates
            // Other SSL options can be configured here, such as:
            sslmode: 'require',
            // ca: fs.readFileSync('path/to/ca-certificate.crt'),
            // cert: fs.readFileSync('path/to/client-certificate.crt'),
            // key: fs.readFileSync('path/to/client-key.key'),
        },
    });

    // Test the connection
    pool.connect((err, client, release) => {
        if (err) {
            console.error('Error acquiring client', err.stack);
            return;
        }
        console.log('Connected to PostgreSQL database', client.host);
        release();
    });
}

module.exports = dbConnect;
