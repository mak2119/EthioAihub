/**
 * ETHIO AI HUB - Main Dashboard View
 * Renders Welcome Hero, Usage meters, Quick Access Tool Cards,
 * Recent activity feed, and Notifications widget.
 */

window.EthioDashboard = (function() {

  function render(container) {
    const profile = window.EthioAuth ? window.EthioAuth.getProfile() : null;
    const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;
    const lang = window.EthioLanguage ? window.EthioLanguage.getLanguage() : 'am';

    const userName = profile && profile.name ? profile.name : (user ? user.email.split('@')[0] : 'እንግዳ (Guest)');
    const plan = profile ? (profile.plan || 'free') : 'free';
    const usage = profile && profile.dailyUsage ? profile.dailyUsage.count : 0;
    const limit = plan === 'business' ? 9999 : (plan === 'premium' ? 50 : 12);
    const remaining = plan === 'business' ? t('unlimited') : Math.max(0, limit - usage);
    const usagePercent = plan === 'business' ? 20 : Math.min(100, Math.round((usage / limit) * 100));

    const toolsList = [
      {
        id: 'ai-assistant',
        title: t('navAiAssistant'),
        desc: 'ስለማንኛውም ጉዳይ በኢትዮጵያዊ አውድ በአማርኛ፣ እንግሊዝኛ ወይም ኦሮምኛ AI ይጠይቁ።',
        icon: '💬',
        color: '#059669',
        hash: '#/tools/ai-assistant',
        badge: 'Core'
      },
      {
        id: 'job-finder',
        title: t('navJobFinder'),
        desc: 'CV ገንቢ፣ የሽፋን ደብዳቤ አዘጋጅ፣ የቃለ-መጠይቅ ልምምድ እና ይፋዊ የስራ ማስታወቂያዎች።',
        icon: '💼',
        color: '#0284c7',
        hash: '#/tools/job-finder',
        badge: 'Hiring'
      },
      {
        id: 'education-helper',
        title: t('navEducationHelper'),
        desc: 'ከ 5–12ኛ ክፍል እና ICT ተማሪዎች የትምህርት ካሪኩለም አጋዥ እና የደረጃ በደረጃ ሂሳብ ማብራሪያ።',
        icon: '🎓',
        color: '#7c3aed',
        hash: '#/tools/education-helper',
        badge: 'Grades 5-12'
      },
      {
        id: 'document-writer',
        title: t('navDocumentWriter'),
        desc: 'ይፋዊ ማመልከቻ፣ የስራ ደብዳቤዎች፣ ፕሮፖዛል እና የ Word (DOCX) እና CSV ፋይል ማውረጃ።',
        icon: '📝',
        color: '#d97706',
        hash: '#/tools/document-writer',
        badge: 'DOCX / CSV'
      },
      {
        id: 'translator',
        title: t('navTranslator'),
        desc: 'አማርኛ፣ Afaan Oromoo፣ ትግርኛ፣ እንግሊዝኛ እና ሌሎች ቋንቋዎችን በ Google Translate የሚተረጉም።',
        icon: '🌐',
        color: '#059669',
        hash: '#/tools/translator',
        badge: '5,000 chars'
      },
      {
        id: 'business-helper',
        title: t('navBusinessHelper'),
        desc: 'የቢዝነስ ፕላን፣ የግብይት ስትራቴጂ፣ የትርፍና ኪሳራ ስሌት እና በኢትዮጵያ ብር (ETB) የዋጋ ማስተካከያ።',
        icon: '📈',
        color: '#2563eb',
        hash: '#/tools/business-helper',
        badge: 'ETB Birr'
      },
      {
        id: 'home-finder',
        title: t('navHomeFinder'),
        desc: 'የኪራይና የሚሸጡ ቤቶች፣ የደላላ እና ውል አጠራጣሪ አንቀጽ ፍተሻ እና የ AI ቤት አማካሪ።',
        icon: '🏠',
        color: '#ea580c',
        hash: '#/tools/home-finder',
        badge: 'Addis & More'
      },
      {
        id: 'money-planner',
        title: t('navMoneyPlanner'),
        desc: 'የግል ገቢና ወጪ መከታተያ፣ የዕቁብ (Equb) አስተዳደር እና የግል የቁጠባ ግብ።',
        icon: '💰',
        color: '#16a34a',
        hash: '#/tools/money-planner',
        badge: 'Equb & ETB'
      },
      {
        id: 'health-assistant',
        title: t('navHealthAssistant'),
        desc: 'የትምህርታዊ ጤና መረጃ እና የአደጋ ጊዜ ምልክቶች መመሪያ (የህክምና ባለሙያን አይተካም)።',
        icon: '🩺',
        color: '#dc2626',
        hash: '#/tools/health-assistant',
        badge: 'Educational'
      },
      {
        id: 'ethio-drive',
        title: t('navEthioDrive'),
        desc: 'የመንጃ ፈቃድ እድሳት፣ የቦሎ መረጃ፣ የትራፊክ ቅጣቶችና ይፋዊ የትራንስፖርት መመሪያዎች።',
        icon: '🚗',
        color: '#4f46e5',
        hash: '#/tools/ethio-drive',
        badge: 'Official RAG'
      },
      {
        id: 'ethio-academy',
        title: t('navEthioAcademy'),
        desc: 'ለቢዝነስ ተመዝጋቢዎች ክፍት የሆነ የተግባር ክህሎት ማሰልጠኛ ከ AI አስተማሪና ምስክር ወረቀት ጋር።',
        icon: '🏫',
        color: '#0d9488',
        hash: '#/academy',
        badge: 'Courses'
      },
      {
        id: 'ethio-verify',
        title: t('navEthioVerify'),
        desc: 'የኢትዮጵያ ንግድ ባንክ፣ የቴሌብር እና ኤም-ፔሳ የክፍያ ደረሰኝ ማረጋገጫ ማጣሪያ።',
        icon: '🛡️',
        color: '#0284c7',
        hash: '#/tools/ethio-verify',
        badge: 'Verification'
      }
    ];

    container.innerHTML = `
      <!-- Welcome Hero Banner -->
      <div class="welcome-hero">
        <div class="hero-text">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 1.4rem;">👋</span>
            <span style="font-weight: 700; color: #34d399; letter-spacing: 0.05em; text-transform: uppercase; font-size: 0.8rem;">
              ${t('welcome')}, ${userName}
            </span>
          </div>
          <h2>${t('heroTitle')}</h2>
          <p>${t('heroSubtitle')}</p>
        </div>
        <div class="hero-cta">
          <a href="#/tools/ai-assistant" class="btn btn-primary btn-lg">
            <span>✨</span> <span>${t('navAiAssistant')}</span>
          </a>
          <button id="hero-upgrade-btn" class="btn btn-gold btn-lg">
            <span>⭐</span> <span>${t('upgradePlan')}</span>
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        
        <!-- Subscription Plan Card -->
        <div class="card stat-card">
          <div class="stat-icon green">
            <span>👑</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">${t('currentPlan')}</div>
            <div class="stat-val">
              <span class="badge badge-${plan}" style="font-size: 0.95rem; padding: 4px 10px;">
                ${plan.toUpperCase()}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
              ${plan === 'business' ? 'ሙሉ አገልግሎቶች ክፍት ናቸው' : (plan === 'premium' ? '50 ዕለታዊ ጥያቄዎች' : '12 ዕለታዊ ጥያቄዎች')}
            </div>
          </div>
        </div>

        <!-- Daily AI Usage Card -->
        <div class="card stat-card">
          <div class="stat-icon gold">
            <span>⚡</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">${t('dailyUsage')}</div>
            <div class="stat-val">${usage} <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">/ ${plan === 'business' ? '∞' : limit}</span></div>
            <div class="usage-progress-bar">
              <div class="usage-progress-fill" style="width: ${usagePercent}%;"></div>
            </div>
          </div>
        </div>

        <!-- Remaining Chats Card -->
        <div class="card stat-card">
          <div class="stat-icon ruby">
            <span>⏳</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">${t('remainingChats')}</div>
            <div class="stat-val" style="color: ${remaining === 0 ? 'var(--ruby)' : 'var(--text-main)'};">
              ${remaining}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
              እኩለ ሌሊት ላይ ይታደሳል (Resets 12:00 AM)
            </div>
          </div>
        </div>

      </div>

      <!-- Quick Tools Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main);">
          ሁሉም የአርቲፊሻል ኢንተለጀንስ መሳሪያዎች (All 12 AI Tools)
        </h3>
        <span style="font-size: 0.825rem; color: var(--text-muted);">
          12 ንቁ መሳሪያዎች
        </span>
      </div>

      <!-- Tools Grid -->
      <div class="tools-grid">
        ${toolsList.map(tool => `
          <div class="card tool-card" onclick="window.location.hash='${tool.hash}'">
            <div class="tool-card-top">
              <div class="tool-icon-box" style="background-color: ${tool.color}15; color: ${tool.color};">
                ${tool.icon}
              </div>
              <div class="tool-card-info">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px;">
                  <h3>${tool.title}</h3>
                  <span class="badge badge-free" style="font-size: 0.65rem;">${tool.badge}</span>
                </div>
                <p>${tool.desc}</p>
              </div>
            </div>
            <div class="tool-card-footer">
              <span>መተግበሪያውን ክፈት</span>
              <span>➔</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Bind Hero Upgrade Button
    const upgradeBtn = document.getElementById('hero-upgrade-btn');
    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => {
        window.EthioSubscription.openPaymentModal('premium');
      });
    }
  }

  return {
    render: render
  };
})();
