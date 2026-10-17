#!/usr/bin/env node
// WCAG 2 contrast checker and OKLCH lightness stepper. No dependencies; runs with `node`.
//
//   node contrast.mjs <fg> <bg> [--over <color>] [--min <ratio>]
//   node contrast.mjs --json pairs.json
//   node contrast.mjs step <color> <deltaL> [--chroma <factor>]
//
// Colors: #RGB, #RGBA, #RRGGBB, #RRGGBBAA, rgb()/rgba() (comma or space syntax),
// oklch(L C H [/ A]) with L as 0-1 or a percentage.
//
// Contrast follows the WCAG 2.2 definitions of relative luminance and contrast ratio
// (https://www.w3.org/TR/WCAG22/#dfn-relative-luminance). A translucent foreground is first
// alpha-blended over its background, because a 60%-opacity text token has no contrast of its
// own: what the reader sees is the blend. A translucent background needs --over, the opaque
// surface it sits on. Ratios print truncated to two decimals and pass/fail uses the unrounded
// value, because WCAG says not to round (4.499:1 does not meet 4.5:1).
//
// --json takes an array of { "label", "fg", "bg", "over"?, "min"? } and prints one line each.
// Exit code is 1 when any checked pair falls below its minimum (default 4.5).
//
// `step` shifts OKLCH lightness by deltaL (e.g. -0.08 darker, 0.12 lighter), optionally scales
// chroma, reduces chroma until the result fits sRGB, and prints the hex. OKLCH is perceptually
// uniform, so the same step looks like the same amount of change on a yellow and on a blue.

import { readFileSync } from 'node:fs';

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function parseColor(input) {
  const s = String(input).trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6 && h.length !== 8) throw new Error(`Bad hex color: ${input}`);
    const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
  }
  m = s.match(/^rgba?\((.*)\)$/);
  if (m) {
    const parts = m[1].replace(/\//g, ' ').split(/[\s,]+/).filter(Boolean);
    if (parts.length < 3) throw new Error(`Bad rgb color: ${input}`);
    const ch = (p) => (p.endsWith('%') ? parseFloat(p) / 100 : parseFloat(p) / 255);
    const alpha = parts[3] === undefined ? 1 : parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
    return { r: ch(parts[0]), g: ch(parts[1]), b: ch(parts[2]), a: alpha };
  }
  m = s.match(/^oklch\((.*)\)$/);
  if (m) {
    const parts = m[1].replace(/\//g, ' ').split(/[\s,]+/).filter(Boolean);
    const L = parts[0].endsWith('%') ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
    const C = parseFloat(parts[1]);
    const H = parseFloat(parts[2]) || 0;
    const alpha = parts[3] === undefined ? 1 : parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
    const rgb = oklchToSrgb(L, C, H);
    return { r: clamp01(rgb.r), g: clamp01(rgb.g), b: clamp01(rgb.b), a: alpha };
  }
  throw new Error(`Unsupported color: ${input} (use hex, rgb()/rgba() or oklch())`);
}

// Source-over compositing in gamma-encoded sRGB, which is how browsers blend by default.
function blend(fg, bg) {
  const a = fg.a;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
}

const luminance = ({ r, g, b }) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

function contrast(fgInput, bgInput, overInput) {
  let bg = parseColor(bgInput);
  if (bg.a < 1) {
    if (!overInput) throw new Error(`Background ${bgInput} is translucent; pass --over <the opaque surface it sits on>`);
    const over = parseColor(overInput);
    if (over.a < 1) throw new Error(`--over color ${overInput} must be opaque`);
    bg = blend(bg, over);
  }
  const fg = blend(parseColor(fgInput), bg);
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return { ratio: (hi + 0.05) / (lo + 0.05), fg, bg };
}

const toHex = ({ r, g, b }) => '#' + [r, g, b].map((c) => Math.round(clamp01(c) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const fmt = (ratio) => (Math.floor(ratio * 100) / 100).toFixed(2);

// OKLab / OKLCH conversions (Bjorn Ottosson's published matrices, as used by CSS Color 4).
function srgbToOklch({ r, g, b }) {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  const H = C < 1e-6 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { L, C, H };
}

function oklchToSrgb(L, C, H) {
  const A = C * Math.cos((H * Math.PI) / 180);
  const B = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  const [r, g, b] = lin.map((c) => (c < 0 ? -toGamma(-c) : toGamma(c)));
  return { r, g, b };
}

const inGamut = ({ r, g, b }) => [r, g, b].every((c) => c >= -1e-4 && c <= 1 + 1e-4);

function step(input, deltaL, chromaFactor = 1) {
  const { L, C, H } = srgbToOklch(parseColor(input));
  const L2 = clamp01(L + deltaL);
  let lo = 0;
  let hi = C * chromaFactor;
  if (!inGamut(oklchToSrgb(L2, hi, H))) {
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToSrgb(L2, mid, H))) lo = mid;
      else hi = mid;
    }
    hi = lo;
  }
  const out = oklchToSrgb(L2, hi, H);
  return { hex: toHex(out), from: { L, C, H }, to: { L: L2, C: hi, H } };
}

function flag(args, name) {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
}

function report(label, fg, bg, over, min) {
  const { ratio, fg: seen } = contrast(fg, bg, over);
  const pass = ratio >= min;
  const blended = parseColor(fg).a < 1 ? `  (fg as seen: ${toHex(seen)})` : '';
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${fmt(ratio)}:1  needs ${min}:1  ${label}${blended}`);
  return pass;
}

function main(argv) {
  const args = [...argv];
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    const lines = readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1);
    const header = lines.slice(0, lines.findIndex((l) => !l.startsWith('//')));
    console.log(header.map((l) => l.slice(3)).join('\n'));
    return 0;
  }
  if (args[0] === 'step') {
    const chroma = parseFloat(flag(args, '--chroma') ?? '1');
    const [, color, delta] = args;
    if (!color || Number.isNaN(parseFloat(delta)) || Number.isNaN(chroma)) throw new Error('Usage: step <color> <deltaL> [--chroma <factor>]');
    const r = step(color, parseFloat(delta), chroma);
    const f = (o) => `oklch(${o.L.toFixed(3)} ${o.C.toFixed(3)} ${o.H.toFixed(1)})`;
    console.log(`${r.hex}  ${f(r.from)} -> ${f(r.to)}`);
    return 0;
  }
  const json = flag(args, '--json');
  if (json) {
    const pairs = JSON.parse(readFileSync(json, 'utf8'));
    let ok = true;
    for (const p of pairs) ok = report(p.label ?? `${p.fg} on ${p.bg}`, p.fg, p.bg, p.over, p.min ?? 4.5) && ok;
    return ok ? 0 : 1;
  }
  const over = flag(args, '--over');
  const min = parseFloat(flag(args, '--min') ?? '4.5');
  const [fg, bg] = args;
  if (!fg || !bg || Number.isNaN(min)) throw new Error('Usage: <fg> <bg> [--over <color>] [--min <ratio>]  (or --help)');
  return report(`${fg} on ${bg}`, fg, bg, over, min) ? 0 : 1;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (err) {
  console.error(err.message);
  process.exitCode = 2;
}
