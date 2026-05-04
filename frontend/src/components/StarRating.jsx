import { useState } from 'react';

export default function StarRating({ value = 0, onChange, readonly = false, size = 24 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="d-inline-flex align-items-center gap-1" style={{ cursor: readonly ? 'default' : 'pointer' }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n;
        return (
          <i
            key={n}
            className={`bi ${filled ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
            style={{ fontSize: size }}
            onClick={() => !readonly && onChange?.(n)}
            onMouseEnter={() => !readonly && setHover(n)}
            onMouseLeave={() => !readonly && setHover(0)}
            role={readonly ? undefined : 'button'}
            aria-label={`${n} yje`}
          />
        );
      })}
      {value > 0 && <span className="ms-2 small text-muted">({value}/5)</span>}
    </div>
  );
}