# 🪐 Vyana Orbit: Persistent AI Code Analysis SaaS

Vyana Orbit is a next-generation **Codebase Intelligence & Remediation Platform**. It doesn't just find bugs—it understands your entire architecture and fixes issues automatically via AI-driven Pull Requests.

![Vyana Orbit Dashboard](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000)

## 🚀 Key Features

### 1. Persistent Code Auditing
Unlike simple linters, Orbit scans your entire repository (via GitHub URL or ZIP) and stores analysis history in **MongoDB**. Your codebase health is tracked over time, allowing for long-term project management.

### 2. Multi-Model AI Engine
Orbit uses a state-of-the-art dual-engine approach:
*   **Primary**: Google Gemini 1.5 Pro (optimized for massive context windows).
*   **Fallback**: Anthropic Claude 3.5 Sonnet (for deep architectural reasoning).

### 3. Visual Refactoring Simulation (WOW Factor)
Orbit features a custom-built **Advanced IDE View** that simulates AI fixes in real-time. When an issue is detected, you can watch the AI "live-type" the corrected code using a futuristic refactoring animation before you choose to apply it.

### 4. Automated PR Remediation (Real World Fixes)
With one click, Orbit automates the standard development workflow:
*   Creates a secure isolation branch.
*   Commits the refactored, secure code.
*   Opens a **Real Pull Request** on GitHub for your review.

### 5. Premium Dashboard UI
A high-fidelity interface built with **Next.js**, **Tailwind CSS**, and **Framer Motion**, featuring:
*   **Orbit Health Score**: An overall grade of your project's security and quality.
*   **Infrastructure Graph**: A visual map of your project's modules and dependencies.
*   **Analysis Explorer**: A dual-pane auditing interface with syntax-highlighted previews.

## 🛠 Tech Stack

*   **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide Icons.
*   **Backend**: Next.js API Routes, MongoDB (via Mongoose).
*   **Authentication**: Auth.js (NextAuth) with Google OAuth and Credentials.
*   **AI Integration**: Google Generative AI SDK, Anthropic SDK.
*   **Git Integration**: Octokit (GitHub REST API).

## ⚙️ Environment Configuration

Create a `.env.local` file with the following:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
AUTH_SECRET=your_auth_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# AI Engines
GEMINI_API_KEY=your_gemini_key
CLAUDE_API_KEY=your_claude_key

# GitHub Integration
GITHUB_TOKEN=your_personal_access_token_with_repo_scope
```

## 📦 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Analyze**:
    Log in, paste a GitHub URL, and watch the Orbit AI transform your code quality.

---

Built with ❤️ by the Vyana Orbit Team.
