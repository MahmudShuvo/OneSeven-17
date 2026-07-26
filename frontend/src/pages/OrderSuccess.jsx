import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  return (
    <div className="success-page container">
      <div className="success-icon">✓</div>
      <h1>Thank you for your order!</h1>
      <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 24 }}>
        Your order has been placed successfully. We'll send a confirmation to your email.
      </p>

      {order && (
        <div
          className="auth-card"
          style={{ maxWidth: 480, margin: '24px auto', textAlign: 'left' }}
        >
          <h3 style={{ fontFamily: 'Inter', marginBottom: 16 }}>Order #{order._id.slice(-8).toUpperCase()}</h3>
          <div className="summary-row">
            <span>Status</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>{order.status}</span>
          </div>
          <div className="summary-row">
            <span>Items</span>
            <span>{order.items.length}</span>
          </div>
          <div className="summary-row">
            <span>Payment</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>৳{order.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

      <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>
        Continue Shopping
      </Link>
    </div>
  );
}
