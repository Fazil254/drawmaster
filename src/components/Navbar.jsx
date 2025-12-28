import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../style/Navbar.css";
import { searchMap } from "../utils/searchMap";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const q = query.toLowerCase().trim();

    const match = searchMap.find(item =>
      item.keywords.some(k => q.includes(k))
    );
    if (match) {
      navigate(
        match.id ? `${match.path}#${match.id}` : match.path,
        { state: { q } }
      );
    }
    else {
      navigate("/lessons", { state: { q } });
    }

    setQuery("");
  };
  const categories = [
    { label: "All Classes", type: "" },
    { label: "Portrait Drawing", type: "portrait" },
    { label: "Gesture Drawing", type: "gesture" },
    { label: "Loomis Method", type: "loomis" },
    { label: "Grid Method", type: "grid" },
    { label: "Digital Art", type: "digital" },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg border-bottom">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand logo">
            <h1>Draw</h1>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav align-items-center">
              <li
                className="nav-item position-relative me-3"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <button className="categories-btn nv-btn">
                  <span className="menu-icon">☰</span>
                  <span className="menu-text">Categories</span>
                </button>

                {open && (
                  <div className="custom-dropdown">
                    {categories.map((item, index) => (
                      <div
                        key={index}
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/lessons", {
                            state: { type: item.type },
                          });
                          setOpen(false);
                        }}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </li>
              <li className="nav-item me-3">
                <form
                  className="search-box"
                  role="search"
                  onSubmit={handleSearch}
                >
                  <input
                    className="search-input"
                    type="search"
                    placeholder="Search classes, artists..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button className="search-btn" type="submit">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </form>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link to="/profile" className="nav-link nv-btn">Profile</Link>
              </li>
              <li className="nav-item">
                <Link to="/artists" className="nav-link nv-btn">Artists</Link>
              </li>
              <li className="nav-item">
                <Link to="/lessons" className="nav-link nv-btn">Classes</Link>
              </li>
              <li className="nav-item">
                <Link to="/shop" className="nav-link nv-btn">Shop</Link>
              </li>
              <li className="nav-item">
                <Link to="/signin" className="signin-btn">Sign in</Link>
              </li>
            </ul>

          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
