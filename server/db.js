import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const sqlConfig = {
  server: process.env.DB_HOST || 'MEHUL\\SQLEXPRESS',
  database: process.env.DB_NAME || 'meena_gruhudyog',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(sqlConfig);
const poolConnect = pool.connect();

export { pool, poolConnect, sqlConfig };
export default pool;
