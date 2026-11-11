/**
 * ETHIO AI HUB - EthioVerify
 * Transaction verification interface for Ethiopian Banks (CBE, Awash, Dashen), TeleBirr, and M-Pesa.
 * Critical security requirement: Never claims a transaction is genuine based solely on screenshot/AI.
 * Displays: "Verification pending. Official transaction confirmation is required."
 * Provides administrative review workflow.
 */

window.EthioTools_EthioVerify = (function() {

  function render(container) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    container.innerHTML = `
      <div class="tool-header-banner">
        <div class="tool-header-left">
          <div class="tool-header-icon" style="background-color: #e0f2fe; color: #0284c7;">
            🛡️
          </div>
          <div>
            <h2 style="font-size: 1.25rem;">${t('navEthioVerify')}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              የኢትዮጵያ ንግድ ባንክ (CBE)፣ የቴሌብር እና ኤም-ፔሳ የክፍያ ደረሰኞች ይፋዊ የማረጋገጫ ማጣሪያ
            </p>
          </div>
        </div>
      </div>

      <!-- Mandatory Verification Notice -->
      <div class="safety-warning-banner" style="background-color: #fef3c7; border-color: #f59e0b; color: #92400e;">
        <span style="font-size: 1.5rem;">⚠️</span>
        <div>
          <strong style="display: block; font-size: 0.95rem; margin-bottom: 2px;">አስፈላጊ የደህንነት ማረጋገጫ ደንብ:</strong>
          <p style="margin: 0; font-size: 0.85rem; line-height: 1.5;">
            "ማረጋገጫ በመጠባበቅ ላይ። ከባንክ ወይም ከቴሌብር ይፋዊ ማረጋገጫ ያስፈልጋል።"
            <br>
            <em>Never trust a screenshot alone. Actual verification requires authorized bank, TeleBirr, or M-Pesa API confirmation. AI image analysis cannot declare a payment 100% genuine.</em>
          </p>
        </div>
      </div>

      <div class="card" style="max-width: 700px; margin: 0 auto;">
        <h3 style="font-size: 1.15rem; margin-bottom: 14px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
          የክፍያ ደረሰኝ ማጣሪያ ቅጽ (Transaction Verification Submission)
        </h3>

        <form id="verify-tx-form">
          <div class="form-group">
            <label class="form-label">የክፍያ ተቋም (Financial Institution / Network)</label>
            <select id="ver-provider" required>
              <option value="telebirr">ቴሌብር (TeleBirr)</option>
              <option value="cbe">የኢትዮጵያ ንግድ ባንክ (Commercial Bank of Ethiopia - CBE)</option>
              <option value="mpesa">ሳፋሪኮም ኤም-ፔሳ (M-Pesa Safaricom)</option>
              <option value="awash">አዋሽ ባንክ (Awash Bank)</option>
              <option value="dashen">ዳሽን ባንክ (Dashen Bank / Amole)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">የደረሰኝ ወይም የትራንዛክሽን ቁጥር (Transaction Reference / ID)</label>
            <input type="text" id="ver-txid" required placeholder="ምሳሌ፡ FT24109XXXXX ወይም TB98327XXXX">
          </div>

          <div class="form-group">
            <label class="form-label">የተከፈለው የገንዘብ መጠን በብር (Amount in ETB)</label>
            <input type="number" id="ver-amount" required placeholder="0.00 ETB">
          </div>

          <div class="form-group">
            <label class="form-label">የደረሰኝ ስክሪንሾት ወይም ፎቶ (Payment Receipt Screenshot)</label>
            <input type="file" id="ver-file" accept="image/*">
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">
            <span>🛡️</span> <span>ደረሰኙን አረጋግጥ (Verify Transaction)</span>
          </button>
        </form>

        <div id="verify-result-box" class="verify-status-box" style="display: none;">
          <h4 style="font-size: 1.15rem; margin-bottom: 8px;">⏳ ${t('verifyPendingNotice')}</h4>
          <p style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 10px;">
            የተላከው የደረሰኝ ቁጥር <strong><span id="res-ver-txid"></span></strong> በስርዓቱ ውስጥ ተመዝግቧል።
            ህጋዊ የባንክ ወይም የቴሌብር ኤፒአይ (Official Direct API) ቀጥተኛ ማረጋገጫ እስኪያገኝ ድረስ ግብይቱ "በመጠባበቅ ላይ" ተብሎ ይቆጠራል።
          </p>
          <div style="font-size: 0.8rem; color: #78350f;">
            የጥቆማ መለያ፡ <code id="res-ver-ref"></code>
          </div>
        </div>
      </div>
    `;

    const form = document.getElementById('verify-tx-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const txid = document.getElementById('ver-txid').value.trim();
      const provider = document.getElementById('ver-provider').value;
      const amount = document.getElementById('ver-amount').value;

      if (!txid) {
        alert("እባክዎ የደረሰኝ ቁጥር ያስገቡ");
        return;
      }

      // Record to Firestore
      const db = window.EthioFirebase ? window.EthioFirebase.getDb() : null;
      const refCode = 'VER-' + Date.now().toString().slice(-6);

      if (db) {
        await db.collection('transactionVerifications').add({
          provider: provider,
          txid: txid,
          amount: amount,
          status: 'pending_official_confirmation',
          refCode: refCode,
          createdAt: new Date().toISOString()
        });
      }

      document.getElementById('res-ver-txid').textContent = txid;
      document.getElementById('res-ver-ref').textContent = refCode;
      document.getElementById('verify-result-box').style.display = 'block';
      document.getElementById('verify-result-box').scrollIntoView({ behavior: 'smooth' });
    });
  }

  return {
    render: render
  };
})();
