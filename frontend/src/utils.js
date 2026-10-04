export const roleLabels = {
  admin: 'System Administrator',
  user: 'Normal User',
  owner: 'Store Owner',
};

// where each role lands after login
export function homePath(role) {
  if (role === 'admin') return '/admin';
  if (role === 'owner') return '/owner';
  return '/stores';
}

// "Sneha Devendra Malviya" -> "SD"
export function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}
