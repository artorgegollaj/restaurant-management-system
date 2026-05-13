import { useEffect, useState } from 'react';
import api from '../api/http.js'; 
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement, Tooltip, Legend, Title,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Tooltip, Legend, Title);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState([]);
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/summary'),
      api.get('/dashboard/daily-sales'),
      api.get('/dashboard/top-products?limit=5'),
    ]).then(([s, d, t]) => {
      setSummary(s.data);
      setDaily(d.data);
      setTop(t.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border" /></div>;

  const lineData = {
    labels: daily.map((d) => d.date),
    datasets: [{
      label: 'Shitjet ditore (€)',
      data: daily.map((d) => d.total),
      borderColor: 'rgb(13, 110, 253)',
      backgroundColor: 'rgba(13, 110, 253, 0.2)',
      tension: 0.3, fill: true,
    }],
  };

  const barData = {
    labels: top.map((p) => p.name),
    datasets: [{
      label: 'Sasia',
      data: top.map((p) => p.quantity),
      backgroundColor: 'rgba(25, 135, 84, 0.7)',
    }],
  };

  const doughnutData = {
    labels: top.map((p) => p.name),
    datasets: [{
      data: top.map((p) => p.revenue),
      backgroundColor: ['#0d6efd','#198754','#ffc107','#dc3545','#6f42c1'],
    }],
  };

  return (
    <div>
      <h3 className="mb-4">Dashboard</h3>

      <div className="row g-3 mb-4">
        <div className="col-md-3"><StatCard label="Total Porosi" value={summary?.totalOrders ?? 0} icon="bi-receipt" color="primary" /></div>
        <div className="col-md-3"><StatCard label="Te Hyra Total" value={`${(summary?.totalRevenue ?? 0).toFixed(2)}€`} icon="bi-cash-stack" color="success" /></div>
        <div className="col-md-3"><StatCard label="Ne Pritje" value={summary?.pendingOrders ?? 0} icon="bi-clock-history" color="warning" /></div>
        <div className="col-md-3"><StatCard label="Sot" value={`${summary?.todayOrders ?? 0} (${(summary?.todayRevenue ?? 0).toFixed(2)}€)`} icon="bi-calendar-check" color="info" /></div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="card"><div className="card-body">
            <h6 className="card-title">Shitjet 7 Diteshe</h6>
            <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div></div>
        </div>
        <div className="col-md-4">
          <div className="card"><div className="card-body">
            <h6 className="card-title">Te Hyrat per Produkt</h6>
            <Doughnut data={doughnutData} options={{ responsive: true }} />
          </div></div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h6 className="card-title">Top 5 Produkte (sasia)</h6>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`card border-${color}`}>
      <div className="card-body d-flex align-items-center">
        <div className={`text-${color} me-3`} style={{ fontSize: 32 }}>
          <i className={`bi ${icon}`} />
        </div>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fs-4 fw-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}
