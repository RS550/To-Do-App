import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import JAR_BG from "./assets/jarV3.png";
import JAR_OVERLAY from "./assets/jarTopV3.png";
import ORB_SILHOUETTE from "./assets/starBase300.png"; // flat, fully-opaque shape — used as a recolorable mask
import ORB_SHADING from "./assets/star300.png"; // painted highlight/shadow ink, same on every orb

// Interior region as a fraction of the jar image (measured from the artwork),
// i.e. the area that sits "inside the glass" where orbs should be visible.
const INTERIOR = {
  left: 0.2,
  top: 0.2,
  right: 0.72,
  bottom: 0.746,
};

// Native pixel dimensions of the orb art, used to keep orbs from being
// stretched into circles they were never drawn as.
const ORB_ART_SIZE = { width: 125, height: 116 };
const ORB_ASPECT = ORB_ART_SIZE.width / ORB_ART_SIZE.height;

// Preset color options for filled orbs. Cycled through by index unless
// a single `filledColor` override is passed.
const DEFAULT_PALETTE = [
    "#eedfc1", "#f5d491", 
    "#699edb",  "#a7c9f0",
    "#f7aeec", "#f899dd",
    "#d096fa", "#bd81e8"

];

const DEFAULT_EMPTY_COLOR = "#d6dcec"; // dormant, muted slate

// deterministic pseudo-random, so layout doesn't reshuffle on every render
function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/**
 * JarOrbs
 *
 * Renders a jar (built from a solid background image + a transparent
 * "glass" overlay image) containing draggable, gently floating star orbs.
 *
 * Each orb is built from two layers:
 *  1. A flat, fully-opaque silhouette, tinted via CSS mask + background-color
 *     — this is what makes the orb recolorable.
 *  2. A painted shading layer (highlight/shadow ink) on top, composited
 *     normally so it darkens the tint consistently no matter what color
 *     was chosen or what's behind the orb.
 *
 * Props:
 *  - total    (number) total number of orbs to render inside the jar
 *  - filled   (number) how many of those orbs are "colored in" / active
 *  - size     (number, optional) rendered width of the jar in px (jar is square). Default 320.
 *  - palette     (string[], optional) list of CSS colors to cycle through for filled orbs
 *  - filledColor (string, optional) single CSS color override for ALL filled orbs (takes precedence over palette)
 *  - emptyColor  (string, optional) CSS color override for empty orbs
 *  - onOrderChange (function, optional) called with array of {index, x, y} when drag ends
 */
