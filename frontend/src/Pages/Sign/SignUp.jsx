import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import "./Auth.css";

export default function SignUp({ setUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const gender = e.target.gender.value;

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // ✅ API call to register new user - matching backend RegisterRequest DTO
      const response = await authAPI.register({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        gender: gender // MALE or FEMALE
      });
      
      // ✅ Store JWT token and user data (auto-login after registration)
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
      setError(err.message || "Registration failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="glass-card auth-card" onSubmit={handleSignUp}>
        <h1>Create Account</h1>
        <p>Join us and start your journey.</p>

        <div className="auth-input">
          <label>First Name</label>
          <input type="text" name="firstName" placeholder="Enter your first name" required />
        </div>

        <div className="auth-input">
          <label>Last Name</label>
          <input type="text" name="lastName" placeholder="Enter your last name" required />
        </div>

        <div className="auth-input">
          <label>Username</label>
          <input type="text" name="username" placeholder="Choose a username" required />
        </div>

        <div className="auth-input">
          <label>Email</label>
          <input type="email" name="email" placeholder="Enter your email" required />
        </div>

        <div className="auth-input">
          <label>Password</label>
          <input type="password" name="password" placeholder="Create a password" required />
        </div>

        <div className="auth-input">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" placeholder="Re-enter your password" required />
        </div>

        <div className="auth-input">
          <label>Gender</label>
          <select name="gender" required>
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <button type="submit" className="glow-btn auth-btn" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="switch-text">
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </form>
    </div>
  );
}
