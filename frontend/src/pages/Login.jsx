import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';
import Field from '../components/Field.jsx';
import Message from '../components/Message.jsx';
import { homePath } from '../utils.js';

export default function Login() {
  const { user, saveLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // already logged in? go to your own page
  if (user) return <Navigate to={homePath(user.role)} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await api('/auth/login', { method: 'POST', body: { email, password } });
      saveLogin(data);
      navigate(homePath(data.user.role));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue">
      <form onSubmit={handleSubmit}>
        <Field label="Email">
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </Field>

        <Field label="Password">
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              className="input pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Field>

        <motion.button whileTap={{ scale: 0.98 }} className="btn-primary w-full">
          Login
        </motion.button>
      </form>

      <Message>{error}</Message>

      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{' '}
        <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
