import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { wrap, requireLogin } from '../middleware.js';
import { checkNewUser, checkPassword } from '../validate.js';

const router = Router();

function makeToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// Normal users sign up here. They always get the "user" role.
router.post('/signup', wrap(async (req, res) => {
  const error = checkNewUser(req.body);
  if (error) return res.status(400).json({ message: error });

  const name = req.body.name.trim();
  const email = req.body.email.trim().toLowerCase();
  const address = req.body.address.trim();
  const hash = await bcrypt.hash(req.body.password, 10);

  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, address, 'user']
    );
    const user = { id: result.insertId, name, email, role: 'user' };
    res.status(201).json({ token: makeToken(user), user });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This email is already registered.' });
    }
    throw err;
  }
}));

// Same login for every role
router.post('/login', wrap(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const found = rows[0];

  if (!found || !(await bcrypt.compare(password, found.password))) {
    return res.status(401).json({ message: 'Wrong email or password.' });
  }

  const user = { id: found.id, name: found.name, email: found.email, role: found.role };
  res.json({ token: makeToken(user), user });
}));

// Any logged in user can change their own password
router.put('/password', requireLogin, wrap(async (req, res) => {
  const error = checkPassword(req.body.password);
  if (error) return res.status(400).json({ message: error });

  const hash = await bcrypt.hash(req.body.password, 10);
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, req.user.id]);
  res.json({ message: 'Password updated.' });
}));

export default router;
