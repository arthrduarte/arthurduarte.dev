"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MaximizeIcon, MinusIcon, PlusIcon, StarIcon } from "lucide-react";

import {
  buildArchiveGraph,
  computeInitialPositions,
  type ArchiveGraphEdge,
} from "@/lib/archive/graph";
import type { ArchiveItemRecord } from "@/lib/archive/types";
import { cn } from "@/lib/utils";

type ArchiveConstellationProps = {
  items: ArchiveItemRecord[];
  /** Ids that pass the active search/tag filter. `null` means no filter. */
  matchedIds: Set<string> | null;
  onOpenDetails: (item: ArchiveItemRecord) => void;
};

// Force-simulation constants. Tuned for a few dozen warm, loosely-clustered
// nodes; all distances are in world units (1 unit = 1px at zoom 1).
const FORCE = {
  repulsion: 26000,
  minRepelDist: 40,
  springLength: 150,
  springStrength: 0.012,
  gravity: 0.015,
  matchedGravity: 0.06,
  ringPush: 0.05,
  velocityDecay: 0.82,
  alphaReheat: 0.7,
  alphaMin: 0.02,
  alphaDecay: 0.022,
};

const ZOOM = { min: 0.35, max: 2.4, step: 1.2 };
const NODE_SIZE = 72;

type SimState = {
  ids: string[];
  index: Map<string, number>;
  px: Float64Array;
  py: Float64Array;
  vx: Float64Array;
  vy: Float64Array;
  edges: { a: number; b: number; weight: number }[];
  ringRadius: number;
  alpha: number;
};

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduce;
}

/** Advance the simulation by one tick. Mutates the position/velocity arrays. */
function tick(state: SimState, matchedIds: Set<string> | null): void {
  const { px, py, vx, vy, edges, ids } = state;
  const n = ids.length;
  const filtering = matchedIds !== null;

  const fx = new Float64Array(n);
  const fy = new Float64Array(n);

  // Pairwise repulsion (O(n^2) — fine for the dozens of items we expect).
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      let dx = px[i] - px[j];
      let dy = py[i] - py[j];
      let distSq = dx * dx + dy * dy;

      if (distSq === 0) {
        dx = (i - j) * 0.5 + 0.1;
        dy = 0.1;
        distSq = dx * dx + dy * dy;
      }

      const dist = Math.sqrt(distSq);
      const clamped = Math.max(dist, FORCE.minRepelDist);
      const force = FORCE.repulsion / (clamped * clamped);
      const ux = dx / dist;
      const uy = dy / dist;

      fx[i] += ux * force;
      fy[i] += uy * force;
      fx[j] -= ux * force;
      fy[j] -= uy * force;
    }
  }

  // Springs along shared-tag edges. More shared tags pulls nodes closer.
  for (const edge of edges) {
    const dx = px[edge.b] - px[edge.a];
    const dy = py[edge.b] - py[edge.a];
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
    const target = FORCE.springLength / (1 + (edge.weight - 1) * 0.5);
    const force = (dist - target) * FORCE.springStrength;
    const ux = dx / dist;
    const uy = dy / dist;

    fx[edge.a] += ux * force;
    fy[edge.a] += uy * force;
    fx[edge.b] -= ux * force;
    fy[edge.b] -= uy * force;
  }

  // Centering gravity, plus filter-driven reorganization: matches are pulled
  // hard to the middle, non-matches pushed out past the ring.
  for (let i = 0; i < n; i += 1) {
    const matched = !filtering || matchedIds.has(ids[i]);
    const gravity = matched
      ? filtering
        ? FORCE.matchedGravity
        : FORCE.gravity
      : FORCE.gravity * 0.4;

    fx[i] -= px[i] * gravity;
    fy[i] -= py[i] * gravity;

    if (filtering && !matched) {
      const dist = Math.hypot(px[i], py[i]) || 0.001;
      if (dist < state.ringRadius) {
        const push = FORCE.ringPush * (state.ringRadius - dist);
        fx[i] += (px[i] / dist) * push;
        fy[i] += (py[i] / dist) * push;
      }
    }
  }

  for (let i = 0; i < n; i += 1) {
    vx[i] = (vx[i] + fx[i] * state.alpha) * FORCE.velocityDecay;
    vy[i] = (vy[i] + fy[i] * state.alpha) * FORCE.velocityDecay;
    px[i] += vx[i];
    py[i] += vy[i];
  }

  state.alpha += (0 - state.alpha) * FORCE.alphaDecay;
}

