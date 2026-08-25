# Cyber Smart — Interactive Course

An interactive web course built from the presentation
**“Cyber Smart: Protecting Yourself in an AI-Powered Digital World”**
by Najeeb ul Hassan (Focal Person & Public Relations Officer, NCCIA).

13 modules · 12 hands-on labs · final assessment · downloadable certificate.

---

## Running it

**Easiest:** double-click `index.html`. Everything works from the local file
system — no build step, no server, no internet connection.

**With a local server** (nicer URLs, avoids any browser file-access quirks):

```
serve.cmd
```

then open <http://localhost:8080>. Requires Node.js, which is only used for the
tiny static file server — the course itself has no dependencies.

Requires a browser with WebGL2 (Chrome, Edge, Firefox, Safari 15+). If WebGL is
unavailable the 3D panels fall back to a gradient and everything else still works.

---

## Course structure

| # | Module | Door | Lab |
|---|--------|------|-----|
| 00 | One Device, Four Targets | Orientation | — |
| 01 | Your Private Baseline | Orientation | Private self-check |
| 02 | Secure the Device | 01 Mobile | Phone hardening simulator |
| 03 | Urgency Is the Signal | 01 Mobile | Inbox triage under pressure |
| 04 | Sign-in and Sessions | 02 Accounts | Session review + settings hunt |
| 05 | Email Is the Master Key | 02 Accounts | Build the master key |
| 06 | Boring and Recoverable | 03 Systems | Expected sender, expected file |
| 07 | Privacy and Exposure | 04 Social | Exposure control panel |
| 08 | Your Profile Is a Research File | 04 Social | Read the profile like an attacker |
| 09 | Assistant, Not a Vault | 05 AI | Redact before you paste |
| 10 | Confidence Is Not Evidence | 05 AI | Audit the confident answer |
| 11 | When Something Goes Wrong | Response | The first ten minutes |
| 12 | The 10-Minute Reset | Response | Ten-action reset with timer |

Each module ends with a lab and a knowledge check. Completing all thirteen
unlocks a 15-question final assessment; scoring 75% or above unlocks the
certificate, which is drawn in-browser and downloadable as PNG.

---

## Files

```
index.html          page shell, sidebar, progress ring
css/app.css         all styling (dark theme, colour carried by --acc)
js/engine.js        dependency-free WebGL2 engine: matrices, shaders,
                    meshes, geometry generators, RAF/visibility stage
js/scenes.js        the five 3D scenes built on that engine
js/data.js          all course content — modules, sections, quizzes
js/labs.js          the twelve interactive labs
js/app.js           hash router, progress persistence, exam, certificate
assets/img/         module hero images, extracted from the source deck
```

### The 3D

There is no Three.js and no CDN. `js/engine.js` is a small purpose-built WebGL2
renderer (~450 lines) and `js/scenes.js` contains five scenes:

- **ambient** — site-wide backdrop: procedural aurora, receding grid, particles
- **hero** — extruded heraldic shield inside a wireframe globe with orbiting rings
- **doors** — five door frames whose screen positions are projected each frame so
  real `<button>` elements can be laid over them (accessible, exact hit-testing).
  Below ~900px of arc they restack into a vertical column and the scene sets
  `.is-stacked` on the stage so the labels reflow to match.
- **glyph** — a rotating object per module, tinted to that door's colour
- **badge** — the spinning gold shield on the certificate page

Everything pauses when off-screen or when the tab is hidden, and honours
`prefers-reduced-motion`.

---

## Progress and privacy

Progress, lab state, the certificate name and the exam score are stored in
`localStorage` under `cybersmart.progress.v1`. Nothing is uploaded and there is
no analytics or network request of any kind. **Clear saved progress** in the
sidebar wipes it.

---

## Reporting cybercrime (Pakistan)

- Online complaint — <https://complaint.nccia.gov.pk/>
- Helpline — **1799** (24/7)
- Agency — <https://www.nccia.gov.pk/>

For financial fraud, contact your bank or payment provider **first**, then file
the complaint.

---

*Pause • Verify • Protect*
