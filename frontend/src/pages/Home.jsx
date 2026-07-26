import { useEffect, useState } from 'react';
import api from '../api/axios';
import Hero from '../components/Hero.jsx';
import Carousel from '../components/Carousel.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featured = products.filter((p) => p.featured);

  return (
    <>
      <Hero />

      {/* Carousel of featured borkha */}
      <Carousel products={featured.length ? featured : products} />

      {/* Product list section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Our Collection</h2>
            <p>Browse handpicked borkha and modest wear, curated for grace and comfort</p>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading collection...</p>
          ) : products.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--muted)' }}>
              No products yet. Run <code>npm run seed</code> in the backend.
            </p>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why us banner */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-title">
            <h2>Why Choose OneSeven 17?</h2>
          </div>
          <div className="products-grid">
            <div style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 40 }}>✨</div>
              <h3 style={{ fontFamily: 'Inter', fontSize: 18, margin: '12px 0' }}>Premium Quality</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                Hand-selected fabrics and meticulous craftsmanship for lasting elegance
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 40 }}>🚚</div>
              <h3 style={{ fontFamily: 'Inter', fontSize: 18, margin: '12px 0' }}>Free Delivery</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                Free shipping nationwide on orders over ৳5,000
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 40 }}>↩</div>
              <h3 style={{ fontFamily: 'Inter', fontSize: 18, margin: '12px 0' }}>Easy Returns</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                Hassle-free 7-day return and exchange policy
              </p>
            </div>
            <div style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 40 }}>💬</div>
              <h3 style={{ fontFamily: 'Inter', fontSize: 18, margin: '12px 0' }}>Personal Support</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                Dedicated styling assistance via WhatsApp and phone
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