export function ArchiveConstellation({
  items,
  matchedIds,
  onOpenDetails,
}: ArchiveConstellationProps) {
  const reduceMotion = usePrefersReducedMotion();

  const { nodes, edges } = useMemo(() => buildArchiveGraph(items), [items]);

  const neighbors = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const node of nodes) {
      map.set(node.id, new Set());
    }
    for (const edge of edges) {
      map.get(edge.source)?.add(edge.target);
      map.get(edge.target)?.add(edge.source);
    }
    return map;
  }, [nodes, edges]);

  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef(new Map<string, HTMLButtonElement>());
  const edgeEls = useRef<(SVGLineElement | null)[]>([]);
  const simRef = useRef<SimState | null>(null);
  const cameraRef = useRef({ x: 0, y: 0, zoom: 1 });
  const rafRef = useRef<number | null>(null);
  const draggingNode = useRef<string | null>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Keep the latest matchedIds visible to the animation loop without
  // restarting it.
  const matchedIdsRef = useRef(matchedIds);
  matchedIdsRef.current = matchedIds;

  // Build / rebuild the simulation when the set of nodes changes.
  const sim = useMemo<SimState>(() => {
    const ids = nodes.map((node) => node.id);
    const index = new Map(ids.map((id, i) => [id, i] as const));
    const ringRadius = 200 + 70 * Math.sqrt(Math.max(ids.length, 1));
    const initial = computeInitialPositions(nodes, ringRadius * 0.7);

    const px = new Float64Array(ids.length);
    const py = new Float64Array(ids.length);
    ids.forEach((id, i) => {
      const point = initial.get(id)!;
      px[i] = point.x;
      py[i] = point.y;
    });

    const mappedEdges = edges.map((edge: ArchiveGraphEdge) => ({
      a: index.get(edge.source)!,
      b: index.get(edge.target)!,
      weight: edge.weight,
    }));

    return {
      ids,
      index,
      px,
      py,
      vx: new Float64Array(ids.length),
      vy: new Float64Array(ids.length),
      edges: mappedEdges,
      ringRadius,
      alpha: 1,
    };
  }, [nodes, edges]);

  simRef.current = sim;

  const applyCamera = useCallback(() => {
    const group = groupRef.current;
    if (!group) return;
    const { x, y, zoom } = cameraRef.current;
    group.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoom})`;
  }, []);

  const paint = useCallback(() => {
    const state = simRef.current;
    if (!state) return;

    for (let i = 0; i < state.ids.length; i += 1) {
      const el = nodeEls.current.get(state.ids[i]);
      if (el) {
        el.style.transform = `translate3d(${state.px[i]}px, ${state.py[i]}px, 0) translate(-50%, -50%)`;
      }
    }

    state.edges.forEach((edge, i) => {
      const line = edgeEls.current[i];
      if (line) {
        line.setAttribute("x1", String(state.px[edge.a]));
        line.setAttribute("y1", String(state.py[edge.a]));
        line.setAttribute("x2", String(state.px[edge.b]));
        line.setAttribute("y2", String(state.py[edge.b]));
      }
    });
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return;

    const step = () => {
      const state = simRef.current;
      if (!state) {
        rafRef.current = null;
        return;
      }

      tick(state, matchedIdsRef.current);
      paint();

      if (state.alpha > FORCE.alphaMin || draggingNode.current !== null) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [paint]);

  const reheat = useCallback(() => {
    const state = simRef.current;
    if (!state) return;
    state.alpha = FORCE.alphaReheat;
    if (!reduceMotion) startLoop();
  }, [reduceMotion, startLoop]);

  const fitView = useCallback(() => {
    const state = simRef.current;
    const container = containerRef.current;
    if (!state || !container) return;

    let maxR = 1;
    const matched = matchedIdsRef.current;
    for (let i = 0; i < state.ids.length; i += 1) {
      if (matched && !matched.has(state.ids[i])) continue;
      maxR = Math.max(maxR, Math.hypot(state.px[i], state.py[i]));
    }

    const rect = container.getBoundingClientRect();
    const fit = Math.min(rect.width, rect.height) / 2 / (maxR + NODE_SIZE);
    cameraRef.current = {
      x: 0,
      y: 0,
      zoom: Math.max(ZOOM.min, Math.min(ZOOM.max, fit)),
    };
    applyCamera();
  }, [applyCamera]);

  // Initial placement: settle synchronously so first paint has a real layout
  // (no center-stacked flash, SSR-stable), then hand off to the live loop.
  useLayoutEffect(() => {
    const state = simRef.current;
    if (!state) return;

    for (let i = 0; i < 220; i += 1) {
      tick(state, matchedIdsRef.current);
    }
    state.alpha = reduceMotion ? 0 : 0.15;
    paint();
    fitView();

    if (!reduceMotion) startLoop();

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // Re-settle only when the node set changes (sim identity) or motion pref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim, reduceMotion]);

  // React to filter changes: reorganize the field.
  useEffect(() => {
    const state = simRef.current;
    if (!state) return;

    if (reduceMotion) {
      for (let i = 0; i < 200; i += 1) tick(state, matchedIds);
      state.alpha = 0;
      paint();
      fitView();
    } else {
      reheat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedIds]);

  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current!;
    const rect = container.getBoundingClientRect();
    const cam = cameraRef.current;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return {
      x: (clientX - cx - cam.x) / cam.zoom,
      y: (clientY - cy - cam.y) / cam.zoom,
    };
  }, []);

  const zoomBy = useCallback(
    (factor: number, originX?: number, originY?: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const cam = cameraRef.current;
      const ox = originX ?? rect.left + rect.width / 2;
      const oy = originY ?? rect.top + rect.height / 2;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const worldX = (ox - cx - cam.x) / cam.zoom;
      const worldY = (oy - cy - cam.y) / cam.zoom;
      const zoom = Math.max(ZOOM.min, Math.min(ZOOM.max, cam.zoom * factor));

      cameraRef.current = {
        zoom,
        x: ox - cx - worldX * zoom,
        y: oy - cy - worldY * zoom,
      };
      applyCamera();
    },
    [applyCamera],
  );

  const onWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();
      zoomBy(event.deltaY < 0 ? 1.1 : 1 / 1.1, event.clientX, event.clientY);
    },
    [zoomBy],
  );

  // Background pan.
  const panStart = useRef<{ x: number; y: number; camX: number; camY: number } | null>(
    null,
  );

  const onBackgroundPointerDown = useCallback((event: React.PointerEvent) => {
    if (event.button !== 0) return;
    panStart.current = {
      x: event.clientX,
      y: event.clientY,
      camX: cameraRef.current.x,
      camY: cameraRef.current.y,
    };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }, []);

  const onBackgroundPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (draggingNode.current) {
        const world = screenToWorld(event.clientX, event.clientY);
        const state = simRef.current!;
        const i = state.index.get(draggingNode.current)!;
        state.px[i] = world.x;
        state.py[i] = world.y;
        state.vx[i] = 0;
        state.vy[i] = 0;
        return;
      }
      if (!panStart.current) return;
      cameraRef.current.x = panStart.current.camX + (event.clientX - panStart.current.x);
      cameraRef.current.y = panStart.current.camY + (event.clientY - panStart.current.y);
      applyCamera();
    },
    [applyCamera, screenToWorld],
  );

  const endInteraction = useCallback((event: React.PointerEvent) => {
    panStart.current = null;
    if (draggingNode.current) {
      draggingNode.current = null;
    }
    try {
      (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    } catch {
      // capture may already be gone
    }
  }, []);

  const onNodePointerDown = useCallback(
    (event: React.PointerEvent, id: string) => {
      if (reduceMotion) return;
      event.stopPropagation();
      draggingNode.current = id;
      reheat();
    },
    [reduceMotion, reheat],
  );

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full touch-none overflow-hidden"
      onWheel={onWheel}
      onPointerDown={onBackgroundPointerDown}
      onPointerMove={onBackgroundPointerMove}
      onPointerUp={endInteraction}
      onPointerLeave={endInteraction}
    >
      {/* Faint guide-grid to give depth while panning. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div
        ref={groupRef}
        className="absolute left-1/2 top-1/2 h-0 w-0 will-change-transform"
      >
        <svg
          className="pointer-events-none absolute overflow-visible"
          width={0}
          height={0}
        >
          {edges.map((edge, i) => {
            const lit =
              hoveredId === edge.source || hoveredId === edge.target;
            const dimmed =
              matchedIds !== null &&
              (!matchedIds.has(edge.source) || !matchedIds.has(edge.target));
            return (
              <line
                key={`${edge.source}-${edge.target}`}
                ref={(el) => {
                  edgeEls.current[i] = el;
                }}
                stroke="var(--primary)"
                strokeWidth={lit ? 1.4 : 0.8}
                className="transition-[stroke-opacity,stroke-width] duration-200 ease-out"
                strokeOpacity={lit ? 0.55 : dimmed ? 0.04 : 0.14}
              />
            );
          })}
        </svg>

        {nodes.map((node) => {
          const item = node.item;
          const matched = matchedIds === null || matchedIds.has(node.id);
          const isHovered = hoveredId === node.id;
          const isNeighbor =
            hoveredId !== null && neighbors.get(hoveredId)?.has(node.id);
          const dim = (!matched && !isHovered) || (hoveredId !== null && !isHovered && !isNeighbor);

          return (
            <button
              key={node.id}
              type="button"
              ref={(el) => {
                if (el) nodeEls.current.set(node.id, el);
                else nodeEls.current.delete(node.id);
              }}
              onPointerDown={(event) => onNodePointerDown(event, node.id)}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() =>
                setHoveredId((current) => (current === node.id ? null : current))
              }
              onClick={() => onOpenDetails(item)}
              className={cn(
                "group absolute left-0 top-0 flex cursor-pointer flex-col items-center outline-none will-change-transform",
                "transition-[opacity,filter] duration-200 ease-out",
                dim ? "opacity-25 blur-[0.5px]" : "opacity-100",
              )}
              style={{ zIndex: isHovered ? 30 : matched ? 10 : 1 }}
            >
              <span
                className={cn(
                  "relative grid place-items-center rounded-full border bg-card shadow-sm transition-transform duration-200 ease-out",
                  "group-hover:scale-110 group-active:scale-[0.97] group-focus-visible:scale-110",
                )}
                style={{
                  width: NODE_SIZE,
                  height: NODE_SIZE,
                  borderColor: `var(--chart-${node.colorIndex})`,
                  boxShadow: isHovered
                    ? `0 0 0 4px color-mix(in oklch, var(--chart-${node.colorIndex}) 22%, transparent)`
                    : undefined,
                }}
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt=""
                    draggable={false}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="text-lg font-semibold"
                    style={{ color: `var(--chart-${node.colorIndex})` }}
                  >
                    {item.title.slice(0, 1).toUpperCase()}
                  </span>
                )}

                {item.isFavorite ? (
                  <StarIcon
                    className="absolute -right-1 -top-1 size-4 fill-primary text-primary drop-shadow"
                    aria-hidden
                  />
                ) : null}
              </span>

              <span
                className={cn(
                  "pointer-events-none mt-2 max-w-[140px] truncate rounded-md bg-background/80 px-2 py-0.5 text-center text-xs font-medium text-foreground backdrop-blur-sm transition-opacity duration-200 ease-out",
                  isHovered || isNeighbor ? "opacity-100" : "opacity-0",
                )}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Zoom controls. */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-1.5">
        <ControlButton label="Zoom in" onClick={() => zoomBy(ZOOM.step)}>
          <PlusIcon className="size-4" />
        </ControlButton>
        <ControlButton label="Zoom out" onClick={() => zoomBy(1 / ZOOM.step)}>
          <MinusIcon className="size-4" />
        </ControlButton>
        <ControlButton label="Fit to view" onClick={fitView}>
          <MaximizeIcon className="size-4" />
        </ControlButton>
      </div>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-md border border-border/70 bg-card/80 text-muted-foreground shadow-sm backdrop-blur-sm transition hover:border-border hover:bg-card hover:text-foreground active:scale-[0.97]"
    >
      {children}
    </button>
  );
}
