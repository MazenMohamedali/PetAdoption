import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { gameAPI, postAPI } from "../../services/api";
import "./RequestForm.css";

export default function RequestForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [title, setTitle] = useState("");
  const [partyCode, setPartyCode] = useState("");
  const [teamSize, setTeamSize] = useState(2);
  const [rank, setRank] = useState("");
  const [voiceChat, setVoiceChat] = useState(true);
  const [selectedMode, setSelectedMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingGames, setLoadingGames] = useState(true);

  // Fetch games from API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await gameAPI.getAllGames();
        const gamesArray = Array.isArray(data) ? data : (data.games || []);
        setGames(gamesArray);
        
        // If gameId is in URL params, pre-select it
        const gameIdParam = searchParams.get('gameId');
        if (gameIdParam) {
          const gameIdNum = parseInt(gameIdParam);
          const game = gamesArray.find(g => g.id === gameIdNum);
          if (game) {
            setSelectedGame(gameIdNum.toString());
          }
        }
      } catch (err) {
        console.error("Failed to load games:", err);
        setError("Failed to load games. Please try again.");
      } finally {
        setLoadingGames(false);
      }
    };
    fetchGames();
  }, [searchParams]);

  // Set selectedGame from URL param on mount
  useEffect(() => {
    const gameIdParam = searchParams.get('gameId');
    if (gameIdParam && !selectedGame) {
      setSelectedGame(gameIdParam);
    }
  }, [searchParams, selectedGame]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // If gameId is in URL but not selected, use it
    const gameIdParam = searchParams.get('gameId');
    const finalGameId = selectedGame || gameIdParam;
    
    if (!finalGameId) {
      setError("Please select a game");
      setLoading(false);
      return;
    }

    if (!title.trim()) {
      setError("Please enter a post title");
      setLoading(false);
      return;
    }

    try {
      await postAPI.createPost({
        title: title.trim(),
        partyCode: partyCode.trim() || null,
        teamSize: parseInt(teamSize),
        gameId: parseInt(finalGameId),
        rank: rank.trim() || null,
        voiceChat: voiceChat,
        mode: selectedMode || null,
      });

      // Success - navigate to home or show success message
      alert("Post created successfully!");
      navigate("/home");
    } catch (err) {
      setError(err.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rate-page">
      <div className="request-form glass-card">
        <h1>Create New Teammate Request</h1>
        <p>Fill out the form to create a post and find teammates.</p>

        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Choose game - Hide if gameId is provided in URL */}
          {!searchParams.get('gameId') && (
            <div className="section">
              <label>Choose Game *</label>
              {loadingGames ? (
                <select disabled>
                  <option>Loading games...</option>
                </select>
              ) : (
                <select 
                  value={selectedGame} 
                  onChange={(e) => setSelectedGame(e.target.value)}
                  required
                >
                  <option value="">Select a game</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name || game.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          
          {/* Show selected game if coming from game click */}
          {searchParams.get('gameId') && selectedGame && (
            <div className="section">
              <label>Selected Game</label>
              <div className="glass p-3" style={{ borderRadius: "8px" }}>
                <strong className="text-gradient">
                  {games.find(g => g.id === parseInt(selectedGame))?.name || "Loading..."}
                </strong>
              </div>
            </div>
          )}

          {/* Post Title */}
          <div className="section">
            <label>Post Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Looking for ranked teammates"
              required
              maxLength={200}
            />
          </div>

          {/* Party Code (hidden until join) */}
          <div className="section">
            <label>Party Code (hidden until players join)</label>
            <input
              type="text"
              value={partyCode}
              onChange={(e) => setPartyCode(e.target.value)}
              placeholder="Enter party code (visible only to joined players)"
              maxLength={200}
            />
            <small style={{ color: '#9ca3af', display: 'block', marginTop: '8px' }}>
              The party code will only be revealed to players who join this post.
            </small>
          </div>

          {/* Team Size */}
          <div className="section">
            <label>Team Size *</label>
            <input
              type="number"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              min="2"
              max="20"
              required
            />
            <small style={{ color: "#888", display: "block", marginTop: "0.5rem" }}>
              How many players do you need?
            </small>
          </div>

          {/* Rank */}
          <div className="section">
            <label>Rank</label>
            <input
              type="text"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="e.g., Gold, Diamond, Immortal"
              maxLength={50}
            />
          </div>

          {/* Toggles inside boxes */}
          <div className="toggle-row">
            <div className="toggle-box">
              <span>🎧 Voice Chat</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={voiceChat}
                  onChange={() => setVoiceChat(!voiceChat)}
                />
                <span className="slider"></span>
              </label>
            </div>

              <div className="toggle-box">
                <span>🎮 Mode</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/** Show modes from selected game, or a disabled select if none */}
                  {(() => {
                    const gameObj = games.find(g => g.id === parseInt(selectedGame));
                    const modes = gameObj?.modes || [];
                    if (modes.length > 0) {
                      return (
                        <select
                          value={selectedMode}
                          onChange={(e) => setSelectedMode(e.target.value)}
                          style={{ padding: '8px 10px', borderRadius: 8, background: '#1e2128', color: 'white', border: '1px solid rgba(62,20,146,0.6)' }}
                        >
                          <option value="">Any Mode</option>
                          {modes.map((m, i) => (
                            <option key={i} value={m}>{m}</option>
                          ))}
                        </select>
                      );
                    }

                    return (
                      <select disabled style={{ padding: '8px 10px', borderRadius: 8, background: '#2a2a34', color: '#888' }}>
                        <option>No modes</option>
                      </select>
                    );
                  })()}
                </div>
              </div>
          </div>

          <div className="btn-row">
            <button type="submit" className="glow-btn" disabled={loading || loadingGames}>
              {loading ? "Creating Post..." : "Create Post"}
            </button>
            <button 
              type="button" 
              className="glow-btn" 
              onClick={() => navigate("/home")}
              style={{ marginLeft: "1rem", background: "transparent" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
