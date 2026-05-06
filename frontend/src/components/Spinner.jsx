export default function Spinner({ size = 'md', label = 'Duke ngarkuar...' }) {
  const cls = size === 'sm' ? 'spinner-border-sm' : '';
  return (
    <div className="d-flex justify-content-center align-items-center py-4">
      <div className={`spinner-border text-primary ${cls}`} role="status">
        <span className="visually-hidden">{label}</span>
      </div>
      {label && <span className="ms-2 text-muted">{label}</span>}
    </div>
  );
}
