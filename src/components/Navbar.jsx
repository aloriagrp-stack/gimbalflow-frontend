import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Image as ImageIcon, Video, Film, Sparkles, 
  Search, User, Menu, X 
} from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar({ credits, user, profile, onOpenSignOut }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleOutsideClick = () => setDropdownOpen(false);
    if (dropdownOpen) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [dropdownOpen]);

  const isHome = location.pathname === '/' || location.pathname === '/explore';
  const isImagePage = location.pathname.startsWith('/image');

  return (
    <header className={`app-header ${isHome ? '' : 'navbar-compact'}`}>
      {/* BRAND LOGO & PLAIN WHITE TEXT */}
      <div className="brand-area">
        <Link to="/" className="word-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.svg" alt="GimbalFlow Logo" className="brand-logo-img" style={{ height: isHome ? 32 : 26, width: isHome ? 32 : 26, borderRadius: 6, objectFit: 'contain', transition: 'all 0.2s ease' }} />
          <span className="brand-text desktop-only" style={{ fontSize: isHome ? '1.2rem' : '1.08rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'font-size 0.2s ease' }}>
            {isImagePage ? 'images' : 'GimbalFlow'}
          </span>
        </Link>
      </div>

      {/* GLOBAL APPLICATION NAVIGATION (HOME & IMAGE WORKSPACE) */}
      <nav className="global-nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-item-btn ${isActive ? 'active' : ''}`}>
          <Home size={15} /> <span className="nav-label">Home</span>
        </NavLink>
        <NavLink to="/image" className={({ isActive }) => `nav-item-btn ${isActive ? 'active' : ''}`}>
          <ImageIcon size={15} /> <span className="nav-label">Image</span>
        </NavLink>
      </nav>

      {/* INLINE SEARCH, CREDITS & USER PROFILE ACTIONS */}
      <div className="header-actions">
        <div className="nav-search-box">
          <Search size={14} />
          <input 
            type="text" 
            placeholder="Search models, presets..." 
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
          />
        </div>

        <div className="user-profile-menu-container" onClick={(e) => e.stopPropagation()}>
          <button 
            className="user-profile-btn desktop-only" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="User Account Menu"
          >
            <User size={18} />
            <span className="user-status-dot"></span>
          </button>

          <button 
            className="mobile-menu-btn mobile-only" 
            onClick={() => isImagePage ? navigate('/') : setDropdownOpen(!dropdownOpen)}
            aria-label={isImagePage ? "Close and go home" : "Open Menu"}
          >
            {isImagePage ? <X size={22} /> : (dropdownOpen ? <X size={22} /> : <Menu size={22} />)}
          </button>

          <ProfileDropdown 
            isOpen={dropdownOpen} 
            onClose={() => setDropdownOpen(false)}
            onOpenSignOut={onOpenSignOut}
            user={user || profile}
            credits={credits}
          />
        </div>
      </div>
    </header>
  );
}
