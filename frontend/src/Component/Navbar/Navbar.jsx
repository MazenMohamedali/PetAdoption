import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Menu } from "lucide-react";
import { getStoredUser, logout } from "../../services/api";
import "./Navbar.css";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get user from prop or localStorage
  const currentUser = user || getStoredUser();
  const isAdmin = currentUser?.role === "ADMIN";
  const isLoggedIn = !!currentUser;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
    window.location.reload(); // Refresh to update navbar
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid px-4 px-lg-5">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          SQUADFINDER
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          aria-label="Toggle navigation"
          onClick={toggleMenu} // هنا بنستدعي toggleMenu بدل bootstrap JS
        >
          <Menu size={28} className="text-cyan" />
        </button>

        {/* Collapsible Content */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarContent"
        >
          {/* Desktop Nav Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-5 d-none d-lg-flex">
            {isLoggedIn && (
              <>
                {isAdmin ? (
                  <li className="nav-item">
                    <Link to="/admin/dashboard" className="nav-link">
                      DASHBOARD
                    </Link>
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link to="/home" className="nav-link">
                        HOME
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/requestform" className="nav-link">
                        CREATE POST
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          {/* Auth Buttons */}
          <div className="d-flex gap-3 ms-lg-4">
            {isLoggedIn ? (
              <>
                <span className="text-light d-flex align-items-center me-3">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
                <button className="btn btn-outline-glow" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="btn btn-outline-glow">Sign In</Link>
                <Link to="/signup" className="btn btn-glow d-flex align-items-center gap-2">
                  Sign Up <ChevronRight size={20} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
