const COLORS = {
  'PENDING': 'warning',
  'Ne pritje': 'warning',
  'IN_PROGRESS': 'info',
  'Preparing': 'info',
  'Ne pergatitje': 'info',
  'DELIVERED': 'primary',
  'E dorezuar': 'primary',
  'PAID': 'success',
  'E paguar': 'success',
  'CANCELLED': 'danger',
  'Anuluar': 'danger',
  'FREE': 'success',
  'OCCUPIED': 'danger',
  'RESERVED': 'warning',
};

// Friendlier display text for the canonical order-status codes.
const LABELS = {
  'PENDING': 'Pending',
  'IN_PROGRESS': 'Preparing',
  'DELIVERED': 'Done',
  'PAID': 'Paid',
  'CANCELLED': 'Cancelled',
};

export default function StatusBadge({ status }) {
  const color = COLORS[status] || 'secondary';
  return <span className={`badge bg-${color}`}>{LABELS[status] || status || '-'}</span>;
}
