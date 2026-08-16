/* MEDIA LIBRARY & PROCEDURAL CINEMATIC RENDERER */

export const CAMERA_PRESETS = [
  { id: 'dolly_in', name: 'Dolly In / Push', icon: 'M15 12H3m0 0l4-4m-4 4l4 4M21 12h-3', speed: 1.2 },
  { id: 'orbit_360', name: 'Orbital Arc 360°', icon: 'M4 12a8 8 0 1116 0 8 8 0 01-16 0z', speed: 0.8 },
  { id: 'fpv_drone', name: 'FPV Drone Swoop', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', speed: 2.0 },
  { id: 'crane_up', name: 'Crane Up / Tilt', icon: 'M5 10l7-7 7 7M12 3v18', speed: 1.0 },
  { id: 'bullet_time', name: 'Bullet Time Matrix', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', speed: 0.4 },
  { id: 'handheld_shake', name: 'Handheld Action', icon: 'M13 10V3L4 14h7v7l9-11h-7z', speed: 1.5 }
];

export const AI_MODELS = [
  { id: 'seedance_2', name: 'Seedance 2.0 Pro (Ultra Cinematic)', quality: '4K 60fps', desc: 'Highest photorealism & fluid camera physics' },
  { id: 'project_h_v3', name: 'Project-H Engine v3', quality: 'Original Director Engine', desc: 'Precise motion vectors & character persistence' },
  { id: 'kling_15', name: 'Kling AI 1.5 High Dynamic', quality: 'Hyper Action', desc: 'Optimized for high-speed motion & physics' },
  { id: 'flux_video', name: 'Flux Video Engine', quality: 'Artistic / Stylized', desc: 'Vibrant colors and surreal visual fidelity' }
];

export const LENS_PRESETS = [
  { id: '24mm', name: '24mm Anamorphic (Wide Lens)' },
  { id: '35mm', name: '35mm Prime (Cinematic Standard)' },
  { id: '85mm', name: '85mm Portrait (Bokeh Depth)' }
];

export const SOUL_CHARACTERS = [
  {
    id: 'char_valkyrie',
    name: 'Kira Vance - Cyber Pilot',
    style: 'Sci-Fi Cyberpunk',
    promptTag: 'cyberpunk female pilot Kira Vance with glowing chrome helmet, neon visor',
    colorHex: '#00f2ff'
  },
  {
    id: 'char_samurai',
    name: 'Kenji - Cyber Samurai',
    style: 'Neo Tokyo Noir',
    promptTag: 'cybernetic samurai warrior Kenji with dark katana, rain drenched street',
    colorHex: '#ff3366'
  },
  {
    id: 'char_elena',
    name: 'Elena - Futuristic Model',
    style: 'High Fashion Futuristic',
    promptTag: 'futuristic high fashion model Elena wearing liquid gold gown, studio light',
    colorHex: '#00e5ff'
  },
  {
    id: 'char_alchemist',
    name: 'Aethelgard - Spellcaster',
    style: 'Dark Fantasy',
    promptTag: 'dark fantasy spellcaster Aethelgard with swirling violet mana runes',
    colorHex: '#0075ff'
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'gal_1',
    title: 'Neon Cyberpunk Pursuit',
    prompt: 'FPV Drone swoop following high speed hovercraft through glowing neon skyscrapers of Neo-Tokyo, rain reflections 8k cinematic anamorphic',
    camera: 'FPV Drone Swoop',
    model: 'Seedance 2.0 Pro',
    category: 'Cinematic',
    likes: 1420
  },
  {
    id: 'gal_2',
    title: 'Galactic Horizon Orbital',
    prompt: 'Orbital Arc 360 camera around astronaut standing on volcanic obsidian planetary ridge, dual moons rising, volcanic ash particles in slow motion',
    camera: 'Orbital Arc 360°',
    model: 'Project-H Engine v3',
    category: 'VFX & Sci-Fi',
    likes: 2890
  },
  {
    id: 'gal_3',
    title: 'Cyber Samurai Rain Blade',
    prompt: 'Slow motion dolly push in on cyber samurai unsheathing plasma blade in rainy alley, water drops freezing in bullet time cinematic lighting',
    camera: 'Bullet Time Matrix',
    model: 'Kling AI 1.5',
    category: 'Photorealism',
    likes: 3105
  },
  {
    id: 'gal_4',
    title: 'Liquid Gold Fashion Commercial',
    prompt: 'High fashion cinematic commercial, elegant model moving in liquid gold drapery, dramatic softbox lighting, 85mm prime lens bokeh',
    camera: 'Crane Up / Tilt',
    model: 'Seedance 2.0 Pro',
    category: 'Marketing Ads',
    likes: 980
  }
];

/* PROCEDURAL CINEMATIC CANVAS ANIMATOR */
export class CanvasVideoRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.animId = null;
    this.time = 0;
    this.isPlaying = true;
    this.cameraMode = 'dolly_in';
    this.promptText = 'Cinematic Scene';
    this.particles = [];
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 2 + 0.5,
        radius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.002,
        speedY: (Math.random() - 0.5) * 0.002,
        alpha: Math.random() * 0.8 + 0.2
      });
    }
  }

  setCameraMode(mode) {
    this.cameraMode = mode;
  }

  setPrompt(prompt) {
    this.promptText = prompt;
  }

  start() {
    if (!this.animId) {
      const renderLoop = () => {
        if (this.isPlaying) {
          this.time += 0.02;
          this.drawFrame();
        }
        this.animId = requestAnimationFrame(renderLoop);
      };
      renderLoop();
    }
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  drawFrame() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Clear background
    ctx.fillStyle = '#050609';
    ctx.fillRect(0, 0, w, h);

    // Compute Camera Motion Offsets
    let camOffsetX = 0;
    let camOffsetY = 0;
    let zoomFactor = 1;
    let rotation = 0;

    switch (this.cameraMode) {
      case 'dolly_in':
        zoomFactor = 1 + (Math.sin(this.time * 0.8) * 0.25 + 0.25);
        break;
      case 'orbit_360':
        camOffsetX = Math.cos(this.time) * (w * 0.15);
        camOffsetY = Math.sin(this.time) * (h * 0.08);
        break;
      case 'fpv_drone':
        camOffsetX = Math.sin(this.time * 2) * (w * 0.2);
        camOffsetY = Math.cos(this.time * 1.5) * (h * 0.15);
        rotation = Math.sin(this.time * 1.5) * 0.1;
        break;
      case 'crane_up':
        camOffsetY = -((this.time * 30) % (h * 0.4)) + (h * 0.2);
        break;
      case 'bullet_time':
        camOffsetX = Math.cos(this.time * 0.3) * (w * 0.25);
        rotation = this.time * 0.1;
        break;
      case 'handheld_shake':
        camOffsetX = (Math.random() - 0.5) * 8;
        camOffsetY = (Math.random() - 0.5) * 8;
        break;
      default:
        break;
    }

    ctx.save();
    ctx.translate(w / 2 + camOffsetX, h / 2 + camOffsetY);
    ctx.rotate(rotation);
    ctx.scale(zoomFactor, zoomFactor);

    // Draw Cinematic Cyberpunk City Grid / Horizon Lines
    const gridGrad = ctx.createRadialGradient(0, 0, 50, 0, 0, w * 0.8);
    gridGrad.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
    gridGrad.addColorStop(0.5, 'rgba(0, 242, 255, 0.15)');
    gridGrad.addColorStop(1, 'rgba(4, 5, 8, 0)');
    ctx.fillStyle = gridGrad;
    ctx.beginPath();
    ctx.arc(0, 0, w * 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Draw Horizon Cyber Pillars
    for (let i = -4; i <= 4; i++) {
      const px = i * 80;
      const pyHeight = 120 + Math.sin(this.time + i) * 30;
      
      ctx.fillStyle = i % 2 === 0 ? 'rgba(0, 242, 255, 0.4)' : 'rgba(236, 72, 153, 0.4)';
      ctx.fillRect(px - 20, -100, 40, pyHeight);

      // Neon Rim Highlights
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(px - 20, -100, 40, pyHeight);
    }

    // Floating Light Particles
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x > 1) p.x = 0;
      if (p.x < 0) p.x = 1;
      if (p.y > 1) p.y = 0;
      if (p.y < 0) p.y = 1;

      const px = (p.x - 0.5) * w * 1.2;
      const py = (p.y - 0.5) * h * 1.2;

      ctx.fillStyle = `rgba(0, 242, 255, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, p.radius * p.z, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Cinematic Anamorphic Lens Flare Line
    const flareGrad = ctx.createLinearGradient(-w, 0, w, 0);
    flareGrad.addColorStop(0, 'transparent');
    flareGrad.addColorStop(0.4, 'rgba(0, 242, 255, 0.8)');
    flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
    flareGrad.addColorStop(0.6, 'rgba(139, 92, 246, 0.8)');
    flareGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = flareGrad;
    ctx.fillRect(-w / 2, -2, w, 4);

    ctx.restore();

    // Render Overlay Meta Badges (REC indicator, resolution, fps)
    ctx.fillStyle = '#ff3366';
    ctx.beginPath();
    ctx.arc(24, 24, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 12px Inter, sans-serif';
    ctx.fillText('REC - PROJECT-H AI ENGINE', 38, 28);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '500 11px Inter, sans-serif';
    ctx.fillText(`CAMERA: ${this.cameraMode.toUpperCase()} | 4K PRORES 60FPS`, 24, h - 20);
  }
}
