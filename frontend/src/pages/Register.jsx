import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authStore } from '../stores/AuthStore';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authStore.register(username, email, password);
      setSuccess('Account created. Redirecting...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Register failed');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: '#0d0d0d' }}
    >
      <form
        onSubmit={submit}
        className="card p-4 shadow-lg border-0"
        style={{ width: 360, background: '#1a1a1a', borderTop: '3px solid #ff6600' }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-fire fs-1" style={{ color: '#ff6600' }}></i>
          <h4 className="fw-bold text-white mt-2" style={{ letterSpacing: 3 }}>AURA</h4>
          <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.5)' }}>Create your account</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {success && <div className="alert alert-success py-2 small">{success}</div>}

        <div className="mb-3">
          <label className="form-label text-white-50 small fw-semibold">Username</label>
          <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label text-white-50 small fw-semibold">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="form-label text-white-50 small fw-semibold">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button
          type="submit"
          className="btn w-100 fw-semibold py-2 rounded-3"
          style={{ background: '#ff6600', color: '#fff', border: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = '#e55a00'}
          onMouseLeave={e => e.currentTarget.style.background = '#ff6600'}
        >
          Create Account
        </button>

        <div className="text-center mt-3">
          <Link to="/login" style={{ color: '#ff6600', fontSize: '0.875rem' }}>
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
