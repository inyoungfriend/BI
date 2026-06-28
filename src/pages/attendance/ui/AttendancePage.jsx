import React, { useMemo, useState } from "react";
import { attendanceHistory } from "../../../shared/config/mockData";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MIN_VIEW_MONTH = new Date(2026, 3, 1);
const MAX_VIEW_MONTH = new Date(2026, 5, 1);
const MONTH_TARGETS = {
  "2026-04": 86,
  "2026-05": 79,
  "2026-06": 82,
};
const DAILY_CLASS_COUNT = 3;
const MONTH_COMPLETION_OVERRIDES = {
  "2026-06": {
    "2026-06-18": 0,
    "2026-06-29": 0,
    "2026-06-30": 0,
  },
};

const getMonthStart = (sourceDate) => new Date(sourceDate.getFullYear(), sourceDate.getMonth(), 1);

const shiftMonth = (sourceDate, offset) =>
  new Date(sourceDate.getFullYear(), sourceDate.getMonth() + offset, 1);

const clampMonth = (targetMonth) => {
  if (targetMonth < MIN_VIEW_MONTH) {
    return MIN_VIEW_MONTH;
  }
  if (targetMonth > MAX_VIEW_MONTH) {
    return MAX_VIEW_MONTH;
  }
  return targetMonth;
};

const getMonthKey = (targetDate) =>
  `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}`;

