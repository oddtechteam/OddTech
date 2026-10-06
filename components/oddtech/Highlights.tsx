"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Container } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { highlights } from "@/lib/oddtech";

/* ========================================================================== */
/*  Themes                                                                    */
/* ========================================================================== */

type ThemeKey = "predawn" | "sunrise" | "daytime" | "dusk" | "sunset" | "night";

type Theme = {
  label: string;
  deep: string; // strand colour, low / near
  light: string; // strand colour, high / far
  bg: string; // panel base
  core: string; // hot spot at the burst origin
  mid: string; // main glow
  outer: string; // wide halo
};

const THEME_ORDER: ThemeKey[] = ["predawn", "sunrise", "daytime", "dusk", "sunset", "night"];

const THEMES: Record<ThemeKey, Theme> = {
  predawn: { label: "Pre-dawn", deep: "#3a2fc4", light: "#8b7dff", bg: "#f6f5ff", core: "#4b3fd8", mid: "#a59cf3", outer: "#e3dffc" },
  sunrise: { label: "Sunrise", deep: "#d9482a", light: "#ff9d6c", bg: "#fff8f4", core: "#f26b3a", mid: "#ffb895", outer: "#ffe6d8" },
  daytime: { label: "Daytime", deep: "#1f35d6", light: "#3ba3ff", bg: "#f6f9fd", core: "#1373d1", mid: "#6aa9ef", outer: "#d3e5fc" },
  dusk: { label: "Dusk", deep: "#6327d6", light: "#c084fc", bg: "#fbf7ff", core: "#7c3aed", mid: "#c09bf8", outer: "#eee2fe" },
  sunset: { label: "Sunset", deep: "#d61f4d", light: "#ff8a3d", bg: "#fff7f4", core: "#ef4444", mid: "#fca582", outer: "#ffe1d3" },
  night: { label: "Night", deep: "#5b8cff", light: "#9be7ff", bg: "#081029", core: "#2459e8", mid: "#15296e", outer: "#0c1741" },
};

/* ========================================================================== */
/*  Shapes — every strand is a K-point polyline plus D dots. Each stat has    */
/*  its own shape; the same strands morph between them.                      */
/*  Design space: origin = bottom-centre, 1 unit = panel height, y up.        */
/* ========================================================================== */

const TAU = Math.PI * 2;
const K = 24; // points per strand
const D = 3; // dots per strand
const RAND = 6; // random seeds per strand

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const fract = (v: number) => v - Math.floor(v);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Scratch = {
  x: Float32Array; y: Float32Array; z: Float32Array; a: Float32Array; t: Float32Array;
  px: Float32Array; py: Float32Array; pz: Float32Array; pa: Float32Array; pt: Float32Array; ps: Float32Array;
};

const makeScratch = (): Scratch => ({
  x: new Float32Array(K), y: new Float32Array(K), z: new Float32Array(K), a: new Float32Array(K), t: new Float32Array(K),
  px: new Float32Array(D), py: new Float32Array(D), pz: new Float32Array(D), pa: new Float32Array(D), pt: new Float32Array(D), ps: new Float32Array(D),
});

function setDot(s: Scratch, d: number, x: number, y: number, z: number, a: number, tone: number, size: number) {
  s.px[d] = x; s.py[d] = y; s.pz[d] = z; s.pa[d] = a; s.pt[d] = tone; s.ps[d] = size;
}

/* 1 — Radial burst from the bottom-centre */
function shapeBurst(i: number, n: number, r: Float32Array, o: number, time: number, s: Scratch) {
  const u = clamp01((i + 0.5 + (r[o] - 0.5) * 0.9) / n);
  const th = Math.PI * (0.97 - 0.94 * u);
  const sinT = Math.sin(th);
  const len =
    (0.36 + 0.56 * Math.pow(r[o + 1], 0.85)) * (0.8 + 0.2 * sinT) * (1 + 0.05 * Math.sin(time * 0.7 + r[o + 2] * TAU));
  const ang = th + 0.012 * Math.sin(time * 0.35 + r[o + 3] * TAU);
  const ex = Math.cos(ang) * len;
  const ey = Math.sin(ang) * len * 0.9;
  const ez = (r[o + 4] - 0.5) * 0.35 * len;
  const tone = clamp01(0.08 + 0.92 * sinT * (0.75 + 0.25 * r[o + 5]));

  for (let k = 0; k < K; k++) {
    const t = k / (K - 1);
    s.x[k] = ex * t; s.y[k] = ey * t; s.z[k] = ez * t;
    s.a[k] = 0.24 + 0.26 * (1 - t);
    s.t[k] = 0.45 + (tone - 0.45) * t;
  }
  const tw = 0.82 + 0.18 * Math.sin(time * 1.4 + r[o + 5] * TAU);
  setDot(s, 0, ex, ey, ez, 0.95 * tw, tone, 4.2 + 2.6 * r[o + 2]);
  const t1 = 0.3 + 0.6 * r[o + 3];
  setDot(s, 1, ex * t1, ey * t1, ez * t1, 0.85 * tw, 0.45 + (tone - 0.45) * t1, 3 + 1.6 * r[o + 4]);
  const t2 = 0.5 + 0.45 * r[o + 4];
  setDot(s, 2, ex * t2, ey * t2, ez * t2, r[o + 5] > 0.55 ? 0.7 * tw : 0, 0.45 + (tone - 0.45) * t2, 2.4);
}

