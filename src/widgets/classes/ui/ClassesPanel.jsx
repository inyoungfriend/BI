import React from "react";
import ClassCard from "./ClassCard";

function ClassesPanel({
  classes,
  attendanceIntents,
  expandedIntents,
  onToggleIntentPanel,
  onSelectStatus,
  onReasonChange,
  onSubmitIntent,
  onEditIntent,
  onCancelIntent,
}) {
  return (
    <article className="panel panel-classes">
      <div className="panel-header">
        <h2>Today's Classes</h2>
      </div>
      <ul className="class-list">
        {classes.map((item) => {
          const attendance = attendanceIntents[item.id];
          const isIntentOpen = expandedIntents[item.id];
          const showReasonHint =
            attendance.status !== "none" && attendance.reason.trim().length > 0
              ? attendance.reason.trim().length < 10
              : false;
          const intentLabel = attendance.status === "late" ? "late arrival" : "absence";

          return (
            <ClassCard
              key={`${item.subject}-${item.time}`}
              item={item}
              attendance={attendance}
              isIntentOpen={isIntentOpen}
              showReasonHint={showReasonHint}
              intentLabel={intentLabel}
              onToggleIntentPanel={() => onToggleIntentPanel(item.id)}
              onSelectStatus={(status) => onSelectStatus(item.id, status)}
              onReasonChange={(reason) => onReasonChange(item.id, reason)}
              onSubmitIntent={() => onSubmitIntent(item.id)}
              onEditIntent={() => onEditIntent(item.id)}
              onCancelIntent={() => onCancelIntent(item.id)}
            />
          );
        })}
      </ul>
    </article>
  );
}

export default ClassesPanel;
