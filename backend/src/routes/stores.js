import { Router } from 'express';
import pool from '../db.js';
import { wrap, requireLogin, requireRole } from '../middleware.js';
import { findStores } from '../storeQueries.js';

const router = Router();

// only normal users use these routes
router.use(requireLogin, requireRole('user'));

// All stores, with the rating this user gave (if any)
router.get('/', wrap(async (req, res) => {
  const { name, address, sort, order } = req.query;
  const stores = await findStores({ name, address, sort, order });

  const [myRatings] = await pool.query(
    'SELECT store_id, rating FROM ratings WHERE user_id = ?',
    [req.user.id]
  );
  const ratingByStore = {};
  myRatings.forEach((r) => {
    ratingByStore[r.store_id] = r.rating;
  });

  const result = stores.map((store) => ({
    ...store,
    userRating: ratingByStore[store.id] || null,
  }));

  res.json(result);
}));

// Give a rating, or change the old one
router.post('/:id/rating', wrap(async (req, res) => {
  const rating = Number(req.body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be a number from 1 to 5.' });
  }

  const [stores] = await pool.query('SELECT id FROM stores WHERE id = ?', [req.params.id]);
  if (stores.length === 0) return res.status(404).json({ message: 'Store not found.' });

  // if this user already rated this store, just update the number
  await pool.query(
    `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
    [req.user.id, req.params.id, rating]
  );

  res.json({ message: 'Rating saved.' });
}));

export default router;
