// Same rules as the backend (backend/src/validate.js), so users see errors before submitting.
// Every function returns an error message, or '' if the value is fine.

export function checkName(name) {
  const length = name.trim().length;
  if (length < 20 || length > 60) return 'Name must be between 20 and 60 characters.';
  return '';
}

export function checkEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email.';
  return '';
}

export function checkAddress(address) {
  const length = address.trim().length;
  if (length === 0) return 'Address is required.';
  if (length > 400) return 'Address can be at most 400 characters.';
  return '';
}

export function checkPassword(password) {
  if (password.length < 8 || password.length > 16) return 'Password must be 8 to 16 characters.';
  if (!/[A-Z]/.test(password)) return 'Password needs at least one uppercase letter.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password needs at least one special character.';
  return '';
}

// Returns an object like { name: 'error text', password: 'error text' }.
// Only fields with a problem are included, so an empty object means all good.
export function collectErrors(checks) {
  const errors = {};
  Object.entries(checks).forEach(([field, message]) => {
    if (message) errors[field] = message;
  });
  return errors;
}
