import { SELECTION_COLOR } from "../constants";

export default function HistoryPanel({ history, future, currentElements, onJump, onClose }) {
  const allStates = [
    ...history.map((els, i) => ({ els, label: `State ${i + 1}`, index: i, type: "past" })),
    { els: currentElements, label: "Current", index: history.length, type: "current" },
    ...future.map((els, i) => ({ els, label: `Redo ${i + 1}`, index: history.length + 1 + i, type: "future" })),
  ];

  return (
    <div style={{
      position: "fixed", right: 260, bottom: 60, width: 220, maxHeight: 320,
      background: "#13131a", border: "1px solid #2a2a3a", borderRadius: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 9000,
      display: "flex", flexDirection: "column", overflow: "hidden", animation: "ctxIn 0.15s ease",
    }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid #1e1e2e",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#6060a0", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          History ({history.length + 1})
        </span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#404060", cursor: "pointer", fontSize: 14 }}>×</button>
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        {[...allStates].reverse().map((state) => (
          <div key={state.index}
            onClick={() => state.type !== "current" && onJump(state.index)}
            style={{
              padding: "7px 14px", display: "flex", alignItems: "center", gap: 8,
              cursor: state.type === "current" ? "default" : "pointer",
              background: state.type === "current" ? "#1a1a2e" : "transparent",
              borderLeft: `2px solid ${state.type === "current" ? SELECTION_COLOR : state.type === "future" ? "#404060" : "transparent"}`,
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => { if (state.type !== "current") e.currentTarget.style.background = "#1e1e2e"; }}
            onMouseLeave={(e) => { if (state.type !== "current") e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 10, opacity: 0.5 }}>
              {state.type === "future" ? "↪" : state.type === "current" ? "●" : "○"}
            </span>
            <span style={{ color: state.type === "current" ? "#a0b8ff" : state.type === "future" ? "#404060" : "#6060a0", fontSize: 11, flex: 1 }}>
              {state.type === "current" ? "● Now" : state.label}
            </span>
            <span style={{ color: "#303050", fontSize: 10 }}>{state.els.length} el</span>
          </div>
        ))}
      </div>
    </div>
  );
}
