/**
 * Standalone Offline Presentation Exporter
 * Compiles a Dia Studio SlideKit deck into an offline, single-file HTML presentation.
 */

export function generateStandalonePresentationHtml(deck) {
  const slides = deck?.slides || [];
  const title = deck?.title || 'SlideKit Presentation';
  const author = 'Curated by Balaji Palani • Senior Scrum Master';

  const slidesJson = JSON.stringify(slides);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Dia Studio Presentation</title>
  <style>
    :root {
      --bg: #07090e;
      --card-bg: #0d1222;
      --border: rgba(255, 255, 255, 0.1);
      --purple: #9333ea;
      --purple-light: #c084fc;
      --indigo: #6366f1;
      --cyan: #22d3ee;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      overflow-x: hidden;
    }
    .deck-container {
      width: 100%;
      max-width: 1000px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .top-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--text-muted);
      font-family: monospace;
    }
    .badge {
      background: rgba(147, 51, 234, 0.2);
      color: var(--purple-light);
      border: 1px solid rgba(147, 51, 234, 0.4);
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.7rem;
      text-transform: uppercase;
      font-weight: bold;
    }
    .slide-card {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: linear-gradient(180deg, #131a2e 0%, #0d1222 100%);
      border: 1px solid var(--border);
      border-radius: 1.5rem;
      padding: 2.5rem 3rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      overflow: hidden;
      transition: opacity 0.25s ease;
    }
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }
    .slide-number {
      font-family: monospace;
      font-size: 0.75rem;
      color: var(--purple-light);
      background: rgba(147, 51, 234, 0.15);
      border: 1px solid rgba(147, 51, 234, 0.3);
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-weight: 600;
    }
    .metric-box {
      text-align: right;
    }
    .metric-value {
      font-size: 2.25rem;
      font-weight: 800;
      font-family: monospace;
      background: linear-gradient(to right, #c084fc, #818cf8, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .metric-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      color: var(--text-muted);
      font-family: monospace;
    }
    .slide-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }
    .slide-subtitle {
      font-size: 0.95rem;
      color: var(--purple-light);
      margin-bottom: 1.5rem;
    }
    .bullets {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 80%;
    }
    .bullet-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.95rem;
      color: #e2e8f0;
      line-height: 1.5;
    }
    .bullet-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background-color: var(--purple-light);
      margin-top: 0.45rem;
      flex-shrink: 0;
      box-shadow: 0 0 8px var(--purple-light);
    }
    .speaker-notes {
      background: rgba(0, 0, 0, 0.3);
      border-top: 1px solid var(--border);
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: monospace;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .speaker-label {
      color: var(--purple-light);
      font-weight: bold;
    }
    .controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.5rem;
    }
    .nav-buttons {
      display: flex;
      gap: 0.5rem;
    }
    button {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border);
      color: #ffffff;
      padding: 0.6rem 1.25rem;
      border-radius: 0.75rem;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: monospace;
    }
    button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.15);
    }
    button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    button.primary {
      background: var(--purple);
      border-color: var(--purple);
      box-shadow: 0 4px 14px rgba(147, 51, 234, 0.4);
    }
    button.primary:hover:not(:disabled) {
      background: #a855f7;
    }
    .dots {
      display: flex;
      gap: 0.4rem;
      align-items: center;
    }
    .dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .dot.active {
      width: 1.5rem;
      border-radius: 9999px;
      background: var(--purple-light);
    }
    .help-hint {
      text-align: center;
      font-size: 0.7rem;
      color: var(--text-muted);
      font-family: monospace;
      margin-top: 0.5rem;
    }
    @media (max-width: 768px) {
      .slide-card {
        aspect-ratio: auto;
        min-height: 400px;
        padding: 1.5rem;
      }
      .slide-title {
        font-size: 1.35rem;
      }
      .metric-value {
        font-size: 1.75rem;
      }
      .bullets {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>

  <div class="deck-container">
    <div class="top-meta">
      <div>
        <span class="badge">Dia Studio SlideKit</span>
        <span style="margin-left: 0.5rem;">${escapeHtml(title)}</span>
      </div>
      <div>${escapeHtml(author)}</div>
    </div>

    <div class="slide-card" id="slideCard">
      <!-- Injected via JavaScript -->
    </div>

    <div class="controls">
      <div class="nav-buttons">
        <button id="prevBtn" onclick="prevSlide()">← Previous</button>
        <button id="nextBtn" class="primary" onclick="nextSlide()">Next Slide →</button>
      </div>

      <div class="dots" id="dotsContainer"></div>

      <div>
        <button onclick="toggleFullScreen()">⛶ Fullscreen</button>
      </div>
    </div>

    <div class="help-hint">
      Tip: Use <kbd>←</kbd> and <kbd>→</kbd> arrow keys or <kbd>Spacebar</kbd> to navigate slides.
    </div>
  </div>

  <script>
    const slides = ${slidesJson};
    let currentIndex = 0;

    function renderSlide(index) {
      if (!slides || slides.length === 0) return;
      const slide = slides[index];
      const card = document.getElementById('slideCard');

      const metricHtml = slide.metric ? \`
        <div class="metric-box">
          <div class="metric-value">\${escapeHtml(slide.metric)}</div>
          <div class="metric-label">\${escapeHtml(slide.metricLabel || '')}</div>
        </div>
      \` : '';

      const bulletsHtml = (slide.bullets || []).map(b => \`
        <div class="bullet-item">
          <div class="bullet-dot"></div>
          <div>\${escapeHtml(b)}</div>
        </div>
      \`).join('');

      const speakerNotesHtml = slide.speakerNotes ? \`
        <div class="speaker-notes">
          <span class="speaker-label">🎙️ Talk Track:</span>
          <span>\${escapeHtml(slide.speakerNotes)}</span>
        </div>
      \` : '';

      card.innerHTML = \`
        <div>
          <div class="slide-header">
            <span class="slide-number">Slide \${index + 1} of \${slides.length}</span>
            \${metricHtml}
          </div>
          <h1 class="slide-title">\${escapeHtml(slide.title || '')}</h1>
          <p class="slide-subtitle">\${escapeHtml(slide.subtitle || '')}</p>
          <div class="bullets">\${bulletsHtml}</div>
        </div>
        \${speakerNotesHtml}
      \`;

      document.getElementById('prevBtn').disabled = (index === 0);
      document.getElementById('nextBtn').disabled = (index === slides.length - 1);

      // Render dots
      const dotsContainer = document.getElementById('dotsContainer');
      dotsContainer.innerHTML = slides.map((_, i) => \`
        <div class="dot \${i === index ? 'active' : ''}" onclick="goToSlide(\${i})"></div>
      \`).join('');
    }

    function nextSlide() {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        renderSlide(currentIndex);
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        renderSlide(currentIndex);
      }
    }

    function goToSlide(i) {
      currentIndex = i;
      renderSlide(currentIndex);
    }

    function toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      }
    });

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Initial render
    renderSlide(0);
  </script>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
