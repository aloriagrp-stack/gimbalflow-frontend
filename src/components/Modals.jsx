import React from 'react';
import { LogOut, Trash2 } from 'lucide-react';

export function SignOutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card card-skeuo">
        <div className="modal-icon-header warning">
          <LogOut size={24} />
        </div>
        <h3 className="modal-title">Sign out of GimbalFlow?</h3>
        <p className="modal-desc">Are you sure you want to sign out of your current GimbalFlow director session?</p>
        <div className="modal-actions-row">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onConfirm}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card card-skeuo" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-header danger">
          <Trash2 size={24} />
        </div>
        <h3 className="modal-title">Delete GimbalFlow Account?</h3>
        <p className="modal-description">
          This action is permanent and cannot be undone. All your project assets, character profiles, and credit balance will be erased.
        </p>
        <div className="modal-actions-row">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Permanently Delete</button>
        </div>
      </div>
    </div>
  );
}
