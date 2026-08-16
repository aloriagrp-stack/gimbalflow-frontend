import React, { useState } from 'react';
import { Video as VideoIcon, Sparkles, Upload, Camera, Play, FolderPlus, Download, RefreshCw, Box } from 'lucide-react';

export default function VideoPage({ 
  onGenerate, 
  onAddToProject, 
  onSaveToAssets, 
  preloadedSetup = null,
  showToast 
}) {
  const [mode, setMode] = useState('text'); // 'text' | 'image'
  const [prompt, setPrompt] = useState(preloadedSetup?.prompt || 'A lone astronaut walking through a massive abandoned space station, cinematic lighting, slow camera movement.');
  const [model, setModel] = useState(preloadedSetup?.model || 'Seedance v2');
  const [duration, setDuration] = useState('0:05');
  const [aspectRatio, setAspectRatio] = useState(preloadedSetup?.aspectRatio || '16:9');
  const [cameraMotion, setCameraMotion] = useState(preloadedSetup?.camera || 'fpv_drone');
  const [sourceImg, setSourceImg] = useState(null);

  const [generating, setGenerating] = useState(false);
  const [genState, setGenState] = useState('Idle'); // Queued, Preparing, Generating, Completed
  const [activeVideo, setActiveVideo] = useState(null);
  const [myVideos, setMyVideos] = useState([]);

  const handleGenerateSubmit = (e) => {
    e.preventDefault();
    if (mode === 'text' && !prompt.trim()) {
      showToast('Please describe your scene.');
      return;
    }
    if (mode === 'image' && !sourceImg) {
      showToast('Please attach or select a source image for Image -> Video.');
      return;
    }

    setGenerating(true);
    setGenState('Queued...');

    const newJob = onGenerate('video', {
      prompt,
      model,
      duration,
      aspectRatio,
      cameraMotion,
      sourceImg
    });

    if (!newJob) {
      setGenerating(false);
      setGenState('Idle');
      return;
    }

    setTimeout(() => setGenState('Preparing Motion Vectors...'), 600);
    setTimeout(() => setGenState('Generating 60FPS Video Pass...'), 1400);

    setTimeout(() => {
      setGenerating(false);
      setGenState('Completed');
      const videoResult = {
        id: `vid-res-${Date.now()}`,
        title: prompt.slice(0, 30) + '...',
        prompt,
        model,
        duration,
        aspectRatio,
        camera: cameraMotion,
        date: 'Just now',
        url: sourceImg || 'https://image.pollinations.ai/prompt/cyberpunk%20city%20street%20at%20night%20neon%20signs%20rain%20cinematic?width=1000&height=562&seed=502&model=flux&nologo=true'
      };
      setActiveVideo(videoResult);
      setMyVideos(prev => [videoResult, ...prev]);
      showToast('Video generated successfully!');
    }, 2800);
  };

  return (
    <div className="video-workspace-container" style={{ padding: 24, maxWidth: 1350, margin: '0 auto', flex: 1, width: '100%' }}>
      
      {/* HEADER */}
      <div className="account-view-header">
        <h1 className="account-view-title">Video Workspace</h1>
        <p className="account-view-desc">Turn ideas and images into 60FPS fluid cinematic motion.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: 24 }}>
        
        {/* CREATION WORKSPACE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* MODE TABS */}
          <div className="card-skeuo" style={{ padding: 6, display: 'flex', gap: 6 }}>
            <button 
              type="button" 
              className={`btn-secondary ${mode === 'text' ? 'active' : ''}`}
              onClick={() => setMode('text')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Text → Video
            </button>
            <button 
              type="button" 
              className={`btn-secondary ${mode === 'image' ? 'active' : ''}`}
              onClick={() => setMode('image')}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Image → Video
            </button>
          </div>

          {/* PROMPT / IMAGE INPUT */}
          {mode === 'text' ? (
            <div className="card-skeuo" style={{ padding: 20 }}>
              <label className="form-label" style={{ fontSize: '0.88rem', marginBottom: 8 }}>Scene Description Brief</label>
              <textarea 
                className="form-textarea" 
                rows="4" 
                style={{ width: '100%', fontSize: '0.92rem' }}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your scene..."
              />
            </div>
          ) : (
            <div className="card-skeuo" style={{ padding: 20 }}>
              <label className="form-label" style={{ fontSize: '0.88rem', marginBottom: 8 }}>Source Keyframe Image</label>
              {sourceImg ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#040302', padding: 12, borderRadius: 8, border: '1px solid rgba(234, 179, 8, 0.4)' }}>
                  <img src={sourceImg} alt="Source" style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 6 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fefce8' }}>Image Attached</span>
                    <div style={{ fontSize: '0.74rem', color: '#a19f8a' }}>Ready for motion synthesis</div>
                  </div>
                  <button className="btn-secondary btn-sm" onClick={() => setSourceImg(null)}>Remove</button>
                </div>
              ) : (
                <div className="upload-drop-zone" onClick={() => setSourceImg('https://image.pollinations.ai/prompt/cyberpunk%20city%20street%20at%20night%20neon%20signs%20rain%20cinematic?width=500&height=500&seed=502&model=flux&nologo=true')} style={{ padding: 24 }}>
                  <Upload size={28} color="#eab308" />
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: 8 }}>Upload Image or Select from Assets</div>
                </div>
              )}

              <label className="form-label" style={{ fontSize: '0.84rem', marginTop: 14, marginBottom: 6 }}>Motion Prompt (Optional)</label>
              <input type="text" className="form-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe camera motion or subject action..." />
            </div>
          )}

          {/* CONTROLS */}
          <div className="card-skeuo" style={{ padding: 20 }}>
            <h3 className="account-card-title">Motion & Camera Controls</h3>
            
            <div className="account-form-grid">
              <div className="form-group">
                <label className="form-label">Video Engine Model</label>
                <select className="form-select" value={model} onChange={(e) => setModel(e.target.value)}>
                  <option value="Seedance v2">Seedance v2 (Fluid Motion)</option>
                  <option value="Higgsfield Cinema Pro">Higgsfield Cinema Pro</option>
                  <option value="ActionDiff v3">ActionDiff v3 (Action Physics)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Camera Motion Trajectory</label>
                <select className="form-select" value={cameraMotion} onChange={(e) => setCameraMotion(e.target.value)}>
                  <option value="fpv_drone">FPV Drone Swoop 360°</option>
                  <option value="dolly_push">Anamorphic Dolly Push</option>
                  <option value="pull_out">Pull Out Reveal</option>
                  <option value="orbit">360° Character Orbit</option>
                  <option value="crane_tilt">Crane Tilt Down</option>
                  <option value="static">Static Tripod Locked</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Aspect Ratio</label>
                <select className="form-select" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                  <option value="16:9">16:9 Widescreen Cinema</option>
                  <option value="9:16">9:16 Vertical Shorts</option>
                  <option value="21:9">21:9 Anamorphic Ultrawide</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <select className="form-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="0:05">5 Seconds (25 Credits)</option>
                  <option value="0:10">10 Seconds (50 Credits)</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            className="btn-primary" 
            style={{ padding: '14px 28px', fontSize: '1rem', justifyContent: 'center' }} 
            onClick={handleGenerateSubmit}
            disabled={generating}
          >
            <Sparkles size={18} /> {generating ? genState : 'Generate Video (25 Credits)'}
          </button>
        </div>

        {/* RESULTS PLAYER & METADATA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card-skeuo" style={{ padding: 20, minHeight: 480, display: 'flex', flexDirection: 'column' }}>
            <h3 className="account-card-title">Video Player Canvas</h3>
            
            {generating ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎬</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{genState}</h4>
                <p style={{ fontSize: '0.8rem', color: '#a19f8a', marginTop: 4 }}>Processing motion vectors & camera physics pass</p>
              </div>
            ) : activeVideo ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: 8, overflow: 'hidden', position: 'relative', marginBottom: 14 }}>
                  <img src={activeVideo.url} alt={activeVideo.prompt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(234, 179, 8, 0.4)', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={24} fill="#fff" />
                    </div>
                  </div>
                </div>

                <div className="card-skeuo" style={{ padding: 14, background: '#040302', marginBottom: 16 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fefce8' }}>"{activeVideo.prompt}"</div>
                  <div style={{ fontSize: '0.74rem', color: '#a19f8a', marginTop: 4 }}>
                    Model: {activeVideo.model} • Duration: {activeVideo.duration} • Trajectory: {activeVideo.camera}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 'auto' }}>
                  <button className="btn-secondary btn-sm" onClick={() => onSaveToAssets({ name: activeVideo.title, type: 'video', url: activeVideo.url })}>
                    <Box size={14} /> Save to Assets
                  </button>
                  <button className="btn-primary btn-sm" onClick={() => onAddToProject({ title: activeVideo.title, type: 'video' })}>
                    <FolderPlus size={14} /> Add to Project
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#a19f8a' }}>
                <VideoIcon size={42} color="#eab308" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fefce8' }}>No Video Generated Yet</h4>
                <p style={{ fontSize: '0.8rem', maxWidth: 260, marginTop: 4 }}>Enter your scene brief and click Generate Video.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
