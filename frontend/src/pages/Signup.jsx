import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setFormError('');
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required';

    if (!form.email.trim()) next.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email)) next.email = 'Please enter a valid email address';

    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';

    if (!form.confirm) next.confirm = 'Please confirm your password';
    else if (form.password && form.confirm !== form.password) next.confirm = 'Passwords do not match';

    if (form.phone && !/^[0-9+\-\s()]{6,20}$/.test(form.phone)) next.phone = 'Please enter a valid phone number';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setBusy(true);
    try {
      const { confirm, ...payload } = form;
      await signup(payload);
      navigate('/');
    } catch (err) {
      setFormError(err.message);
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join us to enjoy exclusive offers</p>
        {formError && <div className="form-error-banner">{formError}</div>}
        <form onSubmit={onSubmit} noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'input-error' : ''}`}
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'input-error' : ''}`}
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Phone (optional)</label>
            <input
              type="tel"
              name="phone"
              className={`form-control ${errors.phone ? 'input-error' : ''}`}
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label>Address (optional)</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'input-error' : ''}`}
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm"
              className={`form-control ${errors.confirm ? 'input-error' : ''}`}
              value={form.confirm}
              onChange={handleChange}
            />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-link">
          Already a member? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
