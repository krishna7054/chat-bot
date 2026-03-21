# 🚀 Interview Copilot

A role-based AI-powered interview practice platform that simulates real technical interviews with structured feedback.

---

## ✨ Overview

Interview Copilot helps developers practice interviews in a focused and structured way.

Instead of random AI chat, the system enforces:
- One question at a time
- Immediate structured feedback
- Controlled interview flow

Each response is evaluated with:
- Score
- Strengths
- Weaknesses
- Ideal Answer

---

## 🎯 Features

- 🎭 Role-based interviews (Frontend, Backend, DSA)
- 🧠 AI-generated questions & evaluation
- 📊 Real-time scoring and progress tracking
- ⏱️ Session timer
- 📱 Fully responsive UI
- 🔁 Controlled interview flow (fixed number of questions)
- 🧹 Cleaned and structured AI output (no messy formatting)

---

## 🏗️ Tech Stack

**Frontend**
- Next.js 15 (App Router)
- Tailwind CSS

**Backend**
- Next.js API Routes

**AI**
- Google Gemini API (`@google/genai`)

---

## 🧠 System Design

The application is built with a clear separation of concerns:

### 1. Frontend
- Handles UI rendering, chat state, and user interaction
- Parses and displays structured feedback

### 2. API Layer
- Controls interview flow (question → answer → feedback)
- Limits total number of questions
- Formats and validates AI responses

### 3. AI Layer
- Generates interview questions
- Evaluates answers based on structured prompts

> ⚠️ AI does NOT control application logic. The backend ensures deterministic behavior.

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/krishna7054/chat-bot.git
cd chat-bot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a .env.local file:
```bash
GEMINI_API_KEY=your_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```

## 🤖 AI Handling Strategy (Important)

To avoid unreliable AI outputs ("AI slop"), the system follows strict principles:

### ✅ Structured Prompting

AI is forced to return responses in a fixed format:

- Score
- Strengths
- Weaknesses
- Ideal Answer
- Next Question

### ✅ Controlled Parsing

Responses are parsed and split into:

- Feedback
- Next Question

Only required data is extracted.

### ✅ Validation Layer
- Score extracted using regex
- Missing or malformed responses are handled safely

### ✅ Cleaning Layer
- Removes markdown artifacts (*, #, etc.)
- Ensures clean UI rendering

### ✅ Code-Controlled Logic
- Interview flow is NOT controlled by AI
- Backend enforces:
  - Question count
  - Interview completion
  - Response sequencing

💡 AI is treated as a tool, not a source of truth.

## 📊 Interview Flow
1. User selects a role
2. AI generates Question 1
3. User submits answer
4. AI evaluates response
5. Feedback is displayed
6. Next question is asked
7. Process repeats until completion
