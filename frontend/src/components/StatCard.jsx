import { useEffect, useState } from 'react';
import { animate, motion } from 'framer-motion';

const colors = {
  indigo: 'bg-indigo-100 text-indigo-600',
  amber: 'bg-amber-100 text-amber-600',
  emerald: 'bg-emerald-100 text-emerald-600',
};

// numbers count up from 0 when the card appears
function CountUp({ value }) {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.8,
      onUpdate: (latest) => setNumber(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <>{number}</>;
}

// Pass `value` for a number that counts up, or `text` for anything else
export default function StatCard({ icon: Icon, label, value, text, color = 'indigo', index = 0 }) {
  return (
    <motion.div
      className="card flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${colors[color]}`}>
        <Icon size={24} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="truncate text-2xl font-bold text-slate-900">
          {text !== undefined ? text : <CountUp value={value} />}
        </p>
      </div>
    </motion.div>
  );
}
