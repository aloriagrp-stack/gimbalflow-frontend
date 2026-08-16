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
    if (!res.ok) throw new Error('Failed to enhance prompt');
    return await res.json();
  } catch (err) {
    console.warn('API enhancePrompt fallback:', err.message);
    return null;
  }
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
