import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { roleLabels, initials } from '../utils.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <motion.header
      className="sticky top-0 z-20 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
          <Store size={20} />
        </span>
        <span className="text-lg font-bold">Store Rating</span>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
            <p className="max-w-[220px] truncate text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-indigo-200">{roleLabels[user.role]}</p>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-500/40 text-sm font-bold">
            {initials(user.name)}
          </span>
          <motion.button whileTap={{ scale: 0.95 }} className="btn-ghost" onClick={handleLogout}>
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
