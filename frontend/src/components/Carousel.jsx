import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Carousel({ products = [] }) {
  const slides = products.slice(0, 5);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const prev = () => setActive((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setActive((i) => (i + 1) % slides.length);

  return (
    <div className="container carousel">
      <div className="carousel-wrapper">
        {slides.map((p, idx) => (
          <Link
            to={`/products/${p._id}`}
            key={p._id}
            className={`carousel-slide ${idx === active ? 'active' : ''}`}
            style={{ backgroundImage: `url(${p.image})` }}
          >
            <div className="carousel-slide-inner">
              <h2>{p.name}</h2>
              <p>{p.description.slice(0, 110)}...</p>
              <p style={{ marginTop: 12, fontSize: 22, fontWeight: 600 }}>৳{p.price}</p>
            </div>
          </Link>
        ))}
        <button className="carousel-btn prev" onClick={prev} aria-label="previous">‹</button>
        <button className="carousel-btn next" onClick={next} aria-label="next">›</button>
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={i === active ? 'active' : ''}
              aria-label={`slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
