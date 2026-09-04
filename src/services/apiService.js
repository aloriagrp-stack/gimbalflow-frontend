// GimbalFlow Backend API Integration Client

const API_BASE = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.warn('API Health check offline:', err.message);
    return null;
  }
}

export async function fetchUserProfileApi(token) {
  try {
    const res = await fetch(`${API_BASE}/user/profile`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return await res.json();
  } catch (err) {
    console.warn('API fetchUserProfile fallback:', err.message);
    return null;
  }
}

export async function fetchProjectsApi() {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return await res.json();
  } catch (err) {
    console.warn('API fetchProjects fallback:', err.message);
    return null;
  }
}

export async function createProjectApi(projectData) {
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (!res.ok) throw new Error('Failed to create project');
    return await res.json();
  } catch (err) {
    console.warn('API createProject fallback:', err.message);
    return null;
  }
}

export async function fetchAssetsApi() {
  try {
    const res = await fetch(`${API_BASE}/assets`);
    if (!res.ok) throw new Error('Failed to fetch assets');
    return await res.json();
  } catch (err) {
    console.warn('API fetchAssets fallback:', err.message);
    return null;
  }
}

export async function createAssetApi(assetData) {
  try {
    const res = await fetch(`${API_BASE}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assetData)
    });
    if (!res.ok) throw new Error('Failed to create asset');
    return await res.json();
  } catch (err) {
    console.warn('API createAsset fallback:', err.message);
    return null;
  }
}

export async function fetchPresetsApi() {
  try {
    const res = await fetch(`${API_BASE}/presets`);
    if (!res.ok) throw new Error('Failed to fetch presets');
    return await res.json();
  } catch (err) {
    console.warn('API fetchPresets fallback:', err.message);
    return null;
  }
}

export async function fetchExploreApi() {
  try {
    const res = await fetch(`${API_BASE}/explore`);
    if (!res.ok) throw new Error('Failed to fetch explore');
    return await res.json();
  } catch (err) {
    console.warn('API fetchExplore fallback:', err.message);
    return null;
  }
}

export async function enhancePromptApi(prompt) {
  try {
    const res = await fetch(`${API_BASE}/generate/enhance-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.enhanced_prompt) return data;
    }
  } catch (err) {
    console.warn('Backend enhancePrompt call failed, switching to client director engine:', err.message);
  }

  // Resilient Client-Side Director-Grade Engine Fallback
  const p = (prompt || '').trim();
  const lower = p.toLowerCase();

  let category = 'GENERAL';
  let cleanSubject = p.replace(/^(please\s+)?(can\s+you\s+)?(make|create|generate|draw|render|produce|show|give\s+me)\s+(an?|the|some)?\s+/i, '')
                      .replace(/^(a\s+)?(picture|photo|photograph|image|illustration|render)\s+(of\s+(an?|the)?)?\s*/i, '')
                      .trim() || p;

  if (/(apple|fruit|burger|pizza|coffee|cake|bread|steak|food|cocktail|pasta|dessert|berry|orange|chocolate)/i.test(lower)) {
    category = 'FOOD_ORGANIC';
    const sub = cleanSubject.toLowerCase() === 'apple' ? 'fresh crisp ripe red Honeycrisp apple' : cleanSubject;
    return {
      original_prompt: p,
      enhanced_prompt: `Extreme macro commercial studio photography of ${sub}, shot on Hasselblad H6D-100c with HC 100mm f/2.2 Macro lens, glistening morning condensation dew droplets on waxy skin, ultra-fine organic pores, crisp natural cuticle micro-reflections, commercial edge rim lighting, soft diffused directional studio bounce, deep chiaroscuro contrast, resting on a dark textured slate background with subtle water reflections, award-winning culinary magazine cover, shallow depth of field, creamy smooth bokeh, Octane render 8K UHD`,
      category,
      applied_tags: ['Macro Optics', 'Dew Droplets', 'Hasselblad 100c', 'Chiaroscuro', '8K Octane']
    };
  }

  if (/(girl|woman|man|boy|person|human|face|portrait|model|warrior|samurai|astronaut|cybernetic)/i.test(lower)) {
    category = 'CHARACTER_PORTRAIT';
    return {
      original_prompt: p,
      enhanced_prompt: `Cinematic close-up portrait of ${cleanSubject}, shot on ARRI Alexa Mini LF with Cooke Anamorphic /i Full Frame Plus 85mm T2.3 lens, realistic human skin pores, micro-peach fuzz, subsurface scattering, razor-sharp eye catchlights, strand-level hair definition, Rembrandt lighting, soft warm key light, gentle cyan-teal edge backlight, deep cinematic shadows, atmospheric background with soft volumetric blur, IMAX cinematic aesthetic, Kodak Vision3 500T film grain, DaVinci Resolve color grade, 8K photorealistic`,
      category,
      applied_tags: ['ARRI Alexa LF', 'Cooke Anamorphic', 'Rembrandt Lighting', 'Subsurface Scattering', '8K Film Grain']
    };
  }

  if (/(car|sports car|supercar|motorcycle|bike|vehicle|jet|airplane|boat)/i.test(lower)) {
    category = 'VEHICLE_ACTION';
    return {
      original_prompt: p,
      enhanced_prompt: `Dynamic low-angle high-speed tracking shot of ${cleanSubject}, shot on Phantom Flex4K with Leica Summilux-C 50mm lens, glossy automotive multi-coat clearcoat reflections, carbon fiber weave texture, specular highlights on aerodynamic curves, motion-blurred road surface, dramatic automotive studio rim lighting, crisp headlight illumination beams, dark glossy tarmac reflections, motion-blurred winding coastal highway at twilight, Speedhunters commercial automotive grade, 8K ultra photorealistic, raytraced reflections, cinematic color grade`,
      category,
      applied_tags: ['Phantom Flex4K', 'Automotive Clearcoat', 'Motion Blur', 'Specular Highlights', '8K Commercial']
    };
  }

  if (/(mountain|forest|river|ocean|sea|beach|lake|valley|waterfall|desert|nature|sunset|sunrise)/i.test(lower)) {
    category = 'LANDSCAPE_NATURE';
    return {
      original_prompt: p,
      enhanced_prompt: `Epic sweeping panoramic vista of ${cleanSubject}, shot on RED V-Raptor 8K VV with Canon Cine 24mm T1.5 prime lens, crisp atmospheric mist swirling through terrain, airborne particulate motes, wet rock reflections, sharp foliage detail, golden hour sunlight cresting the horizon, dramatic volumetric god rays breaking through clouds, HDR dynamic range, majestic endless horizon with layered mountain silhouettes, National Geographic award-winning photography, deep focus infinity clarity, hyper-detailed 8K vista`,
      category,
      applied_tags: ['RED V-Raptor 8K', 'Golden Hour', 'God Rays', 'Infinite Depth', 'National Geographic']
    };
  }

  return {
    original_prompt: p,
    enhanced_prompt: `Masterpiece cinematic capture of ${cleanSubject}, shot on 70mm Panavision IMAX camera with prime cinema optics, tactile micro-surface details, crisp physical textures, lifelike depth, natural material properties, three-point studio lighting, soft diffused fill, crisp dramatic rim highlights, clean atmospheric depth with subtle cinematic blur, 8K UHD, Octane 3D hyper-photorealistic render, Hasselblad natural color science, award-winning composition, shallow depth of field`,
    category,
    applied_tags: ['Panavision 70mm', 'Octane Render', 'Three-Point Light', '8K Masterpiece', 'Shallow DOF']
  };
}

