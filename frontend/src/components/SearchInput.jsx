import { Search } from 'lucide-react';

// A normal input with a small search icon inside
export default function SearchInput(props) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input {...props} className="input pl-10" />
    </div>
  );
}