function JarCharms({
    total = 10,
  filled = 0,
  size = 320,
  palette = DEFAULT_PALETTE,
  filledColor,
  emptyColor,
  onOrderChange,
}) {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: size, height: size });
  const [positions, setPositions] = useState([]);
  const dragState = useRef(null); // { index, offsetX, offsetY }
  const [draggingIndex, setDraggingIndex] = useState(null);
 
  const clampedFilled = Math.max(0, Math.min(filled, total));
 
  // Track rendered size responsively
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setDims({ width: rect.width, height: rect.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
 
  const interiorPx = useMemo(() => {
    const { width, height } = dims;
    return {
      left: INTERIOR.left * width,
      top: INTERIOR.top * height,
      right: INTERIOR.right * width,
      bottom: INTERIOR.bottom * height,
      width: (INTERIOR.right - INTERIOR.left) * width,
      height: (INTERIOR.bottom - INTERIOR.top) * height,
    };
  }, [dims]);
 
  // Column count for the pile: wide enough that orbs spread sideways
  // before stacking upward, like objects settling under gravity.
  const pileCols = useCallback((count, interiorWidthPx) => {
    const natural = Math.round(Math.sqrt(count * 1.5));
    const maxByWidth = Math.max(1, Math.floor(interiorWidthPx / 18)); // never thinner than ~18px/orb
    return Math.min(Math.max(natural, 3), Math.max(maxByWidth, 1));
  }, []);
 
  // Orb footprint (width/height in px). Sized from a natural target width
  // first (so a few orbs don't balloon to fill the whole jar height); only
  // shrinks further if the resulting pile would be taller than the interior.
  const orbSize = useMemo(() => {
    if (total <= 0 || !interiorPx.width || !interiorPx.height) {
      return { width: 0, height: 0 };
    }
    const pad = .9;
    const cols = pileCols(total, interiorPx.width) + .003;
    const rows = Math.max(1, Math.ceil(total / cols));
 
    let width = (interiorPx.width / cols) * pad  +3;
    let height = width / ORB_ASPECT + 4;
 
    // rowSpacing mirrors what the layout effect uses below
    const rowSpacing = height / pad;
    const pileHeight = rows * rowSpacing;
    if (pileHeight > interiorPx.height) {
      const shrink = interiorPx.height / pileHeight;
      width *= shrink;
      height *= shrink;
    }
 
    return { width: Math.max(6, width), height: Math.max(6, height) };
  }, [total, interiorPx, pileCols]);
 
  // Lay orbs out bottom-up: full rows stack from the floor, with the
  // partial remainder row (if any) resting on top — like a poured pile.
  useEffect(() => {
    if (!interiorPx.width || !interiorPx.height || total <= 0 || !orbSize.width) {
      setPositions([]);
      return;
    }
    const cols = pileCols(total, interiorPx.width);
    const rows = Math.max(1, Math.ceil(total / cols));
    const pad = 0.82;
    const cellW = interiorPx.width / cols;
    const rowSpacing = orbSize.height / pad;
 
    // rowCounts[0] is the bottom-most row; full rows come first, any
    // partial remainder ends up in the last (topmost) row.
    const rowCounts = [];
    let remaining = total;
    for (let r = 0; r < rows; r++) {
      const isTopRow = r === rows - 1;
      const count = isTopRow ? remaining : Math.min(cols, remaining);
      rowCounts.push(count);
      remaining -= count;
    }
 
    const next = [];
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const countInRow = rowCounts[r];
      const rowWidth = countInRow * cellW;
      const rowOffsetX = (interiorPx.width - rowWidth) / 2;
      const cy = interiorPx.bottom - (r + 0.5) * rowSpacing;
      for (let c = 0; c < countInRow; c++) {
        const jitterX = (seededRandom(idx * 3.1) - 0.5) * cellW * 0.22;
        const jitterY = (seededRandom(idx * 7.7) - 0.5) * rowSpacing * 0.12;
        const cx = interiorPx.left + rowOffsetX + (c + 0.5) * cellW + jitterX;
        next.push({ x: cx, y: cy + jitterY });
        idx++;
      }
    }
    setPositions(next);
    // Re-layout when the orb count or interior size meaningfully changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, Math.round(interiorPx.width), Math.round(interiorPx.height), orbSize.width]);
 
  const clampToInterior = useCallback(
    (x, y) => {
      const halfW = orbSize.width / 2;
      const halfH = orbSize.height / 2;
      const minX = interiorPx.left + halfW;
      const maxX = interiorPx.right - halfW;
      const minY = interiorPx.top + halfH;
      const maxY = interiorPx.bottom - halfH;
      return {
        x: Math.min(Math.max(x, Math.min(minX, maxX)), Math.max(minX, maxX)),
        y: Math.min(Math.max(y, Math.min(minY, maxY)), Math.max(minY, maxY)),
      };
    },
    [interiorPx, orbSize]
  );
 
  const handlePointerDown = (e, index) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pos = positions[index];
    dragState.current = {
      index,
      offsetX: e.clientX - rect.left - pos.x,
      offsetY: e.clientY - rect.top - pos.y,
    };
    setDraggingIndex(index);
    e.target.setPointerCapture?.(e.pointerId);
  };
 
  const handlePointerMove = (e) => {
    const drag = dragState.current;
    const container = containerRef.current;
    if (!drag || !container) return;
    const rect = container.getBoundingClientRect();
    const rawX = e.clientX - rect.left - drag.offsetX;
    const rawY = e.clientY - rect.top - drag.offsetY;
    const clamped = clampToInterior(rawX, rawY);
    setPositions((prev) => {
      const next = [...prev];
      next[drag.index] = clamped;
      return next;
    });
  };
 
  const endDrag = () => {
    if (dragState.current && onOrderChange) {
      onOrderChange(
        positions.map((p, i) => ({ index: i, x: p.x, y: p.y }))
      );
    }
    dragState.current = null;
    setDraggingIndex(null);
  };
 
  return (
    <div
    className='jar-charm'
      ref={containerRef}
      style={{
        position: "relative",
        width: size,
        height: size,
        maxWidth: "100%",
        aspectRatio: "1 / 1",
        userSelect: "none",
        touchAction: "none",
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      {/* Background: solid jar */}
      <img
        src={JAR_BG}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
 
      {/* Orbs layer, sits between the solid jar and the glass overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        {positions.map((pos, i) => {
          const isFilled = i < clampedFilled;
          const isDragging = draggingIndex === i;
          const paletteColor = palette[i % palette.length];
          const baseColor = isFilled
            ? filledColor || paletteColor
            : emptyColor || DEFAULT_EMPTY_COLOR;
          const { width, height } = orbSize;
          const wobbleDuration = 3.2 + seededRandom(i * 5.2) * 2.2;
          const wobbleDelay = -seededRandom(i * 2.3) * wobbleDuration;
 
          return (
            <div
              key={i}
              onPointerDown={(e) => handlePointerDown(e, i)}
              style={{
                position: "absolute",
                left: pos.x - width / 2,
                top: pos.y - height / 2,
                width,
                height,
                cursor: isDragging ? "grabbing" : "grab",
                zIndex: isDragging ? 30 : 2,
                transition: isDragging
                  ? "none"
                  : "left 0.25s ease, top 0.25s ease",
                animation: isDragging
                  ? "none"
                  : `jar-orb-settle ${wobbleDuration}s ease-in-out ${wobbleDelay}s infinite`,
              }}
            >
              {/* recolorable base fill, masked to the star's silhouette */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: baseColor,
                  WebkitMaskImage: `url(${ORB_SILHOUETTE})`,
                  maskImage: `url(${ORB_SILHOUETTE})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />
              {/* painted shading, always the same, composited on top */}
              <img
                src={ORB_SHADING}
                alt=""
                draggable={false}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          );
        })}
      </div>
 
      {/* Foreground: transparent glass overlay, occludes anything outside the interior */}
      <img
        src={JAR_OVERLAY}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
 
      <style>{`
        @keyframes jar-orb-settle {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
}

export default JarCharms;
 
