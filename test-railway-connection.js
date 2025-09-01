import mysql from 'mysql2/promise';

// Test Railway MySQL connection
const testRailwayConnection = async () => {
    console.log('🧪 Testing Railway MySQL connection...');
    
    const dbConfig = {
        host: 'yamanote.proxy.rlwy.net',
        user: 'root',
        password: 'usATJlMlcXFdBQXItubknzxokYiUWcci',
        database: 'railway',
        port: 23022,
        connectTimeout: 10000,
        ssl: false
    };

    try {
        console.log('🔧 Connection config:', {
            host: dbConfig.host,
            user: dbConfig.user,
            database: dbConfig.database,
            port: dbConfig.port
        });

        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to Railway MySQL!');

        // Test basic query
        const [rows] = await connection.execute('SELECT 1 as test, NOW() as waktu_sekarang');
        console.log('✅ Test query successful:', rows[0]);

        // Test database info
        const [dbInfo] = await connection.execute('SELECT DATABASE() as nama_database, USER() as nama_user');
        console.log('✅ Database info:', dbInfo[0]);

        // Test if tables exist
        try {
            const [tables] = await connection.execute('SHOW TABLES');
            console.log('✅ Available tables:', tables.map(t => Object.values(t)[0]));
        } catch (tableError) {
            console.log('⚠️  Could not retrieve tables (database might be empty):', tableError.message);
        }

        await connection.end();
        console.log('✅ Connection closed successfully');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Tip: Check if MySQL service is running on Railway');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('💡 Tip: Check username/password credentials');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('💡 Tip: Check if database "railway" exists');
        } else if (error.code === 'ETIMEDOUT') {
            console.log('💡 Tip: Connection timeout - check network connectivity');
        } else if (error.code === 'ENOTFOUND') {
            console.log('💡 Tip: Host not found - check hostname spelling');
        } else {
            console.log('💡 Tip: Check Railway dashboard for service status');
        }
        
        console.error('Full error details:', error);
    }
};

// Run test
testRailwayConnection();
