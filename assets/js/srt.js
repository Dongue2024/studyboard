// ============================================================
//  STUDYBOARD — assets/js/srt.js
//  Logique interactive : cours SRT (toggle, quiz, épreuves)
// ============================================================

// ── TOGGLE LEÇON ──
function srtToggleLesson(id, header) {
  const body = document.getElementById(id);
  const icon = header.querySelector('.toggle-icon');
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
  srtUpdateProgress();
}

// ── QUIZ ──
function srtCheckQuiz(opt, result) {
  const parent = opt.closest('.quiz-item');
  if (parent.dataset.answered) return;
  parent.dataset.answered = '1';
  
  const feedback = parent.querySelector('.quiz-feedback');
  const allOpts = parent.querySelectorAll('.quiz-opt');
  
  allOpts.forEach(o => o.style.pointerEvents = 'none');
  opt.classList.add(result);
  
  feedback.classList.add('show', result);
  srtUpdateProgress();
}

// ── SHOW ANSWER ──
function srtToggleAnswer(btn) {
  const block = btn.nextElementSibling;
  const isShown = block.classList.contains('show');
  block.classList.toggle('show', !isShown);
  btn.textContent = isShown ? 'Voir la correction' : 'Masquer la correction';
}

// ── PROGRESS ──
function srtUpdateProgress() {
  const total = document.querySelectorAll('.srt-course-wrapper .quiz-item').length;
  const answered = document.querySelectorAll('.quiz-item[data-answered]').length;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  document.getElementById('srtProgressFill').style.width = pct + '%';
  document.getElementById('srtProgressPct').textContent = pct + '%';
}

// ── SMOOTH SCROLL FOR PILLS ──
document.querySelectorAll('.srt-course-wrapper .pill').forEach(pill => {
  pill.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const target = document.querySelector(pill.getAttribute('href'));
    if (target) {
      target.scrollIntoView({behavior:'smooth', block:'start'});
      const id = target.querySelector('.lesson-body')?.id;
      const header = target.querySelector('.lesson-header');
      if (id && header) {
        const body = document.getElementById(id);
        if (!body.classList.contains('open')) toggleLesson(id, header);
      }
    }
  });
});

// ══════════════════════════════════════════════════════
//  SYSTÈME ÉPREUVES SRT
// ══════════════════════════════════════════════════════

// ── DONNÉES DES ÉPREUVES ──
// Pour ajouter une épreuve : copie un objet et remplis les champs.
// sujet_url et corriges_url = liens directs vers tes PDF sur GitHub Pages.
// ex: "https://studyboard-cm.github.io/studyboard/epreuves/srt/ep1_sujet.pdf"
const SRT_EPREUVES = [
  {
    id: 1,
    titre: "Épreuve SRT · IPR Ekom",
    annee: "2024–2025",
    duree: "3h",
    tags: ["Réseaux", "IPR", "Ekom"],
    desc: "Épreuve de SRT — Probatoire. Sujet IPR Ekom avec corrigé détaillé.",
    sujet_url: "https://studyboard-cm.github.io/studyboard/epreuves/srt/Epreuve%20SRT%202%20Prob%20IPR%20Ekom.pdf",
    corrige_url: "https://studyboard-cm.github.io/studyboard/epreuves/srt/ep1_corrige.pdf",
    gratuit: true
  },
  // ── Ajoute tes prochaines épreuves ici ──
  // {
  //   id: 2,
  //   titre: "Épreuve SRT · ...",
  //   annee: "2024–2025",
  //   duree: "3h",
  //   tags: ["..."],
  //   desc: "Description...",
  //   sujet_url: "https://studyboard-cm.github.io/studyboard/epreuves/srt/NOM_DU_FICHIER.pdf",
  //   corrige_url: "https://studyboard-cm.github.io/studyboard/epreuves/srt/NOM_CORRIGE.pdf",
  //   gratuit: false
  // },
];

