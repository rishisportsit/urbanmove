const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data.json');

// Default structure
const defaultData = {
  users: [],
  trips: [],
  events: [],
  vehicleData: {}
};

// Initialize file if not exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
}

// Read data
const readData = () => {
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading data file:', error);
    return defaultData;
  }
};

// Write data
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to data file:', error);
  }
};

// Proxied DB to handle automatic saves (simple version)
const db = readData();

// We need a way to trigger save, since in-memory arrays are modified directly.
// To keep it simple for the user, I'll provide a save method or wrap the arrays.
// But given the MVC structure, services call model methods, so models should call save.

db.save = () => writeData(db);

module.exports = db;