export async function fetchProvidersStatusApi() {
  try {
    const res = await fetch(`${API_BASE}/generate/providers-status`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API fetchProvidersStatus fallback:', err.message);
  }
  return { gemini_imagen: false, openai_dalle: false, active_models: ['Seedance v2', 'Flux Realism'] };
}

export async function generateAiImageApi(params) {
  try {
    const res = await fetch(`${API_BASE}/generate/ai-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend generateAiImage failed, falling back:', err.message);
  }
  return null;
}

export async function createGenerationJobApi(jobParams) {
  try {
    const res = await fetch(`${API_BASE}/generate/job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobParams)
    });
    if (!res.ok) throw new Error('Failed to dispatch generation job');
    return await res.json();
  } catch (err) {
    console.warn('API createGenerationJob fallback:', err.message);
    return null;
  }
}

export async function deductCreditsApi(amount, token) {
  try {
    const res = await fetch(`${API_BASE}/user/deduct-credits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ amount })
    });
    if (!res.ok) throw new Error('Failed to deduct credits');
    return await res.json();
  } catch (err) {
    console.warn('API deductCredits fallback:', err.message);
    return null;
  }
}

export async function updateProfileApi(token, patch) {
  const res = await fetch(`${API_BASE}/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(patch)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data && data.error) || 'Could not save profile.');
  return data;
}
