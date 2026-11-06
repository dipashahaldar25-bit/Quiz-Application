# Product Requirements Document (PRD)
## Online Quiz Application (React + JSON, Frontend-Only)

**Version:** 1.0
**Date:** September 11, 2026
**Prepared for:** Quiz App Project
**Document Owner:** [Your Name]

---

## 1. Overview

### 1.1 Purpose
This document defines the complete product and technical requirements for a **single-topic Online Quiz Application**. The app is a **frontend-only React project** — there is no backend server or database. All quiz questions and answers are stored in a local **JSON file**, and user results/leaderboard data are persisted using **browser localStorage**.

### 1.2 Goals
- Deliver a clean, professional, human-designed (not template-looking) quiz-taking experience.
- Allow a user to land on a Home page, read an inviting landing/intro section, start a quiz, answer timed questions, navigate between questions, submit, and view a detailed score summary with answer review.
- Maintain a local leaderboard of past attempts (no backend required).
- Be fully responsive (mobile, tablet, desktop) and accessible.

### 1.3 Non-Goals (Out of Scope for v1)
- No user authentication / login system.
- No backend API or database (MongoDB/MySQL/Firebase, etc.).
- No multi-category or multi-difficulty topic selection (single fixed quiz topic only, per project scope).
- No admin panel to add/edit questions through a UI (questions are edited directly in the JSON file by the developer).

---

## 2. Target Users
- End users who want to test their knowledge on a specific topic (e.g., "JavaScript Basics," "General Knowledge," etc. — the topic itself is data-driven from the JSON file, so it can be swapped later).
- Recruiters/portfolio reviewers evaluating this as a frontend developer's project (so UI polish and code quality matter as much as functionality).

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React (Vite recommended for fast dev/build over Create React App) |
| Styling | Tailwind CSS |
| Routing | React Router DOM (v6+) |
| State Management | React Context API + `useReducer` (for quiz state); local component state for UI-only concerns |
| Data Source | Static local JSON file (`questions.json`) imported directly into the app |
| Persistence | Browser `localStorage` (for leaderboard history and optionally "resume quiz" state) |
| Icons | `lucide-react` or `react-icons` |
| Animations | Tailwind transitions + `framer-motion` (optional, for polish) |
| Deployment | Vercel / Netlify / GitHub Pages (static hosting — no server needed) |
| Linting/Formatting | ESLint + Prettier |

> **Note:** Because there is no backend, "full stack" here effectively means a complete, production-quality **frontend application with a self-contained data layer** (JSON as the "database"). This should be clearly noted in your portfolio/README so expectations are accurate.

---

## 4. Information Architecture / Site Map

```
/                → Home Page (Landing/Intro)
/quiz            → Quiz Page (active quiz-taking screen)
/result          → Result Page (score summary + review)
/leaderboard     → Leaderboard Page (local top scores)
*                → 404 / Not Found Page
```

### User Flow
```
Home Page
  └─▶ [Start Quiz Button]
        └─▶ Quiz Page (Q1 → Q2 → ... → Qn, timer running)
              ├─▶ [Auto-submit on timeout] ──▶ Result Page
              └─▶ [Manual Submit] ──▶ Result Page
                                        ├─▶ [Review Answers] (inline on Result Page)
                                        ├─▶ [View Leaderboard]
                                        └─▶ [Retake Quiz] ──▶ back to Quiz Page
```

---

## 5. Page-by-Page Requirements

### 5.1 Home Page (`/`)
**Purpose:** First impression — professional landing page that introduces the quiz and invites the user to start.

**Must include:**
- Hero section: App name/logo, short tagline (e.g., "Test your knowledge in 60 seconds"), and a prominent **"Start Quiz"** CTA button.
- Quiz meta-info card: number of questions, time limit, topic name, difficulty (static, pulled from JSON metadata).
- A short "How it works" section (3 simple steps: Start → Answer → See Score), ideally with icons.
- Optional: a "Top Scores" preview (top 3 from leaderboard) with a "View Full Leaderboard" link.
- Footer with credits/GitHub link.
- Smooth entrance animations (fade/slide-in) to feel human-crafted rather than a bare template.

**Acceptance Criteria:**
- Clicking "Start Quiz" navigates to `/quiz` and initializes a fresh quiz session (timer reset, question index reset).
- Page is fully responsive down to 320px width.

---

### 5.2 Quiz Page (`/quiz`)
**Purpose:** Core quiz-taking experience.

