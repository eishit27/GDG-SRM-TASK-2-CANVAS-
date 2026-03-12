export const CANVAS_WIDTH  = 1200;
export const CANVAS_HEIGHT = 800;
export const SELECTION_COLOR = "#3b82f6";
export const GUIDE_COLOR     = "#f43f5e";
export const SNAP_COLOR      = "#10b981";
export const HANDLE_SIZE = 8;
export const MIN_SIZE    = 20;
export const MAX_HISTORY = 50;
export const GRID_SIZE   = 20;
export const SNAP_THRESHOLD = 8;

export const ELEMENT_DEFAULTS = {
  rectangle: { width: 160, height: 100, fill: "#7c6af7", stroke: "none", opacity: 1 },
  ellipse:   { width: 140, height: 100, fill: "#f76ac8", stroke: "none", opacity: 1 },
  text:      { width: 200, height: 48,  fill: "transparent", stroke: "none", opacity: 1, text: "Text block", fontSize: 18, color: "#1a1a2e" },
  image:     { width: 200, height: 150, fill: "#e8e8f4", stroke: "#c0c0d8", opacity: 1 },
  frame:     { width: 260, height: 180, fill: "transparent", stroke: "#7c6af7", opacity: 1 },
};

export const HANDLES = [
  { id:"nw", x:0,   y:0,   cursor:"nwse-resize", left:true,  top:true,  right:false, bottom:false },
  { id:"n",  x:0.5, y:0,   cursor:"ns-resize",   left:false, top:true,  right:false, bottom:false },
  { id:"ne", x:1,   y:0,   cursor:"nesw-resize", left:false, top:true,  right:true,  bottom:false },
  { id:"e",  x:1,   y:0.5, cursor:"ew-resize",   left:false, top:false, right:true,  bottom:false },
  { id:"se", x:1,   y:1,   cursor:"nwse-resize", left:false, top:false, right:true,  bottom:true  },
  { id:"s",  x:0.5, y:1,   cursor:"ns-resize",   left:false, top:false, right:false, bottom:true  },
  { id:"sw", x:0,   y:1,   cursor:"nesw-resize", left:true,  top:false, right:false, bottom:true  },
  { id:"w",  x:0,   y:0.5, cursor:"ew-resize",   left:true,  top:false, right:false, bottom:false },
];

export const TYPE_ICON   = { rectangle:"⬜", ellipse:"⬭", text:"T", image:"🖼", frame:"⊹" };
export const ACTION_ICON = { add:"✦", delete:"⌫", move:"↔", resize:"⤢", duplicate:"⎘", order:"☰", clear:"🗑" };

export const TOOLS = [
  { icon:"↖", label:"select" },
  { icon:"⬜", label:"rectangle" },
  { icon:"⬭", label:"ellipse" },
  { icon:"T",  label:"text" },
  { icon:"🖼", label:"image" },
  { icon:"⊹", label:"frame" },
];

export const PALETTE = [
  // Row 1 – vibrant
  "#f87171","#fb923c","#fbbf24","#a3e635","#34d399","#22d3ee","#60a5fa","#a78bfa","#f472b6","#e879f9",
  // Row 2 – deep
  "#b91c1c","#c2410c","#b45309","#4d7c0f","#065f46","#164e63","#1e40af","#4c1d95","#831843","#6b21a8",
  // Row 3 – pastel
  "#fecaca","#fed7aa","#fef08a","#d9f99d","#a7f3d0","#a5f3fc","#bfdbfe","#ddd6fe","#fbcfe8","#f5d0fe",
  // Row 4 – neutral
  "#ffffff","#e5e7eb","#9ca3af","#6b7280","#374151","#1f2937","#111827","#000000","#7c6af7","#f76ac8",
];

export const btnStyle = {
  background: "none", border: "none", color: "#8080b0",
  cursor: "pointer", fontSize: 14, padding: "2px 6px", borderRadius: 4,
};
