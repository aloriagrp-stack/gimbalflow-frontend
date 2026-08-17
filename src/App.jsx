import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';

// Layout & Navigation & Search
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SearchModal from './components/SearchModal';
import { SignOutModal, DeleteAccountModal } from './components/Modals';

// 5 Primary Product Routes & Inner Sub-Pages
import ExplorePage from './pages/ExplorePage';
import ImagePage from './pages/ImagePage';
import ImageHistoryPage from './pages/ImageHistoryPage';
import ImageFavoritesPage from './pages/ImageFavoritesPage';
import ImageAttachmentsPage from './pages/ImageAttachmentsPage';
import VideoPage from './pages/VideoPage';
import CinemaStudioPage from './pages/CinemaStudioPage';
import PresetsPage from './pages/PresetsPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './context/AuthContext';

// Account & Settings Suite Pages & Layout
import AccountLayout from './pages/account/AccountLayout';
import ProfilePage from './pages/account/ProfilePage';
import EditProfilePage from './pages/account/EditProfilePage';
import SettingsPage from './pages/account/SettingsPage';
import BillingPage from './pages/account/BillingPage';
import ProjectsPage from './pages/account/ProjectsPage';
import AssetsPage from './pages/account/AssetsPage';
import AppearancePage from './pages/account/AppearancePage';
import ShortcutsPage from './pages/account/ShortcutsPage';
import HelpPage from './pages/account/HelpPage';
import AdminPanelPage from './pages/AdminPanelPage';

// Central Initial Data Store
import { 
  INITIAL_CREDITS, 
  INITIAL_PROJECTS, 
  INITIAL_ASSETS, 
  INITIAL_EXPLORE, 
  INITIAL_PRESETS 
} from './services/generationService';

import {
  fetchUserProfileApi,
  fetchProjectsApi,
  createProjectApi,
  fetchAssetsApi,
  createAssetApi,
  fetchPresetsApi,
  fetchExploreApi,
  createGenerationJobApi,
  deductCreditsApi
} from './services/apiService';

