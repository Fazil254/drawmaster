// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Auth.css";

// const Register = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Invalid email format";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (formData.confirmPassword !== formData.password) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     return newErrors;
//   };
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const checkRes = await fetch(
//         `http://localhost:5000/users?email=${formData.email.trim()}`
//       );

//       if (!checkRes.ok) throw new Error("Failed to check email");

//       const existingUsers = await checkRes.json();

//       if (existingUsers.length > 0) {
//         setErrors({ email: "Email already registered" });
//         setLoading(false);
//         return;
//       }

//       const createRes = await fetch("http://localhost:5000/users", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: formData.name.trim(),
//           email: formData.email.trim(),
//           password: formData.password,
//         }),
//       });

//       if (!createRes.ok) throw new Error("Failed to create user");

//       alert("Registration successful!");
//       navigate("/login");

//     } catch (error) {
//       console.error(error);
//       alert("Server error. Please check JSON Server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleSubmit} noValidate>
//         <h2>Create Account</h2>

//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           value={formData.name}
//           onChange={handleChange}
//         />
//         {errors.name && <p className="error">{errors.name}</p>}

//         <input
//           type="email"
//           name="email"
//           placeholder="Email Address"
//           value={formData.email}
//           onChange={handleChange}
//         />
//         {errors.email && <p className="error">{errors.email}</p>}

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//         />
//         {errors.password && <p className="error">{errors.password}</p>}

//         <input
//           type="password"
//           name="confirmPassword"
//           placeholder="Confirm Password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//         />
//         {errors.confirmPassword && (
//           <p className="error">{errors.confirmPassword}</p>
//         )}

//         <button type="submit" disabled={loading}>
//           {loading ? "Registering..." : "Register"}
//         </button>

//         <p className="switch">
//           Already have an account?
//           <span onClick={() => navigate("/login")}> Login</span>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Register;