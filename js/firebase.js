/**
 * ETHIO AI HUB - Firebase Initialization & Storage Adapter
 * Initializes Firebase JS SDK v10 Compat (Auth & Firestore).
 * Provides graceful mock storage when using placeholder config for immediate local testing.
 */

window.EthioFirebase = (function() {
  let authInstance = null;
  let dbInstance = null;
  let isRealFirebase = false;

  function init() {
    const config = window.FIREBASE_CONFIG;
    const isConfigured = config && config.apiKey && config.apiKey !== "YOUR_FIREBASE_API_KEY" && typeof firebase !== 'undefined';

    if (isConfigured) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }
        authInstance = firebase.auth();
        dbInstance = firebase.firestore();
        isRealFirebase = true;
        console.log("ETHIO AI HUB: Connected to Live Firebase.");
        return;
      } catch (err) {
        console.warn("Live Firebase init failed, falling back to local storage adapter:", err);
      }
    }

    // Local Storage Mock Adapter for testing without active Firebase keys
    console.log("ETHIO AI HUB: Running in Local Adapter mode (instant testing ready).");
    initLocalMockAdapter();
  }

  function initLocalMockAdapter() {
    isRealFirebase = false;

    // Simulated currentUser
    let currentAuthUser = JSON.parse(localStorage.getItem('ethio_mock_user') || 'null');
    const authStateListeners = [];

    authInstance = {
      currentUser: currentAuthUser,
      onAuthStateChanged: function(callback) {
        authStateListeners.push(callback);
        setTimeout(() => callback(currentAuthUser), 10);
        return () => {
          const index = authStateListeners.indexOf(callback);
          if (index > -1) authStateListeners.splice(index, 1);
        };
      },
      signInWithEmailAndPassword: async function(email, password) {
        const users = JSON.parse(localStorage.getItem('ethio_mock_users_db') || '{}');
        const user = users[email.toLowerCase()];
        if (!user || user.password !== password) {
          throw new Error("የተሳሳተ ኢሜይል ወይም የይለፍ ቃል። እባክዎ እንደገና ይሞክሩ።");
        }
        currentAuthUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.name,
          getIdToken: async () => "mock-jwt-token-ethio-ai-hub"
        };
        localStorage.setItem('ethio_mock_user', JSON.stringify(currentAuthUser));
        authStateListeners.forEach(cb => cb(currentAuthUser));
        return { user: currentAuthUser };
      },
      createUserWithEmailAndPassword: async function(email, password) {
        const users = JSON.parse(localStorage.getItem('ethio_mock_users_db') || '{}');
        if (users[email.toLowerCase()]) {
          throw new Error("ይህ ኢሜይል አስቀድሞ ተመዝግቧል። እባክዎ ይግቡ።");
        }
        const uid = 'usr_' + Date.now();
        const newUserRecord = {
          uid: uid,
          email: email.toLowerCase(),
          password: password,
          name: email.split('@')[0],
          plan: 'free',
          subscriptionStatus: 'active',
          createdAt: new Date().toISOString()
        };
        users[email.toLowerCase()] = newUserRecord;
        localStorage.setItem('ethio_mock_users_db', JSON.stringify(users));

        currentAuthUser = {
          uid: uid,
          email: email.toLowerCase(),
          displayName: newUserRecord.name,
          getIdToken: async () => "mock-jwt-token-ethio-ai-hub"
        };
        localStorage.setItem('ethio_mock_user', JSON.stringify(currentAuthUser));
        authStateListeners.forEach(cb => cb(currentAuthUser));
        return { user: currentAuthUser };
      },
      signOut: async function() {
        currentAuthUser = null;
        localStorage.removeItem('ethio_mock_user');
        authStateListeners.forEach(cb => cb(null));
      },
      sendPasswordResetEmail: async function(email) {
        console.log("Mock password reset email sent to:", email);
        return true;
      }
    };

    // Simulated Firestore
    dbInstance = {
      collection: function(collectionName) {
        return {
          doc: function(docId) {
            return {
              set: async function(data, options = {}) {
                const storeKey = `ethio_fs_${collectionName}`;
                const store = JSON.parse(localStorage.getItem(storeKey) || '{}');
                if (options.merge && store[docId]) {
                  store[docId] = { ...store[docId], ...data, updatedAt: new Date().toISOString() };
                } else {
                  store[docId] = { ...data, id: docId, updatedAt: new Date().toISOString() };
                }
                localStorage.setItem(storeKey, JSON.stringify(store));
                return true;
              },
              get: async function() {
                const storeKey = `ethio_fs_${collectionName}`;
                const store = JSON.parse(localStorage.getItem(storeKey) || '{}');
                const docData = store[docId];
                return {
                  exists: !!docData,
                  id: docId,
                  data: () => docData || null
                };
              },
              update: async function(data) {
                const storeKey = `ethio_fs_${collectionName}`;
                const store = JSON.parse(localStorage.getItem(storeKey) || '{}');
                if (!store[docId]) throw new Error("Document not found");
                store[docId] = { ...store[docId], ...data, updatedAt: new Date().toISOString() };
                localStorage.setItem(storeKey, JSON.stringify(store));
                return true;
              },
              delete: async function() {
                const storeKey = `ethio_fs_${collectionName}`;
                const store = JSON.parse(localStorage.getItem(storeKey) || '{}');
                delete store[docId];
                localStorage.setItem(storeKey, JSON.stringify(store));
                return true;
              }
            };
          },
          add: async function(data) {
            const id = 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            const storeKey = `ethio_fs_${collectionName}`;
            const store = JSON.parse(localStorage.getItem(storeKey) || '{}');
            store[id] = { ...data, id: id, createdAt: new Date().toISOString() };
            localStorage.setItem(storeKey, JSON.stringify(store));
            return { id: id };
          },
          get: async function() {
            const storeKey = `ethio_fs_${collectionName}`;
            const store = JSON.parse(localStorage.getItem(storeKey) || '{}');
            const docs = Object.values(store).map(item => ({
              id: item.id,
              data: () => item
            }));
            return { docs: docs, size: docs.length };
          }
        };
      }
    };
  }

  // Pre-seed demo user if none exists
  function seedDefaultDemoUser() {
    const existing = localStorage.getItem('ethio_mock_users_db');
    if (!existing) {
      const demoUsers = {
        'demo@ethioai.et': {
          uid: 'usr_demo_101',
          email: 'demo@ethioai.et',
          password: 'Password123!',
          name: 'አበበ ከበደ (Abebe Kebede)',
          plan: 'free',
          subscriptionStatus: 'active',
          preferredLanguage: 'am',
          createdAt: new Date().toISOString()
        }
      };
      localStorage.setItem('ethio_mock_users_db', JSON.stringify(demoUsers));
    }
  }

  return {
    init: function() {
      seedDefaultDemoUser();
      init();
    },
    getAuth: () => authInstance,
    getDb: () => dbInstance,
    isLive: () => isRealFirebase
  };
})();
