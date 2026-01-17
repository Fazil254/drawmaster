import { useEffect, useState } from "react";
import "../style/Lessons.css";
import { useLocation, useNavigate } from "react-router-dom";
const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
const searchQuery = location.state?.q?.toLowerCase() || "";
const selectedTypeFromNav = location.state?.type || "";
const [activeFilter, setActiveFilter] = useState("all");
const filteredLessons = lessons.filter(item => {
  const matchesSearch =
    !searchQuery ||
    item.title?.toLowerCase().includes(searchQuery) ||
    item.instructor?.toLowerCase().includes(searchQuery) ||
    item.type?.toLowerCase().includes(searchQuery);
  const matchesButtonFilter =
    activeFilter === "all" || item.type === activeFilter;

  const matchesNavType =
    !selectedTypeFromNav || item.type === selectedTypeFromNav;

  return matchesSearch && matchesButtonFilter && matchesNavType;
});

  useEffect(() => {
    fetch("https://drawmaster-backend.onrender.com/lessons")
      .then((res) => res.json())
      .then((data) => {
        setLessons(data);
        setFilteredLessons(data);
      })
      .catch(() => console.warn("Lessons not loaded"));
  }, []);
  const handleFilter = (type) => {
    setActiveFilter(type);

    if (type === "all") {
      setFilteredLessons(lessons);
    } else {
      setFilteredLessons(lessons.filter((l) => l.type === type));
    }
  };

  return (
    <div className="lessons-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Master Head Construction</h1>
          <p>
            Learn drawing fundamentals using the Asaro head method with
            real-time MediaPipe face overlay practice.
          </p>

          <button
            className="hero-btn"
            onClick={() => navigate("/AsaroMediaPipeOverlay")}
          >
            Try Asaro MediaPipe Overlay
          </button>
        </div>

        <div className="hero-image">
          <img
            src="/img/loomis6.png"
            alt="Asaro Overlay Preview"
          />
        </div>
      </div>
      <div className="top-bar">
        <button
          className="filter-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <i className="fa-solid fa-sliders"></i>
          <span style={{ marginLeft: "8px" }}>Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="filter-panel">
          {[
            { key: "all", label: "All" },
            { key: "loomis", label: "Loomis" },
            { key: "grid", label: "Grid" },
            { key: "gesture", label: "Gesture" },
            { key: "block-in", label: "Block-In" },
            { key: "comparative", label: "Comparative" },
            { key: "sight-size", label: "Sight-Size" },
          ].map((item) => (
            <button
              key={item.key}
              className={activeFilter === item.key ? "active" : ""}
              onClick={() => handleFilter(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      <div className="lesson-grid">
        {filteredLessons.map((item) => (
          <div
            key={item.id}
            className="lesson-card"
            onClick={() => navigate(`/lesson/${item.id}`)}
          >
            <img src={item.thumbnail} alt={item.title} />

            <span className="overlay">{item.duration}</span>

            <div className="lesson-content">
              <h3 className="lesson-title">{item.title}</h3>
              <p className="lesson-desc">{item.description}</p>
              <p className="lesson-instructor">{item.instructor}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Lessons;
