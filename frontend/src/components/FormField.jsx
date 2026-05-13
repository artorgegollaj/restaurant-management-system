export default function FormField({ label, value, onChange, type = 'text', required, minLength, pattern, error, ...rest }) {
  const isInvalid = error || (required && !value);
  return (
    <div className="mb-3">
      <label className="form-label">{label}{required && <span className="text-danger"> *</span>}</label>
      <input
        type={type}
        className={`form-control ${isInvalid && error ? 'is-invalid' : ''}`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        pattern={pattern}
        {...rest}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}