/* 2 — Globe: meridians radiating from a tilted pole, slowly spinning */
const norm3 = (x: number, y: number, z: number): [number, number, number] => {
  const l = Math.hypot(x, y, z);
  return [x / l, y / l, z / l];
};
const [GPx, GPy, GPz] = norm3(-0.5, 0.62, 0.6);
const [GUx, GUy, GUz] = norm3(-GPy, GPx, 0);
const GVx = GPy * GUz - GPz * GUy;
const GVy = GPz * GUx - GPx * GUz;
const GVz = GPx * GUy - GPy * GUx;
const G_CX = 0, G_CY = -0.12, G_CZ = -0.35, G_R = 0.95;

function shapeGlobe(i: number, n: number, r: Float32Array, o: number, time: number, s: Scratch) {
  const phi = (TAU * (i + 0.5 * r[o])) / n + time * 0.05;
  const c = Math.cos(phi), sn = Math.sin(phi);
  const ex = GUx * c + GVx * sn, ey = GUy * c + GVy * sn, ez = GUz * c + GVz * sn;

  for (let k = 0; k < K; k++) {
    const sa = (Math.PI * k) / (K - 1);
    const cs = Math.cos(sa), ss = Math.sin(sa);
    const nx = cs * GPx + ss * ex, ny = cs * GPy + ss * ey, nz = cs * GPz + ss * ez;
    s.x[k] = G_CX + G_R * nx; s.y[k] = G_CY + G_R * ny; s.z[k] = G_CZ + G_R * nz;
    s.a[k] = 0.32 * smoothstep(-0.03, 0.14, nz);
    s.t[k] = clamp01(0.3 + 0.45 * (ny * 0.5 + 0.5) + 0.25 * (1 - nz));
  }
  for (let d = 0; d < D; d++) {
    const sa = Math.PI * fract(r[o + 1 + d] + time * (0.025 + 0.015 * d));
    const cs = Math.cos(sa), ss = Math.sin(sa);
    const nx = cs * GPx + ss * ex, ny = cs * GPy + ss * ey, nz = cs * GPz + ss * ez;
    const vis = smoothstep(-0.04, 0.06, nz);
    const on = d < 2 || r[o + 5] > 0.5 ? 1 : 0;
    setDot(
      s, d, G_CX + G_R * nx, G_CY + G_R * ny, G_CZ + G_R * nz, 0.9 * vis * on,
      clamp01(0.25 + 0.5 * (ny * 0.5 + 0.5) + 0.25 * (1 - nz)), 2.6 + 2.4 * (nz * 0.5 + 0.5),
    );
  }
}

/* 3 — Helix ribbon of pins dropping to the floor, flowing along its path */
function shapeHelix(i: number, n: number, _r: Float32Array, _o: number, time: number, s: Scratch) {
  const f = fract(i / n + time * 0.012);
  const h = f * 3 * Math.PI;
  const a = h - Math.PI / 2;
  const ca = Math.cos(a), sa = Math.sin(a);
  const R = 0.9 * (1 - (0.08 * h) / Math.PI);
  const hx = R * sa;
  const hy = 0.34 + 0.06 * h - 0.045 * ca;
  const hz = 0.3 * ca;
  // 1 = front of the first loop; later loops recede and lighten
  const depth = ((ca + 1) / 2) * (1 - 0.8 * smoothstep(0.5, 0.8, f));
  const fade = smoothstep(0, 0.05, f) * (1 - smoothstep(0.8, 1, f));
  const tone = clamp01(0.08 + 0.6 * (1 - depth) + 0.32 * f);

  for (let k = 0; k < K; k++) {
    const t = k / (K - 1);
    s.x[k] = hx; s.y[k] = -0.08 + (hy + 0.08) * t; s.z[k] = hz;
    s.a[k] = fade * (0.1 + 0.42 * depth) * (0.55 + 0.45 * (1 - t));
    s.t[k] = tone;
  }
  setDot(s, 0, hx, hy, hz, fade * (0.5 + 0.5 * depth), tone, 2.4 + 3.8 * depth);
  setDot(s, 1, hx, hy, hz, 0, tone, 2);
  setDot(s, 2, hx, hy, hz, 0, tone, 2);
}

