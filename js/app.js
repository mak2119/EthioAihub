/**
 * ETHIO AI HUB - Main Application Orchestrator
 * Coordinates initialization of Firebase, Translations, Router, Auth,
 * Global UI events, Modals, and View State.
 */

window.EthioApp = (function() {

  function init() {
    console.log("Initializing ETHIO AI HUB...");

    // Apply saved theme
    const savedTheme = localStorage.getItem('ethio_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Initialize core subsystems
    if (window.EthioFirebase) window.EthioFirebase.init();
    if (window.EthioLanguage) window.EthioLanguage.init();
    if (window.EthioAuth) window.EthioAuth.init();
    if (window.EthioSubscription) window.EthioSubscription.init();

    // Register router views
    setupRoutes();

    // Initialize router hashchange listener
    if (window.EthioRouter) window.EthioRouter.init();

    // Setup global layout events
    setupLayoutEvents();

    // Trigger initial route
    if (window.EthioRouter) window.EthioRouter.handleRoute();
  }

  function setupRoutes() {
    const router = window.EthioRouter;
    if (!router) return;

    router.register('#/dashboard', (c) => window.EthioDashboard.render(c));
    router.register('#/academy', (c) => window.EthioTools_EthioAcademy.render(c));
    router.register('#/profile', (c) => window.EthioProfile.render(c));
    router.register('#/privacy', (c) => window.EthioPrivacy.render(c));
    router.register('#/subscription', (c) => renderSubscriptionView(c));
    router.register('#/login', (c) => renderAuthView(c, 'login'));
    router.register('#/register', (c) => renderAuthView(c, 'register'));
    router.register('#/forgot-password', (c) => renderAuthView(c, 'forgot'));
  }

  function setupLayoutEvents() {
    // Mobile Drawer Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');

    if (menuBtn && sidebar && backdrop) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        backdrop.classList.toggle('active');
      });

      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('active');
      });
    }

    // Header Upgrade Button
    const headerUpBtn = document.getElementById('header-upgrade-btn');
    if (headerUpBtn) {
      headerUpBtn.addEventListener('click', () => {
        window.EthioSubscription.openPaymentModal('premium');
      });
    }

    // Modal Close buttons
    document.querySelectorAll('.modal-close, .modal-cancel-btn').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      });
    });

    // Payment Form Submit
    const payForm = document.getElementById('telebirr-pay-form');
    if (payForm) {
      payForm.addEventListener('submit', (e) => {
        window.EthioSubscription.submitPaymentRequest(e);
      });
    }

    const payPlanSelect = document.getElementById('pay-plan-select');
    const payPeriodSelect = document.getElementById('pay-period-select');
    if (payPlanSelect && payPeriodSelect) {
      payPlanSelect.addEventListener('change', () => window.EthioSubscription.updatePriceDisplay());
      payPeriodSelect.addEventListener('change', () => window.EthioSubscription.updatePriceDisplay());
    }

    // Post Property Modal Form
    const propForm = document.getElementById('post-property-form');
    if (propForm) {
      propForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
        if (!user) return;

        const title = document.getElementById('post-prop-title').value;
        const type = document.getElementById('post-prop-type').value;
        const subcity = document.getElementById('post-prop-subcity').value;
        const price = document.getElementById('post-prop-price').value;
        const phone = document.getElementById('post-prop-phone').value;
        const desc = document.getElementById('post-prop-desc').value;

        const db = window.EthioFirebase ? window.EthioFirebase.getDb() : null;
        if (db) {
          await db.collection('propertyListings').add({
            title: title,
            type: type,
            subCity: subcity,
            price: parseFloat(price) || 0,
            contactPhone: phone,
            description: desc,
            submittedBy: user.email,
            status: 'pending_moderation',
            createdAt: new Date().toISOString()
          });
        }

        document.getElementById('post-property-modal').classList.remove('active');
        propForm.reset();
        if (window.EthioNotifications) {
          window.EthioNotifications.showToast("የቤት ማስታወቂያዎ ገብቷል፤ በአስተዳዳሪው ታይቶ ይጸድቃል!", "success");
        }
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('sidebar-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm("እርግጠኛ ኖት መውጣት ይፈልጋሉ? (Are you sure you want to log out?)")) {
          window.EthioAuth.logout();
        }
      });
    }

    // Listen for language changes to update document titles
    window.addEventListener('ethio-language-changed', () => {
      if (window.EthioRouter) window.EthioRouter.handleRoute();
    });
  }

  function renderSubscriptionView(container) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;
    const plans = window.EthioSubscription.PLANS;

    container.innerHTML = `
      <div style="max-width: 950px; margin: 0 auto;">
        
        <div style="text-align: center; margin-bottom: 28px;">
          <h2 style="font-size: 1.8rem; margin-bottom: 6px;">የ ETHIO AI HUB የደንበኝነት እቅዶች (Subscription Plans)</h2>
          <p style="font-size: 0.95rem; color: var(--text-muted);">
            ለፍላጎትዎ የሚስማማውን እቅድ ይምረጡ፤ ክፍያዎን በቴሌብር (TeleBirr) በቅጽበት ይፈጽሙ።
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          
          <!-- Free Plan -->
          <div class="card" style="border-top: 4px solid #64748b; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge badge-free" style="margin-bottom: 12px;">FREE</span>
              <h3 style="font-size: 1.4rem; margin-bottom: 4px;">ነጻ እቅድ</h3>
              <div style="font-size: 1.8rem; font-weight: 800; margin-bottom: 16px;">
                0 <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">ETB / ወር</span>
              </div>
              <ul style="font-size: 0.88rem; color: var(--text-main); display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; padding-left: 18px;">
                <li><strong>12 የ AI ጥያቄዎች</strong> በየቀኑ</li>
                <li>መሰረታዊ የ AI መሳሪያዎች</li>
                <li>መረጃዎች በ 8 ሰዓት ዘግይተው ይደርሳሉ</li>
                <li>የግል ሰነዶች ማዘጋጃ</li>
              </ul>
            </div>
            <button class="btn btn-secondary" style="width: 100%;" disabled>የአሁን እቅድ (Current)</button>
          </div>

          <!-- Premium Plan -->
          <div class="card" style="border-top: 4px solid var(--gold); border: 2px solid var(--gold); display: flex; flex-direction: column; justify-content: space-between; transform: translateY(-4px);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span class="badge badge-premium">PREMIUM</span>
                <span style="font-size: 0.75rem; color: var(--gold); font-weight: 700;">ተመራጭ (Popular)</span>
              </div>
              <h3 style="font-size: 1.4rem; margin-bottom: 4px;">ፕሪሚየም</h3>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--gold); margin-bottom: 4px;">
                250 <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">ETB / ወር</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px;">
                ዓመታዊ ክፍያ፡ <strong>2,700 ETB/ዓመት</strong> (10% ቅናሽ)
              </div>
              <ul style="font-size: 0.88rem; color: var(--text-main); display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; padding-left: 18px;">
                <li><strong>50 የ AI ጥያቄዎች</strong> በየቀኑ</li>
                <li>ሁሉም 12 AI መሳሪያዎች ክፍት</li>
                <li>መረጃዎች በ 1 ሰዓት ውስጥ ይደርሳሉ</li>
                <li>ልዩ የፕሪሚየም ባጅና ዳሽቦርድ</li>
              </ul>
            </div>
            <button id="btn-select-premium" class="btn btn-gold" style="width: 100%;">ፕሪሚየም ይምረጡ</button>
          </div>

          <!-- Business Plan -->
          <div class="card" style="border-top: 4px solid var(--primary); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span class="badge badge-business" style="margin-bottom: 12px;">BUSINESS</span>
              <h3 style="font-size: 1.4rem; margin-bottom: 4px;">ቢዝነስ እቅድ</h3>
              <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin-bottom: 4px;">
                600 <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">ETB / ወር</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px;">
                ዓመታዊ ክፍያ፡ <strong>6,480 ETB/ዓመት</strong> (10% ቅናሽ)
              </div>
              <ul style="font-size: 0.88rem; color: var(--text-main); display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; padding-left: 18px;">
                <li><strong>ያልተገደበ የ AI ጥያቄዎች (Unlimited)</strong></li>
                <li><strong>ሁሉም የኢትዮ አካዳሚ ኮርሶች በነጻ</strong></li>
                <li>ፈጣን ቅጽበታዊ ማሳወቂያዎች</li>
                <li>የላቁ የንግድ ስሌቶችና ፕሮፖዛሎች</li>
                <li>ቅድሚያ የሚሰጠው የደንበኞች ድጋፍ</li>
              </ul>
            </div>
            <button id="btn-select-business" class="btn btn-primary" style="width: 100%;">ቢዝነስ ይምረጡ</button>
          </div>

        </div>

      </div>
    `;

    const premBtn = document.getElementById('btn-select-premium');
    if (premBtn) {
      premBtn.addEventListener('click', () => {
        window.EthioSubscription.openPaymentModal('premium');
      });
    }

    const bizBtn = document.getElementById('btn-select-business');
    if (bizBtn) {
      bizBtn.addEventListener('click', () => {
        window.EthioSubscription.openPaymentModal('business');
      });
    }
  }

  function renderAuthView(container, mode = 'login') {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    container.innerHTML = `
      <div class="card" style="max-width: 440px; margin: 30px auto; padding: 28px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div class="brand-logo" style="margin: 0 auto 10px auto; width: 48px; height: 48px; font-size: 1.4rem;">
            🇪🇹
          </div>
          <h2 style="font-size: 1.35rem; margin-bottom: 4px;">
            ${mode === 'login' ? t('loginTitle') : (mode === 'register' ? t('registerTitle') : t('forgotPassword'))}
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">ETHIO AI HUB</p>
        </div>

        <!-- Quick Demo Accounts Trigger (For immediate review) -->
        <div style="background: var(--bg-main); border: 1px dashed var(--border); border-radius: var(--radius-md); padding: 12px; margin-bottom: 18px; text-align: center;">
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">
            ፈጣን የሙከራ መለያዎች (Instant Demo Logins):
          </div>
          <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm demo-btn" data-plan="free">Free Demo</button>
            <button class="btn btn-gold btn-sm demo-btn" data-plan="premium">Premium Demo</button>
            <button class="btn btn-primary btn-sm demo-btn" data-plan="business">Business Demo</button>
          </div>
        </div>

        <form id="auth-main-form">
          ${mode === 'register' ? `
            <div class="form-group">
              <label class="form-label">${t('fullName')}</label>
              <input type="text" id="auth-name" required placeholder="ሙሉ ስም">
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label">${t('email')}</label>
            <input type="email" id="auth-email" required placeholder="name@example.com">
          </div>

          ${mode !== 'forgot' ? `
            <div class="form-group">
              <label class="form-label">${t('password')}</label>
              <input type="password" id="auth-password" required placeholder="••••••••">
            </div>
          ` : ''}

          ${mode === 'register' ? `
            <div class="form-group">
              <label class="form-label">${t('confirmPassword')}</label>
              <input type="password" id="auth-confirm-password" required placeholder="••••••••">
            </div>

            <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 16px; font-size: 0.8rem;">
              <input type="checkbox" id="auth-agree-terms" required style="width: auto; margin-top: 3px;">
              <label for="auth-agree-terms">
                በ <a href="#/privacy" target="_blank">የአገልግሎት ደንቡ እና በግላዊነት ፖሊሲው</a> እስማማለሁ።
              </label>
            </div>
          ` : ''}

          <button type="submit" id="btn-auth-submit" class="btn btn-primary" style="width: 100%;">
            ${mode === 'login' ? t('navLogin') : (mode === 'register' ? t('navRegister') : t('sendResetLink'))}
          </button>
        </form>

        <div style="margin-top: 16px; text-align: center; font-size: 0.85rem;">
          ${mode === 'login' ? `
            <div style="margin-bottom: 6px;">
              <a href="#/forgot-password">${t('forgotPassword')}</a>
            </div>
            <div>
              ${t('dontHaveAccount')} <a href="#/register"><strong>${t('navRegister')}</strong></a>
            </div>
          ` : (mode === 'register' ? `
            <div>
              ${t('alreadyHaveAccount')} <a href="#/login"><strong>${t('navLogin')}</strong></a>
            </div>
          ` : `
            <div>
              <a href="#/login">← ${t('back')}</a>
            </div>
          `)}
        </div>
      </div>
    `;

    // Demo Logins
    container.querySelectorAll('.demo-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const plan = btn.getAttribute('data-plan');
        await window.EthioAuth.demoLogin(plan);
      });
    });

    // Form submit
    const form = document.getElementById('auth-main-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value.trim();
      const submitBtn = document.getElementById('btn-auth-submit');

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner"></span>`;

      try {
        if (mode === 'login') {
          const pass = document.getElementById('auth-password').value;
          await window.EthioAuth.login(email, pass);
          window.location.hash = '#/dashboard';
        } else if (mode === 'register') {
          const name = document.getElementById('auth-name').value.trim();
          const pass = document.getElementById('auth-password').value;
          const conf = document.getElementById('auth-confirm-password').value;
          const agree = document.getElementById('auth-agree-terms').checked;
          await window.EthioAuth.register(name, email, pass, conf, agree);
          window.location.hash = '#/dashboard';
        } else if (mode === 'forgot') {
          await window.EthioAuth.resetPassword(email);
          alert("የይለፍ ቃል ማስተካከያ ሊንክ ወደ ኢሜይልዎ ተልኳል!");
          window.location.hash = '#/login';
        }
      } catch (err) {
        alert(err.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = mode === 'login' ? t('navLogin') : (mode === 'register' ? t('navRegister') : t('sendResetLink'));
      }
    });
  }

  return {
    init: init
  };
})();

// Start App when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.EthioApp.init();
});
