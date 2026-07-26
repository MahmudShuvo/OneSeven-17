import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-rating">
          ★ {product.rating?.toFixed(1)} ({product.numReviews} reviews)
        </div>
        <div className="product-price">৳{product.price.toLocaleString()}</div>
        <button
          className="btn btn-primary btn-block"
          onClick={() => addItem(product, 1)}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
