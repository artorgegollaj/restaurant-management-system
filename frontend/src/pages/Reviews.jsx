import { useEffect, useState } from 'react';
import api from '../api/client.js';
import StarRating from '../components/StarRating.jsx';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerName: '', rating: 0, comment: '' });
  const [err, setErr] = useState('');

  const load = async () => {
    const r = await api.get('/reviews');
    setReviews(r.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.rating < 1) { setErr('Klikoni te pakten 1 yll'); return; }
    try {
      await api.post('/reviews', form);
      setShowForm(false);
      setForm({ customerName: '', rating: 0, comment: '' });
      load();
    } catch (e) { setErr(e.response?.data?.message || 'Deshtoi'); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h3>Vleresimet</h3>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Vleresim i Ri</button>
      </div>
      {err && <div className="alert alert-danger">{err}</div>}
      <div className="row g-3">
        {reviews.map((r) => (
          <div key={r.id} className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">{r.customerName}</h6>
                <StarRating value={r.rating} readonly size={18} />
                <p className="card-text mt-2">{r.comment}</p>
                <small className="text-muted">{new Date(r.reviewDate).toLocaleString()}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={submit}>
                <div className="modal-header">
                  <h5>Vleresim i Ri</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Emri</label>
                    <input className="form-control" required
                      value={form.customerName}
                      onChange={(e) => setForm({...form, customerName: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label d-block">Vleresimi</label>
                    <StarRating value={form.rating}
                      onChange={(v) => setForm({...form, rating: v})} size={32} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Koment</label>
                    <textarea className="form-control" rows={3}
                      value={form.comment}
                      onChange={(e) => setForm({...form, comment: e.target.value})} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Anulo</button>
                  <button type="submit" className="btn btn-primary">Ruaj</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}