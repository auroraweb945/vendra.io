import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/storefront.css';

const Storefront = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const res = await axios.get(`https://vendra-io.onrender.com/api/storefront/${slug}`);
        setStore(res.data.store);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching store:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!store) return <p>Store not found.</p>;

  const heroStyle = store.background_url
    ? { backgroundImage: `url(${store.background_url})` }
    : {};

  const initials =
    (store.name || '')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'S';

  // Parse offers safely
  let offers = [];
  try {
    offers = Array.isArray(JSON.parse(store.about))
      ? JSON.parse(store.about)
      : [store.about];
  } catch {
    if (store.about && store.about.trim() !== '') offers = [store.about];
  }

  return (
    <div className="storefront-container">
      {/* 🧭 Navbar */}
      <nav className="storefront-navbar">
        <div className="navbar-left">
          {store.logo_url ? (
            <img src={store.logo_url} alt="Store logo" className="navbar-logo" />
          ) : (
            <div className="navbar-logo placeholder">{initials}</div>
          )}
          <span className="navbar-store-name">{store.name}</span>
        </div>
        <ul className="navbar-links">
          <li><a href="#offers">About</a></li>
          <li><a href="#products">Shop</a></li>
          <li><a href="#feedback">Reviews</a></li>
        </ul>
      </nav>

      {/* 🖼️ Hero Section with overlayed text */}
      <div className="storefront-hero new-layout" style={heroStyle}>
        <div className="hero-overlay">
          <h1 className="hero-title">{store.name}</h1>
          <p className="hero-description">{store.description}</p>
          <button onClick={() => navigate(`/store/${slug}/products`)} className="hero-btn">
            Explore the Collection
          </button>
        </div>
      </div>

      <div className="storefront-content">
        {/* 🏷️ Offers Section */}
        {offers.length > 0 && (
          <section id="offers" className="store-offers">
            <div className="offers-container">
              {offers.slice(0, 3).map((offer, idx) => (
                <div key={idx} className="offer-box">
                  <span className="offer-icon">⭐</span>
                  <p>{offer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 🛍️ Product Carousel */}
        {products && products.length > 0 && (
          <section id="products" className="product-carousel-section">
            <h2>Our Bestsellers</h2>
            <div className="carousel-container">
              {products.map((p) => (
                <div key={p.id} className="carousel-item">
                  <img src={p.image_url} alt={p.name} />
                  <h3>{p.name}</h3>
                  <p>${p.price}</p>
                </div>
              ))}
            </div>
            <button
              className="browse-btn"
              onClick={() => navigate(`/store/${slug}/products`)}
            >
              Discover the Entire Shop
            </button>
          </section>
        )}

        {/* 💬 Feedback Section */}
        {store.feedbacks && store.feedbacks.length > 0 && (
          <section id="feedback" className="feedback-section">
            <h2>Customer Feedback</h2>
            <ul>
              {store.feedbacks.map((f, idx) => (
                <li key={idx} className="feedback-card">
                  "{f.message}" — <strong>{f.author}</strong>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* ⚫ Footer */}
      <footer className="storefront-footer">
        <div className="footer-links">
          <a href="#shop">Shop</a>
          <a href="#offers">About</a>
          <a href="#feedback">FAQ</a>
        </div>
        <p>© {new Date().getFullYear()} {store.name}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Storefront;