/* 4 — Funnel: two columns of nodes whose lines pinch into one point */
function shapeFunnel(i: number, n: number, r: Float32Array, o: number, time: number, s: Scratch) {
  const half = n / 2;
  const left = i < half;
  const j = left ? i / half : (i - half) / half;
  const xd = (left ? -0.88 : 0.87) + (r[o] - 0.5) * 0.012;
  const yd = left ? 0.94 - j * 1.02 : 0.74 - j * 0.78;
  const yc = 0.31;
  const partial = r[o + 1] < 0.32;
  const L = partial ? 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(time * 0.5 + r[o + 2] * TAU)) : 1;
  const tone = clamp01((yd + 0.05) / 1.0);
  const on = Math.floor(j * half) % 2 === 0 ? 1 : 0; // every other strand, like the reference density

  for (let k = 0; k < K; k++) {
    const t = k / (K - 1); // 0 = pinch point, 1 = node
    const tv = left ? Math.max(t, 1 - L) : Math.min(t, L);
    s.x[k] = xd * tv;
    s.y[k] = yc + (yd - yc) * smoothstep(0, 0.8, tv);
    s.z[k] = 0;
    s.a[k] = 0.46 * on;
    s.t[k] = tone;
  }
  setDot(s, 0, xd, yd, 0, 0.95 * on, tone, 4.4 + 1.6 * r[o + 3]);
  setDot(s, 1, xd, yd, 0, 0, tone, 2);
  setDot(s, 2, xd, yd, 0, 0, tone, 2);
}

function runShape(shape: number, i: number, n: number, r: Float32Array, o: number, time: number, s: Scratch) {
  switch (shape) {
    case 1: return shapeGlobe(i, n, r, o, time, s);
    case 2: return shapeHelix(i, n, r, o, time, s);
    case 3: return shapeFunnel(i, n, r, o, time, s);
    default: return shapeBurst(i, n, r, o, time, s);
  }
}

/* ========================================================================== */
/*  Three.js engine                                                           */
/* ========================================================================== */

type ThreeModule = typeof import("three");
type Ref<T> = { current: T };
type VizState = { shape: number; theme: ThemeKey };

const CAM_Z = 10;
const FOV = 14;
const MORPH_SECONDS = 1.7;
const STATIC_TIME = 4;
const HOVER_RADIUS = 0.14; // design units (1 = viz height)
const HOVER_PUSH = 0.022; // how far dots/lines are pushed away from the cursor

const LINE_VERT = /* glsl */ `
  attribute float aAlpha;
  attribute float aTone;
  varying float vAlpha;
  varying float vTone;
  void main() {
    vAlpha = aAlpha;
    vTone = aTone;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const LINE_FRAG = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uLight;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vTone;
  void main() {
    gl_FragColor = vec4(mix(uDeep, uLight, vTone), clamp(vAlpha, 0.0, 1.0) * uOpacity);
  }
`;
const POINT_VERT = /* glsl */ `
  uniform float uPixelRatio;
  uniform float uSizeScale;
  attribute float aAlpha;
  attribute float aTone;
  attribute float aSize;
  varying float vAlpha;
  varying float vTone;
  void main() {
    vAlpha = aAlpha;
    vTone = aTone;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uSizeScale * uPixelRatio * (${CAM_Z.toFixed(1)} / max(-mv.z, 0.1));
  }
`;
const POINT_FRAG = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uLight;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vTone;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.36, d);
    vec3 col = mix(uDeep, uLight, vTone * 0.85);
    gl_FragColor = vec4(col, edge * clamp(vAlpha, 0.0, 1.0) * uOpacity);
  }
