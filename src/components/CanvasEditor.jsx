import { useCanvasEditor } from "../hooks/useCanvasEditor";
import { CANVAS_WIDTH, CANVAS_HEIGHT, GUIDE_COLOR, SNAP_COLOR } from "../constants";
import { layerOps } from "../utils/canvasUtils";

import TopBar          from "./TopBar";
import LeftToolbar     from "./LeftToolbar";
import RightPanel      from "./RightPanel";
import CanvasElement   from "./CanvasElement";
import SelectionOverlay from "./SelectionOverlay";
import { AlignmentGuides, GridOverlay } from "./CanvasOverlays";
import ContextMenu     from "./ContextMenu";
import HistoryPanel    from "./HistoryPanel";

export default function CanvasEditor() {
  const editor = useCanvasEditor();
  const {
    viewportRef, canvasSurfaceRef,
    zoom, setZoom, canvasOffset, setCanvasOffset,
    elements, setElements, selectedId, setSelectedId, selectedEl, atTop, atBottom,
    history, future, showHistory, setShowHistory, jumpToHistory,
    snapGrid, setSnapGrid, snapAlignment, setSnapAlignment, showGrid, setShowGrid, activeGuides,
    isDragging, isResizing, isPanning, viewportCursor,
    notification, contextMenu, setContextMenu,
    addElement, deleteSelected, deleteById, deleteAll, duplicateById,
    updateSelectedProp, layerAction, handleLayerReorder, exportPNG, undo, redo,
    handleElementMouseDown, handleResizeStart,
    handleViewportMouseDown, handleWheel, handleContextMenu,
  } = editor;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0f0f13",
      display: "flex", flexDirection: "column", fontFamily: "'DM Mono','Courier New',monospace",
      overflow: "hidden", userSelect: "none" }}>

      {/* Context menu */}
      {contextMenu && (() => {
        const ctxEl = elements.find(e => e.id === contextMenu.elId);
        return ctxEl ? (
          <ContextMenu
            x={contextMenu.x} y={contextMenu.y} el={ctxEl}
            onDelete={() => deleteById(contextMenu.elId)}
            onDuplicate={() => duplicateById(contextMenu.elId)}
            onBringToFront={() => setElements(p => layerOps.bringToFront(p, contextMenu.elId))}
            onSendToBack={() => setElements(p => layerOps.sendToBack(p, contextMenu.elId))}
            onClose={() => setContextMenu(null)}
          />
        ) : null;
      })()}

      {/* History panel */}
      {showHistory && (
        <HistoryPanel
          history={history} future={future} currentElements={elements}
          onJump={jumpToHistory} onClose={() => setShowHistory(false)}
        />
      )}

      {/* Top bar */}
      <TopBar
        history={history} future={future} showHistory={showHistory} setShowHistory={setShowHistory}
        undo={undo} redo={redo}
        snapGrid={snapGrid} setSnapGrid={setSnapGrid}
        snapAlignment={snapAlignment} setSnapAlignment={setSnapAlignment}
        showGrid={showGrid} setShowGrid={setShowGrid}
        zoom={zoom} setZoom={setZoom} setCanvasOffset={setCanvasOffset}
        addElement={addElement} exportPNG={exportPNG}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left toolbar */}
        <LeftToolbar
          addElement={addElement}
          deleteSelected={deleteSelected}
          deleteAll={deleteAll}
          selectedId={selectedId}
          hasElements={elements.length > 0}
        />

        {/* Canvas viewport */}
        <div ref={viewportRef} onWheel={handleWheel} onMouseDown={handleViewportMouseDown}
          className="canvas-bg"
          style={{ flex: 1, overflow: "hidden", position: "relative",
            cursor: viewportCursor, background: "#000000" }}>

          {/* Dot pattern */}
          <div className="canvas-bg" style={{ position: "absolute", inset: 0,
            backgroundImage: `radial-gradient(circle, #1a1a2e 1px, transparent 1px)`,
            backgroundSize: `${28 * zoom}px ${28 * zoom}px`,
            backgroundPosition: `${canvasOffset.x % (28 * zoom)}px ${canvasOffset.y % (28 * zoom)}px`,
            pointerEvents: "none", opacity: 0.9 }} />

          {/* Canvas surface */}
          <div style={{ position: "absolute", top: "50%", left: "50%",
            transform: `translate(calc(-50% + ${canvasOffset.x}px), calc(-50% + ${canvasOffset.y}px)) scale(${zoom})`,
            transformOrigin: "center center" }}>

            <div ref={canvasSurfaceRef} className="canvas-surface" style={{
              width: CANVAS_WIDTH, height: CANVAS_HEIGHT, background: "#ffffff",
              borderRadius: 4, position: "relative", overflow: "visible",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08),0 0 80px rgba(0,0,0,0.9),0 40px 100px rgba(0,0,0,0.95)",
            }}>

              {/* Frame label */}
              <div style={{ position: "absolute", top: -28, left: 0, color: "#5050a0",
                fontSize: 11, pointerEvents: "none" }}>
                Frame 1 — {CANVAS_WIDTH} × {CANVAS_HEIGHT}
              </div>

              {/* Corner marks */}
              {[
                { top: -1, left: -1,   borderTopWidth: 2, borderLeftWidth: 2  },
                { top: -1, right: -1,  borderTopWidth: 2, borderRightWidth: 2 },
                { bottom: -1, left: -1,  borderBottomWidth: 2, borderLeftWidth: 2  },
                { bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2 },
              ].map((s, i) => (
                <div key={i} style={{ position: "absolute", width: 8, height: 8,
                  borderColor: "#7c6af7", borderStyle: "solid", borderWidth: 0,
                  ...s, pointerEvents: "none", zIndex: 10 }} />
              ))}

              <GridOverlay show={showGrid} />

              {/* Elements */}
              {elements.map((el, idx) => (
                <CanvasElement key={el.id} el={el} zIndex={idx + 1}
                  selected={selectedId === el.id}
                  isDragging={isDragging && selectedId === el.id}
                  isResizing={isResizing && selectedId === el.id}
                  onMouseDown={handleElementMouseDown}
                  onContextMenu={handleContextMenu}
                />
              ))}

              <AlignmentGuides guides={activeGuides} />

              {selectedEl && (
                <SelectionOverlay
                  el={selectedEl} isDragging={isDragging} isResizing={isResizing}
                  onResizeStart={handleResizeStart}
                />
              )}

              {/* Empty state */}
              {elements.length === 0 && (
                <div style={{ position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
                  <div style={{ width: 64, height: 64, border: "2px dashed #d0d0e8", borderRadius: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 14px", fontSize: 26, color: "#c0c0d8" }}>+</div>
                  <p style={{ color: "#b0b0cc", fontSize: 13, margin: 0 }}>Add elements using the toolbar</p>
                  <p style={{ color: "#d0d0e0", fontSize: 11, margin: "4px 0 0", opacity: 0.5 }}>
                    G=snap grid · A=align guides · ⌘Z=undo
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Snap badges */}
          {isDragging && activeGuides.length > 0 && (
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
              background: "#0a1e14cc", backdropFilter: "blur(8px)",
              border: `1px solid ${GUIDE_COLOR}60`, borderRadius: 16, padding: "5px 14px",
              color: GUIDE_COLOR, fontSize: 11, pointerEvents: "none", zIndex: 200,
              display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>⊟</span>
              Snapping to {activeGuides.length} guide{activeGuides.length > 1 ? "s" : ""}
            </div>
          )}
          {isDragging && snapGrid && activeGuides.length === 0 && (
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
              background: "#0a200acc", backdropFilter: "blur(8px)",
              border: `1px solid ${SNAP_COLOR}60`, borderRadius: 16, padding: "5px 14px",
              color: SNAP_COLOR, fontSize: 11, pointerEvents: "none", zIndex: 200,
              display: "flex", alignItems: "center", gap: 6 }}>
              <span>⊞</span> Grid snap active ({20}px)
            </div>
          )}

          {/* Keyboard hints */}
          <div style={{ position: "absolute", top: 12, right: 16, display: "flex", gap: 5, pointerEvents: "none" }}>
            {[["Del","delete"],["⌘Z","undo"],["⌘D","dupe"],["G","grid"],["A","guides"]].map(([key, label]) => (
              <div key={key} style={{ background: "#16161ecc", backdropFilter: "blur(6px)",
                border: "1px solid #2a2a3a", borderRadius: 6, padding: "3px 8px",
                display: "flex", gap: 5, alignItems: "center" }}>
                <span style={{ color: "#5050a0", fontSize: 10, fontFamily: "monospace" }}>{key}</span>
                <span style={{ color: "#303050", fontSize: 9 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Notification */}
          {notification && (
            <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
              background: "#2a2a4acc", backdropFilter: "blur(8px)",
              border: "1px solid #4a4a7a", borderRadius: 20, padding: "6px 18px",
              color: "#a0a0ff", fontSize: 12, pointerEvents: "none", zIndex: 100,
              animation: "fadeIn 0.15s ease" }}>{notification}</div>
          )}

          {/* Status bar */}
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
            background: "#16161ecc", backdropFilter: "blur(8px)", border: "1px solid #2a2a3a",
            borderRadius: 20, padding: "6px 16px", display: "flex", gap: 16,
            alignItems: "center", pointerEvents: "none" }}>
            {[
              { label: "Zoom",    value: `${Math.round(zoom * 100)}%`,  color: "#9090c0" },
              { label: "Layers",  value: elements.length,               color: "#9090c0" },
              { label: selectedEl ? selectedEl.type : "Selected",
                value: selectedEl ? `#${selectedEl.id}` : "—",          color: "#9090c0" },
              { label: "History", value: `${history.length}/${50}`,     color: history.length > 0 ? "#7060d0" : "#404060" },
            ].map(({ label, value, color }) => (
              <span key={label} style={{ color: "#6868a0", fontSize: 11 }}>
                <span style={{ color: "#4a4a70", marginRight: 4 }}>{label}</span>
                <span style={{ color }}>{value}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <RightPanel
          selectedEl={selectedEl} selectedId={selectedId} elements={elements}
          isDragging={isDragging} isResizing={isResizing}
          atTop={atTop} atBottom={atBottom}
          zoom={zoom} history={history}
          snapGrid={snapGrid} setSnapGrid={setSnapGrid}
          snapAlignment={snapAlignment} setSnapAlignment={setSnapAlignment}
          showGrid={showGrid} setShowGrid={setShowGrid}
          updateSelectedProp={updateSelectedProp}
          layerAction={layerAction}
          duplicateById={duplicateById}
          deleteById={deleteById}
          handleLayerReorder={handleLayerReorder}
          onSelectLayer={setSelectedId}
        />
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateX(-50%) translateY(-6px);}to{opacity:1;transform:translateX(-50%) translateY(0);} }
        @keyframes ctxIn  { from{opacity:0;transform:scale(0.95) translateY(-4px);}to{opacity:1;transform:scale(1) translateY(0);} }
      `}</style>
    </div>
  );
}
