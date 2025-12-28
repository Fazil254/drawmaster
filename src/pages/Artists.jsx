import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../style/Artists.css";

const Artists = () => {
  const { user, isLoggedIn, updateUser } = useAuth();
  const [artists, setArtists] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/artists")
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch(() => console.warn("Could not load artists"));
  }, []);
  const handleFollow = async (artistId) => {
    console.log("Follow clicked:", artistId);
    if (!isLoggedIn || !user) {
      alert("Please login first");
      return;
    }
    const id = String(artistId);
    const following = Array.isArray(user.following)
      ? user.following.map(String)
      : [];
    const isFollowing = following.includes(id);
    const updatedFollowing = isFollowing
      ? following.filter((fid) => fid !== id)
      : [...following, id];
    try {
      await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ following: updatedFollowing }),
      });
      updateUser({ ...user, following: updatedFollowing });
      const artist = artists.find((a) => String(a.id) === id);
      if (!artist) return;
      const updatedFollowers = isFollowing
        ? Math.max(0, artist.followers - 1)
        : artist.followers + 1;
      await fetch(`http://localhost:5000/artists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followers: updatedFollowers }),
      });
      setArtists((prev) =>
        prev.map((a) =>
          String(a.id) === id
            ? { ...a, followers: updatedFollowers }
            : a
        )
      );
    } catch (error) {
      console.error("Follow failed", error);
    }
  };
  return (
    <div className="artists-page">
      <div className="artists-grid">
        {artists.length === 0 ? (
          <p>Loading artists...</p>
        ) : (
          artists.map((artist) => {
            const isFollowing = Array.isArray(user?.following)
              ? user.following.map(String).includes(String(artist.id))
              : false;
            return (
              <div className="artist-card" key={artist.id}>
                <div className="artist-cover">
                  <img src={artist.cover} alt={artist.name} />
                </div>
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="artist-avatar"
                />
                <div className="artist-info">
                  <h3>{artist.name}</h3>
                  <p className="location">{artist.location}</p>
                  <p className="bio">{artist.bio}</p>

                  <div className="stats">
                    <span>{artist.followers} Followers</span>
                  </div>

                  <button
                    type="button"
                    className={`follow-btn ${
                      isFollowing ? "following" : ""
                    }`}
                    onClick={() => handleFollow(artist.id)}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Artists;
