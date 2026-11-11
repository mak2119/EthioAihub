/**
 * ETHIO AI HUB - AI Assistant Tool
 * Multilingual AI conversation workspace with Ethiopian contextual intelligence.
 */

window.EthioTools_AiAssistant = (function() {
  let conversationHistory = [];

  function render(container) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;
    const lang = window.EthioLanguage ? window.EthioLanguage.getLanguage() : 'am';

    const sampleChips = lang === 'am' ? [
      "የኢትዮጵያ የንግድ ምዝገባ እና ፈቃድ አወጣጥ ቅደም ተከተል?",
      "ለአዲስ ስራ ፈላጊ ምርጥ የ CV አዘገጃጀት ምክሮች",
      "በአዲስ አበባ አነስተኛ ካፒታል የሚጠይቁ 5 የንግድ ሀሳቦች",
      "የቴሌብር የንግድ መለያ (Merchant Account) እንዴት ይከፈታል?"
    ] : (lang === 'om' ? [
      "Itoophiyaa keessatti hayyama daldalaa baafachuuf maal barbaachisa?",
      "Akkaataa CV ammayyaa qopheessuu",
      "Yaada daldalaa kaappitaala xiqqaan jalqabamu 5",
      "Herrega daldalaa TeleBirr akkamitti bananna?"
    ] : [
      "How to obtain a business license in Ethiopia?",
      "Modern CV writing tips for Ethiopian graduates",
      "5 profitable small business ideas in Addis Ababa",
      "How to set up a TeleBirr Merchant Account?"
    ]);

    container.innerHTML = `
      <div class="tool-header-banner">
        <div class="tool-header-left">
          <div class="tool-header-icon" style="background-color: #ecfdf5; color: #059669;">
            💬
          </div>
          <div>
            <h2 style="font-size: 1.25rem;">${t('navAiAssistant')}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">${t('aiAssistantDesc')}</p>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="btn-save-chat" class="btn btn-secondary btn-sm" title="${t('save')}">
            <span>💾</span> <span>${t('save')}</span>
          </button>
          <button id="btn-clear-chat" class="btn btn-secondary btn-sm" title="${t('clear')}">
            <span>🗑️</span> <span>${t('clear')}</span>
          </button>
        </div>
      </div>

      <div class="chat-workspace">
        <div id="chat-messages-box" class="chat-messages">
          <div class="message-row ai">
            <div class="msg-avatar ai-avatar">✨</div>
            <div class="msg-bubble">
              <strong>${t('welcome')}!</strong><br>
              እኔ የ ETHIO AI HUB አርቲፊሻል ኢንተለጀንስ ረዳት ነኝ። በስራ፣ በትምህርት፣ በቢዝነስ ወይም በዕለት ተዕለት ህይወትዎ ዙሪያ ማንኛውንም ጥያቄ በአማርኛ፣ በእንግሊዝኛ ወይም በኦሮምኛ መጠየቅ ይችላሉ። ምን ልርዳዎት?
            </div>
          </div>
        </div>

        <div class="prompt-chips">
          ${sampleChips.map(c => `<button class="chip prompt-chip-btn">${c}</button>`).join('')}
        </div>

        <div class="chat-input-area">
          <textarea id="ai-chat-input" placeholder="ጥያቄዎን እዚህ ይጻፉ... (Ask a question...)" rows="1"></textarea>
          <button id="btn-send-ai-msg" class="btn btn-primary" style="height: 42px; min-width: 80px;">
            <span>ላክ</span> <span>➤</span>
          </button>
        </div>
      </div>
    `;

    // Bind Handlers
    const input = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('btn-send-ai-msg');
    const clearBtn = document.getElementById('btn-clear-chat');
    const saveBtn = document.getElementById('btn-save-chat');
    const chips = container.querySelectorAll('.prompt-chip-btn');

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    clearBtn.addEventListener('click', () => {
      conversationHistory = [];
      const box = document.getElementById('chat-messages-box');
      box.innerHTML = `
        <div class="message-row ai">
          <div class="msg-avatar ai-avatar">✨</div>
          <div class="msg-bubble">ውይይቱ ጸድቷል። አዲስ ጥያቄ መጠየቅ ይችላሉ!</div>
        </div>
      `;
    });

    saveBtn.addEventListener('click', async () => {
      if (conversationHistory.length === 0) {
        if (window.EthioNotifications) {
          window.EthioNotifications.showToast("የሚቀመጥ ንግግር የለም", "warning");
        }
        return;
      }
      const firstQ = conversationHistory.find(m => m.role === 'user');
      const title = firstQ ? firstQ.text.slice(0, 40) + "..." : "AI Conversation";
      await window.EthioFavorites.saveItem('chat', {
        title: title,
        messages: conversationHistory
      });
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        input.value = chip.textContent.trim();
        handleSend();
      });
    });
  }

  async function handleSend() {
    const input = document.getElementById('ai-chat-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    appendMessage('user', text);
    conversationHistory.push({ role: 'user', text: text });

    // Typing indicator
    const typingId = appendTypingIndicator();

    try {
      const response = await window.EthioAPI.callAI('ai-assistant', text, conversationHistory);
      removeTypingIndicator(typingId);
      appendMessage('ai', response);
      conversationHistory.push({ role: 'ai', text: response });
    } catch (err) {
      removeTypingIndicator(typingId);
      appendMessage('ai', `⚠️ ${err.message || 'ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።'}`);
    }
  }

  function appendMessage(role, text) {
    const box = document.getElementById('chat-messages-box');
    if (!box) return;

    const row = document.createElement('div');
    row.className = `message-row ${role}`;
    
    const avatar = role === 'user' ? '👤' : '✨';
    const avatarClass = role === 'user' ? 'user-avatar' : 'ai-avatar';

    row.innerHTML = `
      <div class="msg-avatar ${avatarClass}">${avatar}</div>
      <div class="msg-bubble">
        <div style="white-space: pre-wrap;">${escapeHtml(text)}</div>
        ${role === 'ai' ? `
          <div class="msg-actions">
            <button class="msg-action-btn copy-msg-btn">📋 ቅዳ</button>
            <button class="msg-action-btn regen-msg-btn">🔄 እንደገና</button>
          </div>
        ` : ''}
      </div>
    `;

    box.appendChild(row);
    box.scrollTop = box.scrollHeight;

    // Bind action buttons
    const copyBtn = row.querySelector('.copy-msg-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(text);
        copyBtn.textContent = '✅ ተቀድቷል!';
        setTimeout(() => copyBtn.textContent = '📋 ቅዳ', 2000);
      });
    }

    const regenBtn = row.querySelector('.regen-msg-btn');
    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        const lastUser = [...conversationHistory].reverse().find(m => m.role === 'user');
        if (lastUser) {
          const inp = document.getElementById('ai-chat-input');
          inp.value = lastUser.text;
          handleSend();
        }
      });
    }
  }

  function appendTypingIndicator() {
    const box = document.getElementById('chat-messages-box');
    const id = 'typing_' + Date.now();
    const row = document.createElement('div');
    row.id = id;
    row.className = 'message-row ai';
    row.innerHTML = `
      <div class="msg-avatar ai-avatar">✨</div>
      <div class="msg-bubble" style="display: flex; align-items: center; gap: 8px;">
        <span class="spinner" style="width: 14px; height: 14px; color: var(--primary);"></span>
        <span style="font-size: 0.825rem; color: var(--text-muted);">መልስ እየተዘጋጀ ነው...</span>
      </div>
    `;
    box.appendChild(row);
    box.scrollTop = box.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  return {
    render: render
  };
})();
