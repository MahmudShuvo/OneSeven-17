import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, updateQty, removeItem, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const goCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0)
    return (
      <div className="container empty-state">
        <h3>Your cart is empty</h3>
        <p>Add some elegant borkha to get started!</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
          Browse Collection
        </Link>
      </div>
    );

  const itemsPrice = totalPrice;
  const shippingPrice = itemsPrice > 5000 ? 0 : 100;
  const tax = +(itemsPrice * 0.05).toFixed(2);
  const total = itemsPrice + shippingPrice + tax;

  return (
    <div className="container cart-page">
      <h1 style={{ marginBottom: 32, fontSize: 36 }}>Shopping Cart</h1>
      <div className="cart-grid">
        <div>
          {items.map((item) => (
            <div className="cart-item" key={item.product._id}>
              <Link to={`/products/${item.product._id}`}>
                <img src={item.product.image} alt={item.product.name} />
              </Link>
              <div className="cart-item-info">
                <h4>{item.product.name}</h4>
                <p>{item.product.category}</p>
                <p style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  ৳{item.product.price.toLocaleString()}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <div className="qty-controls">
                    <button onClick={() => updateQty(item.product._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.product._id, item.quantity + 1)}>+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 500 }}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: 18 }}>
                ৳{(item.product.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
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
          <button className="btn btn-primary btn-block" onClick={goCheckout} style={{ marginTop: 16 }}>
            Proceed to Checkout
          </button>
          <Link to="/products" className="btn btn-outline btn-block" style={{ marginTop: 8 }}>
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
