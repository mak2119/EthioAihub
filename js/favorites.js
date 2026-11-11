/**
 * ETHIO AI HUB - Favorites & Saved Items Manager
 * Allows saving conversations, generated documents, and real estate listings to Firestore.
 */

window.EthioFavorites = (function() {

  async function saveItem(type, item) {
    const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;

    if (!user) {
      if (window.EthioNotifications) {
        window.EthioNotifications.showToast(t('mustLogin'), 'warning');
      }
      return false;
    }

    const db = window.EthioFirebase ? window.EthioFirebase.getDb() : null;
    if (!db) return false;

    const data = {
      uid: user.uid,
      type: type, // 'chat', 'document', 'property', 'job'
      item: item,
      savedAt: new Date().toISOString()
    };

    try {
      await db.collection('savedItems').add(data);
      if (window.EthioNotifications) {
        window.EthioNotifications.showToast(t('saved') || "በተሳካ ሁኔታ ተቀምጧል!", 'success');
      }
      return true;
    } catch (e) {
      console.error("Save item failed:", e);
      return false;
    }
  }

  async function getSavedItems(type = null) {
    const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
    if (!user) return [];

    const db = window.EthioFirebase ? window.EthioFirebase.getDb() : null;
    if (!db) return [];

    try {
      const snap = await db.collection('savedItems').get();
      const list = [];
      snap.docs.forEach(doc => {
        const d = doc.data();
        if (d.uid === user.uid && (!type || d.type === type)) {
          list.push({ id: doc.id, ...d });
        }
      });
      return list;
    } catch (e) {
      console.error("Fetch saved items failed:", e);
      return [];
    }
  }

  async function deleteSavedItem(id) {
    const db = window.EthioFirebase ? window.EthioFirebase.getDb() : null;
    if (!db) return;
    await db.collection('savedItems').doc(id).delete();
  }

  return {
    saveItem: saveItem,
    getSavedItems: getSavedItems,
    deleteSavedItem: deleteSavedItem
  };
})();
