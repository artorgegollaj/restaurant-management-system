const COLORS = {
  'PENDING': 'warning',
  'Ne pritje': 'warning',
  'IN_PROGRESS': 'info',
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

export default function StatusBadge({ status }) {
  const color = COLORS[status] || 'secondary';
  return <span className={`badge bg-${color}`}>{status || '-'}</span>;
}
