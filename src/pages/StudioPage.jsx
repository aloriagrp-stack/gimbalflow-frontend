import React, { useState } from 'react';
import { Video, Sparkles, Sliders, Play, RotateCcw } from 'lucide-react';

export default function StudioPage({ showToast }) {
  const [prompt, setPrompt] = useState('Anamorphic 35mm shot of a futuristic cyberpunk director in a neon lit Tokyo alleyway, 60fps fluid motion.');
  const [model, setModel] = useState('seedance_2');
  const [rendering, setRendering] = useState(false);

  const handleGenerate = () => {
    setRendering(true);
    showToast('Initializing 60FPS Spatial Video Engine...');
    setTimeout(() => {
      setRendering(false);
      showToast('Render Complete! 4K Master Ready.');
    }, 2500);
  };

  return (
    <div className="studio-container" style={{ padding: 24, maxWidth: 1300, margin: '0 auto', flex: 1, width: '100%' }}>
      <div className="account-view-header">
        <h1 className="account-view-title">Cinema Studio</h1>
        <p className="account-view-desc">Spatial camera trajectories, anamorphic prime lenses, and multi-model generation pipeline.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* CANVAS RENDERER AREA */}
        <div className="card-skeuo" style={{ padding: 20, minHeight: 450, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#040302' }}>
          {rendering ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚡</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Synthesizing 60FPS Video...</h3>
              <p style={{ fontSize: '0.84rem', color: '#a19f8a', marginTop: 4 }}>Calculating spatial motion vectors & anamorphic pass</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(234, 179, 8, 0.2)', border: '1px solid #eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#eab308' }}>
                <Play size={28} fill="#eab308" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Studio Preview Canvas</h3>
              <p style={{ fontSize: '0.8rem', color: '#a19f8a', marginTop: 4 }}>Press Generate to render scene with Seedance v2</p>
            </div>
          )}
        </div>

        {/* CONTROL SIDEBAR */}
        <div className="card-skeuo" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Camera Controls</h3>
          
          <div className="form-group">
            <label className="form-label">AI Engine Model</label>
            <select className="form-select" value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="seedance_2">Seedance v2 (Spatial Motion)</option>
              <option value="higgs_pro">Higgsfield Cinema Pro</option>
              <option value="action_diff">ActionDiff v3 (Action Physics)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Camera Trajectory</label>
            <select className="form-select" defaultValue="fpv_drone">
              <option value="fpv_drone">FPV Drone Swoop</option>
              <option value="dolly_push">Dolly Push In</option>
              <option value="orbital_360">360° Orbital Arc</option>
              <option value="crane_tilt">Crane Tilt Down</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Anamorphic Lens</label>
            <select className="form-select" defaultValue="35mm">
              <option value="24mm">24mm Wide Anamorphic</option>
              <option value="35mm">35mm Prime Anamorphic</option>
              <option value="85mm">85mm Bokeh Portrait</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Creative Brief Prompt</label>
            <textarea 
              className="form-textarea" 
              rows="4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
          </div>

          <button className="btn-primary" style={{ justifyContent: 'center', marginTop: 10 }} onClick={handleGenerate} disabled={rendering}>
            <Sparkles size={16} /> {rendering ? 'Rendering...' : 'Generate 4K Video (25 Credits)'}
          </button>
        </div>
      </div>
    </div>
  );
}
