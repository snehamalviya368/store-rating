import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// Shows stars (not clickable) plus the number
export function StarDisplay({ value }) {
  if (value === null || value === undefined) {
    return <span className="text-sm text-slate-400">No ratings yet</span>;
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={16}
            className={n <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
          />
        ))}
      </span>
      <span className="text-sm font-semibold text-slate-700">{value}</span>
    </span>
  );
}

// Clickable stars. value is 0 when nothing is chosen yet.
export function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const filled = hover || value;

  return (
    <div className="flex" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          type="button"
          aria-label={`${n} star`}
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.85 }}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="p-0.5"
        >
          <Star
            size={22}
            className={n <= filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
          />
        </motion.button>
      ))}
    </div>
  );
}
