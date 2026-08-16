import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Image as ImageIcon, ChevronDown, ChevronLeft, ArrowUp, Check, RefreshCw, FolderPlus, Layers, MoreVertical, Download, ChevronRight, Star, Plus, X, ZoomIn, ZoomOut } from 'lucide-react';
import { enhancePromptApi } from '../services/apiService';

// Smart progress estimate while a real image is being rendered server-side.
// No real progress API exists — it climbs smoothly to 95% and fades out when the image loads.
function ProgressPercent() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setPct((p) => {
        if (p >= 95) return p;
        const step = 0.4 + Math.random() * 1.4;
        return Math.min(95, p + step * (1 + (95 - p) / 160));
      });
    }, 120);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="gen-card-loading">
      <span className="gen-progress-num">{Math.floor(pct)}%</span>
    </div>
  );
}

// Custom React Dropdown Component (Replaces native browser <select>)
function CustomDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [open]);

  return (
    <div className="custom-dropdown-container" ref={containerRef}>
      <button 
        type="button" 
        className="skeuo-dropdown-select"
        onClick={() => setOpen(!open)}
      >
        <span>{value}</span>
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {open && (
        <div className="custom-dropdown-menu">
          {options.map((opt) => (
            <div 
              key={opt}
              className={`custom-dropdown-item ${value === opt ? 'active' : ''}`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <span>{opt}</span>
              {value === opt && <Check size={14} color="#0cf700" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ImagePage({ 
  onGenerate, 
  onAddToProject, 
  onSaveToAssets, 
  projects = [], 
  preloadedSetup = null,
  showToast 
}) {
  const mode = 'image'; // image only
  const [prompt, setPrompt] = useState(preloadedSetup?.prompt || '');
  const [model, setModel] = useState(preloadedSetup?.model || 'Higgsfield Cinema Pro');
  const [aspectRatio, setAspectRatio] = useState(preloadedSetup?.aspectRatio || '16:9');
  const [numImages, setNumImages] = useState(2);
  const [referenceImg, setReferenceImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      if (showToast) showToast('Only image files are allowed.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setReferenceImg(reader.result);
      if (showToast) showToast('Photo attached.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  
  const [enhancing, setEnhancing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isLanded, setIsLanded] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gimbalflow_image_results') || '[]');
      const kept = Array.isArray(saved) ? saved.filter(r => r && r.url && !r.url.includes('unsplash')) : [];
      if (kept.length !== saved.length) localStorage.setItem('gimbalflow_image_results', JSON.stringify(kept));
      return kept.length > 0;
    } catch { return false; }
  });
  const [results, setResults] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gimbalflow_image_results') || '[]');
      if (!Array.isArray(saved)) return [];
      const kept = saved.filter(r => r && r.url && !r.url.includes('unsplash'));
      if (kept.length !== saved.length) localStorage.setItem('gimbalflow_image_results', JSON.stringify(kept));
      return kept;
    } catch {
      return [];
    }
  });
  const [activeCardMenu, setActiveCardMenu] = useState(null);
  const [subMenu, setSubMenu] = useState(''); // '' | 'download'
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null); // { url }
  const [loadedImages, setLoadedImages] = useState({});
  const [zoom, setZoom] = useState({ s: 1, tx: 0, ty: 0 });
  const touchRef = useRef(null);

  const openLightbox = (res) => {
    setZoom({ s: 1, tx: 0, ty: 0 });
    setLightbox({ url: res.url });
  };

  const closeLightbox = () => setLightbox(null);

  const zoomIn = () => setZoom(z => ({ s: Math.min(5, z.s * 1.25), tx: z.tx, ty: z.ty }));
  const zoomOut = () => setZoom(z => {
    const ns = Math.max(0.5, z.s / 1.25);
    return { s: ns, tx: ns <= 1 ? 0 : z.tx, ty: ns <= 1 ? 0 : z.ty };
  });
  const resetZoom = () => setZoom({ s: 1, tx: 0, ty: 0 });

  const onLightboxWheel = (e) => {
    if (!lightbox) return;
    e.preventDefault();
    setZoom(z => {
      const ns = Math.min(5, Math.max(0.5, z.s - e.deltaY * 0.0015));
      return { s: ns, tx: ns <= 1 ? 0 : z.tx, ty: ns <= 1 ? 0 : z.ty };
    });
  };

  const onLightboxTouchStart = (e) => {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]];
      touchRef.current = {
        mode: 'pinch',
        dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        startS: zoom.s
      };
    } else if (e.touches.length === 1) {
      touchRef.current = {
        mode: 'pan',
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        tx: zoom.tx,
        ty: zoom.ty
      };
    }
  };

  const onLightboxTouchMove = (e) => {
    const t = touchRef.current;
    if (!t) return;
    if (t.mode === 'pinch' && e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const ns = Math.min(5, Math.max(0.5, t.startS * (dist / t.dist)));
      setZoom(z => ({ s: ns, tx: ns <= 1 ? 0 : z.tx, ty: ns <= 1 ? 0 : z.ty }));
    } else if (t.mode === 'pan' && e.touches.length === 1) {
      const dx = e.touches[0].clientX - t.x;
      const dy = e.touches[0].clientY - t.y;
      setZoom(z => ({ ...z, tx: t.tx + dx, ty: t.ty + dy }));
    }
  };

  const onLightboxTouchEnd = () => { touchRef.current = null; };

  // Persist generations so refresh doesn't clear them
  useEffect(() => {
    try {
      localStorage.setItem('gimbalflow_image_results', JSON.stringify(results));
    } catch {
      // storage full or unavailable — ignore
    }
  }, [results]);

  // Close model dropdown when tapping anywhere outside it
  useEffect(() => {
    if (!modelMenuOpen) return;
    const handler = () => setModelMenuOpen(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [modelMenuOpen]);

  // Tap/click anywhere outside the menu closes the 3-dots dropdown
  useEffect(() => {
    if (activeCardMenu === null) return;
    const handler = () => {
      setActiveCardMenu(null);
      setSubMenu('');
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [activeCardMenu]);

  // Model list based on mode
  const modelOptions = mode === 'image' 
    ? ['Higgsfield Cinema Pro', 'Seedance v2', 'ActionDiff v3']
    : ['Seedance 2.5 Cinema', 'Higgsfield Motion Pro', 'Sora Cinema'];

  const creditCost = 10;

  const buildPollinationsUrl = (p, ratio, seed) => {
    const dims = {
      '16:9': { w: 1024, h: 576 },
      '9:16': { w: 576, h: 1024 },
      '1:1': { w: 1024, h: 1024 },
      '21:9': { w: 1344, h: 576 }
    }[ratio] || { w: 1024, h: 1024 };
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=${dims.w}&height=${dims.h}&seed=${seed}&model=flux&nologo=true`;
  };

  const handleGenerate = (e) => {
    e?.preventDefault();
    if (!prompt.trim()) {
      if (showToast) showToast('Please enter a prompt first.');
      return;
    }

    setIsLanded(true);
    setGenerating(true);
    setPrompt('');

    const job = onGenerate(mode, {
      prompt,
      model,
      aspectRatio,
      numImages,
      referenceImg
    });

    if (!job) {
      setGenerating(false);
      return;
    }

    const batchId = `batch-${Date.now()}`;
    const generatedAt = new Date().toLocaleString('en-IN', { 
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true 
    });
    const baseSeed = Date.now() % 100000 + Math.floor(Math.random() * 1000);
    const generatedItems = Array.from({ length: numImages }).map((_, idx) => ({
      id: `${mode}-res-${Date.now()}-${idx}`,
      url: buildPollinationsUrl(prompt, aspectRatio, baseSeed + idx),
      prompt,
      model,
      mode,
      aspectRatio,
      batchId,
      generatedAt,
      date: 'Just now'
    }));

    // Give the first image a moment to start loading, then show results
    setTimeout(() => {
      setGenerating(false);
      setResults(prev => [...generatedItems, ...prev]);
      if (showToast) showToast(`Generating ${numImages} image(s) with ${model}...`);
    }, 400);
  };

  return (
    <div style={{ 
      padding: isLanded ? '32px 20px 280px 20px' : '32px 20px', 
      maxWidth: 960, 
      margin: '0 auto', 
      flex: 1, 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: isLanded ? 'flex-start' : 'center',
      minHeight: isLanded ? 'auto' : 'calc(100vh - 100px)',
      gap: 18 
    }}>

      {/* RESULTS DISPLAY CANVAS & GENERATING SKELETON LOADER */}
      {(generating || results.length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', animation: 'dropdownFadeIn 0.4s ease' }}>

          {/* ACTIVE RENDERING — MINIMAL LOGO LOADER */}
          {generating && (
            <div 
              className="card-skeuo" 
              style={{ 
                width: '100%', 
                padding: '56px 24px', 
                borderRadius: 16, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'linear-gradient(180deg, #0e121d 0%, #05070c 100%)', 
                border: '1px solid rgba(255, 255, 255, 0.08)' 
              }}
            >
              <img src="/logo.svg" alt="GimbalFlow" className="gen-loading-logo" />
              <p className="gen-loading-text">Generating...</p>
            </div>
          )}

          {/* GENERATED RESULT CARDS — GROUPED BY BATCH */}
          {results.length > 0 && (() => {
            // Group results by batchId, preserving order
            const batches = [];
            const seen = new Set();
            results.forEach(res => {
              const bid = res.batchId || 'unknown';
              if (!seen.has(bid)) {
                seen.add(bid);
                batches.push({ batchId: bid, items: [] });
              }
              batches.find(b => b.batchId === bid).items.push(res);
            });

            // Aspect ratio → grid columns
            const ratioCols = { '16:9': 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))', '9:16': 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', '1:1': 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', '21:9': '1fr' };

            return batches.map((batch, bIdx) => {
              const batchRatio = batch.items[0]?.aspectRatio || '16:9';
              const gridCols = ratioCols[batchRatio] || ratioCols['16:9'];
              const timestamp = batch.items[0]?.generatedAt || '';

              return (
                <div key={batch.batchId} style={{ width: '100%' }}>
                  {/* BATCH DIVIDER WITH TIMESTAMP — only between batches */}
                  {bIdx > 0 && (
                    <div className="batch-divider">
                      <div className="batch-divider-line" />
                      <span className="batch-divider-time">{batches[bIdx - 1]?.items[0]?.generatedAt || ''}</span>
                    </div>
                  )}

                  {/* BATCH GRID */}
                  <div className="generated-grid-container" style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 12 }}>
                    {batch.items.map(res => {
                      const isMenuOpen = activeCardMenu === res.id;
const downloadAsPng = async (res, maxQuality, name) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      let src = res.url;
      if (maxQuality) {
        if (res.url.includes('pollinations.ai')) {
          const hdDims = {
            '16:9': { w: 2048, h: 1152 },
            '9:16': { w: 1152, h: 2048 },
            '1:1': { w: 1600, h: 1600 },
            '21:9': { w: 2048, h: 878 }
          }[res.aspectRatio] || { w: 1600, h: 1600 };
          src = res.url
            .replace(/[?&]width=\d+/g, '')
            .replace(/[?&]height=\d+/g, '')
            .replace(/[?&]seed=\d+/g, '')
            + `?width=${hdDims.w}&height=${hdDims.h}&seed=${Math.floor(Math.random() * 100000)}&model=flux&nologo=true`;
        }
      }
      img.src = src;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = name;
      link.href = canvas.toDataURL('image/png');
      link.click();
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleDownloadHd = async (res) => {
    const firstWord = (res.prompt || 'gimbalflow').trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'gimbalflow';
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const fileName = `${stamp}-${firstWord}.png`;
    const ok = await downloadAsPng(res, true, fileName);
    if (showToast) showToast(ok ? 'Downloading HD PNG (max quality)...' : 'HD download failed — opening in new tab instead.');
    if (!ok) window.open(res.url, '_blank');
    setActiveCardMenu(null);
    setSubMenu('');
  };

  return (
<div key={res.id} className="generated-card-item" onClick={() => openLightbox(res)} style={{ aspectRatio: res.aspectRatio === '9:16' ? '9 / 16' : res.aspectRatio === '1:1' ? '1 / 1' : res.aspectRatio === '21:9' ? '21 / 9' : '16 / 9', height: 'auto', cursor: 'zoom-in' }}>
                          
{/* GENERATED MEDIA RENDER — real AI image (Pollinations) */}
                  {!loadedImages[res.id] && <ProgressPercent />}
                  <img 
                    src={res.url} 
                    alt="Generated result" 
                    className={loadedImages[res.id] ? 'gen-img-in' : ''}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: loadedImages[res.id] ? 'block' : 'none' }} 
                    onLoad={() => setLoadedImages(prev => ({ ...prev, [res.id]: true }))}
                    onError={() => setLoadedImages(prev => ({ ...prev, [res.id]: 'error' }))}
                  />
                  {loadedImages[res.id] === 'error' && (
                    <div className="gen-card-loading gen-card-error">
                      <span>Failed to load</span>
                    </div>
                  )}

                  {/* TOP-RIGHT 3-DOTS BUTTON */}
                          <button 
                            type="button"
                            className={`card-hover-dots-btn ${isMenuOpen ? 'menu-open' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCardMenu(isMenuOpen ? null : res.id);
                              setSubMenu('');
                            }}
                            title="More actions"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {/* 3-DOTS POPUP DROPDOWN MENU */}
                          {isMenuOpen && (
                            <div className="card-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                              
                              {/* DOWNLOAD SUB-MENU VIEW (replaces main menu on tap) */}
                              {subMenu === 'download' ? (
                                <>
                                  <button type="button" className="card-menu-item sub-back-btn" onClick={() => setSubMenu('')}>
                                    <ChevronLeft size={14} />
                                    <span>Back</span>
                                  </button>
                                  <button 
                                    type="button"
                                    className="download-sub-item"
                                    onClick={() => handleDownloadHd(res)}
                                  >
                                    Download in HD
                                  </button>
                                  <a 
                                    href={res.url} 
                                    download 
                                    className="download-sub-item"
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => {
                                      if (showToast) showToast('Downloading Normal Keyframe Pass...');
                                      setActiveCardMenu(null);
                                      setSubMenu('');
                                    }}
                                  >
                                    Download in Normal
                                  </a>
                                </>
                              ) : (
                                <>
                                  {/* DOWNLOAD */}
                                  <button 
                                    type="button" 
                                    className="card-menu-item"
                                    onClick={() => setSubMenu('download')}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <Download size={14} color="#0cf700" />
                                      <span>Download</span>
                                    </div>
                                    <ChevronRight size={13} style={{ opacity: 0.6 }} />
                                  </button>

                                  {/* ADD TO PROJECT */}
                                  <button 
                                    type="button" 
                                    className="card-menu-item"
                                    onClick={() => {
                                      onAddToProject(res);
                                      setActiveCardMenu(null);
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <FolderPlus size={14} />
                                      <span>Add to Project</span>
                                    </div>
                                  </button>

                                  {/* SAVE TO ASSETS */}
                                  <button 
                                    type="button" 
                                    className="card-menu-item"
                                    onClick={() => {
                                      onSaveToAssets(res);
                                      setActiveCardMenu(null);
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <Layers size={14} />
                                      <span>Save to Assets</span>
                                    </div>
                                  </button>
                                </>
                              )}

                            </div>
                          )}

                          {/* BOTTOM HOVER PROMPT OVERLAY (Left to Right, Ellipsis) */}
                          <div className="card-hover-prompt-overlay" title={res.prompt}>
                            <p className="card-prompt-text">
                              {res.prompt}
                            </p>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}
      </div>
    )}
      
      {/* SKEUOMORPHIC CHAT TYPING CONTAINER WITH ATTACHED MODE TOGGLE */}
      <div className={`skeuo-chat-card-wrapper ${isLanded ? 'landed-bottom' : ''}`}>
        
        {/* CHAT CARD MAIN BODY */}
        <div className="skeuo-chat-card" style={{ width: '100%', padding: '18px 22px' }}>
          
          {/* PROMPT TEXTAREA */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <textarea 
              className="skeuo-chat-textarea"
              placeholder={mode === 'image' ? "Describe the cinematic image or keyframe pass you want to create..." : "Describe the fluid video sequence, camera motion, or AI scene pass..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>

          {/* ATTACHED PHOTO PREVIEW (removable) */}
          {referenceImg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <img src={referenceImg} alt="Attached" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(12, 247, 0, 0.4)' }} />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>Attached photo</span>
              <button type="button" className="ref-clear-btn" onClick={() => setReferenceImg(null)} aria-label="Remove photo">
                <X size={14} />
              </button>
            </div>
          )}

          {/* BOTTOM ACTION BAR */}
          <div className="composer-action-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            
            {/* LEFT CORNER: CUSTOM DROPDOWNS (hidden on mobile) */}
            <div className="composer-model-dropdowns" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              
              {/* MODEL DROPDOWN */}
              <CustomDropdown 
                options={modelOptions}
                value={model}
                onChange={setModel}
              />

              {/* ASPECT RATIO DROPDOWN */}
              <CustomDropdown 
                options={['16:9', '9:16', '1:1', '21:9']}
                value={aspectRatio}
                onChange={setAspectRatio}
              />

            </div>

            {/* PLUS BUTTON — upload photo locally */}
            <button 
              type="button" 
              className="composer-add-btn"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach photo"
            >
              <Plus size={17} strokeWidth={2.5} />
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleFilePick} 
            />

            {/* MODEL SELECTOR — tap opens upward dropdown with model list */}
            <div className="composer-model-wrap">
              <button 
                type="button" 
                className="composer-model-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setModelMenuOpen(!modelMenuOpen);
                }}
              >
                <span className="composer-model-name">{model}</span>
                <ChevronDown size={10} style={{ opacity: 0.5, flexShrink: 0, transform: modelMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {modelMenuOpen && (
                <div className="composer-model-menu" onClick={(e) => e.stopPropagation()}>
                  
                  {/* ASPECT RATIO */}
                  <div className="composer-menu-label">Aspect ratio</div>
                  <div className="composer-ratio-row">
                    {[
                      { label: '16:9', w: 22, h: 13 },
                      { label: '9:16', w: 13, h: 22 },
                      { label: '1:1', w: 18, h: 18 },
                      { label: '21:9', w: 26, h: 11 }
                    ].map((r) => (
                      <button
                        key={r.label}
                        type="button"
                        className={`composer-ratio-pill ${aspectRatio === r.label ? 'active' : ''}`}
                        onClick={() => setAspectRatio(r.label)}
                      >
                        <span className="ratio-preview" style={{ width: r.w, height: r.h }} />
                        <span className="ratio-label">{r.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* VARIANTS */}
                  <div className="composer-menu-label">Variants</div>
                  <div className="composer-variants-row">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`composer-variant-pill ${numImages === n ? 'active' : ''}`}
                        onClick={() => setNumImages(n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  <div className="composer-menu-divider" />

                  {/* MODEL LIST */}
                  <div className="composer-menu-label">Model</div>
                  <div className="composer-model-list">
                    {modelOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`composer-model-opt ${opt === model ? 'active' : ''}`}
                        onClick={() => {
                          setModel(opt);
                          setModelMenuOpen(false);
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT CORNER: ARROW SEND BUTTON */}
            <button 
              className="skeuo-send-arrow-btn"
              onClick={handleGenerate}
              disabled={generating}
              aria-label="Generate"
            >
              {generating ? (
                <RefreshCw size={16} className="spin" />
              ) : (
                <ArrowUp size={17} strokeWidth={2.5} />
              )}
            </button>

          </div>

        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX — click to open, pinch/wheel/buttons to zoom */}
      {lightbox && (
        <div className="lightbox-backdrop" onClick={closeLightbox}>
          <div 
            className="lightbox-zoom-wrap" 
            onClick={(e) => e.stopPropagation()}
            onWheel={onLightboxWheel}
            onTouchStart={onLightboxTouchStart}
            onTouchMove={onLightboxTouchMove}
            onTouchEnd={onLightboxTouchEnd}
          >
            <img 
              src={lightbox.url} 
              alt="Generated" 
              className="lightbox-img" 
              style={{ transform: `translate(${zoom.tx}px, ${zoom.ty}px) scale(${zoom.s})` }} 
              draggable={false}
            />
          </div>

          {/* ZOOM CONTROLS */}
          <div className="lightbox-controls" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lightbox-btn" onClick={zoomOut} aria-label="Zoom out">
              <ZoomOut size={18} />
            </button>
            <button type="button" className="lightbox-btn lightbox-pct-btn" onClick={resetZoom} aria-label="Reset zoom">
              {Math.round(zoom.s * 100)}%
            </button>
            <button type="button" className="lightbox-btn" onClick={zoomIn} aria-label="Zoom in">
              <ZoomIn size={18} />
            </button>
          </div>

          <button type="button" className="lightbox-close" onClick={closeLightbox} aria-label="Close">
            <X size={22} />
          </button>
        </div>
      )}

    </div>
  );
}
