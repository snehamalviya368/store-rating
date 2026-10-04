import { useEffect, useState } from 'react';
import { Eye, Mail, MapPin } from 'lucide-react';
import { api, toQuery } from '../../api.js';
import useSort from '../../hooks/useSort.js';
import SortableTable from '../SortableTable.jsx';
import SearchInput from '../SearchInput.jsx';
import Modal from '../Modal.jsx';
import Message from '../Message.jsx';
import RoleBadge from '../RoleBadge.jsx';
import { StarDisplay } from '../StarRating.jsx';
import { roleLabels, initials } from '../../utils.js';

export default function UsersTab({ refresh }) {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const { sort, order, toggleSort } = useSort('name');

  useEffect(() => {
    api('/admin/users' + toQuery({ ...filters, sort, order }))
      .then(setUsers)
      .catch((err) => setError(err.message));
  }, [filters, sort, order, refresh]);

  function handleFilter(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  async function showDetails(id) {
    try {
      setSelected(await api('/admin/users/' + id));
    } catch (err) {
      setError(err.message);
    }
  }

  const columns = [
    { key: 'name', label: 'Name', render: (u) => <span className="font-semibold text-slate-900">{u.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'role', label: 'Role', render: (u) => <RoleBadge role={u.role} /> },
    {
      key: 'details',
      label: '',
      sortable: false,
      render: (u) => (
        <button className="btn-soft px-3 py-1.5" onClick={() => showDetails(u.id)}>
          <Eye size={15} /> View
        </button>
      ),
    },
  ];

  return (
    <>
      <section className="card mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SearchInput name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilter} />
        <SearchInput name="email" placeholder="Filter by email" value={filters.email} onChange={handleFilter} />
        <SearchInput name="address" placeholder="Filter by address" value={filters.address} onChange={handleFilter} />
        <select name="role" className="input" value={filters.role} onChange={handleFilter}>
          <option value="">All roles</option>
          {Object.entries(roleLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </section>

      <Message>{error}</Message>

      <section className="card mt-4">
        <SortableTable columns={columns} rows={users} sort={sort} order={order} onSort={toggleSort} />
      </section>

      <Modal open={!!selected} title="User details" onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white">
                {initials(selected.name)}
              </span>
              <div>
                <p className="font-bold text-slate-900">{selected.name}</p>
                <RoleBadge role={selected.role} />
              </div>
            </div>

            <p className="flex items-center gap-2 text-sm text-slate-600">
              <Mail size={16} className="text-slate-400" /> {selected.email}
            </p>
            <p className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" /> {selected.address}
            </p>

            {selected.role === 'owner' && (
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700">Store rating</p>
                <StarDisplay value={selected.rating} />
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
