import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Users, Check, X } from 'lucide-react';
import {
  loadProfile,
  saveProfile,
  checkUsernameAvailable,
  getUsernameLimits,
} from '../../utils/profileStore';
import { useAuth } from '../../context/AuthContext';
import { updateProfileApi } from '../../services/apiService';

export default function EditProfilePage({ showToast }) {
  const navigate = useNavigate();
  const { user, token, refreshUser } = useAuth();
  const initial = loadProfile();
  const serverName = user && user.name;
  const serverUsername = user && user.username;
  const serverAvatar = user && user.avatar_url;

  const [name, setName] = useState(serverName || initial.name);
  const [username, setUsername] = useState(serverUsername || initial.username);
  const [avatar, setAvatar] = useState(serverAvatar || initial.avatar);
  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef(null);

  const limits = getUsernameLimits(initial);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
    showToast('Profile photo selected. Save to apply.');
  };

  const handleCheck = () => {
    const res = checkUsernameAvailable(username);
    setAvailability(res);
    setError('');
  };

  const handleSave = async () => {
    if (saving) return;
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    const newUsername = username.trim().toLowerCase();
    const avail = checkUsernameAvailable(newUsername);
    if (!avail.ok) {
      setError(avail.msg);
      return;
    }

    if (newUsername !== initial.username) {
      const limitsNow = getUsernameLimits(initial);
      if (!limitsNow.canChange) {
        setError(
          `Username change limit reached. You can change it ${3 - limitsNow.windowCount} more time(s) in the next 14 days.`
        );
        return;
      }
    }

    const updated = {
      ...initial,
      name: trimmedName,
      username: newUsername,
      avatar,
      usernameChanges:
        newUsername !== initial.username
          ? [...initial.usernameChanges, Date.now()]
          : initial.usernameChanges,
    };

    // Signed-in users: save to the server (unique username enforced there).
    if (user && user.email && token) {
      setSaving(true);
      try {
        const data = await updateProfileApi(token, {
          name: trimmedName,
          username: newUsername,
          avatar_url: avatar || ''
        });
        saveProfile({
          ...updated,
          name: data.profile.name,
          username: data.profile.username,
          avatar: data.profile.avatar_url || null
        });
        if (refreshUser) refreshUser();
        showToast('Profile updated successfully!');
        navigate('/profile');
      } catch (err) {
        setError(err.message || 'Could not save profile.');
      } finally {
        setSaving(false);
      }
      return;
    }

    saveProfile(updated);
    showToast('Profile updated successfully!');
    navigate('/profile');
  };

  return (
    <div className="account-subview-page">
      <div className="edit-photo-section">
        <div className="edit-photo-content">
          <div
            className="profile-scene-avatar edit-avatar-picker"
            role="button"
            aria-label="Upload profile photo"
            onClick={() => avatarInputRef.current?.click()}
          >
            {avatar ? (
              <img className="profile-avatar-img" src={avatar} alt="Profile" />
            ) : (
              <Users size={42} className="profile-avatar-camera" />
            )}
          </div>

          <div className="edit-photo-controls">
            <button className="btn-dark-skeuo btn-sm" onClick={() => avatarInputRef.current?.click()}>
              <Camera size={14} /> {avatar ? 'Change Photo' : 'Upload Photo'}
            </button>
            {avatar && (
              <button className="btn-dark-skeuo btn-sm" onClick={() => setAvatar(null)}>
                Remove Photo
              </button>
            )}
          </div>
        </div>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
      </div>

      <div className="edit-details-section">
        <h3 className="account-card-title">Personal Details</h3>

        <div className="edit-form">
          <label className="edit-form-label">Name</label>
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />

          <label className="edit-form-label">Username</label>
          <div className="edit-username-row">
            <div className="edit-username-pill">
              <span className="edit-username-prefix">@</span>
              <input
                className="form-input edit-username-input"
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setAvailability(null); setError(''); }}
                placeholder="username"
              />
            </div>
            <button className="btn-dark-skeuo btn-sm" onClick={handleCheck}>Check</button>
          </div>

          {availability && (
            <div className={`edit-availability ${availability.ok ? 'ok' : 'taken'}`}>
              {availability.ok ? <Check size={13} /> : <X size={13} />}
              {availability.msg}
            </div>
          )}

          <div className="edit-usage-line">
            {limits.canChange ? (
              <>
                Username changes: <strong>{limits.windowCount}/3</strong> used in last 14 days
                ({limits.dayCount}/3 in last 24h).
              </>
            ) : (
              <>
                Username change limit reached — {3 - limits.windowCount}/3 remaining in this 14-day
                window. You can change it again as new window opens.
              </>
            )}
          </div>

          {error && <div className="edit-error">{error}</div>}

          <div className="edit-actions">
            <button className="btn-dark-skeuo" onClick={() => navigate('/profile')}>Cancel</button>
            <button className="btn-dark-skeuo" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="edit-photo-note">
        <span className="edit-photo-note-title">Photo Guidelines</span>
        <ul className="edit-photo-note-list">
          <li>Square image, 512x512 or larger recommended</li>
          <li>JPG, PNG or WebP — max 5 MB</li>
          <li>Clear face visible for best results</li>
        </ul>
      </div>
    </div>
  );
}
