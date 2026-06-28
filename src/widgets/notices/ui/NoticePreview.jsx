import React from "react";

function NoticePreview({ latestNotice, onOpenNotices }) {
  return (
    <section className="notice-preview" aria-label="Latest notice">
      <div className="notice-preview-content">
        <p className="notice-preview-label">Latest Notice</p>
        <p className="notice-preview-text">{latestNotice.message}</p>
        <p className="notice-preview-date">{latestNotice.createdAt}</p>
      </div>
      <button
        type="button"
        className="notice-trigger"
        onClick={onOpenNotices}
        aria-label="Open notices"
        title="Open notices"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 10.5v3l9 2.5V8l-9 2.5zm10.5-1.1v5.2l6.3 2.6c.7.3 1.4-.2 1.4-1V8.2c0-.8-.8-1.3-1.4-1L12.5 9.4zM5.2 14.4l1.4 4.1c.2.6.8 1 1.4 1h1.1v-4.2l-3.9-.9z" />
        </svg>
        <span className="notice-badge" aria-hidden="true">
          N
        </span>
      </button>
    </section>
  );
}

export default NoticePreview;
