import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { gameAPI, postAPI } from "../../services/api";
import { getStoredUser } from "../../services/api";

// Import game thumbnails (keep your images as fallback)
import fort from "/src/assets/images/fortnite.jpg";
import apex from "/src/assets/images/apex.jpg";
import valo from "/src/assets/images/valo.jpg";
import cod from "/src/assets/images/cod.jpg";
import lol from "/src/assets/images/lol.jpg";
import pubg from "/src/assets/images/pubg.jpg";
import mc from "/src/assets/images/mc.jpg";
import ow from "/src/assets/images/ow.jpg";

// Map game names to images (fallback if API doesn't provide images)
const gameImageMap = {
  "Minecraft": mc,
  "Valorant": valo,
  "Apex Legends": apex,
  "Call of Duty": cod,
  "Fortnite": fort,
  "League of Legends": lol,
  "Overwatch 2": ow,
  "PUBG": pubg,
};

export default function Home() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user);
  }, []);

  // ✅ Fetch games from API when component mounts
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await gameAPI.getAllGames();
        // Handle response format (could be array or object with games property)
        const gamesArray = Array.isArray(data) ? data : (data.games || []);
        setGames(gamesArray);
      } catch (err) {
        setError("Failed to load games. Please try again later.");
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // ✅ Fetch active posts from API
  const fetchPosts = async () => {
    try {
      const data = await postAPI.getAllPosts();
      const postsArray = Array.isArray(data) ? data : (data.posts || []);
      setPosts(postsArray);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleJoinPost = async (postId, postOwnerId) => {
    // Check if user is the creator
    if (currentUser && currentUser.id === postOwnerId) {
      alert("You are the creator, you are already in");
      return;
    }

    try {
      const response = await postAPI.joinPost(postId);
      alert(response.message || "You joined successfully");
      // Refresh posts to update player count and button state
      fetchPosts();
    } catch (err) {
      alert(err.message || "Failed to join post");
    }
  };

  const handleCancelJoin = async (postId, postOwnerId) => {
    // Check if user is the creator
    if (currentUser && currentUser.id === postOwnerId) {
      alert("You are the creator, you cannot leave your own post");
      return;
    }

    try {
      const response = await postAPI.cancelJoin(postId);
      alert(response.message || "You left the post successfully");
      // Refresh posts to update player count and button state
      fetchPosts();
    } catch (err) {
      alert(err.message || "Failed to leave post");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postAPI.deletePost(postId);
      alert('Post deleted successfully');
      fetchPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert(err.message || 'Failed to delete post');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="home-page">
        <div className="container text-center py-5">
          <p className="text-light">Loading games...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="home-page">
        <div className="container text-center py-5">
          <p className="text-danger">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      
      {/* HERO */}
      <section className="hero-section">
        <div className="container text-center py-5">
          <h1 className="display-1 fw-bold text-gradient mb-4">
            FIND YOUR SQUAD
          </h1>
          <p className="lead text-light opacity-90 mb-5" style={{ maxWidth: "700px", margin: "0 auto" }}>
            Stop solo-queuing with randoms. Connect with skilled, like-minded players and dominate in every game.
          </p>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <button className="btn btn-glow btn-lg px-5 py-3 rounded-pill">
              Start Finding Teammates
            </button>
            <button className="btn btn-outline-glow btn-lg px-5 py-3 rounded-pill">
              Browse All Games
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED GAMES */}
      <section className="featured-games py-5">
        <div className="container">
          <h2 className="text-center text-gradient display-5 fw-bold mb-5">Featured Games</h2>
          <div className="row g-4 justify-content-center">
            {games.length > 0 ? (
              games.map((game) => {
                const gameName = game.name || game.title || "Unknown";
                // Prefer `pictureUrl` from API (used by ManageGames), then `imageUrl`, then fallbacks
                const gameImage = game.pictureUrl || game.imageUrl || gameImageMap[gameName] || valo;
                const gameId = game.id;
                
                return (
                  <div key={game.id || gameName} className="col-6 col-sm-4 col-md-3 col-lg-2">
                    <div 
                      className="game-card glass" 
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/requestform?gameId=${gameId}`)}
                    >
                      <div className="game-img-wrapper">
                        <img
                          src={gameImage}
                          alt={gameName}
                          className="game-img"
                          onError={(e) => {
                            // If the URL fails to load (not an image, 404, etc.), fall back to default
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = valo;
                          }}
                        />
                        <div className="game-overlay">
                          <span className="play-text">Create Post</span>
                        </div>
                      </div>
                      <h3 className="game-title text-gradient mt-3">{gameName}</h3>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center">
                <p className="text-light">No games available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ACTIVE POSTS */}
      <section className="active-posts py-5">
        <div className="container">
          <h2 className="text-center text-gradient display-5 fw-bold mb-5">Active Posts</h2>
          {loadingPosts ? (
            <div className="text-center py-5">
              <p className="text-light">Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="row g-4">
              {posts.map((post) => (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <div className="post-card glass p-4 h-100">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h4 className="text-gradient mb-0">{post.title}</h4>
                      <span className="badge bg-success">Active</span>
                    </div>
                    <p className="post-desc mb-3" style={{ minHeight: "60px" }}>
                      {post.hasJoined ? (
                        post.partyCode ? `Party code: ${post.partyCode}` : (post.description || "No details")
                      ) : (
                        "Party code is hidden — join to reveal"
                      )}
                    </p>
                    <div className="post-meta mb-3">
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        <span className="badge bg-primary">
                          {post.game?.name || "Unknown Game"}
                        </span>
                        <span className="badge bg-info">
                          {post.currentPlayers}/{post.teamSize} Players
                        </span>
                        {/* Show rank from multiple possible response fields */}
                        {(() => {
                          const rankCandidate = post.rank || post.playerRank || post.player_rank || post.requestedRank || null;
                          if (rankCandidate) {
                            return (
                              <span className="badge bg-warning text-dark">
                                Rank: {rankCandidate}
                              </span>
                            );
                          }
                          return null;
                        })()}
                        {post.voiceChat && (
                          <span className="badge bg-success">
                            🎧 Voice Chat
                          </span>
                        )}
                      </div>
                      {(() => {
                        const createdRaw = post.createdAt || post.CreatedAt || post.created_at || post.createdAtUtc || post.createdAtUTC || null;
                        let createdText = "Unknown date";
                        if (createdRaw) {
                          const d = new Date(createdRaw);
                          if (!isNaN(d.getTime())) createdText = d.toLocaleString();
                        }

                        return (
                          <p className="text-muted small mb-0">
                            Created by: <strong>{post.owner?.firstName} {post.owner?.lastName}</strong> (@{post.owner?.username}) | {createdText}
                          </p>
                        );
                      })()}
                    </div>
                    {currentUser?.id === post.owner?.id ? (
                      <button
                        className="btn btn-danger btn-sm w-100"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete Post
                      </button>
                    ) : post.hasJoined === true ? (
                      <button 
                        className="btn btn-danger btn-sm w-100"
                        onClick={() => handleCancelJoin(post.id, post.owner?.id)}
                      >
                        Cancel Join
                      </button>
                    ) : (
                      <button 
                        className="btn btn-glow btn-sm w-100"
                        onClick={() => handleJoinPost(post.id, post.owner?.id)}
                        disabled={post.currentPlayers >= post.teamSize || currentUser?.id === post.owner?.id}
                      >
                        {post.currentPlayers >= post.teamSize ? "Post Full" : 
                         currentUser?.id === post.owner?.id ? "Your Post" : "Join This Post"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-light">No active posts available. Be the first to create one!</p>
              <button 
                className="btn btn-glow mt-3"
                onClick={() => navigate("/requestform")}
              >
                Create Post
              </button>
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-choose py-5">
        <div className="container">
          <h2 className="text-center text-gradient display-5 fw-bold mb-5">Why Millions Choose Us</h2>
          <div className="row g-5">
            {[
              { icon: "Target", title: "Precision Matching", desc: "AI-powered filters: rank, playstyle, mic, region" },
              { icon: "Zap", title: "Instant Connection", desc: "No waiting. Find teammates in under 30 seconds" },
              { icon: "Shield", title: "Safe & Trusted", desc: "Verified profiles, rating system, zero toxicity" },
              { icon: "Trophy", title: "Proven Results", desc: "Used by Champion stacks & esports orgs" },
            ].map((item, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="feature-box glass text-center p-4">
                  <div className="feature-icon mb-3">
                    <div className="icon-glow">{item.icon}</div>
                  </div>
                  <h4 className="text-gradient">{item.title}</h4>
                  <p className="text-light opacity-80 small">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}