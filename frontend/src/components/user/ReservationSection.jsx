import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import http from '../../api/http';
import notify from '../../utils/toast';
import { authStore } from '../../stores/AuthStore';

const STATUS_COLORS = { PENDING: 'warning', CONFIRMED: 'success', CANCELLED: 'danger' };

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const ReservationSection = observer(() => {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const emptyForm = {
    customerName: authStore.username || '',
    phone: '',
    reservationDate: '',
    reservationTime: '',
    partySize: 2,
    tableId: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const fetchData = async () => {
    try {
      const [resRes, tablesRes] = await Promise.all([
        http.get('/reservations'),
        http.get('/tables'),
      ]);
      setReservations(resRes.data.filter(r => r.customerName === authStore.username));
      setTables(tablesRes.data.filter(t => t.status === 'FREE'));
    } catch {
      notify.error('Could not load reservation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[+0-9 -]{6,20}$/.test(form.phone)) e.phone = 'Invalid phone number';
    if (!form.reservationDate) e.reservationDate = 'Date is required';
    else if (form.reservationDate <= today) e.reservationDate = 'Date must be in the future';
    if (!form.reservationTime) e.reservationTime = 'Time is required';
    const ps = parseInt(form.partySize);
    if (!ps || ps < 1 || ps > 20) e.partySize = 'Party size must be 1–20';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        reservationDate: form.reservationDate,
        reservationTime: form.reservationTime,
        partySize: parseInt(form.partySize),
        status: 'PENDING',
        ...(form.tableId ? { table: { id: parseInt(form.tableId) } } : {}),
      };
      await http.post('/reservations', payload);
      setSubmitted(true);
      setForm(emptyForm);
      setErrors({});
      setTimeout(() => setSubmitted(false), 4000);
      await fetchData();
    } catch (err) {
      const raw = err.response?.data;
      const msg = raw?.message || (typeof raw === 'string' ? raw : 'Reservation failed');
      notify.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const upcoming = reservations
    .filter(r => r.reservationDate >= today)
    .sort((a, b) => a.reservationDate.localeCompare(b.reservationDate));

  const past = reservations
    .filter(r => r.reservationDate < today)
    .sort((a, b) => b.reservationDate.localeCompare(a.reservationDate))
    .slice(0, 3);

  return (
    <section id="reservations" className="py-5 bg-white">
      <div className="container">
        <div className="text-center mb-5">
          <span
            className="badge px-3 py-2 mb-2"
            style={{ background: 'rgba(255,102,0,0.15)', color: '#ff6600', border: '1px solid rgba(255,102,0,0.3)' }}
          >
            <i className="bi bi-calendar-check me-1"></i>Reservations
          </span>
          <h2 className="display-5 fw-bold">Reserve Your Table</h2>
          <p className="text-muted">Book your spot and we'll be ready for you</p>
        </div>

        <div className="row g-5">
          {/* Reservation Form */}
          <div className="col-lg-6">
            <div className="card border-0 shadow rounded-4 overflow-hidden">
              <div
                className="card-header border-0 py-3 px-4"
                style={{ background: 'linear-gradient(135deg, #111111, #1a1a1a)' }}
              >
                <h5 className="text-white mb-0 fw-semibold">
                  <i className="bi bi-calendar-plus me-2" style={{ color: '#ff6600' }}></i>New Reservation
                </h5>
              </div>
              <div className="card-body p-4">
                {submitted && (
                  <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 mb-4">
                    <i className="bi bi-check-circle-fill fs-5"></i>
                    <div>
                      <strong>Reservation confirmed!</strong>
                      <div className="small">We'll have your table ready.</div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Your Name</label>
                      <input
                        className={`form-control ${errors.customerName ? 'is-invalid' : ''}`}
                        value={form.customerName}
                        onChange={e => setField('customerName', e.target.value)}
                        placeholder="Full name"
                      />
                      {errors.customerName && <div className="invalid-feedback">{errors.customerName}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Phone Number</label>
                      <input
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        value={form.phone}
                        onChange={e => setField('phone', e.target.value)}
                        placeholder="+383 44 123 456"
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label fw-semibold">Date</label>
                      <input
                        type="date"
                        className={`form-control ${errors.reservationDate ? 'is-invalid' : ''}`}
                        value={form.reservationDate}
                        min={tomorrow()}
                        onChange={e => setField('reservationDate', e.target.value)}
                      />
                      {errors.reservationDate && <div className="invalid-feedback">{errors.reservationDate}</div>}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label fw-semibold">Time</label>
                      <input
                        type="time"
                        className={`form-control ${errors.reservationTime ? 'is-invalid' : ''}`}
                        value={form.reservationTime}
                        onChange={e => setField('reservationTime', e.target.value)}
                      />
                      {errors.reservationTime && <div className="invalid-feedback">{errors.reservationTime}</div>}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label fw-semibold">Party Size</label>
                      <input
                        type="number"
                        className={`form-control ${errors.partySize ? 'is-invalid' : ''}`}
                        value={form.partySize}
                        min={1}
                        max={20}
                        onChange={e => setField('partySize', e.target.value)}
                      />
                      {errors.partySize && <div className="invalid-feedback">{errors.partySize}</div>}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label fw-semibold">
                        Table <span className="text-muted fw-normal small">(optional)</span>
                      </label>
                      <select
                        className="form-select"
                        value={form.tableId}
                        onChange={e => setField('tableId', e.target.value)}
                      >
                        <option value="">Any available table</option>
                        {tables.map(t => (
                          <option key={t.id} value={t.id}>
                            Table #{t.tableNumber} — seats {t.capacity}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-warning w-100 mt-4 py-2 fw-semibold rounded-3"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>Booking…
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calendar-check me-2"></i>Confirm Reservation
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* My Reservations list */}
          <div className="col-lg-6">
            <h5 className="fw-bold mb-4">
              <i className="bi bi-clock-history me-2" style={{ color: '#ff6600' }}></i>My Upcoming Reservations
            </h5>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-warning"></div>
              </div>
            ) : upcoming.length === 0 ? (
              <div className="text-center py-5 text-muted rounded-4 border border-dashed" style={{ borderStyle: 'dashed' }}>
                <i className="bi bi-calendar-x display-3 mb-3 d-block opacity-25"></i>
                <h6>No upcoming reservations</h6>
                <p className="small">Use the form to book your first table!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {upcoming.map(r => (
                  <div key={r.id} className="card border-0 shadow-sm rounded-3">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-semibold mb-1">
                            <i className="bi bi-calendar3 me-2" style={{ color: '#ff6600' }}></i>
                            {new Date(r.reservationDate + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                            })}
                          </div>
                          <div className="text-muted small d-flex flex-wrap gap-3">
                            <span><i className="bi bi-clock me-1"></i>{r.reservationTime}</span>
                            <span><i className="bi bi-people me-1"></i>{r.partySize} guests</span>
                            {r.table && (
                              <span><i className="bi bi-grid me-1"></i>Table #{r.table.tableNumber}</span>
                            )}
                          </div>
                        </div>
                        <span className={`badge bg-${STATUS_COLORS[r.status] || 'secondary'} ms-2`}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {past.length > 0 && (
              <div className="mt-4">
                <h6 className="text-muted fw-semibold mb-3">
                  <i className="bi bi-archive me-2"></i>Past Reservations
                </h6>
                <div className="d-flex flex-column gap-2">
                  {past.map(r => (
                    <div key={r.id} className="card border-0 bg-light rounded-3">
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="text-muted small">
                            {new Date(r.reservationDate + 'T00:00:00').toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                            <span className="ms-3">{r.partySize} guests</span>
                          </div>
                          <span className={`badge bg-${STATUS_COLORS[r.status] || 'secondary'} opacity-75`}>
                            {r.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

export default ReservationSection;
