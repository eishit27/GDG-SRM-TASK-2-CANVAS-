import { useState, useRef, useCallback, useEffect } from "react";
import { MAX_HISTORY, HANDLES, MIN_SIZE } from "../constants";
import {
  createElement, layerOps, getSnapLines, applySnap,
  snapToGrid, exportCanvasPNG,
} from "../utils/canvasUtils";

export function useCanvasEditor() {
  const viewportRef      = useRef(null);
  const canvasSurfaceRef = useRef(null);

  const [zoom, setZoom]                   = useState(1);
  const [canvasOffset, setCanvasOffset]   = useState({ x: 0, y: 0 });
  const [elements, setElements]           = useState([]);
  const [selectedId, setSelectedId]       = useState(null);
  const [notification, setNotification]   = useState(null);
  const [contextMenu, setContextMenu]     = useState(null);
  const [showHistory, setShowHistory]     = useState(false);

  // Snap / guide settings
  const [snapGrid, setSnapGrid]           = useState(false);
  const [snapAlignment, setSnapAlignment] = useState(true);
  const [showGrid, setShowGrid]           = useState(false);
  const [activeGuides, setActiveGuides]   = useState([]);

  // Undo / redo
  const [history, setHistory]             = useState([]);
  const [future,  setFuture]              = useState([]);
  const [historyLabels, setHistoryLabels] = useState([]);

  // Interaction state
  const dragState   = useRef(null);
  const resizeState = useRef(null);
  const panState    = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isPanning,  setIsPanning]  = useState(false);

  // Stable refs for callbacks
  const zoomRef         = useRef(zoom);
  const canvasOffsetRef = useRef(canvasOffset);
  const elementsRef     = useRef(elements);
  const snapGridRef     = useRef(snapGrid);
  const snapAlignRef    = useRef(snapAlignment);
  useEffect(() => { zoomRef.current = zoom; },              [zoom]);
  useEffect(() => { canvasOffsetRef.current = canvasOffset; }, [canvasOffset]);
  useEffect(() => { elementsRef.current = elements; },      [elements]);
  useEffect(() => { snapGridRef.current = snapGrid; },      [snapGrid]);
  useEffect(() => { snapAlignRef.current = snapAlignment; }, [snapAlignment]);

  // ── Notification ───────────────────────────────────────────────
  const showNotification = useCallback((msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  }, []);

  // ── History ────────────────────────────────────────────────────
  const pushHistory = useCallback((prevEls, label = "action") => {
    setHistory(h => [...h.slice(-MAX_HISTORY + 1), prevEls]);
    setHistoryLabels(l => [...l.slice(-MAX_HISTORY + 1), label]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    setHistory(h => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setFuture(f => [elementsRef.current, ...f]);
      setElements(prev);
      setSelectedId(null);
      showNotification("↩ Undo");
      return h.slice(0, -1);
    });
  }, [showNotification]);

  const redo = useCallback(() => {
    setFuture(f => {
      if (!f.length) return f;
      const next = f[0];
      setHistory(h => [...h, elementsRef.current]);
      setElements(next);
      setSelectedId(null);
      showNotification("↪ Redo");
      return f.slice(1);
    });
  }, [showNotification]);

  const jumpToHistory = useCallback((index) => {
    setHistory(prev => {
      setFuture(fut => {
        const allStates = [...prev, elementsRef.current, ...fut];
        const target = allStates[index];
        if (!target) return fut;
        setElements(target);
        setSelectedId(null);
        showNotification("Jumped to history state");
        setTimeout(() => {
          setHistory(allStates.slice(0, index));
          setFuture(allStates.slice(index + 1));
        }, 0);
        return fut;
      });
      return prev;
    });
  }, [showNotification]);

  // ── Element CRUD ───────────────────────────────────────────────
  const addElement = useCallback((type) => {
    pushHistory(elementsRef.current, "add");
    const el = createElement(type);
    setElements(p => [...p, el]);
    setSelectedId(el.id);
    showNotification(`✦ ${type} added`);
  }, [pushHistory, showNotification]);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    pushHistory(elementsRef.current, "delete");
    setElements(p => p.filter(el => el.id !== selectedId));
    setSelectedId(null);
    showNotification("⌫ Element deleted");
  }, [selectedId, pushHistory, showNotification]);

  const deleteById = useCallback((id) => {
    pushHistory(elementsRef.current, "delete");
    setElements(p => p.filter(el => el.id !== id));
    setSelectedId(prev => prev === id ? null : prev);
    showNotification("⌫ Element deleted");
  }, [pushHistory, showNotification]);

  const deleteAll = useCallback(() => {
    if (!elementsRef.current.length) return;
    pushHistory(elementsRef.current, "clear");
    setElements([]); setSelectedId(null);
    showNotification("🗑 All deleted");
  }, [pushHistory, showNotification]);

  const duplicateById = useCallback((id) => {
    const el = elementsRef.current.find(e => e.id === id);
    if (!el) return;
    pushHistory(elementsRef.current, "duplicate");
    const copy = { ...el, id: Date.now(), x: el.x + 20, y: el.y + 20 };
    setElements(p => [...p, copy]);
    setSelectedId(copy.id);
    showNotification("⎘ Duplicated");
  }, [pushHistory, showNotification]);

  // Tracks whether we've already snapshotted for the current "edit session"
  const editSnapshotRef = useRef(null);

  const updateSelectedProp = useCallback((key, val) => {
    if (!selectedId) return;
    // Only snapshot once per edit session (first change), not on every keystroke/slider tick
    if (!editSnapshotRef.current) {
      editSnapshotRef.current = elementsRef.current;
      setHistory(h => [...h.slice(-MAX_HISTORY + 1), editSnapshotRef.current]);
      setHistoryLabels(l => [...l.slice(-MAX_HISTORY + 1), "edit"]);
      setFuture([]);
    }
    setElements(p => p.map(el => el.id === selectedId ? { ...el, [key]: val } : el));
  }, [selectedId]);

  // Reset edit snapshot when selection changes
  useEffect(() => { editSnapshotRef.current = null; }, [selectedId]);

  // ── Layer operations ───────────────────────────────────────────
  const layerAction = useCallback((action) => {
    if (!selectedId) return;
    setElements(p => layerOps[action](p, selectedId));
  }, [selectedId]);

  const handleLayerReorder = useCallback((fromId, toIndex) => {
    setElements(p => layerOps.moveToIndex(p, fromId, p.length - 1 - toIndex));
  }, []);

  // ── Export ─────────────────────────────────────────────────────
  const exportPNG = useCallback(async () => {
    if (!canvasSurfaceRef.current) return;
    showNotification("📸 Exporting PNG…");
    try {
      await exportCanvasPNG(canvasSurfaceRef.current);
      showNotification("✅ PNG exported!");
    } catch {
      showNotification("❌ Export failed");
    }
  }, [showNotification]);

  // ── Mouse interactions ─────────────────────────────────────────
  const handleElementMouseDown = useCallback((e, id) => {
    e.stopPropagation();
    setSelectedId(id);
    setElements(prev => {
      const el = prev.find(el => el.id === id);
      if (!el) return prev;
      dragState.current = {
        id, startMouseX: e.clientX, startMouseY: e.clientY,
        startElX: el.x, startElY: el.y, snapshot: prev,
      };
      return prev;
    });
    setIsDragging(true);
  }, []);

  const handleResizeStart = useCallback((e, handleId) => {
    if (!selectedId) return;
    e.stopPropagation(); e.preventDefault();
    setElements(prev => {
      const el = prev.find(el => el.id === selectedId);
      if (!el) return prev;
      resizeState.current = {
        id: selectedId, handle: HANDLES.find(h => h.id === handleId),
        startMouseX: e.clientX, startMouseY: e.clientY,
        startX: el.x, startY: el.y, startW: el.width, startH: el.height,
        snapshot: prev,
      };
      return prev;
    });
    setIsResizing(true);
  }, [selectedId]);

  const handleGlobalMouseMove = useCallback((e) => {
    const z = zoomRef.current;

    if (resizeState.current) {
      const { id, handle, startMouseX, startMouseY, startX, startY, startW, startH } = resizeState.current;
      const dx = (e.clientX - startMouseX) / z;
      const dy = (e.clientY - startMouseY) / z;
      let nx = startX, ny = startY, nw = startW, nh = startH;
      if (handle.right)  nw = Math.max(MIN_SIZE, Math.round(startW + dx));
      if (handle.bottom) nh = Math.max(MIN_SIZE, Math.round(startH + dy));
      if (handle.left)  { const w = Math.max(MIN_SIZE, Math.round(startW - dx)); nx = Math.round(startX + startW - w); nw = w; }
      if (handle.top)   { const h = Math.max(MIN_SIZE, Math.round(startH - dy)); ny = Math.round(startY + startH - h); nh = h; }
      if (snapGridRef.current) { nw = snapToGrid(nw); nh = snapToGrid(nh); }
      setElements(p => p.map(el => el.id === id ? { ...el, x: nx, y: ny, width: nw, height: nh } : el));
      return;
    }

    if (dragState.current) {
      const { id, startMouseX, startMouseY, startElX, startElY } = dragState.current;
      const dx = (e.clientX - startMouseX) / z;
      const dy = (e.clientY - startMouseY) / z;
      const movingEl = elementsRef.current.find(el => el.id === id);
      if (!movingEl) return;
      const tentative = { ...movingEl, x: startElX + dx, y: startElY + dy };
      const snapLines = getSnapLines(elementsRef.current, id);
      const { x, y, guides } = applySnap(tentative, snapLines, snapGridRef.current, snapAlignRef.current);
      setActiveGuides(guides);
      setElements(p => p.map(el => el.id === id ? { ...el, x: Math.round(x), y: Math.round(y) } : el));
      return;
    }

    if (panState.current) {
      setCanvasOffset({
        x: e.clientX - panState.current.startMouseX + panState.current.startOffsetX,
        y: e.clientY - panState.current.startMouseY + panState.current.startOffsetY,
      });
    }
  }, []);

  const handleGlobalMouseUp = useCallback(() => {
    if (dragState.current?.snapshot) {
      setHistory(h => [...h.slice(-MAX_HISTORY + 1), dragState.current.snapshot]);
      setHistoryLabels(l => [...l.slice(-MAX_HISTORY + 1), "move"]);
      setFuture([]);
    }
    if (resizeState.current?.snapshot) {
      setHistory(h => [...h.slice(-MAX_HISTORY + 1), resizeState.current.snapshot]);
      setHistoryLabels(l => [...l.slice(-MAX_HISTORY + 1), "resize"]);
      setFuture([]);
    }
    dragState.current = resizeState.current = panState.current = null;
    setIsDragging(false); setIsResizing(false); setIsPanning(false);
    setActiveGuides([]);
  }, []);

  const handleViewportMouseDown = useCallback((e) => {
    const t = e.target;
    if (t === viewportRef.current || t.classList.contains("canvas-bg") || t.classList.contains("canvas-surface")) {
      setSelectedId(null);
      panState.current = {
        startMouseX: e.clientX, startMouseY: e.clientY,
        startOffsetX: canvasOffsetRef.current.x, startOffsetY: canvasOffsetRef.current.y,
      };
      setIsPanning(true);
    }
    setContextMenu(null);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(z => Math.min(Math.max(z * (e.deltaY > 0 ? 0.9 : 1.1), 0.2), 4));
  }, []);

  const handleContextMenu = useCallback((e, id) => {
    setSelectedId(id);
    setContextMenu({ x: e.clientX, y: e.clientY, elId: id });
  }, []);

  // ── Keyboard shortcuts ─────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSelected(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") { e.preventDefault(); if (selectedId) duplicateById(selectedId); }
      if (e.key === "Escape") { setSelectedId(null); setContextMenu(null); }
      if (e.key === "g" || e.key === "G") setSnapGrid(v => !v);
      if (e.key === "a" || e.key === "A") setSnapAlignment(v => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteSelected, undo, redo, selectedId, duplicateById]);

  useEffect(() => {
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup",   handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup",   handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  // ── Derived state ──────────────────────────────────────────────
  const selectedEl  = elements.find(el => el.id === selectedId) ?? null;
  const selectedIdx = elements.findIndex(el => el.id === selectedId);
  const atTop    = selectedIdx === elements.length - 1;
  const atBottom = selectedIdx === 0;
  const viewportCursor = isDragging || isResizing || isPanning ? "grabbing" : "default";

  return {
    // refs
    viewportRef, canvasSurfaceRef,
    // canvas state
    zoom, setZoom, canvasOffset, setCanvasOffset,
    // elements
    elements, setElements, selectedId, setSelectedId, selectedEl, selectedIdx, atTop, atBottom,
    // history
    history, future, historyLabels, showHistory, setShowHistory, jumpToHistory,
    // snap
    snapGrid, setSnapGrid, snapAlignment, setSnapAlignment, showGrid, setShowGrid, activeGuides,
    // interaction
    isDragging, isResizing, isPanning, viewportCursor,
    // notifications
    notification,
    // context menu
    contextMenu, setContextMenu,
    // actions
    addElement, deleteSelected, deleteById, deleteAll, duplicateById,
    updateSelectedProp, layerAction, handleLayerReorder, exportPNG,
    undo, redo,
    // handlers
    handleElementMouseDown, handleResizeStart,
    handleViewportMouseDown, handleWheel, handleContextMenu,
  };
}
