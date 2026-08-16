import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Lock, User as UserIcon, LogOut, Plus, Trash2, Edit3, CheckCircle2,
  Film, Image as ImageIcon, Link2, Loader2, KeyRound, AlertTriangle, Save,
  Home, Users, Activity, DollarSign, Zap, Search, Ban, TrendingUp
} from 'lucide-react';

const TOKEN_KEY = 'gimbalflow_admin_token';
const LINK_OPTIONS = [
  { value: '', label: 'No link (toast)' },
  { value: '/cinema', label: 'Cinema Studio' },
  { value: '/image', label: 'Image Studio' },
  { value: '/explore', label: 'Explore' },
  { value: '/profile', label: 'Profile' },
];

const EMPTY_FORM = { id: null, title: '', desc: '', media: 'video', srcData: null, posterData: null, link: '' };
const EMPTY_GALLERY_FORM = { id: null, media: 'video', ratio: 'tall', srcData: null, posterData: null };

const PLAN_SPLIT = [
  { label: 'Free', value: 41, color: '#94a3b8' },
  { label: 'Basic', value: 29, color: '#4aa0e8' },
  { label: 'Mid', value: 18, color: '#eab308' },
  { label: 'Pro', value: 12, color: '#0cf700' },
];

const SYSTEM_STATS = [
  { label: 'API Latency', value: '84ms', ok: true },
  { label: 'Queue Depth', value: '12 jobs', ok: true },
  { label: 'GPU Cluster', value: '48/50 nodes', ok: true },
  { label: 'Storage', value: '72% used', ok: true },
];

const MOCK_USERS = [
  { id: 'U-10241', name: 'Alex Rivera', email: 'alex@riveracinematic.ai', plan: 'Pro', status: 'Active', credits: '2,450', joined: 'Mar 2024' },
  { id: 'U-10240', name: 'Jordan Lee', email: 'jordan@leestudios.com', plan: 'Basic', status: 'Active', credits: '480', joined: 'Jun 2025' },
  { id: 'U-10239', name: 'Priya Sharma', email: 'priya@sharmavfx.in', plan: 'Mid', status: 'Active', credits: '1,120', joined: 'Nov 2025' },
  { id: 'U-10238', name: 'Marcus Dean', email: 'marcus@deandirect.com', plan: 'Free', status: 'Suspended', credits: '0', joined: 'Jan 2026' },
  { id: 'U-10237', name: 'Sofia Reyes', email: 'sofia@reyesfilms.com', plan: 'Pro', status: 'Active', credits: '5,900', joined: 'Feb 2026' },
  { id: 'U-10236', name: 'David Kim', email: 'david@kimmedia.com', plan: 'Basic', status: 'Active', credits: '210', joined: 'Apr 2026' },
  { id: 'U-10235', name: 'Aisha Patel', email: 'aisha@patelcreates.com', plan: 'Mid', status: 'Active', credits: '3,340', joined: 'Jul 2026' },
];

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

