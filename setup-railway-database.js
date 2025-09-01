import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Railway MySQL configuration
const dbConfig = {
    host: 'yamanote.proxy.rlwy.net',
    user: 'root',
    password: 'usATJlMlcXFdBQXItubknzxokYiUWcci',
    database: 'railway',
    port: 23022,
    connectTimeout: 30000,
    ssl: false
};

const setupRailwayDatabase = async () => {
    console.log('🚀 Setting up Railway MySQL database for ABSENTA 13...');
    
    let connection;
    
    try {
        // Connect to Railway MySQL
        console.log('🔌 Connecting to Railway MySQL...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to Railway MySQL successfully!');

        // Read SQL file
        const sqlFilePath = path.join(process.cwd(), 'absenta13.sql');
        console.log('📖 Reading SQL file:', sqlFilePath);
        
        if (!fs.existsSync(sqlFilePath)) {
            throw new Error('SQL file not found. Please ensure absenta13.sql exists in the project root.');
        }

        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
        console.log('📄 SQL file loaded successfully');

        // Split SQL into individual statements
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`🔧 Found ${statements.length} SQL statements to execute`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    console.log(`📝 Executing statement ${i + 1}/${statements.length}...`);
                    await connection.execute(statement);
                    console.log(`✅ Statement ${i + 1} executed successfully`);
                } catch (error) {
                    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
                        console.log(`⚠️  Table already exists, skipping...`);
                    } else if (error.code === 'ER_DUP_ENTRY') {
                        console.log(`⚠️  Duplicate entry, skipping...`);
                    } else {
                        console.error(`❌ Error executing statement ${i + 1}:`, error.message);
                        // Continue with other statements
                    }
                }
            }
        }

        // Verify tables were created
        console.log('🔍 Verifying database setup...');
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📊 Available tables:', tables.map(t => Object.values(t)[0]));

        // Test basic queries
        console.log('🧪 Testing basic functionality...');
        
        // Test users table
        const [userCount] = await connection.execute('SELECT COUNT(*) as jumlah FROM users');
        console.log(`👥 Users table: ${userCount[0].jumlah} records`);

        // Test guru table
        const [guruCount] = await connection.execute('SELECT COUNT(*) as jumlah FROM guru');
        console.log(`👨‍🏫 Guru table: ${guruCount[0].jumlah} records`);

        // Test siswa_perwakilan table
        const [siswaCount] = await connection.execute('SELECT COUNT(*) as jumlah FROM siswa_perwakilan');
        console.log(`👨‍🎓 Siswa table: ${siswaCount[0].jumlah} records`);

        console.log('🎉 Railway database setup completed successfully!');
        console.log('🚀 You can now start the application with: npm run start:modern');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Tip: Make sure MySQL service is running on Railway');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('💡 Tip: Check username/password credentials');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('💡 Tip: Database "railway" might not exist yet');
        }
        
        console.error('Full error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
};

// Run setup
setupRailwayDatabase();
