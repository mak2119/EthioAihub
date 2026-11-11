/**
 * ETHIO AI HUB - Notifications Manager
 * Handles UI toasts and Tier-aware notification feeds:
 *   Free plan: 8 hours delayed delivery
 *   Premium plan: 1 hour delayed delivery
 *   Business plan: Instant delivery
 */

window.EthioNotifications = (function() {
  const notificationsList = [
    {
      id: 'n1',
      title: 'እንኳን ወደ ETHIO AI HUB በደህና መጡ!',
      message: 'ሁሉንም 12 የ AI መሳሪያዎች በመጠቀም ስራዎን ያቀላጥፉ።',
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      minPlan: 'free'
    },
    {
      id: 'n2',
      title: 'አዲስ የትምህርት ኮርስ ተለቋል',
      message: 'የዌብ ሳይትና ICT መሰረታዊ ክህሎቶች በኢትዮ አካዳሚ ይገኛሉ።',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      minPlan: 'free'
    },
    {
      id: 'n3',
      title: 'የአዲስ አበባ የመንጃ ፈቃድ አዲስ መመሪያ',
      message: 'የትራፊክ ቅጣት ክፍያዎች እና የቦሎ እድሳት መመሪያ ተሻሽሏል።',
      time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      minPlan: 'premium'
    }
  ];

  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'error' ? '⚠️' : (type === 'warning' ? '⚡' : '✅');
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function getAvailableNotifications() {
    const profile = window.EthioAuth ? window.EthioAuth.getProfile() : null;
    const plan = profile ? (profile.plan || 'free') : 'free';
    const now = Date.now();

    return notificationsList.filter(n => {
      const notifTime = new Date(n.time).getTime();
      const ageHours = (now - notifTime) / (1000 * 60 * 60);

      if (plan === 'business') {
        return true; // immediate
      } else if (plan === 'premium') {
        return ageHours >= 1; // 1 hour delay
      } else {
        return ageHours >= 8; // 8 hours delay for free tier
      }
    });
  }

  return {
    showToast: showToast,
    getNotifications: getAvailableNotifications
  };
})();
