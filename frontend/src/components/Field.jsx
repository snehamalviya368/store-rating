// A label, then the input (passed as children), then an error message if there is one
export default function Field({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
