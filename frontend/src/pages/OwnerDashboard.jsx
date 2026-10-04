import { useEffect, useState } from 'react';
import { Star, Store, Users } from 'lucide-react';
import { api, toQuery } from '../api.js';
import useSort from '../hooks/useSort.js';
import PageHeading from '../components/PageHeading.jsx';
import StatCard from '../components/StatCard.jsx';
import SortableTable from '../components/SortableTable.jsx';
import ChangePassword from '../components/ChangePassword.jsx';
import Message from '../components/Message.jsx';
import { StarDisplay } from '../components/StarRating.jsx';

export default function OwnerDashboard() {
  const [data, setData] = useState({ store: null, average: null, ratings: [] });
  const [error, setError] = useState('');
  const { sort, order, toggleSort } = useSort('name');

  useEffect(() => {
    api('/owner/dashboard' + toQuery({ sort, order }))
      .then(setData)
      .catch((err) => setError(err.message));
  }, [sort, order]);

  const columns = [
    { key: 'name', label: 'User Name', render: (r) => <span className="font-semibold text-slate-900">{r.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'rating', label: 'Rating given', render: (r) => <StarDisplay value={r.rating} /> },
  ];

  return (
    <>
      <PageHeading title="Store Owner Dashboard" subtitle="See how people are rating your store." />
      <Message>{error}</Message>

      {!data.store && !error && (
        <section className="card text-slate-600">
          No store has been assigned to you yet. Please ask the administrator.
        </section>
      )}

      {data.store && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard index={0} icon={Store} label="Your store" text={data.store.name} />
            <StatCard
              index={1}
              icon={Star}
              color="amber"
              label="Average rating"
              text={data.average === null ? '—' : `${data.average} / 5`}
            />
            <StatCard index={2} icon={Users} color="emerald" label="Total ratings" value={data.ratings.length} />
          </div>

          <section className="card mt-6">
            <h3 className="mb-3 text-lg font-bold">Users who rated your store</h3>
            <SortableTable columns={columns} rows={data.ratings} sort={sort} order={order} onSort={toggleSort} />
          </section>
        </>
      )}

      <ChangePassword />
    </>
  );
}
