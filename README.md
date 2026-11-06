# QuizCraft — Online Quiz Application

> A professional, hand-crafted, frontend-only React quiz platform built with React, Vite, Tailwind CSS, and Context API. Powered by a self-contained local JSON data layer and browser persistence.

---

## 🌟 Overview & Architecture

**QuizCraft** is a production-grade single-topic quiz application designed with deliberate UI/UX craftsmanship, robust state management, and zero external backend dependencies. 

- **Frontend-Only Architecture**: All quiz questions, options, metadata, and explanations are stored and loaded from a structured local JSON file (`src/data/questions.json`). There is no backend server or remote database required.
- **State & Session Persistence**: Active quiz sessions persist across browser refreshes using `sessionStorage`, while Hall of Fame leaderboard attempts persist across browser sessions using `localStorage`.

---

## 🚀 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | [React 18](https://react.dev/) + [Vite](https://vite.dev/) | Lightning-fast HMR and optimized production bundles |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) | Custom design system, dark mode (`class` strategy), and micro-animations |
| **Routing** | [React Router DOM v6](https://reactrouter.com/) | Client-side routing with route guards |
| **State Management** | Context API + `useReducer` | Centralized quiz state machine (`QuizContext`) |
| **Data Layer** | Static JSON (`questions.json`) | Validated data structure for quiz questions and metadata |
| **Persistence** | Web Storage API | `localStorage` (leaderboard) & `sessionStorage` (in-progress quiz) |
| **Icons** | [Lucide React](https://lucide.dev/) | Modern, clean vector iconography |
| **Effects** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | Celebratory particle effects on passing scores |

---

## ✨ Features (PRD Functional Requirements)

- **FR-1: JSON Data Layer**: 10 curated JavaScript Fundamentals questions loaded directly from `src/data/questions.json` with technical explanations.
- **FR-2: Dynamic Landing Page**: Live metadata cards (question count, 30s timer, 60% pass mark) and a preview of the top 3 leaderboard attempts.
- **FR-3: Single-Choice MCQ Format**: 4 distinct options per question with keyboard shortcuts (`1-4` or `A-D`).
- **FR-4: Per-Question Circular Timer**: 30-second countdown with SVG ring animation, turning amber at 10s and pulsing red under 5s with auto-advance on expiry.
- **FR-5: State-Preserving Navigation**: Move between previous and next questions without losing selected choices.
- **FR-6: Interactive Question Navigator**: 10-node status grid (Current, Answered, Skipped) allowing immediate jumps to any question.
- **FR-7 & FR-8: Detailed Score & Educational Review**:
  - Circular score gauge with performance tier badge ("Maestro", "Great Achievement", "Passed", or "Needs Practice").
  - Breakdown grid: Correct, Wrong, Skipped, and Time Spent.
  - Full answer review showing your selection (red if wrong, green if right), the correct answer, and an in-depth explanation box.
  - Interactive filter tabs (All, Correct, Incorrect, Skipped).
- **FR-9 & FR-10: Persistent Local Leaderboard**:
  - Save your score with a display name to the Hall of Fame.
  - Sorted by score (descending), with fastest completion time as the tiebreaker.
  - Gold, Silver, and Bronze badges for the top 3 ranks.
  - Clear history flow with confirmation modal.
- **FR-11: Retake & Reset**: Full state reset when restarting or taking another attempt.
- **FR-12: Route Guarding**: Visiting `/result` without a completed session cleanly redirects to the Home page.
- **Dark Mode**: Toggle between light and dark modes with preference saved in `localStorage`.
- **Session Protection**: `sessionStorage` restores in-progress quiz on page refresh, and `beforeunload` warns before accidental tab closing.

---

## 📁 Project Folder Structure

```
quiz/
├── public/
│   └── _redirects              # Netlify SPA routing fallback
├── src/
│   ├── assets/                 # Static assets & icons
│   ├── components/
│   │   ├── common/             # Button, Card, Badge, ProgressBar, ThemeToggle, Navbar, Footer
│   │   ├── home/               # HeroSection, HowItWorks, TopScoresPreview
│   │   ├── quiz/               # QuestionCard, OptionButton, Timer, QuestionNavigator, SubmitConfirmModal
│   │   └── result/             # ScoreSummary, AnswerReviewItem, SaveScoreCard
│   ├── context/
│   │   └── QuizContext.jsx     # Centralized quiz state machine & reducer
│   ├── data/
│   │   └── questions.json      # Complete quiz dataset (schema-validated)
│   ├── hooks/
│   │   ├── useQuiz.js          # Hook exposing quiz state & action dispatchers
│   │   ├── useTimer.js         # Countdown timer hook with auto-advance
│   │   └── useLeaderboard.js   # Reactive leaderboard hook
│   ├── pages/
│   │   ├── Home.jsx            # Landing / Hero page
│   │   ├── Quiz.jsx            # Active quiz taking screen
│   │   ├── Result.jsx          # Score summary & answer review screen
│   │   ├── Leaderboard.jsx     # Hall of Fame local leaderboard
│   │   └── NotFound.jsx        # 404 page
│   ├── utils/
│   │   ├── scoreCalculator.js  # Score, accuracy, and review processor
│   │   ├── localStorageHelpers.js # Leaderboard persistence & tiebreaker sorting
│   │   └── validateQuestions.js # Schema validation utility
│   ├── App.jsx                 # App routes and providers
│   ├── main.jsx                # Vite entry point
│   └── index.css               # Tailwind directives and custom animation styles
├── vercel.json                 # Vercel SPA rewrite configuration
├── tailwind.config.js          # Tailwind theme & color configurations
├── package.json
└── README.md
```

---

## 🛠️ Local Setup & Running Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `pnpm` / `yarn`

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to take the quiz.

### 3. Run Validation & QA Tests
```bash
node test-runner.mjs
```

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build Locally
```bash
npm run preview
```

---

## 📝 How to Add or Edit Quiz Questions

You can modify or add new quiz questions simply by editing `src/data/questions.json`. Zero JavaScript code changes are required!

### JSON Schema
```json
{
  "quizMeta": {
    "title": "JavaScript Fundamentals",
    "description": "Test your core JavaScript knowledge.",
    "topic": "JavaScript",
    "difficulty": "Intermediate",
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
      "explanation": "typeof null returns 'object' due to an early bug in JavaScript's type tagging."
    }
  ]
}
```

### Schema Rules:
1. `id`: Unique number or string.
2. `options`: Exactly 4 options, each with a unique `id` (`"a"`, `"b"`, `"c"`, `"d"`) and non-empty `text`.
3. `correctOptionId`: Must match one of the option `id`s.
4. `explanation`: Educational text explaining why the answer is correct.

---

## 🌐 Deployment

The application is fully pre-configured for static deployment on **Vercel**, **Netlify**, or **GitHub Pages**:
- **Vercel**: Includes `vercel.json` with a single rewrite rule redirecting all requests to `/index.html` to prevent 404s on hard refresh.
- **Netlify**: Includes `public/_redirects` rule (`/* /index.html 200`).

---

## 📄 License
MIT © 2026 QuizCraft Project.
