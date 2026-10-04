import { motion } from 'framer-motion';
import { Star, Store } from 'lucide-react';

// The page layout shared by Login and Signup: colourful panel on the left, form on the right
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-14 text-white lg:flex lg:flex-col lg:justify-center">
        {/* soft circles that float slowly */}
        <motion.div
          className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/10"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-white/10"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/20">
            <Store size={30} />
          </span>
          <h1 className="text-5xl font-extrabold leading-tight">
            Rate the stores
            <br />
            you love.
          </h1>
          <p className="mt-4 max-w-md text-lg text-indigo-100">
            Find stores, share your rating from 1 to 5, and see what everyone else thinks.
          </p>

          <div className="mt-8 flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
              >
                <Star size={30} className="fill-amber-300 text-amber-300" />
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-6">
        <motion.div
          className="card w-full max-w-md bg-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
          <p className="mb-6 mt-1 text-sm text-slate-500">{subtitle}</p>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
