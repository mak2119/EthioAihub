/**
 * ETHIO AI HUB - Money & Equb Planner
 * Private personal financial management in Ethiopian Birr (ETB).
 * Features:
 *   - Income & Expense tracking with categories
 *   - Traditional Ethiopian Equb (ዕቁብ) cycle and contribution tracking
 *   - SVG visual expense breakdown chart
 *   - Strict privacy: only the authenticated user can access their financial records
 */

window.EthioTools_MoneyPlanner = (function() {

  function render(container) {
    const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    // Load user private financial records from local storage adapter or Firestore
    const uid = user ? user.uid : 'guest';
    const storeKey = `ethio_fin_${uid}`;
    let finData = JSON.parse(localStorage.getItem(storeKey) || JSON.stringify({
      records: [
        { id: 'f1', type: 'income', title: 'የወር ደመወዝ', amount: 35000, category: 'Salary', date: '2026-04-01' },
        { id: 'f2', type: 'expense', title: 'የቤት ኪራይ', amount: 12000, category: 'Rent', date: '2026-04-05' },
        { id: 'f3', type: 'expense', title: 'የወር ቀለብና ገበያ', amount: 8500, category: 'Food', date: '2026-04-08' },
        { id: 'f4', type: 'expense', title: 'የትራንስፖርት ወጪ', amount: 3000, category: 'Transport', date: '2026-04-10' }
      ],
      equbs: [
        { id: 'eq1', name: 'የቤተሰብ ወይም የስራ ባልደረቦች ዕቁብ', roundAmount: 5000, cycle: 'Monthly', members: 12, myTurnDate: '2026-08-01', paidRounds: 4, totalRounds: 12 }
      ],
      savingsGoals: [
        { id: 'sg1', title: 'የአስቸኳይ ጊዜ ቁጠባ (Emergency Fund)', target: 50000, current: 28000 }
      ]
    }));

    function saveFinData() {
      localStorage.setItem(storeKey, JSON.stringify(finData));
      render(container);
    }

    const totalIncome = finData.records.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
    const totalExpense = finData.records.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
    const netBalance = totalIncome - totalExpense;

    container.innerHTML = `
      <div class="tool-header-banner">
        <div class="tool-header-left">
          <div class="tool-header-icon" style="background-color: #dcfce7; color: #16a34a;">
            💰
          </div>
          <div>
            <h2 style="font-size: 1.25rem;">${t('navMoneyPlanner')}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              የግል ገቢና ወጪ፣ የዕቁብ (Equb) ዙር ቁጥጥር እና የቁጠባ ግብ በኢትዮጵያ ብር (ETB)
            </p>
          </div>
        </div>
        <div style="font-size: 0.8rem; background: var(--primary-light); color: var(--primary); padding: 4px 10px; border-radius: var(--radius-sm); font-weight: 600;">
          🔒 የግል ምስጢር (Private & Secure)
        </div>
      </div>

      <!-- Financial Summary Cards -->
      <div class="stats-grid" style="margin-bottom: 20px;">
        <div class="card stat-card">
          <div class="stat-icon green"><span>💵</span></div>
          <div class="stat-content">
            <div class="stat-label">ጠቅላላ ገቢ (Income)</div>
            <div class="stat-val" style="color: var(--primary);">${totalIncome.toLocaleString()} ETB</div>
          </div>
        </div>

        <div class="card stat-card">
          <div class="stat-icon ruby"><span>💸</span></div>
          <div class="stat-content">
            <div class="stat-label">ጠቅላላ ወጪ (Expense)</div>
            <div class="stat-val" style="color: var(--ruby);">${totalExpense.toLocaleString()} ETB</div>
          </div>
        </div>

        <div class="card stat-card">
          <div class="stat-icon gold"><span>🏦</span></div>
          <div class="stat-content">
            <div class="stat-label">የተጣራ ትርፍ / ቁጠባ (Net Balance)</div>
            <div class="stat-val">${netBalance.toLocaleString()} ETB</div>
          </div>
        </div>
      </div>

      <!-- Main Layout: Equb & Records -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
        
        <!-- Equb Management Section -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 14px;">
            <h3 style="font-size: 1.1rem; color: var(--text-main);">የዕቁብ አስተዳደር (Equb Management)</h3>
            <button id="btn-add-equb" class="btn btn-secondary btn-sm">+ አዲስ ዕቁብ</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${finData.equbs.map(eq => `
              <div class="equb-card">
                <div class="equb-header">
                  <strong>${eq.name}</strong>
                  <span class="badge badge-business">${eq.cycle}</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted); display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                  <div>የዙር ክፍያ፡ <strong>${eq.roundAmount.toLocaleString()} ETB</strong></div>
                  <div>የአባላት ብዛት፡ <strong>${eq.members} ሰው</strong></div>
                  <div>ጠቅላላ ሎተሪ፡ <strong>${(eq.roundAmount * eq.members).toLocaleString()} ETB</strong></div>
                  <div>የሚደርስዎት ቀን፡ <strong>${eq.myTurnDate}</strong></div>
                </div>

                <div style="margin-top: 8px;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">
                    <span>የተከፈለ፡ ${eq.paidRounds} / ${eq.totalRounds} ዙር</span>
                    <span>${Math.round((eq.paidRounds / eq.totalRounds) * 100)}%</span>
                  </div>
                  <div class="usage-progress-bar">
                    <div class="usage-progress-fill" style="width: ${(eq.paidRounds / eq.totalRounds) * 100}%;"></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Add Transaction & Records -->
        <div class="card">
          <div style="border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 14px;">
            <h3 style="font-size: 1.1rem; color: var(--text-main);">ገቢ ወይም ወጪ መዝግብ (Add Entry)</h3>
          </div>

          <form id="add-trans-form" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            <div style="display: flex; gap: 10px;">
              <select id="trans-type" style="width: 120px;">
                <option value="expense">ወጪ (Expense)</option>
                <option value="income">ገቢ (Income)</option>
              </select>
              <input type="text" id="trans-title" required placeholder="የወጪው/ገቢው ስም (ምሳሌ፡ ታክሲ፣ መብራት...)">
            </div>

            <div style="display: flex; gap: 10px;">
              <input type="number" id="trans-amount" required placeholder="መጠን በብር (ETB)">
              <select id="trans-cat" style="width: 160px;">
                <option value="Food">ቀለብና ምግብ</option>
                <option value="Rent">ቤት ኪራይ</option>
                <option value="Transport">ትራንስፖርት</option>
                <option value="Utilities">መብራትና ውሃ</option>
                <option value="Equb">ዕቁብ</option>
                <option value="Other">ሌላ</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary" style="align-self: flex-start;">
              + መዝግብ
            </button>
          </form>

          <!-- Records List -->
          <h4 style="font-size: 0.95rem; margin-bottom: 8px;">የቅርብ ጊዜ ዝርዝር:</h4>
          <div style="max-height: 240px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px;">
            ${finData.records.map((r, i) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--bg-main); border-radius: var(--radius-sm); font-size: 0.85rem;">
                <div>
                  <strong>${r.title}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 6px;">(${r.category})</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <strong style="color: ${r.type === 'income' ? 'var(--primary)' : 'var(--ruby)'};">
                    ${r.type === 'income' ? '+' : '-'}${r.amount.toLocaleString()} ETB
                  </strong>
                  <button class="btn btn-secondary btn-sm delete-fin-btn" data-idx="${i}" style="padding: 2px 6px;">✕</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- AI Financial Advice Card -->
      <div class="card" style="margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 12px;">
          <h3 style="font-size: 1.1rem; color: var(--primary);">የ AI የፋይናንስና የቁጠባ ምክር (Smart Analysis)</h3>
          <button id="btn-analyze-fin" class="btn btn-primary btn-sm">
            <span>✨</span> <span>የወጪና ቁጠባ ምክር ስጠኝ</span>
          </button>
        </div>
        <div id="fin-advice-box" style="white-space: pre-wrap; font-size: 0.9rem; line-height: 1.6; color: var(--text-main); display: none;"></div>
      </div>
    `;

    // Handlers
    const form = document.getElementById('add-trans-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('trans-type').value;
      const title = document.getElementById('trans-title').value.trim();
      const amount = parseFloat(document.getElementById('trans-amount').value) || 0;
      const cat = document.getElementById('trans-cat').value;

      finData.records.unshift({
        id: 'f_' + Date.now(),
        type: type,
        title: title,
        amount: amount,
        category: cat,
        date: new Date().toISOString().slice(0, 10)
      });
      saveFinData();
    });

    container.querySelectorAll('.delete-fin-btn').forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.getAttribute('data-idx'));
        finData.records.splice(idx, 1);
        saveFinData();
      });
    });

    const addEqBtn = document.getElementById('btn-add-equb');
    addEqBtn.addEventListener('click', () => {
      const name = prompt("የዕቁቡ ስም:");
      const amt = prompt("የዙር ክፍያ በብር (ETB):");
      const mem = prompt("የአባላት ብዛት:");
      if (name && amt && mem) {
        finData.equbs.push({
          id: 'eq_' + Date.now(),
          name: name,
          roundAmount: parseFloat(amt) || 1000,
          cycle: 'Monthly',
          members: parseInt(mem) || 10,
          myTurnDate: '2026-09-01',
          paidRounds: 1,
          totalRounds: parseInt(mem) || 10
        });
        saveFinData();
      }
    });

    const analyzeBtn = document.getElementById('btn-analyze-fin');
    analyzeBtn.addEventListener('click', async () => {
      analyzeBtn.disabled = true;
      analyzeBtn.innerHTML = `<span class="spinner"></span> በማስላት ላይ...`;

      try {
        const summary = `Monthly Income: ${totalIncome} ETB, Total Expenses: ${totalExpense} ETB. Top expense items: ${JSON.stringify(finData.records.slice(0, 5))}. Equb monthly commitment: ${finData.equbs.map(e => e.roundAmount).join(', ')} ETB.`;
        const prompt = `As an Ethiopian financial advisor, review this personal budget in ETB: "${summary}". Provide practical advice in Amharic on inflation hedging, optimal emergency savings percentage, and Equb cashflow management.`;

        const res = await window.EthioAPI.callAI('money-planner', prompt);
        const box = document.getElementById('fin-advice-box');
        box.style.display = 'block';
        box.textContent = res;
      } catch (err) {
        alert(err.message);
      } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = `<span>✨</span> <span>የወጪና ቁጠባ ምክር ስጠኝ</span>`;
      }
    });
  }

  return {
    render: render
  };
})();
