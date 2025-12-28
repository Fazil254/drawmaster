import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/AddLesson.css";
const AddLesson = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    type: "loomis",
    duration: "",
    instructor: user?.name || "",
    description: "",
    videoUrl: "",
    thumbnail: ""
  });
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, thumbnail: reader.result });
    };
    reader.readAsDataURL(file);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newLesson = {
      ...form,
      createdBy: user.id
    };
    await fetch("http://localhost:5000/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLesson)
    });
    navigate("/admin");
  };
  return (
    <div className="add-lesson">
      <h2>Upload New Class</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Class Title" onChange={handleChange} required />
        <input name="duration" placeholder="Duration (e.g. 8:20)" onChange={handleChange} />
        <select name="type" onChange={handleChange}>
          <option value="loomis">Loomis</option>
          <option value="grid">Grid</option>
          <option value="gesture">Gesture</option>
          <option value="block-in">Block-In</option>
        </select>
        <input name="videoUrl" placeholder="YouTube Embed URL" onChange={handleChange} />
        <textarea
          name="description"
          placeholder="Class description"
          onChange={handleChange}
        />
        <label className="upload-box">
          Upload Thumbnail
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
        </label>
        {form.thumbnail && (
          <img src={form.thumbnail} className="preview-img" alt="preview" />
        )}
        <button className="btn primary">Publish Class</button>
      </form>
    </div>
  );
};
export default AddLesson;
