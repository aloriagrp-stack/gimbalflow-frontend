import React, { useState } from 'react';
import { Sparkles, Search, Plus, Play, Bookmark, Share2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PresetsPage({ presets = [], onUsePreset, showToast }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [savedPresets, setSavedPresets] = useState([]);
  const [selectedPresetDetail, setSelectedPresetDetail] = useState(null);
  const [createPresetModal, setCreatePresetModal] = useState(false);

  // New Preset Form State
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetCat, setNewPresetCat] = useState('Cinematic');
  const [newPresetDesc, setNewPresetDesc] = useState('');

  const navigate = useNavigate();

  const handleToggleSave = (id, e) => {
    e?.stopPropagation();
    if (savedPresets.includes(id)) {
      setSavedPresets(savedPresets.filter(p => p !== id));
      showToast('Removed preset from My Presets.');
    } else {
      setSavedPresets([...savedPresets, id]);
      showToast('Saved to My Presets!');
    }
  };

  const handleCreatePresetSubmit = (e) => {
    e.preventDefault();
    if (!newPresetName.trim()) {
      showToast('Please enter a preset name.');
      return;
    }
    showToast(`Created new preset "${newPresetName}"!`);
    setCreatePresetModal(false);
    setNewPresetName('');
    setNewPresetDesc('');
  };

  const filteredPresets = presets.filter(p => {
    const matchesCat = category === 'All' || p.category.toLowerCase() === category.toLowerCase();
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="presets-container" style={{ padding: 24, maxWidth: 1300, margin: '0 auto', flex: 1, width: '100%' }}>
      
      {/* HEADER */}
      <div className="account-view-header split">
        <div>
          <h1 className="account-view-title">Viral Presets</h1>
          <p className="account-view-desc">Start with a proven creative direction in one click.</p>
        </div>
        <button className="btn-primary" onClick={() => setCreatePresetModal(true)}>
          <Plus size={16} /> Create Preset
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="projects-filter-bar card-skeuo" style={{ padding: '14px 18px', marginBottom: 24 }}>
        <div className="filter-chips-row">
          {['All', 'Cinematic', 'Character', 'Action', 'Fashion', 'Social'].map(cat => (
            <button
              key={cat}
              className={`filter-chip ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-box-wrap" style={{ maxWidth: 280 }}>
          <Search size={15} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search presets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* PRESETS GRID */}
      {filteredPresets.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {filteredPresets.map(pst => {
            const isSaved = savedPresets.includes(pst.id);
            return (
              <div key={pst.id} className="card-skeuo project-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedPresetDetail(pst)}>
                <div className="project-thumb-box" style={{ background: '#000' }}>
                  <img src={pst.thumbnail} alt={pst.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="project-type-badge">{pst.category.toUpperCase()}</span>
                  <button 
                    className="project-menu-trigger" 
                    onClick={(e) => handleToggleSave(pst.id, e)}
                    style={{ color: isSaved ? '#eab308' : '#fff' }}
                  >
                    <Bookmark size={14} fill={isSaved ? '#eab308' : 'none'} />
                  </button>
                </div>

                <div className="project-info-body">
                  <h3 className="project-title">{pst.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#a19f8a', lineHeight: 1.4 }}>{pst.description}</p>
                  
                  <div className="project-stats-row" style={{ marginTop: 6 }}>
                    <span>By {pst.creator}</span>
                    <span>• {pst.popularity}</span>
                  </div>

                  <div className="project-footer-row">
                    <button className="btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); onUsePreset(pst); }}>
                      <Sparkles size={14} /> Use Preset
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-box card-skeuo">
          <div className="empty-icon">✨</div>
          <h3 className="empty-title">No Presets Found</h3>
          <p className="empty-desc">No presets match your current filter or search criteria.</p>
        </div>
      )}

      {/* PRESET DETAIL MODAL */}
      {selectedPresetDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedPresetDetail(null)}>
          <div className="modal-card card-skeuo" style={{ maxWidth: 720, textAlign: 'left', padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <span className="brand-badge">{selectedPresetDetail.category.toUpperCase()}</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fefce8', marginTop: 4 }}>{selectedPresetDetail.title}</h2>
              </div>
              <button className="btn-secondary btn-sm" onClick={() => setSelectedPresetDetail(null)}><X size={16} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ height: 240, background: '#000', borderRadius: 8, overflow: 'hidden' }}>
                <img src={selectedPresetDetail.thumbnail} alt={selectedPresetDetail.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: '0.82rem', color: '#a19f8a' }}>
                  <strong>Camera:</strong> {selectedPresetDetail.camera} <br />
                  <strong>Lens:</strong> {selectedPresetDetail.lens} <br />
                  <strong>Model:</strong> {selectedPresetDetail.model}
                </div>
                <div className="card-skeuo" style={{ padding: 12, fontSize: '0.8rem', background: '#040302' }}>
                  "{selectedPresetDetail.promptTemplate}"
                </div>
                <button className="btn-primary" style={{ marginTop: 'auto', justifyContent: 'center' }} onClick={() => { onUsePreset(selectedPresetDetail); setSelectedPresetDetail(null); }}>
                  <Sparkles size={16} /> Launch Setup with Preset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PRESET MODAL */}
      {createPresetModal && (
        <div className="modal-backdrop" onClick={() => setCreatePresetModal(false)}>
          <div className="modal-card card-skeuo" style={{ maxWidth: 500, textAlign: 'left', padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title" style={{ textAlign: 'left', marginBottom: 14 }}>Create Custom Preset</h3>
            
            <form onSubmit={handleCreatePresetSubmit} className="account-form-grid">
              <div className="form-group full-width">
                <label className="form-label">Preset Name</label>
                <input type="text" className="form-input" value={newPresetName} onChange={(e) => setNewPresetName(e.target.value)} required placeholder="e.g. Cyberpunk Drone Sweep" />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Category</label>
                <select className="form-select" value={newPresetCat} onChange={(e) => setNewPresetCat(e.target.value)}>
                  <option value="Cinematic">Cinematic</option>
                  <option value="Character">Character</option>
                  <option value="Action">Action</option>
                  <option value="Fashion">Fashion</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows="3" value={newPresetDesc} onChange={(e) => setNewPresetDesc(e.target.value)} placeholder="Describe the creative direction..." />
              </div>

              <div className="modal-actions-row" style={{ gridColumn: 'span 2', justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="btn-secondary" onClick={() => setCreatePresetModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Preset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
