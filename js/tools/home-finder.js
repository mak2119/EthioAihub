/**
 * ETHIO AI HUB - Home Finder & Real Estate Marketplace
 * Features:
 *   - Rental & Sale property listings with Addis Ababa sub-city and price filters
 *   - User Property submission workflow
 *   - Rental & Broker Check tab with scam alerts, contract review, and broker reporting
 *   - Never labels any broker as "verified"
 *   - Disclaims: "ይህ ምክር የህግ ባለሙያን አይተካም።"
 *   - AI Home Assistant matching tool
 */

window.EthioTools_HomeFinder = (function() {
  let activeTab = 'listings';

  const defaultListings = [
    {
      id: 'prop_1',
      title: 'ዘመናዊ ባለ 2 መኝታ ኮንዶሚኒየም ቤት (Bole Bulbula)',
      type: 'rent',
      category: 'Apartment',
      city: 'Addis Ababa',
      subCity: 'Bole',
      neighborhood: 'Bulbula 93 Mazoriya',
      price: 25000,
      priceLabel: '25,000 ETB / ወር',
      bedrooms: 2,
      bathrooms: 2,
      contactPhone: '0911002233',
      contactName: 'አቶ ዳንኤል (ባለቤት)',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      description: 'ምቹ ሳሎን፣ ዘመናዊ የወጥ ቤት ካቢኔት ያለው፣ 24 ሰዓት የውሃ ታንከር እና የጥበቃ አገልግሎት ያለው።'
    },
    {
      id: 'prop_2',
      title: 'ባለ 3 መኝታ ቪላ ቤት ለሽያጭ (CMC)',
      type: 'sale',
      category: 'Villa',
      city: 'Addis Ababa',
      subCity: 'Yeka',
      neighborhood: 'CMC Michael',
      price: 18500000,
      priceLabel: '18,500,000 ETB',
      bedrooms: 3,
      bathrooms: 3,
      contactPhone: '0922334455',
      contactName: 'ወ/ሮ ትዕግስት',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
      description: '250 ካሬ ሜትር ይዞታ፣ ካርታ ያለው፣ ለ 3 መኪና ማቆሚያ እና የሰራተኛ ክፍል ያለው።'
    },
    {
      id: 'prop_3',
      title: 'ዋና አስፋልት ዳር የንግድ ሱቅ ወይም ቢሮ (Mexico)',
      type: 'commercial',
      category: 'Commercial',
      city: 'Addis Ababa',
      subCity: 'Kirkos',
      neighborhood: 'Mexico Square',
      price: 45000,
      priceLabel: '45,000 ETB / ወር',
      bedrooms: 0,
      bathrooms: 1,
      contactPhone: '0933445566',
      contactName: 'አበበ ደላላ (Broker)',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      description: '60 ካሬ ሜትር፣ ለፋርማሲ፣ ለካፌ ወይም ለቢሮ ምቹ የሆነ፣ የጀነሬተር አገልግሎት ያለው።'
    }
  ];

  function render(container) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    container.innerHTML = `
      <div class="tool-header-banner">
        <div class="tool-header-left">
          <div class="tool-header-icon" style="background-color: #ffedd5; color: #ea580c;">
            🏠
          </div>
          <div>
            <h2 style="font-size: 1.25rem;">${t('navHomeFinder')}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              የቤትና ንብረት የገበያ መድረክ፣ የኪራይ ውል አጠራጣሪ አንቀጾች ፍተሻ እና የ AI አማካሪ
            </p>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="btn-post-property" class="btn btn-primary btn-sm">
            <span>+</span> <span>${t('postPropertyBtn')}</span>
          </button>
        </div>
      </div>

      <div class="tool-tabs">
        <button class="tab-btn ${activeTab === 'listings' ? 'active' : ''}" data-tab="listings">
          🏘️ የቤት ማስታወቂያዎች (Listings)
        </button>
        <button class="tab-btn ${activeTab === 'broker-check' ? 'active' : ''}" data-tab="broker-check">
          🛡️ የውል እና ደላላ ፍተሻ (Rental & Broker Check)
        </button>
        <button class="tab-btn ${activeTab === 'ai-home' ? 'active' : ''}" data-tab="ai-home">
          🤖 የ AI ቤት አማካሪ (AI Home Assistant)
        </button>
      </div>

      <div id="home-finder-content"></div>
    `;

    // Tab bindings
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        render(container);
      });
    });

    const postBtn = document.getElementById('btn-post-property');
    if (postBtn) {
      postBtn.addEventListener('click', openPostPropertyModal);
    }

    const contentBox = document.getElementById('home-finder-content');
    if (activeTab === 'listings') {
      renderListings(contentBox);
    } else if (activeTab === 'broker-check') {
      renderBrokerCheck(contentBox);
    } else if (activeTab === 'ai-home') {
      renderAiHomeAssistant(contentBox);
    }
  }

  function renderListings(box) {
    box.innerHTML = `
      <!-- Filters -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px;">
        <select id="filter-type">
          <option value="">ሁሉም አይነት (Rent & Sale)</option>
          <option value="rent">የሚከራይ (Rent)</option>
          <option value="sale">የሚሸጥ (Sale)</option>
          <option value="commercial">ለንግድ (Commercial)</option>
        </select>

        <select id="filter-subcity">
          <option value="">ሁሉም ክፍለ ከተማ (Sub-City)</option>
          <option value="Bole">ቦሌ (Bole)</option>
          <option value="Yeka">የካ (Yeka)</option>
          <option value="Kirkos">ቂርቆስ (Kirkos)</option>
          <option value="Nifas Silk">ንፋስ ስልክ (Nifas Silk)</option>
          <option value="Kolfe">ኮልፌ (Kolfe Keranio)</option>
          <option value="Arada">አራዳ (Arada)</option>
        </select>

        <select id="filter-bedrooms">
          <option value="">የመኝታ ክፍል ብዛት</option>
          <option value="1">1 መኝታ</option>
          <option value="2">2 መኝታ</option>
          <option value="3">3+ መኝታ</option>
        </select>

        <input type="number" id="filter-max-price" placeholder="ከፍተኛ ዋጋ (Max ETB)">
      </div>

      <!-- Listings Grid -->
      <div class="listings-grid">
        ${defaultListings.map(item => `
          <div class="listing-card">
            <img src="${item.image}" alt="${item.title}" class="listing-img" onerror="this.src='https://placehold.co/600x400?text=House+Image'">
            <div class="listing-body">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge ${item.type === 'rent' ? 'badge-free' : (item.type === 'sale' ? 'badge-business' : 'badge-premium')}">
                  ${item.type.toUpperCase()}
                </span>
                <span class="listing-price">${item.priceLabel}</span>
              </div>
              <h3 class="listing-title">${item.title}</h3>
              <div class="listing-meta">
                <span>📍 ${item.neighborhood}, ${item.subCity}</span>
                ${item.bedrooms ? `<span>🛏️ ${item.bedrooms} መኝታ</span>` : ''}
              </div>
              <p style="font-size: 0.825rem; color: var(--text-muted); line-height: 1.4;">${item.description}</p>
              
              <div style="margin-top: 8px; padding-top: 10px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-main);">
                  📞 ${item.contactPhone} (${item.contactName})
                </span>
                <button class="btn btn-secondary btn-sm bookmark-prop-btn" data-id="${item.id}" data-title="${item.title}">
                  ⭐
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Filter logic
    const filterType = document.getElementById('filter-type');
    const filterSub = document.getElementById('filter-subcity');
    const filterBed = document.getElementById('filter-bedrooms');
    const filterMax = document.getElementById('filter-max-price');

    const updateFilter = () => {
      const type = filterType.value;
      const sub = filterSub.value.toLowerCase();
      const bed = filterBed.value;
      const max = parseFloat(filterMax.value) || Infinity;

      box.querySelectorAll('.listing-card').forEach((card, idx) => {
        const item = defaultListings[idx];
        if (!item) return;
        const matchesType = !type || item.type === type;
        const matchesSub = !sub || item.subCity.toLowerCase().includes(sub);
        const matchesBed = !bed || item.bedrooms >= parseInt(bed);
        const matchesPrice = item.price <= max;

        card.style.display = matchesType && matchesSub && matchesBed && matchesPrice ? 'flex' : 'none';
      });
    };

    filterType.addEventListener('change', updateFilter);
    filterSub.addEventListener('change', updateFilter);
    filterBed.addEventListener('change', updateFilter);
    filterMax.addEventListener('input', updateFilter);

    // Bookmarks
    box.querySelectorAll('.bookmark-prop-btn').forEach(b => {
      b.addEventListener('click', async () => {
        const title = b.getAttribute('data-title');
        await window.EthioFavorites.saveItem('property', { title: title });
      });
    });
  }

  function renderBrokerCheck(box) {
    box.innerHTML = `
      <div style="max-width: 850px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Safety Banner & Required Legal Notice -->
        <div class="safety-warning-banner">
          <span style="font-size: 1.6rem;">🛡️</span>
          <div>
            <h3 style="font-size: 1.1rem; margin-bottom: 4px;">የቤት ኪራይና ግዢ ደህንነት ጥንቃቄዎች (Safety Checklist)</h3>
            <p style="font-size: 0.88rem; margin-bottom: 8px;">
              ለማንኛውም ደላላ ወይም አከራይ ክፍያ ከመፈጸምዎ በፊት የሚከተሉትን ህጎች ያረጋግጡ፡
            </p>
            <ul style="font-size: 0.85rem; padding-left: 18px; display: flex; flex-direction: column; gap: 4px;">
              <li><strong>ዋናውን የይዞታ ማረጋገጫ (Original Title Deed / ካርታ) በአካል ይመልከቱ።</strong></li>
              <li><strong>ትክክለኛውን የቤት ባለቤት በአካል ያግኙ፤</strong> ተወካይ ከሆነ ህጋዊ የውክልና ማስረጃ ያረጋግጡ።</li>
              <li><strong>ቤቱን በአካል ገብተው ይፈትሹ፤</strong> ቁልፉን ሳያረጋግጡ እና ውል ሳይፈራረሙ ቅድመ-ክፍያ አይክፈሉ።</li>
              <li><strong>ለማንኛውም ክፍያ ህጋዊ የባንክ ወይም የቴሌብር ደረሰኝ ይጠይቁ።</strong></li>
              <li><strong>ማሳሰቢያ፡</strong> በ ETHIO AI HUB ላይ ማንም ደላላ "የተረጋገጠ (Verified)" ተብሎ አይሰየምም!</li>
            </ul>
            <div class="legal-notice" style="text-align: left; font-weight: 700; color: #7f1d1d; margin-top: 10px;">
              "ይህ ምክር የህግ ባለሙያን አይተካም።"
            </div>
          </div>
        </div>

        <!-- AI Rental Agreement Clause Checker -->
        <div class="card">
          <h3 style="font-size: 1.15rem; margin-bottom: 10px;">የኪራይ ውል ስምምነት አጠራጣሪ አንቀጾች ፍተሻ (Clause Analyzer)</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
            የተሰጠዎትን የኪራይ ውል ረቂቅ እዚህ ይለጥፉ፤ AI አጠራጣሪ ወይም ለአከራዩ ብቻ ያደሉ ያልተለመዱ አንቀጾችን (Unfair Clauses) ፈትሾ ያብራራልዎታል።
          </p>

          <div class="form-group">
            <textarea id="contract-input" rows="6" placeholder="የኪራይ ውል ስምምነቱን ጽሁፍ እዚህ ይለጥፉ..."></textarea>
          </div>

          <button id="btn-analyze-contract" class="btn btn-primary">
            <span>🔍</span> <span>ውሉን በ AI ፈትሽ</span>
          </button>

          <div id="contract-result-box" style="margin-top: 16px; display: none;">
            <h4 style="margin-bottom: 8px; color: var(--primary);">የ AI የውል ትንተና ውጤት:</h4>
            <div id="contract-result-text" style="white-space: pre-wrap; font-size: 0.9rem; line-height: 1.6; background: var(--bg-main); padding: 14px; border-radius: var(--radius-md);"></div>
          </div>
        </div>

        <!-- Report Suspicious Broker Form -->
        <div class="card">
          <h3 style="font-size: 1.15rem; margin-bottom: 10px; color: var(--ruby);">
            አጠራጣሪ ወይም አጭበርባሪ ደላላ ጥቆማ (Report Suspicious Broker)
          </h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
            ያልተገባ ድርጊት የፈጸመ ደላላን ይጠቁሙ። ጥቆማዎች በአስተዳዳሪው ተገምግመው ማረጋገጫ እስኪያገኙ ድረስ ለህዝብ ይፋ አይደረጉም።
          </p>

          <form id="report-broker-form">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-bottom: 12px;">
              <div class="form-group">
                <label class="form-label">የደላላው ስም</label>
                <input type="text" id="rep-name" required placeholder="ስም">
              </div>
              <div class="form-group">
                <label class="form-label">የደላላው ስልክ ቁጥር</label>
                <input type="tel" id="rep-phone" required placeholder="09...">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">የጥቆማው ምክንያት እና ዝርዝር ሁኔታ</label>
              <textarea id="rep-reason" rows="3" required placeholder="የተፈጠረውን ችግር ወይም የማጭበርበር ሙከራ ይግለጹ..."></textarea>
            </div>

            <button type="submit" class="btn btn-danger">
              ጥቆማውን ላክ (Submit Report)
            </button>
          </form>
        </div>

      </div>
    `;

    // Contract AI
    const analyzeBtn = document.getElementById('btn-analyze-contract');
    analyzeBtn.addEventListener('click', async () => {
      const text = document.getElementById('contract-input').value.trim();
      if (!text) {
        alert("እባክዎ የውሉን ጽሁፍ ያስገቡ");
        return;
      }

      analyzeBtn.disabled = true;
      analyzeBtn.innerHTML = `<span class="spinner"></span> ውሉን በመፈተሽ ላይ...`;

      try {
        const prompt = `Analyze this Ethiopian rental contract agreement draft for potentially unfair, risky, or suspicious clauses against the tenant. Point out ambiguous deposit terms, arbitrary eviction clauses, maintenance liability, or rent increase terms. Include the mandatory legal notice disclaimer: "ይህ ምክር የህግ ባለሙያን አይተካም።". Contract: \n\n${text}`;
        const res = await window.EthioAPI.callAI('home-finder', prompt);
        document.getElementById('contract-result-box').style.display = 'block';
        document.getElementById('contract-result-text').textContent = res;
      } catch (e) {
        alert(e.message);
      } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = `<span>🔍</span> <span>ውሉን በ AI ፈትሽ</span>`;
      }
    });

    // Report Broker form
    const repForm = document.getElementById('report-broker-form');
    repForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
      if (!user) {
        alert("ጥቆማ ለማስገባት እባክዎ መለያዎ ውስጥ ይግቡ");
        return;
      }

      const name = document.getElementById('rep-name').value;
      const phone = document.getElementById('rep-phone').value;
      const reason = document.getElementById('rep-reason').value;

      const db = window.EthioFirebase ? window.EthioFirebase.getDb() : null;
      if (db) {
        await db.collection('brokerReports').add({
          brokerName: name,
          brokerPhone: phone,
          reason: reason,
          reportedBy: user.email,
          status: 'pending_review',
          createdAt: new Date().toISOString()
        });
      }

      repForm.reset();
      if (window.EthioNotifications) {
        window.EthioNotifications.showToast("ጥቆማዎ ደርሶናል፤ በአስተዳዳሪው እየታየ ነው።", 'info');
      }
    });
  }

  function renderAiHomeAssistant(box) {
    box.innerHTML = `
      <div class="card" style="max-width: 800px; margin: 0 auto;">
        <h3 style="font-size: 1.15rem; margin-bottom: 8px;">የ AI ቤት አማካሪ (AI Home Matching)</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
          የሚፈልጉትን የቤት አይነት፣ በጀት እና አካባቢ በራስዎ አነጋገር ይግለጹ፤ AI ከገበያው ካታሎግ ጋር አነጻጽሮ ተስማሚውን ያቀርብልዎታል።
        </p>

        <div class="form-group">
          <textarea id="ai-home-prompt" rows="3" placeholder="ምሳሌ፡ በቦሌ ወይም በሲኤምሲ አካባቢ በወር እስከ 30,000 ብር የሚከራይ ባለ 2 መኝታ ዘመናዊ ቤት እፈልጋለሁ..."></textarea>
        </div>

        <button id="btn-ai-match-home" class="btn btn-primary">
          <span>✨</span> <span>ተስማሚ ቤቶችን ፈልግልኝ</span>
        </button>

        <div id="ai-home-results" style="margin-top: 20px; display: none;">
          <h4 style="margin-bottom: 8px; color: var(--primary);">የተገኙ የቤት አማራጮች:</h4>
          <div id="ai-home-match-text" style="white-space: pre-wrap; font-size: 0.9rem; line-height: 1.6; background: var(--bg-main); padding: 14px; border-radius: var(--radius-md);"></div>
        </div>
      </div>
    `;

    const matchBtn = document.getElementById('btn-ai-match-home');
    matchBtn.addEventListener('click', async () => {
      const q = document.getElementById('ai-home-prompt').value.trim();
      if (!q) {
        alert("እባክዎ ፍላጎትዎን ይግለጹ");
        return;
      }

      matchBtn.disabled = true;
      matchBtn.innerHTML = `<span class="spinner"></span> በመፈለግ ላይ...`;

      try {
        const prompt = `A user is looking for real estate in Ethiopia with this request: "${q}".
Here is the available verified catalog:
${JSON.stringify(defaultListings, null, 2)}

Match their criteria against the catalog. If a suitable listing exists, recommend it with price and contact phone. If no suitable listing exists, clearly explain that no matching property was found.`;

        const res = await window.EthioAPI.callAI('home-finder', prompt);
        document.getElementById('ai-home-results').style.display = 'block';
        document.getElementById('ai-home-match-text').textContent = res;
      } catch (err) {
        alert(err.message);
      } finally {
        matchBtn.disabled = false;
        matchBtn.innerHTML = `<span>✨</span> <span>ተስማሚ ቤቶችን ፈልግልኝ</span>`;
      }
    });
  }

  function openPostPropertyModal() {
    const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
    if (!user) {
      alert("የቤት ማስታወቂያ ለማስገባት እባክዎ መለያዎ ውስጥ ይግቡ");
      return;
    }

    const modal = document.getElementById('post-property-modal');
    if (modal) modal.classList.add('active');
  }

  return {
    render: render
  };
})();
