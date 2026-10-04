// Creates the first admin account so you can log in.
// Run once:  npm run seed
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pool from './src/db.js';

const admin = {
  name: 'System Administrator Account',
  email: 'admin@example.com',
  password: 'Admin@123',
  address: 'Head Office',
};

const [found] = await pool.query('SELECT id FROM users WHERE email = ?', [admin.email]);

if (found.length > 0) {
  console.log('Admin already exists. Nothing to do.');
} else {
  const hash = await bcrypt.hash(admin.password, 10);
  await pool.query(
    'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
    [admin.name, admin.email, hash, admin.address, 'admin']
  );
  console.log(`Admin created -> email: ${admin.email}  password: ${admin.password}`);
}

await pool.end();
