const fs = require('fs').promises;
const path = require('path');

// Suppress console.error during tests (expected errors)
const originalConsoleError = console.error;
console.error = (...args) => {
  // Only suppress expected error logs from errorHandler
  if (args[0] === 'Error:') return;
  originalConsoleError(...args);
};

const DATA_DIR = path.join(__dirname, '../data');

// Backup of original data files
const backups = {};

// Data file paths
const dataFiles = {
  users: path.join(DATA_DIR, 'users.json'),
  carts: path.join(DATA_DIR, 'carts.json'),
  orders: path.join(DATA_DIR, 'orders.json'),
  todos: path.join(DATA_DIR, 'todos.json')
};

// Read JSON file safely
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

// Write JSON file
async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Backup all data files before tests
async function backupDataFiles() {
  for (const [name, filePath] of Object.entries(dataFiles)) {
    backups[name] = await readJsonFile(filePath);
  }
}

// Restore all data files after tests
async function restoreDataFiles() {
  for (const [name, filePath] of Object.entries(dataFiles)) {
    if (backups[name] !== undefined) {
      await writeJsonFile(filePath, backups[name]);
    }
  }
}

// Reset data files to empty state
async function resetDataFiles() {
  await writeJsonFile(dataFiles.users, {});
  await writeJsonFile(dataFiles.carts, {});
  await writeJsonFile(dataFiles.orders, {});
  await writeJsonFile(dataFiles.todos, {});
}

// Setup before all tests
beforeAll(async () => {
  await backupDataFiles();
});

// Cleanup after all tests
afterAll(async () => {
  await restoreDataFiles();
});

// Reset data before each test
beforeEach(async () => {
  await resetDataFiles();
});

module.exports = {
  dataFiles,
  readJsonFile,
  writeJsonFile,
  resetDataFiles
};
