import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/RegisterForm.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("https://drawmaster-backend.onrender.com/users");
      const users = await res.json();

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        setMsg("Invalid email or password");
        return;
      }
      login(user);

      setMsg("Login successful!");

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setMsg("Server error. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    setMsg("");

    try {
      const res = await fetch("https://drawmaster-backend.onrender.com/users");
      const users = await res.json();

      const user = users.find((u) => u.email === resetEmail);

      if (!user) {
        setMsg("Email not registered.");
        return;
      }

      await fetch(`https://drawmaster-backend.onrender.com/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      setMsg("Password reset successful. Please login.");
      setShowReset(false);
      setResetEmail("");
      setNewPassword("");
    } catch (error) {
      setMsg("Unable to reset password.");
    }
  };

  return (
    <div className="register-container">
      <form className="form-box" onSubmit={handleLogin}>
        <div className="auth-header">
          <h2 className="title">Sign in</h2>
          <Link to="/form" className="outline-btn">
            Register
          </Link>
        </div>

        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="login-options">
          <label className="remember">
            <input type="checkbox" /> Stay signed in
          </label>

          <button
            type="button"
            className="link-text"
            onClick={() => setShowReset(true)}
          >
            Forgot your password?
          </button>
        </div>

        <button type="submit" className="submit-btn dark-btn">
          Sign in
        </button>

        {msg && <p className="error-lg">{msg}</p>}

        <div className="divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="outline-btn social-btn"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>

        <p className="auth-note">
          We’ll never post without your permission.
        </p>
      </form>

      {showReset && (
        <>
          <div className="reset-overlay"></div>
          <div className="reset-box">
            <h3>Reset Password</h3>

            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="submit-btn dark-btn"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>

            <button
              type="button"
              className="outline-btn"
              onClick={() => setShowReset(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Login;
