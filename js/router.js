/**
 * ETHIO AI HUB - Hash-based Client-Side Router
 * Supported Routes:
 *   #/dashboard
 *   #/login
 *   #/register
 *   #/forgot-password
 *   #/tools
 *   #/tools/:toolId
 *   #/academy
 *   #/profile
 *   #/settings
 *   #/subscription
 *   #/privacy
 */

window.EthioRouter = (function() {
  const routes = {};

  function registerRoute(hash, handler) {
    routes[hash] = handler;
  }

  function handleRoute() {
    const rawHash = window.location.hash || '#/dashboard';
    const hash = rawHash.split('?')[0];

    // Close mobile drawer on route change
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar && sidebar.classList.contains('mobile-open')) {
      sidebar.classList.remove('mobile-open');
    }
    if (backdrop && backdrop.classList.contains('active')) {
      backdrop.classList.remove('active');
    }

    // Update active nav items
    updateActiveNav(hash);

    const container = document.getElementById('main-content-view');
    if (!container) return;

    // Check specific tools
    if (hash.startsWith('#/tools/')) {
      const toolId = hash.replace('#/tools/', '');
      renderTool(toolId, container);
      return;
    }

    if (routes[hash]) {
      routes[hash](container);
    } else if (hash === '#/tools') {
      window.EthioDashboard.render(container);
    } else if (hash === '#/settings') {
      window.EthioProfile.render(container);
    } else {
      // Default to dashboard
      window.EthioDashboard.render(container);
    }

    // Scroll to top
    const contentBody = document.querySelector('.content-body');
    if (contentBody) contentBody.scrollTop = 0;
  }

  function renderTool(toolId, container) {
    const toolMap = {
      'ai-assistant': window.EthioTools_AiAssistant,
      'job-finder': window.EthioTools_JobFinder,
      'education-helper': window.EthioTools_EducationHelper,
      'document-writer': window.EthioTools_DocumentWriter,
      'translator': window.EthioTools_Translator,
      'business-helper': window.EthioTools_BusinessHelper,
      'home-finder': window.EthioTools_HomeFinder,
      'money-planner': window.EthioTools_MoneyPlanner,
      'health-assistant': window.EthioTools_HealthAssistant,
      'ethio-drive': window.EthioTools_EthioDrive,
      'ethio-academy': window.EthioTools_EthioAcademy,
      'ethio-verify': window.EthioTools_EthioVerify
    };

    const tool = toolMap[toolId];
    if (tool && typeof tool.render === 'function') {
      tool.render(container);
    } else {
      window.EthioDashboard.render(container);
    }
  }

  function updateActiveNav(hash) {
    document.querySelectorAll('.nav-item').forEach(el => {
      const href = el.getAttribute('href') || el.getAttribute('data-href');
      if (href && (href === hash || (href !== '#/dashboard' && hash.startsWith(href)))) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    document.querySelectorAll('.mobile-nav-btn').forEach(el => {
      const href = el.getAttribute('data-href');
      if (href && (href === hash || (href !== '#/dashboard' && hash.startsWith(href)))) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  function init() {
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('load', handleRoute);
  }

  return {
    init: init,
    register: registerRoute,
    navigate: function(hash) {
      window.location.hash = hash;
    },
    handleRoute: handleRoute
  };
})();
