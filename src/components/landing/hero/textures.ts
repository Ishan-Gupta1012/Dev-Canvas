import * as THREE from 'three';

/**
 * Procedural textures for the hero prologue.
 *
 * They are painted into raw pixel buffers rather than a 2D canvas so nothing
 * touches the DOM: the generators are pure, run once in a memo, and cost a few
 * kilobytes instead of shipping image assets.
 */

type Pixel = (x: number, y: number, r: number, g: number, b: number, a?: number) => void;
type Rgb = [number, number, number];

/* Porcelain paper, graphite ink, brushed silver rules, muted lavender accent. */
const PAPER: Rgb = [252, 252, 251];
const PAPER_DEEP: Rgb = [226, 229, 233];
const INK: Rgb = [34, 37, 41];
const MUTED: Rgb = [126, 131, 138];
const ACCENT: Rgb = [124, 118, 150];
const RULE: Rgb = [215, 217, 220];
const LINE: Rgb = [168, 172, 178];
const CARD: Rgb = [237, 238, 240];

function paint(width: number, height: number, draw: (set: Pixel) => void): THREE.DataTexture {
  const data = new Uint8Array(width * height * 4);

  /* DataTexture rows run bottom-up, so the painter works in top-left space. */
  const set: Pixel = (x, y, r, g, b, a = 255) => {
    const px = Math.round(x);
    const py = Math.round(y);
    if (px < 0 || py < 0 || px >= width || py >= height) return;
    const i = ((height - 1 - py) * width + px) * 4;
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
  };

  draw(set);

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function block(set: Pixel, x0: number, y0: number, x1: number, y1: number, c: Rgb) {
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      set(x, y, c[0], c[1], c[2]);
    }
  }
}

function disc(set: Pixel, cx: number, cy: number, radius: number, c: Rgb) {
  for (let y = Math.floor(cy - radius); y <= cy + radius; y += 1) {
    for (let x = Math.floor(cx - radius); x <= cx + radius; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= radius * radius) set(x, y, c[0], c[1], c[2]);
    }
  }
}

/** A4-shaped resume sheet. */
export function makeResumeTexture(): THREE.DataTexture {
  const W = 132;
  const H = 176;

  return paint(W, H, (set) => {
    block(set, 0, 0, W, H, PAPER);

    /* Masthead */
    block(set, 14, 16, 80, 25, INK);
    block(set, 14, 30, 58, 34, MUTED);
    block(set, 14, 40, W - 14, 41, RULE);

    /* Experience */
    block(set, 14, 50, 44, 53, ACCENT);
    block(set, 14, 60, W - 14, 64, LINE);
    block(set, 14, 68, W - 14, 72, LINE);
    block(set, 14, 76, W - 46, 80, LINE);

    /* Projects */
    block(set, 14, 90, 52, 93, ACCENT);
    block(set, 14, 100, 66, 126, CARD);
    block(set, 70, 100, W - 14, 126, CARD);
    block(set, 18, 104, 62, 108, RULE);
    block(set, 74, 104, W - 18, 108, RULE);

    /* Skills */
    block(set, 14, 136, 40, 139, ACCENT);
    block(set, 14, 146, W - 14, 150, LINE);
    block(set, 14, 154, W - 42, 158, LINE);
    block(set, 14, 162, W - 14, 166, LINE);
  });
}

