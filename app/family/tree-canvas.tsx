"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FamilyData, Person } from "@/lib/family-data";
import { formatLifeRange } from "@/lib/family-data";

type FamilyTreeCanvasProps = {
  data: FamilyData;
};

type MainNodePosition = {
  id: string;
  x: number;
  y: number;
};

type SideNodePosition = {
  id: string;
  personId: string;
  anchorId: string;
  x: number;
  y: number;
};

type Edge = {
  fromKey: string;
  toKey: string;
  dashed?: boolean;
};

type Viewport = {
  x: number;
  y: number;
  scale: number;
};

const NODE_WIDTH = 170;
const NODE_HEIGHT = 222;
const MAIN_Y_GAP = 310;
const MAIN_X_SPREAD = 380;
const SIDE_SIBLING_X_GAP = 250;
const MIN_SCALE = 0.45;
const MAX_SCALE = 1.8;
const ANCESTOR_SLOT_GAP = 240;
const DRAG_THRESHOLD_PX = 6;

export function FamilyTreeCanvas({ data }: FamilyTreeCanvasProps) {
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({});
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, scale: 0.78 });

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragOriginRef = useRef({ pointerX: 0, pointerY: 0, viewportX: 0, viewportY: 0 });
  const dragPendingRef = useRef(false);

  const peopleById = useMemo(
    () => new Map<string, Person>(data.people.map((person) => [person.id, person])),
    [data.people],
  );

  const layout = useMemo(() => {
    const rootId = data.rootPersonId;
    const rootPerson = peopleById.get(rootId);

    if (!rootPerson) {
      return null;
    }

    const mainNodes = new Map<string, MainNodePosition>();
    const sideNodes = new Map<string, SideNodePosition>();
    const edges: Edge[] = [];

    const addMainNode = (id: string, x: number, y: number) => {
      if (!peopleById.has(id) || mainNodes.has(id)) {
        return;
      }
      mainNodes.set(id, { id, x, y });
    };
    const addSideNode = (id: string, personId: string, anchorId: string, x: number, y: number) => {
      if (!peopleById.has(personId) || sideNodes.has(id)) {
        return;
      }
      sideNodes.set(id, { id, personId, anchorId, x, y });
    };

    addMainNode(rootId, 0, 0);

    const getAncestorX = (depth: number, slotIndex: number) => {
      const slotCount = 2 ** depth;
      return (slotIndex - (slotCount - 1) / 2) * ANCESTOR_SLOT_GAP;
    };

    const placeAncestors = (personId: string, depth: number, slotIndex: number) => {
      if (depth >= 3) {
        return;
      }

      const person = peopleById.get(personId);
      if (!person) {
        return;
      }

      person.parents.slice(0, 2).forEach((parentId, index) => {
        if (!peopleById.has(parentId)) {
          return;
        }

        const nextDepth = depth + 1;
        const parentSlotIndex = slotIndex * 2 + index;
        const parentX = getAncestorX(nextDepth, parentSlotIndex);
        const parentY = -(depth + 1) * MAIN_Y_GAP;
        addMainNode(parentId, parentX, parentY);

        edges.push({ fromKey: parentId, toKey: personId });
        placeAncestors(parentId, nextDepth, parentSlotIndex);
      });
    };

    const placeDescendants = (personId: string, depth: number, x: number, spread: number) => {
      if (depth >= 2) {
        return;
      }

      const person = peopleById.get(personId);
      if (!person || person.children.length === 0) {
        return;
      }

      const count = person.children.length;

      person.children.forEach((childId, index) => {
        if (!peopleById.has(childId)) {
          return;
        }

        const offset = (index - (count - 1) / 2) * spread;
        const childX = x + offset;
        const childY = (depth + 1) * MAIN_Y_GAP;
        addMainNode(childId, childX, childY);

        edges.push({ fromKey: personId, toKey: childId });
        placeDescendants(childId, depth + 1, childX, Math.max(spread * 0.65, 140));
      });
    };

    placeAncestors(rootId, 0, 0);
    placeDescendants(rootId, 0, 0, MAIN_X_SPREAD);

    mainNodes.forEach((mainNode) => {
      const person = peopleById.get(mainNode.id);
      if (!person || !expandedBranches[mainNode.id]) {
        return;
      }

      const siblingIds = getSiblingIds(person, peopleById);

      siblingIds.forEach((siblingId, index) => {
        const sideNodeId = `${mainNode.id}::sibling:${siblingId}`;
        const sideX = mainNode.x - (siblingIds.length - index) * SIDE_SIBLING_X_GAP;
        const sideY = mainNode.y;

        addSideNode(sideNodeId, siblingId, mainNode.id, sideX, sideY);
        edges.push({ fromKey: mainNode.id, toKey: sideNodeId, dashed: true });
      });
    });

    const allPositions = [
      ...Array.from(mainNodes.values()).map((node) => ({ key: node.id, x: node.x, y: node.y })),
      ...Array.from(sideNodes.values()).map((node) => ({ key: node.id, x: node.x, y: node.y })),
    ];

    const minX = Math.min(...allPositions.map((node) => node.x)) - NODE_WIDTH;
    const maxX = Math.max(...allPositions.map((node) => node.x)) + NODE_WIDTH;
    const minY = Math.min(...allPositions.map((node) => node.y)) - NODE_HEIGHT;
    const maxY = Math.max(...allPositions.map((node) => node.y)) + NODE_HEIGHT;

    const width = maxX - minX + 280;
    const height = maxY - minY + 280;

    const offsetX = -minX + 140;
    const offsetY = -minY + 140;

    const absolutePositions = new Map(
      allPositions.map((node) => [node.key, { x: node.x + offsetX, y: node.y + offsetY }]),
    );

    return {
      rootId,
      width,
      height,
      mainNodes: Array.from(mainNodes.values()),
      sideNodes: Array.from(sideNodes.values()),
      absolutePositions,
      edges,
    };
  }, [data.rootPersonId, expandedBranches, peopleById]);

  useEffect(() => {
    if (!layout || !containerRef.current) {
      return;
    }

    const rootPosition = layout.absolutePositions.get(layout.rootId);
    if (!rootPosition) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const nextScale = 0.78;

    setViewport({
      x: rect.width / 2 - rootPosition.x * nextScale,
      y: rect.height / 2 - rootPosition.y * nextScale,
      scale: nextScale,
    });
  }, [layout?.rootId]);

  if (!layout) {
    return <div className="grid h-full w-full place-items-center text-lg">No family data found.</div>;
  }

  const setScale = (targetScale: number) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setViewport((current) => {
      const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, targetScale));
      const worldX = (centerX - current.x) / current.scale;
      const worldY = (centerY - current.y) / current.scale;

      return {
        x: centerX - worldX * nextScale,
        y: centerY - worldY * nextScale,
        scale: nextScale,
      };
    });
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-[#FAF6ED]/90 px-3 py-2 text-sm shadow-sm ring-1 ring-[#CE955E]/30">
        <Link className="rounded-full px-3 py-1 hover:bg-[#F0EBD6]" href="/">
          Home
        </Link>
        <span className="text-[#CE955E]">/</span>
        <span>Family</span>
      </div>

      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-[#FAF6ED]/95 px-2 py-2 shadow-sm ring-1 ring-[#CE955E]/35">
        <button
          type="button"
          onClick={() => setScale(viewport.scale * 1.12)}
          className="h-9 w-9 rounded-full text-xl leading-none hover:bg-[#F0EBD6]"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setScale(viewport.scale / 1.12)}
          className="h-9 w-9 rounded-full text-xl leading-none hover:bg-[#F0EBD6]"
          aria-label="Zoom out"
        >
          -
        </button>
      </div>

      <div
        ref={containerRef}
        className="h-full w-full touch-none"
        onPointerDown={(event) => {
          if (event.button !== 0) {
            return;
          }

          const target = event.target as HTMLElement | null;
          if (target?.closest("[data-interactive='true']")) {
            return;
          }

          dragPendingRef.current = true;
          isDraggingRef.current = false;
          dragOriginRef.current = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            viewportX: viewport.x,
            viewportY: viewport.y,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragPendingRef.current && !isDraggingRef.current) {
            return;
          }

          const deltaX = event.clientX - dragOriginRef.current.pointerX;
          const deltaY = event.clientY - dragOriginRef.current.pointerY;
          const travel = Math.hypot(deltaX, deltaY);

          if (!isDraggingRef.current && travel >= DRAG_THRESHOLD_PX) {
            isDraggingRef.current = true;
          }

          if (!isDraggingRef.current) {
            return;
          }

          setViewport((current) => ({
            ...current,
            x: dragOriginRef.current.viewportX + deltaX,
            y: dragOriginRef.current.viewportY + deltaY,
          }));
        }}
        onPointerUp={(event) => {
          isDraggingRef.current = false;
          dragPendingRef.current = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={(event) => {
          isDraggingRef.current = false;
          dragPendingRef.current = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onWheel={(event) => {
          event.preventDefault();

          const rect = event.currentTarget.getBoundingClientRect();
          const pointX = event.clientX - rect.left;
          const pointY = event.clientY - rect.top;

          setViewport((current) => {
            const scaleFactor = event.deltaY > 0 ? 0.92 : 1.08;
            const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, current.scale * scaleFactor));
            const worldX = (pointX - current.x) / current.scale;
            const worldY = (pointY - current.y) / current.scale;

            return {
              x: pointX - worldX * nextScale,
              y: pointY - worldY * nextScale,
              scale: nextScale,
            };
          });
        }}
      >
        <div
          className="relative"
          style={{
            width: layout.width,
            height: layout.height,
            transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.scale})`,
            transformOrigin: "0 0",
          }}
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            {layout.edges.map((edge, index) => {
              const from = layout.absolutePositions.get(edge.fromKey);
              const to = layout.absolutePositions.get(edge.toKey);
              if (!from || !to) {
                return null;
              }

              const x1 = from.x + NODE_WIDTH / 2;
              const y1 = from.y + NODE_HEIGHT;
              const x2 = to.x + NODE_WIDTH / 2;
              const y2 = to.y;

              return (
                <path
                  key={`${edge.fromKey}-${edge.toKey}-${index}`}
                  d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
                  fill="none"
                  stroke="#BE8A57"
                  strokeOpacity={edge.dashed ? 0.55 : 0.74}
                  strokeWidth={edge.dashed ? 1.3 : 1.7}
                  strokeDasharray={edge.dashed ? "5 7" : undefined}
                />
              );
            })}
          </svg>

          {layout.mainNodes.map((node) => {
            const person = peopleById.get(node.id);
            const absolute = layout.absolutePositions.get(node.id);

            if (!person || !absolute) {
              return null;
            }

            const sideCount = getSiblingIds(person, peopleById).length;

            return (
              <PersonCard
                key={node.id}
                person={person}
                x={absolute.x}
                y={absolute.y}
                showBranchToggle={sideCount > 0}
                isBranchOpen={!!expandedBranches[node.id]}
                onToggleBranch={() =>
                  setExpandedBranches((current) => ({
                    ...current,
                    [node.id]: !current[node.id],
                  }))
                }
              />
            );
          })}

          {layout.sideNodes.map((node) => {
            const person = peopleById.get(node.personId);
            const absolute = layout.absolutePositions.get(node.id);

            if (!person || !absolute) {
              return null;
            }

            return (
              <PersonCard
                key={node.id}
                person={person}
                x={absolute.x}
                y={absolute.y}
                showBranchToggle={false}
                isSideBranch
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getSiblingIds(person: Person, peopleById: Map<string, Person>): string[] {
  const siblingIdsFromParents = person.parents.flatMap((parentId) => {
    const parent = peopleById.get(parentId);
    return parent?.children ?? [];
  });

  const preferred = siblingIdsFromParents.length > 0 ? siblingIdsFromParents : person.siblings ?? [];
  const unique = Array.from(new Set(preferred));
  return unique.filter((id) => id !== person.id && peopleById.has(id));
}

type PersonCardProps = {
  person: Person;
  x: number;
  y: number;
  showBranchToggle: boolean;
  isBranchOpen?: boolean;
  isSideBranch?: boolean;
  onToggleBranch?: () => void;
};

function PersonCard({
  person,
  x,
  y,
  showBranchToggle,
  isBranchOpen = false,
  isSideBranch = false,
  onToggleBranch,
}: PersonCardProps) {
  return (
    <article
      className="absolute rounded-[28px] border bg-[#FAF6ED] p-4 text-center shadow-sm transition hover:shadow-md"
      style={{
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        left: x,
        top: y,
        borderColor: isSideBranch ? "rgba(206, 149, 94, 0.38)" : "rgba(206, 149, 94, 0.54)",
      }}
    >
      {showBranchToggle ? (
        <button
          type="button"
          data-interactive="true"
          className="absolute -right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-[#CE955E]/70 bg-[#FAF6ED] text-lg leading-none shadow-sm hover:bg-[#F0EBD6]"
          onClick={onToggleBranch}
          aria-label={isBranchOpen ? "Hide relatives" : "Show relatives"}
        >
          {isBranchOpen ? "-" : "+"}
        </button>
      ) : null}

      <Link href={`/family/person/${person.id}`} className="block" data-interactive="true">
        <Image
          src={person.portrait}
          alt={person.name}
          width={96}
          height={96}
          className="mx-auto h-24 w-24 rounded-full border-2 border-[#CE955E]/50 object-cover transition duration-200 hover:scale-105"
          draggable={false}
        />
      </Link>

      <h3 className="mt-4 text-lg font-semibold leading-tight">{person.name}</h3>
      <p className="mt-2 text-sm text-[#5B4630]">{formatLifeRange(person)}</p>
    </article>
  );
}
