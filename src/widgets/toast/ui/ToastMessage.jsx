import React from "react";
import CloseIconButton from "../../../shared/ui/atoms/CloseIconButton";

function ToastMessage({ message, isActive, onClose }) {
  return (
    <div
      className={isActive ? "toast-message is-active" : "toast-message"}
      role="status"
      aria-live="polite"
    >
      <span className="toast-text">{message}</span>
      <CloseIconButton className="toast-close-button" onClick={onClose} ariaLabel="Close toast" />
    </div>
  );
}

export default ToastMessage;
