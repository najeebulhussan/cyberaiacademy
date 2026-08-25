/* =====================================================================
   Cyber Smart — course content
   Adapted from "Cyber Smart: Protecting Yourself in an AI-Powered
   Digital World" by Najeeb ul Hassan (NCCIA). Slide bodies and speaker
   notes expanded into lesson text, labs and checks.
   ===================================================================== */
(function (global) {
  'use strict';

  const COURSE = {
    title: 'Cyber Smart',
    subtitle: 'Protecting Yourself in an AI-Powered Digital World',
    blurb: 'Practical changes for your phone, accounts, systems, social media and AI use. ' +
           'Thirteen short modules, twelve hands-on labs, one habit.',
    author: {
      name: 'Najeeb ul Hassan',
      role: 'Focal Person & Public Relations Officer • NCCIA',
      creds: 'ITQ Certified Trainer • CyberOps • OSINT • Threat Intelligence'
    },
    motto: 'Pause • Verify • Protect',
    report: { url: 'https://complaint.nccia.gov.pk/', helpline: '1799', agency: 'https://www.nccia.gov.pk/' },

    doors: [
      { id: 'mobile',   n: '01', name: 'Mobile',   tagline: 'Secure the device',  color: 'cyan',   tint: 'cyan' },
      { id: 'accounts', n: '02', name: 'Accounts', tagline: 'Protect access',     color: 'blue',   tint: 'cyan' },
      { id: 'systems',  n: '03', name: 'Systems',  tagline: 'Reduce exposure',    color: 'violet', tint: 'violet' },
      { id: 'social',   n: '04', name: 'Social',   tagline: 'Control identity',   color: 'pink',   tint: 'rose' },
      { id: 'ai',       n: '05', name: 'AI',       tagline: 'Share carefully',    color: 'teal',   tint: 'green' }
    ],

    tracks: [
      { id: 'orient',   label: 'Orientation', modules: ['gateway', 'baseline'] },
      { id: 'mobile',   label: 'Door 01 — Mobile',   modules: ['device', 'messages'] },
      { id: 'accounts', label: 'Door 02 — Accounts', modules: ['signin', 'email'] },
      { id: 'systems',  label: 'Door 03 — Systems',  modules: ['computer'] },
      { id: 'social',   label: 'Door 04 — Social',   modules: ['privacy', 'identity'] },
      { id: 'ai',       label: 'Door 05 — AI',       modules: ['aidata', 'aiverify'] },
      { id: 'respond',  label: 'Response',           modules: ['incident', 'reset'] }
    ],

    modules: [

/* ================================================================== 00 */
{
  id: 'gateway', track: 'orient', door: null, n: '00',
  title: 'One Device, Four Targets',
  subtitle: 'Why your phone is the gateway to almost everything',
  hero: 'assets/img/gateway.webp', glyph: 'sphere', color: 'cyan', minutes: 8,
  objectives: [
    'Explain why a single compromised phone can cascade across your whole life',
    'Name the four high-value targets an attacker reaches through one device',
    'Describe the Five Doors model this course is built around'
  ],
  sections: [
    { h: 'Your phone is not just a phone',
      p: ['Start with an uncomfortable question: if someone got access to your phone right now, how much of your life could they control?',
          'Not "what apps would they see" — what could they <em>do</em>. Reset a password. Read a one-time code. Send a message as you. Approve a transfer. Download the photos of your family.',
          'That is the real threat model. The device is not the prize. The device is the key ring.'] },
    { h: 'Four high-value targets', cards: [
      { t: 'Money', d: 'Banking apps, wallets, saved cards, transaction history and the SMS/authenticator codes that authorise a transfer.' },
      { t: 'Identity', d: 'CNIC photos, passport scans, selfies and signatures — everything needed to open an account or pass a verification check as you.' },
      { t: 'Relationships', d: 'Your contact list and chat history. Trust is the payload: a message from your number is believed instantly.' },
      { t: 'Work', d: 'Company email, shared drives, internal groups and client data. Your personal breach becomes your employer\'s breach.' }
    ]},
    { h: 'What AI changed — and what it did not',
      p: ['AI did not invent fraud. It removed the friction. The broken grammar, the odd formatting, the flat robotic voice note — those were free warning signs, and they are gone.',
          'A scam message can now be fluent in your language and your register. A voice can be cloned from a few seconds of a public video. A face can be moved in a live video call.',
          'What did <em>not</em> change: a cloned voice still cannot make you call back on a number you already trust. Verification through a second, independent channel still works. That is why this course teaches habits, not products.'],
      callout: { k: 'key', t: 'The core idea', d: 'Security is not one setting. It is a system of habits — and every habit you add makes every door harder to open.' } },
    { h: 'The Cyber-Smart model: five doors',
      p: ['The rest of this course walks through five doors. Each is a place where attackers get in, and each has a small set of changes that close most of the gap.'],
      doors: true },
    { h: 'How to take this course',
      p: ['Thirteen modules, twelve labs. Every module ends with a hands-on lab and a short check. Your progress saves in this browser, so you can stop and return.',
          'You do not need to memorise anything. You need to change settings. Keep your phone next to you and change them as you go.'] }
  ],
  takeaways: [
    'One device unlocks money, identity, relationships and work simultaneously.',
    'AI made scams polished, not unbeatable — verification still defeats them.',
    'Security is a system of habits across five doors, not a single switch.'
  ],
  quiz: [
    { q: 'Why is a compromised phone worse than a compromised laptop for most people?',
      options: ['It costs more to replace',
                'It holds the second factor that resets every other account',
                'Phones cannot run antivirus software',
                'Phone data is never backed up'],
      answer: 1,
      why: 'The phone usually receives the one-time codes and holds the authenticator app. Whoever controls it can reset almost everything else.' },
    { q: 'AI has changed online fraud mainly by:',
      options: ['Making attacks impossible to stop',
                'Removing the language and quality errors that used to reveal a scam',
                'Breaking encryption on messaging apps',
                'Replacing human attackers entirely'],
      answer: 1,
      why: 'Poor grammar and awkward phrasing used to be free detection. AI removed that signal — so verification has to do the work instead.' },
    { q: 'Which statement matches the Cyber-Smart model?',
      options: ['One strong antivirus product covers all five doors',
                'Security is a system of habits across mobile, accounts, systems, social and AI',
                'Only IT staff can meaningfully reduce personal risk',
                'Changing settings matters less than choosing the right apps'],
      answer: 1,
      why: 'The model is deliberately habit-based: five doors, each made harder to open by a handful of repeatable actions.' }
  ]
},

/* ================================================================== 01 */
{
  id: 'baseline', track: 'orient', door: null, n: '01',
  title: 'Your Private Baseline',
  subtitle: 'A self-check you score yourself, and nobody else sees',
  hero: null, glyph: 'gem', color: 'blue', minutes: 7,
  objectives: [
    'Measure your current exposure honestly across six common weak points',
    'Turn the result into a ranked, personal action list',
    'Set a baseline you can re-measure at the end of the course'
  ],
  sections: [
    { h: 'Count privately',
      p: ['This is not a test and there is no leaderboard. Nothing you enter leaves your browser.',
          'Six statements follow. Mark the ones that are true for you today. Each true statement is one point — and in this exercise, <strong>a higher score means more exposure</strong>.',
          'The goal is improvement, not embarrassment. Almost everyone scores at least two on their first attempt, including people who work in security.'],
      callout: { k: 'note', t: 'Why start here', d: 'You will retake this exact check in the final module. The gap between the two scores is the only measure of this course that matters.' } },
    { h: 'What the six statements are really testing',
      p: ['Each statement maps to a door you will work through later, so your score doubles as a route map.'],
      list: [
        '<strong>Password reuse</strong> — one breach at a site you forgot about becomes a breach everywhere. (Door 02)',
        '<strong>Lock-screen previews</strong> — codes and private messages readable without unlocking. (Door 01)',
        '<strong>Unreviewed sessions</strong> — an old login on a device you no longer own is still a live session. (Door 02)',
        '<strong>Revealing profile</strong> — free research material for impersonation. (Door 04)',
        '<strong>Un-redacted AI uploads</strong> — identifiers leaving your control in exchange for convenience. (Door 05)',
        '<strong>No family safe word</strong> — no fallback when a familiar voice asks for money urgently. (Door 04)'
      ] }
  ],
  lab: { type: 'baseline' },
  takeaways: [
    'A higher baseline score means more exposure — and a clearer starting list.',
    'Each weak point maps to a specific door later in the course.',
    'You will re-measure at the end; the delta is the point.'
  ],
  quiz: [
    { q: 'In this self-check, what does a higher score mean?',
      options: ['Better security habits', 'More exposure to fix', 'A faster device', 'Nothing measurable'],
      answer: 1,
      why: 'Each "yes" marks a gap. The score is a to-do list length, not a grade.' },
    { q: 'Why is the check taken privately rather than collected?',
      options: ['To reduce server costs',
                'Because honest answers only happen without an audience',
                'Because the results are not useful',
                'To comply with an export restriction'],
      answer: 1,
      why: 'People under-report weak habits when someone is watching. A private count produces a usable baseline.' }
  ]
},

/* ================================================================== 02 */
{
  id: 'device', track: 'mobile', door: 'mobile', n: '02',
  title: 'Secure the Device',
  subtitle: 'Make the phone safe before adding another app',
  hero: 'assets/img/mobile.webp', glyph: 'slab', color: 'cyan', minutes: 12,
  objectives: [
    'Apply the six baseline settings that harden any modern phone',
    'Stop the lock screen leaking codes and message content',
    'Audit camera, microphone and location permissions app by app'
  ],
  sections: [
    { h: 'The order matters',
      p: ['People install a security app before they set a screen lock. That is backwards. The device itself has strong protections built in — they are simply switched off or left at defaults.',
          'Six settings do most of the work. None of them cost anything and all of them exist on both Android and iPhone, though the menu names differ by version and manufacturer.'] },
    { h: 'The six baseline settings', cards: [
      { t: 'Strong screen lock + biometrics', d: 'A six-digit PIN at minimum — not 1234, not your birth year, not your CNIC digits. Add fingerprint or face unlock for convenience, but the PIN is the real lock: biometrics fall back to it.' },
      { t: 'Hide lock-screen previews', d: 'Notifications may show that a message arrived, never what it says. This single change stops one-time codes and private chats being read over your shoulder or off a table.' },
      { t: 'Automatic OS and app updates', d: 'Most real-world compromises use a flaw that was patched months ago. Automatic updates convert a decision you would postpone into something that just happens.' },
      { t: 'Review camera, mic and location', d: 'Go app by app. A torch app does not need your contacts. A game does not need the microphone. Prefer "while using the app" over "always".' },
      { t: 'Find device + encrypted backup', d: 'Find My iPhone or Find My Device lets you locate, lock and erase remotely. An encrypted backup means a lost phone is an inconvenience rather than a disaster.' },
      { t: 'Official app stores only', d: 'Sideloaded APKs and "modded" versions of paid apps are a primary malware channel. If an app is only available through a link in a WhatsApp forward, that is the finding.' }
    ]},
    { h: 'Why your photo library is a security asset',
      p: ['Most people protect banking apps and ignore the gallery. But the gallery is where the CNIC photo, the utility bill, the signature and hundreds of clear pictures of your face live.',
          'Stolen media can power convincing impersonation: a face for a deepfake, a voice from a video, a document scan to pass a verification step. Treat the gallery as sensitive storage, not as a scrapbook.'],
      callout: { k: 'warn', t: 'Practical rule', d: 'Delete identity-document photos from your gallery once you have used them, and keep them in an encrypted vault or password manager instead.' } },
    { h: 'Where to find these settings',
      p: ['Exact paths move between versions. These are the usual starting points:'],
      list: [
        '<strong>Android</strong> — Settings › Security & privacy (lock screen, updates, permissions); Settings › Apps › Permission manager.',
        '<strong>iPhone</strong> — Settings › Face ID & Passcode (including <em>Show Previews: When Unlocked</em>); Settings › Privacy & Security.',
        '<strong>Both</strong> — search the Settings app for "previews", "permissions" or "update" rather than hunting through menus.'
      ] }
  ],
  lab: { type: 'device' },
  takeaways: [
    'Six free settings do most of the hardening work on any modern phone.',
    'Lock-screen previews leak one-time codes to anyone who can see the screen.',
    'Your photo gallery is identity-grade material — treat it that way.'
  ],
  quiz: [
    { q: 'Why is hiding lock-screen previews unusually high value?',
      options: ['It saves battery',
                'It stops one-time codes and message content being read without unlocking',
                'It disables notifications entirely',
                'It encrypts the device'],
      answer: 1,
      why: 'The preview is readable by anyone who can see the screen — including someone who has just triggered a password reset on your account.' },
    { q: 'An app asks for microphone access "always" but only needs it to record a voice note. Best response?',
      options: ['Grant always — it is simpler',
                'Grant "while using the app", or deny until it is actually needed',
                'Uninstall every app that requests permissions',
                'Grant it and disable it later if something goes wrong'],
      answer: 1,
      why: 'Least privilege: scope the permission to when the app is in use. Broad "always" grants are what makes silent misuse possible.' },
    { q: 'Which is the strongest reason to avoid sideloaded APKs?',
      options: ['They use more storage',
                'They bypass store review and are a primary malware channel',
                'They cannot be updated',
                'They void the phone warranty'],
      answer: 1,
      why: 'Store review is imperfect but real. A file shared through a forward has had no review at all.' },
    { q: 'Why do identity-document photos in your gallery matter more than they used to?',
      options: ['They take up space',
                'They supply the face, voice and document scans that make AI impersonation convincing',
                'They slow down backups',
                'They cannot be encrypted'],
      answer: 1,
      why: 'Stolen media is raw material. A clear face and a document scan are often enough to pass a weak verification check.' }
  ]
},

/* ================================================================== 03 */
{
  id: 'messages', track: 'mobile', door: 'mobile', n: '03',
  title: 'Urgency Is the Signal',
  subtitle: 'Messages, social engineering, and the four-step brake',
  hero: 'assets/img/messages.webp', glyph: 'shield', color: 'cyan', minutes: 12,
  objectives: [
    'Recognise manufactured urgency as the common ingredient in nearly every scam',
    'Apply STOP → CHECK → VERIFY → ACT under pressure',
    'Verify a request through an independent channel rather than the one it arrived on'
  ],
  sections: [
    { h: 'Every scam needs you to hurry',
      p: ['Fraud does not usually beat your knowledge. It beats your <em>timing</em>. The message is designed so that you act before you think — and the tool for that is urgency.',
          '"Your account will be blocked today." "I am in hospital, send it now." "The tax deadline is in one hour." "Confirm within 10 minutes or the transfer fails."',
          'Different stories, one mechanism. Whenever a message compresses your decision window, that pressure is itself the warning.'],
      callout: { k: 'key', t: 'Reframe it', d: 'Urgency is not a reason to move faster. It is a reason to slow down.' } },
    { h: 'The four-step brake', steps: [
      { n: '1', t: 'STOP', d: 'Do not click, do not pay, do not reply emotionally. Put the phone down for sixty seconds. Nothing legitimate is destroyed by a one-minute pause.' },
      { n: '2', t: 'CHECK', d: 'Inspect the sender, the request, the link and the context. Is the number saved? Is the domain right, character by character? Does this person normally ask for this?' },
      { n: '3', t: 'VERIFY', d: 'Contact them through a channel you already trust — a number saved in your phone, the official app, a bank number from the back of your card. Never a number supplied inside the message.' },
      { n: '4', t: 'ACT', d: 'Proceed only after independent confirmation. If verification fails or stalls, that is your answer.' }
    ]},
    { h: 'What AI made harder to spot',
      p: ['The old checklist — bad grammar, wrong logo, odd spacing — is largely obsolete. Assume any message can be fluent, correctly branded and personalised with details harvested from your public profile.'],
      list: [
        '<strong>Fluent language</strong> in Urdu, English or a mix, matching how your contacts actually write.',
        '<strong>Cloned voice notes</strong> built from a few seconds of any public video or voice message.',
        '<strong>Live video calls</strong> with a manipulated face, usually short, low-light and "poor connection".',
        '<strong>Accurate personal detail</strong> — your employer, your colleague\'s name, your recent trip — taken straight from social media.'
      ],
      callout: { k: 'warn', t: 'The trap', d: 'Familiar is not verified. Sounding right, looking right and knowing details about you are all cheap to fake. Calling back on a saved number is not.' } },
    { h: 'The red flags that still work',
      p: ['Content signals are unreliable now. Structural signals are not:'],
      list: [
        'A <strong>new payment channel</strong> — a different account number, a wallet, a gift card, crypto.',
        'A request for <strong>secrecy</strong> — "do not tell anyone", "handle this quietly".',
        'A <strong>callback number supplied inside the message</strong>, rather than one you already had.',
        'A request to <strong>read out a code</strong> that was just sent to you. No legitimate organisation ever needs this.',
        'A <strong>channel switch</strong> — an official-looking email that pushes you to WhatsApp, or a call that pushes you to a link.'
      ] }
  ],
  lab: { type: 'triage' },
  takeaways: [
    'Manufactured urgency is the one ingredient nearly every scam shares.',
    'STOP → CHECK → VERIFY → ACT, with verification on an independent channel.',
    'Nobody legitimate ever needs the one-time code that was sent to you.'
  ],
  quiz: [
    { q: 'A message from your manager\'s number asks you to buy gift cards urgently and keep it quiet. Best first action?',
      options: ['Buy them and confirm afterwards',
                'Reply to the message asking if it is really them',
                'Call your manager on the number already saved in your phone',
                'Forward the message to colleagues for a second opinion'],
      answer: 2,
      why: 'Verification must use an independent channel. Replying on the same thread only reaches whoever controls it.' },
    { q: 'A caller says they are from your bank and asks you to read back the code just sent to you. This is:',
      options: ['Normal identity verification',
                'Acceptable if they already know your account number',
                'Always fraud — no legitimate organisation asks for that code',
                'Fine if the caller ID shows the bank name'],
      answer: 2,
      why: 'The code exists to prove it is you. Anyone asking for it is trying to complete an action on your account. Caller ID is trivially spoofed.' },
    { q: 'Which signal remains reliable now that AI writes fluent, well-branded messages?',
      options: ['Spelling and grammar quality',
                'Whether the logo looks correct',
                'A request for a new payment channel plus secrecy',
                'Whether the sender knows your employer'],
      answer: 2,
      why: 'Content quality is cheap to fake. The structure of the request — new destination for money, plus pressure to stay quiet — is much harder to disguise.' },
    { q: 'What is the purpose of the STOP step?',
      options: ['To gather evidence for a report',
                'To break the compressed decision window the attacker engineered',
                'To let the message expire',
                'To alert the platform automatically'],
      answer: 1,
      why: 'The whole attack depends on you acting inside a short window. Removing the time pressure removes most of the leverage.' }
  ]
},

/* ================================================================== 04 */
{
  id: 'signin', track: 'accounts', door: 'accounts', n: '04',
  title: 'Sign-in and Sessions',
  subtitle: 'Passkeys, two-factor, and the devices still logged in as you',
  hero: null, glyph: 'key', color: 'blue', minutes: 14,
  objectives: [
    'Choose the strongest sign-in option available on each platform you use',
    'Find and end active sessions on WhatsApp, Facebook, Instagram and X',
    'Protect the recovery path, which is how most accounts are actually taken'
  ],
  sections: [
    { h: 'Three things, in this order',
      p: ['Account security has a priority order, and most people do them in the wrong sequence — or stop after the first.'],
      steps: [
        { n: '1', t: 'Strongest sign-in', d: 'A passkey where offered, otherwise app-based two-factor. SMS codes are the weakest common option because SIM swap and interception defeat them.' },
        { n: '2', t: 'Review sessions', d: 'Every platform lists the devices currently logged in as you. Old phones, borrowed laptops, a cybercafé from three years ago — all still live until you end them.' },
        { n: '3', t: 'Secure recovery', d: 'An updated recovery email and phone, plus stored backup codes. Attackers rarely break your password; they walk in through a stale recovery address they control.' }
      ] },
    { h: 'Why passkeys beat passwords',
      p: ['A passkey is a cryptographic key pair. The private half stays on your device and is released by your fingerprint, face or device PIN; the site only ever holds the public half.',
          'That structure removes two entire attack classes at once: there is no password to reuse across sites, and there is nothing to type into a convincing fake login page. A phishing site cannot collect a secret that is never transmitted.'],
      callout: { k: 'key', t: 'If you enable one thing today', d: 'Turn on a passkey for your primary email, then for each social platform that supports it.' } },
    { h: 'Platform comparison — securing access',
      p: ['Feature availability and menu labels vary by device, region and rollout. Use this as a map of what to look for, not as exact wording.'],
      table: {
        cols: ['Setting', 'WhatsApp', 'Facebook', 'Instagram', 'X'],
        rows: [
          ['Strongest sign-in option', 'Passkey / 2-step PIN', 'Passkey / 2FA', 'Passkey / 2FA', 'Passkey / 2FA'],
          ['Review logged-in devices', 'Linked Devices', 'Where you\'re logged in', 'Login activity', 'Apps & sessions'],
          ['Unknown-login warning', 'Security alerts', 'Login alerts', 'Login requests', 'Security alerts'],
          ['Recovery protection', 'Email + PIN', 'Email/phone + codes', 'Email/phone + codes', 'Email/phone + codes'],
          ['Connected app review', 'Limited', 'Apps & websites', 'Apps & websites', 'Connected apps'],
          ['App/device lock', 'Biometric app lock', 'Device lock', 'Device lock', 'Device lock'],
          ['Encrypted stored backup', 'Optional E2EE backup', '—', '—', '—'],
          ['Account checkup', 'Privacy Checkup', 'Security Checkup', 'Accounts Center', 'Manual review']
        ]
      } },
    { h: 'The session review habit',
      p: ['Do this once now, then every few months. On each platform, open the logged-in devices list and read it like a guest book.'],
      list: [
        'Any device you no longer own — end the session.',
        'Any city or country you do not recognise — end it, then change the password and check recovery details.',
        'WhatsApp <em>Linked Devices</em> deserves special attention: a linked desktop session reads your messages in real time and is easy to miss.',
        'After ending sessions, review connected apps too — a third-party app with old permissions is a session by another name.'
      ],
      callout: { k: 'warn', t: 'Order of operations', d: 'If you suspect compromise: change the password first, then end all other sessions. Reversing the order lets the intruder simply log back in.' } }
  ],
  lab: { type: 'sessions' },
  takeaways: [
    'Strongest sign-in, then session review, then recovery protection — in that order.',
    'Passkeys defeat both password reuse and fake login pages by design.',
    'Change the password before ending sessions, not after.'
  ],
  quiz: [
    { q: 'Why is a passkey resistant to phishing in a way a password is not?',
      options: ['It is longer than a password',
                'The private key never leaves your device, so there is no secret to type into a fake page',
                'It changes every 30 seconds',
                'It is stored on the platform\'s server'],
      answer: 1,
      why: 'Passkeys are asymmetric. The site stores only the public half, and the private half is never transmitted — so a fake login page has nothing to harvest.' },
    { q: 'You suspect someone has access to your account. Correct order?',
      options: ['End all sessions, then change the password',
                'Change the password, then end all other sessions',
                'Delete the account and start again',
                'Change the recovery email only'],
      answer: 1,
      why: 'Ending sessions first leaves the attacker able to log straight back in with the password they still have.' },
    { q: 'Which is the weakest of these common second factors?',
      options: ['Passkey', 'Authenticator app code', 'SMS one-time code', 'Hardware security key'],
      answer: 2,
      why: 'SMS is vulnerable to SIM swap and interception. It is still far better than nothing, but it is the first thing to upgrade.' },
    { q: 'Why is a stale recovery email a serious risk even with a strong password?',
      options: ['It slows down login',
                'Recovery bypasses the password entirely, so whoever controls it controls the account',
                'It causes duplicate notifications',
                'It prevents two-factor from working'],
      answer: 1,
      why: 'Account recovery is a deliberate side door. If an attacker controls the address it points to, your password strength is irrelevant.' }
  ]
},

/* ================================================================== 05 */
{
  id: 'email', track: 'accounts', door: 'accounts', n: '05',
  title: 'Email Is the Master Key',
  subtitle: 'Secure it first, because it resets everything else',
  hero: 'assets/img/email.webp', glyph: 'key', color: 'blue', minutes: 10,
  objectives: [
    'Explain why the primary email account sits above every other account',
    'Apply the five-step hardening sequence to your main inbox',
    'Store recovery codes somewhere that survives losing your phone'
  ],
  sections: [
    { h: 'Everything resets through your inbox',
      p: ['Your bank, your social accounts, your workplace tools, your phone\'s own cloud account — nearly all of them offer "forgot password", and nearly all of them send that reset to one email address.',
          'That makes your primary email a master key. Whoever holds it can walk down the list and take each account in turn, in the order they choose, without ever guessing a single password.',
          'If you improve exactly one account today, improve this one.'],
      callout: { k: 'key', t: 'The dependency', d: 'Every other account you own is, in practice, a child of your primary email account.' } },
    { h: 'The five-step sequence', steps: [
      { n: '1', t: 'Unique long password or passkey', d: 'Nowhere else, ever. A passphrase of four or five unrelated words beats a short string of symbols, and a passkey beats both.' },
      { n: '2', t: 'Authenticator-based 2FA', d: 'Move off SMS where you can. An authenticator app generates codes offline and is not affected by a SIM swap.' },
      { n: '3', t: 'Updated recovery email and phone', d: 'Check what is actually listed. Old university addresses and disconnected numbers are common — and they are the side door.' },
      { n: '4', t: 'Review sessions and app access', d: 'End unknown sessions and revoke third-party apps you no longer use. Old integrations retain mailbox access long after you forget them.' },
      { n: '5', t: 'Store recovery codes safely', d: 'Printed and locked away, or inside a password manager. Not a screenshot in your gallery, and not a note titled "codes".' }
    ]},
    { h: 'Why password reuse spreads a single breach',
      p: ['Sites get breached. When they do, the stolen list of email addresses and passwords is tried automatically against banks, wallets, social platforms and mail providers — an attack called credential stuffing.',
          'You do not need to have been careless. You only need to have used the same password twice. A password manager removes the memory problem entirely: one strong passphrase for the manager, unique random passwords everywhere else.'],
      callout: { k: 'note', t: 'Practise safely', d: 'When you set up a password manager, learn on a throwaway training account first. Do not experiment with your live primary email.' } }
  ],
  lab: { type: 'masterkey' },
  takeaways: [
    'Primary email sits above every other account — secure it first.',
    'Unique password or passkey, app-based 2FA, clean recovery, reviewed sessions, stored codes.',
    'Reuse is what turns someone else\'s breach into your problem.'
  ],
  quiz: [
    { q: 'Why is the primary email described as a "master key"?',
      options: ['It stores the most data',
                'Password resets for nearly every other account are delivered to it',
                'It is the hardest account to create',
                'It is the only account with encryption'],
      answer: 1,
      why: 'Control of the inbox means control of the reset flow, and the reset flow bypasses passwords on every dependent account.' },
    { q: 'What is credential stuffing?',
      options: ['Guessing a password character by character',
                'Trying email/password pairs stolen from one breach automatically against many other sites',
                'Filling a login form with junk to crash it',
                'Storing too many passwords in one manager'],
      answer: 1,
      why: 'It is why reuse is the single most damaging password habit — one leak becomes access to everything sharing that password.' },
    { q: 'Where should account recovery codes be kept?',
      options: ['A screenshot in your photo gallery',
                'A note on your phone titled "codes"',
                'Printed and stored securely, or inside a password manager',
                'Emailed to yourself'],
      answer: 2,
      why: 'Codes must survive losing your phone without being readable by whoever finds it. Emailing them to the account they protect defeats the purpose.' }
  ]
},

/* ================================================================== 06 */
{
  id: 'computer', track: 'systems', door: 'systems', n: '06',
  title: 'Boring and Recoverable',
  subtitle: 'Systems, browsers, downloads and backups',
  hero: 'assets/img/systems.webp', glyph: 'cube', color: 'violet', minutes: 10,
  objectives: [
    'Apply the six habits that keep a computer unremarkable and restorable',
    'Judge a download by expectation rather than appearance',
    'Build a backup you could actually restore from tomorrow'
  ],
  sections: [
    { h: 'Aim for boring',
      p: ['A secure computer is not an exciting one. It runs current software, installs little, backs up quietly and can be rebuilt without drama. "Boring and recoverable" is the whole goal.',
          'You do not need malware taxonomy for this. You need six habits.'] },
    { h: 'Six habits', cards: [
      { t: 'Update', d: 'Operating system, browser and applications — automatically, not "later". The browser matters most: it is the program that opens content from strangers all day.' },
      { t: 'Install', d: 'Legitimate software from official sources only. Cracked software and "activators" are a reliable malware channel, and the price is your whole machine.' },
      { t: 'Defend', d: 'Keep the firewall on and the built-in antivirus enabled. On Windows, Defender plus current updates is a genuinely reasonable baseline.' },
      { t: 'Download', d: 'Two questions before opening anything: was I expecting this sender, and was I expecting this file? Both must be yes.' },
      { t: 'Back up', d: 'Important files in two places, one of them offline or in a separate account. Ransomware encrypts anything it can reach — including a permanently connected drive.' },
      { t: 'Lock', d: 'Lock the screen when you step away. Windows key + L, or Control + Command + Q on a Mac. The most common "insider incident" is an unattended unlocked machine.' }
    ]},
    { h: 'Professional-looking files still deliver malware',
      p: ['A file that opens correctly and looks properly formatted has proved nothing. Documents can carry macros, PDFs can carry scripted actions, and installers can do anything the installer wants.',
          'AI has made lure documents look genuinely professional — correct letterheads, plausible reference numbers, fluent covering notes. Judge the delivery, not the design.'],
      list: [
        'Was the sender expected, on a channel you already use with them?',
        'Does the file extension match what it claims? Watch for <code>.pdf.exe</code>, <code>.doc.js</code> and archive files that contain a shortcut.',
        'Is a document asking you to "Enable Content" or "Enable Editing" to see it properly? That prompt is the attack.',
        'Did it arrive from a shared drive link you were not told about?'
      ],
      callout: { k: 'warn', t: 'Unknown USB drives', d: 'A found or gifted USB drive is not a storage device, it is an untrusted input. Do not plug it into a machine that matters.' } },
    { h: 'A backup you can actually restore',
      p: ['Most backups fail at restore time, not at backup time. Two rules make the difference: keep a second copy that is not permanently connected, and test a restore at least once.',
          'Restoring one file you deliberately deleted takes two minutes and tells you whether the whole system works. Do it once, and you know.'] }
  ],
  lab: { type: 'downloads' },
  takeaways: [
    'Update, install carefully, defend, judge downloads, back up twice, lock the screen.',
    'Expected sender plus expected file — both, every time.',
    'A backup you have never restored from is a hypothesis, not a backup.'
  ],
  quiz: [
    { q: 'A supplier you work with emails an invoice that opens but asks you to "Enable Content" to view the details. What is happening?',
      options: ['A normal compatibility prompt — enable it',
                'The prompt is the attack; macros run only once you enable them',
                'The file is corrupted and should be re-downloaded',
                'The sender used an older version of Office'],
      answer: 1,
      why: '"Enable Content" turns on macro execution. A document that needs it to show ordinary content is trying to run code, not display text.' },
    { q: 'Why must one backup copy be offline or in a separate account?',
      options: ['To save bandwidth',
                'Ransomware encrypts everything it can reach, including attached drives',
                'Online backups are always slower',
                'It is required by law'],
      answer: 1,
      why: 'A permanently connected drive is part of the same blast radius. Separation is what makes the second copy meaningful.' },
    { q: 'You find a USB drive in the office car park. Best action?',
      options: ['Plug it in to identify the owner',
                'Plug it into a spare laptop first',
                'Hand it to IT or security without plugging it in anywhere',
                'Format it and reuse it'],
      answer: 2,
      why: 'Dropped media is a classic delivery method, and some devices attack the moment they are connected. Do not connect it at all.' },
    { q: 'Which two questions decide whether to open a download?',
      options: ['Is it small, and is it common?',
                'Was the sender expected, and was the file expected?',
                'Does it open quickly, and does it look professional?',
                'Is it signed, and is it under 10 MB?'],
      answer: 1,
      why: 'Appearance is controllable by the attacker; expectation is not. Both answers must be yes.' }
  ]
},

/* ================================================================== 07 */
{
  id: 'privacy', track: 'social', door: 'social', n: '07',
  title: 'Privacy and Exposure',
  subtitle: 'Controlling what leaves your accounts by default',
  hero: null, glyph: 'sphere', color: 'pink', minutes: 12,
  objectives: [
    'Restrict audience, contact and discovery settings across major platforms',
    'Use IP-protection features during calls where they exist',
    'Reduce what an attacker can collect without ever contacting you'
  ],
  sections: [
    { h: 'Defaults are set for reach, not for you',
      p: ['Platform defaults are tuned to make accounts findable and content shareable, because that is what grows a platform. None of that is malicious, but none of it is chosen with your threat model in mind.',
          'Every setting below is a dial you can turn down without losing normal use.'] },
    { h: 'Platform comparison — privacy and exposure',
      p: ['Availability and labels vary by device, region and rollout. Look for the concept, not the exact wording.'],
      table: {
        cols: ['Setting', 'WhatsApp', 'Facebook', 'Instagram', 'X'],
        rows: [
          ['Restrict audience', 'Status/privacy controls', 'Post audience', 'Private account', 'Protect posts'],
          ['Unknown contacts', 'Silence unknown callers', 'Message controls', 'Message controls', 'DM/call controls'],
          ['Hide IP during calls', 'Protect IP in Calls', '—', '—', 'Enhanced Call Privacy'],
          ['Spam / harmful words', 'Block unknown messages', 'Spam filters', 'Hidden Words', 'Mute words / filters'],
          ['Tags and mentions', 'Group/status controls', 'Tag Review', 'Manual approval', 'Mention controls'],
          ['Location exposure', 'Device permission', 'Location controls', 'Location controls', 'Location controls'],
          ['Phone/email discovery', 'Privacy controls', 'Discoverability', 'Accounts Center', 'Discoverability'],
          ['Content leaving chat', 'Advanced Chat Privacy', 'Limited', 'Limited', 'Limited']
        ]
      } },
    { h: 'The call-privacy check most people miss',
      p: ['On a normal voice or video call, the two devices often connect directly for quality. That direct connection exposes each side\'s IP address, which reveals approximate location and internet provider.',
          'WhatsApp and X both offer to relay calls through their servers instead, hiding your address from the other party.'],
      list: [
        '<strong>WhatsApp</strong> — Settings › Privacy › Advanced › <em>Protect IP address in calls</em>. Expect a possible call-quality tradeoff, since traffic now takes a longer route.',
        '<strong>X</strong> — <em>Enhanced Call Privacy</em> in the calls section of privacy settings, where available.',
        '<strong>WhatsApp, same menu</strong> — <em>Disable link previews</em> stops your device fetching a preview from a link before you open it.',
        '<strong>WhatsApp Advanced Chat Privacy</strong> — restricts exporting a chat and limits what can be taken out of the conversation.'
      ],
      callout: { k: 'note', t: 'Worth the tradeoff?', d: 'For most people, yes — especially if you take calls from numbers you do not know. If a specific call sounds poor, you can turn it off temporarily.' } },
    { h: 'Discovery and reachability',
      p: ['Two settings quietly decide how much unsolicited contact you get:'],
      list: [
        '<strong>Phone/email discovery</strong> — whether someone who has your number can find your profile. Turning this down breaks the link between a leaked phone list and your social identity.',
        '<strong>Unknown contacts</strong> — silencing calls and filtering messages from people you have never messaged removes most cold-approach fraud before you ever see it.',
        '<strong>Tags and mentions</strong> — tag review stops other people attaching your name and face to content you have not seen.',
        '<strong>Location</strong> — check both the app setting and the operating system permission. The OS permission is the one that actually matters.'
      ] }
  ],
  lab: { type: 'privacy' },
  takeaways: [
    'Defaults optimise for reach; every exposure dial can be turned down.',
    'WhatsApp and X can relay calls to hide your IP address from the caller.',
    'Discovery settings break the link between a leaked phone number and your profile.'
  ],
  quiz: [
    { q: 'What does "Protect IP address in calls" actually do?',
      options: ['Encrypts the call for the first time',
                'Relays the call through the platform\'s servers so the other party cannot see your IP',
                'Blocks unknown callers',
                'Hides your phone number from the recipient'],
      answer: 1,
      why: 'Calls often connect peer-to-peer for quality, which exposes both IPs. Relaying adds a hop and hides the address, at a possible quality cost.' },
    { q: 'Why turn down phone-number discoverability?',
      options: ['It speeds up the app',
                'It breaks the link between a leaked phone list and your social profile',
                'It hides your posts from friends',
                'It disables two-factor authentication'],
      answer: 1,
      why: 'Number-based discovery lets anyone holding a leaked list map numbers to real profiles, photos and connections.' },
    { q: 'You have set location sharing to "off" inside a social app but the OS still grants "always". What is true?',
      options: ['The app setting overrides the OS',
                'The OS permission is the one that governs actual access',
                'Both must be on for any exposure',
                'Location is never collected on modern phones'],
      answer: 1,
      why: 'App-level toggles govern app features; the operating system permission governs whether the data can be read at all. Check both, trust the OS one.' },
    { q: 'What is tag review for?',
      options: ['Improving search ranking',
                'Preventing others attaching your name and face to content without your approval',
                'Backing up tagged photos',
                'Hiding your friend list'],
      answer: 1,
      why: 'Tags are other people publishing about you. Review puts that back under your control.' }
  ]
},

/* ================================================================== 08 */
{
  id: 'identity', track: 'social', door: 'social', n: '08',
  title: 'Your Profile Is a Research File',
  subtitle: 'Impersonation, cloned voices, and the family safe word',
  hero: 'assets/img/identity.webp', glyph: 'sphere', color: 'pink', minutes: 12,
  objectives: [
    'See your public profile the way an attacker collecting material sees it',
    'Recognise the four categories of clue that make impersonation work',
    'Set up a family safe word and a call-back rule that survive a cloned voice'
  ],
  sections: [
    { h: 'What a profile gives away',
      p: ['Before a targeted scam there is research. Nothing exotic — just reading what is already public and assembling it into a file.',
          'Individually, each detail is harmless. Combined, they let a stranger open a conversation already knowing who you are, who you trust, where you are and what you are worried about this week.'],
      cards: [
        { t: 'Family and workplace', d: 'Names, relationships and job title. This is what lets a message impersonate the exact person whose request you would not question.' },
        { t: 'Location and routine', d: 'Where you live, where you work, when you travel, when you are away from home. Geotagged photos and predictable posting times both leak this.' },
        { t: 'Face and voice samples', d: 'Any public video or voice note is training material. A few clear seconds is enough for a usable voice clone.' },
        { t: 'Interests and recent events', d: 'A recent purchase, a trip, an illness, an exam result. These make the opening line feel personal and credible.' }
      ] },
    { h: 'The emergency-call scam',
      p: ['The pattern is consistent. A call comes from a relative — often a child or a sibling — in obvious distress. There has been an accident, or an arrest, or a hospital admission. Money is needed immediately, and there is a reason not to call anyone else.',
          'The voice is right, because it was cloned from a public video. The details are right, because they came from social media. The urgency is manufactured, and the request for secrecy exists to stop you verifying.'],
      callout: { k: 'warn', t: 'The rule that beats it', d: 'Familiar is not verified. Hang up and call back on the number already saved in your phone.' } },
    { h: 'Three defences that work in the moment', steps: [
      { n: '1', t: 'A family safe word', d: 'Agree one word or question with close family that would never appear in a normal conversation. In a genuine emergency they can answer it. A cloned voice driven by a stranger cannot.' },
      { n: '2', t: 'Call back on a saved number', d: 'Never the number that called, never a number given during the call. End the call and dial the contact you already have.' },
      { n: '3', t: 'A second trusted person', d: 'Agree that no urgent money moves without one other family member being told. Secrecy is the attacker\'s requirement, so removing it removes the attack.' }
    ]},
    { h: 'Reducing the raw material',
      p: ['You do not need to delete your accounts. You need to make the research file thinner.'],
      list: [
        'Set older posts to friends-only in bulk where the platform allows it.',
        'Remove your workplace, school and home area from public view.',
        'Avoid posting travel plans in advance — post afterwards instead.',
        'Check what your profile photo, cover photo and bio reveal, since those usually stay public regardless of other settings.',
        'Search your own name in a logged-out browser and see what a stranger actually gets.'
      ] }
  ],
  lab: { type: 'osint' },
  takeaways: [
    'Public details combine into a research file that makes impersonation credible.',
    'A few seconds of clear public audio is enough for a usable voice clone.',
    'Safe word, call back on a saved number, and never move money in secret.'
  ],
  quiz: [
    { q: 'A distressed call from a family member\'s voice asks for urgent money and secrecy. Correct response?',
      options: ['Send a smaller amount as a compromise',
                'Ask a personal question they should know',
                'End the call and dial them back on the number saved in your phone',
                'Keep them talking to identify the fraud'],
      answer: 2,
      why: 'A cloned voice can answer personal questions using researched details. It cannot answer a call you place to the real saved number.' },
    { q: 'Why does the scam insist on secrecy?',
      options: ['To reduce phone bills',
                'Because involving a second person almost always breaks the deception',
                'Because it is a legal requirement',
                'To keep the call short'],
      answer: 1,
      why: 'Verification is the failure mode of the attack. Secrecy exists purely to prevent it, which is why it is such a reliable red flag.' },
    { q: 'Which is genuinely enough material for a convincing voice clone today?',
      options: ['Several hours of studio recording',
                'A few clear seconds from a public video or voice note',
                'A written transcript only',
                'A photograph of the person'],
      answer: 1,
      why: 'Modern voice models need very little clean audio. Any public video, story or forwarded voice note can supply it.' },
    { q: 'What makes a good family safe word?',
      options: ['A family member\'s name',
                'Your street name',
                'A word that would never appear naturally in conversation and is never posted online',
                'A number sequence from a CNIC'],
      answer: 2,
      why: 'It must be unguessable from public information and absent from anything an attacker could have researched or overheard.' }
  ]
},

/* ================================================================== 09 */
{
  id: 'aidata', track: 'ai', door: 'ai', n: '09',
  title: 'Assistant, Not a Vault',
  subtitle: 'What is safe to put into an AI tool — and what never is',
  hero: 'assets/img/aidata.webp', glyph: 'gem', color: 'teal', minutes: 11,
  objectives: [
    'Sort information into safe, anonymise-first and never-share categories',
    'Redact a document properly before uploading it for help',
    'Apply organisational policy over personal convenience'
  ],
  sections: [
    { h: 'The convenience trap',
      p: ['AI tools are genuinely useful, and that usefulness is exactly what makes people paste more than they should. The report is easier to summarise if you upload the whole thing. The letter is easier to draft with the real names in it.',
          'The rule is simple to state and harder to keep: treat an AI assistant as a capable colleague you do not know personally, working somewhere you cannot see. Useful — but not a confidential vault.'] },
    { h: 'Three categories', cards: [
      { t: 'Safe', tone: 'good', d: 'Public information, general questions, creative ideas, explanations of concepts, drafting from material that carries no identifiers.' },
      { t: 'Anonymise first', tone: 'warn', d: 'Real work you need help with — but with names removed, identifiers stripped, and only where you have approval to process it this way.' },
      { t: 'Never', tone: 'bad', d: 'Passwords, one-time codes, identity documents, case files, medical records and financial account data. No redaction makes these appropriate.' }
    ]},
    { h: 'Redaction that actually works',
      p: ['Deleting the name at the top is not redaction. Re-identification usually happens through the details people forget to remove.'],
      list: [
        '<strong>Direct identifiers</strong> — names, CNIC and passport numbers, phone numbers, email addresses, account numbers, vehicle registrations.',
        '<strong>Indirect identifiers</strong> — job title plus department plus city is frequently enough to name one person.',
        '<strong>Dates</strong> — exact dates of birth, admission or incident. Shift them or reduce to a month where the analysis allows.',
        '<strong>Free text</strong> — the narrative sections, where a name usually survives after every form field has been cleaned.',
        '<strong>File metadata</strong> — author, organisation and revision history travel inside the file even when the visible text is clean.'
      ],
      callout: { k: 'warn', t: 'Black boxes are not redaction', d: 'A black rectangle drawn over text in a PDF often leaves the text extractable underneath. Delete the content and re-export, or retype the extract you need.' } },
    { h: 'Policy beats convenience',
      p: ['If you handle case data, medical records, financial files or anything covered by an organisational policy, that policy decides — not your judgement about whether this one file seems harmless.',
          'Many organisations run approved internal AI tools with contractual data handling. Where one exists, use it. Where none exists, assume the answer is no until someone with authority says otherwise.'],
      callout: { k: 'key', t: 'One-line test', d: 'If this exact text appeared in a screenshot shared publicly tomorrow, would there be a problem? If yes, do not paste it.' } }
  ],
  lab: { type: 'redact' },
  takeaways: [
    'Safe, anonymise-first, never — sort before you paste.',
    'Indirect identifiers and free text re-identify people after names are removed.',
    'Organisational policy overrides personal convenience, every time.'
  ],
  quiz: [
    { q: 'Which belongs in the "never" category?',
      options: ['A public press release',
                'A one-time verification code',
                'A general question about grammar',
                'A fictional example you invented'],
      answer: 1,
      why: 'Codes, passwords, identity documents and case or medical data never belong in a general AI tool, regardless of framing.' },
    { q: 'You remove all names from a case summary but leave role, department, city and exact incident date. Is it anonymised?',
      options: ['Yes, names were the only identifiers',
                'No — the combination of indirect identifiers can still name one person',
                'Yes, if the file is deleted afterwards',
                'Only if the document is under two pages'],
      answer: 1,
      why: 'Re-identification rarely needs a name. A narrow combination of role, place and date often points to exactly one individual.' },
    { q: 'Why is drawing a black box over PDF text unreliable?',
      options: ['It prints badly',
                'The underlying text usually remains extractable beneath the shape',
                'It increases file size',
                'It removes the wrong pages'],
      answer: 1,
      why: 'The box is a drawn object layered on top. The text layer is untouched and can be copied or extracted directly.' },
    { q: 'Your employer has an approved internal AI tool. You find a public one more convenient. What governs?',
      options: ['Whichever produces better output',
                'Personal preference, since you are the one working',
                'The organisational policy — it overrides convenience',
                'Either, provided you delete the chat afterwards'],
      answer: 2,
      why: 'Approved tooling exists because of contractual and legal data-handling terms. Deleting a chat does not undo the transfer.' }
  ]
},

/* ================================================================== 10 */
{
  id: 'aiverify', track: 'ai', door: 'ai', n: '10',
  title: 'Confidence Is Not Evidence',
  subtitle: 'Verifying AI output before you act on it',
  hero: 'assets/img/verify.webp', glyph: 'gem', color: 'teal', minutes: 10,
  objectives: [
    'Separate fluency and confidence from accuracy',
    'Apply the Source → Confirm → Consequence test',
    'Scale verification effort to what happens if the answer is wrong'
  ],
  sections: [
    { h: 'Fluent, confident and wrong',
      p: ['AI systems produce text that reads as authoritative regardless of whether it is correct. There is no tone change when the model is uncertain — a fabricated case citation, a wrong dosage and a correct historical date all arrive in the same steady voice.',
          'This is not a reason to avoid these tools. It is a reason to stop treating confident phrasing as a quality signal. Confidence is a property of the writing, not of the facts.'],
      callout: { k: 'key', t: 'The reframe', d: 'Treat every AI answer as a well-written draft from a fast assistant who never says "I am not sure".' } },
    { h: 'The three-question test', steps: [
      { n: '1', t: 'SOURCE', d: 'Where did this claim originate? Is there a named, checkable origin — a document, a statute, a study, an official page — or is it unattributed assertion?' },
      { n: '2', t: 'CONFIRM', d: 'Can a credible independent source verify it? Not the same tool asked again, and not a site that simply repeats the same generated text. Go to the primary source.' },
      { n: '3', t: 'CONSEQUENCE', d: 'What happens if this answer is wrong? Wrong recipe, minor. Wrong medication, wrong legal deadline, wrong bank instruction — you verify before acting, every time.' }
    ]},
    { h: 'Where errors cluster',
      p: ['Some categories are far more error-prone than others. Raise your guard for:'],
      list: [
        '<strong>Citations and references</strong> — case numbers, DOIs, page numbers and quotes are frequently fabricated but perfectly formatted.',
        '<strong>Numbers and statistics</strong> — plausible figures with no traceable origin.',
        '<strong>Law and regulation</strong> — jurisdiction-specific rules, and rules that changed recently.',
        '<strong>Recent events</strong> — anything after the model\'s training data, or fast-moving situations.',
        '<strong>Named people and organisations</strong> — biographical details and attributed quotes.',
        '<strong>Anything the model was pushed toward</strong> — a leading question often produces an agreeable, invented answer.'
      ] },
    { h: 'Scale the effort',
      p: ['Verification is not free, so match it to the stakes. Low consequence and easily reversible? Use the answer and move on. High consequence, irreversible, or affecting someone else? Check the primary source before acting — and if you cannot find one, treat the claim as unverified rather than true.'] }
  ],
  lab: { type: 'claims' },
  takeaways: [
    'Fluency and confidence carry no information about accuracy.',
    'Source → Confirm → Consequence, with a genuinely independent check.',
    'Citations, statistics and legal deadlines are the highest-risk categories.'
  ],
  quiz: [
    { q: 'An AI gives a confident answer with a case citation. What does the confidence tell you?',
      options: ['The answer is likely correct',
                'The citation was checked',
                'Nothing about accuracy — tone is unrelated to correctness',
                'The source is recent'],
      answer: 2,
      why: 'The model produces the same authoritative register whether it is right or fabricating. Formatted citations are among the most commonly invented outputs.' },
    { q: 'What counts as a valid "confirm" step?',
      options: ['Asking the same AI to double-check',
                'Asking a different AI the same question',
                'Checking the primary source or an independent credible authority',
                'Seeing the claim repeated on several blogs'],
      answer: 2,
      why: 'Re-asking a model, or reading sites that recycle generated text, is not independent verification. Go to the origin.' },
    { q: 'Why does "consequence" belong in the test?',
      options: ['It makes the process longer',
                'It scales verification effort to what happens if the answer is wrong',
                'It determines which AI tool to use',
                'It is a legal requirement'],
      answer: 1,
      why: 'Verifying everything equally is unsustainable. Consequence tells you where to spend the effort.' },
    { q: 'Which is the highest-risk category for fabricated output?',
      options: ['Brainstorming names for a project',
                'Explaining a general concept',
                'Specific legal citations and deadlines',
                'Rewriting your own paragraph more clearly'],
      answer: 2,
      why: 'Precise, checkable, jurisdiction-specific detail is exactly where invented answers are both most likely and most damaging.' }
  ]
},

/* ================================================================== 11 */
{
  id: 'incident', track: 'respond', door: null, n: '11',
  title: 'When Something Goes Wrong',
  subtitle: 'Act quickly — not emotionally',
  hero: 'assets/img/incident.webp', glyph: 'shield', color: 'amber', minutes: 12,
  objectives: [
    'Run the five response steps in the correct order',
    'Preserve evidence before it disappears',
    'Report to the platform, the bank and NCCIA without delay'
  ],
  sections: [
    { h: 'The first ten minutes',
      p: ['After a compromise, the instinct is to delete the messages, block the account and never speak of it again. That instinct destroys exactly the evidence needed to act.',
          'Work the five steps in order. Speed matters most for money; sequence matters most for everything else.'],
      callout: { k: 'warn', t: 'Before you block anyone', d: 'Blocking often removes your access to the conversation, the profile and the numbers. Capture the evidence first, then block.' } },
    { h: 'The five steps', steps: [
      { n: '1', t: 'DISCONNECT', d: 'Stop further access. Take the device off the network if malware is suspected, end active sessions, and revoke connected apps.' },
      { n: '2', t: 'SECURE', d: 'Change access safely — ideally from a device you trust. Start with the primary email, then anything that shared a password. Re-check recovery details, which attackers change early.' },
      { n: '3', t: 'PRESERVE', d: 'Keep messages, receipts, screenshots, profile links, phone numbers, timestamps and transaction IDs. Capture the full screen including the sender details, not a cropped text bubble.' },
      { n: '4', t: 'REPORT', d: 'Platform, bank or payment provider, and NCCIA. For financial fraud, contact the bank immediately — the window in which a transfer can be held is short.' },
      { n: '5', t: 'MONITOR', d: 'Watch accounts, statements and credit activity for weeks afterwards. Compromises frequently resurface once the first response has quietened down.' }
    ]},
    { h: 'What evidence to capture',
      p: ['Collect these before blocking, deleting or leaving a group:'],
      list: [
        'Full screenshots showing the sender\'s number or handle, not just the message text.',
        'The profile link or username, and any display name changes you noticed.',
        'Exact timestamps, and your own timezone.',
        'Transaction IDs, reference numbers, account or wallet numbers used.',
        'The original message where possible — export the chat rather than retyping it.',
        'A short written timeline of what happened and when, made the same day.'
      ] },
    { h: 'Reporting in Pakistan',
      p: ['The National Cyber Crime Investigation Agency handles cybercrime complaints.'],
      list: [
        '<strong>Online complaint</strong> — <a href="https://complaint.nccia.gov.pk/" target="_blank" rel="noopener noreferrer">complaint.nccia.gov.pk</a>',
        '<strong>Helpline</strong> — 1799, available 24/7',
        '<strong>Agency</strong> — <a href="https://www.nccia.gov.pk/" target="_blank" rel="noopener noreferrer">nccia.gov.pk</a>',
        '<strong>Financial fraud</strong> — call your bank or payment provider first, then file the complaint. Both, not either.'
      ],
      callout: { k: 'note', t: 'Two things not to do', d: 'Do not pay a "recovery agent" who promises to retrieve lost funds — that is a second scam targeting victims of the first. And do not attempt to hack back; it is illegal and it damages your own case.' } }
  ],
  lab: { type: 'incidentlab' },
  takeaways: [
    'Disconnect, secure, preserve, report, monitor — in that order.',
    'Capture evidence before blocking, because blocking removes your access to it.',
    'Bank first for financial fraud, then complaint.nccia.gov.pk or helpline 1799.'
  ],
  quiz: [
    { q: 'You have just been defrauded over WhatsApp. What should you do before blocking the sender?',
      options: ['Nothing — block immediately',
                'Capture screenshots including the number, profile link, timestamps and transaction IDs',
                'Delete the chat to prevent further contact',
                'Reply demanding a refund'],
      answer: 1,
      why: 'Blocking commonly removes your access to the profile and conversation. Preserve first, block second.' },
    { q: 'For a fraudulent bank transfer, what is the most time-critical action?',
      options: ['Filing the online complaint',
                'Posting a warning on social media',
                'Contacting the bank or payment provider immediately',
                'Changing your social media passwords'],
      answer: 2,
      why: 'The window for holding or recalling a transfer is short. Bank first, then file the NCCIA complaint — both are necessary.' },
    { q: 'Someone offers to recover your stolen funds for an upfront fee. This is:',
      options: ['A normal recovery service',
                'Worth trying if the amount is large',
                'A follow-up scam targeting victims of the first',
                'A service NCCIA endorses'],
      answer: 2,
      why: 'Advance-fee recovery fraud specifically targets people who have already lost money. Report it rather than paying it.' },
    { q: 'Why is "monitor" a distinct step rather than the end of the incident?',
      options: ['To satisfy insurers',
                'Because compromises often resurface weeks later once the response quietens down',
                'Because passwords expire monthly',
                'To keep the complaint open'],
      answer: 1,
      why: 'Stolen data gets reused and resold. Continued monitoring catches the second attempt.' }
  ]
},

/* ================================================================== 12 */
{
  id: 'reset', track: 'respond', door: null, n: '12',
  title: 'The 10-Minute Reset',
  subtitle: 'Change one setting before you leave',
  hero: null, glyph: 'shield', color: 'amber', minutes: 15,
  objectives: [
    'Complete a ten-point hardening pass across all five doors',
    'Re-measure your baseline and see the change',
    'Leave with one concrete action you will take today'
  ],
  sections: [
    { h: 'Knowing is not the same as changing',
      p: ['Everything in this course is only worth the settings you actually change. So this final module is not a lecture — it is a checklist with a timer.',
          'Ten items, roughly one minute each. Do them now, on your own device, in whatever order suits you. Anything you cannot finish here, schedule for today.'],
      callout: { k: 'key', t: 'The whole course in three words', d: 'Pause • Verify • Protect' } },
    { h: 'Why these ten',
      p: ['Each item closes the highest-value gap behind one of the five doors, chosen for impact per minute spent.'],
      list: [
        'Items 1–2 secure the master key and the strongest sign-in — the largest single risk reduction available.',
        'Item 3 evicts anyone already inside.',
        'Items 4–5 close the device-level leaks that expose codes and data.',
        'Items 6–7 reduce what can be collected about you without contact.',
        'Item 8 defeats voice cloning inside your family.',
        'Items 9–10 mean that if something does go wrong, you can recover and report.'
      ] }
  ],
  lab: { type: 'reset' },
  takeaways: [
    'Ten actions, roughly one minute each, covering all five doors.',
    'Re-measuring your baseline shows the change is real.',
    'Cyber smart is a habit, not an app.'
  ],
  quiz: [
    { q: 'Which single action gives the largest risk reduction for most people?',
      options: ['Installing a new antivirus product',
                'Securing the primary email with a unique passphrase or passkey and app-based 2FA',
                'Deleting old social media posts',
                'Turning off Bluetooth'],
      answer: 1,
      why: 'Primary email governs the reset path for almost every other account. Securing it protects everything downstream.' },
    { q: 'What is the point of re-taking the baseline self-check at the end?',
      options: ['To generate a certificate',
                'To measure the change between your starting and ending exposure',
                'To compare with other participants',
                'To satisfy a reporting requirement'],
      answer: 1,
      why: 'The delta between the two scores is the only outcome that reflects real change in your habits.' },
    { q: 'What does "Pause • Verify • Protect" summarise?',
      options: ['Three software products to install',
                'Break the urgency, confirm independently, then close the gap',
                'A legal reporting sequence',
                'The three stages of an investigation'],
      answer: 1,
      why: 'It compresses the course into a habit: slow down, check through a channel you trust, and change the setting that keeps it from recurring.' }
  ]
}

    ]
  };

  /* quick lookups */
  COURSE.byId = {};
  COURSE.modules.forEach((m, i) => { COURSE.byId[m.id] = m; m.index = i; });
  COURSE.order = COURSE.modules.map(m => m.id);

  global.COURSE = COURSE;
})(window);
