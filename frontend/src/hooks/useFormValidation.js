import { useState } from 'react';

export const validators = {
  required: (v, msg = 'Kjo fushe eshte e detyrueshme') => (!v || v === '') ? msg : null,
  email: (v) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Email i pavlefshem' : null,
  minLength: (n) => (v) => v && v.length < n ? `Min ${n} karaktere` : null,
  number: (v) => v !== '' && isNaN(Number(v)) ? 'Duhet te jete numer' : null,
  positive: (v) => Number(v) <= 0 ? 'Duhet te jete > 0' : null,
};

export default function useFormValidation(initial, schema) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const newErrors = {};
    for (const [field, rules] of Object.entries(schema)) {
      for (const rule of rules) {
        const err = rule(values[field]);
        if (err) { newErrors[field] = err; break; }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setField = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setTouched((t) => ({ ...t, [name]: true }));
  };

  return { values, setValues, errors, touched, setField, validate };
}
