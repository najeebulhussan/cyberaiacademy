/* =====================================================================
   Cyber Smart — interactive labs
   Each lab mounts into a container and reports a score back through the
   ctx handed in by the app. Labs are self-contained and stateless across
   reloads except for what the app chooses to persist.
   ===================================================================== */
(function (global) {
  'use strict';

  /* ---------- tiny DOM helper ---------- */
  function h(tag, attrs, ...kids) {
    const parts = tag.split(/(?=[.#])/);
    const el = document.createElement(parts[0] || 'div');
    parts.slice(1).forEach(p => {
      if (p[0] === '.') el.classList.add(p.slice(1));
      else el.id = p.slice(1);
    });
    if (attrs && (typeof attrs !== 'object' || attrs.nodeType || Array.isArray(attrs))) {
      kids.unshift(attrs); attrs = null;
    }
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'dataset') Object.assign(el.dataset, v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    const add = (k) => {
      if (k == null || k === false) return;
      if (Array.isArray(k)) return k.forEach(add);
      el.appendChild(k.nodeType ? k : document.createTextNode(String(k)));
    };
    kids.forEach(add);
    return el;
  }
  const clear = (n) => { while (n.firstChild) n.removeChild(n.firstChild); return n; };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

  /* ---------- shared chrome ---------- */
  function labShell(opts) {
    const bar = h('div.lab-progress', h('i', { style: 'width:0%' }));
    const stat = h('div.lab-stat', h('span.lab-stat-label', opts.counterLabel || 'Progress'),
                                    h('b.lab-stat-value', '0'));
    const head = h('header.lab-head',
      h('div.lab-head-main',
        h('span.lab-kicker', opts.kicker || 'Lab'),
        h('h3.lab-title', opts.title),
        opts.intro ? h('p.lab-intro', { html: opts.intro }) : null),
      stat);
    const body = h('div.lab-body');
    const foot = h('footer.lab-foot');
    const root = h('section.lab', { 'aria-label': opts.title }, head, bar, body, foot);
    return {
      root, body, foot,
      setBar(p) { bar.firstChild.style.width = Math.max(0, Math.min(100, p)) + '%'; },
      setStat(v) { stat.querySelector('.lab-stat-value').textContent = v; }
    };
  }

  function resultPanel(scorePct, lines, tone) {
    const t = tone || (scorePct >= 80 ? 'good' : scorePct >= 50 ? 'warn' : 'bad');
    return h('div.lab-result.tone-' + t,
      h('div.lab-result-score', h('b', scorePct + '%'), h('span', 'lab score')),
      h('div.lab-result-body', lines.map(l =>
        typeof l === 'string' ? h('p', { html: l }) : l)));
  }

  function btn(label, cls, on) {
    return h('button.btn' + (cls ? '.' + cls : ''), { type: 'button', onclick: on }, label);
  }

  /* toggle switch row */
  function toggleRow(item, onChange) {
    const input = h('input', { type: 'checkbox', id: 'tg-' + item.id, onchange: e => onChange(item, e.target.checked) });
    return h('label.tgl', { for: 'tg-' + item.id },
      input,
      h('span.tgl-track', h('span.tgl-thumb')),
      h('span.tgl-copy',
        h('b', item.t),
        item.d ? h('span', { html: item.d }) : null));
  }

  /* multiple-choice card used by several labs */
  function choiceSet(options, onPick) {
    const wrap = h('div.choices');
    options.forEach((o, i) => {
      const b = h('button.choice', { type: 'button', onclick: () => {
        if (wrap.dataset.locked) return;
        wrap.dataset.locked = '1';
        onPick(i, wrap, b);
      } }, h('span.choice-key', String.fromCharCode(65 + i)), h('span.choice-label', { html: o }));
      wrap.appendChild(b);
    });
    return wrap;
  }

  const LABS = {};

  /* =====================================================================
     LAB — baseline self-check
     ===================================================================== */
  const BASELINE_ITEMS = [
    { id: 'b1', t: 'I reuse at least one important password.', door: 'Door 02 — Accounts',
      fix: 'Install a password manager and give your primary email a unique passphrase today.' },
    { id: 'b2', t: 'My lock screen shows message previews.', door: 'Door 01 — Mobile',
      fix: 'Set notification previews to appear only when the device is unlocked.' },
    { id: 'b3', t: 'I have not reviewed active login sessions.', door: 'Door 02 — Accounts',
      fix: 'Open logged-in devices on each platform and end anything you do not recognise.' },
    { id: 'b4', t: 'My social profile reveals personal details.', door: 'Door 04 — Social',
      fix: 'Remove workplace, home area and travel plans from public view.' },
    { id: 'b5', t: 'I upload documents to AI without removing identifiers.', door: 'Door 05 — AI',
      fix: 'Redact direct and indirect identifiers, or use an approved internal tool.' },
    { id: 'b6', t: 'My family has no safe word for emergency calls.', door: 'Door 04 — Social',
      fix: 'Agree one unguessable word with close family this week.' }
  ];
  LABS.baseline = function (root, ctx) {
    const s = labShell({ kicker: 'Lab 01', title: 'Private self-check',
      intro: 'Mark every statement that is true for you <strong>today</strong>. Each one is a point, and here a higher score means more exposure. Nothing leaves your browser.',
      counterLabel: 'Exposure' });
    const picked = new Set(ctx.load('picks') || []);
    const list = h('div.check-list');

    BASELINE_ITEMS.forEach((it, i) => {
      const input = h('input', { type: 'checkbox', id: 'bs-' + it.id });
      input.checked = picked.has(it.id);
      input.addEventListener('change', () => {
        if (input.checked) picked.add(it.id); else picked.delete(it.id);
        update();
      });
      list.appendChild(h('label.check-item', { for: 'bs-' + it.id },
        input,
        h('span.check-box'),
        h('span.check-copy', h('b', String(i + 1).padStart(2, '0') + '. ' + it.t),
                             h('span.check-door', it.door))));
    });

    const out = h('div.lab-out');
    s.body.append(list, out);
    s.foot.append(btn('See my starting point', 'primary', finish));

    function update() {
      s.setStat(picked.size + ' / 6');
      s.setBar((picked.size / 6) * 100);
    }
    function finish() {
      const n = picked.size;
      const band = n === 0 ? ['Strong start', 'good'] : n <= 2 ? ['Solid, with gaps', 'good']
                 : n <= 4 ? ['Typical — worth real work', 'warn'] : ['High exposure', 'bad'];
      const todo = BASELINE_ITEMS.filter(i => picked.has(i.id));
      clear(out).append(resultPanel(n === 0 ? 100 : Math.max(10, 100 - n * 16), [
        `<strong>${band[0]}.</strong> You marked <b>${n} of 6</b>. ` +
        (n === 0 ? 'Verify each one honestly as you work through the course — several are easy to overestimate.'
                 : 'Each item below maps to a door in this course. This is your route.'),
        todo.length ? h('ul.fix-list', todo.map(i =>
          h('li', h('b', i.door), h('span', { html: i.fix })))) : null,
        'You will retake this exact check in Module 12. The difference between the two scores is what this course is for.'
      ], band[1]));
      ctx.done(100, { baseline: Array.from(picked) });
      ctx.save('picks', Array.from(picked));
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    update();
    root.appendChild(s.root);
  };

  /* =====================================================================
     LAB — device hardening simulator
     ===================================================================== */
  LABS.device = function (root, ctx) {
    const s = labShell({ kicker: 'Lab 02', title: 'Phone hardening simulator',
      intro: 'Switch on each protection and watch the simulated lock screen and exposure meter respond. Aim to close all six.',
      counterLabel: 'Hardened' });

    const items = [
      { id: 'lock',    t: 'Strong screen lock + biometrics', d: 'Six-digit PIN or better, plus fingerprint or face.', risk: 'Anyone holding the phone can open everything.' },
      { id: 'preview', t: 'Hide lock-screen previews',       d: 'Show that a message arrived, never its content.',    risk: 'One-time codes are readable without unlocking.' },
      { id: 'update',  t: 'Automatic OS and app updates',    d: 'Patch without waiting for a decision.',              risk: 'Known, already-patched flaws stay open.' },
      { id: 'perms',   t: 'Reviewed camera, mic, location',  d: 'Least privilege, app by app.',                       risk: 'Apps can watch, listen and track in the background.' },
      { id: 'backup',  t: 'Find device + encrypted backup',  d: 'Locate, lock, erase — and restore.',                 risk: 'A lost phone becomes permanent data loss.' },
      { id: 'store',   t: 'Official app stores only',        d: 'No sideloaded APKs or modded apps.',                 risk: 'Unreviewed apps install malware directly.' }
    ];
    const on = {};

    /* simulated phone */
    const notif = (title, body, blurred) => h('div.sim-notif' + (blurred ? '.blur' : ''),
      h('b', title), h('span', body));
    const screen = h('div.sim-screen');
    const meterFill = h('i');
    const meter = h('div.sim-meter', h('span', 'Attacker exposure'), h('div.sim-meter-track', meterFill), h('b.sim-meter-val', '100%'));
    const riskList = h('ul.risk-list');
    const phone = h('div.sim-phone', h('div.sim-notch'), screen, h('div.sim-home'));

    const grid = h('div.lab-split',
      h('div.lab-split-left', items.map(it => toggleRow(it, (item, val) => { on[item.id] = val; render(); }))),
      h('div.lab-split-right', phone, meter, riskList));

    s.body.append(grid);
    s.foot.append(btn('Lock it in', 'primary', finish));
    const out = h('div.lab-out'); s.body.appendChild(out);

    function render() {
      const count = items.filter(i => on[i.id]).length;
      s.setStat(count + ' / 6'); s.setBar((count / 6) * 100);

      clear(screen);
      screen.appendChild(h('div.sim-time', on.lock ? '09:41' : '09:41', h('small', on.lock ? 'Locked' : 'No lock set')));
      screen.classList.toggle('unlocked', !on.lock);
      screen.appendChild(notif('Bank', on.preview ? 'Message hidden — unlock to read' : 'Your OTP is 448192. Do not share.', on.preview));
      screen.appendChild(notif('WhatsApp — Ammi', on.preview ? '2 new messages' : 'Beta, send the money to this account…', on.preview));
      if (!on.store) screen.appendChild(h('div.sim-badge.bad', 'Unknown app installed from a forwarded link'));
      if (!on.update) screen.appendChild(h('div.sim-badge.warn', 'Update available for 3 weeks'));
      if (!on.perms) screen.appendChild(h('div.sim-badge.warn', 'Mic in use by "Torch Pro"'));

      const exposure = Math.round(100 - (count / items.length) * 100);
      meterFill.style.width = exposure + '%';
      meter.querySelector('.sim-meter-val').textContent = exposure + '%';
      meter.dataset.tone = exposure > 60 ? 'bad' : exposure > 25 ? 'warn' : 'good';

      clear(riskList);
      const openRisks = items.filter(i => !on[i.id]);
      if (!openRisks.length) riskList.appendChild(h('li.ok', 'All six baseline protections are on. This is the target state.'));
      else openRisks.forEach(i => riskList.appendChild(h('li', h('b', i.t), h('span', i.risk))));
    }

    function finish() {
      const count = items.filter(i => on[i.id]).length;
      const p = pct(count, items.length);
      clear(out).append(resultPanel(p, [
        count === items.length
          ? '<strong>All six closed.</strong> This is the baseline every phone should start from — and none of it costs anything.'
          : `<strong>${count} of 6 closed.</strong> Each remaining toggle is a live gap; the exposure meter shows what an attacker still gets for free.`,
        'Now do it on the real device beside you. The settings sit under <em>Security &amp; privacy</em> on Android and <em>Face ID &amp; Passcode</em> plus <em>Privacy &amp; Security</em> on iPhone — or search Settings for “previews”, “permissions” and “update”.'
      ]));
      ctx.done(p);
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    render();
    root.appendChild(s.root);
  };

  /* =====================================================================
     LAB — message triage
     ===================================================================== */
  const TRIAGE = [
    { from: 'WhatsApp • +92 3XX XXXXXXX (not saved)', chan: 'WhatsApp',
      body: 'Assalam o alaikum. This is Bilal from the office. I am in a meeting and cannot talk. Please buy 3 mobile load vouchers of Rs 5,000 and send me the codes. Urgent. Do not call, I am in the meeting.',
      verdict: 2,
      flags: ['Unsaved number claiming to be a known colleague', 'Explicit instruction not to call — blocks verification', 'Untraceable payment method (vouchers)', 'Manufactured urgency'],
      why: 'The "do not call" instruction exists purely to prevent verification. Vouchers and mobile load are chosen because they are irreversible and untraceable.' },
    { from: 'Email • no-reply@hbl-secure-verify.com', chan: 'Email',
      body: 'Dear Customer, unusual activity was detected on your account. Your account will be SUSPENDED within 24 hours. Click here to re-verify your identity and restore access.',
      verdict: 2,
      flags: ['Look-alike domain, not the bank\'s real one', 'Deadline pressure', 'Generic greeting with no account detail', 'Link-based "re-verification"'],
      why: 'The domain is the tell — real institutions use their own domain. No bank restores access through an emailed link, and the 24-hour clock is there to stop you checking.' },
    { from: 'SMS • 8080', chan: 'SMS',
      body: 'Your one-time code is 552-901. This code expires in 5 minutes. If you did not request this, do not share it with anyone.',
      verdict: 1,
      flags: ['Arrived without you requesting it — someone is trying to log in as you'],
      why: 'The message itself is genuine. The problem is that you did not request it: someone has your password and is at the code step. Change that password now — and never read the code to anyone.' },
    { from: 'Voice call • shows "Aapa" in caller ID', chan: 'Call',
      body: 'Crying voice: "There has been an accident, I am at the hospital, they need Rs 200,000 before they will treat me. Please don\'t tell Abbu, he will panic. Send it to this account number now."',
      verdict: 2,
      flags: ['Cloned voice using a familiar identity', 'Extreme urgency plus distress', 'Demand for secrecy from other family', 'New, unfamiliar account number'],
      why: 'Caller ID is spoofable and voices are cloneable from seconds of public audio. The secrecy request is the giveaway — it exists to stop the one thing that defeats the scam: calling back on a saved number.' },
    { from: 'Email • hr@yourcompany.com (matches directory)', chan: 'Email',
      body: 'Hi — attached is the updated leave policy PDF we discussed in Monday\'s team meeting. Let me know if the new carry-over rule is clear.',
      verdict: 0,
      flags: ['Expected sender, expected topic, references a shared real context'],
      why: 'Expected sender on an expected channel, referencing a meeting you attended. This clears both download questions. Still open attachments with normal caution, but nothing here warrants escalation.' },
    { from: 'Instagram DM • verified-looking brand account', chan: 'DM',
      body: 'Congratulations! You have been selected for our brand ambassador programme. To release your Rs 50,000 payment we need a small refundable processing fee of Rs 2,500 and a photo of your CNIC.',
      verdict: 2,
      flags: ['Unsolicited prize or selection', 'Advance fee to receive money', 'Request for identity documents', 'Pressure framed as an opportunity'],
      why: 'Money never flows to you after you pay a fee — that is advance-fee fraud. The CNIC photo is the real objective: it enables account opening and identity fraud long after the Rs 2,500.' }
  ];
  const VERDICTS = ['Safe — proceed normally', 'Genuine but act on it', 'Fraud — do not comply'];

  LABS.triage = function (root, ctx) {
    const s = labShell({ kicker: 'Lab 03', title: 'Inbox triage under pressure',
      intro: 'Six real-world messages. Judge each one, then read the flags you did or did not catch. Apply <strong>STOP → CHECK → VERIFY → ACT</strong>.',
      counterLabel: 'Correct' });
    let i = 0, correct = 0;
    const stage = h('div.triage-stage');
    const out = h('div.lab-out');
    s.body.append(stage, out);

    function show() {
      if (i >= TRIAGE.length) return finish();
      const m = TRIAGE[i];
      s.setStat(correct + ' / ' + TRIAGE.length);
      s.setBar((i / TRIAGE.length) * 100);
      clear(stage).append(
        h('div.msg-card',
          h('div.msg-meta', h('span.msg-chan', m.chan), h('span.msg-from', m.from)),
          h('div.msg-body', { html: m.body }),
          h('div.msg-index', 'Message ' + (i + 1) + ' of ' + TRIAGE.length)),
        h('p.lab-prompt', 'What is your verdict?'),
        choiceSet(VERDICTS, (pick, wrap) => {
          const ok = pick === m.verdict;
          if (ok) correct++;
          Array.from(wrap.children).forEach((c, ci) => {
            if (ci === m.verdict) c.classList.add('is-right');
            if (ci === pick && !ok) c.classList.add('is-wrong');
          });
          stage.appendChild(h('div.feedback.' + (ok ? 'good' : 'bad'),
            h('b', ok ? 'Correct' : 'Not quite — the answer is “' + VERDICTS[m.verdict] + '”'),
            h('p', { html: m.why }),
            h('div.flag-title', 'Signals in this message'),
            h('ul.flag-list', m.flags.map(f => h('li', f))),
            btn(i === TRIAGE.length - 1 ? 'See results' : 'Next message', 'primary', () => { i++; show(); })));
          s.setStat(correct + ' / ' + TRIAGE.length);
          stage.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }));
    }
    function finish() {
      s.setBar(100);
      clear(stage);
      const p = pct(correct, TRIAGE.length);
      clear(out).append(resultPanel(p, [
        `You judged <b>${correct} of ${TRIAGE.length}</b> correctly.`,
        p === 100 ? 'Clean sweep. Note that you had unlimited time — the real difficulty is applying this while a message insists you have ninety seconds.'
                  : 'Re-read the ones you missed. In every case the decisive signal was structural — a new payment channel, a blocked verification path, or a demand for secrecy — not the wording.',
        '<strong>Carry this out of the lab:</strong> nobody legitimate ever needs the one-time code that was sent to you, and no genuine emergency is damaged by a sixty-second pause.'
      ]));
      ctx.done(p);
    }
    show();
    root.appendChild(s.root);
  };

  /* =====================================================================
     LAB — sessions and sign-in
     ===================================================================== */
  const SESSIONS = [
    { dev: 'iPhone 14 • Islamabad, PK', when: 'Active now — this device', bad: false,
      note: 'Your current device. Leave it.' },
    { dev: 'Chrome on Windows • Islamabad, PK', when: 'Last active 2 hours ago', bad: false,
      note: 'Your own desktop, recognised location and recent activity.' },
    { dev: 'WhatsApp Web • Lahore, PK', when: 'Linked 8 months ago', bad: true,
      note: 'A linked desktop session reads your messages in real time. Eight months old and in a city you do not work from — end it.' },
    { dev: 'Samsung SM-A125 • Islamabad, PK', when: 'Last active 14 months ago', bad: true,
      note: 'An old phone you no longer own is still a live session. End it.' },
    { dev: 'Firefox on Linux • Amsterdam, NL', when: 'Active 20 minutes ago', bad: true,
      note: 'Unrecognised device, unrecognised country, active right now. End it, change the password, then check recovery details.' },
    { dev: 'Instagram on iPad • Islamabad, PK', when: 'Last active yesterday', bad: false,
      note: 'Your household tablet, recent and local.' }
  ];
  const FINDIT = [
    { goal: 'End a linked desktop session that can read your chats in real time',
      options: ['WhatsApp › Settings › Linked Devices', 'WhatsApp › Settings › Chats › Backup',
                'Facebook › Settings › Apps & websites', 'Instagram › Settings › Close Friends'],
      answer: 0, why: 'Linked Devices is where WhatsApp lists every desktop and web session attached to your account.' },
    { goal: 'See every device currently logged into your Facebook account',
      options: ['Facebook › Settings › Notifications', 'Facebook › Settings › Where you\'re logged in',
                'Facebook › Settings › Blocking', 'Facebook › Settings › Language'],
      answer: 1, why: '"Where you\'re logged in" lists active sessions, with device and approximate location.' },
    { goal: 'Revoke a third-party app that still has access to your X account',
      options: ['X › Settings › Muted accounts', 'X › Settings › Display',
                'X › Settings › Apps and sessions › Connected apps', 'X › Settings › Bookmarks'],
      answer: 2, why: 'Connected apps retain access long after you stop using them — a stale integration is a session by another name.' },
    { goal: 'You suspect your account is compromised. What do you do first?',
      options: ['End all other sessions, then change the password',
                'Change the password, then end all other sessions',
                'Delete the app and reinstall it',
                'Post a warning to your followers'],
      answer: 1, why: 'Ending sessions first leaves the attacker holding a working password. Change it, then evict everyone.' }
  ];

  LABS.sessions = function (root, ctx) {
    const s = labShell({ kicker: 'Lab 04', title: 'Session review and settings hunt',
      intro: 'Two parts. First evict the sessions that should not be there, then locate the right setting for four goals.',
      counterLabel: 'Score' });
    let phase = 1, sessScore = 0, findScore = 0;
    const stage = h('div.lab-stage'); const out = h('div.lab-out');
    s.body.append(stage, out);

    function partOne() {
      const decided = {};
      const list = h('div.session-list', SESSIONS.map((se, idx) => {
        const row = h('div.session-row',
          h('div.session-info', h('b', se.dev), h('span', se.when)),
          h('div.session-acts',
            btn('Keep', 'ghost', () => decide(idx, false, row)),
            btn('End session', 'danger', () => decide(idx, true, row))),
          h('div.session-note'));
        return row;
      }));
      function decide(idx, ended, row) {
        if (decided[idx] != null) return;
        const se = SESSIONS[idx];
        const ok = ended === se.bad;
        decided[idx] = ok;
        if (ok) sessScore++;
        row.classList.add(ok ? 'is-right' : 'is-wrong', ended ? 'ended' : 'kept');
        row.querySelector('.session-acts').innerHTML =
          '<span class="session-tag">' + (ended ? 'Ended' : 'Kept') + '</span>';
        row.querySelector('.session-note').textContent = (ok ? '✓ ' : '✕ ') + se.note;
        s.setStat(sessScore + ' / ' + SESSIONS.length);
        s.setBar((Object.keys(decided).length / SESSIONS.length) * 50);
        if (Object.keys(decided).length === SESSIONS.length) {
          stage.appendChild(btn('Continue to the settings hunt', 'primary', () => { phase = 2; partTwo(); }));
        }
      }
      clear(stage).append(
        h('p.lab-prompt', 'Six sessions are logged into your accounts. Keep the ones that belong, end the ones that do not.'),
        list);
    }

    function partTwo() {
      let i = 0;
      const step = () => {
        if (i >= FINDIT.length) return finish();
        const q = FINDIT[i];
        s.setBar(50 + (i / FINDIT.length) * 50);
        clear(stage).append(
          h('div.goal-card', h('span.goal-kicker', 'Goal ' + (i + 1) + ' of ' + FINDIT.length), h('b', q.goal)),
          choiceSet(q.options, (pick, wrap) => {
            const ok = pick === q.answer;
            if (ok) findScore++;
            Array.from(wrap.children).forEach((c, ci) => {
              if (ci === q.answer) c.classList.add('is-right');
              if (ci === pick && !ok) c.classList.add('is-wrong');
            });
            s.setStat((sessScore + findScore) + ' / ' + (SESSIONS.length + FINDIT.length));
            stage.appendChild(h('div.feedback.' + (ok ? 'good' : 'bad'),
              h('b', ok ? 'Correct' : 'Not this one'), h('p', { html: q.why }),
              btn(i === FINDIT.length - 1 ? 'See results' : 'Next goal', 'primary', () => { i++; step(); })));
          }));
      };
      step();
    }

    function finish() {
      s.setBar(100); clear(stage);
      const total = SESSIONS.length + FINDIT.length;
      const got = sessScore + findScore;
      const p = pct(got, total);
      clear(out).append(resultPanel(p, [
        `<b>${got} of ${total}</b> correct — ${sessScore}/${SESSIONS.length} on sessions, ${findScore}/${FINDIT.length} on settings.`,
        'The three sessions that had to go were the eight-month-old WhatsApp Web link, the phone you no longer own, and the active foreign login. All three are ordinary findings on real accounts.',
        '<strong>Do this now:</strong> open the logged-in devices list on your most-used platform and read it like a guest book. Then set a reminder to repeat it every three months.'
      ]));
      ctx.done(p);
    }
    s.setStat('0 / ' + (SESSIONS.length + FINDIT.length));
    partOne();
    root.appendChild(s.root);
  };

  /* =====================================================================
     LAB — master key ladder (ordering + choices)
     ===================================================================== */
  LABS.masterkey = function (root, ctx) {
    const s = labShell({ kicker: 'Lab 05', title: 'Build the master key',
      intro: 'Put the five hardening steps in the order that leaves no window open, then answer three judgement calls.',
      counterLabel: 'Score' });
    const STEPS = [
      { id: 1, t: 'Unique long password or passkey', d: 'Nowhere else, ever.' },
      { id: 2, t: 'Authenticator-based 2FA', d: 'Off SMS where possible.' },
      { id: 3, t: 'Updated recovery email and phone', d: 'Close the side door.' },
      { id: 4, t: 'Review sessions and app access', d: 'Evict what is already inside.' },
      { id: 5, t: 'Store recovery codes safely', d: 'Survive losing the phone.' }
    ];
    const pool = shuffle(STEPS);
    let chosen = [], orderScore = 0, quizScore = 0;
    const stage = h('div.lab-stage'), out = h('div.lab-out');
    s.body.append(stage, out);

    function renderOrder() {
      const bank = h('div.order-bank', pool.filter(p => !chosen.includes(p.id)).map(p =>
        btn(p.t, 'order-chip', () => { chosen.push(p.id); renderOrder(); })));
      const seq = h('ol.order-seq', chosen.map((id, idx) => {
        const st = STEPS.find(x => x.id === id);
        return h('li', h('span.order-n', idx + 1), h('b', st.t),
          btn('Remove', 'tiny', () => { chosen.splice(idx, 1); renderOrder(); }));
      }));
      s.setBar((chosen.length / 5) * 50);
      clear(stage).append(
        h('p.lab-prompt', 'Click the steps in the order you would perform them.'),
        seq.children.length ? seq : h('p.order-empty', 'Your sequence will appear here.'),
        bank,
        chosen.length === 5 ? btn('Check the sequence', 'primary', checkOrder) : null);
    }
    function checkOrder() {
      orderScore = chosen.filter((id, i) => id === STEPS[i].id).length;
      const rows = chosen.map((id, i) => {
        const st = STEPS.find(x => x.id === id);
        const ok = id === STEPS[i].id;
        return h('li.' + (ok ? 'ok' : 'no'), h('span.order-n', i + 1), h('b', st.t),
          h('span.order-fix', ok ? 'correct position' : 'should be step ' + st.id));
      });
      clear(stage).append(
        h('div.feedback.' + (orderScore === 5 ? 'good' : 'warn'),
          h('b', orderScore === 5 ? 'Exact order' : orderScore + ' of 5 in the right position'),
          h('p', { html: 'The sequence matters: a strong password with a stale recovery address still hands the account over, and storing codes before 2FA exists produces nothing to store. Password → 2FA → recovery → sessions → codes.' }),
          h('ol.order-review', rows),
          btn('Continue to judgement calls', 'primary', () => { qi = 0; quizStep(); })));
      s.setStat(orderScore + ' / 8');
      s.setBar(50);
    }

    const QS = [
      { q: 'Which is the strongest primary-email password of these four?',
        options: ['P@ssw0rd!2024', 'brass-lantern-quiet-fig-07', 'YourName1990!', 'The one you already use for two other sites'],
        answer: 1, why: 'Length and unpredictability beat symbol substitution. "P@ssw0rd" variants are in every cracking dictionary, and reuse is fatal regardless of strength.' },
      { q: 'Your recovery email is a university address you lost access to years ago. What is the risk?',
        options: ['None — you cannot use it either',
                  'Whoever controls or re-registers it can reset your account without your password',
                  'It only slows down login',
                  'It disables two-factor authentication'],
        answer: 1, why: 'Abandoned domains and recycled addresses get re-registered. Recovery bypasses the password entirely, which is why a stale address outranks password strength as a risk.' },
      { q: 'Where do backup codes belong?',
        options: ['Screenshot in your gallery', 'Emailed to the account they protect',
                  'Printed and locked away, or inside a password manager', 'A note app titled "codes"'],
        answer: 2, why: 'They must survive losing your phone without being readable by whoever finds it. Emailing them to the protected account is circular.' }
    ];
    let qi = 0;
    function quizStep() {
      if (qi >= QS.length) return finish();
      const q = QS[qi];
      s.setBar(50 + (qi / QS.length) * 50);
      clear(stage).append(
        h('div.goal-card', h('span.goal-kicker', 'Judgement call ' + (qi + 1) + ' of ' + QS.length), h('b', q.q)),
        choiceSet(q.options, (pick, wrap) => {
          const ok = pick === q.answer;
          if (ok) quizScore++;
          Array.from(wrap.children).forEach((c, ci) => {
            if (ci === q.answer) c.classList.add('is-right');
            if (ci === pick && !ok) c.classList.add('is-wrong');
          });
          s.setStat((orderScore + quizScore) + ' / 8');
          stage.appendChild(h('div.feedback.' + (ok ? 'good' : 'bad'),
            h('b', ok ? 'Correct' : 'Not this one'), h('p', { html: q.why }),
            btn(qi === QS.length - 1 ? 'See results' : 'Next', 'primary', () => { qi++; quizStep(); })));
        }));
    }
    function finish() {
      s.setBar(100); clear(stage);
      const got = orderScore + quizScore, p = pct(got, 8);
      clear(out).append(resultPanel(p, [
        `<b>${got} of 8</b> — ${orderScore}/5 on sequence, ${quizScore}/3 on judgement.`,
        'Your primary email is the parent account of everything else you own. If you change one thing after this course, change this.',
        '<strong>Practise safely:</strong> when you set up a password manager, learn on a throwaway training account before touching your live inbox.'
      ]));
      ctx.done(p);
    }
    s.setStat('0 / 8');
    renderOrder();
    root.appendChild(s.root);
  };

  /* =====================================================================
     LAB — download decisions
     ===================================================================== */
  const DOWNLOADS = [
    { file: 'Q3_Invoice_4471.pdf.exe', ctx: 'Attached to an email from a supplier you do work with.',
      answer: 2, why: 'Double extension. Whatever the icon shows, this is an executable, not a document. No legitimate invoice ships as .exe.' },
    { file: 'Team_Offsite_Photos.zip', ctx: 'From a colleague on your work address, the day after the offsite you attended.',
      answer: 0, why: 'Expected sender, expected file, expected context — all three line up. Open with normal caution.' },
    { file: 'CamScanner_Pro_v6_MOD.apk', ctx: 'Link shared in a WhatsApp group: "paid version free!"',
      answer: 2, why: 'A sideloaded, modified APK from a forward has had no review at all. "Modded paid app" is one of the most reliable malware channels there is.' },
    { file: 'Salary_Revision_2026.docx', ctx: 'From HR\'s real address, but opening it asks you to "Enable Content" to see the table.',
      answer: 2, why: 'The prompt is the attack — "Enable Content" turns on macro execution. A real HR document does not need code to display a table. Verify with HR by phone before touching it.' },
    { file: 'meeting-notes.pdf', ctx: 'A shared-drive link from your manager, who mentioned it in this morning\'s stand-up.',
      answer: 0, why: 'Expected sender, expected file, pre-announced. This clears both questions.' },
    { file: 'Court_Notice_NCCIA_Urgent.pdf', ctx: 'Unexpected email from an address you do not recognise, demanding a reply within 24 hours.',
      answer: 1, why: 'Unexpected sender plus legal alarm plus deadline. Do not open it — verify independently through the agency\'s published contact details first. Genuine notices survive a phone call.' },
    { file: 'setup_activator.exe', ctx: 'Downloaded from a site offering a cracked licence for software you need.',
      answer: 2, why: 'Cracked software and "activators" require you to disable protection and grant admin rights. The price is the whole machine.' },
    { file: 'Untitled.pptx', ctx: 'A USB drive someone left on your desk with no note.',
      answer: 2, why: 'Unknown removable media is an untrusted input, and some devices act the moment they are plugged in. Do not connect it — hand it to IT.' }
  ];
  const DL_OPTS = ['Open it — both checks pass', 'Do not open — verify with the sender first', 'Do not open — this is unsafe regardless'];

  LABS.downloads = function (root, ctx) {
    const s = labShell({ kicker: 'Lab 06', title: 'Expected sender, expected file',
      intro: 'Eight downloads. For each, decide whether it clears <strong>both</strong> questions — was the sender expected, and was the file expected?',
      counterLabel: 'Correct' });
    let i = 0, correct = 0;
    const stage = h('div.lab-stage'), out = h('div.lab-out');
    s.body.append(stage, out);

    function step() {
      if (i >= DOWNLOADS.length) return finish();
      const d = DOWNLOADS[i];
      s.setBar((i / DOWNLOADS.length) * 100);
      s.setStat(correct + ' / ' + DOWNLOADS.length);
      clear(stage).append(
        h('div.file-card',
          h('div.file-icon', d.file.split('.').pop().toUpperCase()),
          h('div.file-meta', h('b', d.file), h('span', d.ctx)),
          h('span.file-index', (i + 1) + '/' + DOWNLOADS.length)),
        choiceSet(DL_OPTS, (pick, wrap) => {
          const ok = pick === d.answer;
          if (ok) correct++;
          Array.from(wrap.children).forEach((c, ci) => {
            if (ci === d.answer) c.classList.add('is-right');
            if (ci === pick && !ok) c.classList.add('is-wrong');
          });
          s.setStat(correct + ' / ' + DOWNLOADS.length);
          stage.appendChild(h('div.feedback.' + (ok ? 'good' : 'bad'),
            h('b', ok ? 'Correct' : 'Not quite — “' + DL_OPTS[d.answer] + '”'),
            h('p', { html: d.why }),
            btn(i === DOWNLOADS.length - 1 ? 'See results' : 'Next file', 'primary', () => { i++; step(); })));
        }));
    }
    function finish() {
      s.setBar(100); clear(stage);
      const p = pct(correct, DOWNLOADS.length);
      clear(out).append(resultPanel(p, [
        `<b>${correct} of ${DOWNLOADS.length}</b> correct.`,
        'Notice what never decided the answer: how professional the file looked. AI writes fluent covering notes and generates convincing letterheads. Judge the delivery, not the design.',
        '<strong>The habit:</strong> was the sender expected, and was the file expected? Both must be yes, every time.'
      ]));
      ctx.done(p);
    }
    step();
    root.appendChild(s.root);
  };

  /* =====================================================================
     LAB — privacy exposure control panel
     ===================================================================== */
  LABS.privacy = function (root, ctx) {
    const s = labShell({ kicker: 'Lab 07', title: 'Exposure control panel',
      intro: 'Turn each control down and watch the attacker\'s research file shrink in real time.',
      counterLabel: 'Controls set' });
    const items = [
      { id: 'aud',   t: 'Restrict post audience',        d: 'Private account, or friends-only posts.',       leak: 'Your full post history, photos and connections are public.' },
      { id: 'disc',  t: 'Limit phone/email discovery',   d: 'Stop number-to-profile lookup.',                leak: 'Anyone holding a leaked phone list can map your number to this profile.' },
      { id: 'unk',   t: 'Silence unknown callers',       d: 'Filter cold approaches before you see them.',   leak: 'Cold-approach fraud reaches you directly, every time.' },
      { id: 'ip',    t: 'Protect IP address in calls',   d: 'Relay calls instead of connecting directly.',   leak: 'Callers learn your approximate location and internet provider.' },
      { id: 'loc',   t: 'Restrict location exposure',    d: 'OS permission, not just the app toggle.',       leak: 'Your home area, workplace and routine are inferable from posts.' },
      { id: 'tag',   t: 'Enable tag and mention review', d: 'Approve before your name is attached.',         leak: 'Others attach your name and face to content you never see.' },
      { id: 'word',  t: 'Filter spam and harmful words', d: 'Hidden Words, muted terms, spam filters.',      leak: 'Scam and harassment messages land in your main inbox.' },
      { id: 'chat',  t: 'Advanced chat privacy',         d: 'Limit exporting content out of conversations.', leak: 'Whole conversations can be exported and reused elsewhere.' }
    ];
    const on = {};
    const dossier = h('div.dossier');
    const meterFill = h('i');
    const meter = h('div.sim-meter', h('span', 'Research file completeness'), h('div.sim-meter-track', meterFill), h('b.sim-meter-val', '100%'));
    const out = h('div.lab-out');

    s.body.append(h('div.lab-split',
      h('div.lab-split-left', items.map(it => toggleRow(it, (item, v) => { on[item.id] = v; render(); }))),
      h('div.lab-split-right',
        h('div.dossier-head', h('b', 'ATTACKER RESEARCH FILE'), h('span', 'What a stranger collects without contacting you')),
        dossier, meter)), out);
    s.foot.append(btn('Finish the pass', 'primary', finish));

    function render() {
      const count = items.filter(i => on[i.id]).length;
      s.setStat(count + ' / ' + items.length);
      s.setBar((count / items.length) * 100);
      const open = items.filter(i => !on[i.id]);
      clear(dossier);
      if (!open.length) dossier.appendChild(h('div.dossier-empty', 'File closed. Nothing useful is publicly collectable from this profile.'));
      else open.forEach(i => dossier.appendChild(h('div.dossier-row', h('b', '▸'), h('span', i.leak))));
      const e = Math.round((open.length / items.length) * 100);
      meterFill.style.width = e + '%';
      meter.querySelector('.sim-meter-val').textContent = e + '%';
      meter.dataset.tone = e > 60 ? 'bad' : e > 25 ? 'warn' : 'good';
    }
    function finish() {
      const count = items.filter(i => on[i.id]).length;
      const p = pct(count, items.length);
      clear(out).append(resultPanel(p, [
        count === items.length
          ? '<strong>Every control set.</strong> The research file is empty — an attacker now has to make contact to learn anything, and contact is where you can detect them.'
          : `<strong>${count} of ${items.length} set.</strong> Everything still listed in the file is collected silently, without you ever knowing you were looked at.`,
        'The two most commonly missed: <em>Protect IP address in calls</em> (WhatsApp › Settings › Privacy › Advanced, and X\'s Enhanced Call Privacy), and phone-number discoverability — the setting that breaks the link between a leaked number list and your real profile.',
        'Menu labels vary by device, region and rollout. Search the settings app for the concept rather than hunting through menus.'
      ]));
      ctx.done(p);
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    render();
    root.appendChild(s.root);
  };

  /* =====================================================================
     LAB — OSINT profile recon + safe word
     ===================================================================== */
  LABS.osint = function (root, ctx) {
    const s = labShell({ kicker: 'Lab 08', title: 'Read the profile like an attacker',
      intro: 'A public profile is shown below. Find every detail that would help someone impersonate this person or their family — then build a safe word.',
      counterLabel: 'Clues found' });

    const CLUES = [
      { id: 'c1', label: 'Workplace and job title', cat: 'Family and workplace',
        why: 'Names the exact colleague whose request would not be questioned, and tells an attacker which internal process to imitate.' },
      { id: 'c2', label: 'Daughter tagged by name', cat: 'Family and workplace',
        why: 'Supplies the relationship an emergency-call scam impersonates, and a second person to research.' },
      { id: 'c3', label: 'Home neighbourhood', cat: 'Location and routine',
        why: 'Narrows physical location and makes a "delivery" or "meter reading" pretext credible.' },
      { id: 'c4', label: 'Travel dates posted in advance', cat: 'Location and routine',
        why: 'Announces when the house is empty and when you are unreachable by colleagues — the ideal window for a request in your name.' },
      { id: 'c5', label: 'Public voice note / video clip', cat: 'Face and voice samples',
        why: 'A few clear seconds is enough training material for a usable voice clone.' },
      { id: 'c6', label: 'Recent hospital visit mentioned', cat: 'Interests and recent events',
        why: 'Gives the opening line that makes contact feel personal, and a plausible reason to ask for money.' },
      { id: 'c7', label: 'Birthday shown in full', cat: 'Interests and recent events',
        why: 'A standard identity-verification field, and a very common password or PIN component.' }
    ];
    const found = new Set();
    const stage = h('div.lab-stage'), out = h('div.lab-out');
    s.body.append(stage, out);

    const POST_HTML = [
      { t: 'Profile', body: 'Ahmed R. — <span class="clue" data-c="c1">Assistant Manager, Finance at Meridian Textiles</span> · Lives in <span class="clue" data-c="c3">G-11/3, Islamabad</span> · Born <span class="clue" data-c="c7">14 March 1991</span>' },
      { t: '2 days ago', body: 'Flying to Dubai <span class="clue" data-c="c4">from the 12th to the 21st</span> — anyone want anything? 🛫' },
      { t: '1 week ago', body: 'So proud of <span class="clue" data-c="c2">Zainab</span> for coming first in her class today! 🎉' },
      { t: '2 weeks ago', body: 'Long night at <span class="clue" data-c="c6">PIMS with Ammi — finally discharged</span>, alhamdulillah. Thank you all for the duas.' },
      { t: '3 weeks ago', body: '<span class="clue" data-c="c5">▶ Video: my full 4-minute talk at the finance seminar</span> — sound is a bit rough but the slides are clear!' }
    ];

    function partOne() {
      const feed = h('div.profile-card',
        h('div.profile-top', h('div.profile-avatar', 'AR'),
          h('div', h('b', 'Ahmed R.'), h('span.profile-sub', 'Public profile · 1,247 friends'))),
        POST_HTML.map(p => h('div.profile-post', h('span.profile-when', p.t), h('div', { html: p.body }))));
      const foundList = h('ul.found-list');

      feed.addEventListener('click', (e) => {
        const el = e.target.closest('.clue');
        if (!el || el.classList.contains('got')) return;
        const c = CLUES.find(x => x.id === el.dataset.c);
        el.classList.add('got');
        found.add(c.id);
        foundList.appendChild(h('li', h('b', c.label), h('span.found-cat', c.cat), h('span', c.why)));
        s.setStat(found.size + ' / ' + CLUES.length);
        s.setBar((found.size / CLUES.length) * 60);
        if (found.size === CLUES.length) {
          stage.appendChild(h('div.feedback.good',
            h('b', 'All seven found'),
            h('p', 'Individually each is harmless. Together they name the person, their family, their employer, their location, their schedule, their voice and their current worries — everything an impersonation needs.'),
            btn('Build a safe word', 'primary', partTwo)));
        }
      });

      clear(stage).append(
        h('p.lab-prompt', 'Click every detail an attacker would file. There are <b>seven</b>.'),
        h('div.lab-split', h('div.lab-split-left', feed),
          h('div.lab-split-right', h('div.dossier-head', h('b', 'COLLECTED'), h('span', 'Why each one matters')), foundList)),
        btn('Skip to the safe word builder', 'ghost', partTwo));
    }

    function partTwo() {
      s.setBar(60);
      const input = h('input.safeword-input', { type: 'text', placeholder: 'Type a candidate safe word or phrase', autocomplete: 'off', spellcheck: 'false' });
      const verdict = h('div.safeword-verdict');
      const rulesBox = h('ul.safeword-rules');

      const RULES = [
        { t: 'At least 8 characters', f: v => v.length >= 8 },
        { t: 'Not a name, place or date from the profile', f: v => !/(ahmed|zainab|meridian|islamabad|dubai|pims|g-?11|1991|march)/i.test(v) },
        { t: 'Not a common word or obvious sequence', f: v => !/^(password|safeword|help|emergency|family|1234|0000|qwerty)$/i.test(v.trim()) },
        { t: 'Two or more unrelated words, or unusual enough not to occur naturally', f: v => v.trim().split(/[\s-]+/).length >= 2 || /[^a-z\s]/i.test(v) },
        { t: 'Nothing you have ever posted online', f: v => v.length > 0 }
      ];

      function check() {
        const v = input.value;
        clear(rulesBox);
        let passed = 0;
        RULES.forEach(r => {
          const ok = v.length > 0 && r.f(v);
          if (ok) passed++;
          rulesBox.appendChild(h('li.' + (ok ? 'ok' : 'no'), h('span.rule-mark', ok ? '✓' : '○'), r.t));
        });
        s.setBar(60 + (passed / RULES.length) * 40);
        clear(verdict);
        if (!v.length) verdict.appendChild(h('span.muted', 'The last rule is on your honour — nothing can check it for you.'));
        else if (passed === RULES.length) verdict.appendChild(h('span.good', 'Usable. Agree it with close family verbally, and never send it in a message.'));
        else verdict.appendChild(h('span.warn', passed + ' of ' + RULES.length + ' rules met.'));
        return passed;
      }
      input.addEventListener('input', check);

      clear(stage).append(
        h('p.lab-prompt', 'A safe word defeats a cloned voice, because the attacker has never heard it. Test a candidate against the rules.'),
        h('div.safeword-box', input, verdict, rulesBox),
        h('div.rule-cards',
          h('div.rule-card', h('b', 'Call back on a saved number'), h('span', 'Never the number that called, never a number given during the call.')),
          h('div.rule-card', h('b', 'A second trusted person'), h('span', 'No urgent money moves without one other family member knowing.')),
          h('div.rule-card', h('b', 'Familiar is not verified'), h('span', 'Sounding right, looking right and knowing details are all cheap to fake.'))),
        btn('Finish the lab', 'primary', () => finish(check())));
      check();
    }

    function finish(rulePass) {
      s.setBar(100); clear(stage);
      const total = CLUES.length + 5;
      const got = found.size + (rulePass || 0);
      const p = pct(got, total);
      clear(out).append(resultPanel(p, [
        `You found <b>${found.size} of ${CLUES.length}</b> clues and met <b>${rulePass || 0} of 5</b> safe-word rules.`,
        'Now do the uncomfortable version: open a private browser window, search your own name, and read what a stranger actually gets. Most people find at least one thing they thought was private.',
        '<strong>This week:</strong> agree a safe word with close family, verbally. Not in a group chat — a chat can be read.'
      ]));
      ctx.done(p);
    }
    s.setStat('0 / ' + CLUES.length);
    partOne();
    root.appendChild(s.root);
  };

  /* =====================================================================
     LAB — AI redaction
     ===================================================================== */
  LABS.redact = function (root, ctx) {
    const s = labShell({ kicker: 'Lab 09', title: 'Redact before you paste',
      intro: 'You need help summarising this note. Click every token that must be removed before it goes near a general AI tool — and leave the ones that carry the meaning.',
      counterLabel: 'Redacted' });

    /* tokens: sensitive = must redact; safe = must not */
    const DOC = [
      { txt: 'Complaint reference ' }, { txt: 'NC-2026-04471', s: 1, k: 'Case reference number' },
      { txt: ' filed by ' }, { txt: 'Mrs. Farah Iqbal', s: 1, k: 'Full name (direct identifier)' },
      { txt: ', CNIC ' }, { txt: '61101-2233445-6', s: 1, k: 'CNIC (direct identifier)' },
      { txt: ', contact ' }, { txt: '+92 300 1234567', s: 1, k: 'Phone number (direct identifier)' },
      { txt: ', resident of ' }, { txt: 'House 42, Street 9, F-8/3 Islamabad', s: 1, k: 'Home address (direct identifier)' },
      { txt: '. The complainant reports that on ' }, { txt: '14 January 2026', s: 1, k: 'Exact date — combined with role and place, re-identifies one person' },
      { txt: ' an amount of ' }, { txt: 'Rs 480,000', s: 0, k: 'Amount — analytically useful and not identifying on its own' },
      { txt: ' was transferred from account ' }, { txt: '0102-7788990011', s: 1, k: 'Bank account number' },
      { txt: ' after a ' }, { txt: 'phishing message impersonating a bank', s: 0, k: 'The attack pattern — this is what you actually want help with' },
      { txt: '. The suspect used the handle ' }, { txt: '@secure_hbl_help', s: 1, k: 'Third-party identifier — still personal data' },
      { txt: '. Investigating officer: ' }, { txt: 'Inspector Kamran Shah', s: 1, k: 'Named official (direct identifier)' },
      { txt: '. The complainant asks whether ' }, { txt: 'funds can be recalled after 72 hours', s: 0, k: 'The general question — safe and answerable' },
      { txt: '.' }
    ];

    const state = {};
    const stage = h('div.lab-stage'), out = h('div.lab-out');
    s.body.append(stage, out);
    const sensitiveCount = DOC.filter(d => d.s === 1).length;

    function partOne() {
      const doc = h('div.redact-doc');
      DOC.forEach((tk, idx) => {
        if (tk.s === undefined) { doc.appendChild(document.createTextNode(tk.txt)); return; }
        const span = h('button.token', { type: 'button', onclick: () => {
          state[idx] = !state[idx];
          span.classList.toggle('redacted', state[idx]);
          span.textContent = state[idx] ? '█'.repeat(Math.min(14, Math.max(4, Math.round(tk.txt.length / 2)))) : tk.txt;
          const n = Object.values(state).filter(Boolean).length;
          s.setStat(n + ' redacted');
          s.setBar(Math.min(70, (n / sensitiveCount) * 70));
        } }, tk.txt);
        doc.appendChild(span);
      });
      clear(stage).append(
        h('div.redact-head', h('b', 'INTERNAL NOTE — DRAFT'), h('span', 'Click a token to redact it. Click again to restore.')),
        doc,
        h('p.lab-hint', 'Remember: names are the easy part. Watch for indirect identifiers and anything in the free text.'),
        btn('Check my redaction', 'primary', checkRedaction));
    }

    let redactScore = 0;
    function checkRedaction() {
      const rows = [];
      DOC.forEach((tk, idx) => {
        if (tk.s === undefined) return;
        const did = !!state[idx], should = tk.s === 1;
        const ok = did === should;
        if (ok) redactScore++;
        rows.push(h('li.' + (ok ? 'ok' : 'no'),
          h('code', tk.txt),
          h('span.redact-verdict', ok ? (should ? 'correctly redacted' : 'correctly kept')
            : (should ? 'MISSED — must be removed' : 'over-redacted — this carried the meaning')),
          h('span.redact-why', tk.k)));
      });
      const total = DOC.filter(d => d.s !== undefined).length;
      s.setBar(70);
      clear(stage).append(
        h('div.feedback.' + (redactScore === total ? 'good' : 'warn'),
          h('b', redactScore + ' of ' + total + ' tokens handled correctly'),
          h('p', 'Over-redaction is a real failure too — strip the amount and the attack pattern and the AI cannot help you with anything. The goal is a note that is <em>useful and unattributable</em>.'),
          h('ul.redact-review', rows),
          h('div.callout.warn', h('b', 'And one thing this exercise cannot show you'),
            h('p', 'File metadata — author, organisation and revision history — travels inside the document even when the visible text is clean. And a black rectangle drawn over PDF text usually leaves the text extractable underneath. Delete and re-export, or retype the extract you need.')),
          btn('Continue to classification', 'primary', partTwo)));
    }

    const CLASSIFY = [
      { item: 'A public press release you want summarised', a: 0 },
      { item: 'A colleague\'s medical certificate, names removed but role, department and date left in', a: 1 },
      { item: 'The one-time code your bank just sent you', a: 2 },
      { item: 'A general question about how phishing works', a: 0 },
      { item: 'A photo of your CNIC, to "check if the details are readable"', a: 2 },
      { item: 'A client contract you have written approval to process, with names replaced by role labels', a: 1 }
    ];
    const CLASS_OPTS = ['Safe as-is', 'Anonymise first (and confirm approval)', 'Never — no redaction makes this appropriate'];
    let ci = 0, classScore = 0;

    function partTwo() {
      if (ci >= CLASSIFY.length) return finish();
      const c = CLASSIFY[ci];
      s.setBar(70 + (ci / CLASSIFY.length) * 30);
      clear(stage).append(
        h('div.goal-card', h('span.goal-kicker', 'Classify ' + (ci + 1) + ' of ' + CLASSIFY.length), h('b', c.item)),
        choiceSet(CLASS_OPTS, (pick, wrap) => {
          const ok = pick === c.a;
          if (ok) classScore++;
          Array.from(wrap.children).forEach((x, xi) => {
            if (xi === c.a) x.classList.add('is-right');
            if (xi === pick && !ok) x.classList.add('is-wrong');
          });
          const whys = [
            'No identifiers, no confidentiality — this is exactly what these tools are for.',
            'Role plus department plus date frequently names one person. Strip the indirect identifiers too, and only proceed where you have approval.',
            'Codes, passwords, identity documents, case files and medical records never belong in a general AI tool, regardless of framing.'
          ];
          stage.appendChild(h('div.feedback.' + (ok ? 'good' : 'bad'),
            h('b', ok ? 'Correct' : 'The answer is “' + CLASS_OPTS[c.a] + '”'),
            h('p', whys[c.a]),
            btn(ci === CLASSIFY.length - 1 ? 'See results' : 'Next', 'primary', () => { ci++; partTwo(); })));
        }));
    }

    function finish() {
      s.setBar(100); clear(stage);
      const total = DOC.filter(d => d.s !== undefined).length + CLASSIFY.length;
      const got = redactScore + classScore;
      const p = pct(got, total);
      clear(out).append(resultPanel(p, [
        `<b>${got} of ${total}</b> — ${redactScore} on redaction, ${classScore} on classification.`,
        '<strong>The one-line test:</strong> if this exact text appeared in a screenshot shared publicly tomorrow, would there be a problem? If yes, do not paste it.',
        'Where your organisation runs an approved internal AI tool, use it. Where none exists, assume the answer is no until someone with authority says otherwise — policy overrides convenience, and deleting a chat afterwards does not undo the transfer.'
      ]));
      ctx.done(p);
    }
    s.setStat('0 redacted');
    partOne();
    root.appendChild(s.root);
  };

  /* =====================================================================
     LAB — AI claim auditor
     ===================================================================== */
  const CLAIMS = [
    { q: 'What is the notice period for terminating a commercial lease in Punjab?',
      a: 'Under Section 17(3) of the Punjab Rented Premises Act 2009, a commercial tenant must be given exactly 90 days\' written notice, and the Lahore High Court confirmed this in <em>Malik v. Rehman</em> (PLD 2019 Lah 442).',
      answer: 2, cat: 'Legal citation',
      why: 'Precisely formatted, confidently delivered, and exactly the shape of output where citations are most often fabricated. Section numbers and case references must be checked against the statute and the reports before use — and the consequence of being wrong is a void notice.' },
    { q: 'Give me three ideas for a team-building activity for eight people.',
      a: 'Try a cooking challenge in pairs, an escape-room session, or a structured "two truths and a lie" round to open the session.',
      answer: 0, cat: 'Creative suggestion',
      why: 'No factual claim to verify, trivially reversible, and low consequence. Use it and move on — this is what these tools are genuinely good at.' },
    { q: 'What dose of this medication is safe for a 6-year-old?',
      a: 'For a child of that age the standard paediatric dose is 250 mg every eight hours, which is well tolerated.',
      answer: 2, cat: 'Medical',
      why: 'High consequence and irreversible. Regardless of how plausible the figure looks, this requires a pharmacist or doctor — not a chatbot, and not a second chatbot agreeing with the first.' },
    { q: 'Which company had the largest revenue in Pakistan last year?',
      a: 'Based on the latest figures, it was Pakistan State Oil, with revenue of approximately Rs 3.1 trillion.',
      answer: 1, cat: 'Statistic / recent event',
      why: 'Plausible and possibly right — but "the latest figures" names no source, and the answer sits after the model\'s training data. Moderate consequence, so verify against the company\'s published accounts before quoting it in anything that matters.' },
    { q: 'Summarise the argument in the three paragraphs I just pasted.',
      a: 'Your argument is that remote work reduces overheads but weakens informal knowledge transfer, and you propose two office days a week as a compromise.',
      answer: 0, cat: 'Summary of your own text',
      why: 'The source is the text you supplied, so you can check it in seconds by reading what you pasted. Low consequence, immediately verifiable.' },
    { q: 'Is this email address safe to send our payroll file to?',
      a: 'Yes, that domain belongs to a legitimate payroll provider and is safe to use.',
      answer: 2, cat: 'Security judgement',
      why: 'The model cannot verify who controls a domain, and the consequence is disclosing an entire payroll file. Confirm through your finance team and a known-good contact before anything is sent.' }
  ];
  const CLAIM_OPTS = ['Act on it — low consequence, easily reversible',
                      'Verify against a primary source before using it',
                      'Do not act — verify with a qualified human first'];

  LABS.claims = function (root, ctx) {
    const s = labShell({ kicker: 'Lab 10', title: 'Audit the confident answer',
      intro: 'Six AI answers, all delivered in the same authoritative voice. Apply <strong>SOURCE → CONFIRM → CONSEQUENCE</strong> and decide what to do with each.',
      counterLabel: 'Correct' });
    let i = 0, correct = 0;
    const stage = h('div.lab-stage'), out = h('div.lab-out');
    s.body.append(stage, out);

    function step() {
      if (i >= CLAIMS.length) return finish();
      const c = CLAIMS[i];
      s.setBar((i / CLAIMS.length) * 100);
      s.setStat(correct + ' / ' + CLAIMS.length);
      clear(stage).append(
        h('div.chat-card',
          h('div.chat-you', h('span.chat-tag', 'You'), h('p', c.q)),
          h('div.chat-ai', h('span.chat-tag', 'AI'), h('p', { html: c.a })),
          h('span.file-index', (i + 1) + '/' + CLAIMS.length)),
        choiceSet(CLAIM_OPTS, (pick, wrap) => {
          const ok = pick === c.answer;
          if (ok) correct++;
          Array.from(wrap.children).forEach((x, xi) => {
            if (xi === c.answer) x.classList.add('is-right');
            if (xi === pick && !ok) x.classList.add('is-wrong');
          });
          s.setStat(correct + ' / ' + CLAIMS.length);
          stage.appendChild(h('div.feedback.' + (ok ? 'good' : 'bad'),
            h('b', (ok ? 'Correct' : 'The answer is “' + CLAIM_OPTS[c.answer] + '”') + ' · ' + c.cat),
            h('p', { html: c.why }),
            btn(i === CLAIMS.length - 1 ? 'See results' : 'Next answer', 'primary', () => { i++; step(); })));
        }));
    }
    function finish() {
      s.setBar(100); clear(stage);
      const p = pct(correct, CLAIMS.length);
      clear(out).append(resultPanel(p, [
        `<b>${correct} of ${CLAIMS.length}</b> correct.`,
        'Every one of those answers was written in exactly the same confident register. That is the whole point: tone carries no information about accuracy, and there is no signal when the model is uncertain.',
        '<strong>Where errors cluster:</strong> citations and case numbers, statistics with no traceable origin, jurisdiction-specific law, recent events, and attributed quotes. Perfectly formatted, frequently invented.',
        '<strong>And remember what "confirm" means:</strong> the primary source or an independent authority — not the same tool asked twice, and not sites that recycle the same generated text.'
      ]));
      ctx.done(p);
    }
    step();
    root.appendChild(s.root);
  };

  /* =====================================================================
     LAB — incident response
     ===================================================================== */
  LABS.incidentlab = function (root, ctx) {
    const s = labShell({ kicker: 'Lab 11', title: 'The first ten minutes',
      intro: 'You have just been defrauded over WhatsApp and money has left your account. Order the response, then decide what to preserve.',
      counterLabel: 'Score' });
    const STEPS = [
      { id: 1, t: 'DISCONNECT', d: 'Stop further access' },
      { id: 2, t: 'SECURE',     d: 'Change access safely' },
      { id: 3, t: 'PRESERVE',   d: 'Keep messages and receipts' },
      { id: 4, t: 'REPORT',     d: 'Platform • bank • NCCIA' },
      { id: 5, t: 'MONITOR',    d: 'Watch accounts and credit' }
    ];
    let chosen = [], orderScore = 0, evScore = 0, qScore = 0;
    const stage = h('div.lab-stage'), out = h('div.lab-out');
    s.body.append(stage, out);

    function partOne() {
      const bank = h('div.order-bank', shuffle(STEPS).filter(p => !chosen.includes(p.id)).map(p =>
        btn(p.t, 'order-chip', () => { chosen.push(p.id); partOne(); })));
      const seq = h('ol.order-seq', chosen.map((id, idx) => {
        const st = STEPS.find(x => x.id === id);
        return h('li', h('span.order-n', idx + 1), h('b', st.t), h('span.order-sub', st.d),
          btn('Remove', 'tiny', () => { chosen.splice(idx, 1); partOne(); }));
      }));
      s.setBar((chosen.length / 5) * 35);
      clear(stage).append(
        h('p.lab-prompt', 'Click the five steps in the order you would run them.'),
        seq.children.length ? seq : h('p.order-empty', 'Your sequence will appear here.'),
        bank,
        chosen.length === 5 ? btn('Check the sequence', 'primary', checkOrder) : null);
    }
    function checkOrder() {
      orderScore = chosen.filter((id, i) => id === STEPS[i].id).length;
      s.setStat(orderScore + ' / 13'); s.setBar(35);
      clear(stage).append(
        h('div.feedback.' + (orderScore === 5 ? 'good' : 'warn'),
          h('b', orderScore === 5 ? 'Exact order' : orderScore + ' of 5 in the right position'),
          h('p', { html: 'Correct order: <b>DISCONNECT → SECURE → PRESERVE → REPORT → MONITOR</b>. Disconnect first so nothing else is taken while you work. Secure before you preserve, because an attacker still inside can delete the evidence. Preserve before you report, because the report needs it — and before you block, because blocking usually removes your access to the conversation and the profile.' }),
          h('ol.order-review', chosen.map((id, i) => {
            const st = STEPS.find(x => x.id === id), ok = id === STEPS[i].id;
            return h('li.' + (ok ? 'ok' : 'no'), h('span.order-n', i + 1), h('b', st.t),
              h('span.order-fix', ok ? 'correct position' : 'should be step ' + st.id));
          })),
          btn('Continue — preserve the evidence', 'primary', partTwo)));
    }

    const EVIDENCE = [
      { t: 'Full screenshots showing the sender\'s number and profile', good: true },
      { t: 'The profile link or username, and any name changes', good: true },
      { t: 'Exact timestamps and your timezone', good: true },
      { t: 'Transaction IDs and the account or wallet used', good: true },
      { t: 'An exported copy of the original chat', good: true },
      { t: 'A written timeline made the same day', good: true },
      { t: 'A cropped screenshot of just the message text', good: false },
      { t: 'A retyped summary of what the messages said', good: false },
      { t: 'The chat, deleted so it cannot upset you again', good: false }
    ];
    function partTwo() {
      const picked = {};
      const list = h('div.ev-grid', EVIDENCE.map((e, idx) =>
        h('button.ev-item', { type: 'button', onclick: function () {
          picked[idx] = !picked[idx];
          this.classList.toggle('picked', picked[idx]);
          s.setBar(35 + (Object.values(picked).filter(Boolean).length / 6) * 30);
        } }, e.t)));
      clear(stage).append(
        h('p.lab-prompt', 'Select everything worth capturing <b>before</b> you block the sender. Three of these are traps.'),
        list,
        btn('Check my evidence set', 'primary', () => {
          EVIDENCE.forEach((e, idx) => {
            const el = list.children[idx];
            const ok = !!picked[idx] === e.good;
            if (ok) evScore++;
            el.classList.add(ok ? 'is-right' : 'is-wrong');
            el.appendChild(h('span.ev-note', e.good ? 'Capture this' : 'Not evidence'));
          });
          s.setStat((orderScore + evScore) + ' / 13'); s.setBar(65);
          stage.appendChild(h('div.feedback.' + (evScore >= 7 ? 'good' : 'warn'),
            h('b', evScore + ' of ' + EVIDENCE.length + ' judged correctly'),
            h('p', { html: 'A cropped bubble proves nothing about who sent it. A retyped summary is your recollection, not the record. And deleting the chat destroys the only copy — capture first, block second.' }),
            btn('Continue — reporting', 'primary', partThree)));
        }));
    }

    const RQ = [
      { q: 'Money left your bank account 20 minutes ago. What is the most time-critical action?',
        options: ['File the online NCCIA complaint', 'Contact the bank or payment provider immediately',
                  'Post a warning on social media', 'Change your social passwords'],
        answer: 1, why: 'The window in which a transfer can be held or recalled is short. Bank first — then file the complaint. Both are necessary, but the bank is the one with a clock on it.' },
      { q: 'Someone messages offering to recover your stolen funds for an upfront fee.',
        options: ['A normal recovery service', 'Worth trying if the loss was large',
                  'A follow-up scam targeting victims of the first', 'A service NCCIA endorses'],
        answer: 2, why: 'Advance-fee recovery fraud specifically targets people who have just lost money and are desperate. Report it — do not pay it.' },
      { q: 'Where do you file a cybercrime complaint in Pakistan?',
        options: ['complaint.nccia.gov.pk, or helpline 1799', 'Any police station website',
                  'The platform\'s support form only', 'Your mobile network operator'],
        answer: 0, why: 'The National Cyber Crime Investigation Agency takes complaints online at complaint.nccia.gov.pk, with a 24/7 helpline on 1799. Report to the platform as well, but that is not a substitute.' }
    ];
    let ri = 0;
    function partThree() {
      if (ri >= RQ.length) return finish();
      const q = RQ[ri];
      s.setBar(65 + (ri / RQ.length) * 35);
      clear(stage).append(
        h('div.goal-card', h('span.goal-kicker', 'Reporting ' + (ri + 1) + ' of ' + RQ.length), h('b', q.q)),
        choiceSet(q.options, (pick, wrap) => {
          const ok = pick === q.answer;
          if (ok) qScore++;
          Array.from(wrap.children).forEach((x, xi) => {
            if (xi === q.answer) x.classList.add('is-right');
            if (xi === pick && !ok) x.classList.add('is-wrong');
          });
          s.setStat((orderScore + evScore + qScore) + ' / 13');
          stage.appendChild(h('div.feedback.' + (ok ? 'good' : 'bad'),
            h('b', ok ? 'Correct' : 'Not this one'), h('p', { html: q.why }),
            btn(ri === RQ.length - 1 ? 'See results' : 'Next', 'primary', () => { ri++; partThree(); })));
        }));
    }
    function finish() {
      s.setBar(100); clear(stage);
      const total = 5 + EVIDENCE.length + RQ.length;
      const got = orderScore + evScore + qScore;
      const p = pct(got, total);
      clear(out).append(resultPanel(p, [
        `<b>${got} of ${total}</b> — ${orderScore}/5 sequence, ${evScore}/${EVIDENCE.length} evidence, ${qScore}/${RQ.length} reporting.`,
        '<strong>Save these now, before you need them:</strong> <a href="https://complaint.nccia.gov.pk/" target="_blank" rel="noopener noreferrer">complaint.nccia.gov.pk</a> · helpline <b>1799</b> (24/7) · your bank\'s fraud number.',
        'Two things not to do: never pay a "recovery agent", and never attempt to hack back — it is illegal and it damages your own case.'
      ]));
      ctx.done(p);
    }
    s.setStat('0 / 13');
    partOne();
    root.appendChild(s.root);
  };

  /* =====================================================================
     LAB — 10-minute reset
     ===================================================================== */
  const RESET_ITEMS = [
    { t: 'Secure primary email',        d: 'Unique passphrase or passkey, app-based 2FA.', door: 'Accounts' },
    { t: 'Enable passkey / 2FA',        d: 'On your most-used platform, right now.',       door: 'Accounts' },
    { t: 'Review active sessions',      d: 'End anything you do not recognise.',           door: 'Accounts' },
    { t: 'Hide lock-screen previews',   d: 'Stop codes being readable while locked.',      door: 'Mobile' },
    { t: 'Review app permissions',      d: 'Camera, microphone, location — app by app.',   door: 'Mobile' },
    { t: 'Limit profile information',   d: 'Workplace, home area, travel plans.',          door: 'Social' },
    { t: 'Enable call IP protection',   d: 'WhatsApp Advanced, or X Enhanced Call Privacy.', door: 'Social' },
    { t: 'Create a family safe word',   d: 'Verbally, with close family. Never in a chat.', door: 'Social' },
    { t: 'Encrypt important backups',   d: 'Two copies, one not permanently connected.',   door: 'Systems' },
    { t: 'Save the NCCIA reporting link', d: 'complaint.nccia.gov.pk and helpline 1799.',  door: 'Response' }
  ];

  LABS.reset = function (root, ctx) {
    const s = labShell({ kicker: 'Lab 12', title: 'The 10-minute reset',
      intro: 'Ten actions, roughly one minute each, on your own device. Start the timer and tick them off as you go — this is the only lab where the work happens outside the browser.',
      counterLabel: 'Done' });

    const doneSet = new Set(ctx.load('reset') || []);
    let seconds = 600, timerId = null;
    const clock = h('b.timer-clock', '10:00');
    const timerBtn = btn('Start 10 minutes', 'primary', toggleTimer);
    const timer = h('div.timer', clock, timerBtn,
      btn('Reset', 'ghost', () => { stopTimer(); seconds = 600; paint(); }));

    const list = h('div.reset-list', RESET_ITEMS.map((it, idx) => {
      const input = h('input', { type: 'checkbox', id: 'rs-' + idx });
      input.checked = doneSet.has(idx);
      input.addEventListener('change', () => {
        if (input.checked) doneSet.add(idx); else doneSet.delete(idx);
        ctx.save('reset', Array.from(doneSet));
        paint();
      });
      return h('label.reset-item', { for: 'rs-' + idx },
        input, h('span.check-box'),
        h('span.check-copy',
          h('b', String(idx + 1).padStart(2, '0') + '. ' + it.t),
          h('span', it.d)),
        h('span.reset-door', it.door));
    }));

    const out = h('div.lab-out');
    s.body.append(timer, list, out);
    s.foot.append(btn('Finish the course', 'primary', finish));

    function fmt(x) { return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0'); }
    function paint() {
      clock.textContent = fmt(Math.max(0, seconds));
      timer.dataset.tone = seconds <= 60 ? 'bad' : seconds <= 180 ? 'warn' : '';
      s.setStat(doneSet.size + ' / 10');
      s.setBar((doneSet.size / 10) * 100);
    }
    function toggleTimer() {
      if (timerId) return stopTimer();
      timerBtn.textContent = 'Pause';
      timerId = setInterval(() => {
        seconds--; paint();
        if (seconds <= 0) { stopTimer(); clock.textContent = 'Time'; }
      }, 1000);
    }
    function stopTimer() {
      if (timerId) clearInterval(timerId);
      timerId = null; timerBtn.textContent = seconds < 600 ? 'Resume' : 'Start 10 minutes';
    }
    ctx.onDestroy(stopTimer);

    function finish() {
      stopTimer();
      const p = pct(doneSet.size, 10);
      const before = (ctx.readGlobal('baseline') || []).length;
      const lines = [
        `<b>${doneSet.size} of 10</b> actions completed.`,
        doneSet.size === 10
          ? 'All ten closed. Every door in the model now has at least one real change behind it.'
          : 'Schedule the rest for today. An unfinished item on this list is a live gap, not a preference.'
      ];
      if (before > 0) {
        lines.push(`You started this course marking <b>${before} of 6</b> exposure statements as true. Retake that check honestly now — <a href="#/m/baseline">Module 01</a> — and see what has actually moved.`);
      }
      lines.push('<strong>Pause • Verify • Protect.</strong> Cyber smart is a habit, not an app.');
      clear(out).append(resultPanel(p, lines));
      ctx.done(p);
      out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    paint();
    root.appendChild(s.root);
  };

  global.Labs = { mount(type, root, ctx) { return LABS[type] ? LABS[type](root, ctx) : null; }, has: (t) => !!LABS[t], h, btn };
})(window);
