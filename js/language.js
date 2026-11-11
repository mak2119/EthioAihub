/**
 * ETHIO AI HUB - Language Manager
 * Manages active locale, language selection, and auto-updating UI elements.
 */

window.EthioLanguage = (function() {
  const STORAGE_KEY = 'ethio_ai_hub_lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'am'; // Amharic by default

  function init() {
    // Sync dropdown if exists
    const select = document.getElementById('lang-select');
    if (select) {
      select.value = currentLang;
      select.addEventListener('change', function(e) {
        setLanguage(e.target.value);
      });
    }
    applyLanguage();
  }

  function setLanguage(lang) {
    if (!['am', 'en', 'om'].includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    
    // Update select element
    const select = document.getElementById('lang-select');
    if (select && select.value !== lang) {
      select.value = lang;
    }

    // If user is authenticated, update preferredLanguage in Firestore
    if (window.EthioAuth && window.EthioAuth.currentUser) {
      window.EthioAuth.updateProfile({ preferredLanguage: lang });
    }

    applyLanguage();
    window.dispatchEvent(new CustomEvent('ethio-language-changed', { detail: { lang: currentLang } }));
  }

  function getLanguage() {
    return currentLang;
  }

  function t(key, fallback = '') {
    const dict = window.ETHIO_TRANSLATIONS && window.ETHIO_TRANSLATIONS[currentLang];
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English
    const enDict = window.ETHIO_TRANSLATIONS && window.ETHIO_TRANSLATIONS['en'];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  }

  function applyLanguage() {
    document.documentElement.lang = currentLang;
    
    // Update all elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });

    // Update placeholders
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.setAttribute('placeholder', t(key));
      }
    });

    // Update titles
    const titles = document.querySelectorAll('[data-i18n-title]');
    titles.forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.setAttribute('title', t(key));
      }
    });
  }

  return {
    init: init,
    setLanguage: setLanguage,
    getLanguage: getLanguage,
    t: t,
    applyLanguage: applyLanguage
  };
})();
