import React, { useState } from 'react';
import { 
  X, Clock, Star, Paperclip, Download, RefreshCw, 
  Trash2, ExternalLink, Upload, Image as ImageIcon, Video, Sparkles, Plus 
} from 'lucide-react';

export default function SidebarModal({ 
  modalType, 
  onClose, 
  history = [], 
  setHistory,
  favorites = [], 
  setFavorites,
  attachments = [], 
  setAttachments,
  showToast 
}) {
  if (!modalType) return null;

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
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setAttachments(prev => [newAtt, ...prev]);
      if (showToast) showToast(`Uploaded ${file.name} to My Attachments! ✓`);
    }
  };

  const handleDeleteAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
    if (showToast) showToast('Attachment deleted');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 4, 8, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }} onClick={onClose}>
      
      <div 
        className="card-skeuo" 
        style={{
          width: '100%',
          maxWidth: 820,
          maxHeight: '85vh',
          background: 'linear-gradient(180deg, #10141d 0%, #06080d 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 20,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.9)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* MODAL HEADER */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {modalType === 'history' && <Clock size={22} color="#0cf700" />}
            {modalType === 'favorites' && <Star size={22} color="#0cf700" fill="#0cf700" />}
            {modalType === 'attachments' && <Paperclip size={22} color="#0cf700" />}
            
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
              {modalType === 'history' && 'Generation History'}
              {modalType === 'favorites' && 'Favorites'}
              {modalType === 'attachments' && 'My Attachments'}
            </h2>
          </div>

          <button 
            className="btn-secondary btn-sm"
            onClick={onClose}
            style={{ borderRadius: '50%', padding: 8 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* MODAL BODY CONTENT */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>

          {/* 1. GENERATION HISTORY VIEW */}
          {modalType === 'history' && (
            <div>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                  <Clock size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p style={{ fontSize: '0.95rem', margin: 0 }}>No generations recorded yet.</p>
                  <span style={{ fontSize: '0.8rem' }}>Generations created in Image, Video, or Cinema Studio will appear here.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {history.map(item => {
                    const isFav = favorites.some(f => f.id === item.id);
                    return (
                      <div 
                        key={item.id} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 12,
                          padding: 12
                        }}
                      >
                        <img 
                          src={item.url} 
                          alt="History thumbnail" 
                          style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover', background: '#000' }} 
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0cf700', background: 'rgba(12, 247, 0, 0.12)', padding: '2px 8px', borderRadius: 4 }}>
                              {item.type || 'IMAGE'}
                            </span>
                            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.model || 'Higgsfield Cinema Pro'} • {item.date || 'Today'}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.prompt}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button 
                            className="btn-secondary btn-sm"
                            onClick={() => toggleFavorite(item)}
                            title={isFav ? "Unfavorite" : "Favorite"}
                          >
                            <Star size={14} color={isFav ? "#0cf700" : "#94a3b8"} fill={isFav ? "#0cf700" : "none"} />
                          </button>
                          <a 
                            href={item.url} 
                            download 
                            className="btn-secondary btn-sm"
                            title="Download"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Download size={14} />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. FAVORITES VIEW */}
          {modalType === 'favorites' && (
            <div>
              {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                  <Star size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700, color: '#f0fdf4' }}>No Favorites Marked Yet</p>
                  <span style={{ fontSize: '0.82rem' }}>Click the Star icon on any generation card to save it here for instant access!</span>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                  {favorites.map(item => (
                    <div 
                      key={item.id} 
                      style={{
                        background: '#090c14',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 12,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ position: 'relative', height: 160, background: '#000' }}>
                        <img src={item.url} alt="Fav thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', padding: 6, cursor: 'pointer' }}
                          onClick={() => toggleFavorite(item)}
                        >
                          <Star size={14} color="#0cf700" fill="#0cf700" />
                        </button>
                      </div>
                      <div style={{ padding: 12 }}>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {item.prompt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. MY ATTACHMENTS VIEW */}
          {modalType === 'attachments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                  Manage uploaded reference photos, textures, depth passes, and character sheets.
                </span>
                
                <label className="btn-primary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={14} />
                  <span>Upload File</span>
                  <input type="file" onChange={handleUploadAttachment} style={{ display: 'none' }} />
                </label>
              </div>

              {attachments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                  <Paperclip size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <p style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700, color: '#f0fdf4' }}>No Attachments Uploaded</p>
                  <span style={{ fontSize: '0.82rem' }}>Upload reference images or style sheets to use across your AI generations.</span>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                  {attachments.map(att => (
                    <div 
                      key={att.id} 
                      style={{
                        background: '#090c14',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 12,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{ position: 'relative', height: 140, background: '#000' }}>
                        <img src={att.url} alt={att.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ overflow: 'hidden' }}>
                          <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f0fdf4', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {att.name}
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{att.type} • {att.date}</span>
                        </div>
                        <button 
                          className="btn-secondary btn-sm"
                          onClick={() => handleDeleteAttachment(att.id)}
                          title="Delete attachment"
                          style={{ padding: 6 }}
                        >
                          <Trash2 size={13} color="#ef4444" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
