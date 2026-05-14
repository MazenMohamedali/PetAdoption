import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, logout } from "../../services/api";
import ManageUsers from "./ManageUsers";
import ManageGames from "./ManageGames";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("games"); // "games" or "users"

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      navigate("/signin");
      return;
    }
    
    // Check if user is admin
    if (storedUser.role !== "ADMIN") {
      // Not admin, redirect to home
      navigate("/home");
      return;
    }
    
    setUser(storedUser);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  if (!user) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-4">
            <div>
              <h1 className="text-gradient mb-2">Admin Dashboard</h1>
              <p className="text-light opacity-75 mb-0">
                Welcome, {user.firstName} {user.lastName}
              </p>
            </div>
            <button className="btn btn-outline-glow" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* Tabs */}
        <div className="dashboard-tabs mb-4">
          <button
            className={`tab-btn ${activeTab === "games" ? "active" : ""}`}
            onClick={() => setActiveTab("games")}
          >
            🎮 Manage Games
          </button>
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Manage Users
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "games" && <ManageGames />}
          {activeTab === "users" && <ManageUsers />}
        </div>
      </div>
    </div>
  );
}

