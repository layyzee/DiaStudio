# 🔮 Dia Studio — Reconstructed AI Browser & Multi-Agent Workstation

**Architected by Balaji Palani** (Senior Scrum Master / Technical Agile Delivery Lead, CSM®, SAFe® 6 SSM)  
**Workspace:** [`/Users/layyzee/Downloads/DiaStudio`](file:///Users/layyzee/Downloads/DiaStudio)  
**Local Engine:** `http://localhost:5183`  
**Deployment Blueprint:** [`render.yaml`](file:///Users/layyzee/Downloads/DiaStudio/render.yaml)  

---

## 📸 Production Verification Gallery

````carousel
![Dia Studio Interactive Web Canvas & Numbered DOM Inspector](/Users/layyzee/Downloads/DiaStudio/docs/screenshots/diastudio_main_canvas.png)
<!-- slide -->
![Dia SlideKit Presentation Stage with Carousel & Metrics](/Users/layyzee/Downloads/DiaStudio/docs/screenshots/diastudio_artifact_stage.png)
<!-- slide -->
![Dia Agent Multi-Process Sandbox & Seatbelt IPC Stream](/Users/layyzee/Downloads/DiaStudio/docs/screenshots/diastudio_agent_sandbox.png)
````

---

## 🔬 Reverse-Engineering Insights from `/Applications/Dia.app`

Dia Studio was constructed from deep forensic decompilation and behavioral analysis of The Browser Company's **Dia Browser** (`company.thebrowser.dia`, v1.55.1):

1. **Embedded Agent Engine:**
   * Inside `agent-server-resources/dist`, the core agent daemon is compiled with **Bun** (`// @bun`) hosting an adapted version of **Anthropic's Claude Code** (`v2.1.296`).
   * Constrained on macOS using kernel seatbelt profiles (`agent.sb`, `agent-claude-code.sb`).
2. **On-Device Apple Silicon ML:**
   * Employs `libAIInfra.dylib` (18.6 MB) linked with **Apple MLX** (`mlx-swift_Cmlx.bundle`) and Hugging Face Transformers Hub for zero-latency local tokenization and tab classification.
3. **The 43 Specialized Subagents:**
   * Includes **Clia** (executive briefs), **The Desk Suite** (`desk-focus`, `desk-hydrate`, `desk-kickoff`), and **Meeting Watcher** (Zoom & calendar prep).
4. **Autonomous Web Protocol (`browser-use.md`):**
   * Uses numbered DOM element snapshots (`{"action": "click", "element": 12}`) and features built-in **Human-in-the-Loop Handoff** (`handoff_page_id`) when 2FA or CAPTCHA challenges arise.
5. **Generative Deliverable Frameworks:**
   * Uses standardized `SKILL.md` instruction files to produce **`slide-kit`** presentations and **`report-kit`** executive memos.

---

## 🌟 What Was Built in Dia Studio

### 1. Interactive Web Canvas & DOM Inspector ([`TabCanvas.jsx`](file:///Users/layyzee/Downloads/DiaStudio/src/components/TabCanvas.jsx))
* Live web view rendering page title, TLS encryption state, domain, and synthesized document context.
* **Numbered DOM Overlay:** Toggles Dia's numeric element identifiers (`[1]`, `[2]`, `[3]`) to test and visualize autonomous browser agent targeting.
* **Human-in-the-Loop Handoff:** Interactive modal simulating 2FA/login handoffs that pauses the agent, allows user authentication, and cleanly returns execution control.

### 2. Generative Artifact Stage ([`ArtifactStage.jsx`](file:///Users/layyzee/Downloads/DiaStudio/src/components/ArtifactStage.jsx))
* **SlideKit Deck Viewer:** 16:9 interactive presentation carousel with slide counters, glowing key metrics (`98% Predictability`, `48h SLA`), speaker notes drawer, and confetti celebration triggers.
* **ReportKit Memo Viewer:** Executive memorandum renderer with one-click markdown clipboard export.

### 3. Multi-Process Agent Sandbox ([`AgentSandbox.jsx`](file:///Users/layyzee/Downloads/DiaStudio/src/components/AgentSandbox.jsx))
* Live terminal visualizer monitoring IPC messages on `/tmp/dia-agent-server.sock`.
* Telemetry cards tracking subagent rosters, Apple MLX memory utilization, and Seatbelt kernel isolation.
* One-click tool test buttons for Slack and Jira integrations.

### 4. Real-Time Streaming Assistant Panel ([`AssistantDrawer.jsx`](file:///Users/layyzee/Downloads/DiaStudio/src/components/AssistantDrawer.jsx))
* Connects to `/api/chat` via Server-Sent Events (SSE) for token-by-token text streaming.
* Real-time collapsible tool execution status cards (`dia:read_tabs`, `dia:slide_kit`).
* Quick-action prompt chips ("Executive Morning Brief", "Create SlideKit Deck", "Autonomous Browser Action").

---

## 🛠️ Architecture & Zero-Cost Cloud Ready

* **Frontend:** React 18, Vite 5, Tailwind CSS 3, Lucide Icons, Canvas Confetti.
* **Backend:** Express, WebSockets (`ws`), Server-Sent Events (SSE).
* **AI Model Engine:** OpenRouter Free (`meta-llama/llama-3.3-70b-instruct:free`) with smart procedural fallbacks.
* **Cost:** **$0.00** (Zero SaaS fees, zero paid API dependencies, deployable on Render's free tier).
