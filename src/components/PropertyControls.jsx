import { useState, useEffect } from "react";
import { SELECTION_COLOR, PALETTE } from "../constants";

// ── Colour picker ──────────────────────────────────────────────────────────
export function ColorSection({ label, value, onChange, allowTransparent }) {
  const [open, setOpen] = useState(false);
  const isTransparent = !value || value === "none" || value === "transparent";
  const displayColor  = isTransparent ? null : value;

  return (
    <div>
      <div style={{ color: "#404060", fontSize: 10, textTransform: "uppercase",
        letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>

      {/* Trigger */}
      <div onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 8,
        background: open ? "#1a2040" : "#1e1e2e", borderRadius: 6, padding: "6px 8px",
        border: `1px solid ${open ? SELECTION_COLOR + "50" : "#2a2a3a"}`,
        cursor: "pointer", transition: "all .15s",
      }}>
        <div style={{ width: 20, height: 20, borderRadius: 4, border: "1px solid #3a3a5a",
          flexShrink: 0, position: "relative", overflow: "hidden",
          background: displayColor || "transparent" }}>
          {isTransparent && (
            <div style={{ position: "absolute", inset: 0,
              background: "repeating-conic-gradient(#555 0% 25%, #333 0% 50%) 0 0 / 8px 8px" }} />
          )}
        </div>
        <span style={{ color: "#9090c0", fontSize: 11, fontFamily: "monospace", flex: 1 }}>
          {isTransparent ? "transparent" : value}
        </span>
        <span style={{ color: "#404060", fontSize: 10 }}>{open ? "▲" : "▼"}</span>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ marginTop: 6, background: "#16161e", border: "1px solid #2a2a3a",
          borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>

          {/* Swatches */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 3 }}>
            {PALETTE.map(c => (
              <div key={c} onClick={() => { onChange(c); setOpen(false); }} title={c}
                style={{
                  width: "100%", aspectRatio: "1", borderRadius: 3, background: c,
                  cursor: "pointer", border: value === c ? "2px solid #fff" : "2px solid transparent",
                  boxSizing: "border-box", transition: "transform .1s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              />
            ))}
          </div>

          {/* Custom + None */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: 4, border: "1px solid #3a3a5a",
                background: displayColor || "#ffffff", cursor: "pointer" }} />
              <input type="color" value={displayColor || "#ffffff"}
                onChange={e => onChange(e.target.value)}
                style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer",
                  width: "100%", height: "100%", padding: 0, border: "none" }} />
            </div>
            <span style={{ color: "#5060a0", fontSize: 10 }}>Custom…</span>

            {allowTransparent && (
              <div onClick={() => { onChange("transparent"); setOpen(false); }} style={{
                marginLeft: "auto", padding: "2px 8px",
                background: isTransparent ? "#2a2a4a" : "#1e1e2e",
                border: `1px solid ${isTransparent ? SELECTION_COLOR + "60" : "#2a2a3a"}`,
                borderRadius: 4, color: isTransparent ? "#a0b0ff" : "#5060a0",
                fontSize: 10, cursor: "pointer",
              }}>✕ None</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Numeric input ──────────────────────────────────────────────────────────
export function PropInput({ label, value, onChange, min, max }) {
  const [local,   setLocal]   = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setLocal(String(value));
  }, [value, focused]);

  const commit = () => {
    const n = parseInt(local, 10);
    if (!isNaN(n)) onChange(Math.max(min ?? -9999, Math.min(max ?? 9999, n)));
    else setLocal(String(value));
  };

  return (
    <div style={{
      background: focused ? "#1a2040" : "#1e1e2e", borderRadius: 6, padding: "6px 8px",
      border: focused ? `1px solid ${SELECTION_COLOR}60` : "1px solid #2a2a3a",
      transition: "all .15s",
    }}>
      <div style={{ color: "#404060", fontSize: 9, marginBottom: 3,
        textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <input
        value={local}
        onChange={e => setLocal(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); commit(); }}
        onKeyDown={e => {
          if (e.key === "Enter") { commit(); e.target.blur(); }
          if (e.key === "ArrowUp")   { e.preventDefault(); const n = (parseInt(local, 10) || 0) + 1; setLocal(String(n)); onChange(n); }
          if (e.key === "ArrowDown") { e.preventDefault(); const n = (parseInt(local, 10) || 0) - 1; setLocal(String(n)); onChange(n); }
        }}
        style={{ width: "100%", background: "none", border: "none", outline: "none",
          color: focused ? "#a0c0ff" : "#9090c0", fontSize: 12,
          fontFamily: "monospace", padding: 0, cursor: "text" }}
      />
    </div>
  );
}
