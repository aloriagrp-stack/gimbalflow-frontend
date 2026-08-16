import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, CreditCard, Folder, Box, 
  SunMoon, HelpCircle, LogOut 
} from 'lucide-react';

export default function ProfileDropdown({ isOpen, onClose, onOpenSignOut, user, credits }) {
  if (!isOpen) return null;

  const initials = (user && user.name ? user.name.trim() : 'U')
    .split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="profile-dropdown-menu" onClick={(e) => e.stopPropagation()}>
      {/* USER IDENTITY HEADER — real Google profile */}
      <div className="dropdown-header-block">
        {user && user.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} className="user-avatar-img" />
        ) : (
          <div className="user-avatar-lg"><span>{initials}</span></div>
        )}
        <div className="user-meta-details">
          <span className="user-display-name">{user ? user.name : 'Guest User'}</span>
          <span className="user-email-text">{user ? user.email : 'not signed in'}</span>
          <div className="user-plan-badge-row">
            <span className="plan-pill">{(user && user.plan_tier) ? user.plan_tier.toUpperCase() : 'FREE'}</span>
            <span className="credits-pill">⚡ {(credits !== undefined ? credits : (user ? user.credits_balance : 0)).toLocaleString()} Credits</span>
          </div>
        </div>
      </div>

      <div className="dropdown-divider"></div>

      {/* SECTION 1: ACCOUNT & ASSETS */}
      <div className="dropdown-section">
        <Link to="/profile" className="dropdown-item" onClick={onClose}>
          <span className="icon"><Settings size={15} /></span>
          <span>Profile</span>
        </Link>
        <Link to="/settings" className="dropdown-item" onClick={onClose}>
          <span className="icon"><Settings size={15} /></span>
          <span>Settings</span>
        </Link>
        <Link to="/billing" className="dropdown-item" onClick={onClose}>
          <span className="icon"><CreditCard size={15} /></span>
          <span>Billing & Credits</span>
        </Link>
        <Link to="/projects" className="dropdown-item" onClick={onClose}>
          <span className="icon"><Folder size={15} /></span>
          <span>My Projects</span>
        </Link>
        <Link to="/assets" className="dropdown-item" onClick={onClose}>
          <span className="icon"><Box size={15} /></span>
          <span>My Assets</span>
        </Link>
      </div>

      <div className="dropdown-divider"></div>

      {/* SECTION 2: PREFERENCES & SUPPORT */}
      <div className="dropdown-section">
        <Link to="/appearance" className="dropdown-item dropdown-item-between" onClick={onClose}>
          <span className="item-left">
            <span className="icon"><SunMoon size={15} /></span>
            <span>Appearance</span>
          </span>
          <span className="item-right-badge">System ›</span>
        </Link>
        <Link to="/help" className="dropdown-item" onClick={onClose}>
          <span className="icon"><HelpCircle size={15} /></span>
          <span>Help & Support</span>
        </Link>
      </div>

      <div className="dropdown-divider"></div>

      {/* SECTION 3: SIGN OUT */}
      <div className="dropdown-section">
        <button className="dropdown-item danger" onClick={() => { onClose(); onOpenSignOut(); }}>
          <span className="icon"><LogOut size={15} /></span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}