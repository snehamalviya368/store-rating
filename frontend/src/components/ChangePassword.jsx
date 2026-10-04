import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import { api } from '../api.js';
import { checkPassword } from '../validation.js';
import Message from './Message.jsx';

export default function ChangePassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const error = checkPassword(password);
    if (error) {
      setIsError(true);
      setMessage(error);
      return;
    }

    try {
      const data = await api('/auth/password', { method: 'PUT', body: { password } });
      setIsError(false);
      setMessage(data.message);
      setPassword('');
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  }

  return (
    <section className="card mt-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <KeyRound size={20} className="text-indigo-600" /> Change password
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="password"
          className="input"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <motion.button whileTap={{ scale: 0.97 }} className="btn-primary sm:w-40">
          Update
        </motion.button>
      </form>
      <Message type={isError ? 'error' : 'success'}>{message}</Message>
    </section>
  );
}
