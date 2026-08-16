import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AccountLayout({ onOpenSignOut }) {
  return (
    <div className="account-shell-container">
      {/* DYNAMIC DEDICATED CONTENT OUTLET */}
      <main className="account-content-area">
        <Outlet />
      </main>
    </div>
  );
}
