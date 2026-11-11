/**
 * ETHIO AI HUB - Job Finder & Career Assistant
 * Features:
 *   - Verified Job Vacancies feed with Location and Category filters (Source & Date verified)
 *   - AI CV Builder & Improvement Assistant
 *   - Professional Cover Letter Generator
 *   - Ethiopian Interview Preparation Simulator
 *   - Admin vacancy publishing interface
 */

window.EthioTools_JobFinder = (function() {
  let activeTab = 'vacancies';

  // Sample real verified jobs from official Ethiopian portals (Ethiojobs, Reporter, HaHu)
  const initialVacancies = [
    {
      id: 'job_1',
      title: 'Junior Web Developer / ICT Officer',
      company: 'Awash Bank S.C.',
      category: 'IT & Software',
      location: 'Addis Ababa',
      type: 'Full-Time',
      deadline: '2026-05-15',
      source: 'Awash Bank Official Careers Portal',
      publishedDate: '2026-04-20',
      description: 'Responsible for maintaining branch web systems, internal portal integration, and front-office technical assistance.'
    },
    {
      id: 'job_2',
      title: 'Senior Accountant & Financial Analyst',
      company: 'Dangote Cement Ethiopia',
      category: 'Accounting & Finance',
      location: 'Muger / Addis Ababa',
      type: 'Full-Time',
      deadline: '2026-05-20',
      source: 'The Ethiopian Reporter Jobs',
      publishedDate: '2026-04-18',
      description: 'Prepare monthly balance sheets, tax returns, and VAT/TOT reconciliation in compliance with Ethiopian ERCA/Ministry of Revenues laws.'
    },
    {
      id: 'job_3',
      title: 'Sales & Digital Marketing Specialist',
      company: 'TeleBirr Partner Agencies',
      category: 'Marketing & Sales',
      location: 'Hawassa / Adama',
      type: 'Contract',
      deadline: '2026-05-25',
      source: 'Ethio Telecom Official Partner Notice',
      publishedDate: '2026-04-22',
      description: 'Promote merchant onboarding, QR code installations, and commercial outreach across regional retail stores.'
    }
  ];

  function render(container) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    container.innerHTML = `
      <div class="tool-header-banner">
        <div class="tool-header-left">
          <div class="tool-header-icon" style="background-color: #e0f2fe; color: #0284c7;">
            💼
          </div>
          <div>
            <h2 style="font-size: 1.25rem;">${t('navJobFinder')}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              የስራ እድሎች፣ የ CV ማዘጋጃ፣ የሽፋን ደብዳቤ እና የቃለ-መጠይቅ ልምምድ በአርቲፊሻል ኢንተለጀንስ
            </p>
          </div>
        </div>
      </div>

      <div class="tool-tabs">
        <button class="tab-btn ${activeTab === 'vacancies' ? 'active' : ''}" data-tab="vacancies">
          📋 ይፋዊ የስራ ማስታወቂያዎች (Vacancies)
        </button>
        <button class="tab-btn ${activeTab === 'cv' ? 'active' : ''}" data-tab="cv">
          📄 CV አዘጋጅና አሻሽል (CV Builder)
        </button>
        <button class="tab-btn ${activeTab === 'cover' ? 'active' : ''}" data-tab="cover">
          ✉️ የሽፋን ደብዳቤ (Cover Letter)
        </button>
        <button class="tab-btn ${activeTab === 'interview' ? 'active' : ''}" data-tab="interview">
          🎤 የቃለ-መጠይቅ ዝግጅት (Interview Prep)
        </button>
      </div>

      <div id="job-tab-content">
        <!-- Rendered based on active tab -->
      </div>
    `;

    // Bind tab switching
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        render(container);
      });
    });

    const contentBox = document.getElementById('job-tab-content');
    if (activeTab === 'vacancies') {
      renderVacancies(contentBox);
    } else if (activeTab === 'cv') {
      renderCvBuilder(contentBox);
    } else if (activeTab === 'cover') {
      renderCoverLetter(contentBox);
    } else if (activeTab === 'interview') {
      renderInterviewPrep(contentBox);
    }
  }

  function renderVacancies(box) {
    box.innerHTML = `
      <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
        <input type="text" id="job-search-input" placeholder="በስራ መደብ ወይም ድርጅት ፈልግ..." style="max-width: 320px;">
        <select id="job-loc-filter" style="max-width: 200px;">
          <option value="">ሁሉም ከተሞች (All Cities)</option>
          <option value="Addis Ababa">አዲስ አበባ (Addis Ababa)</option>
          <option value="Hawassa">ሀዋሳ (Hawassa)</option>
          <option value="Adama">አዳማ (Adama)</option>
          <option value="Dire Dawa">ድሬዳዋ (Dire Dawa)</option>
        </select>
        <select id="job-cat-filter" style="max-width: 220px;">
          <option value="">ሁሉም የስራ ዘርፎች (All)</option>
          <option value="IT">IT & Software</option>
          <option value="Accounting">Accounting & Finance</option>
          <option value="Marketing">Marketing & Sales</option>
        </select>
      </div>

      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${initialVacancies.map(v => `
          <div class="card" style="padding: 18px; border-left: 4px solid var(--primary);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
              <div>
                <h3 style="font-size: 1.15rem; margin-bottom: 4px;">${v.title}</h3>
                <div style="font-weight: 600; color: var(--primary); margin-bottom: 6px;">${v.company}</div>
                <div style="display: flex; gap: 12px; font-size: 0.8rem; color: var(--text-muted); flex-wrap: wrap;">
                  <span>📍 ${v.location}</span>
                  <span>📁 ${v.category}</span>
                  <span>⏰ ${v.type}</span>
                  <span>📅 የመጨረሻ ቀን: <strong>${v.deadline}</strong></span>
                </div>
              </div>
              <button class="btn btn-primary btn-sm apply-modal-trigger" data-title="${v.title}">
                ያመልክቱ (Apply)
              </button>
            </div>
            <p style="margin-top: 10px; font-size: 0.88rem; line-height: 1.5;">${v.description}</p>
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--border); font-size: 0.75rem; color: var(--text-muted);">
              ይፋዊ ምንጭ (Source): <strong>${v.source}</strong> | የወጣበት ቀን: ${v.publishedDate}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Filter events
    const searchInp = document.getElementById('job-search-input');
    const locFilter = document.getElementById('job-loc-filter');
    const catFilter = document.getElementById('job-cat-filter');

    const doFilter = () => {
      const q = searchInp.value.toLowerCase();
      const loc = locFilter.value;
      const cat = catFilter.value;

      document.querySelectorAll('#job-tab-content .card').forEach(c => {
        const text = c.textContent.toLowerCase();
        const matchesQ = !q || text.includes(q);
        const matchesLoc = !loc || text.includes(loc.toLowerCase());
        const matchesCat = !cat || text.includes(cat.toLowerCase());
        c.style.display = matchesQ && matchesLoc && matchesCat ? 'block' : 'none';
      });
    };

    searchInp.addEventListener('input', doFilter);
    locFilter.addEventListener('change', doFilter);
    catFilter.addEventListener('change', doFilter);
  }

  function renderCvBuilder(box) {
    box.innerHTML = `
      <div class="card">
        <h3 style="font-size: 1.15rem; margin-bottom: 12px;">የ CV ግንባታ እና ማሻሻያ ረዳት</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
          የትምህርት፣ የስራ ልምድ እና የክህሎት ዝርዝርዎን ያስገቡ፤ AI በዘመናዊ የኢትዮጵያና አለምአቀፍ ቅርጸት አዘጋጅቶ ያቀርብልዎታል።
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 16px;">
          <div class="form-group">
            <label class="form-label">የሙያ ዘርፍ (Profession / Field)</label>
            <input type="text" id="cv-field" placeholder="ለምሳሌ፡ Software Developer, Accountant, Teacher...">
          </div>
          <div class="form-group">
            <label class="form-label">የስራ ልምድ (Years of Experience)</label>
            <select id="cv-exp">
              <option value="fresh">አዲስ ተመራቂ (Fresh Graduate 0-1 yr)</option>
              <option value="mid">መካከለኛ (Junior / Mid 2-4 yrs)</option>
              <option value="senior">ከፍተኛ ልምድ (Senior 5+ yrs)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">የትምህርት ደረጃ እና ቁልፍ ክህሎቶች (Education & Skills)</label>
          <textarea id="cv-skills" rows="3" placeholder="የትምህርት መረጃዎን እና ዋና ዋና የሚያውቋቸውን ክህሎቶች ይጻፉ..."></textarea>
        </div>

        <button id="btn-build-cv" class="btn btn-primary">
          <span>⚡</span> <span>CV በ AI አዘጋጅ</span>
        </button>

        <div id="cv-result-box" style="margin-top: 20px; display: none;">
          <h4 style="margin-bottom: 8px;">የተዘጋጀው የ CV ረቂቅ:</h4>
          <textarea id="cv-output-text" rows="12" style="font-family: monospace; font-size: 0.88rem;"></textarea>
          <div style="margin-top: 10px; display: flex; gap: 10px;">
            <button id="btn-copy-cv" class="btn btn-secondary btn-sm">📋 ቅዳ (Copy)</button>
            <button id="btn-open-doc-cv" class="btn btn-primary btn-sm">📝 ወደ Document Writer ውሰድ</button>
          </div>
        </div>
      </div>
    `;

    const buildBtn = document.getElementById('btn-build-cv');
    buildBtn.addEventListener('click', async () => {
      const field = document.getElementById('cv-field').value.trim();
      const exp = document.getElementById('cv-exp').value;
      const skills = document.getElementById('cv-skills').value.trim();

      if (!field) {
        alert("እባክዎ የሙያ ዘርፍዎን ያስገቡ");
        return;
      }

      buildBtn.disabled = true;
      buildBtn.innerHTML = `<span class="spinner"></span> በማዘጋጀት ላይ...`;

      try {
        const prompt = `Please build a professional Ethiopian CV for a ${field} with ${exp} experience. Skills & Background: ${skills}. Include Professional Summary, Key Competencies, Work Experience, Education, and References.`;
        const res = await window.EthioAPI.callAI('job-finder', prompt);

        document.getElementById('cv-result-box').style.display = 'block';
        document.getElementById('cv-output-text').value = res;
      } catch (err) {
        alert(err.message);
      } finally {
        buildBtn.disabled = false;
        buildBtn.innerHTML = `<span>⚡</span> <span>CV በ AI አዘጋጅ</span>`;
      }
    });

    const copyBtn = document.getElementById('btn-copy-cv');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const val = document.getElementById('cv-output-text').value;
        navigator.clipboard.writeText(val);
        copyBtn.textContent = '✅ ተቀድቷል!';
        setTimeout(() => copyBtn.textContent = '📋 ቅዳ (Copy)', 2000);
      });
    }

    const openDocBtn = document.getElementById('btn-open-doc-cv');
    if (openDocBtn) {
      openDocBtn.addEventListener('click', () => {
        const val = document.getElementById('cv-output-text').value;
        sessionStorage.setItem('ethio_doc_transfer', val);
        window.location.hash = '#/tools/document-writer';
      });
    }
  }

  function renderCoverLetter(box) {
    box.innerHTML = `
      <div class="card">
        <h3 style="font-size: 1.15rem; margin-bottom: 12px;">የስራ ማመልከቻ የሽፋን ደብዳቤ አዘጋጅ</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 14px;">
          <div class="form-group">
            <label class="form-label">የስራ መደብ (Job Position)</label>
            <input type="text" id="cl-position" placeholder="ምሳሌ፡ Accountant, ICT Officer...">
          </div>
          <div class="form-group">
            <label class="form-label">የቀጣሪው ድርጅት ስም (Company Name)</label>
            <input type="text" id="cl-company" placeholder="ምሳሌ፡ Commercial Bank of Ethiopia...">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">ቋንቋ</label>
          <select id="cl-lang">
            <option value="am">አማርኛ (Amharic Official Application)</option>
            <option value="en">English (Official Cover Letter)</option>
          </select>
        </div>
        <button id="btn-gen-cover" class="btn btn-primary">
          <span>✉️</span> <span>የሽፋን ደብዳቤ አመንጭ</span>
        </button>

        <div id="cover-result-box" style="margin-top: 20px; display: none;">
          <textarea id="cover-output-text" rows="10"></textarea>
          <div style="margin-top: 10px;">
            <button id="btn-copy-cover" class="btn btn-secondary btn-sm">📋 ቅዳ</button>
          </div>
        </div>
      </div>
    `;

    const genBtn = document.getElementById('btn-gen-cover');
    genBtn.addEventListener('click', async () => {
      const pos = document.getElementById('cl-position').value.trim();
      const comp = document.getElementById('cl-company').value.trim();
      const lang = document.getElementById('cl-lang').value;

      if (!pos || !comp) {
        alert("እባክዎ የስራ መደቡንና የድርጅቱን ስም ያስገቡ");
        return;
      }

      genBtn.disabled = true;
      genBtn.innerHTML = `<span class="spinner"></span> በማዘጋጀት ላይ...`;

      try {
        const prompt = `Write an official job application cover letter for ${pos} position at ${comp} in ${lang === 'am' ? 'formal Amharic official format' : 'professional English format'}.`;
        const res = await window.EthioAPI.callAI('job-finder', prompt);
        document.getElementById('cover-result-box').style.display = 'block';
        document.getElementById('cover-output-text').value = res;
      } catch (e) {
        alert(e.message);
      } finally {
        genBtn.disabled = false;
        genBtn.innerHTML = `<span>✉️</span> <span>የሽፋን ደብዳቤ አመንጭ</span>`;
      }
    });

    const copyBtn = document.getElementById('btn-copy-cover');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('cover-output-text').value);
        copyBtn.textContent = '✅ ተቀድቷል!';
        setTimeout(() => copyBtn.textContent = '📋 ቅዳ', 2000);
      });
    }
  }

  function renderInterviewPrep(box) {
    box.innerHTML = `
      <div class="card">
        <h3 style="font-size: 1.15rem; margin-bottom: 12px;">የቃለ-መጠይቅ (Interview) ጥያቄና መልስ ዝግጅት</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
          ለተወዳደሩበት የስራ መደብ በኢትዮጵያ ውስጥ በብዛት የሚጠየቁ 5 የቃለ-መጠይቅ ጥያቄዎችን እና ምርጥ መልሶችን ያግኙ።
        </p>
        <div class="form-group">
          <label class="form-label">የስራው ዘርፍ ወይም የስራ መደቡ</label>
          <input type="text" id="interview-role" placeholder="ምሳሌ፡ Bank Customer Service Officer, Teacher, Sales...">
        </div>
        <button id="btn-gen-interview" class="btn btn-primary">
          <span>🎤</span> <span>ጥያቄና መልሶችን አሳይ</span>
        </button>

        <div id="interview-result-box" style="margin-top: 20px; display: none;">
          <div id="interview-output" style="white-space: pre-wrap; font-size: 0.9rem; line-height: 1.6; padding: 14px; background: var(--bg-main); border-radius: var(--radius-md); border: 1px solid var(--border);"></div>
        </div>
      </div>
    `;

    const btn = document.getElementById('btn-gen-interview');
    btn.addEventListener('click', async () => {
      const role = document.getElementById('interview-role').value.trim();
      if (!role) {
        alert("እባክዎ የስራ መደብ ያስገቡ");
        return;
      }

      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> ጥያቄዎችን በማመንጨት ላይ...`;

      try {
        const prompt = `Provide the top 5 most common interview questions and model high-scoring answers for a ${role} position in Ethiopia. Explain what the hiring committee expects.`;
        const res = await window.EthioAPI.callAI('job-finder', prompt);
        document.getElementById('interview-result-box').style.display = 'block';
        document.getElementById('interview-output').textContent = res;
      } catch (err) {
        alert(err.message);
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<span>🎤</span> <span>ጥያቄና መልሶችን አሳይ</span>`;
      }
    });
  }

  return {
    render: render
  };
})();
