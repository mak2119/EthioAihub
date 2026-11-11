/**
 * ETHIO AI HUB - User Profile & Account Settings
 * Manages profile editing, language preference, theme toggle, payment history,
 * saved AI responses, and account data management.
 */

window.EthioProfile = (function() {

  async function render(container) {
    const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
    const profile = window.EthioAuth ? window.EthioAuth.getProfile() : null;
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;
    const lang = window.EthioLanguage ? window.EthioLanguage.getLanguage() : 'am';

    if (!user) {
      container.innerHTML = `
        <div class="card" style="max-width: 500px; margin: 40px auto; text-align: center;">
          <h3 style="margin-bottom: 12px;">${t('mustLogin')}</h3>
          <p style="margin-bottom: 20px;">የመለያዎን መረጃ ለማየትና ለማስተካከል እባክዎ ይግቡ።</p>
          <a href="#/login" class="btn btn-primary">${t('navLogin')}</a>
        </div>
      `;
      return;
    }

    const plan = profile ? (profile.plan || 'free') : 'free';
    const usage = profile && profile.dailyUsage ? profile.dailyUsage.count : 0;
    const limit = plan === 'business' ? '∞' : (plan === 'premium' ? 50 : 12);

    // Fetch user payment history
    let paymentHistory = [];
    const db = window.EthioFirebase ? window.EthioFirebase.getDb() : null;
    if (db) {
      try {
        const snap = await db.collection('paymentRequests').get();
        snap.docs.forEach(d => {
          const item = d.data();
          if (item.uid === user.uid) {
            paymentHistory.push({ id: d.id, ...item });
          }
        });
      } catch (e) {
        console.warn("Could not load payment history:", e);
      }
    }

    // Fetch saved items
    const savedItems = window.EthioFavorites ? await window.EthioFavorites.getSavedItems() : [];

    container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Profile Header Card -->
        <div class="card" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #059669 0%, #10b981 100%); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: white; font-weight: 700;">
              ${(profile && profile.name ? profile.name[0] : 'U').toUpperCase()}
            </div>
            <div>
              <h2 style="font-size: 1.4rem; margin-bottom: 4px;">${profile && profile.name ? profile.name : user.email}</h2>
              <p style="font-size: 0.85rem; color: var(--text-muted);">${user.email}</p>
              <div style="margin-top: 6px;">
                <span class="badge badge-${plan}">${plan.toUpperCase()} PLAN</span>
              </div>
            </div>
          </div>
          <div>
            <button id="btn-open-payment" class="btn btn-gold">
              <span>⭐</span> <span data-i18n="upgradePlan">${t('upgradePlan')}</span>
            </button>
          </div>
        </div>

        <!-- Settings Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          
          <!-- Edit Profile Form -->
          <div class="card">
            <h3 style="font-size: 1.1rem; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
              የግል መረጃ ማስተካከያ (Edit Profile)
            </h3>
            <form id="edit-profile-form">
              <div class="form-group">
                <label class="form-label">${t('fullName')}</label>
                <input type="text" id="prof-name" value="${profile && profile.name ? profile.name : ''}" required>
              </div>
              <div class="form-group">
                <label class="form-label">${t('email')}</label>
                <input type="email" value="${user.email}" disabled style="opacity: 0.7;">
              </div>
              <div class="form-group">
                <label class="form-label">ቋንቋ (Preferred Language)</label>
                <select id="prof-lang">
                  <option value="am" ${lang === 'am' ? 'selected' : ''}>አማርኛ (Amharic)</option>
                  <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
                  <option value="om" ${lang === 'om' ? 'selected' : ''}>Afaan Oromoo</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%;">
                ${t('save')}
              </button>
            </form>
          </div>

          <!-- Preferences & Theme -->
          <div class="card">
            <h3 style="font-size: 1.1rem; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
              ምርጫዎችና ገጽታ (Appearance & Theme)
            </h3>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>የገጽታ ቀለም (Theme):</span>
                <button id="btn-theme-toggle" class="btn btn-secondary btn-sm">
                  <span id="theme-icon">🌙</span> <span id="theme-label">Dark Mode</span>
                </button>
              </div>

              <div style="border-top: 1px solid var(--border); padding-top: 12px;">
                <div style="font-weight: 600; margin-bottom: 4px;">የ AI ዕለታዊ አጠቃቀም (Usage):</div>
                <div style="font-size: 0.9rem; color: var(--text-muted);">
                  የዛሬ አጠቃቀም: <strong>${usage}</strong> / <strong>${limit}</strong>
                </div>
              </div>

              <div style="border-top: 1px solid var(--border); padding-top: 12px; display: flex; flex-direction: column; gap: 8px;">
                <button id="prof-download-btn" class="btn btn-secondary btn-sm" style="justify-content: flex-start;">
                  <span>📥</span> <span>${t('downloadMyData')}</span>
                </button>
                <button id="prof-delete-btn" class="btn btn-danger btn-sm" style="justify-content: flex-start;">
                  <span>🗑️</span> <span>${t('deleteAccount')}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Payment History -->
        <div class="card">
          <h3 style="font-size: 1.1rem; margin-bottom: 14px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
            የክፍያ ታሪክ (TeleBirr Payment History)
          </h3>
          ${paymentHistory.length === 0 ? `
            <p style="color: var(--text-muted); font-size: 0.85rem; padding: 12px 0;">ምንም የተመዘገበ ክፍያ የለም።</p>
          ` : `
            <div style="overflow-x: auto;">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>ቀን (Date)</th>
                    <th>እቅድ (Plan)</th>
                    <th>የክፍያ ጊዜ (Period)</th>
                    <th>መጠን (ETB)</th>
                    <th>ደረሰኝ ቁጥር (TxID)</th>
                    <th>ሁኔታ (Status)</th>
                  </tr>
                </thead>
                <tbody>
                  ${paymentHistory.map(p => `
                    <tr>
                      <td>${p.paymentDate || p.createdAt.slice(0, 10)}</td>
                      <td><span class="badge badge-${p.plan}">${p.plan}</span></td>
                      <td>${p.billingPeriod}</td>
                      <td><strong>${p.amount} ETB</strong></td>
                      <td><code>${p.transactionId}</code></td>
                      <td>
                        <span class="badge badge-${p.status === 'approved' ? 'success' : 'pending'}">
                          ${p.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- Saved Items Feed -->
        <div class="card">
          <h3 style="font-size: 1.1rem; margin-bottom: 14px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
            የተቀመጡ ሰነዶችና ንግግሮች (Saved Items)
          </h3>
          ${savedItems.length === 0 ? `
            <p style="color: var(--text-muted); font-size: 0.85rem; padding: 12px 0;">ምንም የተቀመጠ ሰነድ የለም። በ AI Assistant ወይም Document Writer ውስጥ "አስቀምጥ" የሚለውን ይጠቀሙ።</p>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${savedItems.map(item => `
                <div style="padding: 12px; border: 1px solid var(--border); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <span class="badge badge-free" style="margin-right: 8px;">${item.type.toUpperCase()}</span>
                    <strong>${item.item.title || item.item.prompt || 'Untitled'}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                      ${new Date(item.savedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button class="btn btn-secondary btn-sm delete-saved-btn" data-id="${item.id}">
                    🗑️
                  </button>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    `;

    // Bind Handlers
    const form = document.getElementById('edit-profile-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('prof-name').value.trim();
        const newLang = document.getElementById('prof-lang').value;
        try {
          await window.EthioAuth.updateProfile({ name: newName, preferredLanguage: newLang });
          if (newLang !== lang) {
            window.EthioLanguage.setLanguage(newLang);
          }
          if (window.EthioNotifications) {
            window.EthioNotifications.showToast(t('success'), 'success');
          }
        } catch (err) {
          alert(err.message);
        }
      });
    }

    const payBtn = document.getElementById('btn-open-payment');
    if (payBtn) {
      payBtn.addEventListener('click', () => {
        window.EthioSubscription.openPaymentModal('premium');
      });
    }

    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    const downBtn = document.getElementById('prof-download-btn');
    if (downBtn) {
      downBtn.addEventListener('click', () => window.EthioPrivacy.downloadUserData());
    }

    const delBtn = document.getElementById('prof-delete-btn');
    if (delBtn) {
      delBtn.addEventListener('click', () => window.EthioPrivacy.deleteUserAccount());
    }

    // Bind delete saved item
    container.querySelectorAll('.delete-saved-btn').forEach(b => {
      b.addEventListener('click', async (e) => {
        const id = b.getAttribute('data-id');
        if (id) {
          await window.EthioFavorites.deleteSavedItem(id);
          render(container);
        }
      });
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ethio_theme', next);

    const icon = document.getElementById('theme-icon');
    const label = document.getElementById('theme-label');
    if (icon) icon.textContent = next === 'dark' ? '☀️' : '🌙';
    if (label) label.textContent = next === 'dark' ? 'Light Mode' : 'Dark Mode';
  }

  return {
    render: render,
    toggleTheme: toggleTheme
  };
})();
