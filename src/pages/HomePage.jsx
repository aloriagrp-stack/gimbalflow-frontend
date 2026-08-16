import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, Sparkles, Compass, Play, Zap, ArrowRight, 
  Layers, Camera, UserCheck, GitBranch, Sliders, Shield, Film, CheckCircle2
} from 'lucide-react';

export default function HomePage({ showToast }) {
  const [heroPrompt, setHeroPrompt] = useState('Anamorphic 35mm wide shot of a futuristic cyberpunk director in a neon lit Tokyo alleyway, 60fps fluid motion.');
  const [selectedPreset, setSelectedPreset] = useState('fpv_drone');
  const [activeMode, setActiveMode] = useState('video');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simComplete, setSimComplete] = useState(false);

  const handleHeroGenerate = () => {
    setIsSimulating(true);
    setSimComplete(false);
    showToast('Initializing GimbalFlow Spatial Motion Engine v3.0...');
    setTimeout(() => {
      setIsSimulating(false);
      setSimComplete(true);
      showToast('Sample Scene Rendered! Opening Cinema Studio...');
    }, 2000);
  };

  return (
    <div className="homepage-wrapper" style={{ overflowY: 'auto', flex: 1, background: '#020408' }}>
      
      {/* 1. HERO DIRECTORS COMMAND CENTER */}
      <section className="hero-section" style={{ padding: '50px 24px 40px 24px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        
        {/* BRAND BADGE */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 9999, background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.35)', color: '#eab308', fontSize: '0.78rem', fontWeight: 800, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <Sparkles size={14} /> Next-Gen AI Cinema Engine V3.0
        </div>

        <h1 className="hero-title" style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.12, marginBottom: 20, color: '#fefce8' }}>
          The AI Director Platform for <br />
          <span style={{ background: 'linear-gradient(90deg, #fef08a 0%, #eab308 50%, #ca8a04 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Cinematic Motion & Spatial Cameras
          </span>
        </h1>

        <p className="hero-subtitle" style={{ fontSize: '1.12rem', color: '#a19f8a', maxWidth: 780, margin: '0 auto 36px auto', lineHeight: 1.6 }}>
          Move beyond standard prompt boxes. Transform creative briefs into 4K multi-shot films with spatial 3D camera orbits, anamorphic lens physics, and persistent Soul ID characters.
        </p>

        {/* INTERACTIVE HERO COMMAND BAR */}
        <div className="card-skeuo" style={{ maxWidth: 860, margin: '0 auto 36px auto', padding: 20, textAlign: 'left', borderColor: 'rgba(234, 179, 8, 0.4)' }}>
          {/* MODE SELECTOR TABS */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
            <button 
              type="button" 
              className={`spec-chip ${activeMode === 'video' ? 'active' : ''}`}
              onClick={() => setActiveMode('video')}
            >
              🎬 4K Motion Video (60FPS)
            </button>
            <button 
              type="button" 
              className={`spec-chip ${activeMode === 'image' ? 'active' : ''}`}
              onClick={() => setActiveMode('image')}
            >
              🖼️ 8K Keyframe Synthesis
            </button>
            <button 
              type="button" 
              className={`spec-chip ${activeMode === 'canvas' ? 'active' : ''}`}
              onClick={() => setActiveMode('canvas')}
            >
              🧠 Node Graph Sequence
            </button>
            <button 
              type="button" 
              className={`spec-chip ${activeMode === 'soul' ? 'active' : ''}`}
              onClick={() => setActiveMode('soul')}
            >
              🎭 Soul ID Character Lock
            </button>
          </div>

          {/* PROMPT COMPOSER INPUT */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <textarea 
              className="form-textarea"
              rows="3"
              style={{ width: '100%', fontSize: '0.92rem', padding: '12px 16px', background: '#050402', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: 10, color: '#fefce8' }}
              value={heroPrompt}
              onChange={(e) => setHeroPrompt(e.target.value)}
              placeholder="Describe your scene brief or camera movement..."
            />
          </div>

          {/* CAMERA PRESETS ROW & GENERATE ACTION */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#a19f8a' }}>
              <span style={{ fontWeight: 700, color: '#fefce8' }}>Camera Trajectory:</span>
              <select 
                className="form-select" 
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
              >
                <option value="fpv_drone">FPV Drone Swoop 360°</option>
                <option value="dolly_push">Anamorphic Dolly Push In</option>
                <option value="orbital_arc">360° Character Orbit</option>
                <option value="crane_tilt">Crane Vertical Tilt</option>
              </select>
            </div>

            <button className="btn-primary" onClick={handleHeroGenerate} disabled={isSimulating}>
              <Sparkles size={16} /> {isSimulating ? 'Rendering Spatial Vectors...' : 'Synthesize Scene Preview'}
            </button>
          </div>

          {/* SIMULATION PREVIEW RESULT DISPLAY */}
          {simComplete && (
            <div className="card-skeuo" style={{ marginTop: 16, padding: 16, background: '#070503', borderColor: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={20} color="#eab308" />
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800 }}>Sample Spatial Scene Rendered</h4>
                  <p style={{ fontSize: '0.76rem', color: '#a19f8a' }}>Trajectory: {selectedPreset.toUpperCase()} • 60FPS Fluid Motion Pass</p>
                </div>
              </div>
              <Link to="/studio" className="btn-secondary btn-sm">Launch Cinema Studio →</Link>
            </div>
          )}
        </div>

        {/* QUICK STATS COUNTER BAR */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', paddingTop: 10 }}>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#eab308' }}>250K+</div>
            <div style={{ fontSize: '0.78rem', color: '#a19f8a', textTransform: 'uppercase', fontWeight: 700 }}>Filmmakers & Directors</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }}></div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#eab308' }}>60 FPS</div>
            <div style={{ fontSize: '0.78rem', color: '#a19f8a', textTransform: 'uppercase', fontWeight: 700 }}>Fluid Motion Interpolation</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }}></div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#eab308' }}>100%</div>
            <div style={{ fontSize: '0.78rem', color: '#a19f8a', textTransform: 'uppercase', fontWeight: 700 }}>Soul ID Character Lock</div>
          </div>
        </div>
      </section>

      {/* 2. THE 4 PILLARS OF PROJECT-H ARCHITECTURE */}
      <section style={{ maxWidth: 1240, margin: '40px auto 70px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="brand-badge" style={{ marginBottom: 10 }}>ORIGINAL ARCHITECTURE</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fefce8', letterSpacing: '-0.02em' }}>
            Built for Complete Director Freedom
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#a19f8a', maxWidth: 600, margin: '8px auto 0 auto' }}>
            PROJECT-H combines spatial camera physics, character persistence, and multi-model routing into one unified ecosystem.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          
          {/* PILLAR 1 */}
          <div className="card-skeuo" style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308', marginBottom: 16 }}>
              <Camera size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fefce8', marginBottom: 8 }}>Spatial 3D Camera Rig</h3>
            <p style={{ fontSize: '0.82rem', color: '#a19f8a', lineHeight: 1.5, flex: 1, marginBottom: 20 }}>
              Control orbital 360° camera arcs, FPV drone sweeps, anamorphic focal depth (24mm, 35mm, 85mm), and lighting rigs in real-time.
            </p>
            <Link to="/studio" className="btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Open Camera Rig</Link>
          </div>

          {/* PILLAR 2 */}
          <div className="card-skeuo" style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308', marginBottom: 16 }}>
              <UserCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fefce8', marginBottom: 8 }}>Soul ID Character Lock</h3>
            <p style={{ fontSize: '0.82rem', color: '#a19f8a', lineHeight: 1.5, flex: 1, marginBottom: 20 }}>
              Maintain consistent facial geometry, hair, ethnicity, and outfits across 100+ separate scene renders with single-token identity locking.
            </p>
            <Link to="/soul-id" className="btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Launch Soul ID Lab</Link>
          </div>

          {/* PILLAR 3 */}
          <div className="card-skeuo" style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308', marginBottom: 16 }}>
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fefce8', marginBottom: 8 }}>Smart Model Orchestration</h3>
            <p style={{ fontSize: '0.82rem', color: '#a19f8a', lineHeight: 1.5, flex: 1, marginBottom: 20 }}>
              Dynamic multi-model routing layer that automatically assigns your creative brief to Seedance v2, Cinema Pro, or ActionDiff based on shot demands.
            </p>
            <Link to="/studio" className="btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Explore Engines</Link>
          </div>

          {/* PILLAR 4 */}
          <div className="card-skeuo" style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308', marginBottom: 16 }}>
              <GitBranch size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fefce8', marginBottom: 8 }}>Node Workflow Graph</h3>
            <p style={{ fontSize: '0.82rem', color: '#a19f8a', lineHeight: 1.5, flex: 1, marginBottom: 20 }}>
              Connect keyframes, multi-shot timelines, speed ramping passes, and audio lip-sync narrators visually inside a high-performance node graph.
            </p>
            <Link to="/canvas" className="btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Launch Node Graph</Link>
          </div>

        </div>
      </section>

      {/* 3. TACTILE STUDIO WORKSPACE SHOWCASE DEMO */}
      <section style={{ maxWidth: 1240, margin: '0 auto 80px auto', padding: '0 24px' }}>
        <div className="card-skeuo" style={{ padding: 36, background: 'linear-gradient(135deg, #17120a 0%, #060402 100%)', borderColor: '#eab308' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center' }}>
            
            <div>
              <span className="brand-badge" style={{ marginBottom: 12 }}>PRO STUDIO EXPERIENCE</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fefce8', marginBottom: 16, lineHeight: 1.2 }}>
                Tactile Controls. <br />Professional Cinema Output.
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#a19f8a', lineHeight: 1.6, marginBottom: 24 }}>
                Designed with double-beveled skeuomorphic controls, dark-first cinematic ergonomics, and real-time GPU telemetry so you focus entirely on storytelling.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.86rem', color: '#fefce8' }}>
                  <span style={{ color: '#eab308', fontWeight: 800 }}>✓</span>
                  <span><strong>Anamorphic Focal Physics:</strong> Simulated 2.39:1 widescreen lens flares and bokeh depth.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.86rem', color: '#fefce8' }}>
                  <span style={{ color: '#eab308', fontWeight: 800 }}>✓</span>
                  <span><strong>Speed Ramping Ratios:</strong> Seamless motion retiming from 0.2x slow-motion to 3x hyperlapse.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.86rem', color: '#fefce8' }}>
                  <span style={{ color: '#eab308', fontWeight: 800 }}>✓</span>
                  <span><strong>Synthesized AI Lip-Sync:</strong> Phoneme-level voice alignment for dialogue scenes.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <Link to="/studio" className="btn-primary">Launch Cinema Studio <ArrowRight size={16} /></Link>
                <Link to="/explore" className="btn-secondary">View Sample Clips</Link>
              </div>
            </div>

            {/* DEMO CONSOLE MOCKUP */}
            <div className="card-skeuo" style={{ padding: 20, background: '#040302', borderColor: 'rgba(234, 179, 8, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 800 }}>
                  <Film size={16} color="#eab308" /> PROJECT-H DIRECTOR HUD
                </div>
                <span className="brand-badge">LIVE GPU 60FPS</span>
              </div>

              <div style={{ height: 220, background: 'linear-gradient(135deg, #241a07 0%, #060402 100%)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(234, 179, 8, 0.25)', border: '1.5px solid #eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308', boxShadow: '0 0 20px rgba(234,179,8,0.3)' }}>
                  <Play size={24} fill="#eab308" />
                </div>
                <span style={{ position: 'absolute', bottom: 12, left: 12, fontSize: '0.72rem', background: 'rgba(0,0,0,0.85)', padding: '3px 8px', borderRadius: 4, color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
                  REC • 4K PRORES 60FPS
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <div style={{ background: '#0b0904', padding: 8, borderRadius: 6, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#a19f8a' }}>CAMERA</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#eab308' }}>Orbital 360°</div>
                </div>
                <div style={{ background: '#0b0904', padding: 8, borderRadius: 6, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#a19f8a' }}>LENS</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#eab308' }}>35mm Prime</div>
                </div>
                <div style={{ background: '#0b0904', padding: 8, borderRadius: 6, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.68rem', color: '#a19f8a' }}>SOUL ID</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#eab308' }}>Locked ✓</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#050402', padding: '40px 24px 30px 24px', marginTop: 'auto' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, fontSize: '0.82rem', color: '#575547' }}>
          <div>
            <span style={{ fontWeight: 800, color: '#fefce8' }}>GimbalFlow</span> • The AI Cinema & Motion Director Platform (Engine v3.0.4)
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/privacy" style={{ color: '#a19f8a', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: '#a19f8a', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/help" style={{ color: '#a19f8a', textDecoration: 'none' }}>Help Center</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
