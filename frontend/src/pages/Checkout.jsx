import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    address: user?.address || '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
    phone: user?.phone || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [busy, setBusy] = useState(false);

  const itemsPrice = totalPrice;
  const shippingPrice = itemsPrice > 5000 ? 0 : 100;
  const tax = +(itemsPrice * 0.05).toFixed(2);
  const total = itemsPrice + shippingPrice + tax;

  const handleChange = (e) => setShipping({ ...shipping, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return navigate('/products');
    }
    setBusy(true);
    try {
      const payload = {
        items: items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
          size: i.size || 'M',
        })),
        shipping,
        paymentMethod,
      };
      const { data } = await api.post('/orders', payload);
      await clearCart();
      toast.success('Order placed!');
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0)
    return (
      <div className="container empty-state">
        <h3>Your cart is empty</h3>
      </div>
    );

  return (
    <div className="container cart-page">
      <h1 style={{ marginBottom: 32, fontSize: 36 }}>Checkout</h1>
      <form onSubmit={placeOrder} className="cart-grid">
        <div>
          <div className="auth-card" style={{ maxWidth: 'none' }}>
            <h3 style={{ fontFamily: 'Inter', marginBottom: 20 }}>Shipping Information</h3>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                name="fullName"
                className="form-control"
                value={shipping.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <input
                name="address"
                className="form-control"
                value={shipping.address}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>City *</label>
                <input
                  name="city"
                  className="form-control"
                  value={shipping.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Postal Code *</label>
                <input
                  name="postalCode"
                  className="form-control"
                  value={shipping.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Country *</label>
              <input
                name="country"
                className="form-control"
                value={shipping.country}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                name="phone"
                className="form-control"
                value={shipping.phone}
                onChange={handleChange}
                required
              />
            </div>

            <h3 style={{ fontFamily: 'Inter', margin: '24px 0 16px' }}>Payment Method</h3>
            {['Cash on Delivery', 'bKash', 'Card'].map((m) => (
              <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <input
                  type="radio"
                  name="payment"
                  value={m}
                  checked={paymentMethod === m}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          {items.map((i) => (
            <div className="summary-row" key={i.product._id}>
              <span>
                {i.product.name} × {i.quantity}
              </span>
              <span>৳{(i.product.price * i.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Subtotal</span>
            <span>৳{itemsPrice.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingPrice === 0 ? 'FREE' : `৳${shippingPrice}`}</span>
          </div>
          <div className="summary-row">
            <span>Tax (5%)</span>
            <span>৳{tax.toLocaleString()}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>৳{total.toLocaleString()}</span>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy} style={{ marginTop: 16 }}>
            {busy ? 'Placing order...' : 'Place Order'}
          </button>
        </aside>
      </form>
    </div>
  );
}
