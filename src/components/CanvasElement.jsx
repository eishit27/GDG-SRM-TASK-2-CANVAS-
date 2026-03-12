export default function CanvasElement({ el, zIndex, selected, isDragging, isResizing, onMouseDown, onContextMenu }) {
  const base = {
    position: "absolute", left: el.x, top: el.y, width: el.width, height: el.height,
    opacity: el.opacity, cursor: selected ? (isDragging ? "grabbing" : "grab") : "pointer",
    boxSizing: "border-box", zIndex,
    filter: isDragging ? "drop-shadow(0 8px 24px rgba(0,0,0,0.22))" : "none",
    transition: isDragging || isResizing ? "none" : "filter .15s",
  };
  const h = {
    onMouseDown:   (e) => { e.stopPropagation(); onMouseDown(e, el.id); },
    onContextMenu: (e) => { e.preventDefault(); e.stopPropagation(); onContextMenu(e, el.id); },
  };

  if (el.type === "rectangle")
    return <div {...h} style={{ ...base, background: el.fill, borderRadius: 4 }} />;

  if (el.type === "ellipse")
    return <div {...h} style={{ ...base, background: el.fill, borderRadius: "50%" }} />;

  if (el.type === "text")
    return (
      <div {...h} style={{ ...base, height: "auto", minHeight: el.height, padding: "4px 6px",
        fontSize: el.fontSize, color: el.color, fontFamily: "'DM Mono',monospace", lineHeight: 1.4 }}>
        {el.text}
      </div>
    );

  if (el.type === "image")
    return (
      <div {...h} style={{ ...base, background: el.fill, border: `1.5px dashed ${el.stroke}`,
        borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: 6 }}>
        <div style={{ fontSize: 28, opacity: 0.35 }}>🖼</div>
        <span style={{ fontSize: 10, color: "#9090b8", fontFamily: "monospace" }}>Image Placeholder</span>
      </div>
    );

  if (el.type === "frame")
    return (
      <div {...h} style={{ ...base, background: el.fill, border: `1.5px solid ${el.stroke}`, borderRadius: 4 }}>
        <div style={{ position: "absolute", top: -18, left: 0, fontSize: 9, color: "#7c6af7",
          fontFamily: "monospace", pointerEvents: "none" }}>Frame</div>
      </div>
    );

  return null;
}
