import React from "react";
import StatusBadge from "../../../shared/ui/atoms/StatusBadge";

function ClassCard({
  item,
  attendance,
  isIntentOpen,
  showReasonHint,
  intentLabel,
  onToggleIntentPanel,
  onSelectStatus,
  onReasonChange,
  onSubmitIntent,
  onEditIntent,
  onCancelIntent,
}) {
  const isLate = attendance.status === "late";

  return (
    <li className="class-card">
      <div className="class-card-top">
        <h3>{item.subject}</h3>
        {attendance.status !== "none" && attendance.submitted && <StatusBadge status={attendance.status} />}
        <button
          type="button"
          className={isIntentOpen ? "intent-panel-toggle is-open" : "intent-panel-toggle"}
          onClick={onToggleIntentPanel}
          aria-expanded={isIntentOpen}
          aria-controls={`${item.id}-attendance-intent`}
          aria-label="Toggle attendance intent section"
        >
          <span className="intent-panel-toggle-arrow">▾</span>
        </button>
      </div>
      <p>
        <span>Time:</span> {item.time}
      </p>
      <p>
        <span>Room:</span> {item.room}
      </p>
      <p>
        <span>Teacher:</span> {item.teacher}
      </p>

      <div
        id={`${item.id}-attendance-intent`}
        className={isIntentOpen ? "intent-panel is-open" : "intent-panel"}
      >
        <div className="intent-panel-inner">
          <div className="attendance-intent">
            <p className="attendance-intent-label">Attendance Intent</p>
            {!attendance.submitted && (
              <div className="intent-choice-buttons">
                <button
                  type="button"
                  className={
                    attendance.status === "absent"
                      ? "intent-button is-selected is-absent-outline"
                      : "intent-button"
                  }
                  onClick={() => onSelectStatus("absent")}
                >
                  Absent
                </button>
                <button
                  type="button"
                  className={
                    attendance.status === "late"
                      ? "intent-button is-selected is-late-outline"
                      : "intent-button"
                  }
                  onClick={() => onSelectStatus("late")}
                >
                  Late
                </button>
              </div>
            )}

            <div
              className={
                attendance.status !== "none" ? "absence-collapse is-open" : "absence-collapse"
              }
            >
              <div className="absence-collapse-inner">
                {!attendance.submitted ? (
                  <div className="absence-reason-wrap">
                    <label htmlFor={`${item.id}-reason`} className="attendance-intent-label">
                      Reason for {intentLabel}
                    </label>
                    <textarea
                      id={`${item.id}-reason`}
                      value={attendance.reason}
                      onChange={(event) => onReasonChange(event.target.value)}
                      rows={2}
                      className="absence-reason-input"
                      placeholder={
                        isLate
                          ? "e.g. Transport delay, medical appointment"
                          : "e.g. Medical appointment, transport issue"
                      }
                    />
                    {showReasonHint && (
                      <p className="input-hint">
                        Please write at least 10 characters for a clear reason.
                      </p>
                    )}
                    <button type="button" className="submit-absence-button" onClick={onSubmitIntent}>
                      {isLate ? "Submit Late Reason" : "Submit Absence Reason"}
                    </button>
                  </div>
                ) : (
                  <div className="submitted-reason-wrap">
                    <p className="attendance-intent-label">Submitted {intentLabel} reason</p>
                    <p className="submitted-reason-text">{attendance.reason}</p>
                    <div className="submitted-reason-actions">
                      <button type="button" className="edit-absence-button" onClick={onEditIntent}>
                        Edit Reason
                      </button>
                      <button
                        type="button"
                        className={
                          attendance.status === "late"
                            ? "intent-button is-active is-late"
                            : "intent-button is-active is-absent"
                        }
                        onClick={onCancelIntent}
                      >
                        {attendance.status === "late" ? "Cancel Late" : "Cancel Absent"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default ClassCard;
