import pool from './db.js';

// the columns we allow sorting on (never put user input straight into SQL)
const sortColumns = {
  name: 's.name',
  email: 's.email',
  address: 's.address',
  rating: 'rating',
};

// Gets stores with their average rating.
// filters: { name, email, address, sort, order } - all optional
export async function findStores({ name, email, address, sort, order }) {
  let sql = `
    SELECT s.id, s.name, s.email, s.address, ROUND(AVG(r.rating), 1) AS rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1 = 1`;
  const params = [];

  if (name) {
    sql += ' AND s.name LIKE ?';
    params.push(`%${name}%`);
  }
  if (email) {
    sql += ' AND s.email LIKE ?';
    params.push(`%${email}%`);
  }
  if (address) {
    sql += ' AND s.address LIKE ?';
    params.push(`%${address}%`);
  }

  const sortBy = sortColumns[sort] || 's.name';
  const direction = order === 'desc' ? 'DESC' : 'ASC';
  sql += ` GROUP BY s.id ORDER BY ${sortBy} ${direction}`;

  const [rows] = await pool.query(sql, params);
  return rows;
}
