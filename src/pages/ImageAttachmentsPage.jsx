import React from 'react';
import { Paperclip, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ImageAttachmentsPage({ 
  attachments = [], 
  setAttachments, 
  showToast 
}) {
  const navigate = useNavigate();

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAtt = {
        id: `att-${Date.now()}`,
        name: file.name,
        type: file.type.startsWith('video') ? 'Video' : 'Image',
        url: URL.createObjectURL(file),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      if (setAttachments) setAttachments(prev => [newAtt, ...prev]);
      if (showToast) showToast(`Uploaded ${file.name} to My Attachments! ✓`);
    }
  };

  const handleDelete = (id) => {
    if (setAttachments) setAttachments(prev => prev.filter(a => a.id !== id));
    if (showToast) showToast('Attachment deleted');
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1200, margin: '0 auto', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* PAGE HEADER & UPLOAD BUTTON */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            My Attachments & Reference Assets
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Store visual style sheets, depth passes, and reference photos for AI keyframe conditioning.
          </p>
        </div>

        <label 
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'linear-gradient(180deg, #0cf700 0%, #08b000 100%)',
            color: '#020408',
            fontWeight: 900,
            fontSize: '0.88rem',
            padding: '10px 20px',
            borderRadius: 10,
            boxShadow: 'none'
          }}
        >
          <Plus size={18} />
          <span>Upload Reference File</span>
          <input type="file" onChange={handleUpload} style={{ display: 'none' }} />
        </label>
      </div>

      {/* ATTACHMENTS GRID */}
      {attachments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Paperclip size={64} style={{ color: '#475569', opacity: 0.5, marginBottom: 16 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f0fdf4', margin: '0 0 8px 0' }}>
            No Attachments Uploaded Yet
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: 440, margin: '0 auto 24px auto', lineHeight: 1.5 }}>
            Upload character concept art, color swatches, or FPV drone references to use in your prompt pipelines.
          </p>
          <label 
            style={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(180deg, #0cf700 0%, #08b000 100%)',
              color: '#020408',
              fontWeight: 900,
              fontSize: '0.88rem',
              padding: '10px 22px',
              borderRadius: 10,
              boxShadow: 'none'
            }}
          >
            <Plus size={16} />
            <span>Upload Reference File</span>
            <input type="file" onChange={handleUpload} style={{ display: 'none' }} />
          </label>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {attachments.map(att => (
            <div 
              key={att.id} 
              className="card-skeuo" 
              style={{ 
                padding: 0, 
                overflow: 'hidden', 
                borderRadius: 16, 
                display: 'flex', 
                flexDirection: 'column',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ position: 'relative', height: 200, background: '#05080f' }}>
                <img src={att.url} alt={att.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: 14, background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ overflow: 'hidden' }}>
                  <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {att.name}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{att.type} • {att.date}</span>
                </div>

                <button 
                  className="btn-secondary btn-sm"
                  onClick={() => handleDelete(att.id)}
                  style={{ color: '#ef4444' }}
                  title="Delete attachment"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
