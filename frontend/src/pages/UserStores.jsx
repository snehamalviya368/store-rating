import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import { api, toQuery } from '../api.js';
import useSort from '../hooks/useSort.js';
import PageHeading from '../components/PageHeading.jsx';
import SearchInput from '../components/SearchInput.jsx';
import SortableTable from '../components/SortableTable.jsx';
import ChangePassword from '../components/ChangePassword.jsx';
import Message from '../components/Message.jsx';
import { StarDisplay, StarInput } from '../components/StarRating.jsx';

// The stars + button in the last column of each store row
function RatingAction({ store, onSave }) {
  const [value, setValue] = useState(store.userRating || 0);

  return (
    <div className="flex items-center gap-3">
      <StarInput value={value} onChange={setValue} />
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="btn-soft px-3 py-1.5"
        disabled={!value || value === store.userRating}
        onClick={() => onSave(store.id, value)}
      >
        {store.userRating ? 'Modify' : 'Submit'}
      </motion.button>
    </div>
  );
}

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const { sort, order, toggleSort } = useSort('name');

  async function loadStores() {
    try {
      setStores(await api('/stores' + toQuery({ ...search, sort, order })));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadStores();
  }, [search, sort, order]);

  async function saveRating(storeId, rating) {
    try {
      await api(`/stores/${storeId}/rating`, { method: 'POST', body: { rating } });
      setNotice('Your rating was saved.');
      setTimeout(() => setNotice(''), 2500);
      loadStores();
    } catch (err) {
      setError(err.message);
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Store Name',
      render: (s) => (
        <span className="flex items-center gap-3 font-semibold text-slate-900">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
            <Store size={18} />
          </span>
          {s.name}
        </span>
      ),
    },
    { key: 'address', label: 'Address' },
    { key: 'rating', label: 'Overall Rating', render: (s) => <StarDisplay value={s.rating} /> },
    {
      key: 'userRating',
      label: 'Your Rating',
      sortable: false,
      render: (s) =>
        s.userRating ? <StarDisplay value={s.userRating} /> : <span className="text-slate-400">Not rated</span>,
    },
    {
      key: 'action',
      label: 'Rate this store',
      sortable: false,
      render: (s) => <RatingAction store={s} onSave={saveRating} />,
    },
  ];

  return (
    <>
      <PageHeading title="Stores" subtitle="Search for a store and give it a rating from 1 to 5." />

      <section className="card mb-5 grid gap-3 sm:grid-cols-2">
        <SearchInput
          placeholder="Search by store name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <SearchInput
          placeholder="Search by address"
          value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })}
        />
      </section>

      <Message>{error}</Message>
      <Message type="success">{notice}</Message>

      <section className="card mt-4">
        <SortableTable columns={columns} rows={stores} sort={sort} order={order} onSort={toggleSort} />
      </section>

      <ChangePassword />
    </>
  );
}
