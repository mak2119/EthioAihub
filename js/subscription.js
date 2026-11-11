/**
 * ETHIO AI HUB - Subscription & TeleBirr Manual Payment Management
 * Manages Free, Premium (250 ETB/mo), Business (600 ETB/mo) plans,
 * TeleBirr transaction verification requests, and subscription expiration.
 */

window.EthioSubscription = (function() {
  const PLANS = {
    free: {
      nameKey: 'planFree',
      monthlyPrice: 0,
      annualPrice: 0,
      dailyLimit: 12,
      notificationDelay: '8 ሰዓት (8 Hours)',
      academyAccess: 'የተወሰነ (Limited)',
      color: '#475569'
    },
    premium: {
      nameKey: 'planPremium',
      monthlyPrice: 250,
      annualPrice: 2700, // 10% discount
      dailyLimit: 50,
      notificationDelay: '1 ሰዓት (1 Hour)',
      academyAccess: 'በቅናሽ (Discounted)',
      color: '#d97706'
    },
    business: {
      nameKey: 'planBusiness',
      monthlyPrice: 600,
      annualPrice: 6480, // 10% discount
      dailyLimit: Infinity,
      notificationDelay: 'ፈጣን (Instant)',
      academyAccess: 'ሙሉ በሙሉ ክፍት (All Included)',
      color: '#059669'
    }
  };

  // Default TeleBirr receiver config (can be updated via Firestore settings)
  let telebirrSettings = {
    receiverPhone: "0911234567",
    receiverName: "ETHIO AI HUB / TADE APPS"
  };

  async function init() {
    loadTelebirrSettings();
    checkSubscriptionExpiration();
  }

  async function loadTelebirrSettings() {
    try {
      const db = window.EthioFirebase ? window.EthioFirebase.getDb() : null;
      if (db) {
        const doc = await db.collection('settings').doc('payment').get();
        if (doc.exists && doc.data()) {
          telebirrSettings = { ...telebirrSettings, ...doc.data() };
        }
      }
    } catch (e) {
      console.warn("Using default TeleBirr receiving settings:", e);
    }
  }

  async function checkSubscriptionExpiration() {
    const profile = window.EthioAuth ? window.EthioAuth.getProfile() : null;
    const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
    if (!profile || !user || profile.plan === 'free') return;

    if (profile.endDate) {
      const now = new Date().getTime();
      const expiry = new Date(profile.endDate).getTime();
      if (now > expiry) {
        console.log("Subscription expired. Reverting to Free tier.");
        const db = window.EthioFirebase ? window.EthioFirebase.getDb() : null;
        if (db) {
          await db.collection('users').doc(user.uid).set({
            plan: 'free',
            subscriptionStatus: 'expired'
          }, { merge: true });
          profile.plan = 'free';
          profile.subscriptionStatus = 'expired';
          window.EthioAuth.updateUserUI();
          if (window.EthioNotifications) {
            window.EthioNotifications.showToast("የደንበኝነት ጊዜዎ አልቋል፤ ወደ ነጻ እቅድ ተመልሰዋል።", "warning");
          }
        }
      }
    }
  }

  function openPaymentModal(selectedPlan = 'premium') {
    const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    if (!user) {
      if (window.EthioNotifications) {
        window.EthioNotifications.showToast(t('mustLogin'), 'warning');
      }
      window.location.hash = '#/login';
      return;
    }

    const modalOverlay = document.getElementById('payment-modal');
    if (!modalOverlay) return;

    // Set form fields
    const planSelect = document.getElementById('pay-plan-select');
    if (planSelect) planSelect.value = selectedPlan;
    
    updatePriceDisplay();
    modalOverlay.classList.add('active');
  }

  function closePaymentModal() {
    const modalOverlay = document.getElementById('payment-modal');
    if (modalOverlay) modalOverlay.classList.remove('active');
  }

  function updatePriceDisplay() {
    const planSelect = document.getElementById('pay-plan-select');
    const periodSelect = document.getElementById('pay-period-select');
    const amountDisplay = document.getElementById('pay-amount-display');
    const phoneDisplay = document.getElementById('pay-phone-display');
    const nameDisplay = document.getElementById('pay-name-display');

    if (!planSelect || !periodSelect || !amountDisplay) return;

    const plan = planSelect.value;
    const period = periodSelect.value;
    const planInfo = PLANS[plan] || PLANS.premium;

    const amount = period === 'annual' ? planInfo.annualPrice : planInfo.monthlyPrice;
    amountDisplay.textContent = `${amount.toLocaleString()} ETB (የኢትዮጵያ ብር)`;

    if (phoneDisplay) phoneDisplay.textContent = telebirrSettings.receiverPhone;
    if (nameDisplay) nameDisplay.textContent = telebirrSettings.receiverName;
  }

  async function submitPaymentRequest(e) {
    if (e && e.preventDefault) e.preventDefault();
    const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    if (!user) {
      alert(t('mustLogin'));
      return;
    }

    const plan = document.getElementById('pay-plan-select').value;
    const period = document.getElementById('pay-period-select').value;
    const txId = document.getElementById('pay-txid-input').value.trim();
    const payDate = document.getElementById('pay-date-input').value;
    const screenshotInput = document.getElementById('pay-screenshot-input');

    if (!txId) {
      alert("እባክዎ የቴሌብር ደረሰኝ ቁጥር (Transaction ID) ያስገቡ");
      return;
    }

    const planInfo = PLANS[plan] || PLANS.premium;
    const amount = period === 'annual' ? planInfo.annualPrice : planInfo.monthlyPrice;

    // Handle mock image or file name
    let screenshotUrl = "telebirr_receipt_" + Date.now() + ".png";
    if (screenshotInput && screenshotInput.files && screenshotInput.files[0]) {
      screenshotUrl = screenshotInput.files[0].name;
    }

    const db = window.EthioFirebase ? window.EthioFirebase.getDb() : null;
    if (!db) return;

    const reqData = {
      uid: user.uid,
      userEmail: user.email,
      plan: plan,
      billingPeriod: period,
      amount: amount,
      transactionId: txId,
      screenshotUrl: screenshotUrl,
      paymentDate: payDate || new Date().toISOString().slice(0, 10),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await db.collection('paymentRequests').add(reqData);
      closePaymentModal();
      if (window.EthioNotifications) {
        window.EthioNotifications.showToast(t('paymentPendingNotice'), 'success');
      }
      // Clear inputs
      document.getElementById('pay-txid-input').value = '';
    } catch (err) {
      alert(t('error') + ": " + err.message);
    }
  }

  // Admin function to approve payment request
  async function adminApprovePayment(requestId, uid, plan, billingPeriod) {
    const db = window.EthioFirebase.getDb();
    const startDate = new Date();
    const endDate = new Date();

    if (billingPeriod === 'annual') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Update payment request status
    await db.collection('paymentRequests').doc(requestId).update({
      status: 'approved',
      approvedAt: new Date().toISOString()
    });

    // Update user subscription
    await db.collection('users').doc(uid).update({
      plan: plan,
      subscriptionStatus: 'active',
      billingPeriod: billingPeriod,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    if (window.EthioNotifications) {
      window.EthioNotifications.showToast("ክፍያው ጸድቋል! የደንበኝነት እቅዱ ነቅቷል።", 'success');
    }
  }

  return {
    init: init,
    PLANS: PLANS,
    openPaymentModal: openPaymentModal,
    closePaymentModal: closePaymentModal,
    updatePriceDisplay: updatePriceDisplay,
    submitPaymentRequest: submitPaymentRequest,
    adminApprovePayment: adminApprovePayment,
    getTelebirrSettings: () => telebirrSettings
  };
})();
