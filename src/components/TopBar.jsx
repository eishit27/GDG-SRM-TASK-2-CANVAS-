import { btnStyle, TOOLS } from "../constants";

export default function TopBar({
  history, future, showHistory, setShowHistory,
  undo, redo,
  snapGrid, setSnapGrid,
  snapAlignment, setSnapAlignment,
  showGrid, setShowGrid,
  zoom, setZoom, setCanvasOffset,
  addElement, exportPNG,
}) {
  return (
    <div style={{ height: 52, background: "#16161e", borderBottom: "1px solid #2a2a3a",
      display: "flex", alignItems: "center", padding: "0 20px", gap: 10, flexShrink: 0, zIndex: 10 }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 4 }}>
        <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#7c6af7,#f76ac8)",
          borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: "bold", color: "#fff", letterSpacing: "-1px" }}>CV</div>
        <span style={{ color: "#c8c8e0", fontSize: 13 }}>
          canvas<span style={{ color: "#7c6af7" }}>.io</span>
        </span>
      </div>

      <div style={{ width: 1, height: 24, background: "#2a2a3a" }} />

      {/* Undo / Redo / History */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <button onClick={undo} disabled={!history.length} title="Undo ⌘Z"
          style={{ width: 30, height: 30, background: "#1e1e2e", border: "1px solid #2a2a3a",
            borderRadius: 7, color: history.length ? "#8888b0" : "#303050",
            fontSize: 14, cursor: history.length ? "pointer" : "default" }}>↩</button>
        <button onClick={redo} disabled={!future.length} title="Redo ⌘⇧Z"
          style={{ width: 30, height: 30, background: "#1e1e2e", border: "1px solid #2a2a3a",
            borderRadius: 7, color: future.length ? "#8888b0" : "#303050",
            fontSize: 14, cursor: future.length ? "pointer" : "default" }}>↪</button>
        <button onClick={() => setShowHistory(v => !v)} title="History timeline"
          style={{ height: 30, padding: "0 10px", background: showHistory ? "#2a2a4a" : "#1e1e2e",
            border: `1px solid ${showHistory ? "#4a4a7a" : "#2a2a3a"}`, borderRadius: 7,
            color: showHistory ? "#a0a0ff" : "#6868a0", fontSize: 10, cursor: "pointer" }}>
          ⏱ {history.length > 0 ? history.length : ""}
        </button>
      </div>

      <div style={{ width: 1, height: 24, background: "#2a2a3a" }} />

      {/* Snap controls */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <button onClick={() => setSnapGrid(v => !v)} title="Snap to Grid (G)"
          style={{ height: 30, padding: "0 10px", background: snapGrid ? "#0e2010" : "#1e1e2e",
            border: `1px solid ${snapGrid ? "#14b8a640" : "#2a2a3a"}`, borderRadius: 7,
            color: snapGrid ? "#34d399" : "#6868a0", fontSize: 10, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 12 }}>⊞</span> Grid {snapGrid ? "ON" : "OFF"}
        </button>
        <button onClick={() => setSnapAlignment(v => !v)} title="Alignment Guides (A)"
          style={{ height: 30, padding: "0 10px", background: snapAlignment ? "#100020" : "#1e1e2e",
            border: `1px solid ${snapAlignment ? "#f43f5e40" : "#2a2a3a"}`, borderRadius: 7,
            color: snapAlignment ? "#fb7185" : "#6868a0", fontSize: 10, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 12 }}>⊟</span> Guides {snapAlignment ? "ON" : "OFF"}
        </button>
        <button onClick={() => setShowGrid(v => !v)} title="Show Grid"
          style={{ height: 30, padding: "0 10px", background: showGrid ? "#0a1020" : "#1e1e2e",
            border: `1px solid ${showGrid ? "#3b82f640" : "#2a2a3a"}`, borderRadius: 7,
            color: showGrid ? "#60a0ff" : "#6868a0", fontSize: 10, cursor: "pointer" }}>
          {showGrid ? "⊡" : "⊟"} Grid
        </button>
      </div>

      <div style={{ flex: 1 }} />

      {/* Add element buttons */}
      {["rectangle", "ellipse", "text", "image", "frame"].map(type => (
        <button key={type} onClick={() => addElement(type)}
          style={{ background: "#1e1e2e", border: "1px solid #2a2a3a", borderRadius: 7,
            color: "#8888b0", fontSize: 11, cursor: "pointer", padding: "5px 10px",
            fontFamily: "inherit" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#2a2a4a"; e.currentTarget.style.color = "#a0a0ff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#1e1e2e"; e.currentTarget.style.color = "#8888b0"; }}
        >+ {type.charAt(0).toUpperCase() + type.slice(1)}</button>
      ))}

      <div style={{ width: 1, height: 24, background: "#2a2a3a" }} />

      {/* Zoom */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#1e1e2e",
        border: "1px solid #2a2a3a", borderRadius: 8, padding: "4px 10px" }}>
        <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.2))} style={btnStyle}>−</button>
        <span style={{ color: "#a0a0c0", fontSize: 11, minWidth: 42, textAlign: "center" }}>
          {Math.round(zoom * 100)}%
        </span>
        <button onClick={() => setZoom(z => Math.min(z + 0.1, 4))} style={btnStyle}>+</button>
      </div>
      <button onClick={() => { setZoom(1); setCanvasOffset({ x: 0, y: 0 }); }}
        style={{ ...btnStyle, background: "#1e1e2e", border: "1px solid #2a2a3a",
          borderRadius: 7, padding: "5px 12px", fontSize: 11, color: "#8888b0" }}>Reset</button>

      <div style={{ width: 1, height: 24, background: "#2a2a3a" }} />

      {/* Export */}
      <button onClick={exportPNG} title="Export as PNG"
        style={{ height: 30, padding: "0 14px",
          background: "linear-gradient(135deg,#7c6af720,#f76ac820)",
          border: "1px solid #7c6af750", borderRadius: 7, color: "#c0a0ff",
          fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center",
          gap: 6, fontFamily: "inherit" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,#7c6af740,#f76ac840)"; e.currentTarget.style.color = "#e0c0ff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "linear-gradient(135deg,#7c6af720,#f76ac820)"; e.currentTarget.style.color = "#c0a0ff"; }}
      >
        <span style={{ fontSize: 13 }}>↓</span> Export PNG
      </button>
    </div>
  );
}
