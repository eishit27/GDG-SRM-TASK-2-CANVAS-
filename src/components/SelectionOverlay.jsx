import { SELECTION_COLOR, HANDLES, HANDLE_SIZE } from "../constants";

export default function SelectionOverlay({ el, isDragging, isResizing, onResizeStart }) {
  const color   = SELECTION_COLOR;
  const label   = isDragging ? `${el.x}, ${el.y}` : `${el.width} × ${el.height}`;
  const labelBg = isDragging ? "#1d4ed8" : isResizing ? "#0f766e" : color;

  return (
    <div style={{ position: "absolute", left: el.x - 1, top: el.y - 1,
      width: el.width + 2, height: el.height + 2, pointerEvents: "none", zIndex: 9999 }}>

      {/* Border */}
      <div style={{ position: "absolute", inset: 0,
        border: `2px solid ${isResizing ? "#14b8a6" : color}`,
        borderRadius: el.type === "ellipse" ? "50%" : 4,
        boxShadow: isResizing ? "0 0 0 3px rgba(20,184,166,0.15)" : "0 0 0 1px rgba(59,130,246,0.1)",
        transition: "border-color .15s" }} />

      {/* Label */}
      <div style={{ position: "absolute", top: -26, left: "50%", transform: "translateX(-50%)",
        background: labelBg, color: "#fff", fontSize: 10, fontFamily: "'DM Mono',monospace",
        padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap",
        transition: "background .15s", pointerEvents: "none" }}>{label}</div>

      {/* Rotation handle */}
      {!isDragging && !isResizing && (
        <>
          <div style={{ position: "absolute", top: -38, left: "50%", transform: "translateX(-50%)",
            width: 1, height: 14, background: `${color}60` }} />
          <div style={{ position: "absolute", top: -52, left: "50%", transform: "translateX(-50%)",
            width: 14, height: 14, background: "#fff", border: `2px solid ${color}`,
            borderRadius: "50%", cursor: "grab", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 8, color }}>↻</div>
        </>
      )}

      {/* Crosshair while dragging */}
      {isDragging && (
        <>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1,
            background: `${color}35`, transform: "translateY(-50%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1,
            background: `${color}35`, transform: "translateX(-50%)", pointerEvents: "none" }} />
        </>
      )}

      {/* Resize handles */}
      {!isDragging && HANDLES.map(({ id, x, y, cursor }) => (
        <div key={id}
          onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); onResizeStart(e, id); }}
          style={{
            position: "absolute",
            left: `calc(${x * 100}% - ${HANDLE_SIZE / 2}px)`,
            top:  `calc(${y * 100}% - ${HANDLE_SIZE / 2}px)`,
            width: HANDLE_SIZE, height: HANDLE_SIZE,
            background: isResizing ? "#14b8a6" : "#fff",
            border: `2px solid ${isResizing ? "#14b8a6" : color}`,
            borderRadius: 2, cursor, zIndex: 10001,
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)", pointerEvents: "all",
            transition: "background .12s, transform .12s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.4)"; e.currentTarget.style.background = color; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)";   e.currentTarget.style.background = isResizing ? "#14b8a6" : "#fff"; }}
        />
      ))}
    </div>
  );
}
