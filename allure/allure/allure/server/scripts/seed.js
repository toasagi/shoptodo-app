/**
 * Seed script to initialize default users
 * Run: node server/scripts/seed.js
 */

const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

const DATA_DIR = path.join(__dirname, '../data');

async function seed() {
  console.log('Seeding database...');

  // Create demo user with hashed password
  const demoPassword = 'password';
  const passwordHash = await bcrypt.hash(demoPassword, config.bcrypt.saltRounds);

  const demoUser = {
    id: uuidv4(),
    username: 'demo',
    email: 'demo@example.com',
    passwordHash,
    profile: {
      displayName: 'Demo User',
      phone: '',
      paymentMethod: ''
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Read existing users
  const usersFile = path.join(DATA_DIR, 'users.json');
  let users = {};

  try {
    const data = await fs.readFile(usersFile, 'utf8');
    users = JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is empty, start fresh
  }

  // Check if demo user already exists
  const existingDemo = Object.values(users).find(u => u.username === 'demo');
  if (existingDemo) {
    console.log('Demo user already exists, updating password hash...');
    users[existingDemo.id] = {
      ...existingDemo,
      passwordHash,
      updatedAt: new Date().toISOString()
    };
  } else {
    console.log('Creating demo user...');
    users[demoUser.id] = demoUser;
  }

  // Write users file
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf8');
  console.log('Demo user created/updated successfully!');
  console.log('  Username: demo');
  console.log('  Password: password');

  // Ensure other data files exist
  const dataFiles = ['carts.json', 'orders.json', 'todos.json'];
  for (const file of dataFiles) {
    const filePath = path.join(DATA_DIR, file);
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, '{}', 'utf8');
      console.log(`Created ${file}`);
    }
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
