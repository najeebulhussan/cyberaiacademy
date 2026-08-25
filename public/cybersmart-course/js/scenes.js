/* =====================================================================
   Cyber Smart — 3D scenes
   Built on GFX (js/engine.js). Every scene returns a handle with
   .destroy() so the router can tear it down on navigation.
   ===================================================================== */
(function (global) {
  'use strict';
  const { M4, Program, Mesh, Geo, Stage } = global.GFX;

  const reduceMotion = global.matchMedia
    ? global.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  /* ---------------- shared shader chunks ---------------- */

  const COMMON_NOISE = `
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
                 mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
      return v;
    }`;

  /* fullscreen procedural backdrop: depth haze + drifting grid + aurora */
  const BG_VS = `#version 300 es
    in vec2 aPos; out vec2 vUv;
    void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const BG_FS = `#version 300 es
    precision highp float;
    in vec2 vUv; out vec4 outColor;
    uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse;
    uniform vec3 uTint;
    ${COMMON_NOISE}

    // perspective floor grid receding to the horizon
    float grid(vec2 uv, float t){
      vec2 p = uv;
      p.y = abs(p.y) + 0.06;
      vec2 g = vec2(p.x / p.y, 1.0 / p.y);
      g.y += t * 0.55;
      vec2 f = abs(fract(g * vec2(3.0, 1.6)) - 0.5);
      vec2 w = fwidth(g * vec2(3.0, 1.6)) + 1e-5;
      vec2 l = smoothstep(w * 1.6, vec2(0.0), f);
      float line = max(l.x, l.y);
      return line * smoothstep(0.9, 0.0, p.y) * 0.55;
    }

    void main(){
      vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
      float t = uTime * 0.06;

      vec3 col = vec3(0.012, 0.020, 0.043);                     // deep navy base

      // aurora ribbons
      float n1 = fbm(uv * 1.7 + vec2(t * 1.4, t * 0.6));
      float n2 = fbm(uv * 2.6 - vec2(t * 0.9, t * 1.3) + n1);
      float ribbon = smoothstep(0.42, 0.98, n2);
      col += uTint * ribbon * 0.30;
      col += vec3(0.16, 0.34, 0.95) * pow(ribbon, 3.0) * 0.35;

      // mouse-reactive glow
      vec2 m = uMouse * vec2(uRes.x / uRes.y, 1.0) * 0.5;
      float d = length(uv - m);
      col += uTint * 0.10 / (1.0 + d * d * 22.0);

      // receding grid, lower half
      col += vec3(0.15, 0.55, 0.85) * grid(uv - vec2(0.0, 0.34), uTime) * 0.5;

      // scanline shimmer + vignette
      col *= 1.0 - 0.05 * sin(gl_FragCoord.y * 1.4 + uTime * 2.0);
      col *= smoothstep(1.35, 0.25, length(uv * vec2(0.85, 1.0)));

      // ordered dither kills banding on wide gradients
      float dith = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
      outColor = vec4(col + dith, 1.0);
    }`;

  /* additive point-sprite particles */
  const PT_VS = `#version 300 es
    in vec3 aPos; in vec3 aSeed;
    uniform mat4 uProj, uView; uniform float uTime, uPxScale;
    out float vFade; out vec3 vCol;
    void main(){
      vec3 p = aPos;
      float sp = 0.25 + aSeed.z * 0.6;
      p.y += sin(uTime * sp + aSeed.x * 6.28) * 0.30;
      p.x += cos(uTime * sp * 0.8 + aSeed.y * 6.28) * 0.22;
      vec4 mv = uView * vec4(p, 1.0);
      gl_Position = uProj * mv;
      float dist = -mv.z;
      gl_PointSize = clamp(uPxScale * (0.6 + aSeed.z) / max(dist, 0.6), 1.0, 42.0);
      vFade = smoothstep(26.0, 5.0, dist) * (0.35 + aSeed.z * 0.65);
      vCol = mix(vec3(0.15, 0.75, 0.95), vec3(0.45, 0.35, 1.0), aSeed.x);
    }`;

  const PT_FS = `#version 300 es
    precision highp float;
    in float vFade; in vec3 vCol; out vec4 outColor;
    void main(){
      vec2 c = gl_PointCoord - 0.5;
      float d = dot(c, c);
      if (d > 0.25) discard;
      float a = exp(-d * 11.0);                // soft gaussian core
      outColor = vec4(vCol * a * vFade, a * vFade);
    }`;

  /* emissive wireframe lines */
  const LINE_VS = `#version 300 es
    in vec3 aPos;
    uniform mat4 uProj, uView, uModel; uniform float uTime, uWarp;
    out float vDepth; out float vY;
    void main(){
      vec3 p = normalize(aPos) * (1.0 + uWarp * sin(aPos.y * 4.0 + uTime * 1.6) * 0.05);
      vec4 world = uModel * vec4(p, 1.0);
      vec4 mv = uView * world;
      vDepth = -mv.z; vY = p.y;
      gl_Position = uProj * mv;
    }`;

  const LINE_FS = `#version 300 es
    precision highp float;
    in float vDepth; in float vY; out vec4 outColor;
    uniform vec3 uColorA, uColorB; uniform float uOpacity, uTime;
    void main(){
      float fade = smoothstep(17.0, 2.0, vDepth);
      vec3 c = mix(uColorA, uColorB, vY * 0.5 + 0.5);
      float pulse = 0.72 + 0.28 * sin(vY * 5.0 - uTime * 2.2);
      outColor = vec4(c * pulse, fade * uOpacity);
    }`;

  /* lit solid with rim light + emissive core */
  const SOLID_VS = `#version 300 es
    in vec3 aPos; in vec3 aNormal;
    uniform mat4 uProj, uView, uModel; uniform mat3 uNormalMat;
    out vec3 vN; out vec3 vViewPos; out vec3 vLocal;
    void main(){
      vec4 world = uModel * vec4(aPos, 1.0);
      vec4 mv = uView * world;
      vN = normalize(uNormalMat * aNormal);
      vViewPos = mv.xyz; vLocal = aPos;
      gl_Position = uProj * mv;
    }`;

  const SOLID_FS = `#version 300 es
    precision highp float;
    in vec3 vN; in vec3 vViewPos; in vec3 vLocal; out vec4 outColor;
    uniform vec3 uBase, uGlow; uniform float uTime, uOpacity, uEmissive;
    void main(){
      vec3 N = normalize(vN);
      vec3 V = normalize(-vViewPos);
      vec3 L = normalize(vec3(0.45, 0.8, 0.6));
      float diff = max(dot(N, L), 0.0);
      float rim = pow(1.0 - max(dot(N, V), 0.0), 2.4);
      vec3 H = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), 48.0);

      // soft travelling sheen -- reads as material, not a painted stripe
      float band = smoothstep(0.30, 1.0, sin(vLocal.y * 2.2 - uTime * 1.1) * 0.5 + 0.5);
      band *= band;

      // second fill light from below-left keeps the dark side from going flat
      float fill = max(dot(N, normalize(vec3(-0.55, -0.35, 0.75))), 0.0);

      vec3 col = uBase * (0.42 + diff * 0.85 + fill * 0.30);
      col += uGlow * rim * 1.85;
      col += uGlow * band * uEmissive * 0.45;
      col += vec3(1.0) * spec * 0.55;
      outColor = vec4(col, uOpacity);
    }`;

  /* ---------------- geometry helpers ---------------- */

  /* Heraldic shield, extruded. Convex enough for fan triangulation. */
  function shieldGeo(depth) {
    const half = [
      [0.00, 1.00], [0.86, 1.00], [0.94, 0.44], [0.86, -0.02],
      [0.63, -0.56], [0.32, -1.02], [0.00, -1.28]
    ];
    const outline = [];
    for (let i = 0; i < half.length; i++) outline.push(half[i]);
    for (let i = half.length - 2; i >= 1; i--) outline.push([-half[i][0], half[i][1]]);

    const p = [], n = [], idx = [];
    const z = depth / 2, N = outline.length;

    // front + back caps (triangle fan from centroid)
    [[z, 1], [-z, -1]].forEach(([zz, dir]) => {
      const base = p.length / 3;
      p.push(0, -0.05, zz); n.push(0, 0, dir);
      for (const [x, y] of outline) { p.push(x, y, zz); n.push(0, 0, dir); }
      for (let i = 0; i < N; i++) {
        const a = base + 1 + i, b = base + 1 + ((i + 1) % N);
        if (dir > 0) idx.push(base, a, b); else idx.push(base, b, a);
      }
    });

    // side wall
    for (let i = 0; i < N; i++) {
      const [x0, y0] = outline[i], [x1, y1] = outline[(i + 1) % N];
      let nx = y1 - y0, ny = -(x1 - x0);
      const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const b = p.length / 3;
      p.push(x0, y0, z, x1, y1, z, x1, y1, -z, x0, y0, -z);
      for (let k = 0; k < 4; k++) n.push(nx, ny, 0);
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
    return { position: new Float32Array(p), normal: new Float32Array(n), index: new Uint16Array(idx) };
  }

  /* Rounded rectangular frame (a door), extruded — outer ring only. */
  function frameGeo(w, h, t, d) {
    const p = [], n = [], idx = [];
    const z = d / 2;
    const ow = w / 2, oh = h / 2, iw = ow - t, ih = oh - t;
    const outer = [[-ow,-oh],[ow,-oh],[ow,oh],[-ow,oh]];
    const inner = [[-iw,-ih],[iw,-ih],[iw,ih],[-iw,ih]];

    [[z, 1], [-z, -1]].forEach(([zz, dir]) => {
      const b = p.length / 3;
      for (let i = 0; i < 4; i++) { p.push(outer[i][0], outer[i][1], zz); n.push(0,0,dir); }
      for (let i = 0; i < 4; i++) { p.push(inner[i][0], inner[i][1], zz); n.push(0,0,dir); }
      for (let i = 0; i < 4; i++) {
        const a = b+i, a2 = b+(i+1)%4, c = b+4+i, c2 = b+4+(i+1)%4;
        if (dir > 0) idx.push(a, a2, c2, a, c2, c); else idx.push(a, c2, a2, a, c, c2);
      }
    });
    // outer + inner walls
    [[outer, 1], [inner, -1]].forEach(([ring, dir]) => {
      for (let i = 0; i < 4; i++) {
        const [x0,y0] = ring[i], [x1,y1] = ring[(i+1)%4];
        let nx = (y1-y0)*dir, ny = -(x1-x0)*dir;
        const l = Math.hypot(nx,ny)||1; nx/=l; ny/=l;
        const b = p.length/3;
        p.push(x0,y0,z, x1,y1,z, x1,y1,-z, x0,y0,-z);
        for (let k=0;k<4;k++) n.push(nx,ny,0);
        idx.push(b,b+1,b+2, b,b+2,b+3);
      }
    });
    return { position: new Float32Array(p), normal: new Float32Array(n), index: new Uint16Array(idx) };
  }

  function flatQuad(w, h) {
    const x = w/2, y = h/2;
    return {
      position: new Float32Array([-x,-y,0, x,-y,0, x,y,0, -x,y,0]),
      normal: new Float32Array([0,0,1, 0,0,1, 0,0,1, 0,0,1]),
      index: new Uint16Array([0,1,2, 0,2,3])
    };
  }

  /* ---------------- builders ---------------- */

  function makeSolid(gl) {
    const prog = new Program(gl, SOLID_VS, SOLID_FS);
    return prog.ok ? prog : null;
  }
  function meshFrom(gl, geo, mode, locs) {
    const attrs = { aPos: { data: geo.position, size: 3, loc: locs.pos } };
    if (geo.normal && locs.norm >= 0) attrs.aNormal = { data: geo.normal, size: 3, loc: locs.norm };
    return new Mesh(gl, attrs, geo.index, mode);
  }

  function particleCloud(gl, prog, count, radius, shell) {
    const pos = new Float32Array(count * 3), seed = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // spherical shell or filled ball depending on `shell`
      const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const r = shell ? radius * (0.94 + Math.random() * 0.16)
                      : radius * Math.cbrt(Math.random());
      pos[i*3]   = r * s * Math.cos(th);
      pos[i*3+1] = r * s * Math.sin(th) * 0.72;
      pos[i*3+2] = r * u;
      seed[i*3] = Math.random(); seed[i*3+1] = Math.random(); seed[i*3+2] = Math.random();
    }
    const lp = gl.getAttribLocation(prog.p, 'aPos');
    const ls = gl.getAttribLocation(prog.p, 'aSeed');
    return new Mesh(gl, {
      aPos:  { data: pos,  size: 3, loc: lp },
      aSeed: { data: seed, size: 3, loc: ls }
    }, null, gl.POINTS);
  }

  function fullscreenQuad(gl, prog) {
    const loc = gl.getAttribLocation(prog.p, 'aPos');
    return new Mesh(gl, {
      aPos: { data: new Float32Array([-1,-1, 3,-1, -1,3]), size: 2, loc }
    }, null, gl.TRIANGLES);
  }

  function tintOf(name) {
    const t = {
      cyan:   [0.10, 0.52, 0.70],
      violet: [0.34, 0.20, 0.78],
      amber:  [0.62, 0.36, 0.08],
      rose:   [0.62, 0.13, 0.30],
      green:  [0.06, 0.50, 0.40]
    };
    return t[name] || t.cyan;
  }

  /* =====================================================================
     Scene 1 — ambient backdrop (site-wide, behind all content)
     ===================================================================== */
  function ambient(canvas, opts) {
    opts = opts || {};
    const stage = new Stage(canvas, { dprCap: 1.2 });
    if (!stage.ok) return { destroy() {}, setTint() {} };
    const gl = stage.gl;

    const bgProg = new Program(gl, BG_VS, BG_FS);
    const ptProg = new Program(gl, PT_VS, PT_FS);
    if (!bgProg.ok || !ptProg.ok) { stage.destroy(); return { destroy() {}, setTint() {} }; }

    const quad = fullscreenQuad(gl, bgProg);
    const pts = particleCloud(gl, ptProg, reduceMotion ? 180 : 620, 13, false);

    let tint = tintOf(opts.tint), tintTarget = tint.slice();
    stage.trackPointer(global);

    stage.onFrame = (dt, t) => {
      for (let i = 0; i < 3; i++) tint[i] += (tintTarget[i] - tint[i]) * Math.min(1, dt * 1.6);
      gl.disable(gl.DEPTH_TEST);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      bgProg.use()
        .set('uTime', reduceMotion ? 6.0 : t)
        .set('uRes', [stage.w, stage.h])
        .set('uMouse', [stage.mouse.x, -stage.mouse.y])
        .set('uTint', tint);
      quad.draw();

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      const proj = M4.persp(0.9, stage.aspect, 0.1, 100);
      const eye = [stage.mouse.x * 1.6, -stage.mouse.y * 1.0 + 0.5, 15];
      const view = M4.lookAt(eye, [0, 0, 0], [0, 1, 0]);
      ptProg.use()
        .set('uProj', proj).set('uView', view)
        .set('uTime', reduceMotion ? 3.0 : t)
        .set('uPxScale', 26 * Math.min(global.devicePixelRatio || 1, 1.2));
      pts.draw();
      gl.disable(gl.BLEND);
    };
    stage.start();

    return {
      setTint(name) { tintTarget = tintOf(name); },
      destroy() { stage.destroy(); }
    };
  }

  /* =====================================================================
     Scene 2 — hero: shield inside a wireframe world
     ===================================================================== */
  function hero(canvas) {
    const stage = new Stage(canvas, { dprCap: 1.6 });
    if (!stage.ok) { canvas.classList.add('gfx-fallback'); return { destroy() {} }; }
    const gl = stage.gl;

    const lineProg = new Program(gl, LINE_VS, LINE_FS);
    const solidProg = makeSolid(gl);
    const ptProg = new Program(gl, PT_VS, PT_FS);
    if (!lineProg.ok || !solidProg || !ptProg.ok) { stage.destroy(); return { destroy() {} }; }

    const sphereGeo = Geo.icosphere(2);
    const wire = meshFrom(gl, { position: sphereGeo.position, index: Geo.edges(sphereGeo.index) },
      gl.LINES, { pos: gl.getAttribLocation(lineProg.p, 'aPos'), norm: -1 });

    const sLocs = { pos: gl.getAttribLocation(solidProg.p, 'aPos'),
                    norm: gl.getAttribLocation(solidProg.p, 'aNormal') };
    const shield = meshFrom(gl, shieldGeo(0.30), gl.TRIANGLES, sLocs);
    const ring = meshFrom(gl, Geo.torus(2.9, 0.028, 96, 8), gl.TRIANGLES, sLocs);
    const ring2 = meshFrom(gl, Geo.torus(3.5, 0.016, 96, 8), gl.TRIANGLES, sLocs);
    const cloud = particleCloud(gl, ptProg, reduceMotion ? 90 : 420, 4.6, true);

    stage.trackPointer(canvas.parentElement || canvas);

    stage.onFrame = (dt, t) => {
      const T = reduceMotion ? 2.0 : t;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      const proj = M4.persp(0.78, stage.aspect, 0.1, 60);
      const camX = stage.mouse.x * 1.1, camY = -stage.mouse.y * 0.7;
      const view = M4.lookAt([camX, camY + 0.15, 8.0], [0, 0, 0], [0, 1, 0]);
      const yaw = T * 0.16, bob = Math.sin(T * 0.7) * 0.10;

      // outer wireframe world
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.depthMask(false);
      lineProg.use()
        .set('uProj', proj).set('uView', view)
        .set('uModel', M4.compose([0, bob * 0.4, 0], [T * 0.07, yaw, 0], [3.05, 3.05, 3.05]))
        .set('uColorA', [0.10, 0.62, 0.92]).set('uColorB', [0.42, 0.30, 0.95])
        .set('uOpacity', 0.85).set('uTime', T).set('uWarp', 1.0);
      wire.draw();

      // particle shell
      ptProg.use().set('uProj', proj).set('uView', view)
        .set('uTime', T).set('uPxScale', 30 * Math.min(global.devicePixelRatio || 1, 1.6));
      cloud.draw();
      gl.depthMask(true); gl.disable(gl.BLEND);

      // orbiting rings
      solidProg.use().set('uProj', proj).set('uView', view).set('uTime', T).set('uOpacity', 1.0);
      let m = M4.compose([0, bob * 0.5, 0], [1.15, T * 0.5, 0.25], [1, 1, 1]);
      solidProg.set('uModel', m).set('uNormalMat', M4.normalMat(m))
        .set('uBase', [0.05, 0.28, 0.45]).set('uGlow', [0.16, 0.85, 1.0]).set('uEmissive', 0.9);
      ring.draw();
      m = M4.compose([0, bob * 0.5, 0], [1.45, -T * 0.32, -0.5], [1, 1, 1]);
      solidProg.set('uModel', m).set('uNormalMat', M4.normalMat(m))
        .set('uBase', [0.16, 0.10, 0.40]).set('uGlow', [0.55, 0.36, 1.0]).set('uEmissive', 0.8);
      ring2.draw();

      // the shield itself
      m = M4.compose([0, bob, 0.6], [Math.sin(T * 0.5) * 0.10, Math.sin(T * 0.35) * 0.32, 0], [1.85, 1.85, 1.85]);
      solidProg.set('uModel', m).set('uNormalMat', M4.normalMat(m))
        .set('uBase', [0.055, 0.135, 0.30]).set('uGlow', [0.20, 0.92, 1.0]).set('uEmissive', 0.75);
      shield.draw();
    };
    stage.start();
    return { destroy() { stage.destroy(); } };
  }

  /* =====================================================================
     Scene 3 — the Five Doors
     3D frames in an arc. Screen positions are published each frame so the
     app can lay real <button> elements on top (accessible + exact hits).
     ===================================================================== */
  function doors(canvas, count, onProject) {
    const stage = new Stage(canvas, { dprCap: 1.5 });
    if (!stage.ok) { canvas.classList.add('gfx-fallback'); return { destroy() {}, setState() {} }; }
    const gl = stage.gl;

    const solidProg = makeSolid(gl);
    const ptProg = new Program(gl, PT_VS, PT_FS);
    if (!solidProg || !ptProg.ok) { stage.destroy(); return { destroy() {}, setState() {} }; }

    const locs = { pos: gl.getAttribLocation(solidProg.p, 'aPos'),
                   norm: gl.getAttribLocation(solidProg.p, 'aNormal') };
    const frame = meshFrom(gl, frameGeo(1.55, 2.45, 0.12, 0.16), gl.TRIANGLES, locs);
    const panel = meshFrom(gl, flatQuad(1.34, 2.24), gl.TRIANGLES, locs);
    const cloud = particleCloud(gl, ptProg, reduceMotion ? 60 : 260, 7, false);

    const PALETTE = [
      { base: [0.05, 0.20, 0.36], glow: [0.16, 0.86, 1.00] },  // mobile   — cyan
      { base: [0.10, 0.14, 0.40], glow: [0.36, 0.52, 1.00] },  // accounts — blue
      { base: [0.16, 0.10, 0.38], glow: [0.62, 0.38, 1.00] },  // systems  — violet
      { base: [0.28, 0.14, 0.28], glow: [0.98, 0.42, 0.72] },  // social   — pink
      { base: [0.06, 0.24, 0.24], glow: [0.20, 0.94, 0.70] }   // ai       — teal
    ];

    // per-door animation state: open amount + hover lift
    const st = Array.from({ length: count }, () => ({ open: 0, tOpen: 0, hov: 0, tHov: 0, done: 0 }));
    stage.trackPointer(canvas.parentElement || canvas);

    const project = (m, view, proj) => {
      const mv = M4.mul(view, m), clip = M4.mul(proj, mv);
      const w = clip[15] || 1;
      return { x: (clip[12] / w) * 0.5 + 0.5, y: 1 - ((clip[13] / w) * 0.5 + 0.5) };
    };

    stage.onFrame = (dt, t) => {
      const T = reduceMotion ? 1.5 : t;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      // Five readable labels need roughly 900 CSS px of arc. Below that the
      // doors stack into a vertical column instead. The same measurement
      // drives the overlay's .is-stacked class, so 3D and CSS never disagree.
      const narrow = canvas.clientWidth < 900;
      const proj = M4.persp(narrow ? 0.86 : 0.72, stage.aspect, 0.1, 60);
      const view = M4.lookAt(
        [stage.mouse.x * (narrow ? 0.3 : 0.9), -stage.mouse.y * 0.45 + 0.1, narrow ? 7.8 : 7.1],
        [0, 0, 0], [0, 1, 0]);

      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.depthMask(false);
      ptProg.use().set('uProj', proj).set('uView', view).set('uTime', T)
        .set('uPxScale', 22 * Math.min(global.devicePixelRatio || 1, 1.5));
      cloud.draw();
      gl.depthMask(true); gl.disable(gl.BLEND);

      solidProg.use().set('uProj', proj).set('uView', view).set('uTime', T);

      const spread = 1.95;          // horizontal gap, wide layout
      const vspread = 1.40;         // vertical gap, stacked layout
      const arc = 0.30;
      const S = narrow ? 0.52 : 1;  // doors shrink when stacked
      const screen = [];

      for (let i = 0; i < count; i++) {
        const s = st[i];
        s.open += (s.tOpen - s.open) * Math.min(1, dt * 6);
        s.hov  += (s.tHov  - s.hov)  * Math.min(1, dt * 8);

        const k = i - (count - 1) / 2;
        const x = narrow ? -1.20 : k * spread;   // stacked: sit left, label goes beside
        const z = narrow ? -0.15 : -Math.abs(k) * 0.55;
        const drift = Math.sin(T * 0.8 + i * 0.9) * 0.07;
        const y = (narrow ? -k * vspread : 0) + drift + s.hov * (narrow ? 0.06 : 0.16);
        const rotY = (narrow ? 0.34 : -k * arc) + s.open * 0.9;
        const pal = PALETTE[i % PALETTE.length];
        const lit = 0.45 + s.hov * 0.55 + s.done * 0.35;

        // frame
        let m = M4.compose([x, y, z], [0, rotY, 0], [S, S, S]);
        solidProg.set('uModel', m).set('uNormalMat', M4.normalMat(m))
          .set('uBase', pal.base).set('uGlow', pal.glow)
          .set('uEmissive', 0.5 + lit * 0.9).set('uOpacity', 1.0);
        frame.draw();

        // inner panel — swings like a door on its hinge as `open` rises
        const hinge = -0.67 * S;
        const ang = rotY + s.open * 1.15;
        const px = x + hinge * Math.cos(rotY) - hinge * Math.cos(ang);
        const pz = z - hinge * Math.sin(rotY) + hinge * Math.sin(ang);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        let pm = M4.compose([px, y, pz + 0.01], [0, ang, 0], [S, S, S]);
        solidProg.set('uModel', pm).set('uNormalMat', M4.normalMat(pm))
          .set('uBase', [pal.base[0] * 0.5, pal.base[1] * 0.5, pal.base[2] * 0.6])
          .set('uGlow', pal.glow).set('uEmissive', 0.30 + s.hov * 0.5)
          .set('uOpacity', 0.90 - s.open * 0.35);
        panel.draw();
        gl.disable(gl.BLEND);

        screen.push(project(M4.compose([x, y, z], [0, rotY, 0], [S, S, S]), view, proj));
      }
      if (onProject) onProject(screen, narrow);
    };
    stage.start();

    return {
      setState(i, patch) {
        if (!st[i]) return;
        if (patch.hover != null) st[i].tHov = patch.hover ? 1 : 0;
        if (patch.open != null) st[i].tOpen = patch.open ? 1 : 0;
        if (patch.done != null) st[i].done = patch.done ? 1 : 0;
      },
      destroy() { stage.destroy(); }
    };
  }

  /* =====================================================================
     Scene 4 — module glyph: a small rotating object per module
     ===================================================================== */
  const GLYPHS = {
    shield:  () => shieldGeo(0.34),
    slab:    () => Geo.box(1.05, 2.0, 0.16),           // phone
    key:     () => Geo.torus(0.7, 0.20, 40, 14),       // ring / access
    cube:    () => Geo.box(1.5, 1.5, 1.5),             // system
    sphere:  () => Geo.icosphere(2),                   // network / identity
    gem:     () => Geo.icosphere(1)                    // ai / faceted
  };

  function glyph(canvas, kind, colorName) {
    const stage = new Stage(canvas, { dprCap: 1.5 });
    if (!stage.ok) { canvas.classList.add('gfx-fallback'); return { destroy() {} }; }
    const gl = stage.gl;
    const solidProg = makeSolid(gl);
    const lineProg = new Program(gl, LINE_VS, LINE_FS);
    if (!solidProg || !lineProg.ok) { stage.destroy(); return { destroy() {} }; }

    const geo = (GLYPHS[kind] || GLYPHS.gem)();
    const locs = { pos: gl.getAttribLocation(solidProg.p, 'aPos'),
                   norm: gl.getAttribLocation(solidProg.p, 'aNormal') };
    const solid = meshFrom(gl, geo, gl.TRIANGLES, locs);

    const cage = Geo.icosphere(1);
    const halo = meshFrom(gl, { position: cage.position, index: Geo.edges(cage.index) },
      gl.LINES, { pos: gl.getAttribLocation(lineProg.p, 'aPos'), norm: -1 });

    const C = {
      cyan:   { base: [0.05, 0.22, 0.38], glow: [0.16, 0.86, 1.00] },
      blue:   { base: [0.09, 0.14, 0.42], glow: [0.36, 0.55, 1.00] },
      violet: { base: [0.17, 0.10, 0.40], glow: [0.63, 0.38, 1.00] },
      pink:   { base: [0.29, 0.13, 0.28], glow: [0.98, 0.42, 0.72] },
      teal:   { base: [0.05, 0.25, 0.24], glow: [0.20, 0.94, 0.70] },
      amber:  { base: [0.32, 0.20, 0.03], glow: [1.00, 0.70, 0.20] }
    }[colorName] || { base: [0.05, 0.22, 0.38], glow: [0.16, 0.86, 1.00] };

    const scale = kind === 'slab' ? 0.78 : kind === 'cube' ? 0.66 : kind === 'sphere' ? 1.05 : 0.95;
    stage.trackPointer(canvas.parentElement || canvas);

    stage.onFrame = (dt, t) => {
      const T = reduceMotion ? 1.0 : t;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      const proj = M4.persp(0.85, stage.aspect, 0.1, 40);
      const view = M4.lookAt([stage.mouse.x * 0.5, -stage.mouse.y * 0.35, 3.3], [0, 0, 0], [0, 1, 0]);
      const rot = [Math.sin(T * 0.45) * 0.30, T * 0.55, Math.sin(T * 0.3) * 0.12];

      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.depthMask(false);
      lineProg.use().set('uProj', proj).set('uView', view)
        .set('uModel', M4.compose([0,0,0], [-rot[0]*0.5, -T*0.25, 0], [1.55,1.55,1.55]))
        .set('uColorA', C.glow).set('uColorB', [C.glow[0]*0.4, C.glow[1]*0.5, 1.0])
        .set('uOpacity', 0.42).set('uTime', T).set('uWarp', 0.6);
      halo.draw();
      gl.depthMask(true); gl.disable(gl.BLEND);

      const m = M4.compose([0, Math.sin(T * 0.9) * 0.07, 0], rot, [scale, scale, scale]);
      solidProg.use().set('uProj', proj).set('uView', view).set('uTime', T)
        .set('uModel', m).set('uNormalMat', M4.normalMat(m))
        .set('uBase', C.base).set('uGlow', C.glow)
        .set('uEmissive', 0.8).set('uOpacity', 1.0);
      solid.draw();
    };
    stage.start();
    return { destroy() { stage.destroy(); } };
  }

  /* =====================================================================
     Scene 5 — certificate badge
     ===================================================================== */
  function badge(canvas) {
    const stage = new Stage(canvas, { dprCap: 1.6 });
    if (!stage.ok) { canvas.classList.add('gfx-fallback'); return { destroy() {} }; }
    const gl = stage.gl;
    const solidProg = makeSolid(gl);
    const ptProg = new Program(gl, PT_VS, PT_FS);
    if (!solidProg || !ptProg.ok) { stage.destroy(); return { destroy() {} }; }

    const locs = { pos: gl.getAttribLocation(solidProg.p, 'aPos'),
                   norm: gl.getAttribLocation(solidProg.p, 'aNormal') };
    const shield = meshFrom(gl, shieldGeo(0.34), gl.TRIANGLES, locs);
    const ring = meshFrom(gl, Geo.torus(1.55, 0.055, 80, 10), gl.TRIANGLES, locs);
    const spark = particleCloud(gl, ptProg, reduceMotion ? 70 : 320, 3.2, false);

    stage.onFrame = (dt, t) => {
      const T = reduceMotion ? 1.0 : t;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      const proj = M4.persp(0.8, stage.aspect, 0.1, 40);
      const view = M4.lookAt([0, 0, 5.6], [0, 0, 0], [0, 1, 0]);

      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.depthMask(false);
      ptProg.use().set('uProj', proj).set('uView', view).set('uTime', T)
        .set('uPxScale', 24 * Math.min(global.devicePixelRatio || 1, 1.6));
      spark.draw();
      gl.depthMask(true); gl.disable(gl.BLEND);

      solidProg.use().set('uProj', proj).set('uView', view).set('uTime', T).set('uOpacity', 1);
      let m = M4.compose([0, 0, 0], [0.15, T * 0.35, 0], [1, 1, 1]);
      solidProg.set('uModel', m).set('uNormalMat', M4.normalMat(m))
        .set('uBase', [0.34, 0.24, 0.04]).set('uGlow', [1.0, 0.78, 0.28]).set('uEmissive', 1.0);
      ring.draw();
      m = M4.compose([0, 0, 0], [Math.sin(T * 0.4) * 0.12, T * 0.45, 0], [1.25, 1.25, 1.25]);
      solidProg.set('uModel', m).set('uNormalMat', M4.normalMat(m))
        .set('uBase', [0.30, 0.21, 0.03]).set('uGlow', [1.0, 0.83, 0.35]).set('uEmissive', 0.9);
      shield.draw();
    };
    stage.start();
    return { destroy() { stage.destroy(); } };
  }

  global.Scenes = { ambient, hero, doors, glyph, badge, reduceMotion };
})(window);
