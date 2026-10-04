import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// type is 'error' (red) or 'success' (green). Shows nothing if there is no text.
export default function Message({ type = 'error', children }) {
  if (!children) return null;
  const isError = type === 'error';

  return (
    <motion.p
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
        isError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      {children}
    </motion.p>
  );
}
