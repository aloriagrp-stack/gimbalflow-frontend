import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Share2 } from 'lucide-react';
import VerifiedBadge from '../../components/VerifiedBadge';
import ShareModal from '../../components/ShareModal';
import { loadProfile } from '../../utils/profileStore';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage({ onOpenDeleteAccount, showToast }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile] = useState(loadProfile);
  const [shareOpen, setShareOpen] = useState(false);

  const displayName = (user && user.name) || profile.name;
  const avatar = (user && user.avatar_url) || profile.avatar;
  const email = user ? user.email : '';
  const username = (user && user.username) || (user && user.email
    ? user.email.split('@')[0]
    : profile.username);

  return (
    <div className="account-subview-page">
      {/* PROFILE SCENE — AVATAR + IDENTITY (directly on background) */}
      <div className="profile-scene">
        {/* IDENTITY ROW */}
        <div className="profile-scene-body">
          <div className="profile-scene-avatar">
            {avatar ? (
              <img className="profile-avatar-img" src={avatar} alt="Profile" />
            ) : (
              <Camera size={42} className="profile-avatar-camera" />
            )}
          </div>

          <div className="profile-scene-meta">
            <div className="profile-name-row">
              <h2 className="profile-name-heading">{displayName}</h2>
              <VerifiedBadge tier="pro" />
            </div>
            <p className="profile-username">@{username}</p>
            {email && <p className="profile-email-sub">{email}</p>}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="profile-scene-actions">
          <button className="skeuo-pill-btn profile-edit-btn" onClick={() => navigate('/profile/edit')}>
            <Camera size={14} /> Edit
          </button>
          <button className="skeuo-pill-btn" onClick={() => setShareOpen(true)}>
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} showToast={showToast} />
    </div>
  );
}