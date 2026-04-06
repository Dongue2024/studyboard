// ============================================================
//  STUDYBOARD — assets/js/firebase.js
//  Initialisation Firebase + Authentification + Freemium
//  Utilisation : <script type="module" src="assets/js/firebase.js"></script>
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ── Configuration Firebase ──
const firebaseConfig = {
  apiKey: "AIzaSyARuEQK8d50zRD5eEiOVQHB41WyCY2VHh8",
  authDomain: "studyboard-ffc3c.firebaseapp.com",
  projectId: "studyboard-ffc3c",
  storageBucket: "studyboard-ffc3c.firebasestorage.app",
  messagingSenderId: "539310334923",
  appId: "1:539310334923:web:0db4eef8b49cd93d440c4e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ═══════════════════════════════════════════════
// 👑 LISTE DES EMAILS PREMIUM
// Pour ajouter un client : ajoute son email ici
// ═══════════════════════════════════════════════
const PREMIUM_EMAILS = [
  "ndjanpaalex@gmail.com",
  "sergebelibi05@icloud.com",
  // Ajoute les emails des clients qui ont payé ici :
  // "client1@gmail.com",
  // "client2@gmail.com",
];
// ═══════════════════════════════════════════════

document.getElementById('auth-loading').style.display = 'flex';
document.getElementById('app-content').style.display = 'none';

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const name = user.displayName || user.email.split('@')[0];
  const email = user.email;
  const photoURL = user.photoURL;

  // ── Vérifier si Premium ──
  const plan = PREMIUM_EMAILS.includes(email.toLowerCase()) ? 'premium' : 'free';
  window.USER_PLAN = plan;
  console.log('Plan:', plan, 'pour', email);

  // ── Afficher l'app ──
  document.getElementById('auth-loading').style.display = 'none';
  document.getElementById('app-content').style.display = 'flex';

  // ── Construire l'accordion Physique (page par défaut) ──
  let _attempts = 0;
  const _waitAndBuild = function() {
    if (typeof window._buildPhysAccordion === 'function') {
      window._buildPhysAccordion();
    } else if (_attempts < 20) {
      _attempts++;
      setTimeout(_waitAndBuild, 100);
    }
  };
  setTimeout(_waitAndBuild, 50);

  // ── Nom et avatar ──
  document.querySelectorAll('.user-name').forEach(el => el.textContent = name);
  document.querySelectorAll('.user-email').forEach(el => el.textContent = email);
  if (photoURL) {
    document.querySelectorAll('.user-avatar').forEach(el => {
      el.style.backgroundImage = 'url(' + photoURL + ')';
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.textContent = '';
    });
  } else {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
    document.querySelectorAll('.user-avatar').forEach(el => el.textContent = initials);
  }

  // ── Badge plan ──
  const badge = document.getElementById('plan-badge');
  if (badge) {
    if (plan === 'premium') {
      badge.textContent = '👑 Premium';
      badge.style.cssText = 'display:inline-flex;align-items:center;gap:4px;font-size:.62rem;letter-spacing:1.5px;text-transform:uppercase;color:#080c18;background:linear-gradient(135deg,#e8b84b,#c9922a);border-radius:99px;padding:3px 10px;font-weight:700;margin-top:4px;';
    } else {
      badge.textContent = '🆓 Gratuit';
      badge.style.cssText = 'display:inline-flex;align-items:center;gap:4px;font-size:.62rem;letter-spacing:1.5px;text-transform:uppercase;color:#6b7299;background:rgba(107,114,153,.15);border:1px solid rgba(107,114,153,.3);border-radius:99px;padding:3px 10px;font-weight:600;margin-top:4px;';
    }
  }

  // ── Débloquer si Premium ──
  if (plan === 'premium') {
    const tryUnlock = (attempts) => {
      if (typeof window.unlockPremium === 'function') {
        window.unlockPremium();
        console.log('🔓 Contenu Premium débloqué !');
      } else if (attempts > 0) {
        setTimeout(() => tryUnlock(attempts - 1), 300);
      }
    };
    setTimeout(() => tryUnlock(10), 200);
  }

  // ── Déconnexion ──
  window.doSignOut = async function() {
    await signOut(auth);
    window.location.href = 'login.html';
  };
});
