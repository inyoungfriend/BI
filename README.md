# Boston Institute Student Portal Dashboard (React)

This repository contains a responsive one-page Student Portal dashboard built for the Boston Institute Frontend Intern Weekend Task. The UI follows the requested brand colors (`#1A2F55` navy and `#B8922A` gold), uses realistic mock data, and is optimized for both desktop and mobile screens.

## Core Features

- Greeting header with student name and Sydney-based date
- "Today's Classes" cards (subject, time, room, teacher)
- Notices preview + full notices modal
- Attendance Snapshot with monthly trend bars
- Attendance detail page with monthly calendar (Apr-Jun 2026), completion labels (`3/3`, `2/3`, `0/3`), and month navigation
- Responsive navigation (desktop sidebar + mobile hamburger menu)
- Toast feedback for attendance actions

## Innovative Feature (Task 2)

The innovative feature combines **Today's English Words** with a practical **Attendance Reason Capture** flow.

### A) Today's English Words

Each word card includes:

- Clickable dictionary link (opens in a new tab)
- Pronunciation
- Meaning
- Example sentence

### B) Absence/Late Reason Input

Each class card supports pre-attendance intent with reason management:

- Students can mark absence or late status before class
- Students can submit a reason, then edit or cancel it later
- Inputs are persisted with `localStorage`
- Toast feedback confirms each status/reason action

I selected this combined approach because the portal serves both learning and daily academic operations. Vocabulary cards support continuous English improvement, while absence/late reason input improves communication clarity between students and staff. Together, these features add meaningful value without increasing interface complexity.

## Extra UX Enhancement

Beyond the required sections, the dashboard includes a pre-attendance intent flow per class:

- Students can set attendance intent
- Students can submit/edit/cancel absence or late reasons
- Inputs are persisted with `localStorage`
- Status changes are confirmed with toast notifications

## Tech Stack

- React 18
- Vite 5
- React Router DOM
- Custom CSS (no Tailwind, no styled-components)

## Run Locally

1. Clone this repository.
2. Move to the project folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open the local URL printed in the terminal.

## Design Decisions (Reflection)

For learners who may not be fully fluent in English, I intentionally prioritized visual clarity over text-heavy guidance. Information is grouped into predictable card sections with short labels and strong heading contrast, so users can scan by structure first and read details second. Important values, such as attendance rate and class timing, are visually emphasized with size, spacing, and color hierarchy. I also kept interaction patterns simple and consistent: the same arrow style, the same button tone, and clear toast feedback for state-changing actions.

If I had one full week instead of a weekend, I would focus on stronger localization support (for example, multilingual helper text and language switching for key labels) and more realistic backend-driven attendance data.

The current limitation is that all academic data is mock-based. The UI and interaction logic are complete, but in production the dashboard should be connected to real student records, class APIs, and role-based personalization so that calendar completion and notices reflect true live data. At that stage, I would also design dedicated loading screens/skeleton states for each major panel so users always understand that live data is being fetched.

## Deploy to Vercel

### Option A: Connect GitHub Repository (Recommended)

1. Push this project to a public GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **Add New... -> Project**.
3. Import the repository.
4. Confirm build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

### Option B: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```

### Routing Note

This project uses `react-router-dom` with browser history.  
`vercel.json` is included so direct access or refresh on routes like `/attendance` works correctly instead of returning 404.

## Deployment URL

- Live URL: bostoninstitute.vercel.app
