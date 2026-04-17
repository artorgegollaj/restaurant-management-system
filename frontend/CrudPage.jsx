import { useEffect, useState } from 'react';
import http from '../api/http';

function emptyForm(fields) {
  const o = {};
  fields.forEach((f) => { o[f.name] = f.default ?? ''; });
  return o;
}

function getValue(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function CrudPage({ config }) {
  const { title, endpoint, fields, relations = {} } = config;

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm(fields));
  const [editingId, setEditingId] = useState(null);
  const [relData, setRelData] = useState({});
  const [error, setError] = useState('');

  const load = async () => {
    const r = await http.get(endpoint);
    setItems(r.data);
  };

  useEffect(() => {
    load();
    Object.entries(relations).forEach(async ([key, rel]) => {
      const r = await http.get(rel.endpoint);
      setRelData((prev) => ({ ...prev, [key]: r.data }));
    });
    // eslint-disable-next-line
  }, [endpoint]);

  const buildPayload = () => {
    const payload = { ...form };
    Object.entries(relations).forEach(([key]) => {
      const id = payload[key];
      payload[key] = id ? { id: Number(id) } : null;
    });
    fields.forEach((f) => {
      if (f.type === 'number' && payload[f.name] !== '' && payload[f.name] != null) {
        payload[f.name] = Number(payload[f.name]);
      }
      if (f.type === 'checkbox') {
        payload[f.name] = !!payload[f.name];
      }
    });
    return payload;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = buildPayload();
      if (editingId) {
        await http.put(`${endpoint}/${editingId}`, payload);
      } else {
        await http.post(endpoint, payload);
      }
      setForm(emptyForm(fields));
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    }
  };

  const edit = (item) => {
    const f = {};
    fields.forEach((field) => {
      f[field.name] = item[field.name] ?? '';
    });
    Object.keys(relations).forEach((key) => {
      f[key] = item[key]?.id ?? '';
    });
    setForm(f);
    setEditingId(item.id);
  };

  const remove = async (id) => {
    if (!confirm('Delete this record?')) return;
    await http.delete(`${endpoint}/${id}`);
    load();
  };

  const cancel = () => {
    setForm(emptyForm(fields));
    setEditingId(null);
  };

  const renderField = (f) => {
    if (f.type === 'textarea') {
      return (
        <textarea
          className="form-control"
          value={form[f.name] ?? ''}
          onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
        />
      );
    }
    if (f.type === 'checkbox') {
      return (
        <input
          type="checkbox"
          className="form-check-input"
          checked={!!form[f.name]}
          onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })}
        />
      );
    }
    return (
      <input
        type={f.type || 'text'}
        className="form-control"
        step={f.step}
        value={form[f.name] ?? ''}
        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
      />
    );
  };

  return (
    <div>
      <h2 className="mb-3">{title}</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={submit} className="card p-3 mb-4 shadow-sm">
        <div className="row g-2">
          {fields.map((f) => (
            <div className="col-md-4" key={f.name}>
              <label className="form-label">{f.label}</label>
              {renderField(f)}
            </div>
          ))}
          {Object.entries(relations).map(([key, rel]) => (
            <div className="col-md-4" key={key}>
              <label className="form-label">{rel.label}</label>
              <select
                className="form-select"
                value={form[key] ?? ''}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              >
                <option value="">-- select --</option>
                {(relData[key] || []).map((r) => (
                  <option key={r.id} value={r.id}>
                    {rel.display(r)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary me-2">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={cancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                {fields.map((f) => (<th key={f.name}>{f.label}</th>))}
                {Object.entries(relations).map(([key, rel]) => (<th key={key}>{rel.label}</th>))}
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={fields.length + 2 + Object.keys(relations).length} className="text-muted text-center">No records</td></tr>
              )}
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.id}</td>
                  {fields.map((f) => (
                    <td key={f.name}>
                      {f.type === 'checkbox' ? (it[f.name] ? 'Yes' : 'No') : String(it[f.name] ?? '')}
                    </td>
                  ))}
                  {Object.entries(relations).map(([key, rel]) => (
                    <td key={key}>{it[key] ? rel.display(it[key]) : '-'}</td>
                  ))}
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => edit(it)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(it.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CrudPage;
