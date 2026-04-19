import { useEffect, useState } from 'react';
import http from '../api/http';

function Card({ title, value, color }) {
  return (
    <div className="col-md-4 mb-3">
      <div className={`card text-white bg-${color} shadow-sm`}>
        <div className="card-body">
          <h6 className="card-title">{title}</h6>
          <h3 className="mb-0">{value}</h3>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [from, setFrom] = useState(new Date().toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState(null);

  useEffect(() => {
    http.get('/dashboard/summary').then((r) => setSummary(r.data));
  }, []);

  const loadReport = async () => {
    const r = await http.get('/dashboard/sales-report', { params: { from, to } });
    setReport(r.data);
  };

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      {summary && (
        <div className="row">
          <Card title="Daily Sales" value={`€ ${summary.dailySales}`} color="success" />
          <Card title="Monthly Sales" value={`€ ${summary.monthlySales}`} color="primary" />
          <Card title="Total Orders" value={summary.totalOrders} color="warning" />
        </div>
      )}

      {summary && (
        <div className="card mt-3 shadow-sm">
          <div className="card-header">Top Selling Items</div>
          <ul className="list-group list-group-flush">
            {summary.topItems.length === 0 && <li className="list-group-item text-muted">No data yet</li>}
            {summary.topItems.map((it, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                <span>{it.name}</span>
                <span className="badge bg-secondary">{it.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card mt-4 shadow-sm">
        <div className="card-header">Sales Report</div>
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label">From</label>
              <input type="date" className="form-control" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">To</label>
              <input type="date" className="form-control" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary" onClick={loadReport}>Generate</button>
            </div>
          </div>
          {report && (
            <div className="mt-3">
              <strong>Total: € {report.total}</strong>
              <div className="text-muted small">{report.orders.length} order(s) in range</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
