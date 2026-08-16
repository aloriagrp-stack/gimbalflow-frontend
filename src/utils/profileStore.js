const KEY = 'gf_profile';

const DEFAULTS = {
  name: 'Alex Rivera',
  username: 'arivera_director',
  avatar: null,
  usernameChanges: [],
};

const RESERVED = [
  'admin', 'gimbalflow', 'gimbal', 'director', 'soul', 'soulid', 'support',
  'staff', 'official', 'moderator', 'system', 'guest', 'gimbalflowapp',
  'shriyanshaloria', 'shriyansh', 'loria',
];

const TAKEN_BY_OTHERS = [
  'alex.rivera', 'jordan_lee', 'priya.sharma', 'marcus.director', 'sofia_cuts',
  'david.films', 'aisha.vfx', 'leo.motion', 'nina.edits', 'ray.studio',
];

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS, usernameChanges: [] };
    return { ...DEFAULTS, ...JSON.parse(raw), usernameChanges: JSON.parse(raw).usernameChanges || [] };
  } catch {
    return { ...DEFAULTS, usernameChanges: [] };
  }
}

export function saveProfile(profile) {
  localStorage.setItem(KEY, JSON.stringify(profile));
}

export function checkUsernameAvailable(username) {
  const value = String(username || '').trim().toLowerCase();
  if (!value) return { ok: false, msg: 'Username is required.' };
  if (!/^[a-z0-9_.]{3,20}$/.test(value)) {
    return { ok: false, msg: '3-20 characters. Letters, numbers, dots and underscores only.' };
  }
  if (RESERVED.includes(value)) return { ok: false, msg: 'This username is reserved.' };
  if (TAKEN_BY_OTHERS.includes(value)) return { ok: false, msg: 'This username is already taken.' };
  return { ok: true, msg: 'Username is available.' };
}

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_MS = 14 * DAY_MS;

export function getUsernameLimits(profile) {
  const now = Date.now();
  const dayCount = profile.usernameChanges.filter((t) => now - t < DAY_MS).length;
  const windowCount = profile.usernameChanges.filter((t) => now - t < WINDOW_MS).length;
  return { dayCount, windowCount, canChange: dayCount < 3 && windowCount < 3 };
}
