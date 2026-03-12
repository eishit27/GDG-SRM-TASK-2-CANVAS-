import {
  CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SIZE, SNAP_THRESHOLD, ELEMENT_DEFAULTS,
} from "../constants";

let nextId = 1;

export function createElement(type) {
  const d = ELEMENT_DEFAULTS[type];
  return {
    id: nextId++, type,
    x: Math.round(CANVAS_WIDTH  / 2 - d.width  / 2 + (Math.random() - 0.5) * 140),
    y: Math.round(CANVAS_HEIGHT / 2 - d.height / 2 + (Math.random() - 0.5) * 100),
    ...d,
  };
}

// ── Snap helpers ────────────────────────────────────────────────────────────
export function snapToGrid(val) {
  return Math.round(val / GRID_SIZE) * GRID_SIZE;
}

export function getSnapLines(elements, movingId) {
  const lines = { x: [], y: [] };
  for (const el of elements) {
    if (el.id === movingId) continue;
    lines.x.push(el.x, el.x + el.width / 2, el.x + el.width);
    lines.y.push(el.y, el.y + el.height / 2, el.y + el.height);
  }
  lines.x.push(0, CANVAS_WIDTH / 2, CANVAS_WIDTH);
  lines.y.push(0, CANVAS_HEIGHT / 2, CANVAS_HEIGHT);
  return lines;
}

export function snapValue(val, candidates, threshold) {
  let best = null, bestDist = threshold;
  for (const c of candidates) {
    const d = Math.abs(val - c);
    if (d < bestDist) { bestDist = d; best = c; }
  }
  return best !== null ? { snapped: best, guide: best } : { snapped: val, guide: null };
}

export function applySnap(el, snapLines, snapGrid, snapAlignment) {
  let x = el.x, y = el.y;
  const guides = [];

  if (snapGrid) {
    x = snapToGrid(el.x);
    y = snapToGrid(el.y);
  }

  if (snapAlignment) {
    const cx = el.x + el.width / 2, rx = el.x + el.width;
    const cy = el.y + el.height / 2, by = el.y + el.height;

    const lSnap  = snapValue(el.x, snapLines.x, SNAP_THRESHOLD);
    const cxSnap = snapValue(cx,   snapLines.x, SNAP_THRESHOLD);
    const rxSnap = snapValue(rx,   snapLines.x, SNAP_THRESHOLD);
    const tSnap  = snapValue(el.y, snapLines.y, SNAP_THRESHOLD);
    const cySnap = snapValue(cy,   snapLines.y, SNAP_THRESHOLD);
    const bySnap = snapValue(by,   snapLines.y, SNAP_THRESHOLD);

    let bestX = null;
    for (const s of [lSnap, cxSnap, rxSnap]) {
      if (s.guide !== null) {
        if (!bestX || Math.abs(el.x - s.snapped) < Math.abs(el.x - bestX.val)) {
          let offset = 0;
          if (s === cxSnap) offset = el.width / 2;
          if (s === rxSnap) offset = el.width;
          bestX = { val: s.snapped - offset, guide: s.guide };
        }
      }
    }
    if (bestX) { x = Math.round(bestX.val); guides.push({ axis: "x", pos: bestX.guide }); }

    let bestY = null;
    for (const s of [tSnap, cySnap, bySnap]) {
      if (s.guide !== null) {
        if (!bestY || Math.abs(el.y - s.snapped) < Math.abs(el.y - bestY.val)) {
          let offset = 0;
          if (s === cySnap) offset = el.height / 2;
          if (s === bySnap) offset = el.height;
          bestY = { val: s.snapped - offset, guide: s.guide };
        }
      }
    }
    if (bestY) { y = Math.round(bestY.val); guides.push({ axis: "y", pos: bestY.guide }); }
  }

  return { x, y, guides };
}

// ── Layer operations ────────────────────────────────────────────────────────
export const layerOps = {
  bringForward: (els, id) => {
    const i = els.findIndex(e => e.id === id);
    if (i >= els.length - 1) return els;
    const n = [...els]; [n[i], n[i + 1]] = [n[i + 1], n[i]]; return n;
  },
  sendBackward: (els, id) => {
    const i = els.findIndex(e => e.id === id);
    if (i <= 0) return els;
    const n = [...els]; [n[i], n[i - 1]] = [n[i - 1], n[i]]; return n;
  },
  bringToFront: (els, id) => {
    const el = els.find(e => e.id === id);
    return [...els.filter(e => e.id !== id), el];
  },
  sendToBack: (els, id) => {
    const el = els.find(e => e.id === id);
    return [el, ...els.filter(e => e.id !== id)];
  },
  moveToIndex: (els, id, to) => {
    const from = els.findIndex(e => e.id === id);
    if (from === to) return els;
    const n = [...els];
    const [r] = n.splice(from, 1);
    n.splice(to, 0, r);
    return n;
  },
};

// ── Export PNG ──────────────────────────────────────────────────────────────
export async function exportCanvasPNG(surfaceEl) {
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
  await new Promise((res, rej) => { script.onload = res; script.onerror = rej; document.head.appendChild(script); });
  const canvas = await window.html2canvas(surfaceEl, {
    backgroundColor: "#ffffff", scale: 2, useCORS: true, logging: false,
  });
  const link = document.createElement("a");
  link.download = `canvas-export-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
