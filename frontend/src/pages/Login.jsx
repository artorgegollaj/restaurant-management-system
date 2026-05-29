import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores/AuthStore';
import useFormValidation, { validators } from '../hooks/useFormValidation.js';
import FormField from '../components/FormField.jsx';

const Login = observer(() => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { values, errors, setField, validate } = useFormValidation(
    { username: 'admin', password: 'admin123' },
    {
      username: [validators.required, validators.minLength(3)],
      password: [validators.required, validators.minLength(6)],
    }
  );

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    try {
      await authStore.login(values.username, values.password);
      const roles = authStore.roles;
      const isUserOnly = roles.length > 0 && roles.every(r => r === 'USER');
      navigate(isUserOnly ? '/home' : '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ background: '#0d0d0d' }}
    >
      <form
        onSubmit={submit}
        noValidate
        className="card p-4 shadow-lg border-0"
        style={{ width: 360, background: '#1a1a1a', borderTop: '3px solid #ff6600' }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-fire fs-1" style={{ color: '#ff6600' }}></i>
          <h4 className="fw-bold text-white mt-2" style={{ letterSpacing: 3 }}>AURA</h4>
          <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.5)' }}>Sign in to your account</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <div className="mb-3">
          <label className="form-label text-white-50 small fw-semibold">Username</label>
          <FormField
            value={values.username}
            onChange={(v) => setField('username', v)}
            error={errors.username}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label text-white-50 small fw-semibold">Password</label>
          <FormField
            type="password"
            value={values.password}
            onChange={(v) => setField('password', v)}
            error={errors.password}
            required
          />
        </div>

        <button
          type="submit"
          className="btn w-100 fw-semibold py-2 rounded-3"
          style={{ background: '#ff6600', color: '#fff', border: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = '#e55a00'}
          onMouseLeave={e => e.currentTarget.style.background = '#ff6600'}
        >
          Login
        </button>

        <div className="text-center mt-3">
          <Link to="/register" style={{ color: '#ff6600', fontSize: '0.875rem' }}>
            Don't have an account? Register
          </Link>
        </div>
      </form>
    </div>
  );
});

export default Login;
