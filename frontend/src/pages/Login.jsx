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
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <form onSubmit={submit} noValidate className="card p-4 shadow" style={{ width: 360 }}>
        <h4 className="mb-3 text-center">Restaurant Login</h4>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <FormField
          label="Username"
          value={values.username}
          onChange={(v) => setField('username', v)}
          error={errors.username}
          required
        />
        <FormField
          label="Password"
          type="password"
          value={values.password}
          onChange={(v) => setField('password', v)}
          error={errors.password}
          required
        />
        <button type="submit" className="btn btn-primary w-100">Login</button>
        <div className="text-center mt-3">
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
});

export default Login;
