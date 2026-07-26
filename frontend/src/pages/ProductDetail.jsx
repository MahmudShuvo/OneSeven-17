import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setSize(data.sizes?.[0] || '');
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: 80 }}>Loading...</div>;
  if (!product)
    return (
      <div className="container empty-state">
        <h3>Product not found</h3>
      </div>
    );

  const handleBuyNow = async () => {
    await addItem(product, qty);
    navigate('/checkout');
  };

  return (
    <div className="container detail-grid">
      <img src={product.image} alt={product.name} className="detail-image" />
      <div className="detail-info">
        <div className="product-category">{product.category}</div>
        <h1>{product.name}</h1>
        <div className="product-rating">
          ★ {product.rating?.toFixed(1)} ({product.numReviews} reviews)
        </div>
        <div className="price">৳{product.price.toLocaleString()}</div>
        <p className="description">{product.description}</p>

        {product.sizes?.length > 0 && (
          <>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Size:</p>
            <div className="size-options">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`size-option ${size === s ? 'active' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        <p style={{ fontWeight: 600, marginBottom: 8 }}>Quantity:</p>
        <div className="qty-controls" style={{ marginBottom: 24 }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <span>{qty}</span>
          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>

        <p style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--danger)', marginBottom: 16 }}>
          {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
        </p>

        <div className="action-row">
          <button
            className="btn btn-outline"
            onClick={() => addItem(product, qty)}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </button>
          <button
            className="btn btn-primary"
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