export default function AdminPanelPage({ showToast }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '');
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState('home');

  // login form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState('');

  // panel data
  const [cards, setCards] = useState([]);
  const [info, setInfo] = useState(null);
  const [health, setHealth] = useState(null);
  const [busySave, setBusySave] = useState(false);

  // card editor form
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formBusy, setFormBusy] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const mediaInputRef = useRef(null);
  const posterInputRef = useRef(null);

  // gallery editor
  const [gallery, setGallery] = useState([]);
  const [gForm, setGForm] = useState(EMPTY_GALLERY_FORM);
  const [gEditingId, setGEditingId] = useState(null);
  const [gShowEditor, setGShowEditor] = useState(false);
  const [gBusySave, setGBusySave] = useState(false);
  const [gFormBusy, setGFormBusy] = useState(false);
  const gMediaInputRef = useRef(null);
  const gPosterInputRef = useRef(null);

  // users tab
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [users, setUsers] = useState(MOCK_USERS);

  const authHeaders = () => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

  // Validate stored token on mount
  useEffect(() => {
    if (!token) { setChecking(false); return; }
    fetch('/api/admin/info', { headers: authHeaders() })
      .then((r) => {
        if (!r.ok) throw new Error('bad token');
        return r.json();
      })
      .then((d) => { setInfo(d); setAuthed(true); })
      .catch(() => { sessionStorage.removeItem(TOKEN_KEY); setToken(''); setAuthed(false); })
      .finally(() => setChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load deck + health after auth
  useEffect(() => {
    if (!authed) return;
    fetch('/api/hero').then((r) => r.json()).then((d) => { if (Array.isArray(d)) setCards(d); }).catch(() => {});
    fetch('/api/gallery').then((r) => r.json()).then((d) => { if (Array.isArray(d)) setGallery(d); }).catch(() => {});
    fetch('/api/health').then((r) => r.json()).then(setHealth).catch(() => {});
    fetch('/api/admin/info', { headers: authHeaders() })
      .then((r) => r.json()).then(setInfo).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginBusy(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoginError(data.error || 'Login failed. Check your credentials.');
        setPassword('');
        return;
      }
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setAuthed(true);
      setPassword('');
      showToast('Admin session started.');
    } catch (err) {
      setLoginError('Cannot reach the server. Is the backend running?');
    } finally {
      setLoginBusy(false);
    }
  };

  const handleLogout = async () => {
    try { await fetch('/api/admin/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); } catch (e) {}
    sessionStorage.removeItem(TOKEN_KEY);
    setToken('');
    setAuthed(false);
    setCards([]);
    setForm(EMPTY_FORM);
    setEditingId(null);
    showToast('Signed out of admin.');
  };

  // ── Card editor ────────────────────────────────────────────────
  const startEdit = (card) => {
    setEditingId(card.id);
    setForm({ id: card.id, title: card.title, desc: card.desc || '', media: card.media, srcData: null, posterData: null, link: card.link || '' });
    setShowEditor(true);
  };

  const startAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setShowEditor(true);
  };

  const pickMedia = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 90 * 1024 * 1024) { showToast('File too large (max 90MB).'); return; }
    setFormBusy(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const isVideo = file.type.startsWith('video/');
      setForm((f) => ({ ...f, srcData: dataUrl, media: isVideo ? 'video' : 'img' }));
      showToast(isVideo ? 'Video selected.' : 'Photo selected.');
    } catch { showToast('Could not read that file.'); } finally { setFormBusy(false); }
  };

  const pickPoster = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Poster must be an image.'); return; }
    setFormBusy(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setForm((f) => ({ ...f, posterData: dataUrl }));
    } catch { showToast('Could not read that image.'); } finally { setFormBusy(false); }
  };

  const upsertCard = () => {
    if (!form.title.trim()) { showToast('Card needs a title.'); return; }
    if (!form.srcData && !editingId) { showToast('Upload a video or photo for the card.'); return; }
    if (editingId) {
      setCards((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form, title: form.title.trim(), desc: form.desc.trim(), srcData: form.srcData || undefined, posterData: form.posterData || undefined } : c)));
      showToast('Card updated locally.');
    } else {
      const newCard = { id: `hero-${Date.now()}`, ...form, title: form.title.trim(), desc: form.desc.trim() };
      setCards((prev) => [...prev, newCard]);
      showToast('Card added locally.');
    }
    setShowEditor(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const removeCard = (id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) { setShowEditor(false); setEditingId(null); setForm(EMPTY_FORM); }
    showToast('Card removed locally. Press Save to publish.');
  };

  const saveDeck = async () => {
    if (!cards.length) { showToast('Deck is empty — publishing will hide the hero section.'); }
    setBusySave(true);
    try {
      const payload = cards.map(({ id, media, title, desc, link, src, poster, srcData, posterData }) => ({
        id, media, title, desc, link: link || null, src: src || null, poster: poster || null, srcData: srcData || undefined, posterData: posterData || undefined
      }));
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ cards: payload })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setCards(data.cards);
      showToast('Hero section published.');
    } catch (err) {
      if (String(err.message).includes('Unauthorized') || String(err.message).includes('session')) {
        sessionStorage.removeItem(TOKEN_KEY); setToken(''); setAuthed(false);
      }
      showToast('Save failed: ' + err.message);
    } finally {
      setBusySave(false);
    }
  };

  // ── Gallery editor ─────────────────────────────────────────────
  const gStartEdit = (item) => {
    setGEditingId(item.id);
    setGForm({ id: item.id, media: item.media, ratio: item.ratio || 'wide', srcData: null, posterData: null });
    setGShowEditor(true);
  };

  const gStartAdd = () => {
    setGEditingId(null);
    setGForm({ ...EMPTY_GALLERY_FORM });
    setGShowEditor(true);
  };

  const gPickMedia = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 90 * 1024 * 1024) { showToast('File too large (max 90MB).'); return; }
    setGFormBusy(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const isVideo = file.type.startsWith('video/');
      setGForm((f) => ({ ...f, srcData: dataUrl, media: isVideo ? 'video' : 'img' }));
      showToast(isVideo ? 'Video selected.' : 'Photo selected.');
    } catch { showToast('Could not read that file.'); } finally { setGFormBusy(false); }
  };

  const gPickPoster = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Poster must be an image.'); return; }
    setGFormBusy(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setGForm((f) => ({ ...f, posterData: dataUrl }));
    } catch { showToast('Could not read that image.'); } finally { setGFormBusy(false); }
  };

  const gUpsert = () => {
    if (!gForm.srcData && !gEditingId) { showToast('Upload a video or photo for the card.'); return; }
    if (gEditingId) {
      setGallery((prev) => prev.map((it) => (it.id === gEditingId ? { ...it, ...gForm, srcData: gForm.srcData || undefined, posterData: gForm.posterData || undefined } : it)));
      showToast('Card updated locally.');
    } else {
      setGallery((prev) => [...prev, { id: `gal-${Date.now()}`, ...gForm }]);
      showToast('Card added locally.');
    }
    setGShowEditor(false);
    setGForm(EMPTY_GALLERY_FORM);
    setGEditingId(null);
  };

  const gRemove = (id) => {
    setGallery((prev) => prev.filter((it) => it.id !== id));
    if (gEditingId === id) { setGShowEditor(false); setGEditingId(null); setGForm(EMPTY_GALLERY_FORM); }
    showToast('Card removed locally. Press Publish to apply.');
  };

  const gSave = async () => {
    if (!gallery.length) { showToast('Gallery is empty — publishing will hide the grid.'); }
    setGBusySave(true);
    try {
      const payload = gallery.map(({ id, media, ratio, src, poster, srcData, posterData }) => ({
        id, media, ratio, src: src || null, poster: poster || null, srcData: srcData || undefined, posterData: posterData || undefined
      }));
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ items: payload })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setGallery(data.items);
      showToast('Gallery published.');
    } catch (err) {
      if (String(err.message).includes('Unauthorized') || String(err.message).includes('session')) {
        sessionStorage.removeItem(TOKEN_KEY); setToken(''); setAuthed(false);
      }
      showToast('Save failed: ' + err.message);
    } finally {
      setGBusySave(false);
    }
  };

  // ── Users tab ──────────────────────────────────────────────────
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesQuery = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    const matchesFilter = filter === 'all' || u.plan.toLowerCase() === filter || (filter === 'suspended' && u.status === 'Suspended');
    return matchesQuery && matchesFilter;
  });

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
          : u
      )
    );
    showToast('User status updated.');
  };

  // ── RENDER ─────────────────────────────────────────────────────
  if (checking) {
    return (
      <div className="admin-panel admin-centered">
        <div className="admin-login-loader"><Loader2 size={26} className="spin" /></div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="admin-panel admin-centered">
        <div className="admin-login-card card-skeuo">
          <div className="admin-login-icon"><Shield size={26} /></div>
          <h1 className="admin-login-title">Admin Access</h1>
          <p className="admin-login-sub">Restricted control center · credentials stay on the server</p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <label className="admin-field">
              <span>Username</span>
              <div className="admin-field-row">
                <UserIcon size={15} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  autoComplete="username"
                  required
                />
              </div>
            </label>

            <label className="admin-field">
              <span>Password</span>
              <div className="admin-field-row">
                <Lock size={15} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>

            {loginError && (
              <div className="admin-login-error"><AlertTriangle size={13} /> {loginError}</div>
            )}

            <button type="submit" className="admin-btn-green" disabled={loginBusy}>
              {loginBusy ? <Loader2 size={15} className="spin" /> : <KeyRound size={15} />}
              {loginBusy ? 'Verifying...' : 'Sign In'}
            </button>
          </form>

          <p className="admin-login-foot"><Lock size={11} /> Password is verified server-side only — never stored in the app.</p>
        </div>
      </div>
    );
  }

  const editingCardSrc = editingId ? cards.find((c) => c.id === editingId) : null;

  return (
    <div className="admin-panel admin-shell">
      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-shield-icon admin-sidebar-logo"><Shield size={20} /></div>
          <div className="admin-sidebar-brand-text">
            <span>GimbalFlow</span>
            <small>Admin Control</small>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${tab === 'home' ? 'active' : ''}`}
            onClick={() => setTab('home')}
          >
            <Home size={17} />
            <span>Home</span>
            <small>Analytics</small>
          </button>
          <button
            className={`admin-nav-item ${tab === 'hero' ? 'active' : ''}`}
            onClick={() => setTab('hero')}
          >
            <Film size={17} />
            <span>Hero Section</span>
            <small>Showcase cards</small>
          </button>
          <button
            className={`admin-nav-item ${tab === 'gallery' ? 'active' : ''}`}
            onClick={() => setTab('gallery')}
          >
            <ImageIcon size={17} />
            <span>Gallery</span>
            <small>Grid cards</small>
          </button>
          <button
            className={`admin-nav-item ${tab === 'users' ? 'active' : ''}`}
            onClick={() => setTab('users')}
          >
            <Users size={17} />
            <span>Users</span>
            <small>Management</small>
          </button>
        </nav>

        <div className="admin-sidebar-foot">
          <div className="admin-sidebar-status">
            <span className="admin-dot"></span>
            Session live
          </div>
          <button className="admin-sidebar-logout" onClick={handleLogout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* ── CONTENT ── */}
      <div className="admin-content">

        {/* ═══ HOME / ANALYTICS ═══ */}
        {tab === 'home' && (
          <>
            <div className="admin-tab-head">
              <h2>Home</h2>
              <p>Platform overview & live analytics</p>
            </div>

            <div className="admin-overview-grid">
              <div className="admin-overview-card">
                <div className="admin-overview-icon" style={{ background: 'rgba(12,247,0,0.12)', color: '#0cf700' }}><Film size={20} /></div>
                <div className="admin-overview-body">
                  <span className="admin-overview-label">Hero Cards</span>
                  <span className="admin-overview-value">{cards.length}</span>
                  <span className="admin-overview-delta">Live on Explore page</span>
                </div>
              </div>
              <div className="admin-overview-card">
                <div className="admin-overview-icon" style={{ background: 'rgba(74,160,232,0.12)', color: '#4aa0e8' }}><Lock size={20} /></div>
                <div className="admin-overview-body">
                  <span className="admin-overview-label">Active Sessions</span>
                  <span className="admin-overview-value">{info ? info.sessions : '—'}</span>
                  <span className="admin-overview-delta">12h token lifetime</span>
                </div>
              </div>
              <div className="admin-overview-card">
                <div className="admin-overview-icon" style={{ background: 'rgba(234,179,8,0.12)', color: '#eab308' }}><CheckCircle2 size={20} /></div>
                <div className="admin-overview-body">
                  <span className="admin-overview-label">MySQL</span>
                  <span className="admin-overview-value">{health ? (health.mysql === 'connected' ? 'Online' : 'Fallback') : '…'}</span>
                  <span className="admin-overview-delta">{health ? health.mysql : ''}</span>
                </div>
              </div>
              <div className="admin-overview-card">
                <div className="admin-overview-icon" style={{ background: 'rgba(148,163,184,0.12)', color: '#94a3b8' }}><Link2 size={20} /></div>
                <div className="admin-overview-body">
                  <span className="admin-overview-label">Redis</span>
                  <span className="admin-overview-value">{health ? (health.redis.connected ? 'Online' : 'Cache') : '…'}</span>
                  <span className="admin-overview-delta">{health ? (health.redis.connected ? 'connected' : 'in-memory') : ''}</span>
                </div>
              </div>
            </div>

            <div className="admin-main-grid">
              <div className="admin-card">
                <h3 className="admin-card-title">Plan Distribution</h3>
                <p className="admin-card-desc">Active subscribers by plan tier.</p>
                <div className="admin-bar-stack">
                  {PLAN_SPLIT.map((p) => (
                    <div key={p.label} className="admin-bar-segment" style={{ width: `${p.value}%`, background: p.color }} title={`${p.label}: ${p.value}%`}></div>
                  ))}
                </div>
                <div className="admin-bar-legend">
                  {PLAN_SPLIT.map((p) => (
                    <span key={p.label} className="admin-legend-item">
                      <span className="admin-legend-dot" style={{ background: p.color }}></span>
                      {p.label} {p.value}%
                    </span>
                  ))}
                </div>
              </div>

              <div className="admin-card">
                <h3 className="admin-card-title">System Health</h3>
                <p className="admin-card-desc">Live infrastructure telemetry.</p>
                <div className="admin-sys-list">
                  {SYSTEM_STATS.map((s) => (
                    <div key={s.label} className="admin-sys-item">
                      <span className="admin-sys-label">{s.label}</span>
                      <span className="admin-sys-value">{s.value}</span>
                      <CheckCircle2 size={15} color="#22c55e" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="admin-footer-note">
              <TrendingUp size={13} />
              Data refreshes on login & when the page reloads.
            </div>
          </>
        )}

        {/* ═══ HERO SECTION ═══ */}
        {tab === 'hero' && (
          <>
            <div className="admin-tab-head">
              <h2>Hero Section</h2>
              <p>Showcase cards on the Explore page — videos are the primary format, photos allowed</p>
            </div>

            <div className="admin-card">
              <div className="admin-table-header">
                <div>
                  <h3 className="admin-card-title" style={{ marginBottom: 0 }}>Hero Deck</h3>
                  <p className="admin-card-desc" style={{ marginBottom: 0, marginTop: 4 }}>{cards.length} cards</p>
                </div>
                <div className="admin-table-tools">
                  <button className="admin-btn-green" onClick={saveDeck} disabled={busySave}>
                    {busySave ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
                    {busySave ? 'Publishing...' : 'Publish Changes'}
                  </button>
                  <button className="admin-btn-outline" onClick={startAdd}><Plus size={15} /> Add Card</button>
                </div>
              </div>

              {showEditor && (
                <div className="admin-hero-editor">
                  <div className="admin-hero-editor-head">
                    <h4>{editingId ? 'Edit Card' : 'New Card'}</h4>
                    <span className="admin-hero-editor-note">{editingId ? 'Changes apply after Publish.' : 'Fill the fields — media is required.'}</span>
                  </div>

                  <div className="admin-hero-editor-grid">
                    <div>
                      <div className="admin-media-toggle">
                        <button
                          type="button"
                          className={`admin-media-tab ${form.media === 'video' ? 'active' : ''}`}
                          onClick={() => setForm((f) => ({ ...f, media: 'video' }))}
                        >
                          <Film size={14} /> Video
                        </button>
                        <button
                          type="button"
                          className={`admin-media-tab ${form.media === 'img' ? 'active' : ''}`}
                          onClick={() => setForm((f) => ({ ...f, media: 'img' }))}
                        >
                          <ImageIcon size={14} /> Photo
                        </button>
                      </div>

                      <div className="admin-upload-zone" onClick={() => mediaInputRef.current && mediaInputRef.current.click()}>
                        {form.srcData ? (
                          form.media === 'video' ? (
                            <video src={form.srcData} muted loop playsInline className="admin-upload-preview" />
                          ) : (
                            <img src={form.srcData} alt="preview" className="admin-upload-preview" />
                          )
                        ) : editingCardSrc && !form.srcData ? (
                          editingCardSrc.media === 'video' ? (
                            <video src={editingCardSrc.src} poster={editingCardSrc.poster} muted loop playsInline className="admin-upload-preview" />
                          ) : (
                            <img src={editingCardSrc.src} alt="preview" className="admin-upload-preview" />
                          )
                        ) : (
                          <div className="admin-upload-placeholder">
                            {formBusy ? <Loader2 size={20} className="spin" /> : <Plus size={20} />}
                            <span>{form.media === 'video' ? 'Upload video (mp4 / webm, max 90MB)' : 'Upload photo (jpg / png / webp)'}</span>
                          </div>
                        )}
                        <input ref={mediaInputRef} type="file" accept={form.media === 'video' ? 'video/*' : 'image/*'} onChange={pickMedia} hidden />
                        {form.srcData && (
                          <button type="button" className="admin-upload-clear" onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, srcData: null })); }}>
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>

                      {form.media === 'video' && (
                        <div className="admin-upload-zone admin-upload-zone-sm" onClick={() => posterInputRef.current && posterInputRef.current.click()}>
                          {form.posterData ? (
                            <img src={form.posterData} alt="poster" className="admin-upload-preview" />
                          ) : editingCardSrc && editingCardSrc.poster && !form.posterData ? (
                            <img src={editingCardSrc.poster} alt="poster" className="admin-upload-preview" />
                          ) : (
                            <div className="admin-upload-placeholder">
                              <ImageIcon size={16} />
                              <span>Optional poster image</span>
                            </div>
                          )}
                          <input ref={posterInputRef} type="file" accept="image/*" onChange={pickPoster} hidden />
                          {form.posterData && (
                            <button type="button" className="admin-upload-clear" onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, posterData: null })); }}>
                              <Trash2 size={12} /> Remove
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="admin-hero-fields">
                      <label className="admin-field">
                        <span>Title</span>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                          placeholder="e.g. CINEMA STUDIO 4 IS HERE"
                          maxLength={80}
                        />
                      </label>
                      <label className="admin-field">
                        <span>Description</span>
                        <textarea
                          value={form.desc}
                          onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                          placeholder="Short caption under the title"
                          rows={2}
                          maxLength={160}
                        />
                      </label>
                      <label className="admin-field">
                        <span>On click</span>
                        <select value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}>
                          {LINK_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </label>

                      <div className="admin-hero-editor-actions">
                        {editingId && (
                          <button type="button" className="admin-btn-danger" onClick={() => removeCard(editingId)}>
                            <Trash2 size={13} /> Delete Card
                          </button>
                        )}
                        <button type="button" className="admin-btn-outline" onClick={() => { setShowEditor(false); setForm(EMPTY_FORM); setEditingId(null); }}>
                          Cancel
                        </button>
                        <button type="button" className="admin-btn-green" onClick={upsertCard} disabled={formBusy}>
                          <CheckCircle2 size={14} /> {editingId ? 'Update Card' : 'Add to Deck'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {cards.length === 0 ? (
                <div className="admin-empty">No hero cards yet. Add your first card above.</div>
              ) : (
                <div className="admin-hero-grid">
                  {cards.map((card, i) => (
                    <div key={card.id} className="admin-hero-card">
                      <div className="admin-hero-thumb">
                        {card.media === 'video' ? (
                          <video src={card.src} poster={card.poster} muted loop playsInline preload="metadata"
                            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                            onMouseLeave={(e) => e.currentTarget.pause()} />
                        ) : (
                          <img src={card.src} alt={card.title} loading="lazy" decoding="async" />
                        )}
                        <span className={`admin-hero-badge ${card.media === 'video' ? 'video' : 'img'}`}>
                          {card.media === 'video' ? <Film size={10} /> : <ImageIcon size={10} />}
                          {card.media === 'video' ? 'VIDEO' : 'PHOTO'}
                        </span>
                        <span className="admin-hero-index">#{i + 1}</span>
                      </div>
                      <div className="admin-hero-body">
                        <span className="admin-hero-title">{card.title}</span>
                        <span className="admin-hero-desc">{card.desc}</span>
                        <span className="admin-hero-link">{card.link ? card.link : 'no link'}</span>
                        <div className="admin-hero-actions">
                          <button className="admin-action-btn" onClick={() => startEdit(card)}><Edit3 size={12} /> Edit</button>
                          <button className="admin-action-btn danger" onClick={() => removeCard(card.id)}><Trash2 size={12} /> Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-footer-note">
              <AlertTriangle size={13} />
              Media uploads are stored on the server under /uploads.
            </div>
          </>
        )}

        {/* ═══ GALLERY ═══ */}
        {tab === 'gallery' && (
          <>
            <div className="admin-tab-head">
              <h2>Gallery</h2>
              <p>Grid cards below the hero — 9:16 portrait + square accent</p>
            </div>

            <div className="admin-card">
              <div className="admin-table-header">
                <div>
                  <h3 className="admin-card-title" style={{ marginBottom: 0 }}>Gallery Grid</h3>
                  <p className="admin-card-desc" style={{ marginBottom: 0, marginTop: 4 }}>{gallery.length} items</p>
                </div>
                <div className="admin-table-tools">
                  <button className="admin-btn-green" onClick={gSave} disabled={gBusySave}>
                    {gBusySave ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
                    {gBusySave ? 'Publishing...' : 'Publish Changes'}
                  </button>
                  <button className="admin-btn-outline" onClick={gStartAdd}><Plus size={15} /> Add Card</button>
                </div>
              </div>

              {gShowEditor && (
                <div className="admin-hero-editor">
                  <div className="admin-hero-editor-head">
                    <h4>{gEditingId ? 'Edit Card' : 'New Card'}</h4>
                    <span className="admin-hero-editor-note">{gEditingId ? 'Changes apply after Publish.' : 'Fill the fields — media is required.'}</span>
                  </div>

                  <div className="admin-hero-editor-grid">
                    <div>
                      <div className="admin-media-toggle">
                        <button
                          type="button"
                          className={`admin-media-tab ${gForm.media === 'video' ? 'active' : ''}`}
                          onClick={() => setGForm((f) => ({ ...f, media: 'video' }))}
                        >
                          <Film size={14} /> Video
                        </button>
                        <button
                          type="button"
                          className={`admin-media-tab ${gForm.media === 'img' ? 'active' : ''}`}
                          onClick={() => setGForm((f) => ({ ...f, media: 'img' }))}
                        >
                          <ImageIcon size={14} /> Photo
                        </button>
                      </div>

                      <div className="admin-upload-zone" onClick={() => gMediaInputRef.current && gMediaInputRef.current.click()}>
                        {gForm.srcData ? (
                          gForm.media === 'video' ? (
                            <video src={gForm.srcData} muted loop playsInline className="admin-upload-preview" />
                          ) : (
                            <img src={gForm.srcData} alt="preview" className="admin-upload-preview" />
                          )
                        ) : (() => {
                          const current = gEditingId ? gallery.find((it) => it.id === gEditingId) : null;
                          return current && !gForm.srcData ? (
                            current.media === 'video' ? (
                              <video src={current.src} poster={current.poster} muted loop playsInline className="admin-upload-preview" />
                            ) : (
                              <img src={current.src} alt="preview" className="admin-upload-preview" />
                            )
                          ) : (
                            <div className="admin-upload-placeholder">
                              {gFormBusy ? <Loader2 size={20} className="spin" /> : <Plus size={20} />}
                              <span>{gForm.media === 'video' ? 'Upload video (mp4 / webm, max 90MB)' : 'Upload photo (jpg / png / webp)'}</span>
                            </div>
                          );
                        })()}
                        <input ref={gMediaInputRef} type="file" accept={gForm.media === 'video' ? 'video/*' : 'image/*'} onChange={gPickMedia} hidden />
                        {gForm.srcData && (
                          <button type="button" className="admin-upload-clear" onClick={(e) => { e.stopPropagation(); setGForm((f) => ({ ...f, srcData: null })); }}>
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>

                      {gForm.media === 'video' && (
                        <div className="admin-upload-zone admin-upload-zone-sm" onClick={() => gPosterInputRef.current && gPosterInputRef.current.click()}>
                          {gForm.posterData ? (
                            <img src={gForm.posterData} alt="poster" className="admin-upload-preview" />
                          ) : (() => {
                            const current = gEditingId ? gallery.find((it) => it.id === gEditingId) : null;
                            return current && current.poster && !gForm.posterData ? (
                              <img src={current.poster} alt="poster" className="admin-upload-preview" />
                            ) : (
                              <div className="admin-upload-placeholder">
                                <ImageIcon size={16} />
                                <span>Optional poster image</span>
                              </div>
                            );
                          })()}
                          <input ref={gPosterInputRef} type="file" accept="image/*" onChange={gPickPoster} hidden />
                          {gForm.posterData && (
                            <button type="button" className="admin-upload-clear" onClick={(e) => { e.stopPropagation(); setGForm((f) => ({ ...f, posterData: null })); }}>
                              <Trash2 size={12} /> Remove
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="admin-hero-fields">
                      <label className="admin-field">
                        <span>Size / Shape</span>
                        <div className="admin-media-toggle" style={{ marginBottom: 0 }}>
                          <button
                            type="button"
                            className={`admin-media-tab ${gForm.ratio === 'tall' ? 'active' : ''}`}
                            onClick={() => setGForm((f) => ({ ...f, ratio: 'tall' }))}
                          >
                            9:16 Portrait
                          </button>
                          <button
                            type="button"
                            className={`admin-media-tab ${gForm.ratio === 'square' ? 'active' : ''}`}
                            onClick={() => setGForm((f) => ({ ...f, ratio: 'square' }))}
                          >
                            Square
                          </button>
                        </div>
                      </label>

                      <div className="admin-hero-editor-actions">
                        {gEditingId && (
                          <button type="button" className="admin-btn-danger" onClick={() => gRemove(gEditingId)}>
                            <Trash2 size={13} /> Delete Card
                          </button>
                        )}
                        <button type="button" className="admin-btn-outline" onClick={() => { setGShowEditor(false); setGForm(EMPTY_GALLERY_FORM); setGEditingId(null); }}>
                          Cancel
                        </button>
                        <button type="button" className="admin-btn-green" onClick={gUpsert} disabled={gFormBusy}>
                          <CheckCircle2 size={14} /> {gEditingId ? 'Update Card' : 'Add to Grid'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {gallery.length === 0 ? (
                <div className="admin-empty">No gallery cards yet. Add your first card above.</div>
              ) : (
                <div className="admin-hero-grid">
                  {gallery.map((item, i) => (
                    <div key={item.id} className="admin-hero-card">
                      <div className="admin-hero-thumb">
                        {item.media === 'video' ? (
                          <video src={item.src} poster={item.poster} muted loop playsInline preload="metadata"
                            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                            onMouseLeave={(e) => e.currentTarget.pause()} />
                        ) : (
                          <img src={item.src} alt="gallery item" loading="lazy" decoding="async" />
                        )}
                        <span className={`admin-hero-badge ${item.media === 'video' ? 'video' : 'img'}`}>
                          {item.media === 'video' ? <Film size={10} /> : <ImageIcon size={10} />}
                          {item.media === 'video' ? 'VIDEO' : 'PHOTO'}
                        </span>
                        <span className="admin-hero-index">#{i + 1} · {item.ratio}</span>
                      </div>
                      <div className="admin-hero-body">
                        <span className="admin-hero-link" style={{ alignSelf: 'flex-start' }}>
                          {item.ratio === 'square' ? 'Square accent' : '9:16 Portrait'}
                        </span>
                        <div className="admin-hero-actions">
                          <button className="admin-action-btn" onClick={() => gStartEdit(item)}><Edit3 size={12} /> Edit</button>
                          <button className="admin-action-btn danger" onClick={() => gRemove(item.id)}><Trash2 size={12} /> Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-footer-note">
              <AlertTriangle size={13} />
              The square card renders at the top-right of the featured pair; landscape is disabled.
            </div>
          </>
        )}

        {/* ═══ USERS ═══ */}
        {tab === 'users' && (
          <>
            <div className="admin-tab-head">
              <h2>Users</h2>
              <p>Search, filter and manage platform accounts</p>
            </div>

            <div className="admin-card">
              <div className="admin-table-header">
                <h3 className="admin-card-title" style={{ marginBottom: 0 }}>User Management</h3>
                <div className="admin-table-tools">
                  <div className="admin-search-box">
                    <Search size={14} />
                    <input
                      className="admin-search-input"
                      type="text"
                      placeholder="Search users..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <select className="admin-filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All Plans</option>
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="mid">Mid</option>
                    <option value="pro">Pro</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Plan</th>
                      <th>Credits</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="admin-user-cell">
                            <span className="admin-user-avatar">{u.name.charAt(0)}</span>
                            <div>
                              <span className="admin-user-name">{u.name}</span>
                              <span className="admin-user-email">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`admin-plan-tag plan-${u.plan.toLowerCase()}`}>{u.plan}</span>
                        </td>
                        <td>{u.credits}</td>
                        <td>{u.joined}</td>
                        <td>
                          <span className={`admin-status-tag ${u.status === 'Active' ? 'active' : 'suspended'}`}>
                            {u.status === 'Active' ? <CheckCircle2 size={12} /> : <Ban size={12} />}
                            {u.status}
                          </span>
                        </td>
                        <td>
                          <button className="admin-action-btn" onClick={() => toggleStatus(u.id)}>
                            {u.status === 'Active' ? <Ban size={13} /> : <CheckCircle2 size={13} />}
                            {u.status === 'Active' ? 'Suspend' : 'Restore'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="6" className="admin-empty">No users match your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-footer-note">
              <AlertTriangle size={13} />
              Authorized personnel only. All admin actions are logged and audited.
            </div>
          </>
        )}

      </div>
    </div>
  );
}
