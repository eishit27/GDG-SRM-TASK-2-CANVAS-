import { SELECTION_COLOR, CANVAS_WIDTH, CANVAS_HEIGHT, MIN_SIZE, GRID_SIZE } from "../constants";
import { ColorSection, PropInput } from "./PropertyControls";
import LayerRow from "./LayerRow";

export default function RightPanel({
  selectedEl, selectedId, elements,
  isDragging, isResizing,
  atTop, atBottom,
  zoom, history,
  snapGrid, setSnapGrid,
  snapAlignment, setSnapAlignment,
  showGrid, setShowGrid,
  updateSelectedProp, layerAction, duplicateById, deleteById,
  handleLayerReorder, onSelectLayer,
}) {
  return (
    <div style={{ width: 240, background: "#13131a", borderLeft: "1px solid #1e1e2e",
      flexShrink: 0, display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e1e2e",
        display: "flex", alignItems: "center", gap: 8 }}>
        {selectedEl && (
          <div style={{ width: 7, height: 7, borderRadius: "50%", transition: "background .15s",
            background: isResizing ? "#34d399" : isDragging ? "#60a0ff" : SELECTION_COLOR }} />
        )}
        <span style={{ color: selectedEl ? "#a0b8ff" : "#5050a0", fontSize: 10,
          letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {isResizing ? "resizing…" : isDragging ? "dragging…" : selectedEl ? `${selectedEl.type} #${selectedEl.id}` : "Properties"}
        </span>
      </div>

      {/* Properties */}
      <div style={{ padding: 14, borderBottom: "1px solid #1e1e2e", overflowY: "auto", maxHeight: 420 }}>
        {selectedEl ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Position */}
            <div style={{ color: "#404060", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Position</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <PropInput label="X" value={selectedEl.x} onChange={v => updateSelectedProp("x", v)} />
              <PropInput label="Y" value={selectedEl.y} onChange={v => updateSelectedProp("y", v)} />
            </div>

            {/* Size */}
            <div style={{ color: "#404060", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Size</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <PropInput label="W" value={selectedEl.width}  onChange={v => updateSelectedProp("width",  Math.max(MIN_SIZE, v))} min={MIN_SIZE} />
              <PropInput label="H" value={selectedEl.height} onChange={v => updateSelectedProp("height", Math.max(MIN_SIZE, v))} min={MIN_SIZE} />
            </div>

            {/* Colours */}
            {selectedEl.type !== "text" && (
              <ColorSection label="Fill Color" value={selectedEl.fill}
                onChange={v => updateSelectedProp("fill", v)} allowTransparent={true} />
            )}
            {selectedEl.type === "text" && (
              <ColorSection label="Text Color" value={selectedEl.color || "#1a1a2e"}
                onChange={v => updateSelectedProp("color", v)} allowTransparent={false} />
            )}
            {selectedEl.stroke && selectedEl.stroke !== "none" && (
              <ColorSection label="Stroke Color" value={selectedEl.stroke}
                onChange={v => updateSelectedProp("stroke", v)} allowTransparent={true} />
            )}

            {/* Opacity */}
            <div style={{ color: "#404060", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Opacity</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1e1e2e", borderRadius: 6, padding: "6px 8px" }}>
              <input type="range" min={0} max={1} step={0.01} value={selectedEl.opacity}
                onChange={e => updateSelectedProp("opacity", parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: SELECTION_COLOR, cursor: "pointer" }} />
              <span style={{ color: "#9090c0", fontSize: 11, fontFamily: "monospace", minWidth: 30, textAlign: "right" }}>
                {Math.round(selectedEl.opacity * 100)}%
              </span>
            </div>

            {/* Layer order */}
            <div style={{ color: "#404060", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Layer Order</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
              {[
                { label: "⬆ Front",  action: "bringToFront", disabled: atTop    },
                { label: "↑ Fwd",    action: "bringForward", disabled: atTop    },
                { label: "↓ Back",   action: "sendBackward", disabled: atBottom },
                { label: "⬇ Back",   action: "sendToBack",   disabled: atBottom },
              ].map(({ label, action, disabled }) => (
                <button key={action} onClick={() => layerAction(action)} disabled={disabled}
                  style={{ padding: "5px 4px", background: disabled ? "#161620" : "#1e1e2e",
                    border: `1px solid ${disabled ? "#1e1e2e" : "#2a2a3a"}`, borderRadius: 6,
                    color: disabled ? "#303048" : "#8888b0", fontSize: 10, cursor: disabled ? "default" : "pointer" }}
                  onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = "#2a2a4a"; e.currentTarget.style.color = "#a0a0ff"; } }}
                  onMouseLeave={(e) => { if (!disabled) { e.currentTarget.style.background = "#1e1e2e"; e.currentTarget.style.color = "#8888b0"; } }}
                >{label}</button>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
              <button onClick={() => duplicateById(selectedId)}
                style={{ padding: "6px 4px", background: "#1e1e2e", border: "1px solid #2a2a3a", borderRadius: 6, color: "#8888b0", fontSize: 10, cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#2a2a4a"; e.currentTarget.style.color = "#a0a0ff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#1e1e2e"; e.currentTarget.style.color = "#8888b0"; }}
              >⎘ Duplicate</button>
              <button onClick={() => deleteById(selectedId)}
                style={{ padding: "6px 4px", background: "#2a1a1a", border: "1px solid #4a2a2a", borderRadius: 6, color: "#f87171", fontSize: 10, cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#3a1a1a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#2a1a1a"; }}
              >⌫ Delete</button>
            </div>
          </div>
        ) : (
          <div style={{ background: "#1a1a26", border: "1px dashed #2a2a3a", borderRadius: 10,
            padding: "20px 14px", textAlign: "center" }}>
            <p style={{ color: "#404060", fontSize: 11, margin: 0, lineHeight: 1.8 }}>
              Select an element<br />
              <span style={{ color: "#303050" }}>to edit properties</span>
            </p>
          </div>
        )}
      </div>

      {/* Snap settings */}
      <div style={{ padding: 14, borderBottom: "1px solid #1e1e2e" }}>
        <div style={{ color: "#404060", fontSize: 10, textTransform: "uppercase",
          letterSpacing: "0.08em", marginBottom: 10 }}>Snap & Guides</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Snap to Grid", desc: `${GRID_SIZE}px cells`,    active: snapGrid,      toggle: () => setSnapGrid(v => !v),      color: "#34d399", key: "G" },
            { label: "Align Guides", desc: "edge & center snap",       active: snapAlignment, toggle: () => setSnapAlignment(v => !v), color: "#fb7185", key: "A" },
            { label: "Show Grid",    desc: "visual grid overlay",      active: showGrid,      toggle: () => setShowGrid(v => !v),      color: "#60a0ff", key: "" },
          ].map(({ label, desc, active, toggle, color, key }) => (
            <div key={label} onClick={toggle} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
              background: active ? "#111120" : "#1a1a26",
              border: `1px solid ${active ? color + "30" : "#2a2a3a"}`,
              borderRadius: 8, cursor: "pointer", transition: "all .15s",
            }}>
              <div style={{ width: 28, height: 16, background: active ? color : "#2a2a3a",
                borderRadius: 8, position: "relative", flexShrink: 0, transition: "background .2s" }}>
                <div style={{ position: "absolute", top: 2, left: active ? 12 : 2,
                  width: 12, height: 12, background: "#fff", borderRadius: "50%",
                  transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: active ? color : "#6060a0", fontSize: 11 }}>{label}</div>
                <div style={{ color: "#303050", fontSize: 9 }}>{desc}{key ? ` · key: ${key}` : ""}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layers */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "10px 16px 6px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ color: "#404060", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Layers {elements.length > 0 ? `(${elements.length})` : ""}
          </span>
          {elements.length > 0 && <span style={{ color: "#303050", fontSize: 9 }}>drag to reorder</span>}
        </div>
        {elements.length === 0 ? (
          <div style={{ padding: "0 14px 14px", color: "#303050", fontSize: 11, textAlign: "center" }}>
            No layers yet
          </div>
        ) : (
          [...elements].reverse().map((el, ri) => (
            <LayerRow key={el.id} el={el} index={ri} total={elements.length}
              isSelected={selectedId === el.id}
              isDraggingEl={isDragging && selectedId === el.id}
              isResizing={isResizing && selectedId === el.id}
              onSelect={(id) => !isDragging && !isResizing && onSelectLayer(id)}
              onReorder={handleLayerReorder}
            />
          ))
        )}
      </div>

      {/* Canvas info */}
      <div style={{ padding: 14, borderTop: "1px solid #1e1e2e", flexShrink: 0 }}>
        <div style={{ color: "#404060", fontSize: 10, textTransform: "uppercase",
          letterSpacing: "0.1em", marginBottom: 8 }}>Canvas</div>
        {[["Width", `${CANVAS_WIDTH}px`], ["Height", `${CANVAS_HEIGHT}px`],
          ["Zoom", `${Math.round(zoom * 100)}%`], ["History", `${history.length} steps`]
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ color: "#404060", fontSize: 11 }}>{k}</span>
            <span style={{ color: "#8080a8", fontSize: 11 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
