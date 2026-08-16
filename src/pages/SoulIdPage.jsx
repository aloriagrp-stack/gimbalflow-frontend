import React from 'react';
import { UserCheck, Upload, Sparkles } from 'lucide-react';

export default function SoulIdPage({ showToast }) {
  return (
    <div style={{ padding: 24, maxWidth: 1300, margin: '0 auto', flex: 1, width: '100%' }}>
      <div className="account-view-header">
        <h1 className="account-view-title">Soul ID Character Persistence Lab</h1>
        <p className="account-view-desc">Lock character facial anatomy, style signature, and outfit consistency across multi-scene generations.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card-skeuo" style={{ padding: 24 }}>
          <h3 className="account-card-title">Train Soul ID Token</h3>
          <p className="account-card-desc">Upload 3-5 high resolution facial reference photos to lock geometry.</p>
          <div className="upload-drop-zone" onClick={() => showToast('Opening Reference Photo Upload...')}>
            <Upload size={28} color="#eab308" />
            <h4 style={{ fontSize: '0.9rem', marginTop: 8 }}>Drop Facial References Here</h4>
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => showToast('Training Soul ID Character Token...')}>
            <Sparkles size={16} /> Train Character Token
          </button>
        </div>

        <div className="card-skeuo" style={{ padding: 24 }}>
          <h3 className="account-card-title">Active Character Tokens</h3>
          <div className="asset-item-card card-skeuo" style={{ marginTop: 16 }}>
            <div className="asset-item-thumb">
              <span className="asset-tag soul">Soul ID Locked</span>
              <UserCheck size={32} color="#eab308" />
            </div>
            <h4 className="asset-name">Kira Vance (Protagonist)</h4>
            <p className="asset-meta">Character Token: @kira_vance_v3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
