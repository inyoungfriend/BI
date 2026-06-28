import React from "react";

function CloseIconButton({ className, onClick, ariaLabel }) {
  return (
    <button type="button" className={className} onClick={onClick} aria-label={ariaLabel}>
      <svg className="close-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 4l8 8" />
        <path d="M12 4l-8 8" />
      </svg>
    </button>
  );
}

export default CloseIconButton;
