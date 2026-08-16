import React from 'react';

export default function ComingSoon({ title, desc }) {
  return (
    <div className="account-subview-page">
      <div className="account-view-header">
        <h1 className="account-view-title">{title}</h1>
        <p className="account-view-desc">{desc || 'This section is coming soon.'}</p>
      </div>
      <div className="coming-soon-card card-skeuo">
        <span className="coming-soon-badge">Coming Soon</span>
      </div>
    </div>
  );
}