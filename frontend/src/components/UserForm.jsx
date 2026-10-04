import { useState } from 'react';
import { motion } from 'framer-motion';
import { checkName, checkEmail, checkAddress, checkPassword, collectErrors } from '../validation.js';
import { roleLabels } from '../utils.js';
import Field from './Field.jsx';
import Message from './Message.jsx';

const emptyForm = { name: '', email: '', address: '', password: '', role: 'user' };

// Used for the signup page and for the admin "Add user" form.
// onSubmit(values) should throw an Error if saving fails.
export default function UserForm({ onSubmit, buttonText, showRole = false, successText = '' }) {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(false);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    const foundErrors = collectErrors({
      name: checkName(values.name),
      email: checkEmail(values.email),
      address: checkAddress(values.address),
      password: checkPassword(values.password),
    });
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    try {
      await onSubmit(values);
      setValues(emptyForm);
      setMessageIsError(false);
      setMessage(successText);
    } catch (err) {
      setMessageIsError(true);
      setMessage(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Name (20 to 60 characters)" error={errors.name}>
        <input name="name" className="input" value={values.name} onChange={handleChange} />
      </Field>

      <Field label="Email" error={errors.email}>
        <input name="email" className="input" value={values.email} onChange={handleChange} />
      </Field>

      <Field label="Address (max 400 characters)" error={errors.address}>
        <textarea name="address" rows="3" className="input" value={values.address} onChange={handleChange} />
      </Field>

      <Field label="Password (8-16 characters, one capital letter, one special character)" error={errors.password}>
        <input name="password" type="password" className="input" value={values.password} onChange={handleChange} />
      </Field>

      {showRole && (
        <Field label="Role">
          <select name="role" className="input" value={values.role} onChange={handleChange}>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </Field>
      )}

      <motion.button whileTap={{ scale: 0.98 }} className="btn-primary w-full">
        {buttonText}
      </motion.button>
      <Message type={messageIsError ? 'error' : 'success'}>{message}</Message>
    </form>
  );
}
