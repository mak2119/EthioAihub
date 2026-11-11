/**
 * ETHIO AI HUB - Authentication Manager
 * Handles Email/Password Auth, Firestore user profile creation, session management,
 * and localized error messaging.
 */

window.EthioAuth = (function() {
  let currentUser = null;
  let userProfile = null;
  const authListeners = [];

  function init() {
    const auth = window.EthioFirebase.getAuth();
    if (!auth) return;

    auth.onAuthStateChanged(async function(user) {
      currentUser = user;
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        userProfile = null;
      }
      notifyListeners();
      handleAuthRedirect();
    });
  }

  async function loadUserProfile(uid) {
    try {
      const db = window.EthioFirebase.getDb();
      const userDocRef = db.collection('users').doc(uid);
      const doc = await userDocRef.get();

      if (doc.exists) {
        userProfile = doc.data();
      } else {
        // Fallback default profile
        userProfile = {
          name: currentUser.displayName || currentUser.email.split('@')[0],
          email: currentUser.email,
          plan: 'free',
          subscriptionStatus: 'active',
          preferredLanguage: window.EthioLanguage ? window.EthioLanguage.getLanguage() : 'am',
          createdAt: new Date().toISOString(),
          dailyUsage: {
            date: new Date().toISOString().slice(0, 10),
            count: 0
          }
        };
        await userDocRef.set(userProfile);
      }

      // Check daily chat counter reset
      const today = new Date().toISOString().slice(0, 10);
      if (!userProfile.dailyUsage || userProfile.dailyUsage.date !== today) {
        userProfile.dailyUsage = { date: today, count: 0 };
        await userDocRef.set(userProfile, { merge: true });
      }

      // Update UI Header / Sidebar user info
      updateUserUI();
    } catch (err) {
      console.error("Error loading user profile:", err);
    }
  }

  async function register(fullName, email, password, confirmPassword, agreeTerms) {
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;
    
    if (!fullName || !email || !password || !confirmPassword) {
      throw new Error(t('error') + ": እባክዎ ሁሉንም መረጃዎች ይሙሉ");
    }
    if (password !== confirmPassword) {
      throw new Error("የይለፍ ቃሎች አይመሳሰሉም");
    }
    if (password.length < 6) {
      throw new Error("የይለፍ ቃል ቢያንስ 6 ፊደላት ሊኖረው ይገባል");
    }
    if (!agreeTerms) {
      throw new Error("እባክዎ በአገልግሎት ደንቡ እና በግላዊነት ፖሊሲው ይስማሙ");
    }

    const auth = window.EthioFirebase.getAuth();
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    const user = cred.user;

    // Create users/{uid} document in Firestore
    const db = window.EthioFirebase.getDb();
    const newProfile = {
      name: fullName,
      email: email.toLowerCase(),
      plan: 'free',
      subscriptionStatus: 'active',
      preferredLanguage: window.EthioLanguage ? window.EthioLanguage.getLanguage() : 'am',
      createdAt: new Date().toISOString(),
      dailyUsage: {
        date: new Date().toISOString().slice(0, 10),
        count: 0
      }
    };

    await db.collection('users').doc(user.uid).set(newProfile);
    userProfile = newProfile;
    updateUserUI();
    return user;
  }

  async function login(email, password) {
    if (!email || !password) {
      throw new Error("እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ");
    }
    const auth = window.EthioFirebase.getAuth();
    const cred = await auth.signInWithEmailAndPassword(email, password);
    return cred.user;
  }

  async function logout() {
    const auth = window.EthioFirebase.getAuth();
    await auth.signOut();
    currentUser = null;
    userProfile = null;
    updateUserUI();
    window.location.hash = '#/login';
  }

  async function resetPassword(email) {
    if (!email) {
      throw new Error("እባክዎ ኢሜይልዎን ያስገቡ");
    }
    const auth = window.EthioFirebase.getAuth();
    await auth.sendPasswordResetEmail(email);
  }

  // Quick Demo Logins for instant review in preview
  async function demoLogin(plan = 'free') {
    const planNames = {
      free: 'አበበ ከበደ (Free Demo)',
      premium: 'ሰላም ታደሰ (Premium Demo)',
      business: 'ዳዊት አለሙ (Business Demo)'
    };
    
    const mockEmail = `demo_${plan}@ethioai.et`;
    const users = JSON.parse(localStorage.getItem('ethio_mock_users_db') || '{}');
    
    users[mockEmail] = {
      uid: `usr_demo_${plan}`,
      email: mockEmail,
      password: 'DemoPassword123!',
      name: planNames[plan] || 'Demo User',
      plan: plan,
      subscriptionStatus: 'active',
      preferredLanguage: window.EthioLanguage ? window.EthioLanguage.getLanguage() : 'am',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('ethio_mock_users_db', JSON.stringify(users));

    const auth = window.EthioFirebase.getAuth();
    await auth.signInWithEmailAndPassword(mockEmail, 'DemoPassword123!');
    window.location.hash = '#/dashboard';
  }

  async function updateProfile(fields) {
    if (!currentUser || !userProfile) return;
    // Security: Never allow client to elevate plan or subscriptionStatus
    delete fields.plan;
    delete fields.subscriptionStatus;

    const db = window.EthioFirebase.getDb();
    await db.collection('users').doc(currentUser.uid).set(fields, { merge: true });
    userProfile = { ...userProfile, ...fields };
    updateUserUI();
  }

  function updateUserUI() {
    const nameEl = document.getElementById('user-display-name');
    const avatarEl = document.getElementById('user-avatar-initials');
    const badgeEl = document.getElementById('user-plan-badge');

    if (userProfile) {
      if (nameEl) nameEl.textContent = userProfile.name || userProfile.email;
      if (avatarEl) {
        const initial = (userProfile.name || userProfile.email || 'E')[0].toUpperCase();
        avatarEl.textContent = initial;
      }
      if (badgeEl) {
        const p = userProfile.plan || 'free';
        badgeEl.textContent = p.toUpperCase();
        badgeEl.className = `badge badge-${p}`;
      }
    } else {
      if (nameEl) nameEl.textContent = "Guest / እንግዳ";
      if (avatarEl) avatarEl.textContent = "G";
      if (badgeEl) {
        badgeEl.textContent = "GUEST";
        badgeEl.className = "badge badge-free";
      }
    }
  }

  function handleAuthRedirect() {
    const hash = window.location.hash || '#/dashboard';
    const isPublicRoute = ['#/login', '#/register', '#/forgot-password', '#/privacy'].includes(hash);

    if (!currentUser && !isPublicRoute && hash !== '') {
      // Allow browsing, but some actions prompt login
    }
  }

  function onAuthChange(callback) {
    authListeners.push(callback);
    callback(currentUser, userProfile);
  }

  function notifyListeners() {
    authListeners.forEach(cb => cb(currentUser, userProfile));
  }

  return {
    init: init,
    register: register,
    login: login,
    logout: logout,
    resetPassword: resetPassword,
    demoLogin: demoLogin,
    updateProfile: updateProfile,
    getUser: () => currentUser,
    getProfile: () => userProfile,
    onAuthChange: onAuthChange,
    updateUserUI: updateUserUI
  };
})();
