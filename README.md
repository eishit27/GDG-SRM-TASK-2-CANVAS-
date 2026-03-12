# Canvas.io

A dark-theme canvas design tool built with React + Vite.

## Project Structure

```
canvas-app/
├── index.html                     # HTML entry point
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                   # React root mount
    ├── App.jsx                    # App shell
    ├── constants/
    │   └── index.js               # All constants, defaults, palette, handles
    ├── utils/
    │   └── canvasUtils.js         # Snap logic, layer ops, element factory, PNG export
    ├── hooks/
    │   └── useCanvasEditor.js     # All state + interaction logic (drag, resize, pan, history)
    └── components/
        ├── CanvasEditor.jsx       # Main orchestrator — wires everything together
        ├── CanvasElement.jsx      # Renders a single element (rect, ellipse, text, image, frame)
        ├── SelectionOverlay.jsx   # Selection border + resize handles + rotation knob
        ├── CanvasOverlays.jsx     # AlignmentGuides + GridOverlay
        ├── ContextMenu.jsx        # Right-click context menu
        ├── HistoryPanel.jsx       # Floating history timeline panel
        ├── LayerRow.jsx           # Single draggable layer row
        ├── PropertyControls.jsx   # ColorSection (palette + picker) + PropInput (numeric)
        ├── TopBar.jsx             # Top toolbar: undo/redo, snap, add elements, zoom, export
        ├── LeftToolbar.jsx        # Left icon toolbar: tool select + delete buttons
        └── RightPanel.jsx         # Right panel: properties, snap toggles, layers list
```

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build for Production

```bash
npm run build       # outputs to dist/
npm run preview     # preview production build locally
```

## Deploy to Netlify (drag & drop)

1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder onto the page
4. Get a live URL instantly ✅

## Features

- Add rectangles, ellipses, text, image placeholders, and frames
- Drag, resize, and layer elements
- Snap to grid and alignment guides
- Editable properties panel (X, Y, W, H, fill, stroke, opacity)
- 40-colour palette + custom colour picker
- Undo / redo with full history timeline
- Export canvas as PNG (2× resolution)
- Pure black viewport background
