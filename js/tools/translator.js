/**
 * ETHIO AI HUB - Translator Tool
 * Multilingual Translation powered by Google Translate via Cloudflare Worker.
 * Supports Amharic, Afaan Oromoo, Tigrinya, English, Arabic, Somali, and 100+ languages.
 * Max 5,000 characters, auto-detect, language swap, copy, and history.
 */

window.EthioTools_Translator = (function() {
  const defaultLanguages = [
    { code: 'auto', name: 'ራስ-አውቅ (Auto Detect)' },
    { code: 'am', name: 'አማርኛ (Amharic)' },
    { code: 'om', name: 'Afaan Oromoo' },
    { code: 'ti', name: 'ትግርኛ (Tigrinya)' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية (Arabic)' },
    { code: 'so', name: 'Soomaali (Somali)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'de', name: 'Deutsch (German)' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'it', name: 'Italiano (Italian)' }
  ];

  let translationHistory = [];

  function render(container) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    container.innerHTML = `
      <div class="tool-header-banner">
        <div class="tool-header-left">
          <div class="tool-header-icon" style="background-color: #ecfdf5; color: #059669;">
            🌐
          </div>
          <div>
            <h2 style="font-size: 1.25rem;">${t('navTranslator')}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              አማርኛ፣ Afaan Oromoo፣ ትግርኛ፣ እንግሊዝኛ እና ሌሎች ቋንቋዎችን በቅጽበት ይተርጉሙ (እስከ 5,000 ፊደላት)
            </p>
          </div>
        </div>
      </div>

      <div class="translator-workspace">
        
        <!-- Source Box -->
        <div class="trans-box">
          <div class="trans-header">
            <select id="trans-src-lang" style="max-width: 200px;">
              ${defaultLanguages.map(l => `<option value="${l.code}">${l.name}</option>`).join('')}
            </select>
            <button id="btn-trans-clear" class="btn btn-secondary btn-sm" title="${t('clear')}">
              <span>✕</span> <span>${t('clear')}</span>
            </button>
          </div>

          <textarea id="trans-src-text" class="trans-textarea" maxlength="5000" placeholder="የሚተረጎመውን ጽሁፍ እዚህ ይጻፉ ወይም ይለጥፉ..."></textarea>

          <div class="trans-footer">
            <span id="trans-char-count">0 / 5000</span>
            <button id="btn-do-translate" class="btn btn-primary">
              <span>ትርጉም አሳይ</span> <span>➔</span>
            </button>
          </div>
        </div>

        <!-- Target Box -->
        <div class="trans-box">
          <div class="trans-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <button id="btn-swap-langs" class="btn btn-secondary btn-sm" title="ቋንቋ ቀይር (Swap)">
                ⇄
              </button>
              <select id="trans-target-lang" style="max-width: 200px;">
                ${defaultLanguages.filter(l => l.code !== 'auto').map(l => `
                  <option value="${l.code}" ${l.code === 'en' ? 'selected' : ''}>${l.name}</option>
                `).join('')}
              </select>
            </div>
            <button id="btn-trans-copy" class="btn btn-secondary btn-sm" title="${t('copy')}">
              <span>📋</span> <span>${t('copy')}</span>
            </button>
          </div>

          <textarea id="trans-target-text" class="trans-textarea" readonly placeholder="የተተረጎመው ጽሁፍ እዚህ ይታያል..."></textarea>

          <div class="trans-footer">
            <span id="trans-status-text" style="color: var(--text-muted); font-size: 0.8rem;">ዝግጁ</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">በ Google Translate የተደገፈ</span>
          </div>
        </div>

      </div>

      <!-- Translation History Card -->
      <div class="card" style="margin-top: 20px;">
        <h3 style="font-size: 1rem; margin-bottom: 12px; border-bottom: 1px solid var(--border); padding-bottom: 6px;">
          የቅርብ ጊዜ የትርጉም ታሪክ (Recent Translations)
        </h3>
        <div id="trans-history-list" style="display: flex; flex-direction: column; gap: 8px;">
          ${translationHistory.length === 0 ? `
            <p style="font-size: 0.85rem; color: var(--text-muted);">ምንም የትርጉም ታሪክ አልተመዘገበም።</p>
          ` : translationHistory.map(h => `
            <div style="padding: 10px; background: var(--bg-main); border-radius: var(--radius-sm); font-size: 0.85rem;">
              <div style="font-weight: 600; color: var(--text-main); margin-bottom: 2px;">${escapeHtml(h.src)}</div>
              <div style="color: var(--primary);">${escapeHtml(h.target)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Handlers
    const srcText = document.getElementById('trans-src-text');
    const targetText = document.getElementById('trans-target-text');
    const charCount = document.getElementById('trans-char-count');
    const transBtn = document.getElementById('btn-do-translate');
    const clearBtn = document.getElementById('btn-trans-clear');
    const copyBtn = document.getElementById('btn-trans-copy');
    const swapBtn = document.getElementById('btn-swap-langs');
    const srcLang = document.getElementById('trans-src-lang');
    const targetLang = document.getElementById('trans-target-lang');
    const statusText = document.getElementById('trans-status-text');

    srcText.addEventListener('input', () => {
      charCount.textContent = `${srcText.value.length} / 5000`;
    });

    clearBtn.addEventListener('click', () => {
      srcText.value = '';
      targetText.value = '';
      charCount.textContent = '0 / 5000';
    });

    copyBtn.addEventListener('click', () => {
      if (!targetText.value) return;
      navigator.clipboard.writeText(targetText.value);
      copyBtn.innerHTML = `<span>✅</span> <span>ተቀድቷል!</span>`;
      setTimeout(() => {
        copyBtn.innerHTML = `<span>📋</span> <span>${t('copy')}</span>`;
      }, 2000);
    });

    swapBtn.addEventListener('click', () => {
      if (srcLang.value === 'auto') {
        srcLang.value = 'am';
      }
      const tempLang = srcLang.value;
      srcLang.value = targetLang.value;
      targetLang.value = tempLang;

      const tempText = srcText.value;
      srcText.value = targetText.value;
      targetText.value = tempText;
      charCount.textContent = `${srcText.value.length} / 5000`;
    });

    transBtn.addEventListener('click', executeTranslation);

    async function executeTranslation() {
      const text = srcText.value.trim();
      if (!text) return;

      statusText.textContent = "በመተርጎም ላይ...";
      transBtn.disabled = true;

      try {
        const translated = await window.EthioAPI.translateText(text, srcLang.value, targetLang.value);
        targetText.value = translated;
        statusText.textContent = "ተጠናቋል";

        // Push to history
        translationHistory.unshift({
          src: text.slice(0, 60) + (text.length > 60 ? '...' : ''),
          target: translated.slice(0, 60) + (translated.length > 60 ? '...' : '')
        });
        if (translationHistory.length > 5) translationHistory.pop();
      } catch (err) {
        statusText.textContent = "ስህተት ተከስቷል";
        alert(err.message);
      } finally {
        transBtn.disabled = false;
      }
    }
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  return {
    render: render
  };
})();
