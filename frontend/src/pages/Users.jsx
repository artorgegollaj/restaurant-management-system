import { useEffect, useState } from 'react';
import http from '../api/http';

const empty = { username: '', email: '', password: '', roleIds: [] };

function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const [u, r] = await Promise.all([http.get('/users'), http.get('/roles')]);
    setUsers(u.data);
    setRoles(r.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, roleIds: form.roleIds.map(Number) };
      if (editingId) {
        if (!payload.password) delete payload.password;
        await http.put(`/users/${editingId}`, payload);
      } else {
        await http.post('/users', payload);
      }
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    }
  };

  const edit = (u) => {
    setForm({
      username: u.username,
      email: u.email,
      password: '',
      roleIds: (u.roleIds || []).map(String)
    });
    setEditingId(u.id);
  };

  const remove = async (id) => {
    if (!confirm('Delete this user?')) return;
    await http.delete(`/users/${id}`);
    load();
  };

  const cancel = () => {
    setForm(empty);
    setEditingId(null);
  };

  const toggleRole = (rid) => {
    const idStr = String(rid);
    setForm((f) => ({
      ...f,
      roleIds: f.roleIds.includes(idStr)
        ? f.roleIds.filter((r) => r !== idStr)
        : [...f.roleIds, idStr]
    }));
  };

  return (
    <div>
      <h2 className="mb-3">Users</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={submit} className="card p-3 mb-4 shadow-sm">
        <div className="row g-2">
          <div className="col-md-3">
            <label className="form-label">Username</label>
            <input className="form-control" value={form.username}
                   onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={form.email}
                   onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label">
              Password {editingId && <small className="text-muted">(leave blank to keep)</small>}
            </label>
            <input type="password" className="form-control" value={form.password}
                   onChange={(e) => setForm({ ...form, password: e.target.value })}
                   required={!editingId} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Roles</label>
            <div className="border rounded p-2" style={{ minHeight: 38 }}>
              {roles.map((r) => (
                <div className="form-check" key={r.id}>
                  <input type="checkbox" className="form-check-input"
                         id={`role-${r.id}`}
                         checked={form.roleIds.includes(String(r.id))}
                         onChange={() => toggleRole(r.id)} />
                  <label className="form-check-label" htmlFor={`role-${r.id}`}>{r.name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary me-2">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={cancel}>Cancel</button>}
        </div>
      </form>

      <div className="card shadow-sm">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th><th>Username</th><th>Email</th><th>Roles</th><th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && <tr><td colSpan={5} className="text-center text-muted">No users</td></tr>}
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  {(u.roles || []).map((r) => (
                    <span key={r} className="badge bg-secondary me-1">{r}</span>
                  ))}
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => edit(u)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
