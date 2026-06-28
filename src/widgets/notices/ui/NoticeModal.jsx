import React from "react";
import CloseIconButton from "../../../shared/ui/atoms/CloseIconButton";

function NoticeModal({ notices, onClose }) {
  return (
    <div
      className="notice-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="notice-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Notices and announcements"
      >
        <div className="notice-modal-header">
          <h3>Notices & Announcements</h3>
          <CloseIconButton
            className="notice-close-button"
            onClick={onClose}
            ariaLabel="Close notices modal"
          />
        </div>
        <ul className="notice-list">
          {notices.map((item) => (
            <li key={item.id} className="notice-item">
              <p className="notice-item-text">{item.message}</p>
              <p className="notice-item-date">{item.createdAt}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NoticeModal;
