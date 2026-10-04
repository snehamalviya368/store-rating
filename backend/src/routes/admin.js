import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { wrap, requireLogin, requireRole } from '../middleware.js';
import { findStores } from '../storeQueries.js';
import { checkNewUser, checkName, checkEmail, checkAddress } from '../validate.js';

const router = Router();

// everything in this file is for admins only
router.use(requireLogin, requireRole('admin'));

const userSortColumns = ['name', 'email', 'address', 'role'];
const roles = ['admin', 'user', 'owner'];

// Dashboard numbers
router.get('/stats', wrap(async (req, res) => {
  const [[users]] = await pool.query('SELECT COUNT(*) AS total FROM users');
  const [[stores]] = await pool.query('SELECT COUNT(*) AS total FROM stores');
  const [[ratings]] = await pool.query('SELECT COUNT(*) AS total FROM ratings');
  res.json({ users: users.total, stores: stores.total, ratings: ratings.total });
}));

// List of users with filters and sorting
router.get('/users', wrap(async (req, res) => {
  const { name, email, address, role, sort, order } = req.query;

  let sql = 'SELECT id, name, email, address, role FROM users WHERE 1 = 1';
  const params = [];

  if (name) {
    sql += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  if (email) {
    sql += ' AND email LIKE ?';
    params.push(`%${email}%`);
  }
  if (address) {
    sql += ' AND address LIKE ?';
    params.push(`%${address}%`);
  }
  if (role) {
    sql += ' AND role = ?';
    params.push(role);
  }

  const sortBy = userSortColumns.includes(sort) ? sort : 'name';
  const direction = order === 'desc' ? 'DESC' : 'ASC';
  sql += ` ORDER BY ${sortBy} ${direction}`;

  const [rows] = await pool.query(sql, params);
  res.json(rows);
}));

// Details of one user. For a store owner we also send the rating of their store.
router.get('/users/:id', wrap(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, address, role FROM users WHERE id = ?',
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });

  const user = rows[0];

  if (user.role === 'owner') {
    const [[result]] = await pool.query(
      `SELECT ROUND(AVG(r.rating), 1) AS rating
       FROM stores s JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = ?`,
      [user.id]
    );
    user.rating = result.rating; // null if nobody rated yet
  }

  res.json(user);
}));

// Add a user (normal user, admin or store owner)
router.post('/users', wrap(async (req, res) => {
  const error = checkNewUser(req.body);
  if (error) return res.status(400).json({ message: error });
  if (!roles.includes(req.body.role)) {
    return res.status(400).json({ message: 'Please choose a valid role.' });
  }

  const hash = await bcrypt.hash(req.body.password, 10);

  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [
        req.body.name.trim(),
        req.body.email.trim().toLowerCase(),
        hash,
        req.body.address.trim(),
        req.body.role,
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'User added.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This email is already registered.' });
    }
    throw err;
  }
}));

// List of stores with filters and sorting
router.get('/stores', wrap(async (req, res) => {
  res.json(await findStores(req.query));
}));

// Add a store
router.post('/stores', wrap(async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  const error = checkName(name) || checkEmail(email) || checkAddress(address);
  if (error) return res.status(400).json({ message: error });

  // if an owner was chosen, make sure that user really is a store owner
  if (ownerId) {
    const [owners] = await pool.query("SELECT id FROM users WHERE id = ? AND role = 'owner'", [ownerId]);
    if (owners.length === 0) {
      return res.status(400).json({ message: 'Selected owner is not a store owner.' });
    }
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), address.trim(), ownerId || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Store added.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A store with this email already exists.' });
    }
    throw err;
  }
}));

export default router;
