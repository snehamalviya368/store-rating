// All the form rules from the assessment live here.
// Each function returns an error message, or '' if everything is fine.

export function checkName(name) {
  const length = String(name || '').trim().length;
  if (length < 20 || length > 60) return 'Name must be between 20 and 60 characters.';
  return '';
}

export function checkEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())) {
    return 'Please enter a valid email.';
  }
  return '';
}

export function checkAddress(address) {
  const length = String(address || '').trim().length;
  if (length === 0) return 'Address is required.';
  if (length > 400) return 'Address can be at most 400 characters.';
  return '';
}

export function checkPassword(password) {
  const p = String(password || '');
  if (p.length < 8 || p.length > 16) return 'Password must be 8 to 16 characters.';
  if (!/[A-Z]/.test(p)) return 'Password needs at least one uppercase letter.';
  if (!/[^A-Za-z0-9]/.test(p)) return 'Password needs at least one special character.';
  return '';
}

// Checks name, email, address and password together. Returns the first error found.
export function checkNewUser({ name, email, address, password }) {
  return checkName(name) || checkEmail(email) || checkAddress(address) || checkPassword(password);
}
