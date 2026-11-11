/**
 * ETHIO AI HUB - Firebase & Cloudflare Worker Configuration
 * 
 * Replace YOUR_FIREBASE_CONFIG with your actual Firebase project settings
 * from the Firebase Console (Project Settings > General > Your apps > Web app).
 * Client configuration in Firebase is not a private API secret.
 * 
 * Replace YOUR_WORKER_URL with your Cloudflare Worker URL (e.g. https://ethio-ai-worker.yourname.workers.dev).
 * All AI and Google Translate requests securely route through your Cloudflare Worker.
 */

window.FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

window.WORKER_URL = "YOUR_WORKER_URL";
