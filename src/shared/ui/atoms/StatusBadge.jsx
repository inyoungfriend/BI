import React from "react";

function StatusBadge({ status }) {
  if (status !== "absent" && status !== "late") {
    return null;
  }

  return (
    <span className={status === "late" ? "class-status-badge is-late" : "class-status-badge is-absent"}>
      {status === "late" ? "Late" : "Absent"}
    </span>
  );
}

export default StatusBadge;
