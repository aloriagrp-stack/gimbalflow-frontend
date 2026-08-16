/* MAIN APPLICATION CONTROLLER */
import { 
  CAMERA_PRESETS, 
  AI_MODELS, 
  SOUL_CHARACTERS, 
  GALLERY_ITEMS, 
  CanvasVideoRenderer 
} from './media-library.js';

import { CameraVisualizer } from './camera-visualizer.js';
import { NodeCanvasEditor } from './node-canvas.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const cameraGrid = document.getElementById('cameraGrid');
  const modelSelect = document.getElementById('modelSelect');
  const soulCharGrid = document.getElementById('soulCharGrid');
  const exploreGalleryGrid = document.getElementById('exploreGalleryGrid');
  const homeExploreGrid = document.getElementById('homeExploreGrid');
  const promptInput = document.getElementById('promptInput');
  const enhancePromptBtn = document.getElementById('enhancePromptBtn');
  const generateVideoBtn = document.getElementById('generateVideoBtn');
  const renderOverlay = document.getElementById('renderOverlay');
  const renderProgressBar = document.getElementById('renderProgressBar');
  const renderStatusText = document.getElementById('renderStatusText');
  const renderSubstep = document.getElementById('renderSubstep');
  const speedSlider = document.getElementById('speedSlider');
  const speedVal = document.getElementById('speedVal');
  const scaleSlider = document.getElementById('scaleSlider');
  const scaleVal = document.getElementById('scaleVal');
  const toastContainer = document.getElementById('toastContainer');
  const playPauseBtn = document.getElementById('playPauseBtn');

  // Announcement Bar & Mobile Nav Elements
  const announcementBar = document.getElementById('announcementBar');
  const closeAnnouncementBtn = document.getElementById('closeAnnouncementBtn');
  const announcementCta = document.getElementById('announcementCta');
  const brandLogoHomeTrigger = document.getElementById('brandLogoHomeTrigger');
  const startCreatingHeaderBtn = document.getElementById('startCreatingHeaderBtn');
  const mobileMenuToggleBtn = document.getElementById('mobileMenuToggleBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavCloseBtn = document.getElementById('mobileNavCloseBtn');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const mobileStartCreatingBtn = document.getElementById('mobileStartCreatingBtn');

  // Hero & Homepage Action Triggers
  const heroStartCreatingBtn = document.getElementById('heroStartCreatingBtn');
  const heroExploreBtn = document.getElementById('heroExploreBtn');
  const heroDeckEnhanceBtn = document.getElementById('heroDeckEnhanceBtn');
  const homeViewFullGalleryBtn = document.getElementById('homeViewFullGalleryBtn');
  const finalCtaStartBtn = document.getElementById('finalCtaStartBtn');
  const finalCtaDocsBtn = document.getElementById('finalCtaDocsBtn');

  // State Variables
  let activeCameraMode = 'fpv_drone';
  let activeModel = 'seedance_2';
  let selectedSoulId = 'char_valkyrie';
  let videoRenderer = null;
  let cameraVisualizer = null;
  let nodeEditor = null;
  let isGenerating = false;

  // TAB SWITCHER FUNCTION
  function switchTab(targetTabId) {
    tabBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === targetTabId);
    });
    mobileNavItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-tab') === targetTabId);
    });
    tabPanels.forEach(p => p.classList.remove('active'));

    const targetPanel = document.getElementById(targetTabId);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    if (targetTabId === 'canvasTab' && !nodeEditor) {
      initNodeEditor();
    }

    // Scroll to top of app body
    const homeWrapper = document.querySelector('.homepage-wrapper');
    if (homeWrapper && targetTabId === 'homeTab') {
      homeWrapper.scrollTop = 0;
    }

    if (mobileNavDrawer) mobileNavDrawer.classList.remove('open');
  }

  // 1. INITIALIZE TAB ROUTING
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');
      switchTab(targetTabId);
    });
  });

  // Logo Trigger -> Home Tab
  if (brandLogoHomeTrigger) {
    brandLogoHomeTrigger.addEventListener('click', () => switchTab('homeTab'));
  }

  // Announcement Bar Actions
  if (closeAnnouncementBtn) {
    closeAnnouncementBtn.addEventListener('click', () => {
      announcementBar.classList.add('dismissed');
    });
  }
  if (announcementCta) {
    announcementCta.addEventListener('click', () => switchTab('studioTab'));
  }

  // Mobile Navigation Drawer Toggle
  if (mobileMenuToggleBtn) {
    mobileMenuToggleBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.add('open');
    });
  }
  if (mobileNavCloseBtn) {
    mobileNavCloseBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.remove('open');
    });
  }
  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTabId = item.getAttribute('data-tab');
      switchTab(targetTabId);
    });
  });
  if (mobileStartCreatingBtn) {
    mobileStartCreatingBtn.addEventListener('click', () => switchTab('studioTab'));
  }

  // ACCOUNT SUBVIEW ROUTER FUNCTION WITH CLEAN URLS (/profile, /settings, etc.)
  function switchAccountSubView(route, pushState = true) {
    switchTab('accountTab');

    const viewId = route + 'View';
    const targetSubView = document.getElementById(viewId);
    const subViews = document.querySelectorAll('.account-subview');
    const sidebarItems = document.querySelectorAll('#accountSidebarNav .account-nav-item');

    if (targetSubView) {
      subViews.forEach(v => v.classList.remove('active'));
      targetSubView.classList.add('active');

      sidebarItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-route') === route);
      });

      if (pushState) {
        window.history.pushState({ route }, '', '/' + route);
      }

      const accountTab = document.getElementById('accountTab');
      if (accountTab) accountTab.scrollTop = 0;
    }
  }

  // User Profile Button & Dropdown Menu Interactivity
  const userProfileHeaderBtn = document.getElementById('userProfileHeaderBtn');
  const profileDropdownMenu = document.getElementById('profileDropdownMenu');

  if (userProfileHeaderBtn && profileDropdownMenu) {
    userProfileHeaderBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = profileDropdownMenu.classList.contains('open');
      profileDropdownMenu.classList.toggle('open', !isOpen);
      userProfileHeaderBtn.setAttribute('aria-expanded', !isOpen);
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!profileDropdownMenu.contains(e.target) && !userProfileHeaderBtn.contains(e.target)) {
        profileDropdownMenu.classList.remove('open');
        userProfileHeaderBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Dropdown Items Action Click Handlers
    profileDropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const route = item.getAttribute('data-route');
        const action = item.getAttribute('data-action');
        profileDropdownMenu.classList.remove('open');
        userProfileHeaderBtn.setAttribute('aria-expanded', 'false');

        if (action === 'Sign Out' || route === 'signout') {
          openModal('signOutModal');
        } else if (route) {
          switchAccountSubView(route);
        } else if (action) {
          const mappedRoute = action.toLowerCase().replace(/ & /g, '').replace(/ /g, '');
          if (document.getElementById(mappedRoute + 'View')) {
            switchAccountSubView(mappedRoute);
          } else {
            showToast(`Opening ${action}...`);
          }
        }
      });
    });
  }

  // ACCOUNT SIDEBAR NAVIGATION HANDLERS
  const accountSidebarItems = document.querySelectorAll('#accountSidebarNav .account-nav-item');
  accountSidebarItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const route = btn.getAttribute('data-route');
      if (btn.id === 'sidebarSignOutBtn' || !route) {
        openModal('signOutModal');
      } else {
        switchAccountSubView(route);
      }
    });
  });

  // MODAL CONTROLLERS
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }

  // Sign Out Modal Handlers
  const cancelSignOutBtn = document.getElementById('cancelSignOutBtn');
  const confirmSignOutBtn = document.getElementById('confirmSignOutBtn');

  if (cancelSignOutBtn) cancelSignOutBtn.addEventListener('click', () => closeModal('signOutModal'));
  if (confirmSignOutBtn) {
    confirmSignOutBtn.addEventListener('click', () => {
      closeModal('signOutModal');
      showToast('Signed out of PROJECT-H session. Clear state.');
      setTimeout(() => switchTab('homeTab'), 600);
    });
  }

  // Delete Account Modal Handlers
  const openDeleteAccountModalBtn = document.getElementById('openDeleteAccountModalBtn');
  const cancelDeleteAccountBtn = document.getElementById('cancelDeleteAccountBtn');
  const confirmDeleteAccountBtn = document.getElementById('confirmDeleteAccountBtn');

  if (openDeleteAccountModalBtn) {
    openDeleteAccountModalBtn.addEventListener('click', () => openModal('deleteAccountModal'));
  }
  if (cancelDeleteAccountBtn) cancelDeleteAccountBtn.addEventListener('click', () => closeModal('deleteAccountModal'));
  if (confirmDeleteAccountBtn) {
    confirmDeleteAccountBtn.addEventListener('click', () => {
      closeModal('deleteAccountModal');
      showToast('Account scheduled for permanent removal.');
    });
  }

  // INITIALIZE CLEAN ROUTING FOR ACCOUNT SUITE (/profile, /settings, /billing, etc.)
  function handleUrlRoute() {
    const pathname = window.location.pathname.replace(/^\//, '');
    const hash = window.location.hash.replace('#', '');
    const targetRoute = pathname || hash;
    const validRoutes = ['profile', 'settings', 'billing', 'projects', 'assets', 'appearance', 'shortcuts', 'help'];
    
    if (validRoutes.includes(targetRoute)) {
      switchAccountSubView(targetRoute, false);
    }
  }

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.route) {
      switchAccountSubView(e.state.route, false);
    } else {
      handleUrlRoute();
    }
  });

  window.addEventListener('hashchange', handleUrlRoute);
  handleUrlRoute();

  // FORM & SUBVIEW INTERACTIVE CONTROLLERS
  // 1. Personal Info Form
  const personalInfoForm = document.getElementById('personalInfoForm');
  const personalInfoStatus = document.getElementById('personalInfoStatus');
  if (personalInfoForm) {
    personalInfoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (personalInfoStatus) {
        personalInfoStatus.textContent = 'Saving...';
        setTimeout(() => {
          personalInfoStatus.textContent = 'Saved ✓';
          showToast('Personal information updated successfully.');
          setTimeout(() => { personalInfoStatus.textContent = ''; }, 3000);
        }, 600);
      }
    });
  }

  // 2. Creator Profile Form
  const creatorProfileForm = document.getElementById('creatorProfileForm');
  const creatorBioStatus = document.getElementById('creatorBioStatus');
  if (creatorProfileForm) {
    creatorProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (creatorBioStatus) {
        creatorBioStatus.textContent = 'Saving...';
        setTimeout(() => {
          creatorBioStatus.textContent = 'Saved ✓';
          showToast('Creator details saved.');
          setTimeout(() => { creatorBioStatus.textContent = ''; }, 3000);
        }, 600);
      }
    });
  }

  // 3. Specialization Chips Toggle
  document.querySelectorAll('.spec-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });

  // 4. Settings Save Button
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const settingsSaveStatus = document.getElementById('settingsSaveStatus');
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      if (settingsSaveStatus) {
        settingsSaveStatus.textContent = 'Saving...';
        setTimeout(() => {
          settingsSaveStatus.textContent = 'Saved ✓';
          showToast('Workspace settings saved.');
          setTimeout(() => { settingsSaveStatus.textContent = ''; }, 3000);
        }, 500);
      }
    });
  }

  // 5. Credit Package Top Up Buttons
  document.querySelectorAll('.pack-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pack = btn.getAttribute('data-pack');
      showToast(`Selected ${pack} Credits Package. Directing to Checkout...`);
    });
  });

  // 6. Project Filters
  const projectSearchInput = document.getElementById('projectSearchInput');
  const projectFilterChips = document.querySelectorAll('#projectFilterChips .filter-chip');
  const projectCards = document.querySelectorAll('#userProjectsGrid .project-card');
  const projectsEmptyState = document.getElementById('projectsEmptyState');

  function filterProjects() {
    const query = projectSearchInput ? projectSearchInput.value.toLowerCase() : '';
    const activeChip = document.querySelector('#projectFilterChips .filter-chip.active');
    const filter = activeChip ? activeChip.getAttribute('data-filter') : 'all';

    let visibleCount = 0;
    projectCards.forEach(card => {
      const type = card.getAttribute('data-type');
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const matchesFilter = filter === 'all' || type === filter;
      const matchesSearch = !query || name.includes(query);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (projectsEmptyState) {
      projectsEmptyState.classList.toggle('hidden', visibleCount > 0);
    }
  }

  if (projectSearchInput) projectSearchInput.addEventListener('input', filterProjects);
  projectFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      projectFilterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filterProjects();
    });
  });

  // 7. Asset Category Tabs Filter
  const assetTabs = document.querySelectorAll('#assetCategoryTabs .asset-tab');
  const assetCards = document.querySelectorAll('#userAssetsGrid .asset-item-card');

  assetTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      assetTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-cat');

      assetCards.forEach(card => {
        const itemCat = card.getAttribute('data-cat');
        if (cat === 'all' || itemCat === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 8. FAQ Accordion Toggles
  document.querySelectorAll('.faq-question-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const faqItem = btn.closest('.faq-item');
      if (faqItem) faqItem.classList.toggle('open');
    });
  });

  // Header & Hero CTAs -> Switch to Studio / Explore Tab
  if (startCreatingHeaderBtn) {
    startCreatingHeaderBtn.addEventListener('click', () => switchTab('studioTab'));
  }
  if (heroStartCreatingBtn) {
    heroStartCreatingBtn.addEventListener('click', () => switchTab('studioTab'));
  }
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', () => switchTab('exploreTab'));
  }
  if (finalCtaStartBtn) {
    finalCtaStartBtn.addEventListener('click', () => switchTab('studioTab'));
  }
  if (finalCtaDocsBtn) {
    finalCtaDocsBtn.addEventListener('click', () => showToast('Opening PROJECT-H API & Developer Documentation...'));
  }
  if (homeViewFullGalleryBtn) {
    homeViewFullGalleryBtn.addEventListener('click', () => switchTab('exploreTab'));
  }

  // Mode Cards -> Trigger Studio Tab
  document.querySelectorAll('.mode-action-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab('studioTab'));
  });

  // Footer Links Handling
  document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetTab = link.getAttribute('data-tab');
      if (targetTab) {
        e.preventDefault();
        switchTab(targetTab);
      }
    });
  });

  // 2. POPULATE CAMERA MOTION GRID
  CAMERA_PRESETS.forEach(preset => {
    const card = document.createElement('div');
    card.className = `camera-card ${preset.id === activeCameraMode ? 'selected' : ''}`;
    card.setAttribute('data-id', preset.id);
    card.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke-width="2">
        <path d="${preset.icon}"/>
      </svg>
      <span>${preset.name}</span>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.camera-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      activeCameraMode = preset.id;

      if (cameraVisualizer) {
        cameraVisualizer.setMode(activeCameraMode);
      }
      if (videoRenderer) {
        videoRenderer.setCameraMode(activeCameraMode);
      }
      showToast(`Camera Motion set to: ${preset.name}`);
    });

    cameraGrid.appendChild(card);
  });

  // 3. POPULATE AI MODELS SELECT
  AI_MODELS.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.name} (${m.quality})`;
    modelSelect.appendChild(opt);
  });

  // 4. POPULATE SOUL ID CHARACTERS
  SOUL_CHARACTERS.forEach(char => {
    const card = document.createElement('div');
    card.className = `character-card ${char.id === selectedSoulId ? 'active-char' : ''}`;
    card.innerHTML = `
      <div style="height: 200px; background: linear-gradient(135deg, ${char.colorHex}22, #07080c); display: flex; align-items: center; justify-content: center; position: relative;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${char.colorHex}" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.8); border: 1px solid ${char.colorHex}; font-size: 0.65rem; color: ${char.colorHex}; padding: 2px 8px; border-radius: 99px;">LOCKED</span>
      </div>
      <div class="character-info">
        <div class="character-name">${char.name}</div>
        <div class="character-desc">${char.style}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.character-card').forEach(c => c.classList.remove('active-char'));
      card.classList.add('active-char');
      selectedSoulId = char.id;
      promptInput.value = `${promptInput.value}, featuring ${char.promptTag}`;
      showToast(`Soul ID Attached: ${char.name}`);
    });

    soulCharGrid.appendChild(card);
  });

  // 5. POPULATE EXPLORE SHOWCASE & REMIX
  GALLERY_ITEMS.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <div class="gallery-media">
        <canvas class="gallery-canvas" width="400" height="225"></canvas>
        <button class="remix-overlay-btn" data-id="${item.id}">⚡ Remix Scene</button>
      </div>
      <div class="gallery-details">
        <div class="gallery-prompt">${item.prompt}</div>
        <div class="gallery-meta">
          <span>🎥 ${item.camera}</span>
          <span>❤️ ${item.likes}</span>
        </div>
      </div>
    `;

    const btn = card.querySelector('.remix-overlay-btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      remixScene(item);
    });

    exploreGalleryGrid.appendChild(card);

    if (homeExploreGrid) {
      const homeCard = card.cloneNode(true);
      const homeBtn = homeCard.querySelector('.remix-overlay-btn');
      if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          remixScene(item);
        });
      }
      homeExploreGrid.appendChild(homeCard);

      const homeCanvas = homeCard.querySelector('.gallery-canvas');
      const homeGalRenderer = new CanvasVideoRenderer(homeCanvas);
      homeGalRenderer.setCameraMode('fpv_drone');
      homeGalRenderer.start();
    }

    // Mini Renderer for Showcase Video Cards
    const galleryCanvas = card.querySelector('.gallery-canvas');
    const galRenderer = new CanvasVideoRenderer(galleryCanvas);
    galRenderer.setCameraMode('fpv_drone');
    galRenderer.start();
  });

  // 6. INITIALIZE CANVAS RENDERERS
  const videoCanvas = document.getElementById('videoCanvas');
  videoRenderer = new CanvasVideoRenderer(videoCanvas);
  videoRenderer.setCameraMode(activeCameraMode);
  videoRenderer.start();

  const camera3DCanvas = document.getElementById('camera3DCanvas');
  cameraVisualizer = new CameraVisualizer(camera3DCanvas);
  cameraVisualizer.setMode(activeCameraMode);

  function initNodeEditor() {
    const nodeGraphCanvas = document.getElementById('nodeGraphCanvas');
    nodeEditor = new NodeCanvasEditor(nodeGraphCanvas);
  }

  // 7. SLIDER CONTROLS
  speedSlider.addEventListener('input', (e) => {
    speedVal.textContent = `${e.target.value}x`;
  });

  scaleSlider.addEventListener('input', (e) => {
    scaleVal.textContent = `${e.target.value}%`;
  });

  // 8. PROMPT AI ENHANCER
  enhancePromptBtn.addEventListener('click', () => {
    const text = promptInput.value;
    promptInput.value = `${text}, hyper-realistic lighting, 8k cinematic resolution, shot on Arri Alexa, motion blur, 60fps, ray-traced volume reflections`;
    showToast('Prompt Enhanced with Project-H AI Engine');
  });

  // 9. AI VIDEO GENERATION PIPELINE SIMULATION
  generateVideoBtn.addEventListener('click', () => {
    if (isGenerating) return;
    isGenerating = true;

    renderOverlay.classList.add('active');
    renderProgressBar.style.width = '0%';

    const steps = [
      { pct: 15, text: 'Sampling Latent Noise Vectors...', sub: 'Initializing Seedance 2.0 Transformer' },
      { pct: 40, text: 'Applying Director Camera Motion Parameters...', sub: `Trajectory: ${activeCameraMode.toUpperCase()}` },
      { pct: 70, text: 'Enforcing Soul ID Character Consistency...', sub: 'Anatomy & Outfit Feature Alignment' },
      { pct: 90, text: 'Frame Interpolation & 4K Upscale Render...', sub: 'Exporting 60 FPS ProRes Video' },
      { pct: 100, text: 'Generation Complete!', sub: 'Ready for Playback & Export' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const s = steps[currentStep];
        renderProgressBar.style.width = `${s.pct}%`;
        renderStatusText.textContent = s.text;
        renderSubstep.textContent = s.sub;
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          renderOverlay.classList.remove('active');
          isGenerating = false;
          showToast('Video Generated Successfully!');
        }, 500);
      }
    }, 600);
  });

  // 10. PLAY/PAUSE CONTROL
  playPauseBtn.addEventListener('click', () => {
    if (videoRenderer.isPlaying) {
      videoRenderer.isPlaying = false;
      playPauseBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    } else {
      videoRenderer.isPlaying = true;
      playPauseBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    }
  });

  // 11. REMIX SCENE FUNCTION
  function remixScene(item) {
    promptInput.value = item.prompt;
    
    // Select camera mode
    const cameraMatch = CAMERA_PRESETS.find(c => item.camera.toLowerCase().includes(c.id.replace('_', '')));
    if (cameraMatch) {
      activeCameraMode = cameraMatch.id;
      document.querySelectorAll('.camera-card').forEach(c => {
        c.classList.toggle('selected', c.getAttribute('data-id') === activeCameraMode);
      });
      if (cameraVisualizer) cameraVisualizer.setMode(activeCameraMode);
      if (videoRenderer) videoRenderer.setCameraMode(activeCameraMode);
    }

    // Switch to Studio Tab
    document.querySelector('.tab-btn[data-tab="studioTab"]').click();
    showToast(`Remixed Scene: "${item.title}"`);
  }

  // 12. TOAST NOTIFICATION UTILITY
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <span>${msg}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Export 4K Button Toast
  document.getElementById('headerExportBtn').addEventListener('click', () => {
    showToast('Exporting Video in 4K ProRes 60FPS Format...');
  });
});