/** Browser window showing a published portfolio. */
export function makeSiteTexture(): THREE.DataTexture {
  const W = 180;
  const H = 112;

  return paint(W, H, (set) => {
    block(set, 0, 0, W, H, PAPER);

    /* Chrome */
    block(set, 0, 0, W, 15, PAPER_DEEP);
    disc(set, 10, 7, 2, ACCENT);
    disc(set, 19, 7, 2, RULE);
    disc(set, 28, 7, 2, RULE);
    block(set, 40, 5, 150, 10, [226, 227, 230]);

    /* Masthead */
    disc(set, 34, 43, 15, [206, 207, 212]);
    block(set, 58, 32, 132, 40, INK);
    block(set, 58, 44, 110, 47, MUTED);
    block(set, 58, 54, 80, 62, CARD);
    block(set, 84, 54, 104, 62, CARD);
    block(set, 108, 54, 130, 62, CARD);

    /* Work */
    block(set, 14, 74, 44, 77, ACCENT);
    block(set, 14, 84, 88, 104, CARD);
    block(set, 92, 84, W - 14, 104, CARD);
    block(set, 18, 88, 84, 96, PAPER_DEEP);
    block(set, 96, 88, W - 18, 96, PAPER_DEEP);
  });
}

/** Neutral falloff used for the haze behind the core. */
export function makeGlowTexture(): THREE.DataTexture {
  const S = 96;
  const centre = (S - 1) / 2;

  return paint(S, S, (set) => {
    for (let y = 0; y < S; y += 1) {
      for (let x = 0; x < S; x += 1) {
        const d = Math.min(1, Math.hypot(x - centre, y - centre) / centre);
        const falloff = (1 - d) * (1 - d);
        set(x, y, 214, 216, 220, Math.round(falloff * 255));
      }
    }
  });
}

/** Cool contact shadow that lifts a floating panel off the paper. */
export function makeShadowTexture(): THREE.DataTexture {
  const S = 96;
  const centre = (S - 1) / 2;

  return paint(S, S, (set) => {
    for (let y = 0; y < S; y += 1) {
      for (let x = 0; x < S; x += 1) {
        const nx = Math.abs(x - centre) / centre;
        const ny = Math.abs(y - centre) / centre;
        const d = Math.min(1, Math.hypot(nx * 0.86, ny));
        const falloff = Math.pow(1 - d, 2.4);
        set(x, y, 54, 57, 64, Math.round(falloff * 255));
      }
    }
  });
}

/**
 * A tiny equirectangular "studio" used as the scene environment.
 *
 * Black metal is almost entirely reflection, so without something to reflect
 * the faceted core reads as a flat silhouette. This bakes a bright ceiling,
 * a soft front-light hotspot and a dark floor — enough for the gem to pick up
 * the hard facet-to-facet contrast of lacquered metal, at zero asset cost.
 */
export function makeEnvTexture(): THREE.DataTexture {
  const W = 128;
  const H = 64;

  const texture = paint(W, H, (set) => {
    for (let y = 0; y < H; y += 1) {
      const v = y / (H - 1);
      const sky = v < 0.5;
      const k = sky ? v / 0.5 : (v - 0.5) / 0.5;

      for (let x = 0; x < W; x += 1) {
        const u = x / (W - 1);

        /* base vertical gradient */
        let r = sky ? mixNum(255, 116, k) : mixNum(92, 4, k);
        let g = sky ? mixNum(255, 119, k) : mixNum(95, 5, k);
        let b = sky ? mixNum(255, 126, k) : mixNum(104, 7, k);

        /* front hotspot */
        const du = Math.abs(u - 0.5) / 0.16;
        const dv = Math.abs(v - 0.2) / 0.14;
        const hot = Math.max(0, 1 - Math.hypot(du, dv));
        const boost = hot * hot * 0.9;
        r = r + (255 - r) * boost;
        g = g + (255 - g) * boost;
        b = b + (255 - b) * boost;

        /* cool bounce from below-left */
        const bu = Math.abs(u - 0.22) / 0.22;
        const bv = Math.abs(v - 0.62) / 0.2;
        const bounce = Math.max(0, 1 - Math.hypot(bu, bv)) * 0.16;
        r = r + (150 - r) * bounce;
        g = g + (152 - g) * bounce;
        b = b + (156 - b) * bounce;

        set(x, y, Math.round(r), Math.round(g), Math.round(b));
      }
    }
  });

  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.needsUpdate = true;
  return texture;
}

function mixNum(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
