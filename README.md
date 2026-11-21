# 🔍 AgileLens AI — Autonomous Backlog & Sprint Deck Workstation

> An AI-powered delivery workstation architected for Agile engineering leaders and Product Owners. Ingests live web applications, Figma designs, and feature PRDs to autonomously synthesize INVEST-compliant Jira user stories, BDD acceptance criteria, definition-of-ready quality gates, and executive Sprint Review slide decks.

Architected by **Balaji Palani** (Senior Scrum Master / Technical Agile Delivery Lead, CSM®, SAFe® 6 SSM).  
**Live Cloud URL:** [https://diastudio.onrender.com](https://diastudio.onrender.com)

---

## 🌟 Key Capabilities

- 🎯 **Interactive "Push to Jira" & RFC 4180 CSV:** Converts any active tab into a complete SAFe 6.0 User Story (Role-Capability-Benefit, Given-When-Then BDD Acceptance Criteria, Definition of Ready Quality Gate) with 1-click download of Jira-compliant RFC 4180 CSV files.
- 📽️ **Standalone HTML Presentation Exporter (SlideKit):** Compiles sprint updates into an offline, self-contained single-file HTML slide deck with full-screen mode, keyboard arrow navigation (`←`, `→`, `Space`), delivery metrics, and speaker talk tracks.
- 📝 **ReportKit Executive Delivery Memos:** Structured investigative status reports with 1-click clipboard export and Markdown download for VP briefings.
- 🌐 **Live Real URL Browsing & Spec Extraction:** Enter any product URL into the Omnibar; the crawler extracts metadata and numbers interactable DOM elements for autonomous sprint spec synthesis.
- 🤖 **Autonomous Agile Copilot Fleet:** Deploys specialized delivery subagents (**Agile Copilot**, **Backlog Synthesizer**, **Meeting Watcher**, **SlideKit**, and **Autonomous Web Agent**).
- 🔑 **Human-in-the-Loop Handoff:** Built-in simulated 2FA / CAPTCHA handoff mechanism that pauses autonomous agents for user authentication and resumes work seamlessly.
- 🛡️ **Forensic Agent Sandbox:** Telemetry visualizer for macOS kernel sandboxing and local inference execution.

---

## 🚀 Quick Start

### 1. Install & Build
```bash
git clone https://github.com/layyzee/DiaStudio.git
cd DiaStudio
npm install
npm run build
```

### 2. Run Locally
```bash
npm start
```
Open **`http://localhost:5183`** in your browser.

---

## 🛠️ Tech Stack & Zero-Cost Architecture

- **Frontend:** React 18, Vite 5, Tailwind CSS 3, Lucide Icons, Canvas Confetti.
- **Backend:** Node.js / Express, WebSockets (`ws`), Server-Sent Events (SSE).
- **Inference Gateway:** OpenRouter Free (Llama-3.3 70B) / Local Ollama / Procedural Fallback.
- **Cost:** **$0.00** (Zero subscription fees, 100% open source).
