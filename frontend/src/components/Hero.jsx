import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <h1>Elegance in Every Thread</h1>
        <p>
          Discover our exclusive collection of premium Borkha, Abaya, and modest wear —
          handcrafted with the finest fabrics and timeless designs.
        </p>
        <Link to="/products" className="btn btn-primary">
          Shop Collection &rarr;
        </Link>
      </div>
    </section>
  );
}
