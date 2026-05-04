import { useState } from 'react';
import api from '../api/client.js';

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await api.post('/upload/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onChange(r.data.url);
    } catch (e) {
      setErr(e.response?.data?.message || 'Upload deshtoi');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" className="form-control" onChange={handle} disabled={uploading} />
      {uploading && <small className="text-muted">Duke ngarkuar...</small>}
      {err && <small className="text-danger">{err}</small>}
      {value && (
        <div className="mt-2">
          <img src={`http://localhost:8080${value}`} alt="preview" style={{ maxHeight: 120, borderRadius: 4 }} />
        </div>
      )}
    </div>
  );
}