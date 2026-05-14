import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import "./Auth.css";

export default function SignIn({ setUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const username = e.target.email.value; // Backend uses 'username' field
    const password = e.target.password.value;

    try {
      // ✅ API call to backend for authentication
      const response = await authAPI.login({ username, password });
      
      // ✅ Store JWT token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      
      // ✅ Redirect based on role
      if (response.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="glass-card auth-card" onSubmit={handleSignIn}>
        <h1>Sign In</h1>
        <p>Welcome back! Please sign in to continue.</p>

        <div className="auth-input">
          <label>Username</label>
          <input type="text" name="email" placeholder="Enter your username" required />
        </div>

        <div className="auth-input">
          <label>Password</label>
          <input type="password" name="password" placeholder="Enter your password" required />
        </div>
        
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <button type="submit" className="glow-btn auth-btn" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="switch-text">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