export default function App() {
  const { user, token, initializing, signOut } = useAuth();

  // Shared Application State
  const [credits, setCredits] = useState(INITIAL_CREDITS);
  const [profile, setProfile] = useState(user);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [creations, setCreations] = useState(INITIAL_EXPLORE);
  const [presets, setPresets] = useState(INITIAL_PRESETS);

  // UI State
  const [toasts, setToasts] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  // Sidebar & Drawers State
  const [activeSidebarModal, setActiveSidebarModal] = useState(null); // 'history' | 'favorites' | 'attachments' | null
  const [sidebarHistory, setSidebarHistory] = useState([]);
  const [sidebarFavorites, setSidebarFavorites] = useState([]);
  const [sidebarAttachments, setSidebarAttachments] = useState([]);

  // Shared Core Loop State
  const [preloadedSetup, setPreloadedSetup] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/explore';
  const isImagePage = location.pathname.startsWith('/image');
  const isAdminPage = location.pathname === '/.shriyanshaloria';

  // Load live data from Backend API on mount (profile only once signed in)
  useEffect(() => {
    if (!user) return;
    setProfile(user);
    if (user.credits_balance !== undefined) setCredits(user.credits_balance);

    async function syncBackendData() {
      const profileData = await fetchUserProfileApi(token);
      if (profileData && profileData.credits_balance !== undefined) {
        setCredits(profileData.credits_balance);
        setProfile(profileData);
      }

      const backendProjects = await fetchProjectsApi();
      if (backendProjects && Array.isArray(backendProjects) && backendProjects.length > 0) {
        setProjects(backendProjects);
      }

      const backendAssets = await fetchAssetsApi();
      if (backendAssets && Array.isArray(backendAssets) && backendAssets.length > 0) {
        setAssets(backendAssets);
      }

      const backendExplore = await fetchExploreApi();
      if (backendExplore && Array.isArray(backendExplore) && backendExplore.length > 0) {
        setCreations(backendExplore);
      }

      const backendPresets = await fetchPresetsApi();
      if (backendPresets && Array.isArray(backendPresets) && backendPresets.length > 0) {
        setPresets(backendPresets);
      }
    }

    syncBackendData();
  }, [user, token]);

  // Keyboard Shortcuts Listener (Ctrl+K for Search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Core Loop Actions: Generation Job Dispatch
  const handleGenerateJob = (type, params) => {
    const cost = type === 'image' ? 10 : type === 'cinema' ? 40 : 20;
    if (credits < cost) {
      showToast('Insufficient credits balance! Please upgrade or purchase credits.');
      return false;
    }

    setCredits(prev => prev - cost);
    deductCreditsApi(cost, token);

    createGenerationJobApi({ type, ...params });

    const id = `gen-${Date.now()}`;
    const newHistItem = {
      id,
      type: type.toUpperCase(),
      prompt: params.prompt,
      model: params.model || 'Higgsfield Cinema Pro',
      url: params.referenceImg || 'https://image.pollinations.ai/prompt/cinematic%20portrait%20of%20a%20woman%20neon%20cyan%20rim%20light%20dark%20studio?width=1000&height=562&seed=501&model=flux&nologo=true',
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSidebarHistory(prev => [newHistItem, ...prev]);

    return { id, type, params, createdAt: new Date() };
  };

  // Core Loop Actions: Remix / Use Creation
  const handleUseCreation = (item) => {
    setPreloadedSetup({
      prompt: item.prompt || item.promptTemplate || item.title,
      model: item.model || 'Seedance v2',
      aspectRatio: item.aspectRatio || '16:9',
      camera: item.camera || 'fpv_drone'
    });

    showToast(`Loaded creative setup into ${item.type === 'image' ? 'Image' : item.type === 'cinema' ? 'Cinema Studio' : 'Video'}!`);
    
    if (item.type === 'image') navigate('/image');
    else if (item.type === 'cinema') navigate('/cinema');
    else navigate('/video');
  };

  // Core Loop Actions: Add Result to Project
  const handleAddToProject = (item) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: item.title || 'Untitled Creation Project',
      type: item.type || 'video',
      scenesCount: 1,
      itemsCount: 1,
      updatedAt: 'Just now',
      tag: item.type === 'image' ? '8K Textures' : '60FPS Video'
    };
    setProjects(prev => [newProj, ...prev]);
    createProjectApi(newProj);
    showToast('Added to project! ✓');
  };

  // Core Loop Actions: Save Result as Reusable Asset
  const handleSaveToAssets = (item) => {
    const newAsset = {
      id: `ast-${Date.now()}`,
      name: item.name || 'New Asset Reference',
      type: item.type || 'image',
      tag: 'Custom Reference',
      tagClass: 'soul',
      meta: 'Used in 1 Project',
      url: item.url
    };
    setAssets(prev => [newAsset, ...prev]);
    createAssetApi(newAsset);
    showToast('Saved to My Assets! ✓');
  };

  const handleSignOutConfirm = () => {
    setSignOutOpen(false);
    signOut();
    showToast('Signed out of GimbalFlow. See you soon!');
    setTimeout(() => navigate('/'), 400);
  };

  const handleDeleteAccountConfirm = () => {
    setDeleteAccountOpen(false);
    showToast('Account scheduled for permanent removal.');
  };

  // AUTH GATE — show a loading splash while checking, then either the login
  // screen (no session) or the app. The admin panel keeps its own login.
  if (initializing) {
    return (
      <div className="app-auth-splash">
        <img src="/logo.svg" alt="GimbalFlow" className="brand-logo-img" />
        <span className="app-auth-splash-spin"></span>
      </div>
    );
  }

  if (!user && location.pathname === '/login') {
    return <LoginPage />;
  }

  return (
    <div className="app-main-wrapper">
      {/* GLOBAL NAVBAR HEADER (HIDDEN ON ADMIN PANEL) */}
      {!isAdminPage && (
        <Navbar 
          credits={credits}
          user={user}
          profile={profile}
          onOpenSignOut={() => setSignOutOpen(true)} 
        />
      )}

      {/* APPLICATION BODY LAYOUT (SCROLLS INSIDE — HEADER NEVER MOVES) */}
      <div className="app-scroll-body">
        
        {/* COLLAPSIBLE LEFT SIDEBAR (RENDERED ONLY FOR IMAGE WORKSPACE PAGES) */}
        {isImagePage && (
          <Sidebar 
            credits={credits}
            showToast={showToast}
          />
        )}

        {/* MAIN WORKSPACE CONTENT AREA (AUTO RESIZES WITH SIDEBAR) */}
        <main style={{ flex: 1, width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* 1. DOMAIN ROOT (EXPLORE SHOWCASE HOME) */}
            <Route 
              path="/" 
              element={
                <ExplorePage 
                  creations={creations} 
                  onUseCreation={handleUseCreation} 
                  showToast={showToast} 
                />
              } 
            />
            <Route path="/explore" element={<Navigate to="/" replace />} />

            {/* 2. IMAGE WORKSPACE & SUB-PAGES */}
            <Route 
              path="/image" 
              element={
                <ImagePage 
                  onGenerate={handleGenerateJob}
                  onAddToProject={handleAddToProject}
                  onSaveToAssets={handleSaveToAssets}
                  projects={projects}
                  preloadedSetup={preloadedSetup}
                  showToast={showToast}
                />
              } 
            />
            <Route 
              path="/image/history" 
              element={
                <ImageHistoryPage 
                  history={sidebarHistory}
                  setHistory={setSidebarHistory}
                  favorites={sidebarFavorites}
                  setFavorites={setSidebarFavorites}
                  showToast={showToast}
                />
              } 
            />
            <Route 
              path="/image/favorites" 
              element={
                <ImageFavoritesPage 
                  favorites={sidebarFavorites}
                  setFavorites={setSidebarFavorites}
                  showToast={showToast}
                />
              } 
            />
            <Route 
              path="/image/attachments" 
              element={
                <ImageAttachmentsPage 
                  attachments={sidebarAttachments}
                  setAttachments={setSidebarAttachments}
                  showToast={showToast}
                />
              } 
            />

            {/* 3. VIDEO */}
            <Route 
              path="/video" 
              element={
                <VideoPage 
                  onGenerate={handleGenerateJob}
                  onAddToProject={handleAddToProject}
                  onSaveToAssets={handleSaveToAssets}
                  preloadedSetup={preloadedSetup}
                  showToast={showToast}
                />
              } 
            />

            {/* 4. CINEMA STUDIO */}
            <Route 
              path="/cinema" 
              element={
                <CinemaStudioPage 
                  onGenerate={handleGenerateJob}
                  onAddToProject={handleAddToProject}
                  onSaveToAssets={handleSaveToAssets}
                  assets={assets}
                  preloadedSetup={preloadedSetup}
                  showToast={showToast}
                />
              } 
            />

            {/* 5. VIRAL PRESETS */}
            <Route 
              path="/presets" 
              element={
                <PresetsPage 
                  presets={presets}
                  onUsePreset={handleUseCreation}
                  showToast={showToast}
                />
              } 
            />

            {/* ACCOUNT & SETTINGS PAGES WITH FIXED LEFT SIDEBAR */}
            <Route element={<AccountLayout onOpenSignOut={() => setSignOutOpen(true)} />}>
              <Route path="/profile" element={<ProfilePage onOpenDeleteAccount={() => setDeleteAccountOpen(true)} showToast={showToast} />} />
              <Route path="/profile/edit" element={<EditProfilePage showToast={showToast} />} />
              <Route path="/settings" element={<SettingsPage showToast={showToast} />} />
              <Route path="/billing" element={<BillingPage showToast={showToast} />} />
              <Route path="/projects" element={<ProjectsPage showToast={showToast} />} />
              <Route path="/assets" element={<AssetsPage showToast={showToast} />} />
              <Route path="/appearance" element={<AppearancePage showToast={showToast} />} />
              <Route path="/shortcuts" element={<ShortcutsPage showToast={showToast} />} />
              <Route path="/help" element={<HelpPage showToast={showToast} />} />
            </Route>

            {/* LOGIN ROUTE */}
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />

            {/* ADMIN PANEL (RESTRICTED) */}
            <Route path="/.shriyanshaloria" element={<AdminPanelPage showToast={showToast} />} />

            {/* FALLBACK ROUTE TO /explore */}
            <Route path="*" element={<Navigate to="/explore" replace />} />
          </Routes>
        </main>

      </div>

      {/* SEARCH MODAL */}
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)}
        creations={creations}
        presets={presets}
        projects={projects}
        assets={assets}
      />

      {/* CONFIRMATION MODALS */}
      <SignOutModal 
        isOpen={signOutOpen} 
        onClose={() => setSignOutOpen(false)} 
        onConfirm={handleSignOutConfirm} 
      />
      <DeleteAccountModal 
        isOpen={deleteAccountOpen} 
        onClose={() => setDeleteAccountOpen(false)} 
        onConfirm={handleDeleteAccountConfirm} 
      />

      {/* GLOBAL TOAST NOTIFICATIONS */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast-msg">
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
