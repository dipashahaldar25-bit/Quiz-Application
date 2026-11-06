# Project Phases
## Online Quiz Application (React + JSON, Frontend-Only)

This document breaks the project down into sequential phases, from initial planning to final deployment. Each phase lists its goal, tasks, and a completion checklist so you always know what's done and what's next.

---

## Phase 0: Planning & Requirements
**Goal:** Lock down scope and decisions before writing any code.

**Tasks:**
- Review and finalize the PRD (`Online-Quiz-App-PRD.md`).
- Confirm the open decisions from PRD Section 14:
  - Timer type (per-question vs. whole-quiz)
  - Mid-quiz refresh behavior
  - Whether skipping a question without answering is allowed
  - Quiz topic and number of questions
  - Whether dark mode ships in v1
- Decide on quiz content source (write your own questions or curate from a reference).
- Choose hosting platform (Vercel / Netlify / GitHub Pages).

**Checklist:**
- [x] PRD reviewed and open decisions confirmed
- [x] Quiz topic finalized
- [x] Hosting platform chosen

---

## Phase 1: Project Setup
**Goal:** A clean, running project skeleton with all tooling in place.

**Tasks:**
- Initialize project with Vite + React.
- Install and configure Tailwind CSS.
- Install React Router DOM.
- Install supporting libraries: `lucide-react` (icons), `framer-motion` (optional animations).
- Set up ESLint + Prettier for consistent code style.
- Create the folder structure (`components/`, `pages/`, `context/`, `hooks/`, `data/`, `utils/`, `assets/`).
- Set up Git repository, `.gitignore`, and initial commit.
- Create a basic `App.jsx` with React Router routes stubbed out (`/`, `/quiz`, `/result`, `/leaderboard`, `*`) rendering placeholder text.

**Checklist:**
- [x] Vite dev server runs with no errors
- [x] Tailwind classes work in a test component
- [x] Routing works between all 5 stub pages
- [x] Repo initialized and pushed to GitHub

---

## Phase 2: Data Layer
**Goal:** The quiz's "database" — a well-structured JSON file — is ready and validated.

**Tasks:**
- Design and finalize the `questions.json` schema (per PRD Section 7): `quizMeta` + `questions[]` with `id`, `question`, `options[]`, `correctOptionId`, `explanation`.
- Write/curate the actual quiz content (all questions, options, correct answers, explanations).
- Place file at `src/data/questions.json`.
- Write a small utility (`utils/validateQuestions.js`, optional) to sanity-check the JSON shape during development (e.g., every question has exactly 4 options and a valid `correctOptionId`).

**Checklist:**
- [x] `questions.json` created with real content (not placeholder lorem ipsum)
- [x] Every question has 4 options and a valid correct answer
- [x] `quizMeta` includes title, description, total questions, time per question

---

## Phase 3: State Management
**Goal:** The app's "brain" — quiz state — is built and testable in isolation before any real UI depends on it.

**Tasks:**
- Build `QuizContext` + reducer with the state shape and actions defined in PRD Section 8.
- Implement actions: `START_QUIZ`, `SELECT_ANSWER`, `NEXT_QUESTION`, `PREV_QUESTION`, `JUMP_TO_QUESTION`, `TICK_TIMER`, `AUTO_ADVANCE`, `SUBMIT_QUIZ`, `RESET_QUIZ`.
- Build `useQuiz` custom hook to expose state + dispatchers cleanly to components.
- Build `utils/scoreCalculator.js` to compute correct/wrong/skipped counts and percentage from the `answers` map.
- Write a temporary debug page or console logs to confirm state transitions work correctly before wiring up real UI.

**Checklist:**
- [x] Reducer handles all actions correctly (verified via manual testing/logging)
- [x] Score calculation logic produces correct results against sample data
- [x] `useQuiz` hook exposes a clean API for components to consume

---

## Phase 4: Home Page
**Goal:** A polished, professional landing page that starts the quiz flow.

**Tasks:**
- Build Hero section (title, tagline, Start Quiz CTA) pulling live data from `quizMeta` (question count, time limit, topic).
- Build "How it works" 3-step section with icons.
- Build optional "Top Scores" preview (reads from leaderboard utility — can stub with empty state until Phase 7).
- Wire "Start Quiz" button to dispatch `START_QUIZ` and navigate to `/quiz`.
- Add entrance animations and responsive layout.

**Checklist:**
- [x] Home page displays real quiz metadata
- [x] Start Quiz button correctly initializes state and navigates
- [x] Fully responsive at mobile/tablet/desktop widths

---

## Phase 5: Quiz Page
**Goal:** The core interactive quiz-taking experience, fully functional.

**Tasks:**
- Build `QuestionCard` component (question text + 4 `OptionButton`s with selected/hover states).
- Build `ProgressBar` component showing current/total question count.
- Build `QuestionNavigator` (clickable question grid, color-coded by answered/current/unanswered status).
- Build `Timer` component + `useTimer` hook:
  - Countdown logic tied to `quizMeta.timePerQuestion` (or whole-quiz duration, per Phase 0 decision).
  - Visual urgency state in final seconds.
  - Dispatch `AUTO_ADVANCE` or `SUBMIT_QUIZ` on expiry.
- Wire Next/Previous buttons to reducer actions, preserving previously selected answers.
- Add Submit button + confirmation modal on the last question (warns about unanswered questions).
- Implement chosen mid-quiz refresh-protection strategy (from Phase 0 decision): `beforeunload` warning or `sessionStorage` persistence.
- On submit, dispatch `SUBMIT_QUIZ`, calculate results, and navigate to `/result`.

**Checklist:**
- [x] User can answer, skip, and revisit questions without losing selections
- [x] Timer counts down accurately and triggers correct auto-behavior at 0
- [x] Question navigator accurately reflects answered/unanswered state
- [x] Submitting navigates to Result page with correct final state

