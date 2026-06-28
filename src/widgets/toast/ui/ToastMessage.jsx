import React from "react";

function ToastMessage({ message, isActive, onClose }) {
  return (
    <div className={isActive ? "toast-message is-active" : "toast-message"} role="status" aria-live="polite">
      <span className="toast-text">{message}</span>
      <button type="button" className="toast-close-button" onClick={onClose} aria-label="Close toast">
        ×
      </button>
    </div>
  );
}

export default ToastMessage;
