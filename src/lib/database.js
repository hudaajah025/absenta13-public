// Database configuration for Railway MySQL
// Database configuration for Railway MySQL
const dbConfig = {
    host: 'yamanote.proxy.rlwy.net',
    user: 'root',
    password: 'usATJlMlcXFdBQXItubknzxokYiUWcci',
    database: 'railway',
    port: 23022,
    connectTimeout: 10000,
    reconnect: true,
    ssl: false
};

// Alternative configuration using environment variables
const getDbConfig = () => {
    return {
        host: process.env.MYSQLHOST || 'yamanote.proxy.rlwy.net',
        user: process.env.MYSQLUSER || 'root',
        password: process.env.MYSQLPASSWORD || 'usATJlMlcXFdBQXItubknzxokYiUWcci',
        database: process.env.MYSQLDATABASE || 'railway',
        port: process.env.MYSQLPORT || 23022,
        connectTimeout: 10000,
        reconnect: true,
        ssl: false
    };
};

export { dbConfig, getDbConfig };
