import React from 'react';
import { GitBranch, Plus, Play } from 'lucide-react';

export default function CanvasPage({ showToast }) {
  return (
    <div style={{ padding: 24, maxWidth: 1300, margin: '0 auto', flex: 1, width: '100%' }}>
      <div className="account-view-header split">
        <div>
          <h1 className="account-view-title">Node Canvas Graph</h1>
          <p className="account-view-desc">Connect keyframe synthesis, motion vectors, and color grading nodes visually.</p>
        </div>
        <button className="btn-primary" onClick={() => showToast('Added New Prompt Node to Canvas...')}>
          <Plus size={16} /> Add Node
        </button>
      </div>

      <div className="card-skeuo" style={{ height: 500, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#040302', border: '1px border-glow' }}>
        <div style={{ textAlign: 'center' }}>
          <GitBranch size={48} color="#eab308" style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Node Graph Editor Ready</h3>
          <p style={{ fontSize: '0.84rem', color: '#a19f8a', marginTop: 4 }}>Drag nodes to compose complex multi-camera film sequences</p>
        </div>
      </div>
    </div>
  );
}
