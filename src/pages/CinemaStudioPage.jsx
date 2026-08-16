import React, { useState } from 'react';
import { Film, Camera, UserCheck, MapPin, Sun, Sparkles, Play, FolderPlus, Box, RefreshCw } from 'lucide-react';

export default function CinemaStudioPage({ 
  onGenerate, 
  onAddToProject, 
  onSaveToAssets, 
  assets = [],
  preloadedSetup = null,
  showToast 
}) {
  const [brief, setBrief] = useState(preloadedSetup?.prompt || 'A woman walks alone through Tokyo at midnight while rain reflects neon lights across the street.');
  
  // Structured Scene Breakdown
  const [sceneData, setSceneData] = useState({
    character: 'Female protagonist in cyber trenchcoat',
    location: 'Tokyo Street Alleyway',
    time: 'Night',
    weather: 'Rain / Wet Asphalt',
    mood: 'Cinematic / Mysterious'
  });

  // Cinema Rig Controls
  const [model, setModel] = useState('Seedance v2');
  const [shotType, setShotType] = useState('Wide Anamorphic');
  const [cameraMove, setCameraMove] = useState(preloadedSetup?.camera || 'fpv_drone');
  const [lens, setLens] = useState('35mm Prime');
  const [lighting, setLighting] = useState('Neon Cyberpunk Rim');

  // Selected Assets / Characters
  const [selectedCharacter, setSelectedCharacter] = useState('Kira Vance (@kira_vance)');
  const [selectedLocation, setSelectedLocation] = useState('Neo-Tokyo Skydeck 2099');

  const [generating, setGenerating] = useState(false);
  const [sceneResult, setSceneResult] = useState(null);
  const [variations, setVariations] = useState([]);

  const handleBuildSceneBrief = () => {
    showToast('AI Director decomposing brief into structured scene breakdown...');
    setSceneData({
      character: 'Protagonist (@kira_vance)',
      location: 'Neon Tokyo Wet Alleyway',
      time: 'Midnight (00:00)',
      weather: 'Heavy Rain & Volumetric Fog',
      mood: 'Film Noir / Cyberpunk Cinematic'
    });
  };

  const handleGenerateScene = () => {
    setGenerating(true);
    const newJob = onGenerate('cinema', {
      prompt: brief,
      model,
      shotType,
      cameraMove,
      lens,
      lighting,
      character: selectedCharacter,
      location: selectedLocation
    });

    if (!newJob) {
      setGenerating(false);
      return;
    }

    setTimeout(() => {
      setGenerating(false);
      const res = {
        id: `scene-res-${Date.now()}`,
        title: 'Directed Scene - Tokyo Rain',
        prompt: brief,
        model,
        camera: cameraMove,
        lens,
        lighting,
        character: selectedCharacter,
        location: selectedLocation,
        url: 'https://image.pollinations.ai/prompt/cyberpunk%20city%20street%20at%20night%20neon%20signs%20rain%20cinematic?width=1000&height=562&seed=502&model=flux&nologo=true'
      };
      setSceneResult(res);
      setVariations([res]);
      showToast('Cinematic Scene rendered successfully!');
    }, 3000);
  };

  const handleCreateVariation = () => {
    if (!sceneResult) return;
    showToast('Generating shot variation with alternate lighting pass...');
    const varRes = {
      ...sceneResult,
      id: `scene-var-${Date.now()}`,
      lighting: 'High-Contrast Film Noir',
      url: 'https://image.pollinations.ai/prompt/neon%20city%20skyline%20blade%20runner%20fog%20cinematic?width=1000&height=562&seed=503&model=flux&nologo=true'
    };
    setVariations(prev => [...prev, varRes]);
  };

  return (
    <div className="cinema-studio-container" style={{ padding: 24, maxWidth: 1400, margin: '0 auto', flex: 1, width: '100%' }}>
      
      {/* HEADER */}
      <div className="account-view-header">
        <h1 className="account-view-title">Cinema Studio</h1>
        <p className="account-view-desc">Direct multi-shot AI scenes with 3D camera orbits, anamorphic lenses, and persistent characters.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 24 }}>
        
        {/* LEFT PANEL: CREATIVE BRIEF & SCENE BREAKDOWN & RIG */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* CREATIVE BRIEF INPUT */}
          <div className="card-skeuo" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label className="form-label" style={{ fontSize: '0.88rem' }}>Creative Director Scene Brief</label>
              <button className="btn-secondary btn-sm" onClick={handleBuildSceneBrief}>
                <Sparkles size={14} color="#eab308" /> Decompose Brief
              </button>
            </div>

            <textarea 
              className="form-textarea" 
              rows="3" 
              style={{ width: '100%', fontSize: '0.92rem', marginBottom: 14 }}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Describe your scene brief..."
            />

            {/* STRUCTURED BREAKDOWN CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, background: '#040302', padding: 12, borderRadius: 8, border: '1px solid rgba(234, 179, 8, 0.3)' }}>
              <div>
                <span className="status-label">Character</span>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ padding: '3px 8px', fontSize: '0.75rem', marginTop: 2 }}
                  value={sceneData.character}
                  onChange={(e) => setSceneData({ ...sceneData, character: e.target.value })}
                />
              </div>
              <div>
                <span className="status-label">Location</span>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ padding: '3px 8px', fontSize: '0.75rem', marginTop: 2 }}
                  value={sceneData.location}
                  onChange={(e) => setSceneData({ ...sceneData, location: e.target.value })}
                />
              </div>
              <div>
                <span className="status-label">Time & Weather</span>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ padding: '3px 8px', fontSize: '0.75rem', marginTop: 2 }}
                  value={`${sceneData.time} • ${sceneData.weather}`}
                  onChange={(e) => setSceneData({ ...sceneData, time: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* CHARACTER & LOCATION SELECTION */}
          <div className="card-skeuo" style={{ padding: 20 }}>
            <h3 className="account-card-title">Assets & Persistent Identity</h3>
            
            <div className="account-form-grid">
              <div className="form-group">
                <label className="form-label">Persistent Character Token</label>
                <select className="form-select" value={selectedCharacter} onChange={(e) => setSelectedCharacter(e.target.value)}>
                  <option value="Kira Vance (@kira_vance)">Kira Vance (@kira_vance) - Soul ID Locked</option>
                  <option value="None">Generic Random Character</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Persistent 3D Virtual Set</label>
                <select className="form-select" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                  <option value="Neo-Tokyo Skydeck 2099">Neo-Tokyo Skydeck 2099</option>
                  <option value="Sci-Fi Steel Hangar">Sci-Fi Steel Hangar</option>
                  <option value="Desert Dune Ruins">Desert Dune Ruins</option>
                </select>
              </div>
            </div>
          </div>

          {/* CINEMA CAMERA & LIGHTING RIG */}
          <div className="card-skeuo" style={{ padding: 20 }}>
            <h3 className="account-card-title">3D Camera & Studio Lighting Rig</h3>
            
            <div className="account-form-grid">
              <div className="form-group">
                <label className="form-label">Shot Framing Type</label>
                <select className="form-select" value={shotType} onChange={(e) => setShotType(e.target.value)}>
                  <option value="Wide Anamorphic">Wide Anamorphic (2.39:1)</option>
                  <option value="Medium Close-Up">Medium Close-Up</option>
                  <option value="Extreme Close-Up">Extreme Close-Up Detail</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Camera Movement Trajectory</label>
                <select className="form-select" value={cameraMove} onChange={(e) => setCameraMove(e.target.value)}>
                  <option value="fpv_drone">FPV Drone Swoop 360°</option>
                  <option value="dolly_push">Anamorphic Dolly Push</option>
                  <option value="orbit">360° Character Orbit</option>
                  <option value="crane_tilt">Crane Vertical Tilt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Anamorphic Lens</label>
                <select className="form-select" value={lens} onChange={(e) => setLens(e.target.value)}>
                  <option value="24mm Wide">24mm Wide Anamorphic</option>
                  <option value="35mm Prime">35mm Prime Lens</option>
                  <option value="85mm Portrait">85mm Bokeh Portrait</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cinematic Lighting Setup</label>
                <select className="form-select" value={lighting} onChange={(e) => setLighting(e.target.value)}>
                  <option value="Neon Cyberpunk Rim">Neon Cyberpunk Rim</option>
                  <option value="Golden Hour Sunbeams">Golden Hour Sunbeams</option>
                  <option value="High-Contrast Film Noir">High-Contrast Film Noir</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            className="btn-primary" 
            style={{ padding: '14px 28px', fontSize: '1rem', justifyContent: 'center' }} 
            onClick={handleGenerateScene}
            disabled={generating}
          >
            <Sparkles size={18} /> {generating ? 'Directing Scene Render...' : 'Generate Scene (30 Credits)'}
          </button>
        </div>

        {/* RIGHT PANEL: PREVIEW & VARIATIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card-skeuo" style={{ padding: 20, minHeight: 500, display: 'flex', flexDirection: 'column' }}>
            <h3 className="account-card-title">Scene Monitor</h3>

            {generating ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎥</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Directing Scene Render...</h4>
                <p style={{ fontSize: '0.8rem', color: '#a19f8a', marginTop: 4 }}>Applying {cameraMove} trajectory & {selectedCharacter}</p>
              </div>
            ) : sceneResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: 8, overflow: 'hidden', position: 'relative', marginBottom: 14 }}>
                  <img src={sceneResult.url} alt={sceneResult.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.85)', padding: '4px 10px', borderRadius: 4, color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.4)', fontSize: '0.75rem', fontWeight: 800 }}>
                    DIRECTED SCENE • 4K PRORES
                  </div>
                </div>

                <div className="card-skeuo" style={{ padding: 14, background: '#040302', marginBottom: 16 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fefce8' }}>"{sceneResult.prompt}"</div>
                  <div style={{ fontSize: '0.74rem', color: '#a19f8a', marginTop: 4 }}>
                    Camera: {sceneResult.camera} • Lens: {sceneResult.lens} • Lighting: {sceneResult.lighting}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <button className="btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCreateVariation}>
                    <RefreshCw size={14} /> Create Shot Variation
                  </button>
                  <button className="btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onAddToProject({ title: sceneResult.title, type: 'cinema' })}>
                    <FolderPlus size={14} /> Save to Project
                  </button>
                </div>

                {/* VARIATIONS ROW */}
                {variations.length > 1 && (
                  <div>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#a19f8a', textTransform: 'uppercase' }}>Shot Variations ({variations.length})</span>
                    <div style={{ display: 'flex', gap: 10, marginTop: 8, overflowX: 'auto' }}>
                      {variations.map(v => (
                        <img 
                          key={v.id} 
                          src={v.url} 
                          alt="Var" 
                          style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4, cursor: 'pointer', border: sceneResult.id === v.id ? '2px solid #eab308' : 'none' }}
                          onClick={() => setSceneResult(v)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#a19f8a' }}>
                <Film size={42} color="#eab308" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fefce8' }}>Cinema Monitor Idle</h4>
                <p style={{ fontSize: '0.8rem', maxWidth: 280, marginTop: 4 }}>Set your framing, lens, and trajectory on the left and click Generate Scene.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
