import React, { useState } from 'react';
import { Search, Compass, Sparkles, Folder, Box, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchModal({ isOpen, onClose, creations = [], presets = [], projects = [], assets = [] }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredCreations = q ? creations.filter(c => c.title.toLowerCase().includes(q) || c.prompt?.toLowerCase().includes(q)) : creations.slice(0, 3);
  const filteredPresets = q ? presets.filter(p => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)) : presets.slice(0, 3);
  const filteredProjects = q ? projects.filter(p => p.title.toLowerCase().includes(q)) : projects.slice(0, 3);
  const filteredAssets = q ? assets.filter(a => a.name.toLowerCase().includes(q)) : assets.slice(0, 3);

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card card-skeuo" style={{ maxWidth: 640, textAlign: 'left', padding: 20 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <Search size={18} color="#eab308" />
            <input 
              type="text" 
              className="form-input" 
              style={{ width: '100%', background: 'transparent', border: 'none', boxShadow: 'none', fontSize: '1rem', color: '#fefce8' }} 
              placeholder="Search creations, presets, projects, assets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <button className="btn-secondary btn-sm" onClick={onClose} style={{ padding: '4px 8px' }}><X size={16} /></button>
        </div>

        <div style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* CREATIONS */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a19f8a', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Compass size={12} color="#eab308" /> Creations ({filteredCreations.length})
            </div>
            {filteredCreations.length > 0 ? (
              filteredCreations.map(item => (
                <div key={item.id} className="dropdown-item" onClick={() => handleSelect('/explore')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.title}</span>
                  <span className="brand-badge">{item.type}</span>
                </div>
              ))
            ) : <div style={{ fontSize: '0.78rem', color: '#575547', paddingLeft: 8 }}>No matching creations</div>}
          </div>

          {/* PRESETS */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a19f8a', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={12} color="#eab308" /> Presets ({filteredPresets.length})
            </div>
            {filteredPresets.length > 0 ? (
              filteredPresets.map(pst => (
                <div key={pst.id} className="dropdown-item" onClick={() => handleSelect('/presets')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{pst.title}</span>
                  <span className="brand-badge">{pst.category}</span>
                </div>
              ))
            ) : <div style={{ fontSize: '0.78rem', color: '#575547', paddingLeft: 8 }}>No matching presets</div>}
          </div>

          {/* PROJECTS & ASSETS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a19f8a', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Folder size={12} color="#eab308" /> Projects ({filteredProjects.length})
              </div>
              {filteredProjects.map(p => (
                <div key={p.id} className="dropdown-item" onClick={() => handleSelect('/projects')} style={{ cursor: 'pointer', fontSize: '0.78rem' }}>
                  {p.title}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a19f8a', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Box size={12} color="#eab308" /> Assets ({filteredAssets.length})
              </div>
              {filteredAssets.map(a => (
                <div key={a.id} className="dropdown-item" onClick={() => handleSelect('/assets')} style={{ cursor: 'pointer', fontSize: '0.78rem' }}>
                  {a.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
