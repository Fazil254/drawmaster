import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/RegisterForm.css";

const RegisterFrom = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  if (isLoggedIn) {
    return (
      <div className="register-container">
        <div className="form-box">
          <h2>You are already logged in</h2>
          <p className="subtitle">
            Please logout before creating a new account.
          </p>

          <button
            className="submit-btn"
            onClick={() => navigate("/profile")}
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }
  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Minimum 6 characters required";
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (formData.phone.length < 10) {
      errors.phone = "Phone number must be 10 digits";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch("https://drawmaster-backend.onrender.com/users");
      const users = await res.json();

      const emailExists = users.some(
        (u) => u.email === formData.email
      );

      if (emailExists) {
        setMsg("Email already registered. Please login.");
        alert("Email already registered")
        setTimeout(() => navigate("/signin"), 1500);

        return;
      }

      await fetch("https://drawmaster-backend.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "user",
          following: [],
        }),
      });

      setMsg("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/signin"), 1500);

    } catch (error) {
      setMsg("Server error. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <div className="register-container">
      <form className="form-box" onSubmit={handleSubmit}>

        <button
          type="button"
          className="close-btn"
          onClick={() => navigate(-1)}
        >
          <i className="fa-solid fa-x"></i>
        </button>

        <h1 className="title">Create your account</h1>
        <h4 className="subtitle">Registration is easy.</h4>

        <label>Email address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label>First name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label>Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <p className="terms">
          By clicking Register, you agree to our
          <a href="#"> Terms</a> & <a href="#">Privacy Policy</a>
        </p>

        <div className="button-row">
          <button className="submit-btn" type="submit">
            Register
          </button>
        </div>

        {msg && <p className="success">{msg}</p>}
      </form>
    </div>
  );
};

export default RegisterFrom;
