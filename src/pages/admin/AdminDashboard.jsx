import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [classes, setClasses] = useState([]);
  const [artists, setArtists] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  // const [newClass, setNewClass] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetch("https://drawmaster-backend.onrender.com/lessons")
      .then(res => res.json())
      .then(setClasses);

    fetch("https://drawmaster-backend.onrender.com/artists")
      .then(res => res.json())
      .then(setArtists);

    fetch("https://drawmaster-backend.onrender.com/users")
      .then(res => res.json())
      .then(setUsers);

    fetch("https://drawmaster-backend.onrender.com/orders")
      .then(res => res.json())
      .then(setOrders);
  }, []);
  // const addClass = async () => {
  //   if (!newClass) return alert("Enter class name");

  //   const res = await fetch("http://localhost:5000/classes", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ title: newClass }),
  //   });

  //   const saved = await res.json();
  //   setClasses([...classes, saved]);
  //   setNewClass("");
  // };

  const deleteClass = async (id) => {
    if (!window.confirm("Delete this class?")) return;

    try {
      const res = await fetch(
        `https://drawmaster-backend.onrender.com/lessons/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        console.error("Delete failed:", res.status);
        alert("Delete failed");
        return;
      }

      setClasses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };
  const deleteArtist = async (id) => {
    await fetch(`https://drawmaster-backend.onrender.com/artists/${id}`, { method: "DELETE" });
    setArtists(artists.filter(a => a.id !== id));
  };
  const deleteOrder = async (id) => {
    await fetch(`https://drawmaster-backend.onrender.com/orders/${id}`, { method: "DELETE" });
    setOrders(orders.filter(o => o.id !== id));
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    await fetch(`https://drawmaster-backend.onrender.com/users/${id}`, {
      method: "DELETE",
    });
    setUsers(prev => prev.filter(u => u.id !== id));
  };
  const renderContent = () => {
    switch (activeTab) {
      case "classes":
        return (
          <>
            <div className="admin-header">
              <h2>Classes</h2>
              <button className="primary-btn" onClick={() => navigate("/add-lesson")}>+ Add New Class  </button>
            </div>
            {classes.length === 0 && <p>No classes found</p>}
            {classes.map(c => (
              <div key={c.id} className="admin-row">
                <div className="class-info">
                  <img  src={c.thumbnail || "/img/sight2.jpg"}  alt={c.title}  className="class-thumb"  onError={(e) => {  e.target.src = "/img/sight2.jpg";
                    }}
                  />
                  <span>{c.title}-{c.type}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteClass(c.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </>
        );
      case "artists":
        return (
          <>
            <h2>Artists</h2>
            {artists.map(a => (
              <div key={a.id} className="admin-row">
                {a.name}
                <button onClick={() => deleteArtist(a.id)}>Delete</button>
              </div>
            ))}
          </>
        );
      case "users":
        return (
          <>
            <h2>Users</h2>
            {users.length === 0 && <p>No users found</p>}
            {users.map(u => (
              <div key={u.id} className="admin-row">
                <span>{u.name} — {u.email}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteUser(u.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </>
        );
      case "orders":
        return (
          <>
            <h2>Orders</h2>
            {orders.map(o => (
              <div key={o.id} className="admin-row">
                <div className="order-info">
                  <strong>{o.productTitle}</strong>
                  <span>₹{o.price}</span>
                </div>
                <div className="order-meta">
                  <span>{o.customer?.name}</span>
                  <span>{o.customer?.phone}</span>
                  <span>{o.status}</span>
                </div>
                <button onClick={() => deleteOrder(o.id)}>
                  Delete
                </button>
              </div>
            ))}
          </>
        );
      default:
        return (
          <div className="dashboard">
            <h2 className="dashboard-title">Admin Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Classes</h3>
                <p>{classes.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Artists</h3>
                <p>{artists.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Users</h3>
                <p>{users.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p>{orders.length}</p>
              </div>
              <div className="stat-card highlight">
                <h3>Active Classes</h3>
                <p>{classes.filter(c => c.videoUrl).length}</p>
              </div>
              <div className="stat-card highlight">
                <h3>Verified Artists</h3>
                <p>{artists.filter(a => a.verified).length}</p>
              </div>
            </div>
          </div>
        );
    }
  };
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h1>DrawMaster</h1>
        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("classes")}>Classes</button>
        <button onClick={() => setActiveTab("artists")}>Artists</button>
        <button onClick={() => setActiveTab("users")}>Users</button>
        <button onClick={() => setActiveTab("orders")}>Orders</button>
      </aside>
      <main className="admin-main">{renderContent()}</main>
    </div>
  );
};
export default AdminDashboard;
