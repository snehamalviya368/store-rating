import jwt from 'jsonwebtoken';

// wraps an async route so errors go to the error handler in server.js
export const wrap = (handler) => (req, res, next) => {
  handler(req, res, next).catch(next);
};

// user must be logged in
export function requireLogin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Please log in first.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
}

// user must have one of the given roles, e.g. requireRole('admin')
export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You are not allowed to do this.' });
  }
  next();
};
