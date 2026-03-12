import { CANVAS_WIDTH, CANVAS_HEIGHT, GUIDE_COLOR, GRID_SIZE } from "../constants";

export function AlignmentGuides({ guides }) {
  if (!guides.length) return null;
  return (
    <>
      {guides.map((g, i) =>
        g.axis === "x" ? (
          <div key={i} style={{ position: "absolute", left: g.pos - 0.5, top: 0,
            width: 1, height: CANVAS_HEIGHT, background: GUIDE_COLOR,
            opacity: 0.8, pointerEvents: "none", zIndex: 20000 }} />
        ) : (
          <div key={i} style={{ position: "absolute", left: 0, top: g.pos - 0.5,
            width: CANVAS_WIDTH, height: 1, background: GUIDE_COLOR,
            opacity: 0.8, pointerEvents: "none", zIndex: 20000 }} />
        )
      )}
    </>
  );
}

export function GridOverlay({ show }) {
  if (!show) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
      backgroundImage: `linear-gradient(to right, rgba(100,100,200,0.28) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(100,100,200,0.28) 1px, transparent 1px)`,
      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
    }} />
  );
}
