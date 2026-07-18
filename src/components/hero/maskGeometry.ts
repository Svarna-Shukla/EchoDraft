import * as THREE from "three";

// Grid resolution — kept low so the mask reads as a faceted, low-poly sculpture and stays cheap to render
const COLS = 10;
const ROWS = 14;
const SHELL_SHRINK = 0.9; // shrinks each shell triangle toward its centroid, opening thin cracks that reveal the backing glow

// Piecewise-linear silhouette control points (v = 0 forehead top, v = 1 chin) — narrow forehead,
// wide cheekbones, tapering hard to a pointed chin so the grid actually reads as a face
const WIDTH_KEYFRAMES: [number, number][] = [
  [0, 0.5],
  [0.18, 0.62],
  [0.32, 0.72],
  [0.5, 1.05],
  [0.72, 0.62],
  [0.88, 0.32],
  [1, 0.1],
];

function widthAt(v: number) {
  for (let i = 0; i < WIDTH_KEYFRAMES.length - 1; i++) {
    const [v0, w0] = WIDTH_KEYFRAMES[i];
    const [v1, w1] = WIDTH_KEYFRAMES[i + 1];
    if (v >= v0 && v <= v1) {
      const t = (v - v0) / (v1 - v0);
      return w0 + (w1 - w0) * t;
    }
  }
  return WIDTH_KEYFRAMES[WIDTH_KEYFRAMES.length - 1][1];
}

const EYE_CENTERS: [number, number][] = [
  [-0.4, 0.38],
  [0.4, 0.38],
];
const EYE_RADIUS_U = 0.15;
const EYE_RADIUS_V = 0.085;

// Deterministic pseudo-random hash so vertex jitter is stable across re-renders instead of reshuffling every mount
function hash(i: number, j: number) {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function isEyeCell(u: number, v: number) {
  for (const [cu, cv] of EYE_CENTERS) {
    const du = (u - cu) / EYE_RADIUS_U;
    const dv = (v - cv) / EYE_RADIUS_V;
    if (du * du + dv * dv < 1) return true;
  }
  return false;
}

// Width/depth field that sculpts the forehead, brow ridge, cheekbones, nose ridge and jaw taper from a flat grid
function profile(u: number, v: number) {
  const absU = Math.abs(u);
  const width = widthAt(v);
  let z = 0;
  z += Math.max(0, 1 - Math.abs(v - 0.12) * 4) * 0.12; // forehead bulge
  z += Math.max(0, 1 - Math.abs(v - 0.3) * 5) * 0.22; // brow ridge
  z += Math.max(0, 1 - Math.abs(v - 0.55) * 3.2) * (0.3 - absU * 0.25); // cheekbones, fading toward center
  z += Math.max(0, 1 - absU * 3) * Math.max(0, 1 - Math.abs(v - 0.5) * 1.8) * 0.28; // nose ridge
  z += Math.max(0, 1 - Math.abs(v - 0.85) * 4) * 0.14; // jaw forward tilt
  return { width, z };
}

function vertexAt(ci: number, ri: number) {
  const u = (ci / COLS) * 2 - 1;
  const v = ri / ROWS;
  const { width, z } = profile(u, v);
  const jitter = (hash(ci, ri) - 0.5) * 0.05;
  return new THREE.Vector3(u * width * 1.3, (0.5 - v) * 2.4, z + jitter);
}

// Builds the shattered-shell shell mesh, a solid emissive backing mesh, and the two eye-socket glow positions
export function buildMaskGeometries() {
  const shellPositions: number[] = [];
  const backingPositions: number[] = [];

  for (let ri = 0; ri < ROWS; ri++) {
    for (let ci = 0; ci < COLS; ci++) {
      const cu = ((ci + 0.5) / COLS) * 2 - 1;
      const cv = (ri + 0.5) / ROWS;
      if (isEyeCell(cu, cv)) continue;

      const a = vertexAt(ci, ri);
      const b = vertexAt(ci + 1, ri);
      const c = vertexAt(ci, ri + 1);
      const d = vertexAt(ci + 1, ri + 1);

      // Vertex order chosen so the computed normal faces +Z, toward the camera — otherwise the
      // front-side-only shell material gets backface-culled and only the backing layer is visible.
      for (const tri of [
        [a, c, b],
        [b, c, d],
      ]) {
        for (const p of tri) backingPositions.push(p.x, p.y, p.z - 0.05);

        const centroid = new THREE.Vector3().add(tri[0]).add(tri[1]).add(tri[2]).divideScalar(3);
        for (const p of tri) {
          const shrunk = p.clone().sub(centroid).multiplyScalar(SHELL_SHRINK).add(centroid);
          shellPositions.push(shrunk.x, shrunk.y, shrunk.z);
        }
      }
    }
  }

  const shell = new THREE.BufferGeometry();
  shell.setAttribute("position", new THREE.Float32BufferAttribute(shellPositions, 3));
  shell.computeVertexNormals();

  const backing = new THREE.BufferGeometry();
  backing.setAttribute("position", new THREE.Float32BufferAttribute(backingPositions, 3));
  backing.computeVertexNormals();

  const eyePositions = EYE_CENTERS.map(([u, v]) => {
    const { width, z } = profile(u, v);
    return new THREE.Vector3(u * width * 1.3, (0.5 - v) * 2.4, z - 0.18);
  });

  return { shell, backing, eyePositions };
}
