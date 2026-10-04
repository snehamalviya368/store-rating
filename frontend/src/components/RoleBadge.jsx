import { roleLabels } from '../utils.js';

const colors = {
  admin: 'bg-violet-100 text-violet-700',
  owner: 'bg-amber-100 text-amber-700',
  user: 'bg-sky-100 text-sky-700',
};

export default function RoleBadge({ role }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${colors[role]}`}>
      {roleLabels[role]}
    </span>
  );
}