const getDateKey = (targetDate) =>
  `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;

const getSydneyTodayKey = () => {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const partMap = parts.reduce((acc, item) => {
    if (item.type !== "literal") {
      acc[item.type] = item.value;
    }
    return acc;
  }, {});
  return `${partMap.year}-${partMap.month}-${partMap.day}`;
};

const getWeekdayDatesInMonth = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const current = new Date(year, month, day);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days.push(current);
    }
  }

  return days;
};

const buildMonthCompletionMap = (monthDate, targetPercent, monthOverrides = {}) => {
  const weekdays = getWeekdayDatesInMonth(monthDate);
  const totalSessions = weekdays.length * DAILY_CLASS_COUNT;
  const targetCompleted = Math.round((targetPercent / 100) * totalSessions);
  const deficit = Math.max(0, totalSessions - targetCompleted);
  const completions = new Array(weekdays.length).fill(DAILY_CLASS_COUNT);

  if (weekdays.length > 0 && deficit > 0) {
    for (let index = 0; index < deficit; index += 1) {
      const spreadIndex = Math.floor((index * weekdays.length) / deficit);
      completions[spreadIndex] -= 1;
    }
  }

  const weekdayKeyIndexMap = weekdays.reduce((acc, currentDate, index) => {
    acc[getDateKey(currentDate)] = index;
    return acc;
  }, {});

  Object.entries(monthOverrides).forEach(([dateKey, fixedValue]) => {
    const targetIndex = weekdayKeyIndexMap[dateKey];
    if (typeof targetIndex === "number") {
      completions[targetIndex] = Math.max(0, Math.min(DAILY_CLASS_COUNT, fixedValue));
    }
  });

  let currentCompleted = completions.reduce((acc, value) => acc + value, 0);
  const lockedIndices = new Set(
    Object.keys(monthOverrides)
      .map((dateKey) => weekdayKeyIndexMap[dateKey])
      .filter((index) => typeof index === "number")
  );

  if (currentCompleted < targetCompleted) {
    for (
      let index = 0;
      index < completions.length && currentCompleted < targetCompleted;
      index += 1
    ) {
      if (lockedIndices.has(index)) {
        continue;
      }
      if (completions[index] < DAILY_CLASS_COUNT) {
        completions[index] += 1;
        currentCompleted += 1;
      }
      if (index === completions.length - 1 && currentCompleted < targetCompleted) {
        index = -1;
      }
    }
  } else if (currentCompleted > targetCompleted) {
    for (
      let index = 0;
      index < completions.length && currentCompleted > targetCompleted;
      index += 1
    ) {
      if (lockedIndices.has(index)) {
        continue;
      }
      if (completions[index] > 0) {
        completions[index] -= 1;
        currentCompleted -= 1;
      }
      if (index === completions.length - 1 && currentCompleted > targetCompleted) {
        index = -1;
      }
    }
  }

  return weekdays.reduce((acc, currentDate, index) => {
    acc[currentDate.toISOString().slice(0, 10)] = completions[index];
    return acc;
  }, {});
};

const buildCalendarCells = (monthDate, monthCompletions, todayKey) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const totalCells = 42;
  const cells = [];

  for (let index = 0; index < totalCells; index += 1) {
    const dayOffset = index - firstWeekday;
    const cellDate = new Date(year, month, dayOffset + 1);
    const isCurrentMonth = dayOffset >= 0 && dayOffset < daysInMonth;
    const dateKey = getDateKey(cellDate);
    const isFuture = isCurrentMonth && dateKey > todayKey;
    const completedClasses = isCurrentMonth ? (monthCompletions[dateKey] ?? null) : null;

    cells.push({
      key: dateKey,
      date: cellDate,
      dayNumber:
        dayOffset < 0
          ? daysInPrevMonth + dayOffset + 1
          : dayOffset >= daysInMonth
            ? dayOffset - daysInMonth + 1
            : dayOffset + 1,
      isCurrentMonth,
      completedClasses,
      isFuture,
    });
  }

  return cells;
};

function AttendancePage() {
  const [viewMonth, setViewMonth] = useState(() => clampMonth(getMonthStart(new Date())));
  const todayKey = useMemo(() => getSydneyTodayKey(), []);
  const completionByMonth = useMemo(
    () =>
      Object.entries(MONTH_TARGETS).reduce((acc, [monthKey, targetPercent]) => {
        const [year, month] = monthKey.split("-").map(Number);
        acc[monthKey] = buildMonthCompletionMap(
          new Date(year, month - 1, 1),
          targetPercent,
          MONTH_COMPLETION_OVERRIDES[monthKey]
        );
        return acc;
      }, {}),
    []
  );
  const activeMonthKey = getMonthKey(viewMonth);
  const activeMonthCompletions = completionByMonth[activeMonthKey] ?? {};
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-AU", {
        month: "long",
        year: "numeric",
        timeZone: "Australia/Sydney",
      }).format(viewMonth),
    [viewMonth]
  );
  const calendarCells = useMemo(
    () => buildCalendarCells(viewMonth, activeMonthCompletions, todayKey),
    [viewMonth, activeMonthCompletions, todayKey]
  );
  const isPrevDisabled = viewMonth.getTime() <= MIN_VIEW_MONTH.getTime();
  const isNextDisabled = viewMonth.getTime() >= MAX_VIEW_MONTH.getTime();

  return (
    <section className="attendance-page">
      <header className="attendance-page-header">
        <div>
          <p className="support-text">Attendance Overview</p>
          <h1>Attendance Details</h1>
        </div>
      </header>

      <article className="panel">
        <div className="attendance-calendar-header">
          <h2>{monthLabel} Attendance</h2>
          <div className="calendar-month-controls">
            <button
              type="button"
              className="attendance-link-arrow"
              aria-label="View previous month"
              onClick={() => setViewMonth((prev) => clampMonth(shiftMonth(prev, -1)))}
              disabled={isPrevDisabled}
            >
              <svg className="attendance-arrow-icon is-left" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h9" />
                <path d="M8.5 4.5L12 8l-3.5 3.5" />
              </svg>
            </button>
            <button
              type="button"
              className="attendance-link-arrow"
              aria-label="View next month"
              onClick={() => setViewMonth((prev) => clampMonth(shiftMonth(prev, 1)))}
              disabled={isNextDisabled}
            >
              <svg className="attendance-arrow-icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h9" />
                <path d="M8.5 4.5L12 8l-3.5 3.5" />
              </svg>
            </button>
          </div>
        </div>

        <div className="attendance-calendar-weekdays" aria-hidden="true">
          {WEEKDAY_LABELS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <ul className="attendance-calendar-grid" aria-label={`${monthLabel} attendance calendar`}>
          {calendarCells.map((cell) => (
            <li
              key={cell.key}
              className={`attendance-calendar-cell${cell.isCurrentMonth ? "" : " is-muted"}${
                cell.isFuture
                  ? " is-future"
                  : cell.completedClasses === 3
                    ? " is-complete"
                    : cell.completedClasses === 0
                      ? " is-missed"
                      : cell.completedClasses === 2
                        ? " is-partial"
                        : ""
              }`}
            >
              <span className="calendar-day-number">{cell.dayNumber}</span>
              {cell.isCurrentMonth && cell.isFuture && (
                <span className="calendar-day-progress is-future" title="Upcoming">
                  UP
                </span>
              )}
              {cell.isCurrentMonth && !cell.isFuture && cell.completedClasses !== null && (
                <span className="calendar-day-progress">{`${cell.completedClasses}/${DAILY_CLASS_COUNT}`}</span>
              )}
            </li>
          ))}
        </ul>

        <div className="attendance-calendar-legend" aria-label="Attendance status legend">
          <span>
            <i className="calendar-status-chip is-complete" />
            Completed
          </span>
          <span>
            <i className="calendar-status-chip is-partial" />
            Partially Completed
          </span>
          <span>
            <i className="calendar-status-chip is-missed" />
            Missed
          </span>
          <span>
            <i className="calendar-status-chip is-future" />
            Upcoming
          </span>
        </div>

        <ul className="attendance-history-list" aria-label="Full attendance history">
          {attendanceHistory.map((item) => (
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
    </section>
  );
}

export default AttendancePage;
