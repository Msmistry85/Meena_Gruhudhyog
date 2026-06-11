import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_DB_PORT = 1433;
const {
  DB_HOST = 'localhost',
  DB_INSTANCE = '',
  DB_NAME = 'meena_gruhudyog',
  DB_DRIVER = 'msnodesqlv8',
  DB_TRUSTED_CONNECTION = 'true',
  DB_TRUST_SERVER_CERTIFICATE = 'true',
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
} = process.env;

const isTrustedConnection = DB_TRUSTED_CONNECTION !== 'false';
const trustServerCertificate = DB_TRUST_SERVER_CERTIFICATE !== 'false';
const parsedPort = DB_PORT ? parseInt(DB_PORT, 10) : DEFAULT_DB_PORT;
const DB_PORT_NUMBER = Number.isNaN(parsedPort) ? DEFAULT_DB_PORT : parsedPort;

const sql = DB_DRIVER === 'msnodesqlv8'
  ? (await import('mssql/msnodesqlv8.js')).default
  : (await import('mssql')).default;

const { server: serverName, instanceName, explicitPort } = parseDbHost(DB_HOST, DB_INSTANCE);

const sqlConfig = {
  server: serverName,
  database: DB_NAME,
  options: {
    trustedConnection: isTrustedConnection,
    trustServerCertificate,
  },
};

if (DB_DRIVER !== 'msnodesqlv8') {
  sqlConfig.driver = DB_DRIVER;
}

if (explicitPort) {
  sqlConfig.port = explicitPort;
} else if (DB_PORT_NUMBER) {
  sqlConfig.port = DB_PORT_NUMBER;
} else if (instanceName) {
  sqlConfig.options.instanceName = instanceName;
}

if (!isTrustedConnection) {
  if (DB_USER) sqlConfig.user = DB_USER;
  if (DB_PASSWORD) sqlConfig.password = DB_PASSWORD;
}

const pool = new sql.ConnectionPool(sqlConfig);
console.log('Connecting to SQL Server...');
console.log('SQL config:', {
  server: sqlConfig.server,
  instanceName: sqlConfig.options.instanceName,
  port: sqlConfig.port,
  database: sqlConfig.database,
  driver: sqlConfig.driver,
});

const poolConnect = pool.connect()
  .then(() => {
    console.log('✅ Connected to SQL Server');
    return pool;
  })
  .catch((err) => {
    console.warn('⚠️  Database connection failed:', err.message);
    console.log('📌 Note: Application will run without database functionality');
    return null;
  });

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

function parseDbHost(host, fallbackInstance) {
  let server = host;
  let instance = fallbackInstance || '';
  let explicitPort;

  if (server.includes('\\')) {
    const [name, maybeInstance] = server.split('\\');
    server = name;
    instance = maybeInstance || instance;
  }

  if (server.includes(',')) {
    const [name, portPart] = server.split(',');
    server = name;
    const parsed = parseInt(portPart, 10);
    if (!Number.isNaN(parsed)) {
      explicitPort = parsed;
    }
  }

  return { server, instanceName: instance, explicitPort };
}

export { poolConnect, sqlConfig };
export default poolConnect;
