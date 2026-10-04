import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Store, Users, UserPlus, PlusSquare } from 'lucide-react';
import { api } from '../api.js';
import PageHeading from '../components/PageHeading.jsx';
import StatCard from '../components/StatCard.jsx';
import UsersTab from '../components/admin/UsersTab.jsx';
import StoresTab from '../components/admin/StoresTab.jsx';
import AddUserTab from '../components/admin/AddUserTab.jsx';
import AddStoreTab from '../components/admin/AddStoreTab.jsx';

const tabs = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'stores', label: 'Stores', icon: Store },
  { id: 'addUser', label: 'Add User', icon: UserPlus },
  { id: 'addStore', label: 'Add Store', icon: PlusSquare },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [tab, setTab] = useState('users');
  // this number goes up whenever something is added, so the lists and stats reload
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    api('/admin/stats').then(setStats).catch(() => {});
  }, [refresh]);

  function reload() {
    setRefresh(refresh + 1);
  }

  return (
    <>
      <PageHeading title="Admin Dashboard" subtitle="Manage users, stores and see the numbers at a glance." />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard index={0} icon={Users} label="Total users" value={stats.users} />
        <StatCard index={1} icon={Store} color="emerald" label="Total stores" value={stats.stores} />
        <StatCard index={2} icon={Star} color="amber" label="Total ratings" value={stats.ratings} />
      </div>

      <div className="my-6 inline-flex flex-wrap gap-1 rounded-2xl bg-white/70 p-1.5 shadow">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative rounded-xl px-4 py-2 text-sm font-semibold"
            >
              {active && (
                <motion.span
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative flex items-center gap-2 ${active ? 'text-white' : 'text-slate-600'}`}>
                <Icon size={16} />
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'users' && <UsersTab refresh={refresh} />}
          {tab === 'stores' && <StoresTab refresh={refresh} />}
          {tab === 'addUser' && <AddUserTab onAdded={reload} />}
          {tab === 'addStore' && <AddStoreTab onAdded={reload} />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
