import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpDown, Inbox } from 'lucide-react';

// A table where clicking a column heading sorts it.
//
// columns: [{ key: 'name', label: 'Name', sortable: false, render: (row) => ... }]
// sort / order: the column and direction that are active right now
// onSort(key): called when a heading is clicked
export default function SortableTable({ columns, rows, sort, order, onSort }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
            {columns.map((col) => {
              const canSort = col.sortable !== false;
              const active = sort === col.key;
              return (
                <th
                  key={col.key}
                  onClick={canSort ? () => onSort(col.key) : undefined}
                  className={`whitespace-nowrap px-3 py-3 font-semibold ${
                    canSort ? 'cursor-pointer select-none hover:text-indigo-600' : ''
                  } ${active ? 'text-indigo-600' : ''}`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {canSort && active && (order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    {canSort && !active && <ArrowUpDown size={13} className="opacity-40" />}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                <Inbox className="mx-auto mb-2" size={32} />
                Nothing to show.
              </td>
            </tr>
          )}
          {rows.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index, 10) * 0.04 }}
              className="border-b border-slate-50 transition hover:bg-indigo-50/60"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-3.5 align-middle">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
