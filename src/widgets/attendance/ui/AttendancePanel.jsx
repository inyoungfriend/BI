import React from "react";
import { Link } from "react-router-dom";

function AttendancePanel({ currentMonthAttendance, attendanceHistory }) {
  return (
    <article className="panel panel-attendance">
      <div className="panel-header">
        <h2>Attendance Snapshot</h2>
        <Link
          to="/attendance"
          className="attendance-link-arrow"
          aria-label="Go to attendance page"
          title="Go to attendance page"
        >
          <svg className="attendance-arrow-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h9" />
            <path d="M8.5 4.5L12 8l-3.5 3.5" />
          </svg>
        </Link>
      </div>
      <p className="attendance-value">{currentMonthAttendance}%</p>
      <p className="support-text">This month</p>
      <div className="attendance-bar" aria-hidden="true">
        <div className="attendance-bar-fill" style={{ width: `${currentMonthAttendance}%` }} />
      </div>
      <ul className="attendance-history-list" aria-label="Attendance trend history">
        {attendanceHistory.slice(1).map((item) => (
          <li key={item.label} className="attendance-history-item">
            <div className="attendance-history-meta">
              <span>{item.label}</span>
              <strong>{item.value}%</strong>
            </div>
            <div className="attendance-history-track" aria-hidden="true">
              <div className="attendance-history-fill" style={{ width: `${item.value}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default AttendancePanel;
