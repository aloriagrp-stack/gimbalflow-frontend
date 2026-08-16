import React, { useState } from 'react';
import { Clock, Search, Star, Download, Trash2, Image as ImageIcon, Video, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ImageHistoryPage({ 
  history = [], 
  setHistory, 
  favorites = [], 
  setFavorites, 
  showToast 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'image' | 'video'
  const navigate = useNavigate();

  const toggleFavorite = (item) => {
    const isFav = favorites.some(f => f.id === item.id);
    if (isFav) {
      if (setFavorites) setFavorites(prev => prev.filter(f => f.id !== item.id));
      if (showToast) showToast('Removed from Favorites');
    } else {
      if (setFavorites) setFavorites(prev => [item, ...prev]);
      if (showToast) showToast('Added to Favorites! ⭐');
    }
  };

  const handleDelete = (id) => {
    if (setHistory) setHistory(prev => prev.filter(h => h.id !== id));
    if (showToast) showToast('Generation deleted from history');
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.model?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type?.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1200, margin: '0 auto', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            Generation History
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Complete archive of your rendered AI keyframes, image passes, and cinematic sequences.
          </p>
        </div>

        {/* SEARCH & TYPE FILTER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="nav-search-box" style={{ width: 240, height: 38 }}>
            <Search size={14} />
            <input 
              type="text" 
              placeholder="Search history prompts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
            {['all', 'image', 'video'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`skeuo-pill-btn ${filterType === t ? 'active' : ''}`}
                style={{ padding: '4px 12px', fontSize: '0.76rem', textTransform: 'capitalize' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HISTORY LIST CONTENT */}
      {filteredHistory.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={64} style={{ color: '#475569', opacity: 0.5, marginBottom: 16 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f0fdf4', margin: '0 0 8px 0' }}>
            No History Generations Found
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: 460, margin: '0 auto 24px auto', lineHeight: 1.5 }}>
            When you render images or videos in the workspace, they will automatically be recorded in this dedicated history page.
          </p>
          <button 
            type="button"
            onClick={() => navigate('/image')}
            style={{
              background: 'linear-gradient(180deg, #0cf700 0%, #08b000 100%)',
              color: '#020408',
              fontWeight: 900,
              fontSize: '0.88rem',
              padding: '10px 22px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Create New Generation
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {filteredHistory.map(item => {
            const isFav = favorites.some(f => f.id === item.id);
            return (
              <div 
                key={item.id} 
                className="card-skeuo" 
                style={{ 
                  padding: 0, 
                  overflow: 'hidden', 
                  borderRadius: 16, 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div style={{ position: 'relative', height: 240, background: '#05080f' }}>
                  <img src={item.url} alt="Generation preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.85)', padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(12,247,0,0.4)', fontSize: '0.72rem', color: '#0cf700', fontWeight: 800 }}>
                    {item.type || 'IMAGE'} • {item.model || 'Higgsfield Pro'}
                  </div>

                  <button 
                    style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', padding: 8, cursor: 'pointer' }}
                    onClick={() => toggleFavorite(item)}
                    title={isFav ? "Unfavorite" : "Favorite"}
                  >
                    <Star size={15} color={isFav ? "#0cf700" : "#94a3b8"} fill={isFav ? "#0cf700" : "none"} />
                  </button>
                </div>

                <div style={{ padding: 16, background: '#060a12', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                      {item.prompt}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: 8 }}>
                      Rendered on {item.date || 'Today'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <a 
                      href={item.url} 
                      download 
                      className="btn-secondary btn-sm"
                      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <Download size={14} /> Download
                    </a>

                    <button 
                      className="btn-secondary btn-sm"
                      onClick={() => handleDelete(item.id)}
                      style={{ color: '#ef4444' }}
                      title="Delete from history"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
