/**
 * ETHIO AI HUB - Business Helper
 * Designed for Ethiopian entrepreneurs, traders, startups, and SMEs.
 * Default currency: Ethiopian Birr (ETB). Includes P&L calculator and tax guidelines (VAT 15%, TOT 2%).
 */

window.EthioTools_BusinessHelper = (function() {

  function render(container) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    container.innerHTML = `
      <div class="tool-header-banner">
        <div class="tool-header-left">
          <div class="tool-header-icon" style="background-color: #dbeafe; color: #2563eb;">
            📈
          </div>
          <div>
            <h2 style="font-size: 1.25rem;">${t('navBusinessHelper')}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              የቢዝነስ ፕላን፣ የገበያ ስትራቴጂ፣ የትርፍና ኪሳራ ስሌት እና የታክስ መመሪያ በኢትዮጵያ ብር (ETB)
            </p>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
        
        <!-- AI Business Strategy Generator -->
        <div class="card">
          <h3 style="font-size: 1.1rem; margin-bottom: 14px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
            የንግድ ስትራቴጂና ፕላን አዘጋጅ
          </h3>

          <div class="form-group">
            <label class="form-label">የቢዝነስ ዘርፍ ወይም የስራ ሀሳብ</label>
            <input type="text" id="biz-idea" placeholder="ምሳሌ፡ የቡና መሸጫ ካፌ በአዲስ አበባ፣ የዶሮ እርባታ፣ የኦንላይን ልብስ መደብር...">
          </div>

          <div class="form-group">
            <label class="form-label">የመነሻ ካፒታል ግምት (በኢትዮጵያ ብር)</label>
            <input type="number" id="biz-capital" placeholder="ምሳሌ፡ 200000 ETB">
          </div>

          <div class="form-group">
            <label class="form-label">የሚፈልጉት እገዛ</label>
            <select id="biz-type">
              <option value="plan">ሙሉ የቢዝነስ ፕላን (Executive Business Plan)</option>
              <option value="marketing">የማህበራዊ ሚዲያና የቴሌግራም ግብይት ስትራቴጂ (Marketing Strategy)</option>
              <option value="naming">የንግድ ስሞች እና የብራንድ ሀሳቦች (Business Name Ideas)</option>
              <option value="customer-service">የደንበኞች አገልግሎት መልሶች (Customer Service Templates)</option>
            </select>
          </div>

          <button id="btn-run-biz" class="btn btn-primary" style="width: 100%;">
            <span>⚡</span> <span>የንግድ እቅድ አመንጭ</span>
          </button>
        </div>

        <!-- Ethiopian P&L and Tax Calculator -->
        <div class="card">
          <h3 style="font-size: 1.1rem; margin-bottom: 14px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
            የትርፍና ኪሳራ ፈጣን ስሌት (ETB & Tax)
          </h3>

          <div class="form-group">
            <label class="form-label">የወር ጠቅላላ ገቢ (Gross Sales Revenue)</label>
            <input type="number" id="calc-sales" placeholder="0 ETB">
          </div>

          <div class="form-group">
            <label class="form-label">የእቃዎች ወይም አገልግሎት ወጪ (Cost of Goods Sold)</label>
            <input type="number" id="calc-cogs" placeholder="0 ETB">
          </div>

          <div class="form-group">
            <label class="form-label">የስራ ማስኬጃ ወጪ (ቤት ኪራይ፣ ደመወዝ፣ መብራት ወዘተ)</label>
            <input type="number" id="calc-opex" placeholder="0 ETB">
          </div>

          <div class="form-group">
            <label class="form-label">የታክስ አይነት (Tax Classification)</label>
            <select id="calc-tax-type">
              <option value="vat">ተጨማሪ እሴት ታክስ - VAT 15%</option>
              <option value="tot">የተርን ኦቨር ታክስ - TOT 2% (ዕቃዎች) / 10% (አገልግሎት)</option>
              <option value="none">ያለ ታክስ ስሌት (Direct Estimate)</option>
            </select>
          </div>

          <button id="btn-calc-pnl" class="btn btn-secondary" style="width: 100%;">
            <span>🧮</span> <span>ትርፍ አስላ</span>
          </button>

          <div id="pnl-results" style="margin-top: 14px; padding: 12px; background: var(--bg-main); border-radius: var(--radius-md); font-size: 0.88rem; display: none;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>ጥቅል ትርፍ (Gross Profit):</span>
              <strong id="res-gross">0 ETB</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>የተገመተ ታክስ (Estimated Tax):</span>
              <strong id="res-tax">0 ETB</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 6px; color: var(--primary);">
              <span>የተጣራ ትርፍ (Net Profit):</span>
              <strong id="res-net" style="font-size: 1.05rem;">0 ETB</strong>
            </div>
          </div>
        </div>

      </div>

      <!-- Business Strategy Output -->
      <div id="biz-output-card" class="card" style="margin-top: 20px; display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 12px;">
          <h3 style="font-size: 1.1rem; color: var(--primary);">የተዘጋጀ የቢዝነስ እቅድ እና የገበያ መረጃ</h3>
          <button id="btn-copy-biz" class="btn btn-secondary btn-sm">📋 ቅዳ</button>
        </div>
        <div id="biz-output-body" style="white-space: pre-wrap; line-height: 1.7; font-size: 0.95rem;"></div>
      </div>
    `;

    // Strategy AI
    const runBtn = document.getElementById('btn-run-biz');
    runBtn.addEventListener('click', async () => {
      const idea = document.getElementById('biz-idea').value.trim();
      const cap = document.getElementById('biz-capital').value.trim();
      const type = document.getElementById('biz-type').value;

      if (!idea) {
        alert("እባክዎ የቢዝነስ ሀሳብዎን ያስገቡ");
        return;
      }

      runBtn.disabled = true;
      runBtn.innerHTML = `<span class="spinner"></span> በማዘጋጀት ላይ...`;

      try {
        const prompt = `As an Ethiopian business consultant, generate a comprehensive ${type} in Amharic for this venture: "${idea}" with an estimated capital of ${cap || 'undisclosed'} ETB. Detail Ethiopian market dynamics, consumer behavior, revenue models, licensing steps, and Telegram/TikTok digital marketing tactics.`;

        const res = await window.EthioAPI.callAI('business-helper', prompt);
        document.getElementById('biz-output-card').style.display = 'block';
        document.getElementById('biz-output-body').textContent = res;
      } catch (err) {
        alert(err.message);
      } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = `<span>⚡</span> <span>የንግድ እቅድ አመንጭ</span>`;
      }
    });

    // PNL Calculator
    const calcBtn = document.getElementById('btn-calc-pnl');
    calcBtn.addEventListener('click', () => {
      const sales = parseFloat(document.getElementById('calc-sales').value) || 0;
      const cogs = parseFloat(document.getElementById('calc-cogs').value) || 0;
      const opex = parseFloat(document.getElementById('calc-opex').value) || 0;
      const taxType = document.getElementById('calc-tax-type').value;

      const gross = sales - cogs;
      let tax = 0;
      if (taxType === 'vat') {
        tax = sales * 0.15;
      } else if (taxType === 'tot') {
        tax = sales * 0.02;
      }

      const net = gross - opex - tax;

      document.getElementById('res-gross').textContent = `${gross.toLocaleString()} ETB`;
      document.getElementById('res-tax').textContent = `${tax.toLocaleString()} ETB`;
      document.getElementById('res-net').textContent = `${net.toLocaleString()} ETB`;
      document.getElementById('pnl-results').style.display = 'block';
    });

    const copyBtn = document.getElementById('btn-copy-biz');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('biz-output-body').textContent);
        copyBtn.textContent = '✅ ተቀድቷል!';
        setTimeout(() => copyBtn.textContent = '📋 ቅዳ', 2000);
      });
    }
  }

  return {
    render: render
  };
})();
