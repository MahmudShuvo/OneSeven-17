import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: 'var(--accent)', textTransform: 'none', letterSpacing: 0 }}>
              <img src="/logo.svg" alt="OneSeven 17 logo" style={{ width: 32, height: 32 }} />
              OneSeven 17
            </h4>
            <p>
              Premium modest fashion crafted with elegance, dignity and tradition in every stitch.
              Free shipping on orders above ৳5,000.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/products">Shop All</Link>
            <Link to="/cart">My Cart</Link>
            <Link to="/login">Account</Link>
          </div>

          <div>
            <h4>Categories</h4>
            <Link to="/products?category=Abaya">Abaya</Link>
            <Link to="/products?category=Khimar">Khimar</Link>
            <Link to="/products?category=Hijab">Hijab</Link>
            <Link to="/products?category=Niqab">Niqab</Link>
          </div>

          <div>
            <h4>Contact Us</h4>
            <p>📍 12 Modest Lane, Dhaka 1212</p>
            <p>📞 +880 1700 000000</p>
            <p>✉ support@oneseven17.com</p>
            <p>🕐 Sat–Thu, 10am – 9pm</p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} OneSeven 17. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
