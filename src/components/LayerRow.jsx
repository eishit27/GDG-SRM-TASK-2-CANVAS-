import { useRef } from "react";
import { SELECTION_COLOR, TYPE_ICON } from "../constants";

export default function LayerRow({ el, index, total, isSelected, isDraggingEl, isResizing, onSelect, onReorder }) {
  const ref = useRef(null);

  const dragHandlers = {
    draggable: true,
    onDragStart: (e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("layerId", String(el.id)); },
    onDragOver:  (e) => { e.preventDefault(); if (ref.current) ref.current.style.borderTop = "2px solid #3b82f6"; },
    onDragLeave: ()  => { if (ref.current) ref.current.style.borderTop = "2px solid transparent"; },
    onDrop: (e) => {
      e.preventDefault();
      if (ref.current) ref.current.style.borderTop = "2px solid transparent";
      const fromId = parseInt(e.dataTransfer.getData("layerId"), 10);
      if (fromId !== el.id) onReorder(fromId, index);
    },
    onClick: () => onSelect(el.id),
  };

  return (
    <div ref={ref} {...dragHandlers} style={{
      padding: "5px 14px", display: "flex", alignItems: "center", gap: 7,
      cursor: "pointer", background: isSelected ? "#12122a" : "transparent",
      borderLeft: `2px solid ${isSelected ? SELECTION_COLOR : "transparent"}`,
      borderTop: "2px solid transparent", userSelect: "none",
    }}>
      <span style={{ color: "#303050", fontSize: 10, cursor: "grab" }}>⠿</span>
      <span style={{ color: "#303050", fontSize: 9, minWidth: 14, textAlign: "right" }}>{total - index}</span>
      <span style={{ fontSize: 11 }}>{TYPE_ICON[el.type]}</span>
      <span style={{ color: isSelected ? "#a0b8ff" : "#6060a0", fontSize: 11, flex: 1,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {el.type} #{el.id}
      </span>
      {isDraggingEl && <span style={{ fontSize: 9, color: "#4080c0" }}>moving</span>}
      {isResizing   && <span style={{ fontSize: 9, color: "#2dd4bf" }}>resizing</span>}
      {isSelected   && <div style={{ width: 5, height: 5, background: SELECTION_COLOR, borderRadius: "50%" }} />}
    </div>
  );
}
