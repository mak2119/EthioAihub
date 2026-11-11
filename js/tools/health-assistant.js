/**
 * ETHIO AI HUB - Health Assistant AI
 * Educational health information, preventive wellness, and symptom awareness.
 * Strictly educational: does not diagnose, does not prescribe medication.
 * Instant emergency recognition banner with Ethiopian emergency hotlines (907 / 911 / 939).
 */

window.EthioTools_HealthAssistant = (function() {
  const emergencyKeywords = ['chest pain', 'heart attack', 'stroke', 'unconscious', 'severe bleeding', 'breathing difficulty', 'መርዝ', 'ደም መፍሰስ', 'የልብ ህመም', 'መተንፈስ አቃተኝ', 'ራሴን ሳትኩ'];

  function render(container) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    container.innerHTML = `
      <div class="tool-header-banner">
        <div class="tool-header-left">
          <div class="tool-header-icon" style="background-color: #fee2e2; color: #dc2626;">
            🩺
          </div>
          <div>
            <h2 style="font-size: 1.25rem;">${t('navHealthAssistant')}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              አጠቃላይ የጤና፣ የበሽታ መከላከል እና የህመም ምልክቶች ትምህርታዊ ረዳት
            </p>
          </div>
        </div>
      </div>

      <!-- Prominent Mandatory Health Disclaimer -->
      <div class="safety-warning-banner" style="background-color: #eff6ff; border-color: #93c5fd; color: #1e40af;">
        <span style="font-size: 1.5rem;">ℹ️</span>
        <div>
          <strong style="display: block; font-size: 0.95rem; margin-bottom: 2px;">አስፈላጊ የህክምና ማሳሰቢያ (Educational Medical Notice):</strong>
          <p style="margin: 0; font-size: 0.85rem; line-height: 1.5;">
            "በ አርቲፊሻል ኢንተለጀንስ የሚመነጭ የጤና መረጃ ለትምህርት ብቻ የሚያገለግል ሲሆን የህክምና ባለሙያ ምክርን አይተካም።"
            <br>
            <em>AI-generated health information is educational and does not replace professional medical advice. AI does not diagnose illnesses or prescribe medicines.</em>
          </p>
        </div>
      </div>

      <!-- Emergency Hotline Card -->
      <div class="emergency-banner">
        <div>
          <strong style="display: block; font-size: 1rem; color: #991b1b;">የአደጋ ጊዜ ፈጣን ስልኮች (Emergency Hotlines):</strong>
          <span style="font-size: 0.8rem; color: #7f1d1d;">ድንገተኛ አደጋ፣ ከፍተኛ የደረት ህመም ወይም ራስን መሳት ሲያጋጥም ወዲያውኑ ይደውሉ፡</span>
        </div>
        <div class="emergency-numbers">
          <span class="emergency-pill" title="Ambulance Service">🚑 907 አምቡላንስ</span>
          <span class="emergency-pill" title="Red Cross Ambulance">🏥 939 ቀይ መስቀል</span>
          <span class="emergency-pill" title="General Emergency">🚨 911 ፖሊስ</span>
        </div>
      </div>

      <!-- Q&A Form -->
      <div class="card" style="margin-bottom: 20px;">
        <h3 style="font-size: 1.1rem; margin-bottom: 10px;">ስለ ጤና ሁኔታ ወይም ስለ ህመም ምልክቶች ይጠይቁ</h3>
        
        <div class="form-group">
          <textarea id="health-q-input" rows="3" placeholder="ስለተሰማዎት ምልክት፣ ስለ ምግብ አመጋገብ፣ ወይም መቼ ዶክተር ጋር መሄድ እንዳለብዎት እዚህ ይጠይቁ..."></textarea>
        </div>

        <button id="btn-ask-health" class="btn btn-primary">
          <span>🩺</span> <span>ትምህርታዊ ምክር አግኝ</span>
        </button>
      </div>

      <!-- Result Card -->
      <div id="health-result-card" class="card" style="display: none;">
        <div id="health-emergency-trigger" style="display: none; padding: 12px; background: #fee2e2; border-left: 4px solid #b91c1c; border-radius: var(--radius-sm); margin-bottom: 14px; color: #991b1b; font-weight: 700;">
          ⚠️ የአደጋ ጊዜ ምልክት ተለይቷል! እባክዎ በአስቸኳይ በአቅራቢያዎ ወደሚገኝ የጤና ተቋም ይሂዱ ወይም 907 ይደውሉ።
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 12px;">
          <h3 style="font-size: 1.1rem; color: var(--primary);">ትምህርታዊ የጤና ማብራሪያ</h3>
          <button id="btn-copy-health" class="btn btn-secondary btn-sm">📋 ቅዳ</button>
        </div>

        <div id="health-result-body" style="white-space: pre-wrap; line-height: 1.7; font-size: 0.92rem;"></div>
        
        <div class="legal-notice">
          "ይህ መረጃ የህክምና ባለሙያን አይተካም። ማንኛውንም መድሃኒት ከመውሰድዎ በፊት ዶክተር ወይም ፋርማሲስት ያማክሩ።"
        </div>
      </div>
    `;

    const askBtn = document.getElementById('btn-ask-health');
    askBtn.addEventListener('click', async () => {
      const q = document.getElementById('health-q-input').value.trim();
      if (!q) {
        alert("እባክዎ ጥያቄዎን ያስገቡ");
        return;
      }

      // Check emergency keywords
      const isEmergency = emergencyKeywords.some(kw => q.toLowerCase().includes(kw));
      const trig = document.getElementById('health-emergency-trigger');
      if (trig) {
        trig.style.display = isEmergency ? 'block' : 'none';
      }

      askBtn.disabled = true;
      askBtn.innerHTML = `<span class="spinner"></span> በማዘጋጀት ላይ...`;

      try {
        const prompt = `You are an educational Ethiopian Health Assistant AI. Crucial constraint: You are strictly educational. Do NOT diagnose the user with specific diseases. Do NOT prescribe medications.
User asked: "${q}".
Provide general educational overview of these symptoms, common causes, home hydration/rest advice, preventive tips, and clear warning signs of when to visit an Ethiopian clinic or emergency doctor immediately. Always include the disclaimer: "በ AI የሚመነጭ የጤና መረጃ ለትምህርት ብቻ የሚያገለግል ሲሆን የህክምና ባለሙያ ምክርን አይተካም።"`;

        const res = await window.EthioAPI.callAI('health-assistant', prompt);
        document.getElementById('health-result-card').style.display = 'block';
        document.getElementById('health-result-body').textContent = res;
      } catch (err) {
        alert(err.message);
      } finally {
        askBtn.disabled = false;
        askBtn.innerHTML = `<span>🩺</span> <span>ትምህርታዊ ምክር አግኝ</span>`;
      }
    });

    const copyBtn = document.getElementById('btn-copy-health');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('health-result-body').textContent);
        copyBtn.textContent = '✅ ተቀድቷል!';
        setTimeout(() => copyBtn.textContent = '📋 ቅዳ', 2000);
      });
    }
  }

  return {
    render: render
  };
})();
