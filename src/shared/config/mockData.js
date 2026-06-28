export const ATTENDANCE_STORAGE_KEY = "bi-class-attendance-intent";

export const classes = [
  {
    id: "class-1",
    subject: "General English - Upper Int.",
    time: "9:00 AM - 11:00 AM",
    room: "Room 3B",
    teacher: "Ms. Sarah Lin",
  },
  {
    id: "class-2",
    subject: "PTE Academic - Writing",
    time: "11:30 AM - 1:00 PM",
    room: "Room 5A",
    teacher: "Mr. James Park",
  },
  {
    id: "class-3",
    subject: "Pronunciation Workshop",
    time: "2:00 PM - 3:30 PM",
    room: "Language Lab",
    teacher: "Ms. Amy Torres",
  },
];

export const notices = [
  {
    id: "notice-1",
    message: "Mid-term assessments are scheduled for Week 8. Check your timetable.",
    createdAt: "June 29, 2026",
  },
  {
    id: "notice-2",
    message: "Library will be closed this Friday for maintenance.",
    createdAt: "June 24, 2026",
  },
];

export const attendanceHistory = [
  { label: "This month", value: 82 },
  { label: "Last month", value: 79 },
  { label: "2 months ago", value: 86 },
];

export const todayVocabulary = [
  {
    word: "Resilient",
    meaning: "Able to recover quickly from difficulties and adapt well to change.",
    pronunciation: "/rɪˈzɪl.i.ənt/",
    example:
      "International students are often resilient when adapting to a new learning environment.",
    dictionaryUrl: "https://dictionary.cambridge.org/dictionary/english/resilient",
  },
  {
    word: "Clarify",
    meaning: "To make something easier to understand by explaining it clearly.",
    pronunciation: "/ˈklær.ɪ.faɪ/",
    example: "Please clarify your question before the writing workshop starts.",
    dictionaryUrl: "https://dictionary.cambridge.org/dictionary/english/clarify",
  },
  {
    word: "Consistent",
    meaning: "Always behaving or happening in a similar and reliable way.",
    pronunciation: "/kənˈsɪs.tənt/",
    example: "Consistent attendance usually leads to stronger speaking confidence.",
    dictionaryUrl: "https://dictionary.cambridge.org/dictionary/english/consistent",
  },
];

export const createInitialAttendanceState = () =>
  classes.reduce((acc, item) => {
    acc[item.id] = { status: "none", reason: "", submitted: false };
    return acc;
  }, {});

export const createInitialExpandedIntents = () =>
  classes.reduce((acc, item) => {
    acc[item.id] = false;
    return acc;
  }, {});
