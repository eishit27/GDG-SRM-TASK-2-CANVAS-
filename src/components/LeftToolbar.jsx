import { TOOLS } from "../constants";

export default function LeftToolbar({ addElement, deleteSelected, deleteAll, selectedId, hasElements }) {
  return (
    <div style={{ width: 52, background: "#13131a", borderRight: "1px solid #1e1e2e",
      display: "flex", flexDirection: "column", alignItems: "center",
      paddingTop: 16, gap: 4, flexShrink: 0 }}>

      {TOOLS.map(({ icon, label }) => (
        <button key={label} title={label}
          onClick={() => label !== "select" && addElement(label)}
          style={{
            width: 36, height: 36, background: label === "select" ? "#2a2a4a" : "transparent",
            border: label === "select" ? "1px solid #4a4a7a" : "1px solid transparent",
            borderRadius: 8, color: label === "select" ? "#a0a0ff" : "#5a5a7a",
            fontSize: label === "text" ? 15 : 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={(e) => { if (label !== "select") { e.currentTarget.style.background = "#1e1e2e"; e.currentTarget.style.color = "#9090d0"; } }}
          onMouseLeave={(e) => { if (label !== "select") { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5a5a7a"; } }}
        >{icon}</button>
      ))}

      <div style={{ height: 1, width: 28, background: "#2a2a3a", margin: "8px 0" }} />

      {/* Delete selected */}
      <button title="Delete (Del)" onClick={deleteSelected} disabled={!selectedId}
        style={{
          width: 36, height: 36, background: selectedId ? "#2a1212" : "transparent",
          border: selectedId ? "1px solid #4a2020" : "1px solid transparent",
          borderRadius: 8, color: selectedId ? "#f87171" : "#3a2020",
          fontSize: 16, cursor: selectedId ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>⌫</button>

      {/* Delete all */}
      {hasElements && (
        <button title="Delete all" onClick={deleteAll}
          style={{ width: 36, height: 36, background: "transparent", border: "1px solid transparent",
            borderRadius: 8, color: "#5a3a5a", fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#2a1a1a"; e.currentTarget.style.color = "#c06060"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5a3a5a"; }}
        >🗑</button>
      )}
    </div>
  );
}
