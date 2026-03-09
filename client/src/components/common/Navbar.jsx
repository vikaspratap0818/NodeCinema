import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sun, Moon, Search as SearchIcon, LogOut, User as UserIcon } from 'lucide-react';
import { logout } from '../../features/authSlice';
import './Navbar.css'; 
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Apply Theme
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="NodeCinema Logo" className="nav-logo-img" />
          <span className="logo-accent">Node</span>Cinema
        </Link>
        
        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search movies, tv shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <SearchIcon size={18} />
          </button>
        </form>

        <div className="nav-links">
          <button onClick={toggleTheme} className="icon-btn theme-toggle">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {userInfo ? (
            <div className="dropdown">
              <button className="user-btn">
                <UserIcon size={20} />
                <span className="username">{userInfo.username}</span>
              </button>
              <div className="dropdown-content">
                <Link to="/profile">Profile / Watchlist</Link>
                {userInfo.role === 'admin' && (
                  <Link to="/admin">Admin Dashboard</Link>
                )}
                <button onClick={handleLogout} className="logout-btn">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="login-link">Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
