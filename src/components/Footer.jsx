import React from "react";
import { Link } from "react-router-dom";
import "../style/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo">DrawMaster</h2>
          <p className="footer-text">
            DrawMaster is a modern online drawing learning platform where
            beginners and professionals learn together through structured
            classes, expert guidance, and creative practice.
          </p>
        </div>
        <div className="footer-links">
          <h4>Content</h4>
          <Link to="/lessons">Lessons</Link>
          <Link to="/shop">Art Tools</Link>

        </div>
        <div className="footer-links">
          <h4>Community</h4>
          <Link to="/artists">Artists</Link>
          <Link to="/getting-started">Getting Started</Link>
        </div>
        <div className="footer-links">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/help">Help Center</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 DrawMaster. All rights reserved.</p>
        <div className="footer-social">
          <a href="#" aria-label="YouTube">YouTube</a>
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="Facebook">Facebook</a>
          <a href="#" aria-label="X">X</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
