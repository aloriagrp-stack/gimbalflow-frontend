import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Clock, Star, Paperclip, ChevronLeft, ChevronRight, Zap, ArrowUpRight 
} from 'lucide-react';

export default function Sidebar({ 
  credits = 2360, 
  showToast 
}) {
  const [isCollapsed, setIsCollapsed] = useState(() => window.innerWidth <= 768);
  const navigate = useNavigate();

  // Auto-collapse on mobile screens
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const handleChange = (e) => {
      if (e.matches) setIsCollapsed(true);
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '64px' : '230px');
    return () => {
      document.documentElement.style.setProperty('--sidebar-width', '0px');
    };
  }, [isCollapsed]);

  return (
    <aside 
      className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        width: isCollapsed ? 64 : 230,
        minWidth: isCollapsed ? 64 : 230,
        height: '100%',
        maxHeight: '100%',
        overflowY: 'auto',
        flexShrink: 0,
        background: 'linear-gradient(180deg, #090c14 0%, #04060a 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isCollapsed ? '16px 8px' : '16px 12px',
        transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s ease',
        zIndex: 800,
        userSelect: 'none',
        position: 'relative'
      }}
    >
      {/* TOP SECTION: TOGGLE BUTTON & NAVIGATION LIST */}
      <div>
        {/* COLLAPSE TOGGLE BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', marginBottom: 20, padding: '0 4px' }}>
          {!isCollapsed && (
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              WORKSPACE
            </span>
          )}
          <button 
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ 
              borderRadius: '50%', 
              padding: 6, 
              width: 28, 
              height: 28, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* 1. HOME / WORKSPACE MAIN ROUTE (/image) */}
        <NavLink 
          to="/image" 
          end 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
          title="Home"
        >
          <div className="sidebar-item-icon">
            <Home size={16} />
          </div>
          {!isCollapsed && <span>Home</span>}
        </NavLink>

        {/* 2. GENERATION HISTORY ROUTE (/image/history) */}
        <NavLink 
          to="/image/history" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
          title="Generation History"
        >
          <div className="sidebar-item-icon">
            <Clock size={16} />
          </div>
          {!isCollapsed && <span>Generation History</span>}
        </NavLink>

        {/* 3. FAVORITES ROUTE (/image/favorites) */}
        <NavLink 
          to="/image/favorites" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
          title="Favorites"
        >
          <div className="sidebar-item-icon">
            <Star size={16} />
          </div>
          {!isCollapsed && <span>Favorites</span>}
        </NavLink>

        {/* 4. MY ATTACHMENTS ROUTE (/image/attachments) */}
        <NavLink 
          to="/image/attachments" 
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          style={{ textDecoration: 'none' }}
          title="My Attachments"
        >
          <div className="sidebar-item-icon">
            <Paperclip size={16} />
          </div>
          {!isCollapsed && <span>My Attachments</span>}
        </NavLink>
      </div>

      {/* BOTTOM SECTION: CREDITS & UPGRADE */}
      <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        {!isCollapsed ? (
          <div className="sidebar-credits-skeuo">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={16} color="#0cf700" fill="#0cf700" />
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff' }}>
                {credits.toLocaleString()} Credits
              </span>
            </div>
            
            <button 
              type="button" 
              className="btn-primary btn-sm"
              onClick={() => {
                if (showToast) showToast('Opening Director Pro Plan upgrade...');
                navigate('/billing');
              }}
              style={{
                width: '100%',
                justifyContent: 'center',
                background: 'linear-gradient(180deg, #0cf700 0%, #08b000 100%)',
                color: '#020408',
                fontWeight: 900,
                fontSize: '0.8rem',
                padding: '7px 12px',
                borderRadius: 10,
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 4px 12px rgba(12,247,0,0.3)'
              }}
            >
              <span>Upgrade</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }} title={`${credits} Credits`}>
            <Zap size={18} color="#0cf700" fill="#0cf700" />
            <button 
              type="button" 
              onClick={() => navigate('/billing')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              title="Upgrade Plan"
            >
              <ArrowUpRight size={16} color="#0cf700" />
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}