**Must include:**
- **Progress bar** showing current question number / total (e.g., "Question 4 of 10") with a visual bar.
- **Timer**:
  - Configurable as either **per-question timer** or **whole-quiz timer** (decide one; recommended default: per-question timer, e.g., 30 seconds each, since it's more engaging and simpler to reason about — configurable via JSON metadata).
  - Visually distinct countdown (numeric + circular or linear progress indicator), turns red/pulses in the last 5 seconds.
  - **Auto-submit behavior:** if time runs out on a question, auto-mark it as "unanswered/skipped" and move to the next question; if the whole-quiz timer expires, auto-submit the entire quiz and redirect to `/result`.
- **Question card**: question text, 4 options (radio-button style, single-select), clear hover/selected states.
- **Navigation controls**:
  - "Previous" button (to revisit and change earlier answers).
  - "Next" button (disabled until an option is selected, OR allow skipping — decide via config; recommended: allow skipping so timer pressure feels real).
  - "Submit Quiz" button appears on the last question (with a confirmation modal: "You have X unanswered questions, submit anyway?").
- **Question navigator (optional but recommended)**: a small grid/dots showing all question numbers, color-coded (answered / current / unanswered), clickable to jump directly to a question.
- Selecting an option should visually highlight it immediately and store the answer in state (Context/reducer), so navigating back and forth preserves selections.

**Acceptance Criteria:**
- User can move forward/backward without losing previously selected answers.
- Timer accurately counts down and triggers auto-submit/auto-skip exactly at 0.
- Refreshing the page mid-quiz should NOT silently lose all progress in a confusing way — either (a) warn the user before leaving/refreshing (`beforeunload` event), or (b) persist in-progress state to `sessionStorage` so a refresh can restore it. Decide and document which approach is implemented.

---

### 5.3 Result Page (`/result`)
**Purpose:** Show outcome and allow reflection/review.

**Must include:**
- Large, celebratory or encouraging score summary: "You scored 7/10 (70%)" with a relevant visual (circular progress ring, badge/emoji based on performance tier).
- Breakdown stats: Correct answers, Wrong answers, Skipped/unanswered, Time taken.
- **Answer Review section**: list of all questions showing:
  - The question text
  - The option the user selected (highlighted red if wrong, green if correct)
  - The correct answer (highlighted green if the user got it wrong)
  - Optional short explanation text per question (supported by JSON schema, see Section 7).
- Action buttons: "Retake Quiz", "Back to Home", "View Leaderboard", and a way to save the result to the leaderboard (prompt for a display name if not already captured).
- Share/download score as an optional nice-to-have (e.g., "Copy result to clipboard").

**Acceptance Criteria:**
- Result data must be accurate and derived only from the answers recorded during the session (no recalculation bugs).
- Directly navigating to `/result` without completing a quiz should redirect back to `/` (guard against invalid state).

---

### 5.4 Leaderboard Page (`/leaderboard`)
**Purpose:** Local, self-contained record of past attempts to add replay value.

**Must include:**
- Table/list of past attempts: Rank, Name, Score, Percentage, Date/Time taken, Time spent.
- Sorted by highest score (then fastest time as tiebreaker).
- Stored and read from `localStorage` (e.g., key: `quizapp_leaderboard`), capped at a reasonable number of entries (e.g., top 20).
- Empty state message when no attempts exist yet ("No attempts yet — be the first!").
- Option to clear leaderboard history (with confirmation).

**Acceptance Criteria:**
- Leaderboard persists across browser sessions (until localStorage is cleared by the user/browser).
- New entries are inserted in the correct sorted position.

---

### 5.5 404 / Not Found Page
- Friendly "Page not found" message with a button to return Home.

---

## 6. Functional Requirements Summary

| ID | Requirement |
|---|---|
| FR-1 | App loads quiz questions from a local `questions.json` file at build/runtime (imported, not fetched from a server). |
| FR-2 | User can start a quiz from the Home page. |
| FR-3 | Each question has exactly one correct answer among 4 options (MCQ format). |
| FR-4 | A timer runs during the quiz (per-question or per-quiz — see 5.2) and auto-submits/auto-skips on expiry. |
| FR-5 | User can navigate Next/Previous between questions without losing selected answers. |
| FR-6 | User can jump to any question via a question navigator. |
| FR-7 | On submit, the app calculates score (correct/wrong/skipped) and navigates to the Result page. |
| FR-8 | Result page shows full answer review with correct vs. selected answers highlighted. |
| FR-9 | User can save their result (with a name) to a locally-persisted leaderboard. |
| FR-10 | Leaderboard displays past attempts sorted by score, persisted via localStorage. |
| FR-11 | User can retake the quiz, resetting all state. |
| FR-12 | Direct/unauthorized access to `/result` without an active session redirects to Home. |

---

## 7. Data Structure (`questions.json`)

Since there is no database, the JSON file **is** the data layer. Recommended schema:

```json
{
  "quizMeta": {
    "title": "JavaScript Fundamentals Quiz",
    "description": "Test your core JavaScript knowledge.",
    "totalQuestions": 10,
    "timePerQuestion": 30,
    "passingPercentage": 60
  },
  "questions": [
    {
      "id": 1,
      "question": "What is the output of typeof null in JavaScript?",
      "options": [
        { "id": "a", "text": "'object'" },
        { "id": "b", "text": "'null'" },
        { "id": "c", "text": "'undefined'" },
        { "id": "d", "text": "'number'" }
      ],
      "correctOptionId": "a",
      "explanation": "This is a long-standing JavaScript quirk — typeof null returns 'object' due to a bug in the original implementation that was never fixed for backward compatibility."
    }
  ]
}
```

**Design notes:**
- `options` as an array of objects (not plain strings) makes it trivial to store the user's selected option `id` and compare it to `correctOptionId` without string-matching fragile text.
- `quizMeta.timePerQuestion` drives the timer, so time limits are configurable without touching component code.
- `explanation` is optional but strongly recommended — it elevates the Result/Review page from "graded" to genuinely educational, which reads as more polished/human-made.

---

## 8. State Management Design

Use **React Context + `useReducer`** for a `QuizContext` that holds:

```
{
  questions: [...],           // loaded from JSON
  currentQuestionIndex: 0,
  answers: { [questionId]: selectedOptionId | null },
  timeRemaining: number,
  status: 'not-started' | 'in-progress' | 'submitted',
  startedAt: timestamp,
  finishedAt: timestamp
}
```

Actions: `START_QUIZ`, `SELECT_ANSWER`, `NEXT_QUESTION`, `PREV_QUESTION`, `JUMP_TO_QUESTION`, `TICK_TIMER`, `AUTO_ADVANCE`, `SUBMIT_QUIZ`, `RESET_QUIZ`.

A separate lightweight `LeaderboardContext` (or a simple utility module `leaderboardStorage.js` with `getScores()`, `saveScore()`, `clearScores()`) wraps all `localStorage` reads/writes so components never touch `localStorage` directly.

---

## 9. UI/UX Design Requirements

To achieve a **professional, "human-made" (non-templated)** look:

- **Design a real design system before coding:** define a color palette (1 primary, 1 accent, neutrals), a type scale (e.g., using a distinctive Google Font pairing — one for headings, one for body), consistent spacing scale (Tailwind's default scale is fine, just use it consistently), and consistent border-radius/shadow language across all cards/buttons.
- **Avoid default/generic AI-template look:** avoid pure `bg-white` cards with `shadow-md` everywhere and centered generic hero text — add asymmetry, subtle background shapes/gradients, custom illustrations or icon sets, and intentional micro-interactions (hover states, button press feedback, smooth page transitions).
- **Motion:** use subtle, purposeful animation (page fade/slide transitions, progress bar easing, option-selection feedback, timer pulse) — not excessive or distracting.
- **Dark mode (optional but recommended)** for a more modern, portfolio-ready feel — implement via Tailwind's `dark:` variants and a toggle stored in localStorage.
- **Accessibility:**
  - Sufficient color contrast (WCAG AA minimum).
  - Keyboard navigable (Tab/Enter/Arrow keys to select options where feasible).
  - `aria-live` region announcing timer warnings and score results for screen readers.
  - Focus states visible on all interactive elements.
- **Responsiveness:** mobile-first layout; test breakpoints at 320px, 768px, 1024px, 1440px.
- **Loading/empty/error states:** handle the (rare, since data is local) case of a malformed JSON gracefully with a friendly error message instead of a blank screen.

---

## 10. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Initial load under ~2s on average connection (small JSON bundle, no heavy assets). |
| Code Quality | Component-based architecture, reusable components (Button, Card, ProgressBar, Timer, OptionButton, Modal), custom hooks (`useTimer`, `useQuiz`, `useLeaderboard`). |
| Maintainability | Adding/editing questions should only require editing `questions.json` — zero code changes needed. |
| Browser Support | Latest 2 versions of Chrome, Firefox, Safari, Edge. |
| SEO (light) | Proper `<title>`, meta description, and semantic HTML on the Home page (helps if deployed publicly). |
| Error Handling | Guard clauses for invalid routes/states (e.g., visiting `/result` with no completed quiz). |

---

## 11. Suggested Folder Structure

```
src/
├── assets/                # images, icons, fonts
├── components/
│   ├── common/             # Button, Card, Modal, ProgressBar, Loader
│   ├── home/                # HeroSection, HowItWorks, TopScoresPreview
│   ├── quiz/                 # QuestionCard, OptionButton, Timer, QuestionNavigator
│   └── result/                # ScoreSummary, AnswerReviewItem
├── context/
│   ├── QuizContext.jsx
│   └── LeaderboardContext.jsx
├── data/
│   └── questions.json
├── hooks/
│   ├── useTimer.js
│   ├── useQuiz.js
│   └── useLeaderboard.js
├── pages/
│   ├── Home.jsx
│   ├── Quiz.jsx
│   ├── Result.jsx
│   ├── Leaderboard.jsx
│   └── NotFound.jsx
├── utils/
│   ├── scoreCalculator.js
│   └── localStorageHelpers.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 12. Milestones / Suggested Build Order

1. **Setup:** Vite + React + Tailwind + React Router scaffolding; folder structure; ESLint/Prettier.
2. **Data layer:** Finalize `questions.json` schema and add real question content.
3. **Home Page:** Build static UI first, then wire "Start Quiz" navigation.
4. **Quiz Context/Reducer:** Implement state management before building the Quiz page UI on top of it.
5. **Quiz Page:** Question rendering, option selection, navigation, progress bar.
6. **Timer:** Implement `useTimer` hook, integrate auto-advance/auto-submit logic.
7. **Result Page:** Score calculation, review UI.
8. **Leaderboard:** localStorage utility + Leaderboard page + save-score flow from Result page.
9. **Polish pass:** animations, dark mode, responsiveness, accessibility audit.
10. **Testing:** manual QA across devices/browsers; edge cases (timer expiry mid-selection, refresh mid-quiz, empty leaderboard, direct URL access to `/result`/`/quiz`).
11. **Deploy:** Vercel/Netlify + README with setup instructions and a note on the JSON-based architecture.

---

## 13. Acceptance Criteria (Definition of Done)

- [ ] All 5 pages implemented and routed correctly.
- [ ] Quiz fully functional end-to-end using only `questions.json` as the data source (no backend calls).
- [ ] Timer works correctly (countdown, auto-advance, auto-submit) with no off-by-one or race-condition bugs.
- [ ] Score calculation is 100% accurate against the JSON's `correctOptionId` values.
- [ ] Leaderboard persists correctly via localStorage across page reloads and browser restarts.
- [ ] Fully responsive across mobile/tablet/desktop.
- [ ] No console errors/warnings in production build.
- [ ] Passes a basic accessibility check (keyboard nav + contrast).
- [ ] UI does not look like a generic unstyled template — custom color palette, typography, and micro-interactions are evident.
- [ ] README documents setup, folder structure, and how to add new quiz questions.

---

## 14. Open Decisions (Please Confirm)

A few implementation details were left as recommendations above — please confirm or override:

1. **Timer type:** Per-question timer (recommended) vs. one single timer for the whole quiz?
2. **Mid-quiz refresh behavior:** Warn before leaving (`beforeunload`) vs. persist progress in `sessionStorage` and restore it?
3. **Skipping questions:** Should "Next" be allowed without selecting an option (skip), or must the user select before proceeding?
4. **Number of questions & exact topic:** What subject should the sample `questions.json` cover, and how many questions (e.g., 10, 15, 20)?
5. **Dark mode:** Include in v1 or defer to a future enhancement?

---

## 15. Future Enhancements (Post-v1, Optional)
- Multi-category/topic selection (loading different JSON files per topic).
- Difficulty levels (Easy/Medium/Hard) with separate timers/scoring weights.
- Export result as a shareable image/PDF certificate.
- Migrate leaderboard to a real backend (Firebase/Supabase) if multi-device sync is later needed.
- Question shuffling / option shuffling per attempt to reduce memorization.

---

*End of PRD.*
