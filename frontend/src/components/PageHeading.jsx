export default function PageHeading({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
      {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
    </div>
  );
}
