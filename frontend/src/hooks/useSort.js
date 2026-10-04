import { useState } from 'react';

// Remembers which column is sorted and in which direction.
// Clicking the same column again flips asc <-> desc.
export default function useSort(defaultColumn) {
  const [sort, setSort] = useState(defaultColumn);
  const [order, setOrder] = useState('asc');

  function toggleSort(column) {
    if (column === sort) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(column);
      setOrder('asc');
    }
  }

  return { sort, order, toggleSort };
}
