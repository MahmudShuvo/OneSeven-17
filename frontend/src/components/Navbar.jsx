import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand brand-with-logo">
          <img src="/logo.svg" alt="OneSeven 17 logo" className="brand-logo" />
          OneSeven 17
        </Link>
        <button
          className="btn"
          style={{ display: 'none' }}
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          ☰
        </button>
        <div className={`nav-links ${open ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Shop</Link>
          <Link to="/cart" className="nav-link">
            Cart{totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </Link>
          {user ? (
            <>
              <span className="nav-link" style={{ color: 'var(--muted)' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
