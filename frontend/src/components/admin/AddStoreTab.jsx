import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../api.js';
import { checkName, checkEmail, checkAddress, collectErrors } from '../../validation.js';
import Field from '../Field.jsx';
import Message from '../Message.jsx';

const emptyForm = { name: '', email: '', address: '', ownerId: '' };

export default function AddStoreTab({ onAdded }) {
  const [values, setValues] = useState(emptyForm);
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageIsError, setMessageIsError] = useState(false);

  // the owner dropdown only needs users with the owner role
  useEffect(() => {
    api('/admin/users?role=owner').then(setOwners).catch(() => {});
  }, []);

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
    });
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    try {
      await api('/admin/stores', { method: 'POST', body: values });
      setValues(emptyForm);
      setMessageIsError(false);
      setMessage('Store added.');
      onAdded();
    } catch (err) {
      setMessageIsError(true);
      setMessage(err.message);
    }
  }

  return (
    <section className="card max-w-xl">
      <h3 className="mb-4 text-lg font-bold">Add a new store</h3>
      <form onSubmit={handleSubmit}>
        <Field label="Store name (20 to 60 characters)" error={errors.name}>
          <input name="name" className="input" value={values.name} onChange={handleChange} />
        </Field>

        <Field label="Store email" error={errors.email}>
          <input name="email" className="input" value={values.email} onChange={handleChange} />
        </Field>

        <Field label="Address (max 400 characters)" error={errors.address}>
          <textarea name="address" rows="3" className="input" value={values.address} onChange={handleChange} />
        </Field>

        <Field label="Store owner (optional)">
          <select name="ownerId" className="input" value={values.ownerId} onChange={handleChange}>
            <option value="">No owner yet</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
            ))}
          </select>
        </Field>

        <motion.button whileTap={{ scale: 0.98 }} className="btn-primary w-full">
          Add store
        </motion.button>
        <Message type={messageIsError ? 'error' : 'success'}>{message}</Message>
      </form>
    </section>
  );
}