// ── RENDU DES ÉPREUVES ──
function srtRenderEpreuves() {
  const grid = document.getElementById('srt-epreuves-grid');
  const countEl = document.getElementById('srt-ep-count');
  if (!grid) return;
  const plan = window.USER_PLAN || 'free';
  countEl.textContent = SRT_EPREUVES.length;

  grid.innerHTML = SRT_EPREUVES.map(ep => {
    const locked = !ep.gratuit && plan !== 'premium';
    const tags = ep.tags.map(t => `<span style="background:var(--srt-surface2);border:1px solid var(--srt-border);color:var(--srt-text3);font-size:.68rem;padding:2px 9px;border-radius:10px;">${t}</span>`).join('');
    const badge = ep.gratuit
      ? `<span style="background:rgba(67,233,123,.15);border:1px solid rgba(67,233,123,.3);color:#43e97b;font-size:.62rem;font-weight:700;padding:3px 9px;border-radius:99px;letter-spacing:.5px;">✓ GRATUIT</span>`
      : `<span style="background:rgba(255,215,0,.12);border:1px solid rgba(255,215,0,.3);color:#ffd700;font-size:.62rem;font-weight:700;padding:3px 9px;border-radius:99px;letter-spacing:.5px;">👑 PREMIUM</span>`;

    if (locked) {
      return `
<div style="background:var(--srt-surface);border:1px solid var(--srt-border);border-radius:16px;padding:22px 24px;display:flex;align-items:center;gap:20px;opacity:.6;filter:grayscale(.3);cursor:pointer;" onclick="showUpgrade()">
  <div style="width:52px;height:52px;border-radius:12px;background:var(--srt-surface2);border:1px solid var(--srt-border);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">🔒</div>
  <div style="flex:1;min-width:0;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
      <span style="font-family:'Playfair Display',serif;font-weight:700;font-size:.95rem;color:var(--srt-text);">${ep.titre}</span>
      ${badge}
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:7px;">${tags}</div>
    <div style="font-size:.8rem;color:var(--srt-text3);">⏱ ${ep.duree} · ${ep.annee}</div>
  </div>
  <div style="color:var(--srt-text3);font-size:1.3rem;flex-shrink:0;">›</div>
</div>`;
    }

    return `
<div style="background:var(--srt-surface);border:1px solid var(--srt-border);border-radius:16px;padding:22px 24px;transition:box-shadow .2s,transform .2s;" onmouseover="this.style.boxShadow='0 8px 28px rgba(108,99,255,.18)';this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='';this.style.transform='';">
  <div style="display:flex;align-items:flex-start;gap:16px;">
    <div style="width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,var(--srt-accent),#ff6584);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">📄</div>
    <div style="flex:1;min-width:0;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
        <span style="font-family:'Playfair Display',serif;font-weight:700;font-size:.95rem;color:var(--srt-text);">${ep.titre}</span>
        ${badge}
      </div>
      <div style="font-size:.83rem;color:var(--srt-text2);margin-bottom:9px;">${ep.desc}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">${tags}</div>
      <div style="font-size:.78rem;color:var(--srt-text3);margin-bottom:14px;">⏱ Durée : ${ep.duree} · 📅 ${ep.annee}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <a href="${ep.sujet_url}" target="_blank" onclick="event.stopPropagation()" style="display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,var(--srt-accent),#8b5cf6);color:#fff;border:none;border-radius:8px;padding:9px 16px;font-size:.8rem;font-weight:600;font-family:'DM Sans',sans-serif;text-decoration:none;cursor:pointer;transition:opacity .2s;" onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
          📥 Télécharger le sujet
        </a>
        <a href="${ep.corrige_url}" target="_blank" onclick="event.stopPropagation()" style="display:inline-flex;align-items:center;gap:7px;background:transparent;color:#43e97b;border:1px solid rgba(67,233,123,.4);border-radius:8px;padding:9px 16px;font-size:.8rem;font-weight:600;font-family:'DM Sans',sans-serif;text-decoration:none;cursor:pointer;transition:all .2s;" onmouseover="this.style.background='rgba(67,233,123,.12)'" onmouseout="this.style.background='transparent'">
          ✅ Voir le corrigé
        </a>
      </div>
    </div>
  </div>
</div>`;
  }).join('');
}

// ── SWITCH ONGLET ──
function srtSwitchTab(tab) {
  const cours = document.getElementById('srt-section-cours');
  const epreuves = document.getElementById('srt-section-epreuves');
  const tabCours = document.getElementById('srt-tab-cours');
  const tabEp = document.getElementById('srt-tab-epreuves');
  if (tab === 'cours') {
    cours.style.display = '';
    epreuves.style.display = 'none';
    tabCours.style.borderBottomColor = 'var(--srt-accent)';
    tabCours.style.color = 'var(--srt-accent)';
    tabEp.style.borderBottomColor = 'transparent';
    tabEp.style.color = 'var(--srt-text3)';
  } else {
    cours.style.display = 'none';
    epreuves.style.display = '';
    tabEp.style.borderBottomColor = '#ff6584';
    tabEp.style.color = '#ff6584';
    tabCours.style.borderBottomColor = 'transparent';
    tabCours.style.color = 'var(--srt-text3)';
    srtRenderEpreuves();
  }
}
</script>
