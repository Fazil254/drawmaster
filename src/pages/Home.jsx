import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Home.css";

const Home = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      "section, h1, h2, h3, p, .btn, .promo-btn"
    );

    elements.forEach((el, index) => {
      el.setAttribute("data-aos", "fade-up");
      el.setAttribute("data-aos-delay", index * 60);
    });
  }, []);

  return (
    <div className="home">

      <section className="hero">
        <h1>DrawMaster</h1>
        <h3>Learn Drawing from Professional Artists</h3>
        <p>
          Join live and recorded drawing classes. Learn pencil sketches,
          portraits, and digital art.
        </p>

        <div className="hero-actions">
          <Link to="/lessons" className="btn primary">Explore Classes</Link>
          <Link to="/signin" className="btn secondary">Sign in</Link>
        </div>
      </section>
      <section className="about-section">
        <h2>About DrawMaster</h2>
        <p>
          DrawMaster is a modern online drawing learning platform built for all
          skill levels, from beginners to professionals.
        </p>
        <p>
          Learn pencil sketching, portraits, anatomy, perspective, shading, and
          digital art with structured lessons.
        </p>
        <p>
          Built using modern React practices, responsive design, and clean UX
          patterns suitable for real-world applications.
        </p>
      </section>
      <section className="features">
        <h2>Why Choose DrawMaster?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <i className="fa-solid fa-palette feature-icon"></i>
            <h3>Expert Artists</h3>
            <p>Learn from verified professionals.</p>
          </div>

          <div className="feature-card">
            <i className="fa-solid fa-book-open feature-icon"></i>
            <h3>Structured Learning</h3>
            <p>Step-by-step lessons.</p>
          </div>

          <div className="feature-card">
            <i className="fa-solid fa-video feature-icon"></i>
            <h3> Recorded classes</h3>
            <p>Learn anytime, anywhere.</p>
          </div>

          <div className="feature-card">
            <i className="fa-solid fa-lock feature-icon"></i>
            <h3>Secure Access</h3>
            <p>Protected learning data.</p>
          </div>
        </div>
      </section>
      <section className="shop-promo">
        <div className="promo-card">
          <div className="promo-text">
            <h2>Need Art Tools, Fast?</h2>
            <p>Discover trusted tools for artists.</p>

            <ul className="promo-list">
              <li>✔ Premium pencils & sketchbooks</li>
              <li>✔ Digital art tools</li>
              <li>✔ Artist-recommended kits</li>
            </ul>

            <div className="promo-actions">
              <Link to="/shop" className="promo-btn">Shop Now</Link>
              <Link to="/lesons" className="promo-link">
                Explore Classes →
              </Link>
            </div>
          </div>

          <div className="promo-image">
            <img
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f"
              alt="Art supplies"
            />
          </div>
        </div>
      </section>
      <section className="cta">
        <h2>Start Learning Today</h2>
        <p>Create an account and begin your journey.</p>
        <Link to="/form" className="btn primary">Register Now</Link>
      </section>

    </div>
  );
};

export default Home;
