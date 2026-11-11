/**
 * ETHIO AI HUB - Education Helper / Student AI
 * Aligned with the Ethiopian Education Curriculum (Grades 5–12 & ICT).
 * Explains how to solve problems step-by-step rather than giving raw answers.
 */

window.EthioTools_EducationHelper = (function() {

  function render(container) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    container.innerHTML = `
      <div class="tool-header-banner">
        <div class="tool-header-left">
          <div class="tool-header-icon" style="background-color: #f3e8ff; color: #7c3aed;">
            🎓
          </div>
          <div>
            <h2 style="font-size: 1.25rem;">${t('navEducationHelper')}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              የኢትዮጵያ የትምህርት ካሪኩለም አጋዥ (ከ 5–12ኛ ክፍል እና ICT) – የደረጃ በደረጃ የሂሳብና የሳይንስ ማብራሪያ
            </p>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 20px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 16px;">
          <div class="form-group">
            <label class="form-label">የክፍል ደረጃ (Grade Level)</label>
            <select id="edu-grade">
              <option value="Grade 5-6">ከ 5ኛ - 6ኛ ክፍል (Primary)</option>
              <option value="Grade 7-8">ከ 7ኛ - 8ኛ ክፍል (Middle School / Ministry Exam)</option>
              <option value="Grade 9-10">ከ 9ኛ - 10ኛ ክፍል (Secondary)</option>
              <option value="Grade 11-12" selected>ከ 11ኛ - 12ኛ ክፍል (Preparatory / University Entrance)</option>
              <option value="College/ICT">ኮሌጅ / ICT ሙያ (College & Vocational)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">የትምህርት አይነት (Subject)</label>
            <select id="edu-subject">
              <option value="Mathematics">ሂሳብ (Mathematics)</option>
              <option value="Physics">ፊዚክስ (Physics)</option>
              <option value="Chemistry">ኬሚስትሪ (Chemistry)</option>
              <option value="Biology">ባዮሎጂ (Biology)</option>
              <option value="English">እንግሊዝኛ (English)</option>
              <option value="ICT & Coding">ICT እና ኮዲንግ (ICT & Programming)</option>
              <option value="Civics / General">ማህበራዊ ሳይንስ (Social Science)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">የእገዛ አይነት (Mode)</label>
            <select id="edu-mode">
              <option value="step-by-step">የደረጃ በደረጃ ማብራሪያ (Step-by-step explanation)</option>
              <option value="concept">ጽንሰ-ሀሳብ ማብራሪያ (Concept Lesson)</option>
              <option value="practice">የልምምድ ፈተና ጥያቄዎች (Practice Questions)</option>
              <option value="revision">የፈተና ክለሳ ማስታወሻ (Revision Notes)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">የቤት ስራ ጥያቄዎን ወይም ሊረዱት የሚፈልጉትን ርዕስ ያስገቡ:</label>
          <textarea id="edu-question-input" rows="4" placeholder="ምሳሌ፡ Find the derivative of f(x) = 3x^2 + 5x - 7, or explain photosynthesis, or how binary numbers work in ICT..."></textarea>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 0.8rem; color: #b45309; background: var(--gold-light); padding: 6px 12px; border-radius: var(--radius-sm);">
            💡 AI ቀጥታ መልስ ብቻ አይሰጥም፤ እንዴት እንደሚፈታ ደረጃ በደረጃ ያስተምራል።
          </div>
          <button id="btn-solve-edu" class="btn btn-primary">
            <span>✨</span> <span>አብራራልኝ (Explain Step-by-Step)</span>
          </button>
        </div>
      </div>

      <!-- Solution Output Box -->
      <div id="edu-solution-card" class="card" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 14px;">
          <h3 style="font-size: 1.1rem; color: var(--primary);">የተማሪው የትምህርት መመሪያ እና ማብራሪያ</h3>
          <button id="btn-save-edu-note" class="btn btn-secondary btn-sm">
            <span>💾</span> <span>ማስታወሻውን አስቀምጥ</span>
          </button>
        </div>

        <div id="edu-solution-body" style="white-space: pre-wrap; line-height: 1.7; font-size: 0.95rem;"></div>
      </div>
    `;

    const solveBtn = document.getElementById('btn-solve-edu');
    solveBtn.addEventListener('click', async () => {
      const q = document.getElementById('edu-question-input').value.trim();
      const grade = document.getElementById('edu-grade').value;
      const sub = document.getElementById('edu-subject').value;
      const mode = document.getElementById('edu-mode').value;

      if (!q) {
        alert("እባክዎ ጥያቄዎን ወይም ርዕሱን ያስገቡ");
        return;
      }

      solveBtn.disabled = true;
      solveBtn.innerHTML = `<span class="spinner"></span> ማብራሪያ እየተዘጋጀ ነው...`;

      try {
        const prompt = `You are a certified Ethiopian school teacher helping a student in ${grade} with ${sub}. Mode: ${mode}.
The student asks: "${q}".
Crucial instructions: Follow the Ethiopian national education curriculum. Explain the solution step-by-step with clear logic, formulas, and explanations so the student learns how to solve it. Do not just output the final answer alone.`;

        const res = await window.EthioAPI.callAI('education-helper', prompt);
        document.getElementById('edu-solution-card').style.display = 'block';
        document.getElementById('edu-solution-body').textContent = res;
      } catch (e) {
        alert(e.message);
      } finally {
        solveBtn.disabled = false;
        solveBtn.innerHTML = `<span>✨</span> <span>አብራራልኝ (Explain Step-by-Step)</span>`;
      }
    });

    const saveNoteBtn = document.getElementById('btn-save-edu-note');
    if (saveNoteBtn) {
      saveNoteBtn.addEventListener('click', async () => {
        const text = document.getElementById('edu-solution-body').textContent;
        const q = document.getElementById('edu-question-input').value.slice(0, 30);
        await window.EthioFavorites.saveItem('document', {
          title: `Study Note: ${q}...`,
          content: text
        });
      });
    }
  }

  return {
    render: render
  };
})();