---

## Phase 6: Result Page
**Goal:** Clear, educational feedback on quiz performance.

**Tasks:**
- Build `ScoreSummary` component (score, percentage, correct/wrong/skipped counts, time taken, visual ring/badge).
- Build `AnswerReviewItem` component for each question: selected answer, correct answer, explanation, correct/incorrect color coding.
- Add guard: redirect to `/` if a user navigates to `/result` without an active/completed quiz session.
- Add action buttons: Retake Quiz, Back to Home, View Leaderboard, Save to Leaderboard (prompts for name).

**Checklist:**
- [x] Score and breakdown are 100% accurate against submitted answers
- [x] Full answer review renders correctly for every question
- [x] Direct/invalid access to `/result` redirects properly
- [x] Retake Quiz correctly resets all state

---

## Phase 7: Leaderboard & Persistence
**Goal:** Local score history that persists across sessions.

**Tasks:**
- Build `utils/localStorageHelpers.js` (or `LeaderboardContext`) with `getScores()`, `saveScore()`, `clearScores()`.
- Wire the "Save to Leaderboard" action on the Result page to write name + score + date + time taken into localStorage.
- Build Leaderboard page: sorted table (score desc, then time asc as tiebreaker), empty state, "Clear history" action with confirmation.
- Wire Home page's "Top Scores" preview to read real data now that this phase is complete.

**Checklist:**
- [x] Scores persist correctly across page reloads and browser restarts
- [x] Leaderboard is sorted correctly
- [x] Clear-history flow works with confirmation
- [x] Home page preview shows real top scores

---

## Phase 8: UI/UX Polish
**Goal:** Elevate the app from "functional" to "professional and human-made."

**Tasks:**
- Apply a deliberate design system across all pages: consistent color palette, font pairing, spacing, radius, and shadow language.
- Add micro-interactions: button hover/press feedback, option-selection animation, timer pulse, page transitions.
- Implement dark mode (if confirmed in Phase 0), with a toggle persisted to localStorage.
- Full accessibility pass: color contrast, keyboard navigation, focus states, `aria-live` regions for timer/score announcements.
- Cross-check responsiveness at 320px, 768px, 1024px, 1440px breakpoints.

**Checklist:**
- [x] Design feels custom, not like a generic template
- [x] Dark mode works correctly (if included)
- [x] Passes basic accessibility checks (contrast + keyboard nav)
- [x] No layout breakage at any tested breakpoint

---

## Phase 9: Testing & QA
**Goal:** Catch bugs and edge cases before deployment.

**Tasks:**
- Manual end-to-end test: full quiz flow from Home → Quiz → Result → Leaderboard.
- Edge case testing:
  - Timer expiring mid-selection
  - Refreshing mid-quiz
  - Submitting with unanswered questions
  - Direct URL access to `/result` or `/quiz` without a valid session
  - Empty leaderboard state
  - Very long question/answer text (layout doesn't break)
- Cross-browser testing (Chrome, Firefox, Safari, Edge).
- Check browser console for errors/warnings in both dev and production builds.

**Checklist:**
- [x] All edge cases handled gracefully
- [x] No console errors/warnings in production build
- [x] Verified on at least 2 browsers and mobile + desktop viewports

---

## Phase 10: Deployment
**Goal:** Ship the live, public version of the app.

**Tasks:**
- Run production build (`npm run build`) and verify output locally (`npm run preview`).
- Deploy to chosen platform (Vercel/Netlify/GitHub Pages).
- Verify routing works correctly in production (client-side routing fallback configured, e.g., `_redirects` or `vercel.json` rewrite rules so refreshing `/quiz` doesn't 404).
- Set page `<title>` and meta description for SEO/sharing.
- Do a final smoke test on the live URL.

**Checklist:**
- [x] Production build succeeds with no errors
- [x] Live URL works, including on hard refresh of non-root routes
- [x] Final smoke test passed on the deployed link

---

## Phase 11: Documentation
**Goal:** Make the project easy to understand, maintain, and showcase.

**Tasks:**
- Write `README.md` covering: project overview, tech stack, folder structure, setup/run instructions, how to add/edit quiz questions via `questions.json`, and a live demo link.
- Add screenshots or a short GIF/video of the app in action.
- Note clearly that this is a frontend-only project using JSON as the data layer (sets accurate expectations for reviewers).

**Checklist:**
- [x] README complete with setup instructions and screenshots
- [x] Live demo link included and working

---

## Phase 12 (Optional): Future Enhancements
**Goal:** Ideas for a v2, not required for initial completion.

**Tasks (pick and choose, not required):**
- Multi-category/topic selection via multiple JSON files.
- Difficulty levels with separate timers/scoring.
- Export result as a shareable image or certificate.
- Migrate leaderboard to a real backend (Firebase/Supabase) for cross-device sync.
- Question/option shuffling per attempt.

---

## Summary Timeline

| Phase | Focus | Depends On |
|---|---|---|
| 0 | Planning & Requirements | — |
| 1 | Project Setup | Phase 0 |
| 2 | Data Layer | Phase 0 |
| 3 | State Management | Phase 1, 2 |
| 4 | Home Page | Phase 1, 2 |
| 5 | Quiz Page | Phase 3, 4 |
| 6 | Result Page | Phase 5 |
| 7 | Leaderboard & Persistence | Phase 6 |
| 8 | UI/UX Polish | Phase 4–7 |
| 9 | Testing & QA | Phase 8 |
| 10 | Deployment | Phase 9 |
| 11 | Documentation | Phase 10 |
| 12 | Future Enhancements | Phase 11 (optional, later) |

*End of Phases document.*
