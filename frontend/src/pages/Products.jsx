import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard.jsx';

const CATEGORIES = ['All', 'Abaya', 'Khimar', 'Hijab', 'Niqab', 'Modest Dress'];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');

  const category = params.get('category') || 'All';

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const q = {};
        if (category !== 'All') q.category = category;
        if (search) q.search = search;
        const { data } = await api.get('/products', { params: q });
        setProducts(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [category, search]);

  const setCategory = (c) => {
    const next = new URLSearchParams(params);
    if (c === 'All') next.delete('category');
    else next.set('category', c);
    setParams(next);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-title">
          <h2>Shop All</h2>
          <p>Find the perfect modest fit for every occasion</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32, justifyContent: 'center' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`btn ${category === c ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '8px 16px' }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading...</p>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try a different category or search term</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
