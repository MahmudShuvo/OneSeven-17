import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setFormError('');
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email)) next.email = 'Please enter a valid email address';

    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
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
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue shopping</p>
        {formError && <div className="form-error-banner">{formError}</div>}
        <form onSubmit={onSubmit} noValidate>
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
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="auth-link">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
