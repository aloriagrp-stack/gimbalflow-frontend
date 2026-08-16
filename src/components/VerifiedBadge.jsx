import React from 'react';
import LogoIcon from './LogoIcon';

const TIER_STYLES = {
  basic: {
    background: 'radial-gradient(circle at 32% 24%, #a9dcff 0%, #4aa0e8 48%, #115db4 100%)',
    border: 'rgba(255, 255, 255, 0.65)',
    shadow: 'rgba(0, 40, 100, 0.5)',
    drop: 'rgba(0, 30, 80, 0.55)',
  },
  mid: {
    background: 'radial-gradient(circle at 32% 24%, #fff3c4 0%, #f0b429 48%, #b3700a 100%)',
    border: 'rgba(255, 244, 200, 0.75)',
    shadow: 'rgba(110, 60, 0, 0.55)',
    drop: 'rgba(90, 50, 0, 0.6)',
  },
  pro: {
    background: 'radial-gradient(circle at 32% 24%, #d8ffc4 0%, #2ff40b 48%, #1a9c06 100%)',
    border: 'rgba(230, 255, 220, 0.75)',
    shadow: 'rgba(20, 110, 0, 0.55)',
    drop: 'rgba(15, 90, 0, 0.6)',
  },
};

export default function VerifiedBadge({ tier = 'basic', size = 15 }) {
  if (tier === 'free' || tier === 'none') return null;

  const s = TIER_STYLES[tier] || TIER_STYLES.basic;

  return (
    <span
      className="profile-verified-badge"
      style={{
        background: s.background,
        borderColor: s.border,
        boxShadow: `inset 0 1px 2px rgba(255, 255, 255, 0.9), inset 0 -3px 6px ${s.shadow}, 0 2px 5px rgba(0, 0, 0, 0.55)`,
      }}
      title="Verified"
    >
      <LogoIcon size={size} style={{ filter: `drop-shadow(0 1px 1px ${s.drop})` }} />
    </span>
  );
}