import { useState, useEffect } from "react";
import { gameAPI } from "../../services/api";
import "./Dashboard.css";

export default function ManageGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    players: 2,
    pictureUrl: "",
    modes: []
  });
  const [modeInput, setModeInput] = useState("");

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await gameAPI.getAllGames();
      const gamesArray = Array.isArray(data) ? data : (data.games || []);
      setGames(gamesArray);
    } catch (err) {
      setError("Failed to load games: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMode = () => {
    if (modeInput.trim() && !formData.modes.includes(modeInput.trim())) {
      setFormData({
        ...formData,
        modes: [...formData.modes, modeInput.trim()]
      });
      setModeInput("");
    }
  };

  const handleRemoveMode = (mode) => {
    setFormData({
      ...formData,
      modes: formData.modes.filter(m => m !== mode)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Game name is required");
      return;
    }

    if (!formData.pictureUrl.trim()) {
      setError("Picture URL is required");
      return;
    }

    if (formData.modes.length === 0) {
      setError("At least one game mode is required");
      return;
    }

    try {
      // Ensure players is a number
      const playersNum = typeof formData.players === 'string' 
        ? parseInt(formData.players) 
        : formData.players;
      
      if (isNaN(playersNum) || playersNum < 1) {
        setError("Players must be a valid number (at least 1)");
        return;
      }

      const gameData = {
        name: formData.name.trim(),
        players: playersNum,
        pictureUrl: formData.pictureUrl.trim(),
        modes: formData.modes
      };

      if (editingGame) {
        // Update game using PUT endpoint
        await gameAPI.updateGame(editingGame.name, gameData);
      } else {
        await gameAPI.addGame(gameData);
      }

      // Reset form
      setFormData({ name: "", players: 2, pictureUrl: "", modes: [] });
      setShowAddForm(false);
      setEditingGame(null);
      setModeInput("");
      fetchGames();
      alert(editingGame ? "Game updated successfully!" : "Game added successfully!");
    } catch (err) {
      // Handle error response - check if it has error field or message
      const errorMsg = err.message || 
                      (err.error && typeof err.error === 'string' ? err.error : 
                      (err.details ? Object.values(err.details).join(', ') : 
                      "Failed to save game"));
      setError(errorMsg);
      console.error("Game save error:", err);
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      players: game.players,
      pictureUrl: game.pictureUrl,
      modes: game.modes || []
    });
    setShowAddForm(true);
  };

  const handleDelete = async (gameName) => {
    if (!window.confirm(`Are you sure you want to delete "${gameName}"?`)) {
      return;
    }

    try {
      await gameAPI.deleteGame(gameName);
      fetchGames();
      alert("Game deleted successfully!");
    } catch (err) {
      setError("Failed to delete game: " + err.message);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingGame(null);
    setFormData({ name: "", players: 2, pictureUrl: "", modes: [] });
    setModeInput("");
  };

  if (loading) {
    return <div className="text-center py-5"><p>Loading games...</p></div>;
  }

  return (
    <div className="manage-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-gradient">Games Management</h2>
        <button
          className="btn btn-glow"
          onClick={() => {
            setShowAddForm(true);
            setEditingGame(null);
            setFormData({ name: "", players: 2, pictureUrl: "", modes: [] });
          }}
        >
          + Add New Game
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="glass-card p-4 mb-4">
          <h3>{editingGame ? "Edit Game" : "Add New Game"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Game Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                maxLength={100}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Number of Players *</label>
              <input
                type="number"
                className="form-control"
                value={formData.players}
                onChange={(e) => setFormData({ ...formData, players: e.target.value })}
                min="1"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Picture URL *</label>
              <input
                type="url"
                className="form-control"
                value={formData.pictureUrl}
                onChange={(e) => setFormData({ ...formData, pictureUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Game Modes *</label>
              <div className="d-flex gap-2 mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={modeInput}
                  onChange={(e) => setModeInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMode();
                    }
                  }}
                  placeholder="Enter mode (e.g., Ranked, Casual)"
                />
                <button
                  type="button"
                  className="btn btn-outline-glow"
                  onClick={handleAddMode}
                >
                  Add Mode
                </button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {formData.modes.map((mode, idx) => (
                  <span key={idx} className="badge bg-primary d-flex align-items-center gap-2">
                    {mode}
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => handleRemoveMode(mode)}
                      style={{ fontSize: "0.7rem" }}
                    />
                  </span>
                ))}
              </div>
              <small className="text-muted">At least one mode is required</small>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-glow">
                {editingGame ? "Update Game" : "Add Game"}
              </button>
              <button
                type="button"
                className="btn btn-outline-glow"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Games List */}
      <div className="games-grid">
        {games.length === 0 ? (
          <p className="text-center text-light">No games found. Add your first game!</p>
        ) : (
          games.map((game) => (
            <div key={game.id} className="game-card glass p-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h4 className="text-gradient mb-0">{game.name}</h4>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-glow"
                    onClick={() => handleEdit(game)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(game.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-light small mb-2">
                <strong>Players:</strong> {game.players}
              </p>
              {game.pictureUrl && (
                <img
                  src={game.pictureUrl}
                  alt={game.name}
                  className="img-fluid rounded mb-2"
                  style={{ maxHeight: "150px", width: "100%", objectFit: "cover" }}
                />
              )}
              <div>
                <strong className="text-light small">Modes:</strong>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {game.modes && game.modes.map((mode, idx) => (
                    <span key={idx} className="badge bg-info">{mode}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

