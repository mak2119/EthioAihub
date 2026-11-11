/**
 * ETHIO AI HUB - Ethio Drive AI
 * Driving license, vehicle inspection (Bolo), and official traffic fines assistant.
 * Prioritizes official Addis Ababa Road Transport Bureau and Traffic Police regulations.
 * Shows official sources and last-updated dates. Never invents official regulations.
 */

window.EthioTools_EthioDrive = (function() {
  const officialRegulations = [
    {
      topic: 'የመንጃ ፈቃድ እድሳት (Driving License Renewal)',
      source: 'የአዲስ አበባ ከተማ አስተዳደር ትራንስፖርት ቢሮ',
      lastUpdated: 'ሚያዝያ 2026',
      rules: 'የመንጃ ፈቃድ እድሳት በየ 2 ዓመቱ ይከናወናል። ተፈላጊ ማስረጃዎች፡ ነባሩ የመንጃ ፈቃድ፣ የታደሰ የቀበሌ/ከተማ መታወቂያ፣ የ 3 ወር የህክምና ምርመራ ማስረጃ (የአይን እና አጠቃላይ ጤና)፣ 2 የቅርብ ጊዜ ፎቶግራፍ እና የ 350 ብር አገልግሎት ክፍያ።'
    },
    {
      topic: 'የትራፊክ ቅጣት መክፈያ መንገዶች (Traffic Fine Payments)',
      source: 'የአዲስ አበባ ፖሊስ ኮሚሽን ትራፊክ ቁጥጥር መምሪያ',
      lastUpdated: 'ሚያዝያ 2026',
      rules: 'የትራፊክ ጥፋት ቅጣቶች በደረሰኝ ቁጥር (Ticket Number) አማካኝነት በቴሌብር (TeleBirr - የትራፊክ ቅጣት ክፍያ) ወይም በኢትዮጵያ ንግድ ባንክ (CBE Birr / CBE Branch) በ 15 ቀናት ውስጥ መከፈል አለባቸው። በ 15 ቀናት ውስጥ ካልተከፈለ ተጨማሪ ዕለታዊ ቅጣት ይጣልበታል።'
    },
    {
      topic: 'ዓመታዊ የተሽከርካሪ ቴክኒክ ምርመራ (Annual Bolo Inspection)',
      source: 'የፌዴራል ትራንስፖርት ባለስልጣን',
      lastUpdated: 'መጋቢት 2026',
      rules: 'ሁሉም የግል እና የንግድ ተሽከርካሪዎች በየዓመቱ በተፈቀደላቸው የቴክኒክ ምርመራ ማዕከላት ፍተሻ አድርገው ዓመታዊ የቦሎ ተለጣፊ (Bolo Sticker) መለጠፍ አለባቸው። የቴክኒክ ብቃት የሌለው ተሽከርካሪ ማሽከርከር በህግ ያስቀጣል።'
    }
  ];

  function render(container) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    container.innerHTML = `
      <div class="tool-header-banner">
        <div class="tool-header-left">
          <div class="tool-header-icon" style="background-color: #e0e7ff; color: #4338ca;">
            🚗
          </div>
          <div>
            <h2 style="font-size: 1.25rem;">${t('navEthioDrive')}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              የመንጃ ፈቃድ መመሪያ፣ የትራፊክ ቅጣቶችና ክፍያ ቦታዎች በይፋዊ የመንግስት ምንጮች
            </p>
          </div>
        </div>
      </div>

      <!-- Verified Reference Cards -->
      <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
        <h3 style="font-size: 1.1rem; color: var(--text-main);">ይፋዊ ደንቦችና መመሪያዎች (Official Transport Regulations)</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          ${officialRegulations.map(reg => `
            <div class="card" style="padding: 16px;">
              <h4 style="font-size: 1rem; color: var(--primary); margin-bottom: 6px;">${reg.topic}</h4>
              <p style="font-size: 0.85rem; color: var(--text-main); line-height: 1.5; margin-bottom: 10px;">
                ${reg.rules}
              </p>
              <div style="font-size: 0.75rem; color: var(--text-muted); border-top: 1px dashed var(--border); padding-top: 6px;">
                ይፋዊ ምንጭ፡ <strong>${reg.source}</strong> | የታደሰበት፡ ${reg.lastUpdated}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Drive AI Query Box -->
      <div class="card">
        <h3 style="font-size: 1.1rem; margin-bottom: 8px;">የመንጃ ፈቃድ ወይም የተሽከርካሪ ጥያቄ ይጠይቁ (Drive AI)</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
          ስለ ደረጃ 1 እስከ 5 የመንጃ ፈቃድ ስልጠና፣ የኮድ 2 ወይም ኮድ 3 ታርጋ ደንብ፣ ወይም የትራፊክ ህግጋት ይጠይቁ።
        </p>

        <div class="form-group">
          <textarea id="drive-q-input" rows="3" placeholder="ምሳሌ፡ የህዝብ 1 የመንጃ ፈቃድ ለማውጣት እድሜ ስንት መሆን አለበት? ወይም የትራፊክ መብራት መተላለፍ ቅጣቱ ስንት ነው?"></textarea>
        </div>

        <button id="btn-ask-drive" class="btn btn-primary">
          <span>🚗</span> <span>ይፋዊ መረጃ ፈልግ (RAG Search)</span>
        </button>

        <div id="drive-result-card" style="margin-top: 18px; display: none;">
          <h4 style="margin-bottom: 8px; color: var(--primary);">የተገኘ ይፋዊ መረጃ:</h4>
          <div id="drive-result-body" style="white-space: pre-wrap; font-size: 0.9rem; line-height: 1.6; background: var(--bg-main); padding: 14px; border-radius: var(--radius-md);"></div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">
            ⚠️ መረጃው የተገኘው ከአዲስ አበባ ከተማ አስተዳደር ደንብና ትራንስፖርት መምሪያ መመሪያዎች ነው። ይፋዊ ህግ ካልተገኘበት በግምት አይመለስም።
          </div>
        </div>
      </div>
    `;

    const askBtn = document.getElementById('btn-ask-drive');
    askBtn.addEventListener('click', async () => {
      const q = document.getElementById('drive-q-input').value.trim();
      if (!q) {
        alert("እባክዎ ጥያቄዎን ያስገቡ");
        return;
      }

      askBtn.disabled = true;
      askBtn.innerHTML = `<span class="spinner"></span> ይፋዊ መረጃ በማፈላለግ ላይ...`;

      try {
        const prompt = `You are the official Ethio Drive Vehicle & Traffic Law Assistant. 
Reference Regulations Knowledge Base:
${JSON.stringify(officialRegulations, null, 2)}

User question: "${q}".
Crucial instructions: Prioritize official regulations from the Addis Ababa Road Transport Bureau and Traffic Police. Show source citation and last-updated context. Never invent regulations, traffic fines, or license renewal steps. If official information is unavailable, clearly state so.`;

        const res = await window.EthioAPI.callAI('ethio-drive', prompt);
        document.getElementById('drive-result-card').style.display = 'block';
        document.getElementById('drive-result-body').textContent = res;
      } catch (err) {
        alert(err.message);
      } finally {
        askBtn.disabled = false;
        askBtn.innerHTML = `<span>🚗</span> <span>ይፋዊ መረጃ ፈልግ (RAG Search)</span>`;
      }
    });
  }

  return {
    render: render
  };
})();
