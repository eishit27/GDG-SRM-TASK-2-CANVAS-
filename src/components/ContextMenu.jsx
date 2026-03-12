import { useRef, useEffect } from "react";
import { TYPE_ICON } from "../constants";

export default function ContextMenu({ x, y, el, onDelete, onDuplicate, onBringToFront, onSendToBack, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, [onClose]);

  const items = [
    { label: "Duplicate",      icon: "⎘", action: onDuplicate,    color: "#9090c0" },
    null,
    { label: "Bring to Front", icon: "⬆", action: onBringToFront, color: "#9090c0" },
    { label: "Send to Back",   icon: "⬇", action: onSendToBack,   color: "#9090c0" },
    null,
    { label: "Delete",         icon: "⌫", action: onDelete,       color: "#f87171", bold: true },
  ];

  return (
    <div ref={ref} style={{
      position: "fixed", left: x, top: y, zIndex: 99999,
      background: "#1a1a26", border: "1px solid #2a2a3a", borderRadius: 10,
      padding: "4px 0", minWidth: 180, boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      animation: "ctxIn 0.12s ease",
    }}>
      <div style={{ padding: "6px 14px 4px", display: "flex", alignItems: "center", gap: 6,
        borderBottom: "1px solid #1e1e2e", marginBottom: 2 }}>
        <span style={{ fontSize: 12 }}>{TYPE_ICON[el.type]}</span>
        <span style={{ color: "#5050a0", fontSize: 10, fontFamily: "'DM Mono',monospace" }}>
          {el.type} #{el.id}
        </span>
      </div>

      {items.map((item, i) =>
        item === null ? (
          <div key={i} style={{ height: 1, background: "#1e1e2e", margin: "3px 0" }} />
        ) : (
          <button key={item.label}
            onClick={() => { item.action(); onClose(); }}
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "7px 14px", background: "none", border: "none", cursor: "pointer",
              color: item.color, fontSize: 12, fontFamily: "'DM Mono',monospace",
              fontWeight: item.bold ? "600" : "normal", textAlign: "left",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = item.bold ? "#2a1a1a" : "#1e1e2e"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
          >
            <span style={{ fontSize: 14, minWidth: 16 }}>{item.icon}</span>
            {item.label}
            {item.label === "Delete" && (
              <span style={{ marginLeft: "auto", color: "#4a3a3a", fontSize: 10 }}>Del</span>
            )}
          </button>
        )
      )}
    </div>
  );
}
