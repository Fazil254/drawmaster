import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/LessonPlayer.css";

const LessonPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/lessons/${id}`)
      .then((res) => res.json())
      .then((data) => setLesson(data))
      .catch(() => console.warn("Lesson not loaded"));
  }, [id]);

  if (!lesson) return <p>Loading...</p>;

  return (
    <div className="player-page">

      <button className="back-btn" onClick={() => navigate("/lessons")}>
        ← Back to Lessons
      </button>

      <h2>{lesson.title}</h2>
      <p className="instructor">{lesson.instructor}</p>

      <div className="video-wrapper">
        <iframe
          src={lesson.videoUrl}
          title={lesson.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default LessonPlayer;
