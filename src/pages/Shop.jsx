import React, { useState, useEffect } from "react";
import "../style/Shop.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../context/AuthContext";

const Shop = () => {
  const { user, isLoggedIn } = useAuth();

  const [artworks, setArtworks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);

  const [orderData, setOrderData] = useState({
    address: "",
  });

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  useEffect(() => {
    fetch("https://drawmaster-backend.onrender.com/artworks")
      .then((res) => res.json())
      .then((data) => setArtworks(data))
      .catch(() => console.error("Failed to load artworks"));
  }, []);

  const handleFilterChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const filteredArtworks =
    selectedTypes.length === 0
      ? artworks
      : artworks.filter((art) => selectedTypes.includes(art.type));

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={i < fullStars ? "fa-solid fa-star" : "fa-regular fa-star"}
      ></i>
    ));
  };

  const openOrderModal = (art) => {
    if (!isLoggedIn || !user) {
      alert("Please login to place an order");
      return;
    }
    setSelectedArt(art);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setOrderData({ address: "" });
  };

  const handleChange = (e) => {
    setOrderData({ address: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const order = {
      userId: user.id,
      productId: selectedArt.id,
      productTitle: selectedArt.title,
      price: selectedArt.price,
      image: selectedArt.image,
      customer: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: orderData.address,
      },
      status: "active",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("https://drawmaster-backend.onrender.com/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) {
        throw new Error("Order failed");
      }

      alert("Order placed successfully!");
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Order failed. Please try again.");
    }

  };

  return (
    <div className="shop-page" data-aos="fade-up">
      <div className="shop-top">
        <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
          <i className="fa-solid fa-sliders"></i> Show filters
        </button>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <h4>Artwork Type</h4>
          {[...new Set(artworks.map(a => a.type))].map(type => (
            <label key={type}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleFilterChange(type)}
              />
              {type}
            </label>
          ))}
        </div>
      )}

      <div className="shop-grid">
        {filteredArtworks.map((art) => (
          <div className="shop-card" key={art.id}>
            <img src={art.image} alt={art.title} />
            <p>{art.title}</p>
            <div>{renderStars(art.rating)} ({art.reviews})</div>
            <span>₹{art.price}</span>

            <button className="add-btn" onClick={() => openOrderModal(art)}>
              Order artwork
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedArt && (
        <div className="modal-overlay">
          <div className="order-modal">

            <div className="modal-left">
              <img src={selectedArt.image} alt={selectedArt.title} />
            </div>

            <form className="modal-right" onSubmit={handleSubmit}>
              <h3>{selectedArt.title}</h3>

              <input value={user.name} disabled />
              <input value={user.email} disabled />
              <input value={user.phone} disabled />

              <textarea
                placeholder="Delivery Address"
                required
                value={orderData.address}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button type="submit" className="confirm-btn">
                  Confirm Order
                </button>
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Shop;
