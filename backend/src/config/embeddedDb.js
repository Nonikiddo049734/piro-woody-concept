const epModule = require('embedded-postgres');
const EmbeddedPostgres = epModule.default || epModule;
const net = require('net');
const path = require('path');
const fs = require('fs');

/**
 * Checks if a port is open and listening.
 */
function isPortOpen(port = 5432, host = 'localhost') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1500);

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
}

let pgInstance = null;

/**
 * Initializes and starts local PostgreSQL if port 5432 is not already active.
 */
async function ensurePostgresRunning() {
  const isOpen = await isPortOpen(5432, 'localhost');
  if (isOpen) {
    console.log('[Database] PostgreSQL is already active and listening on port 5432.');
    return null;
  }

  console.log('[Database] Starting local PostgreSQL on port 5432...');
  const dataDir = path.resolve(__dirname, '../../.data/postgres');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  try {
    pgInstance = new EmbeddedPostgres({
      port: 5432,
      databaseDir: dataDir,
      user: 'postgres',
      password: 'postgres',
      initialDatabase: 'pirowoody',
      persistent: true,
      initdbFlags: ['-E', 'UTF8', '--locale=C'],
    });

    const isInitialized = fs.existsSync(path.join(dataDir, 'PG_VERSION'));
    if (!isInitialized) {
      await pgInstance.initialise();
    }
    await pgInstance.start();
    
    // Ensure the database 'pirowoody' exists
    try {
      await pgInstance.createDatabase('pirowoody');
    } catch (e) {
      // Database might already exist, ignore
    }

    console.log('[Database] Local PostgreSQL successfully started on port 5432 (database: pirowoody).');
    return pgInstance;
  } catch (err) {
    console.error('[Database] Failed to start embedded PostgreSQL:', err.message);
    throw err;
  }
}

async function stopPostgres() {
  if (pgInstance) {
    console.log('[Database] Stopping local PostgreSQL...');
    await pgInstance.stop();
    pgInstance = null;
  }
}

module.exports = {
  isPortOpen,
  ensurePostgresRunning,
  stopPostgres,
};

if (require.main === module) {
  ensurePostgresRunning()
    .then(() => {
      console.log('PostgreSQL ready. Press Ctrl+C to exit.');
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
