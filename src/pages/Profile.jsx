import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../style/Profile.css";




const Profile = () => {
  const { user, isLoggedIn, updateUser, logout } = useAuth();

  const [followingArtists, setFollowingArtists] = useState([]);
  const [myArtist, setMyArtist] = useState(null);
  const [showArtistForm, setShowArtistForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [cancelIndex, setCancelIndex] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [artistForm, setArtistForm] = useState({
    name: "",
    location: "",
    bio: "",
    avatar: "",
    cover: "",
  });


  useEffect(() => {
    if (!user) return;
    fetch("https://drawmaster-backend.onrender.com/artists")
      .then((res) => res.json())
      .then((artists) => {
        if (Array.isArray(user.following)) {
          const followed = artists.filter((a) =>
            user.following.map(String).includes(String(a.id))
          );
          setFollowingArtists(followed);
        }

        const mine = artists.find(
          (a) => String(a.createdBy) === String(user.id)
        );
        setMyArtist(mine || null);
      });

    fetch("https://drawmaster-backend.onrender.com/orders")
      .then(res => res.json())
      .then(setOrders);

  }, [user]);

  const convertToBase64 = (file, field) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setArtistForm((prev) => ({
        ...prev,
        [field]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateArtist = async (e) => {
    e.preventDefault();

    if (!artistForm.name || !artistForm.bio) {
      alert("Artist name and bio are required");
      return;
    }

    const newArtist = {
      id: Date.now().toString(),
      name: artistForm.name,
      username: artistForm.name,
      location: artistForm.location || "Earth",
      bio: artistForm.bio,
      avatar: artistForm.avatar,
      cover: artistForm.cover,
      followers: 0,
      verified: false,
      createdBy: user.id,
    };

    try {
      await fetch("https://drawmaster-backend.onrender.com/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArtist),
      });

      alert("Artist profile created!");
      setMyArtist(newArtist);
      setShowArtistForm(false);

      setArtistForm({
        name: "",
        location: "",
        bio: "",
        avatar: "",
        cover: "",
      });
    } catch (err) {
      console.error("Artist creation failed", err);
    }
  };

  const handleRemoveArtist = async () => {
    if (!myArtist) return;

    const confirm = window.confirm(
      "Are you sure you want to remove your artist account? This cannot be undone."
    );
    if (!confirm) return;

    try {
      await fetch(
        `https://drawmaster-backend.onrender.com/artists/${myArtist.id}`,
        { method: "DELETE" }
      );

      const updatedFollowing = Array.isArray(user.following)
        ? user.following.filter(
          (fid) => String(fid) !== String(myArtist.id)
        )
        : [];

      await fetch(`https://drawmaster-backend.onrender.com/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ following: updatedFollowing }),
      });

      updateUser({ ...user, following: updatedFollowing });
      setMyArtist(null);

      alert("Artist account removed successfully");
    } catch (err) {
      console.error("Remove artist failed", err);
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "This will permanently delete your account and artist profile. This action cannot be undone. Continue?"
    );
    if (!confirm) return;

    try {
      if (myArtist) {
        await fetch(
          `https://drawmaster-backend.onrender.com/artists/${myArtist.id}`,
          { method: "DELETE" }
        );
      }

      await fetch(
        `https://drawmaster-backend.onrender.com/users/${user.id}`,
        { method: "DELETE" }
      );

      alert("Your account has been deleted permanently.");
      logout();
    } catch (error) {
      console.error("Delete account failed", error);
      alert("Failed to delete account. Try again.");
    }
  };

  if (!isLoggedIn || !user) {
    return <h2>Please login first</h2>;
  }
  const handleCancelOrder = () => {
    if (!cancelReason) {
      alert("Please enter a cancellation reason");
      return;
    }

    const updatedOrders = [...orders];
    updatedOrders[cancelIndex] = {
      ...updatedOrders[cancelIndex],
      status: "Cancelled",
      cancelReason,
    };

    setOrders(updatedOrders);

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    setCancelIndex(null);
    setCancelReason("");
  };
 const handleDeleteOrder = async (orderId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to permanently delete this order?"
  );
  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `https://drawmaster-backend.onrender.com/orders/${orderId}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      throw new Error("Delete failed");
    }
    setOrders(prev => prev.filter(order => order.id !== orderId));

  } catch (error) {
    console.error(error);
    alert("Failed to delete order");
  }
};


  return (
    <div className="profile-layout">
      <div className="profile-left">
        <div className="profile-intro-card">
          <div className="profile-avatar">{user.name?.charAt(0)}</div>
          <h3>{user.name}</h3>
          <p className="sub-text">{user.email}</p>
          <p className="sub-text">{user.phone}</p>

          <div className="profile-stats">
            <div>
              <strong>{myArtist?.followers || 0}</strong>
              <span>Artist Followers</span>
            </div>
            <div>
              <strong>{user.following?.length || 0}</strong>
              <span>Following</span>
            </div>
          </div>
          <button
            className="btn outline"
            style={{ marginTop: "18px" }}
            onClick={logout}
          >
            Logout
          </button>
          <button
            className="btn unfollow"
            style={{ marginTop: "10px" }}
            onClick={handleDeleteAccount}
          >
            Delete My Account
          </button>
        </div>
      </div>
      <div className="profile-main">
        {!myArtist && !showArtistForm && (
          <button
            className="btn outline"
            onClick={() => setShowArtistForm(true)}
            style={{ marginBottom: "20px" }}
          >
            + Create Your Artist Profile
          </button>
        )}
        {showArtistForm && (
          <div className="create-artist-box" style={{ marginBottom: "20px" }}>
            <div className="form-header">
              <h3>Create Your Artist Profile</h3>
              <button
                className="btn outline btn-inline"
                onClick={() => setShowArtistForm(false)}
                style={{ marginBottom: "20px" }}

              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateArtist}>
              <input
                placeholder="Artist Name"
                value={artistForm.name}
                onChange={(e) =>
                  setArtistForm({ ...artistForm, name: e.target.value })
                }
              />

              <input
                placeholder="Location"
                value={artistForm.location}
                onChange={(e) =>
                  setArtistForm({ ...artistForm, location: e.target.value })
                }
              />

              <textarea
                placeholder="Short Bio"
                value={artistForm.bio}
                onChange={(e) =>
                  setArtistForm({ ...artistForm, bio: e.target.value })
                }
              />

              <label>Avatar Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  convertToBase64(e.target.files[0], "avatar")
                }
              />

              <label>Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  convertToBase64(e.target.files[0], "cover")
                }
              />

              <div className="form-actions">
                <button type="submit" className="btn primary" style={{ marginRight: "20px" }}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => setShowArtistForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {myArtist && (
          <div className="create-artist-box" style={{ marginBottom: "20px" }}>
            <h3>Artist Account</h3>
            <p className="sub-text">
              You have an artist profile: <strong>{myArtist.name}</strong>
            </p>

            <button
              className="btn unfollow"
              onClick={handleRemoveArtist}
            >
              Remove Artist Account
            </button>
          </div>
        )}

        <div className="following-box">
          <h3>Following Artists</h3>

          {followingArtists.length === 0 && (
            <p className="empty-text">
              You are not following any artists yet.
            </p>
          )}

          {followingArtists.map((artist) => (
            <div key={artist.id} className="following-row">
              <img src={artist.avatar} alt={artist.name} />
              <div className="artist-info">
                <h4>{artist.name}</h4>
                <p>{artist.followers} followers</p>
              </div>

              <button
                className="btn small unfollow"
                onClick={async () => {
                  const updatedFollowing = user.following
                    .map(String)
                    .filter((fid) => fid !== String(artist.id));

                  await fetch(
                    `http://localhost:5000/users/${user.id}`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        following: updatedFollowing,
                      }),
                    }
                  );

                  updateUser({
                    ...user,
                    following: updatedFollowing,
                  });

                  setFollowingArtists((prev) =>
                    prev.filter(
                      (a) => String(a.id) !== String(artist.id)
                    )
                  );
                }}
              >
                Unfollow
              </button>
            </div>
          ))}
        </div>
        <div className="following-box" style={{ marginTop: "26px" }}>
          <h3>Your Orders</h3>

          {orders.length === 0 && (
            <p className="empty-text">You haven’t placed any orders yet.</p>
          )}

          {orders.map((order, index) => (
            <div key={order.id} className="following-row">
              <div className="artist-info">
                <h4>{order.productTitle}</h4>

                <p>₹{order.price}</p>

                <p>
                  Ordered on{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p>
                  Status: <strong>{order.status || "Confirmed"}</strong>
                </p>
                {order.status !== "Cancelled" && (
                  <button
                    className="btn unfollow small"
                    style={{ marginTop: "8px" }}
                    onClick={() => setCancelIndex(index)}
                  >
                    Cancel Order
                  </button>
                )}
                {order.status === "Cancelled" && (
                  <>
                    <p>
                      <strong>Reason:</strong> {order.cancelReason}
                    </p>

                    <button
                      className="btn unfollow small"
                      style={{ marginTop: "8px" }}
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Delete Order
                    </button>
                  </>
                )}
                {cancelIndex === index && (
                  <div style={{ marginTop: "12px" }}>
                    <textarea
                      placeholder="Enter cancellation reason"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      style={{ width: "100%", padding: "10px" }}
                    />
{/* 
                    <input
                      type="date"
                      value={extendedDate}
                      onChange={(e) => setExtendedDate(e.target.value)}
                      style={{ width: "100%", marginTop: "8px", padding: "8px" }}
                    /> */}

                    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                      <button
                        className="btn unfollow small"
                        onClick={handleCancelOrder}
                      >
                        Confirm Cancel
                      </button>

                      <button
                        className="btn outline small"
                        onClick={() => {
                          setCancelIndex(null);
                          setCancelReason("");
                          setExtendedDate("");
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default Profile;
