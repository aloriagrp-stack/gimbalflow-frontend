import React from 'react';
import { Star, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ImageFavoritesPage({ 
  favorites = [], 
  setFavorites, 
  showToast 
}) {
  const navigate = useNavigate();

  const handleRemoveFavorite = (id) => {
    if (setFavorites) setFavorites(prev => prev.filter(f => f.id !== id));
    if (showToast) showToast('Removed from Favorites');
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1200, margin: '0 auto', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* PAGE HEADER */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          Favorites
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
          Your curated gallery of favorited AI keyframes, renders, and prompt concepts.
        </p>
      </div>

      {/* FAVORITES GRID CONTENT */}
      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Star size={64} style={{ color: '#475569', opacity: 0.5, marginBottom: 16 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f0fdf4', margin: '0 0 8px 0' }}>
            No Favorites Saved Yet
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: 440, margin: '0 auto 24px auto', lineHeight: 1.5 }}>
            Click the Star icon on any creation in the workspace or history to bookmark it here for fast retrieval.
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
            Explore & Generate
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {favorites.map(item => (
            <div 
              key={item.id} 
              className="card-skeuo" 
              style={{ 
                padding: 0, 
                overflow: 'hidden', 
                borderRadius: 16, 
                display: 'flex', 
                flexDirection: 'column',
                border: '1px solid rgba(12, 247, 0, 0.2)'
              }}
            >
              <div style={{ position: 'relative', height: 260, background: '#05080f' }}>
                <img src={item.url} alt="Fav render" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(12, 247, 0, 0.5)', borderRadius: '50%', padding: 8, cursor: 'pointer' }}
                  onClick={() => handleRemoveFavorite(item.id)}
                  title="Remove from favorites"
                >
                  <Star size={16} color="#0cf700" fill="#0cf700" />
                </button>
              </div>

              <div style={{ padding: 16, background: '#060a12', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
                <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {item.prompt}
                </p>

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
                    onClick={() => handleRemoveFavorite(item.id)}
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
