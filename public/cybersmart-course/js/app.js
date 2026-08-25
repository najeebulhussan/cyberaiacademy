/* =====================================================================
   Cyber Smart — application shell
   Hash router, progress persistence, content rendering, final exam and
   certificate. Wires the 3D scenes to the right views.
   ===================================================================== */
(function (global) {
  'use strict';
  const { h, btn } = global.Labs;
  const C = global.COURSE;
  const clear = (n) => { while (n.firstChild) n.removeChild(n.firstChild); return n; };
  const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

  /* ================= progress ================= */
  const KEY = 'cybersmart.progress.v1';
  const P = load();
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
      return Object.assign({ modules: {}, labState: {}, name: '', phone: '', email: '', registered: false, exam: null }, raw);
    } catch (e) { return { modules: {}, labState: {}, name: '', phone: '', email: '', registered: false, exam: null }; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} }

  /* ================= Google Sheets Webhook Sync ================= */
  const DEFAULT_WEBHOOK_KEY = 'cybersmart_google_sheet_webhook';
  function syncGoogleSheet(data) {
    try {
      const webhookUrl = localStorage.getItem(DEFAULT_WEBHOOK_KEY) || global.CYBERSMART_SHEET_WEBHOOK || '';
      if (!webhookUrl) return;
      const o = overall();
      const payload = Object.assign({
        course: 'Cyber Smart: AI-Powered Digital World',
        name: P.name || '',
        phone: P.phone || '',
        email: P.email || '',
        progress: o.p + '% (' + o.done + '/' + o.total + ' modules)',
        score: P.exam != null ? P.exam + '%' : 'In Progress',
        timestamp: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
        isoDate: new Date().toISOString()
      }, data);

      fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (e) {}
  }
  function mp(id) { return P.modules[id] || (P.modules[id] = { read: false, lab: null, quiz: null }); }

  function moduleDone(id) {
    const m = C.byId[id], s = mp(id);
    const needLab = !!m.lab;
    return s.read && (!needLab || s.lab != null) && s.quiz != null;
  }
  function moduleScore(id) {
    const m = C.byId[id], s = mp(id);
    const parts = [], w = [];
    if (m.lab) { parts.push(s.lab || 0); w.push(2); }
    parts.push(s.quiz || 0); w.push(1);
    const tot = w.reduce((a, b) => a + b, 0);
    return Math.round(parts.reduce((a, v, i) => a + v * w[i], 0) / tot);
  }
  function overall() {
    const done = C.order.filter(moduleDone).length;
    return { done, total: C.order.length, p: pct(done, C.order.length) };
  }
  function courseComplete() { return overall().done === C.order.length; }
  function averageScore() {
    const s = C.order.map(moduleScore);
    return Math.round(s.reduce((a, b) => a + b, 0) / s.length);
  }

  /* ================= 3D lifecycle ================= */
  let ambient = null;
  const liveScenes = [];
  function killScenes() { while (liveScenes.length) { const s = liveScenes.pop(); try { s.destroy(); } catch (e) {} } }
  function track(s) { if (s) liveScenes.push(s); return s; }

  /* ================= layout ================= */
  const app = document.getElementById('app');
  const navList = document.getElementById('nav-list');
  const ringPath = document.getElementById('ring-fill');
  const ringText = document.getElementById('ring-text');
  const sidebar = document.getElementById('sidebar');

  function paintChrome() {
    const o = overall();
    if (ringPath) {
      const len = 100;
      ringPath.style.strokeDasharray = len;
      ringPath.style.strokeDashoffset = len - (len * o.p) / 100;
    }
    if (ringText) ringText.textContent = o.p + '%';
    buildNav();
  }

  function buildNav() {
    if (!navList) return;
    clear(navList);
    if (P.registered && P.name) {
      navList.appendChild(h('div.nav-group',
        h('div.nav-group-h', 'Student Profile'),
        h('div', { style: 'padding: 8px 12px; border-radius: 8px; background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.2); margin-bottom: 10px;' },
          h('div', { style: 'font-weight: 700; font-size: 12.5px; color: #7ee6ff; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;' }, `👤 ${P.name}`),
          P.email ? h('div', { style: 'font-size: 10.5px; color: rgba(180,210,240,0.6); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-top: 2px;' }, P.email) : null
        )
      ));
    }
    C.tracks.forEach(tr => {
      const items = tr.modules.map(id => {
        const m = C.byId[id];
        const done = moduleDone(id);
        const cur = location.hash === '#/m/' + id;
        return h('a.nav-item' + (done ? '.done' : '') + (cur ? '.current' : ''),
          { href: '#/m/' + id },
          h('span.nav-n', m.n),
          h('span.nav-t', m.title),
          h('span.nav-mark', done ? '✓' : ''));
      });
      navList.appendChild(h('div.nav-group',
        h('div.nav-group-h', tr.label),
        h('div.nav-group-b', items)));
    });
    navList.appendChild(h('div.nav-group',
      h('div.nav-group-h', 'Finish'),
      h('div.nav-group-b',
        h('a.nav-item' + (P.exam != null ? '.done' : '') + (location.hash === '#/exam' ? '.current' : ''),
          { href: '#/exam' }, h('span.nav-n', '★'), h('span.nav-t', 'Final assessment'),
          h('span.nav-mark', P.exam != null ? '✓' : '')),
        h('a.nav-item' + (location.hash === '#/certificate' ? '.current' : ''),
          { href: '#/certificate' }, h('span.nav-n', '◆'), h('span.nav-t', 'Certificate'),
          h('span.nav-mark', '')))));
  }

  /* ================= content renderers ================= */
  function renderSection(sec, mod) {
    const parts = [];
    if (sec.h) parts.push(h('h3.sec-h', sec.h));
    (sec.p || []).forEach(t => parts.push(h('p', { html: t })));

    if (sec.list) parts.push(h('ul.bullets', sec.list.map(li => h('li', { html: li }))));

    if (sec.cards) parts.push(h('div.card-grid', sec.cards.map(c =>
      h('div.info-card' + (c.tone ? '.tone-' + c.tone : ''),
        h('b', c.t), h('p', { html: c.d })))));

    if (sec.steps) parts.push(h('ol.step-flow', sec.steps.map(s =>
      h('li.step', h('span.step-n', s.n), h('div', h('b', s.t), h('p', { html: s.d }))))));

    if (sec.table) {
      const t = sec.table;
      parts.push(h('div.table-wrap',
        h('table.cmp',
          h('thead', h('tr', t.cols.map((c, i) => h(i ? 'th.num' : 'th', c)))),
          h('tbody', t.rows.map(r => h('tr', r.map((cell, i) =>
            h(i ? 'td' : 'th', { scope: i ? null : 'row', html: cell === '—' ? '<span class="dash">—</span>' : cell })))))),
        h('p.table-note', 'Availability and menu labels vary by device, region and rollout.')));
    }

    if (sec.doors) parts.push(h('div.door-grid', C.doors.map(d =>
      h('div.door-mini.c-' + d.color,
        h('span.door-n', d.n), h('b', d.name), h('span', d.tagline)))));

    if (sec.callout) {
      const k = sec.callout.k;
      parts.push(h('div.callout.' + k,
        h('b', sec.callout.t), h('p', { html: sec.callout.d })));
    }
    return h('section.sec', parts);
  }

  /* ---------- quiz ---------- */
  function renderQuiz(mod, onDone) {
    const qs = mod.quiz;
    let i = 0, correct = 0;
    const wrap = h('div.quiz');
    const head = h('div.quiz-head', h('span.quiz-kicker', 'Knowledge check'),
      h('h3', 'Check what stuck'), h('span.quiz-count', ''));
    const stage = h('div.quiz-stage');
    wrap.append(head, stage);

    function step() {
      if (i >= qs.length) return finish();
      const q = qs[i];
      head.querySelector('.quiz-count').textContent = 'Question ' + (i + 1) + ' of ' + qs.length;
      clear(stage).append(
        h('p.quiz-q', { html: q.q }),
        h('div.choices', q.options.map((o, oi) =>
          h('button.choice', { type: 'button', onclick: (e) => {
            const box = e.currentTarget.parentElement;
            if (box.dataset.locked) return;
            box.dataset.locked = '1';
            const ok = oi === q.answer;
            if (ok) correct++;
            Array.from(box.children).forEach((c, ci) => {
              if (ci === q.answer) c.classList.add('is-right');
              if (ci === oi && !ok) c.classList.add('is-wrong');
            });
            stage.appendChild(h('div.feedback.' + (ok ? 'good' : 'bad'),
              h('b', ok ? 'Correct' : 'Not quite'), h('p', { html: q.why }),
              btn(i === qs.length - 1 ? 'See result' : 'Next question', 'primary',
                () => { i++; step(); })));
          } }, h('span.choice-key', String.fromCharCode(65 + oi)), h('span.choice-label', { html: o })))));
    }
    function finish() {
      const p = pct(correct, qs.length);
      head.querySelector('.quiz-count').textContent = 'Complete';
      clear(stage).append(h('div.quiz-result.' + (p >= 75 ? 'good' : p >= 50 ? 'warn' : 'bad'),
        h('b', correct + ' / ' + qs.length),
        h('p', p === 100 ? 'Full marks.' : p >= 75 ? 'Solid — review the ones you missed above.'
              : 'Worth re-reading this module before moving on.'),
        btn('Retake', 'ghost', () => { i = 0; correct = 0; step(); })));
      onDone(p);
    }
    step();
    return wrap;
  }

  /* ---------- lab context ---------- */
  function labCtx(mod, onScore) {
    const destroyers = [];
    return {
      ctx: {
        done(p, extra) {
          const s = mp(mod.id);
          s.lab = Math.max(s.lab || 0, p);
          if (extra && extra.baseline) P.baselineStart = P.baselineStart || extra.baseline;
          save(); paintChrome(); onScore(p);
        },
        save(k, v) { (P.labState[mod.id] = P.labState[mod.id] || {})[k] = v; save(); },
        load(k) { return (P.labState[mod.id] || {})[k]; },
        readGlobal(k) { return k === 'baseline' ? P.baselineStart : P[k]; },
        onDestroy(fn) { destroyers.push(fn); }
      },
      teardown() { destroyers.forEach(f => { try { f(); } catch (e) {} }); }
    };
  }

  /* ================= views ================= */

  function viewHome() {
    killScenes();
    if (ambient) ambient.setTint('cyan');
    const o = overall();
    const resume = C.order.find(id => !moduleDone(id)) || C.order[0];

    const heroCanvas = h('canvas.hero-canvas', { 'aria-hidden': 'true' });
    const doorCanvas = h('canvas.door-canvas', { 'aria-hidden': 'true' });
    const doorOverlay = h('div.door-overlay');

    const hero = h('section.hero',
      h('div.hero-3d', heroCanvas),
      h('div.hero-copy',
        h('span.hero-eyebrow', 'Interactive course · 13 modules · 12 labs'),
        h('h1.hero-title', h('span', C.title)),
        h('p.hero-sub', C.subtitle),
        h('p.hero-blurb', C.blurb),
        h('div.hero-actions',
          h('a.btn.primary.lg', { href: '#/m/' + resume }, o.done ? 'Resume — ' + C.byId[resume].title : 'Start the course'),
          h('a.btn.ghost.lg', { href: '#/m/baseline' }, 'Take the 2-minute self-check')),
        h('div.hero-meta',
          h('div', h('b', o.p + '%'), h('span', 'complete')),
          h('div', h('b', C.order.length), h('span', 'modules')),
          h('div', h('b', '12'), h('span', 'hands-on labs')))));

    const doors = h('section.doors-sec',
      h('div.sec-head',
        h('span.sec-kicker', 'The Cyber-Smart model'),
        h('h2', 'Five doors protect your digital life'),
        h('p', 'Security is not one setting. It is a system of habits — make every door harder to open.')),
      h('div.doors-stage', doorCanvas, doorOverlay));

    const tracks = h('section.tracks',
      h('div.sec-head',
        h('span.sec-kicker', 'Curriculum'),
        h('h2', 'Thirteen modules, twelve labs'),
        h('p', 'Every module ends with something you actually do. Progress saves in this browser.')),
      h('div.track-list', C.tracks.map(tr =>
        h('div.track',
          h('div.track-h', tr.label),
          h('div.track-b', tr.modules.map(id => {
            const m = C.byId[id], s = mp(id), done = moduleDone(id);
            return h('a.mod-card' + (done ? '.done' : '') + '.c-' + m.color, { href: '#/m/' + id },
              h('span.mod-n', m.n),
              h('div.mod-body', h('b', m.title), h('span', m.subtitle),
                h('div.mod-tags',
                  h('span.tag', m.minutes + ' min'),
                  m.lab ? h('span.tag.lab', 'Lab') : null,
                  s.quiz != null ? h('span.tag.score', 'Quiz ' + s.quiz + '%') : null)),
              h('span.mod-mark', done ? '✓' : '→'));
          }))))));

    const finish = h('section.finish-sec',
      h('div.finish-card',
        h('h2', courseComplete() ? 'You have completed every module' : 'Finish the course'),
        h('p', courseComplete()
          ? 'Take the final assessment and claim your certificate.'
          : 'Complete all thirteen modules to unlock the final assessment and certificate.'),
        h('div.hero-actions',
          h('a.btn.primary' + (courseComplete() ? '' : '.is-disabled'), { href: courseComplete() ? '#/exam' : '#/' }, 'Final assessment'),
          h('a.btn.ghost', { href: '#/certificate' }, 'Certificate'))));

    const credit = h('footer.credit',
      h('div', h('b', C.author.name), h('span', C.author.role), h('span.small', C.author.creds)),
      h('div.credit-motto', C.motto));

    clear(app).append(hero, doors, tracks, finish, credit);

    /* 3D */
    track(global.Scenes.hero(heroCanvas));
    const doorStage = doorCanvas.parentElement;
    let stacked = null;
    const doorScene = track(global.Scenes.doors(doorCanvas, C.doors.length, (screen, narrow) => {
      if (narrow !== stacked) { stacked = narrow; doorStage.classList.toggle('is-stacked', narrow); }
      screen.forEach((s, i) => {
        const el = doorOverlay.children[i];
        if (!el) return;
        el.style.left = (s.x * 100) + '%';
        el.style.top = (s.y * 100) + '%';
      });
    }));
    C.doors.forEach((d, i) => {
      const trackDef = C.tracks.find(t => t.id === d.id);
      const mods = trackDef ? trackDef.modules : [];
      const doneCount = mods.filter(moduleDone).length;
      const el = h('a.door-hit.c-' + d.color, { href: '#/m/' + (mods.find(m => !moduleDone(m)) || mods[0]) },
        h('span.door-hit-n', d.n),
        h('b', d.name),
        h('span.door-hit-tag', d.tagline),
        h('span.door-hit-prog', doneCount + '/' + mods.length + ' done'));
      el.addEventListener('pointerenter', () => doorScene.setState(i, { hover: true, open: true }));
      el.addEventListener('pointerleave', () => doorScene.setState(i, { hover: false, open: false }));
      el.addEventListener('focus', () => doorScene.setState(i, { hover: true, open: true }));
      el.addEventListener('blur', () => doorScene.setState(i, { hover: false, open: false }));
      doorScene.setState(i, { done: doneCount === mods.length });
      doorOverlay.appendChild(el);
    });
  }

  function viewModule(id) {
    const mod = C.byId[id];
    if (!mod) return viewHome();
    killScenes();
    const door = C.doors.find(d => d.id === mod.track);
    if (ambient) ambient.setTint(door ? door.tint : 'cyan');

    const s = mp(id);
    s.read = true; save();

    const idx = C.order.indexOf(id);
    const prev = idx > 0 ? C.order[idx - 1] : null;
    const next = idx < C.order.length - 1 ? C.order[idx + 1] : null;

    const glyphCanvas = h('canvas.glyph-canvas', { 'aria-hidden': 'true' });

    const head = h('header.mod-head.c-' + mod.color,
      h('div.mod-head-copy',
        h('span.mod-eyebrow', (door ? 'Door ' + door.n + ' — ' + door.name : 'Module ' + mod.n) + ' · ' + mod.minutes + ' min'),
        h('h1', mod.title),
        h('p.mod-sub', mod.subtitle),
        h('div.obj',
          h('b', 'By the end you will be able to'),
          h('ul', mod.objectives.map(o => h('li', o))))),
      h('div.mod-head-3d', glyphCanvas));

    const heroImg = mod.hero
      ? h('figure.mod-hero', h('img', { src: mod.hero, alt: '', loading: 'lazy', decoding: 'async' }))
      : null;

    const body = h('article.mod-body-content', mod.sections.map(sec => renderSection(sec, mod)));

    const takeaways = h('section.takeaways',
      h('b', 'Takeaways'),
      h('ul', mod.takeaways.map(t => h('li', { html: t }))));

    const labHost = h('div.lab-host');
    const quizHost = h('div.quiz-host');

    const nav = h('nav.mod-nav',
      prev ? h('a.mod-nav-btn.prev', { href: '#/m/' + prev },
        h('span', 'Previous'), h('b', C.byId[prev].title)) : h('span'),
      next ? h('a.mod-nav-btn.next', { href: '#/m/' + next },
        h('span', 'Next'), h('b', C.byId[next].title))
           : h('a.mod-nav-btn.next', { href: '#/exam' }, h('span', 'Finish'), h('b', 'Final assessment')));

    clear(app).append(h('div.mod-page', head, heroImg, body, takeaways, labHost, quizHost, nav));

    track(global.Scenes.glyph(glyphCanvas, mod.glyph, mod.color));

    if (mod.lab && global.Labs.has(mod.lab.type)) {
      const { ctx, teardown } = labCtx(mod, () => { paintChrome(); });
      liveScenes.push({ destroy: teardown });
      global.Labs.mount(mod.lab.type, labHost, ctx);
    }
    quizHost.appendChild(renderQuiz(mod, (p) => {
      const st = mp(id);
      st.quiz = Math.max(st.quiz || 0, p);
      save(); paintChrome();
    }));

    paintChrome();
    app.scrollTop = 0;
    global.scrollTo({ top: 0, behavior: 'auto' });
  }

  /* ---------- final exam ---------- */
  function buildExam() {
    const pool = [];
    C.modules.forEach(m => m.quiz.forEach((q, qi) => pool.push({ m: m.id, mt: m.title, qi, q })));
    // one question from each module first, then fill to 15
    const byMod = {};
    pool.forEach(p => { (byMod[p.m] = byMod[p.m] || []).push(p); });
    const picked = [];
    Object.keys(byMod).forEach(k => {
      const arr = byMod[k];
      picked.push(arr[Math.floor(Math.random() * arr.length)]);
    });
    const rest = pool.filter(p => !picked.includes(p));
    while (picked.length < 15 && rest.length) {
      picked.push(rest.splice(Math.floor(Math.random() * rest.length), 1)[0]);
    }
    return picked.sort(() => Math.random() - 0.5);
  }

  function viewExam() {
    killScenes();
    if (ambient) ambient.setTint('violet');
    if (!courseComplete()) {
      const o = overall();
      clear(app).append(h('div.gate',
        h('h1', 'Final assessment locked'),
        h('p', `Complete all ${o.total} modules first — you are at ${o.done} of ${o.total}. Each module needs its lab and its knowledge check.`),
        h('div.gate-list', C.order.filter(id => !moduleDone(id)).map(id =>
          h('a.gate-item', { href: '#/m/' + id }, h('b', C.byId[id].n), C.byId[id].title))),
        h('a.btn.ghost', { href: '#/' }, 'Back to the course')));
      return;
    }

    const qs = buildExam();
    let i = 0, correct = 0;
    const answers = [];
    const stage = h('div.exam-stage');
    const barFill = h('i');
    const wrap = h('div.exam-page',
      h('header.exam-head',
        h('span.sec-kicker', 'Final assessment'),
        h('h1', 'Fifteen questions, drawn from every module'),
        h('p', 'One attempt per sitting. 75% or above earns the certificate — you can retake it as many times as you like.')),
      h('div.exam-bar', barFill), stage);

    function step() {
      if (i >= qs.length) return finish();
      const item = qs[i];
      barFill.style.width = (i / qs.length * 100) + '%';
      clear(stage).append(
        h('div.exam-q',
          h('span.exam-count', 'Question ' + (i + 1) + ' of ' + qs.length),
          h('span.exam-src', item.mt),
          h('p.quiz-q', { html: item.q.q })),
        h('div.choices', item.q.options.map((o, oi) =>
          h('button.choice', { type: 'button', onclick: (e) => {
            const box = e.currentTarget.parentElement;
            if (box.dataset.locked) return;
            box.dataset.locked = '1';
            const ok = oi === item.q.answer;
            if (ok) correct++;
            answers.push({ item, pick: oi, ok });
            Array.from(box.children).forEach((c, ci) => {
              if (ci === item.q.answer) c.classList.add('is-right');
              if (ci === oi && !ok) c.classList.add('is-wrong');
            });
            stage.appendChild(h('div.feedback.' + (ok ? 'good' : 'bad'),
              h('b', ok ? 'Correct' : 'Not quite'), h('p', { html: item.q.why }),
              btn(i === qs.length - 1 ? 'See final result' : 'Next question', 'primary',
                () => { i++; step(); })));
          } }, h('span.choice-key', String.fromCharCode(65 + oi)), h('span.choice-label', { html: o })))));
    }
    function finish() {
      barFill.style.width = '100%';
      const p = pct(correct, qs.length);
      const passed = p >= 75;
      P.exam = Math.max(P.exam || 0, p); save(); paintChrome();
      if (passed) {
        syncGoogleSheet({
          event: 'EXAM_PASSED',
          action: 'Final Assessment Completed',
          status: 'Passed (' + p + '%)'
        });
      }
      const missed = answers.filter(a => !a.ok);
      clear(stage).append(h('div.exam-result.' + (passed ? 'good' : 'bad'),
        h('div.exam-score', h('b', p + '%'), h('span', correct + ' of ' + qs.length + ' correct')),
        h('h2', passed ? 'Passed' : 'Not yet — 75% needed'),
        h('p', passed
          ? 'You can now claim your certificate. Then do the thing that actually matters: change one more setting today.'
          : 'Review the modules below and retake when you are ready. There is no limit on attempts.'),
        missed.length ? h('div.exam-review',
          h('b', 'Worth revisiting'),
          h('div.gate-list', Array.from(new Set(missed.map(m => m.item.m))).map(id =>
            h('a.gate-item', { href: '#/m/' + id }, h('b', C.byId[id].n), C.byId[id].title)))) : null,
        h('div.hero-actions',
          passed ? h('a.btn.primary', { href: '#/certificate' }, 'Claim certificate') : null,
          btn('Retake assessment', 'ghost', () => viewExam()))));
    }
    clear(app).append(wrap);
    step();
  }

  /* ---------- certificate ---------- */
  function viewCertificate() {
    killScenes();
    if (ambient) ambient.setTint('amber');
    const eligible = courseComplete() && (P.exam || 0) >= 75;
    const badgeCanvas = h('canvas.badge-canvas', { 'aria-hidden': 'true' });

    if (!eligible) {
      const o = overall();
      clear(app).append(h('div.gate',
        h('div.gate-3d', badgeCanvas),
        h('h1', 'Certificate locked'),
        h('p', courseComplete()
          ? 'All modules are complete. Pass the final assessment at 75% or above to unlock the certificate.'
          : `Complete all ${o.total} modules (${o.done} done) and pass the final assessment at 75% or above.`),
        h('div.hero-actions',
          h('a.btn.primary', { href: courseComplete() ? '#/exam' : '#/' },
            courseComplete() ? 'Take the final assessment' : 'Continue the course'))));
      track(global.Scenes.badge(badgeCanvas));
      return;
    }

    const canvas = h('canvas.cert-canvas', { width: 1600, height: 1130 });
    const dlBtn = btn('Download PNG Certificate', 'primary', download);

    const studentCard = h('div', { style: 'padding:16px 20px;border-radius:12px;background:rgba(34,211,238,0.06);border:1px solid rgba(34,211,238,0.25);text-align:left;margin-bottom:14px;' },
      h('div', { style: 'font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#22d3ee;font-weight:700;margin-bottom:4px;' }, '✓ Verified Registered Recipient'),
      h('div', { style: 'font-size:20px;font-weight:800;color:#ffffff;' }, P.name || 'Participant'),
      h('div', { style: 'font-size:12px;color:rgba(180,210,240,0.7);margin-top:6px;display:flex;flex-wrap:wrap;gap:14px;' },
        P.email ? h('span', `📧 ${P.email}`) : null,
        P.phone ? h('span', `📞 ${P.phone}`) : null,
        h('span', `🎯 Score: ${P.exam || 0}%`)
      ),
      h('div', { style: 'font-size:11px;color:rgba(140,180,220,0.45);margin-top:6px;' }, 'Certificate name is permanently verified from your initial course registration.')
    );

    clear(app).append(h('div.cert-page',
      h('header.cert-head',
        h('div.cert-3d', badgeCanvas),
        h('div',
          h('span.sec-kicker', 'Completed & Verified'),
          h('h1', 'Your Official Certificate'),
          h('p', 'Issued in the name of your verified registration. You can download the high-resolution PNG or print directly.'))),
      h('div.cert-controls',
        studentCard,
        h('div.hero-actions', dlBtn, btn('Print', 'ghost', () => global.print()))),
      h('div.cert-frame', canvas)));
    track(global.Scenes.badge(badgeCanvas));
    draw();

    function draw() {
      const g = canvas.getContext('2d');
      const W = canvas.width, H = canvas.height;
      g.clearRect(0, 0, W, H);

      const bg = g.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#060b18'); bg.addColorStop(0.55, '#0a1430'); bg.addColorStop(1, '#050912');
      g.fillStyle = bg; g.fillRect(0, 0, W, H);

      // corner glows
      [[0, 0, '#1b6ef3'], [W, H, '#7c3aed']].forEach(([x, y, c]) => {
        const rg = g.createRadialGradient(x, y, 0, x, y, W * 0.6);
        rg.addColorStop(0, c + '44'); rg.addColorStop(1, '#00000000');
        g.fillStyle = rg; g.fillRect(0, 0, W, H);
      });

      // frame
      g.strokeStyle = 'rgba(120,200,255,.45)'; g.lineWidth = 3;
      g.strokeRect(48, 48, W - 96, H - 96);
      g.strokeStyle = 'rgba(120,200,255,.18)'; g.lineWidth = 1;
      g.strokeRect(66, 66, W - 132, H - 132);

      const cx = W / 2;
      g.textAlign = 'center';

      g.fillStyle = 'rgba(140,215,255,.85)';
      g.font = '600 26px ui-sans-serif, Segoe UI, system-ui, sans-serif';
      g.letterSpacing = '10px';
      g.fillText('CERTIFICATE OF COMPLETION', cx, 190);
      g.letterSpacing = '0px';

      g.fillStyle = '#eaf4ff';
      g.font = '800 92px ui-sans-serif, Segoe UI, system-ui, sans-serif';
      g.fillText('CYBER SMART', cx, 300);

      g.fillStyle = 'rgba(190,220,255,.75)';
      g.font = '400 34px ui-sans-serif, Segoe UI, system-ui, sans-serif';
      g.fillText('Protecting Yourself in an AI-Powered Digital World', cx, 356);

      g.fillStyle = 'rgba(160,200,240,.6)';
      g.font = '400 26px ui-sans-serif, Segoe UI, system-ui, sans-serif';
      g.fillText('This certifies that', cx, 468);

      const nm = (P.name || '').trim() || 'Your Name';
      g.fillStyle = '#7ee6ff';
      let fs = 82;
      g.font = '700 ' + fs + 'px ui-sans-serif, Segoe UI, system-ui, sans-serif';
      while (g.measureText(nm).width > W - 320 && fs > 34) {
        fs -= 4; g.font = '700 ' + fs + 'px ui-sans-serif, Segoe UI, system-ui, sans-serif';
      }
      g.fillText(nm, cx, 560);
      g.strokeStyle = 'rgba(126,230,255,.4)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(cx - 340, 596); g.lineTo(cx + 340, 596); g.stroke();

      g.fillStyle = 'rgba(200,225,255,.8)';
      g.font = '400 28px ui-sans-serif, Segoe UI, system-ui, sans-serif';
      g.fillText('has completed all 13 modules and 12 practical labs,', cx, 660);
      g.fillText('and passed the final assessment with a score of ' + (P.exam || 0) + '%.', cx, 702);

      // five doors row
      const doors = C.doors.map(d => d.name.toUpperCase());
      const colors = ['#22d3ee', '#5b8cff', '#a78bfa', '#f472b6', '#34d399'];
      const boxW = 220, gap = 24;
      const total = doors.length * boxW + (doors.length - 1) * gap;
      let x = cx - total / 2;
      doors.forEach((d, i) => {
        g.strokeStyle = colors[i] + '77'; g.lineWidth = 2;
        g.strokeRect(x, 776, boxW, 84);
        g.fillStyle = colors[i] + '18'; g.fillRect(x, 776, boxW, 84);
        g.fillStyle = colors[i];
        g.font = '700 22px ui-sans-serif, Segoe UI, system-ui, sans-serif';
        g.fillText(d, x + boxW / 2, 812);
        g.fillStyle = 'rgba(220,235,255,.55)';
        g.font = '400 16px ui-sans-serif, Segoe UI, system-ui, sans-serif';
        g.fillText('DOOR 0' + (i + 1), x + boxW / 2, 840);
        x += boxW + gap;
      });

      g.fillStyle = 'rgba(126,230,255,.9)';
      g.font = '600 30px ui-sans-serif, Segoe UI, system-ui, sans-serif';
      g.letterSpacing = '6px';
      g.fillText('PAUSE  •  VERIFY  •  PROTECT', cx, 936);
      g.letterSpacing = '0px';

      // signature block
      g.textAlign = 'left';
      g.strokeStyle = 'rgba(180,210,255,.35)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(160, 1010); g.lineTo(620, 1010); g.stroke();
      g.fillStyle = '#dceaff';
      g.font = '600 26px ui-sans-serif, Segoe UI, system-ui, sans-serif';
      g.fillText(C.author.name, 160, 1046);
      g.fillStyle = 'rgba(170,200,235,.65)';
      g.font = '400 19px ui-sans-serif, Segoe UI, system-ui, sans-serif';
      g.fillText(C.author.role, 160, 1076);

      g.textAlign = 'right';
      g.beginPath(); g.moveTo(W - 620, 1010); g.lineTo(W - 160, 1010); g.stroke();
      g.fillStyle = '#dceaff';
      g.font = '600 26px ui-sans-serif, Segoe UI, system-ui, sans-serif';
      const d = new Date();
      g.fillText(d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }), W - 160, 1046);
      g.fillStyle = 'rgba(170,200,235,.65)';
      g.font = '400 19px ui-sans-serif, Segoe UI, system-ui, sans-serif';
      g.fillText('Date of completion', W - 160, 1076);
      g.textAlign = 'center';
    }

    function download() {
      canvas.toBlob((blob) => {
        if (!blob) return;
        syncGoogleSheet({
          event: 'CERTIFICATE_CLAIMED',
          action: 'Certificate Claimed & Downloaded',
          status: 'Certificate Issued'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cyber-smart-certificate-' +
          ((P.name || 'certificate').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'certificate') + '.png';
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, 'image/png');
    }
  }

  /* ---------- registration gate ---------- */
  function viewRegister() {
    killScenes();
    if (ambient) ambient.setTint('cyan');
    const badgeCanvas = h('canvas.badge-canvas', { 'aria-hidden': 'true' });

    const nameInput = h('input.cert-name-input', {
      type: 'text', value: '', maxlength: '60',
      placeholder: 'Full Name (as it will appear on your certificate)',
      autocomplete: 'name', required: 'true'
    });
    const phoneInput = h('input.cert-name-input', {
      type: 'tel', value: '', maxlength: '20',
      placeholder: 'Phone Number (e.g. +92-333-XXXXXXX)',
      autocomplete: 'tel', required: 'true'
    });
    const emailInput = h('input.cert-name-input', {
      type: 'email', value: '', maxlength: '80',
      placeholder: 'Email Address',
      autocomplete: 'email', required: 'true'
    });

    const errMsg = h('div.callout.warn', { style: 'display:none;margin-top:12px' },
      h('p', 'Please fill in all three fields to continue.'));

    const regBtn = btn('Register & Start Course →', 'primary', () => {
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const email = emailInput.value.trim();
      if (!name || !phone || !email) {
        errMsg.style.display = 'block';
        return;
      }
      // basic email check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errMsg.querySelector('p').textContent = 'Please enter a valid email address.';
        errMsg.style.display = 'block';
        return;
      }
      P.name = name;
      P.phone = phone;
      P.email = email;
      P.registered = true;
      save();
      syncGoogleSheet({
        event: 'STUDENT_REGISTERED',
        action: 'New Course Registration',
        status: 'Course Started'
      });
      location.hash = '#/';
      route();
    });

    const formFields = h('div', { style: 'display:flex;flex-direction:column;gap:16px;max-width:480px;margin:0 auto' },
      h('label', { style: 'display:flex;flex-direction:column;gap:6px;text-align:left;color:rgba(180,210,240,.85);font-size:13px;font-weight:600' },
        '📝 Full Name *', h('span', { style: 'font-size:11px;font-weight:400;color:rgba(140,180,220,.5)' }, 'This name will appear on your certificate'), nameInput),
      h('label', { style: 'display:flex;flex-direction:column;gap:6px;text-align:left;color:rgba(180,210,240,.85);font-size:13px;font-weight:600' },
        '📞 Phone Number *', phoneInput),
      h('label', { style: 'display:flex;flex-direction:column;gap:6px;text-align:left;color:rgba(180,210,240,.85);font-size:13px;font-weight:600' },
        '📧 Email Address *', emailInput),
      errMsg);

    clear(app).append(h('div.gate',
      h('div.gate-3d', badgeCanvas),
      h('span.hero-eyebrow', 'Interactive course · 13 modules · 12 labs'),
      h('h1', 'Welcome to Cyber Smart'),
      h('p', 'Protecting Yourself in an AI-Powered Digital World'),
      h('p', { style: 'margin-top:8px;color:rgba(160,200,240,.65);font-size:14px' },
        'Please register below to start the course. Your name will be printed on your certificate upon completion.'),
      formFields,
      h('div.hero-actions', { style: 'margin-top:20px' }, regBtn),
      h('p', { style: 'margin-top:16px;color:rgba(140,180,220,.35);font-size:11px' },
        'Your data is stored only in this browser. Nothing is uploaded.')));
    track(global.Scenes.badge(badgeCanvas));
  }

  /* ================= router ================= */
  function route() {
    const hash = location.hash || '#/';
    const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    document.body.classList.remove('nav-open');

    // Registration gate: must register before accessing any course content
    if (!P.registered) { viewRegister(); paintChrome(); global.scrollTo({ top: 0, behavior: 'auto' }); return; }

    if (!parts.length) viewHome();
    else if (parts[0] === 'm' && parts[1]) viewModule(parts[1]);
    else if (parts[0] === 'exam') viewExam();
    else if (parts[0] === 'certificate') viewCertificate();
    else viewHome();
    paintChrome();
    global.scrollTo({ top: 0, behavior: 'auto' });
  }

  /* ================= boot ================= */
  function boot() {
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas && global.Scenes) ambient = global.Scenes.ambient(bgCanvas, { tint: 'cyan' });

    const toggle = document.getElementById('nav-toggle');
    if (toggle) toggle.addEventListener('click', () => document.body.classList.toggle('nav-open'));
    if (sidebar) sidebar.addEventListener('click', (e) => {
      if (e.target.closest('a')) document.body.classList.remove('nav-open');
    });

    const reset = document.getElementById('reset-progress');
    if (reset) reset.addEventListener('click', () => {
      if (!confirm('Clear all saved progress on this device? This cannot be undone.')) return;
      try { localStorage.removeItem(KEY); } catch (e) {}
      location.hash = '#/';
      location.reload();
    });

    global.addEventListener('hashchange', route);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') document.body.classList.remove('nav-open');
    });
    route();
    document.body.classList.add('ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
