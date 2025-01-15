import React, { useState, useContext } from "react";
import { AuthContext } from "../services/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./components-css/Header.css";

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);

  const [queryContent, setQueryContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSearchInPosts = async (e) => {
    e.preventDefault();
    const query = queryContent.trim();

    if (query.length < 3) {
      setMessage("Query must be at least 3 characters long.");
      return;
    }

    setMessage("");
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <header className="py-3 bg-light border-bottom">
      <div className="container d-flex flex-wrap align-items-center justify-content-between">
        {/* Logo Section */}
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <Link to="/" className="navbar-brand">
            <img id="logo" src="/assets/images/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="nav col-12 col-md-auto justify-content-center mb-3 mb-md-0">
          <li>
            <Link to="/" className="nav-link text-dark">
              Home
            </Link>
          </li>
          <li>
            <Link to="/categories" className="nav-link text-dark">
              Categories
            </Link>
          </li>
          <li>
            <Link to="/tags" className="nav-link text-dark">
              Tags
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <Link to="/user" className="nav-link text-dark">
                User
              </Link>
            </li>
          )}
        </ul>

        {/* Search Form */}
        <form
          className="d-flex flex-column flex-md-row align-items-center mb-3 mb-md-0"
          onSubmit={handleSearchInPosts}
        >
          <input
            type="search"
            className="form-control me-md-2 mb-2 mb-md-0"
            onChange={(e) => setQueryContent(e.target.value)}
            value={queryContent}
            placeholder="Search..."
            aria-label="Search"
          />
          <button type="submit" className="btn btn-outline-secondary">
            Search
          </button>
          {message && <p className="text-danger mt-2 mb-0">{message}</p>}
        </form>

        {/* Auth Buttons */}
        <div className="d-flex align-items-center">
          {isLoggedIn ? (
            <button onClick={logout} className="btn btn-outline-danger">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
