// ============================================================
//  STUDYBOARD — assets/js/celn.js
//  Logique interactive : cours Électronique (toggle, quiz)
// ============================================================


// ── TOGGLE LEÇON ──
function celnToggleLesson(id, header) {
  const body = document.getElementById(id);
  const icon = header.querySelector('.toggle-icon');
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
  celnUpdateProgress();
}

// ── QUIZ ──
function celnCheckQuiz(opt, result) {
  const parent = opt.closest('.quiz-item');
  if (parent.dataset.answered) return;
  parent.dataset.answered = '1';
  const feedback = parent.querySelector('.quiz-feedback');
  const allOpts = parent.querySelectorAll('.quiz-opt');
  allOpts.forEach(o => o.style.pointerEvents = 'none');
  opt.classList.add(result);
  feedback.classList.add('show', result);
  celnUpdateProgress();
}

// ── SHOW ANSWER ──
function celnToggleAnswer(btn) {
  const block = btn.nextElementSibling;
  const isShown = block.classList.contains('show');
  block.classList.toggle('show', !isShown);
  btn.textContent = isShown ? 'Voir la correction' : 'Masquer la correction';
}

// ── PROGRESS ──
function celnUpdateProgress() {
  const total = document.querySelectorAll('.quiz-item').length;
  const answered = document.querySelectorAll('.quiz-item[data-answered]').length;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  document.getElementById('celnProgressFill').style.width = pct + '%';
  document.getElementById('celnProgressPct').textContent = pct + '%';
}

// ── SMOOTH SCROLL FOR PILLS ──
document.querySelectorAll('.pill').forEach(pill => {
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
        if (!body.classList.contains('open')) celnToggleLesson(id, header);
      }
    }
  });
});

// Smooth scroll for pills in celn
document.querySelectorAll('.celn-wrapper .pill').forEach(function(pill) {
  pill.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.celn-wrapper .pill').forEach(function(p) { p.classList.remove('active'); });
    pill.classList.add('active');
    var target = document.querySelector(pill.getAttribute('href'));
    if (target) {
      target.scrollIntoView({behavior:'smooth', block:'start'});
      var id = target.querySelector('.lesson-body') ? target.querySelector('.lesson-body').id : null;
      var header = target.querySelector('.lesson-header');
      if (id && header) {
        var body = document.getElementById(id);
        if (body && !body.classList.contains('open')) celnToggleLesson(id, header);
      }
    }
  });
});
</script>
