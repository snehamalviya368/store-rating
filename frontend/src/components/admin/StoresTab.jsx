import { useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import { api, toQuery } from '../../api.js';
import useSort from '../../hooks/useSort.js';
import SortableTable from '../SortableTable.jsx';
import SearchInput from '../SearchInput.jsx';
import Message from '../Message.jsx';
import { StarDisplay } from '../StarRating.jsx';

export default function StoresTab({ refresh }) {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [error, setError] = useState('');
  const { sort, order, toggleSort } = useSort('name');

  useEffect(() => {
    api('/admin/stores' + toQuery({ ...filters, sort, order }))
      .then(setStores)
      .catch((err) => setError(err.message));
  }, [filters, sort, order, refresh]);

  function handleFilter(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (s) => (
        <span className="flex items-center gap-3 font-semibold text-slate-900">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
            <Store size={18} />
          </span>
          {s.name}
        </span>
      ),
    },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'rating', label: 'Rating', render: (s) => <StarDisplay value={s.rating} /> },
  ];

  return (
    <>
      <section className="card mb-5 grid gap-3 sm:grid-cols-3">
        <SearchInput name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilter} />
        <SearchInput name="email" placeholder="Filter by email" value={filters.email} onChange={handleFilter} />
        <SearchInput name="address" placeholder="Filter by address" value={filters.address} onChange={handleFilter} />
      </section>

      <Message>{error}</Message>

      <section className="card mt-4">
        <SortableTable columns={columns} rows={stores} sort={sort} order={order} onSort={toggleSort} />
      </section>
    </>
  );
}