`;

function hexToVec3(THREE: ThreeModule, hex: string) {
  const v = parseInt(hex.replace("#", ""), 16);
  return new THREE.Vector3(((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255);
}

function createRenderer(THREE: ThreeModule) {
  try {
    return new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
}

function createEngine(
  THREE: ThreeModule,
  host: HTMLDivElement,
  track: HTMLElement,
  stateRef: Ref<VizState>,
  kickRef: Ref<() => void>,
): () => void {
  const created = createRenderer(THREE);
  if (!created) return () => {};
  const renderer = created;

  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  Object.assign(canvas.style, { display: "block", width: "100%", height: "100%" });
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAM_Z);
  const group = new THREE.Group();
  scene.add(group);

  /* ---- buffers ---- */
  const n = host.clientWidth < 640 ? 150 : 240;
  const rand = new Float32Array(n * RAND);
  for (let i = 0; i < rand.length; i++) rand[i] = Math.random();

  const vCount = n * K;
  const dCount = n * D;
  const lPos = new Float32Array(vCount * 3), lAlpha = new Float32Array(vCount), lTone = new Float32Array(vCount);
  const pPos = new Float32Array(dCount * 3), pAlpha = new Float32Array(dCount), pTone = new Float32Array(dCount), pSize = new Float32Array(dCount);
  // snapshots of what was on screen when a morph started
  const sPos = new Float32Array(vCount * 3), sAlpha = new Float32Array(vCount), sTone = new Float32Array(vCount);
  const qPos = new Float32Array(dCount * 3), qAlpha = new Float32Array(dCount), qTone = new Float32Array(dCount), qSize = new Float32Array(dCount);

  const index = new Uint16Array(n * (K - 1) * 2);
  let w = 0;
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < K - 1; k++) {
      index[w++] = i * K + k;
      index[w++] = i * K + k + 1;
    }
  }

  const dyn = (arr: Float32Array, size: number) => new THREE.BufferAttribute(arr, size).setUsage(THREE.DynamicDrawUsage);
  const lineGeo = new THREE.BufferGeometry();
  const lPosAttr = dyn(lPos, 3), lAlphaAttr = dyn(lAlpha, 1), lToneAttr = dyn(lTone, 1);
  lineGeo.setAttribute("position", lPosAttr);
  lineGeo.setAttribute("aAlpha", lAlphaAttr);
  lineGeo.setAttribute("aTone", lToneAttr);
  lineGeo.setIndex(new THREE.BufferAttribute(index, 1));

  const pointGeo = new THREE.BufferGeometry();
  const pPosAttr = dyn(pPos, 3), pAlphaAttr = dyn(pAlpha, 1), pToneAttr = dyn(pTone, 1), pSizeAttr = dyn(pSize, 1);
  pointGeo.setAttribute("position", pPosAttr);
  pointGeo.setAttribute("aAlpha", pAlphaAttr);
  pointGeo.setAttribute("aTone", pToneAttr);
  pointGeo.setAttribute("aSize", pSizeAttr);

  const startTheme = THEMES[stateRef.current.theme];
  const uniforms = {
    uDeep: { value: hexToVec3(THREE, startTheme.deep) },
    uLight: { value: hexToVec3(THREE, startTheme.light) },
    uOpacity: { value: 0 },
    uPixelRatio: { value: 1 },
    uSizeScale: { value: 1 },
  };
  const matOpts = { uniforms, transparent: true, depthWrite: false, depthTest: false };
  const lineMat = new THREE.ShaderMaterial({ ...matOpts, vertexShader: LINE_VERT, fragmentShader: LINE_FRAG });
  const pointMat = new THREE.ShaderMaterial({ ...matOpts, vertexShader: POINT_VERT, fragmentShader: POINT_FRAG });

  const lines = new THREE.LineSegments(lineGeo, lineMat);
  const points = new THREE.Points(pointGeo, pointMat);
  lines.frustumCulled = false;
  points.frustumCulled = false;
  points.renderOrder = 1;
  group.add(lines, points);

  /* ---- per-frame geometry ---- */
  const sc = makeScratch();
  let curShape = -1;
  let morphStart = -100;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = mq.matches;

  const compute = (time: number) => {
    const target = ((stateRef.current.shape % 4) + 4) % 4;
    if (target !== curShape) {
      if (curShape >= 0 && !reduced) {
        sPos.set(lPos); sAlpha.set(lAlpha); sTone.set(lTone);
        qPos.set(pPos); qAlpha.set(pAlpha); qTone.set(pTone); qSize.set(pSize);
        morphStart = time;
      } else {
        morphStart = -100;
      }
      curShape = target;
    }
    const prog = clamp01((time - morphStart) / MORPH_SECONDS);
    const morphing = prog < 1;

    for (let i = 0; i < n; i++) {
      const o = i * RAND;
      runShape(curShape, i, n, rand, o, time, sc);
      const delay = 0.35 * (0.6 * (i / n) + 0.4 * rand[o + 5]);
      const e = morphing ? easeInOut(clamp01((prog - delay) / 0.65)) : 1;

      for (let k = 0; k < K; k++) {
        const v = i * K + k, v3 = v * 3;
        if (e >= 1) {
          lPos[v3] = sc.x[k]; lPos[v3 + 1] = sc.y[k]; lPos[v3 + 2] = sc.z[k];
          lAlpha[v] = sc.a[k]; lTone[v] = sc.t[k];
        } else {
          lPos[v3] = sPos[v3] + (sc.x[k] - sPos[v3]) * e;
          lPos[v3 + 1] = sPos[v3 + 1] + (sc.y[k] - sPos[v3 + 1]) * e;
          lPos[v3 + 2] = sPos[v3 + 2] + (sc.z[k] - sPos[v3 + 2]) * e;
          lAlpha[v] = sAlpha[v] + (sc.a[k] - sAlpha[v]) * e;
          lTone[v] = sTone[v] + (sc.t[k] - sTone[v]) * e;
        }
      }
      for (let d = 0; d < D; d++) {
        const v = i * D + d, v3 = v * 3;
        if (e >= 1) {
          pPos[v3] = sc.px[d]; pPos[v3 + 1] = sc.py[d]; pPos[v3 + 2] = sc.pz[d];
          pAlpha[v] = sc.pa[d]; pTone[v] = sc.pt[d]; pSize[v] = sc.ps[d];
        } else {
          pPos[v3] = qPos[v3] + (sc.px[d] - qPos[v3]) * e;
          pPos[v3 + 1] = qPos[v3 + 1] + (sc.py[d] - qPos[v3 + 1]) * e;
          pPos[v3 + 2] = qPos[v3 + 2] + (sc.pz[d] - qPos[v3 + 2]) * e;
          pAlpha[v] = qAlpha[v] + (sc.pa[d] - qAlpha[v]) * e;
          pTone[v] = qTone[v] + (sc.pt[d] - qTone[v]) * e;
          pSize[v] = qSize[v] + (sc.ps[d] - qSize[v]) * e;
        }
      }
    }
    lPosAttr.needsUpdate = lAlphaAttr.needsUpdate = lToneAttr.needsUpdate = true;
    pPosAttr.needsUpdate = pAlphaAttr.needsUpdate = pToneAttr.needsUpdate = pSizeAttr.needsUpdate = true;
  };

  /* ---- layout ---- */
  const resize = () => {
    const wPx = Math.max(1, host.clientWidth);
    const hPx = Math.max(1, host.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, wPx < 768 ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(wPx, hPx, false);
    camera.aspect = wPx / hPx;
    camera.updateProjectionMatrix();

    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAM_Z;
    const visW = visH * camera.aspect;
    // Height drives the vertical scale. On narrow screens the shapes are squeezed
    // horizontally rather than shrunk, so they still fill the panel on phones.
    const sy = visH * (camera.aspect < 1.8 ? 0.92 : 0.98);
    const sx = Math.min(sy, visW / 2.05);
    group.scale.set(sx, sy, sx);
    group.position.set(0, -visH / 2 + (visH - sy) * 0.4, 0);
    uniforms.uPixelRatio.value = dpr;
    uniforms.uSizeScale.value = Math.min(1, Math.max(0.72, sx / sy));
    if (!running) renderStill();
  };

  /* ---- pointer: parallax + hover push ---- */
  const parallax = { x: 0, y: 0 };
  const ndc = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  const pointerTarget = new THREE.Vector2(0, -10);
  const pointerLocal = new THREE.Vector2(0, -10);
  let pointerInside = false;
  let pointerStrength = 0;

  const onPointerMove = (e: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerInside = nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1;
    ndc.set(nx, ny);
    parallax.x = Math.max(-1, Math.min(1, nx));
    parallax.y = Math.max(-1, Math.min(1, ny));
  };
  const onPointerLeave = () => {
    pointerInside = false;
    parallax.x = 0;
    parallax.y = 0;
  };

  // Pushes nearby line vertices and dots away from the cursor; dots also swell and jiggle.
  const applyPointer = (time: number) => {
    const st = pointerStrength;
    if (st < 0.002) return;
    const px = pointerLocal.x, py = pointerLocal.y;
    const r2 = HOVER_RADIUS * HOVER_RADIUS;
    const cutoff = r2 * 9;

    for (let v = 0; v < vCount; v++) {
      const v3 = v * 3;
      const dx = lPos[v3] - px, dy = lPos[v3 + 1] - py;
      const d2 = dx * dx + dy * dy;
      if (d2 > cutoff) continue;
      const f = Math.exp(-d2 / r2) * st;
      const len = Math.sqrt(d2) + 1e-4;
      lPos[v3] += (dx / len) * f * HOVER_PUSH;
      lPos[v3 + 1] += (dy / len) * f * HOVER_PUSH;
      lAlpha[v] = Math.min(1, lAlpha[v] * (1 + 0.6 * f));
    }
    for (let v = 0; v < dCount; v++) {
      const v3 = v * 3;
      const dx = pPos[v3] - px, dy = pPos[v3 + 1] - py;
      const d2 = dx * dx + dy * dy;
      if (d2 > cutoff) continue;
      const f = Math.exp(-d2 / r2) * st;
      const len = Math.sqrt(d2) + 1e-4;
      const wobble = 0.0025 * f;
      pPos[v3] += (dx / len) * f * HOVER_PUSH * 1.25 + Math.sin(time * 7 + v * 1.7) * wobble;
      pPos[v3 + 1] += (dy / len) * f * HOVER_PUSH * 1.25 + Math.cos(time * 6 + v * 2.3) * wobble;
      pSize[v] *= 1 + 0.5 * f;
      if (pAlpha[v] > 0) pAlpha[v] = Math.min(1, pAlpha[v] + 0.25 * f);
    }
  };
  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") onPointerLeave();
  };
  track.addEventListener("pointermove", onPointerMove, { passive: true });
  track.addEventListener("pointerdown", onPointerMove, { passive: true });
  track.addEventListener("pointerleave", onPointerLeave);
  track.addEventListener("pointerup", onPointerUp);
  track.addEventListener("pointercancel", onPointerUp);

  /* ---- loop ---- */
  let inView = true;
  let running = false;
  let raf = 0;
  let last = 0;
  let elapsed = 0;
  const tmpDeep = new THREE.Vector3();
  const tmpLight = new THREE.Vector3();

  const themeColors = Object.fromEntries(
    THEME_ORDER.map((key) => [key, { deep: hexToVec3(THREE, THEMES[key].deep), light: hexToVec3(THREE, THEMES[key].light) }]),
  ) as Record<ThemeKey, { deep: InstanceType<ThreeModule["Vector3"]>; light: InstanceType<ThreeModule["Vector3"]> }>;
  const themeTargets = () => {
    const c = themeColors[stateRef.current.theme];
    tmpDeep.copy(c.deep);
    tmpLight.copy(c.light);
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;
    const k = (rate: number) => 1 - Math.exp(-dt * rate);

    uniforms.uOpacity.value += (1 - uniforms.uOpacity.value) * k(1.8);
    themeTargets();
    uniforms.uDeep.value.lerp(tmpDeep, k(3));
    uniforms.uLight.value.lerp(tmpLight, k(3));
    group.rotation.y += (parallax.x * 0.08 - group.rotation.y) * k(3);
    group.rotation.x += (-parallax.y * 0.04 - group.rotation.x) * k(3);
    group.updateMatrixWorld();

    if (pointerInside) {
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        group.worldToLocal(hit);
        pointerTarget.set(hit.x, hit.y);
        if (pointerStrength < 0.01) pointerLocal.copy(pointerTarget); // no sweep-in from far away
      }
    }
    pointerLocal.lerp(pointerTarget, k(12));
    pointerStrength += ((pointerInside ? 1 : 0) - pointerStrength) * k(pointerInside ? 6 : 3);

    compute(elapsed);
    applyPointer(elapsed);
    renderer.render(scene, camera);
  };

  function renderStill() {
    themeTargets();
    uniforms.uDeep.value.copy(tmpDeep);
    uniforms.uLight.value.copy(tmpLight);
    if (reduced) {
      uniforms.uOpacity.value = 1;
      group.rotation.set(0, 0, 0);
      compute(STATIC_TIME);
    } else {
      compute(elapsed);
    }
    renderer.render(scene, camera);
  }

  const syncLoop = () => {
    const shouldRun = inView && !document.hidden && !reduced;
    if (shouldRun && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
    if (!running) renderStill();
  };

  kickRef.current = () => {
    if (!running) renderStill();
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      inView = entry ? entry.isIntersecting : true;
      syncLoop();
    },
    { rootMargin: "120px" },
  );
  io.observe(host);
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const onVisibility = () => syncLoop();
  document.addEventListener("visibilitychange", onVisibility);
  const onMotion = (e: MediaQueryListEvent) => {
    reduced = e.matches;
    syncLoop();
  };
  mq.addEventListener("change", onMotion);

  resize();
  syncLoop();

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    mq.removeEventListener("change", onMotion);
    track.removeEventListener("pointermove", onPointerMove);
    track.removeEventListener("pointerdown", onPointerMove);
    track.removeEventListener("pointerleave", onPointerLeave);
    track.removeEventListener("pointerup", onPointerUp);
    track.removeEventListener("pointercancel", onPointerUp);
    kickRef.current = () => {};
    group.remove(lines, points);
    lineGeo.dispose();
    pointGeo.dispose();
    lineMat.dispose();
    pointMat.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
}

/* ========================================================================== */
/*  React pieces                                                              */
/* ========================================================================== */

function DataViz({ shape, theme, trackRef }: { shape: number; theme: ThemeKey; trackRef: { current: HTMLElement | null } }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<VizState>({ shape, theme });
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    stateRef.current = { shape, theme };
    kickRef.current();
  }, [shape, theme]);

  useEffect(() => {
    const host = hostRef.current;
    const track = trackRef.current;
    if (!host || !track) return;
    let disposed = false;
    let dispose: (() => void) | null = null;
    import("three")
      .then((THREE) => {
        if (!disposed) dispose = createEngine(THREE, host, track, stateRef, kickRef);
      })
      .catch(() => {});
    return () => {
      disposed = true;
      dispose?.();
    };
  }, [trackRef]);

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />;
}

// The halo fades out before it reaches the panel's side and top edges, and light themes
// have no solid fill, so the panel surface shows through and nothing ends in a hard edge.
const glowFor = (t: Theme, solid: boolean) =>
  `radial-gradient(ellipse 20% 32% at 50% 100%, ${t.core} 0%, ${t.core}00 100%),` +
  `radial-gradient(ellipse 47% 92% at 50% 100%, ${t.mid} 0%, ${t.outer} 50%, ${t.outer}00 100%)` +
  (solid ? `, ${t.bg}` : "");

function Rays({ angles }: { angles: number[] }) {
  return (
    <>
      {angles.map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={12 + Math.cos(a) * 6.8}
            y1={12 - Math.sin(a) * 6.8}
            x2={12 + Math.cos(a) * 9}
            y2={12 - Math.sin(a) * 9}
          />
        );
      })}
    </>
  );
}

function ThemeIcon({ kind }: { kind: ThemeKey }) {
  const all = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      {kind === "predawn" && (
        <>
          <path d="M4 15a8 8 0 0 1 16 0" />
          <path d="M8 15a4 4 0 0 1 8 0" />
        </>
      )}
      {kind === "sunrise" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <Rays angles={[0, 45, 90, 135, 180]} />
          <path d="M5 20h14" />
        </>
      )}
      {kind === "daytime" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <Rays angles={all} />
        </>
      )}
      {kind === "dusk" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <Rays angles={[0, 45, 90, 135, 180, 270]} />
        </>
      )}
      {kind === "sunset" && (
        <>
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1.6" />
          <Rays angles={[0, 45, 90, 135, 180]} />
        </>
      )}
      {kind === "night" && <path d="M19.5 14.5A7.5 7.5 0 1 1 9.5 4.5a6 6 0 0 0 10 10z" />}
    </svg>
  );
}

function ThemeMenu({ theme, onChange }: { theme: ThemeKey; onChange: (t: ThemeKey) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="absolute right-2.5 top-2.5 z-20 md:right-5 md:top-5">
      <button
        type="button"
        aria-label={`Visual theme: ${THEMES[theme].label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d6dbfb] bg-white/90 text-[#3d3fd9] shadow-sm backdrop-blur transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff]/50"
      >
        <ThemeIcon kind={theme} />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Visual theme"
          className="absolute right-0 mt-2 w-36 max-w-[calc(100vw-3rem)] rounded-lg border border-[#dfe3fb] bg-white/95 p-1 shadow-[0_8px_24px_rgba(30,40,120,0.12)] backdrop-blur"
        >
          {THEME_ORDER.map((k) => (
            <button
              key={k}
              type="button"
              role="menuitemradio"
              aria-checked={k === theme}
              onClick={() => {
                onChange(k);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-[#3d3fd9] transition-colors hover:bg-[#f0f1ff] ${
                k === theme ? "bg-[#e6e7fb] font-medium" : ""
              }`}
            >
              <ThemeIcon kind={k} />
              {THEMES[k].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(MOTION_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  );
}

const AUTOPLAY_MS = 6000;
const ACCENT = "linear-gradient(90deg, rgba(99,91,255,0) 0%, rgba(99,91,255,0.9) 50%, rgba(99,91,255,0) 100%)";

/* ========================================================================== */
/*  Highlights                                                                */
/* ========================================================================== */

// Stat strip shown just below the hero, driving a live morphing data-viz.
export default function Highlights() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState<ThemeKey>("daytime");
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  const count = highlights.length;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry ? entry.isIntersecting : false), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-advance through the stats, like the reference.
  useEffect(() => {
    if (paused || reduced || !inView || count < 2) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % count), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, reduced, inView, count]);

  const onStatKey = (e: ReactKeyboardEvent<HTMLDivElement>, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive(i);
    }
  };

  return (
    <section ref={sectionRef} className="relative z-10 bg-paper pb-12 pt-16 md:pb-16 md:pt-20">
      <Container>
        <Reveal>
          <div className="relative">
          {/* Soft contact shadow under the panel, tinted by the active theme */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[6%] -bottom-8 h-20 rounded-[100%] blur-2xl transition-[background] duration-700"
            style={{ background: `radial-gradient(ellipse at center, ${THEMES[theme].core}4d 0%, ${THEMES[theme].core}00 70%)` }}
          />
          <div
            className="relative overflow-hidden rounded-2xl bg-surface sm:rounded-3xl"
            style={{
              boxShadow:
                "0 40px 70px -40px rgba(14, 36, 104, 0.45), 0 22px 40px -24px rgba(14, 36, 104, 0.28), 0 4px 10px -6px rgba(0, 0, 0, 0.08)",
            }}
          >
            <dl
              className="relative grid grid-cols-2 md:grid-cols-4"
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setPaused(true);
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === "mouse") setPaused(false);
              }}
              onFocus={(e) => {
                if ((e.target as HTMLElement).matches?.(":focus-visible")) setPaused(true);
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
              }}
            >
              {highlights.map((h, i) => {
                const on = i === active;
                return (
                  <div
                    key={h.label}
                    role="button"
                    tabIndex={0}
                    aria-pressed={on}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") setActive(i);
                    }}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => onStatKey(e, i)}
                    className="relative cursor-pointer px-2 py-6 text-center [-webkit-tap-highlight-color:transparent] sm:px-4 sm:py-8 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#635bff]/40 md:px-6 md:py-10"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-[6%] top-0 h-px origin-center transition-all duration-500 ease-out"
                      style={{ background: ACCENT, opacity: on ? 1 : 0, transform: `scaleX(${on ? 1 : 0.3})` }}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-[6%] bottom-0 h-px origin-center transition-all duration-500 ease-out"
                      style={{ background: ACCENT, opacity: on ? 1 : 0, transform: `scaleX(${on ? 1 : 0.3})` }}
                    />
                    <dt className="sr-only">{h.label}</dt>
                    <dd
                      className={`whitespace-nowrap font-display text-[clamp(1.75rem,8vw,2.25rem)] font-light leading-none tracking-tight transition-colors duration-500 sm:text-4xl md:text-5xl lg:text-[3.4rem] ${
                        on ? "text-aurora" : "text-muted opacity-80"
                      }`}
                    >
                      {h.value}
                    </dd>
                    <dd className={`mx-auto mt-2 max-w-[16rem] text-xs leading-snug transition-colors duration-500 sm:text-sm md:text-base ${on ? "" : "text-muted"}`}>
                      {h.label}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <div className="relative h-[280px] overflow-hidden sm:h-[360px] md:h-[440px] lg:h-[480px]">
              {/* Divider between stats and viz, fading out at both ends */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(120,134,170,0) 0%, rgba(120,134,170,0.22) 15%, rgba(120,134,170,0.22) 85%, rgba(120,134,170,0) 100%)",
                }}
              />
              {THEME_ORDER.map((k) => (
                <div
                  key={k}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 transition-opacity duration-700"
                  style={{ background: glowFor(THEMES[k], k === "night"), opacity: k === theme ? 1 : 0 }}
                />
              ))}
              <DataViz shape={active % 4} theme={theme} trackRef={sectionRef} />
              <ThemeMenu theme={theme} onChange={setTheme} />
            </div>

            {/* Hairline border that dissolves toward the bottom, so the glow blends into the page */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-30 rounded-2xl border border-line sm:rounded-3xl"
              style={{
                maskImage: "linear-gradient(to bottom, #000 0%, #000 45%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 45%, transparent 100%)",
              }}
            />
          </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}