import React, { useEffect, useRef, useState } from "react";
import {
  ATTENDANCE_STORAGE_KEY,
  attendanceHistory,
  classes,
  createInitialAttendanceState,
  createInitialExpandedIntents,
  notices,
  todayVocabulary,
} from "../../../shared/config/mockData";
import ClassesPanel from "../../../widgets/classes/ui/ClassesPanel";
import NoticeModal from "../../../widgets/notices/ui/NoticeModal";
import NoticePreview from "../../../widgets/notices/ui/NoticePreview";
import AttendancePanel from "../../../widgets/attendance/ui/AttendancePanel";
import VocabularyPanel from "../../../widgets/vocabulary/ui/VocabularyPanel";
import ToastMessage from "../../../widgets/toast/ui/ToastMessage";

function DashboardPage() {
  const [attendanceIntents, setAttendanceIntents] = useState(createInitialAttendanceState);
  const [expandedIntents, setExpandedIntents] = useState(createInitialExpandedIntents);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastMounted, setIsToastMounted] = useState(false);
  const [isToastActive, setIsToastActive] = useState(false);
  const toastActivateTimerRef = useRef(null);
  const toastHideTimerRef = useRef(null);
  const toastUnmountTimerRef = useRef(null);

  useEffect(() => {
    const savedAttendance = localStorage.getItem(ATTENDANCE_STORAGE_KEY);

    if (savedAttendance) {
      try {
        const parsedAttendance = JSON.parse(savedAttendance);
        const nextState = createInitialAttendanceState();

        classes.forEach((item) => {
          const current = parsedAttendance[item.id];
          if (current && typeof current.reason === "string") {
            let nextStatus = "none";
            if (current.status === "absent" || current.status === "late") {
              nextStatus = current.status;
            } else if (current.status === "attending") {
              nextStatus = "none";
            } else if (typeof current.isAbsent === "boolean") {
              nextStatus = current.isAbsent ? "absent" : "none";
            }
            const nextSubmitted =
              typeof current.submitted === "boolean" ? current.submitted : false;

            nextState[item.id] = {
              status: nextStatus,
              reason: current.reason,
              submitted: nextSubmitted,
            };
          }
        });

        setAttendanceIntents(nextState);
      } catch {
        localStorage.removeItem(ATTENDANCE_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendanceIntents));
  }, [attendanceIntents]);

  useEffect(() => {
    return () => {
      if (toastHideTimerRef.current) {
        clearTimeout(toastHideTimerRef.current);
      }
      if (toastUnmountTimerRef.current) {
        clearTimeout(toastUnmountTimerRef.current);
      }
      if (toastActivateTimerRef.current) {
        clearTimeout(toastActivateTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isNoticeOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsNoticeOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isNoticeOpen]);

  const currentMonthAttendance = attendanceHistory[0].value;

  const handleToastClose = () => {
    setIsToastActive(false);

    if (toastHideTimerRef.current) {
      clearTimeout(toastHideTimerRef.current);
    }
    if (toastUnmountTimerRef.current) {
      clearTimeout(toastUnmountTimerRef.current);
    }
    if (toastActivateTimerRef.current) {
      clearTimeout(toastActivateTimerRef.current);
    }

    toastUnmountTimerRef.current = setTimeout(() => {
      setIsToastMounted(false);
    }, 260);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastMounted(true);

    if (toastHideTimerRef.current) {
      clearTimeout(toastHideTimerRef.current);
    }
    if (toastUnmountTimerRef.current) {
      clearTimeout(toastUnmountTimerRef.current);
    }
    if (toastActivateTimerRef.current) {
      clearTimeout(toastActivateTimerRef.current);
    }

    toastActivateTimerRef.current = setTimeout(() => {
      setIsToastActive(true);
    }, 10);

    toastHideTimerRef.current = setTimeout(() => {
      handleToastClose();
    }, 2200);
  };

  const handleStatusSelect = (classId, status) => {
    setAttendanceIntents((prev) => {
      const current = prev[classId];
      return {
        ...prev,
        [classId]: {
          status,
          reason: current.status === status ? current.reason : "",
          submitted: false,
        },
      };
    });
  };

  const handleReasonChange = (classId, reason) => {
    setAttendanceIntents((prev) => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        reason,
        submitted: false,
      },
    }));
  };

  const handleIntentSubmit = (classId) => {
    const current = attendanceIntents[classId];
    const trimmedReason = current.reason.trim();

    if (trimmedReason.length < 10) {
      showToast("Please enter at least 10 characters.");
      return;
    }

    setAttendanceIntents((prev) => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        reason: trimmedReason,
        submitted: true,
      },
    }));

    const targetClass = classes.find((item) => item.id === classId);
    const statusLabel = current.status === "late" ? "Late" : "Absence";
    showToast(`${statusLabel} reason submitted for ${targetClass?.subject ?? "this class"}.`);
  };

  const handleIntentEdit = (classId) => {
    setAttendanceIntents((prev) => ({
      ...prev,
      [classId]: {
        ...prev[classId],
        submitted: false,
      },
    }));
  };

  const handleIntentCancel = (classId) => {
    const current = attendanceIntents[classId];
    const statusLabel = current.status === "late" ? "Late" : "Absence";

    setAttendanceIntents((prev) => ({
      ...prev,
      [classId]: {
        status: "none",
        reason: "",
        submitted: false,
      },
    }));

    const targetClass = classes.find((item) => item.id === classId);
    showToast(`${statusLabel} canceled for "${targetClass?.subject ?? "this class"}".`);
  };

  const handleIntentPanelToggle = (classId) => {
    setExpandedIntents((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  return (
    <>
      <NoticePreview latestNotice={notices[0]} onOpenNotices={() => setIsNoticeOpen(true)} />

      <section className="dashboard-grid" aria-label="Dashboard Summary">
        <ClassesPanel
          classes={classes}
          attendanceIntents={attendanceIntents}
          expandedIntents={expandedIntents}
          onToggleIntentPanel={handleIntentPanelToggle}
          onSelectStatus={handleStatusSelect}
          onReasonChange={handleReasonChange}
          onSubmitIntent={handleIntentSubmit}
          onEditIntent={handleIntentEdit}
          onCancelIntent={handleIntentCancel}
        />
        <AttendancePanel
          currentMonthAttendance={currentMonthAttendance}
          attendanceHistory={attendanceHistory}
        />
        <VocabularyPanel words={todayVocabulary} />
      </section>

      {isNoticeOpen && <NoticeModal notices={notices} onClose={() => setIsNoticeOpen(false)} />}

      {isToastMounted && (
        <ToastMessage message={toastMessage} isActive={isToastActive} onClose={handleToastClose} />
      )}
    </>
  );
}

export default DashboardPage;
