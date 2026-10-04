import { Router } from 'express';
import pool from '../db.js';
import { wrap, requireLogin, requireRole } from '../middleware.js';

const router = Router();

router.use(requireLogin, requireRole('owner'));

const sortColumns = {
  name: 'u.name',
  email: 'u.email',
  rating: 'r.rating',
};

// Owner dashboard: average rating + who rated the store
router.get('/dashboard', wrap(async (req, res) => {
  const [stores] = await pool.query(
    'SELECT id, name, address FROM stores WHERE owner_id = ? ORDER BY id LIMIT 1',
    [req.user.id]
  );

  // owner exists but admin has not given them a store yet
  if (stores.length === 0) {
    return res.json({ store: null, average: null, ratings: [] });
  }

  const store = stores[0];

  const [[avg]] = await pool.query(
    'SELECT ROUND(AVG(rating), 1) AS average FROM ratings WHERE store_id = ?',
    [store.id]
  );

  const sortBy = sortColumns[req.query.sort] || 'u.name';
  const direction = req.query.order === 'desc' ? 'DESC' : 'ASC';

  const [ratings] = await pool.query(
    `SELECT u.id, u.name, u.email, r.rating
     FROM ratings r JOIN users u ON u.id = r.user_id
     WHERE r.store_id = ?
     ORDER BY ${sortBy} ${direction}`,
    [store.id]
  );

  res.json({ store, average: avg.average, ratings });
}));

export default router;
