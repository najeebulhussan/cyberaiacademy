/* =====================================================================
   Cyber Smart — mini WebGL2 engine
   Dependency-free 3D: matrix math, shader/mesh helpers, geometry
   generators and a tiny scene runner. No CDN, works offline.
   ===================================================================== */
(function (global) {
  'use strict';

  /* ---------- math ---------- */
  const M4 = {
    ident() { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); },
    persp(fovy, aspect, near, far) {
      const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
      return new Float32Array([
        f / aspect,0,0,0,
        0,f,0,0,
        0,0,(far + near) * nf,-1,
        0,0,2 * far * near * nf,0]);
    },
    lookAt(eye, target, up) {
      let z0 = eye[0]-target[0], z1 = eye[1]-target[1], z2 = eye[2]-target[2];
      let l = 1 / Math.hypot(z0,z1,z2); z0*=l; z1*=l; z2*=l;
      let x0 = up[1]*z2 - up[2]*z1, x1 = up[2]*z0 - up[0]*z2, x2 = up[0]*z1 - up[1]*z0;
      l = Math.hypot(x0,x1,x2); l = l ? 1/l : 0; x0*=l; x1*=l; x2*=l;
      const y0 = z1*x2 - z2*x1, y1 = z2*x0 - z0*x2, y2 = z0*x1 - z1*x0;
      return new Float32Array([
        x0,y0,z0,0, x1,y1,z1,0, x2,y2,z2,0,
        -(x0*eye[0]+x1*eye[1]+x2*eye[2]),
        -(y0*eye[0]+y1*eye[1]+y2*eye[2]),
        -(z0*eye[0]+z1*eye[1]+z2*eye[2]), 1]);
    },
    mul(a, b) {
      const o = new Float32Array(16);
      for (let i = 0; i < 4; i++) {
        const ai0=a[i],ai1=a[i+4],ai2=a[i+8],ai3=a[i+12];
        for (let j = 0; j < 4; j++) {
          o[i+j*4] = ai0*b[j*4] + ai1*b[j*4+1] + ai2*b[j*4+2] + ai3*b[j*4+3];
        }
      }
      return o;
    },
    compose(pos, rot, scale) {
      // rot = [rx, ry, rz] euler XYZ (applied Z→Y→X)
      const cx=Math.cos(rot[0]), sx=Math.sin(rot[0]);
      const cy=Math.cos(rot[1]), sy=Math.sin(rot[1]);
      const cz=Math.cos(rot[2]), sz=Math.sin(rot[2]);
      const sX=scale[0], sY=scale[1], sZ=scale[2];
      const m = new Float32Array(16);
      m[0]=(cy*cz)*sX;             m[1]=(cx*sz+sx*sy*cz)*sX;   m[2]=(sx*sz-cx*sy*cz)*sX;   m[3]=0;
      m[4]=(-cy*sz)*sY;            m[5]=(cx*cz-sx*sy*sz)*sY;   m[6]=(sx*cz+cx*sy*sz)*sY;   m[7]=0;
      m[8]=(sy)*sZ;                m[9]=(-sx*cy)*sZ;           m[10]=(cx*cy)*sZ;           m[11]=0;
      m[12]=pos[0]; m[13]=pos[1]; m[14]=pos[2]; m[15]=1;
      return m;
    },
    normalMat(m) {
      // inverse-transpose of upper 3x3, returned as mat3-in-mat4 slots
      const a=m[0],b=m[1],c=m[2], d=m[4],e=m[5],f=m[6], g=m[8],h=m[9],i=m[10];
      const A=e*i-f*h, B=f*g-d*i, C=d*h-e*g;
      let det = a*A + b*B + c*C;
      if (!det) return new Float32Array([1,0,0, 0,1,0, 0,0,1]);
      det = 1/det;
      return new Float32Array([
        A*det, B*det, C*det,
        (c*h-b*i)*det, (a*i-c*g)*det, (b*g-a*h)*det,
        (b*f-c*e)*det, (c*d-a*f)*det, (a*e-b*d)*det]);
    }
  };

  /* ---------- gl helpers ---------- */
  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('shader:', gl.getShaderInfoLog(s), src);
      gl.deleteShader(s); return null;
    }
    return s;
  }

  class Program {
    constructor(gl, vs, fs) {
      this.gl = gl;
      const p = gl.createProgram();
      const v = compile(gl, gl.VERTEX_SHADER, vs);
      const f = compile(gl, gl.FRAGMENT_SHADER, fs);
      if (!v || !f) { this.ok = false; return; }
      gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error('link:', gl.getProgramInfoLog(p)); this.ok = false; return;
      }
      gl.deleteShader(v); gl.deleteShader(f);
      this.p = p; this.ok = true; this.u = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const info = gl.getActiveUniform(p, i);
        const name = info.name.replace(/\[0\]$/, '');
        this.u[name] = gl.getUniformLocation(p, name);
      }
    }
    use() { this.gl.useProgram(this.p); return this; }
    set(name, val) {
      const gl = this.gl, l = this.u[name];
      if (l == null) return this;
      if (typeof val === 'number') gl.uniform1f(l, val);
      else if (val.length === 16) gl.uniformMatrix4fv(l, false, val);
      else if (val.length === 9) gl.uniformMatrix3fv(l, false, val);
      else if (val.length === 4) gl.uniform4fv(l, val);
      else if (val.length === 3) gl.uniform3fv(l, val);
      else if (val.length === 2) gl.uniform2fv(l, val);
      return this;
    }
  }

  class Mesh {
    /* attrs: {name:{data, size, loc}} ; index optional Uint16Array */
    constructor(gl, attrs, index, mode) {
      this.gl = gl; this.mode = mode == null ? gl.TRIANGLES : mode;
      this.vao = gl.createVertexArray();
      gl.bindVertexArray(this.vao);
      this.buffers = {};
      let count = 0;
      for (const k in attrs) {
        const a = attrs[k];
        const b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, a.data, a.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
        gl.enableVertexAttribArray(a.loc);
        gl.vertexAttribPointer(a.loc, a.size, gl.FLOAT, false, 0, 0);
        if (a.divisor) gl.vertexAttribDivisor(a.loc, a.divisor);
        else count = Math.max(count, a.data.length / a.size);
        this.buffers[k] = b;
      }
      this.count = count;
      if (index) {
        const ib = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);
        this.index = ib; this.count = index.length;
        this.indexType = index instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
      }
      gl.bindVertexArray(null);
    }
    update(name, data) {
      const gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[name]);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    }
    draw(instances) {
      const gl = this.gl;
      gl.bindVertexArray(this.vao);
      if (this.index) {
        if (instances) gl.drawElementsInstanced(this.mode, this.count, this.indexType, 0, instances);
        else gl.drawElements(this.mode, this.count, this.indexType, 0);
      } else {
        if (instances) gl.drawArraysInstanced(this.mode, 0, this.count, instances);
        else gl.drawArrays(this.mode, 0, this.count);
      }
    }
  }

  /* ---------- geometry ---------- */
  const Geo = {
    /* subdivided icosahedron -> {position, normal, index} */
    icosphere(detail) {
      const t = (1 + Math.sqrt(5)) / 2;
      let verts = [
        [-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],
        [0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],
        [t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]];
      let faces = [
        [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
        [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
        [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
        [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
      const norm = v => { const l = Math.hypot(v[0],v[1],v[2]); return [v[0]/l,v[1]/l,v[2]/l]; };
      verts = verts.map(norm);
      for (let d = 0; d < detail; d++) {
        const cache = new Map(), nf = [];
        const mid = (a, b) => {
          const key = a < b ? a + '_' + b : b + '_' + a;
          if (cache.has(key)) return cache.get(key);
          const va = verts[a], vb = verts[b];
          verts.push(norm([(va[0]+vb[0])/2, (va[1]+vb[1])/2, (va[2]+vb[2])/2]));
          cache.set(key, verts.length - 1); return verts.length - 1;
        };
        for (const f of faces) {
          const a = mid(f[0],f[1]), b = mid(f[1],f[2]), c = mid(f[2],f[0]);
          nf.push([f[0],a,c],[f[1],b,a],[f[2],c,b],[a,b,c]);
        }
        faces = nf;
      }
      const position = new Float32Array(verts.length * 3);
      verts.forEach((v, i) => { position.set(v, i * 3); });
      const index = new Uint16Array(faces.length * 3);
      faces.forEach((f, i) => { index.set(f, i * 3); });
      return { position, normal: position.slice(), index };
    },

    /* unique edges of an indexed mesh -> LINES index buffer */
    edges(index) {
      const set = new Set(), out = [];
      for (let i = 0; i < index.length; i += 3) {
        const a = index[i], b = index[i+1], c = index[i+2];
        [[a,b],[b,c],[c,a]].forEach(([p, q]) => {
          const k = p < q ? p + '_' + q : q + '_' + p;
          if (!set.has(k)) { set.add(k); out.push(p, q); }
        });
      }
      return new Uint16Array(out);
    },

    box(w, h, d) {
      const x = w/2, y = h/2, z = d/2;
      const p = [], n = [], idx = [];
      const face = (o, u, v, nr) => {
        const b = p.length / 3;
        p.push(o[0],o[1],o[2],
               o[0]+u[0],o[1]+u[1],o[2]+u[2],
               o[0]+u[0]+v[0],o[1]+u[1]+v[1],o[2]+u[2]+v[2],
               o[0]+v[0],o[1]+v[1],o[2]+v[2]);
        for (let i = 0; i < 4; i++) n.push(nr[0],nr[1],nr[2]);
        idx.push(b,b+1,b+2, b,b+2,b+3);
      };
      face([-x,-y, z],[w,0,0],[0,h,0],[0,0,1]);
      face([ x,-y,-z],[-w,0,0],[0,h,0],[0,0,-1]);
      face([ x,-y, z],[0,0,-d],[0,h,0],[1,0,0]);
      face([-x,-y,-z],[0,0,d],[0,h,0],[-1,0,0]);
      face([-x, y, z],[w,0,0],[0,0,-d],[0,1,0]);
      face([-x,-y,-z],[w,0,0],[0,0,d],[0,-1,0]);
      return { position: new Float32Array(p), normal: new Float32Array(n), index: new Uint16Array(idx) };
    },

    torus(R, r, seg, ring) {
      const p = [], n = [], idx = [];
      for (let i = 0; i <= seg; i++) {
        const u = i / seg * Math.PI * 2, cu = Math.cos(u), su = Math.sin(u);
        for (let j = 0; j <= ring; j++) {
          const v = j / ring * Math.PI * 2, cv = Math.cos(v), sv = Math.sin(v);
          p.push((R + r*cv)*cu, (R + r*cv)*su, r*sv);
          n.push(cv*cu, cv*su, sv);
        }
      }
      for (let i = 0; i < seg; i++) for (let j = 0; j < ring; j++) {
        const a = i*(ring+1)+j, b = a+ring+1;
        idx.push(a, b, a+1, b, b+1, a+1);
      }
      return { position: new Float32Array(p), normal: new Float32Array(n), index: new Uint16Array(idx) };
    }
  };

  /* ---------- scene runner ----------
     Handles canvas sizing, RAF loop, visibility + reduced-motion pausing. */
  class Stage {
    constructor(canvas, opts) {
      opts = opts || {};
      this.canvas = canvas;
      const gl = canvas.getContext('webgl2', {
        antialias: true, alpha: true, premultipliedAlpha: false,
        powerPreference: 'high-performance', depth: true
      });
      if (!gl) { this.ok = false; return; }
      this.gl = gl; this.ok = true;
      this.dprCap = opts.dprCap || 1.75;
      this.time = 0; this.running = false;
      this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      this._resize();
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(canvas);
      this._io = new IntersectionObserver((e) => {
        this.visible = e[0].isIntersecting;
        if (this.visible) this.start(); else this.stop();
      }, { threshold: 0.01 });
      this._io.observe(canvas);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.stop(); else if (this.visible) this.start();
      });
    }
    _resize() {
      const c = this.canvas;
      const dpr = Math.min(global.devicePixelRatio || 1, this.dprCap);
      const w = Math.max(1, Math.round(c.clientWidth * dpr));
      const h = Math.max(1, Math.round(c.clientHeight * dpr));
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
      this.w = w; this.h = h; this.aspect = w / Math.max(1, h);
    }
    start() {
      if (this.running || !this.ok) return;
      this.running = true; this._last = performance.now();
      const loop = (now) => {
        if (!this.running) return;
        let dt = (now - this._last) / 1000; this._last = now;
        if (dt > 0.05) dt = 0.05;              // clamp after tab switches
        this.time += dt;
        this.mouse.x += (this.mouse.tx - this.mouse.x) * Math.min(1, dt * 4);
        this.mouse.y += (this.mouse.ty - this.mouse.y) * Math.min(1, dt * 4);
        this.gl.viewport(0, 0, this.w, this.h);
        if (this.onFrame) this.onFrame(dt, this.time);
        this._raf = requestAnimationFrame(loop);
      };
      this._raf = requestAnimationFrame(loop);
    }
    stop() { this.running = false; if (this._raf) cancelAnimationFrame(this._raf); }
    destroy() {
      this.stop();
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
      const ext = this.gl && this.gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }
    trackPointer(el) {
      const target = el || global;
      const onMove = (e) => {
        const r = this.canvas.getBoundingClientRect();
        this.mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        this.mouse.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      };
      target.addEventListener('pointermove', onMove, { passive: true });
      this._untrack = () => target.removeEventListener('pointermove', onMove);
    }
  }

  global.GFX = { M4, Program, Mesh, Geo, Stage };
})(window);
