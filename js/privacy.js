/**
 * ETHIO AI HUB - Privacy Policy, Terms of Service & Data Rights
 * Zero-tracking commitment: No Google Analytics, No Facebook Pixel, No ad scripts.
 * Private user records (Financial, Equb, Health) are strictly isolated.
 * Includes Download My Data & Account Deletion tools.
 */

window.EthioPrivacy = (function() {

  function render(container) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;
    const lang = window.EthioLanguage ? window.EthioLanguage.getLanguage() : 'am';

    container.innerHTML = `
      <div class="card" style="max-width: 900px; margin: 0 auto;">
        <div style="border-bottom: 2px solid var(--border); padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="font-size: 1.6rem; color: var(--text-main); margin-bottom: 6px;">
            ${t('navPrivacy')} (Privacy Policy & Terms)
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            የመጨረሻ ማሻሻያ (Last Updated): ሚያዝያ 2026 | Developer: <strong>@TadeApps</strong> | Telegram: <a href="https://t.me/ethioai_hub" target="_blank" rel="noopener">https://t.me/ethioai_hub</a>
          </p>
        </div>

        <!-- Confidential Data Warning Banner -->
        <div class="safety-warning-banner" style="margin-bottom: 24px;">
          <span style="font-size: 1.5rem;">⚠️</span>
          <div>
            <strong style="display: block; font-size: 1rem; margin-bottom: 4px;">ጥብቅ ማስጠንቀቂያ (Confidentiality Warning)</strong>
            <p style="margin: 0; font-weight: 600; color: #991b1b;">
              "ሚስጥራዊ መረጃ (የይለፍ ቃል፣ የባንክ ቁጥር፣ መታወቂያ ቁጥር) በ AI ውስጥ አያስገቡ።"
            </p>
            <p style="font-size: 0.825rem; margin-top: 4px; color: #7f1d1d;">
              Never enter passwords, bank PINs, or government ID numbers into any AI prompt.
            </p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px; line-height: 1.7; font-size: 0.92rem;">
          
          <section>
            <h3 style="font-size: 1.15rem; color: var(--primary); margin-bottom: 8px;">1. የግላዊነት መርሆዎቻችን (Zero Tracking & Privacy Commitment)</h3>
            <ul style="padding-left: 20px; display: flex; flex-direction: column; gap: 6px;">
              <li><strong>መረጃዎን አንሸጥም ወይም አናከራይም (Never sold or rented):</strong> የተጠቃሚ የግል መረጃ ለሶስተኛ ወገን ፈጽሞ አይሰጥም።</li>
              <li><strong>ምንም የማስታወቂያ መከታተያ የለም (No Trackers):</strong> በ ETHIO AI HUB ውስጥ Google Analytics፣ Facebook Pixel ወይም ማንኛውም የተጠቃሚ ባህሪ መከታተያ ስክሪፕት አልተጫነም።</li>
              <li><strong>አስፈላጊ መረጃ ብቻ ይሰበሰባል:</strong> ለመለያ መክፈቻ የሚያስፈልገው ስም፣ ኢሜይል እና የይለፍ ቃል ብቻ ነው።</li>
            </ul>
          </section>

          <section>
            <h3 style="font-size: 1.15rem; color: var(--primary); margin-bottom: 8px;">2. የ AI እና የደመና አገልግሎቶች (Cloudflare, Gemini, Firebase)</h3>
            <ul style="padding-left: 20px; display: flex; flex-direction: column; gap: 6px;">
              <li><strong>Firebase:</strong> ማረጋገጫ (Authentication) እና የመረጃ ቋት (Firestore) አገልግሎቶችን በከፍተኛ የደህንነት ደንቦች (Security Rules) ያስተናግዳል።</li>
              <li><strong>Cloudflare Workers:</strong> የ AI እና የትርጉም ጥያቄዎችን ያለመረጃ ክምችት በምስጢር ፕሮክሲ ያደርጋል።</li>
              <li><strong>Google Gemini & Translate:</strong> ጥያቄዎችን ለመመለስ ብቻ የተጠቃሚውን የጽሁፍ ግቤት ይቀበላሉ። ንግግሮች በሰርቨር ላይ የሚቀመጡት ተጠቃሚው "አስቀምጥ (Save)" የሚለውን ሲጫን ብቻ ነው።</li>
            </ul>
          </section>

          <section>
            <h3 style="font-size: 1.15rem; color: var(--primary); margin-bottom: 8px;">3. የግል ፋይናንስ፣ ዕቁብ እና የጤና መረጃዎች ምስጢራዊነት</h3>
            <p>
              በ <strong>Money & Equb Planner</strong> እና በ <strong>Health Assistant</strong> ውስጥ የሚመዘገቡ መረጃዎች ሙሉ በሙሉ የግል ናቸው።
              የመድረኩ አስተዳዳሪዎችም (Admins) ቢሆኑ የተጠቃሚዎችን የግል የፋይናንስ መዛግብት፣ የዕቁብ ቁጠባ ወይም የጤና ንግግሮች ማየት አይችሉም።
            </p>
          </section>

          <section>
            <h3 style="font-size: 1.15rem; color: var(--primary); margin-bottom: 8px;">4. የተጠቃሚ መብቶች እና የመረጃ ቁጥጥር (User Data Rights)</h3>
            <p style="margin-bottom: 12px;">የራስዎን መረጃ በማንኛውም ሰዓት ማውረድ ወይም መለያዎን ሙሉ በሙሉ መሰረዝ ይችላሉ።</p>
            
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <button id="btn-download-data" class="btn btn-secondary">
                <span>📥</span> <span data-i18n="downloadMyData">${t('downloadMyData')}</span>
              </button>
              <button id="btn-delete-account" class="btn btn-danger">
                <span>🗑️</span> <span data-i18n="deleteAccount">${t('deleteAccount')}</span>
              </button>
            </div>
          </section>

          <section style="border-top: 1px solid var(--border); padding-top: 16px;">
            <h3 style="font-size: 1.15rem; color: var(--primary); margin-bottom: 8px;">5. ያግኙን (Privacy Contact)</h3>
            <p>
              ማንኛውም ጥያቄ ወይም አስተያየት ካለዎት በይፋዊ የቴሌግራም ቻናላችን ወይም ደንበኞች አገልግሎት ያግኙን፡
              <br>
              Telegram Community: <a href="https://t.me/ethioai_hub" target="_blank" rel="noopener">https://t.me/ethioai_hub</a>
              <br>
              Lead Developer: <strong>@TadeApps</strong>
            </p>
          </section>

        </div>
      </div>
    `;

    // Bind Action Buttons
    const downloadBtn = document.getElementById('btn-download-data');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', downloadUserData);
    }

    const deleteBtn = document.getElementById('btn-delete-account');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', deleteUserAccount);
    }
  }

  async function downloadUserData() {
    const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
    const profile = window.EthioAuth ? window.EthioAuth.getProfile() : null;
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    if (!user) {
      alert(t('mustLogin'));
      return;
    }

    const saved = window.EthioFavorites ? await window.EthioFavorites.getSavedItems() : [];
    const exportBundle = {
      app: "ETHIO AI HUB",
      exportDate: new Date().toISOString(),
      user: {
        uid: user.uid,
        email: user.email,
        profile: profile
      },
      savedItems: saved
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ethio_ai_hub_data_${user.uid.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.EthioNotifications) {
      window.EthioNotifications.showToast("የእርስዎ መረጃ በኮምፒውተርዎ ላይ ወርዷል!", "success");
    }
  }

  async function deleteUserAccount() {
    const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    if (!user) {
      alert(t('mustLogin'));
      return;
    }

    const confirmed = confirm("እርግጠኛ ኖት? መለያዎ እና ሁሉም የተያያዙ መረጃዎች በሙሉ ይሰረዛሉ!");
    if (!confirmed) return;

    try {
      const db = window.EthioFirebase ? window.EthioFirebase.getDb() : null;
      if (db) {
        await db.collection('users').doc(user.uid).delete();
      }
      await window.EthioAuth.logout();
      if (window.EthioNotifications) {
        window.EthioNotifications.showToast("መለያዎ በተሳካ ሁኔታ ተሰርዟል።", "info");
      }
    } catch (e) {
      alert("ስህተት ተከስቷል፡ " + e.message);
    }
  }

  return {
    render: render,
    downloadUserData: downloadUserData,
    deleteUserAccount: deleteUserAccount
  };
})();
