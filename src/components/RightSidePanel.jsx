import React from 'react';
import { 
  X, Clock, Star, Paperclip, Download, Trash2, Plus, ImageIcon, Zap 
} from 'lucide-react';

export default function RightSidePanel({ 
  activePanel, 
  onClose, 
  history = [], 
  setHistory,
  favorites = [], 
  setFavorites,
  attachments = [], 
  setAttachments,
  showToast 
}) {
  if (!activePanel) return null;

  const toggleFavorite = (item) => {
    const isFav = favorites.some(f => f.id === item.id);
    if (isFav) {
      setFavorites(prev => prev.filter(f => f.id !== item.id));
      if (showToast) showToast('Removed from Favorites');
    } else {
      setFavorites(prev => [item, ...prev]);
      if (showToast) showToast('Added to Favorites! ⭐');
    }
  };

  const handleUploadAttachment = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAtt = {
        id: `att-${Date.now()}`,
        name: file.name,
        type: file.type.startsWith('video') ? 'Video' : 'Image',
        url: URL.createObjectURL(file),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
      setAttachments(prev => [newAtt, ...prev]);
      if (showToast) showToast(`Uploaded ${file.name}! ✓`);
    }
  };

  const handleDeleteAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
    if (showToast) showToast('Attachment deleted');
  };

  return (
    <aside 
      className="right-side-panel"
      style={{
        position: 'fixed',
        top: 48,
        right: 0,
        width: 360,
        height: 'calc(100vh - 48px)',
        background: 'linear-gradient(180deg, #0e121b 0%, #06080e 100%)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '-12px 0 36px rgba(0, 0, 0, 0.85)',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none'
      }}
    >
      {/* PANEL HEADER */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {activePanel === 'history' && 'Generation History'}
            {activePanel === 'favorites' && 'Favorites'}
            {activePanel === 'attachments' && 'My Attachments'}
          </h3>
        </div>

        <button 
          type="button"
          className="btn-secondary btn-sm"
          onClick={onClose}
          style={{ borderRadius: '50%', padding: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Close panel"
        >
          <X size={15} />
        </button>
      </div>

      {/* PANEL BODY CONTENT */}
      <div style={{ padding: 16, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        
        {/* 1. GENERATION HISTORY PANEL */}
        {activePanel === 'history' && (
          <>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 16px', color: '#64748b' }}>
                <Clock size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: '0.9rem', margin: 0, fontWeight: 700, color: '#cbd5e1' }}>No History Recorded</p>
                <span style={{ fontSize: '0.78rem' }}>Generations created in workspace will appear here in real-time.</span>
              </div>
            ) : (
              history.map(item => {
                const isFav = favorites.some(f => f.id === item.id);
                return (
                  <div 
                    key={item.id} 
                    style={{
                      background: 'linear-gradient(180deg, #141926 0%, #090c14 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 12,
                      padding: 12,
                      display: 'flex',
                      gap: 12,
                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0,0,0,0.5)'
                    }}
                  >
                    <img src={item.url} alt="History thumb" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', background: '#000' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0cf700', background: 'rgba(12,247,0,0.12)', padding: '2px 6px', borderRadius: 4 }}>
                          {item.type || 'IMAGE'}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.date || 'Just now'}</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.prompt}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                        <button 
                          className="btn-secondary btn-sm" 
                          onClick={() => toggleFavorite(item)} 
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        >
                          <Star size={12} color={isFav ? '#0cf700' : '#94a3b8'} fill={isFav ? '#0cf700' : 'none'} />
                        </button>
                        <a 
                          href={item.url} 
                          download 
                          className="btn-secondary btn-sm" 
                          style={{ padding: '4px 8px', fontSize: '0.72rem', textDecoration: 'none' }}
                          target="_blank" 
                          rel="noreferrer"
                        >
                          <Download size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* 2. FAVORITES PANEL */}
        {activePanel === 'favorites' && (
          <>
            {favorites.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 16px', color: '#64748b' }}>
                <Star size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: '0.9rem', margin: 0, fontWeight: 700, color: '#cbd5e1' }}>No Favorites Saved</p>
                <span style={{ fontSize: '0.78rem' }}>Click the Star icon on any creation to save it to your sidebar panel!</span>
              </div>
            ) : (
              favorites.map(item => (
                <div 
                  key={item.id} 
                  style={{
                    background: 'linear-gradient(180deg, #141926 0%, #090c14 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 12,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'relative', height: 140, background: '#000' }}>
                    <img src={item.url} alt="Fav preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.75)', border: 'none', borderRadius: '50%', padding: 6, cursor: 'pointer' }}
                      onClick={() => toggleFavorite(item)}
                    >
                      <Star size={13} color="#0cf700" fill="#0cf700" />
                    </button>
                  </div>
                  <div style={{ padding: 10 }}>
                    <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.prompt}
                    </p>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* 3. MY ATTACHMENTS PANEL */}
        {activePanel === 'attachments' && (
          <>
            {/* SINGLE CENTRAL UPLOAD DROPZONE BUTTON */}
            <label 
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: 'linear-gradient(180deg, rgba(20, 25, 38, 0.6) 0%, rgba(9, 12, 20, 0.8) 100%)',
                border: '2px dashed rgba(12, 247, 0, 0.4)',
                borderRadius: 14,
                padding: '24px 16px',
                textAlign: 'center',
                marginBottom: 6,
                transition: 'all 0.25s ease'
              }}
            >
              <Plus size={22} color="#0cf700" />
              <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#ffffff' }}>Upload Reference Asset</span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Upload style sheets, character cards, or depth textures.</span>
              <input type="file" onChange={handleUploadAttachment} style={{ display: 'none' }} />
            </label>

            {attachments.length > 0 && (
              attachments.map(att => (
                <div 
                  key={att.id}
                  style={{
                    background: 'linear-gradient(180deg, #141926 0%, #090c14 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 12,
                    padding: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                    <img src={att.url} alt={att.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                    <div style={{ overflow: 'hidden' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {att.name}
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{att.type} • {att.date}</span>
                    </div>
                  </div>
                  <button 
                    className="btn-secondary btn-sm" 
                    onClick={() => handleDeleteAttachment(att.id)}
                    style={{ padding: 6 }}
                    title="Delete"
                  >
                    <Trash2 size={13} color="#ef4444" />
                  </button>
                </div>
              ))
            )}
          </>
        )}

      </div>
    </aside>
  );
}
