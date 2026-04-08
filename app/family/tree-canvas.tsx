"use client";

import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FamilyPortrait } from "@/components/family-portrait";
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
  kind: "relative" | "spouse" | "child";
  parentKeys?: string[];
};

type FamilyGroup = {
  parentKeys: string[];
  childKeys: string[];
};

type VisibleNode = {
  key: string;
  personId: string;
  parentKeys?: string[];
};

type PartnerLink = {
  fromKey: string;
  toKey: string;
};

type BranchDirection = "left" | "right";

type Viewport = {
  x: number;
  y: number;
  scale: number;
};

const NODE_WIDTH = 170;
const NODE_HEIGHT = 222;
const MAIN_Y_GAP = 310;
const MAIN_X_SPREAD = 380;
const ROOT_SIBLING_X_GAP = 300;
const ROOT_PARTNER_X_GAP = 430;
const SIDE_BRANCH_START_OFFSET = 250;
const SIDE_CARD_X_STEP = NODE_WIDTH + 36;
const SIDE_CLUSTER_GAP = 84;
const SIDE_CHILD_Y_GAP = 290;
const SIDE_CHILD_X_STEP = 190;
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
    const partnerLinks: PartnerLink[] = [];
    const addMainNode = (id: string, x: number, y: number) => {
      if (!peopleById.has(id) || mainNodes.has(id)) {
        return;
      }
      mainNodes.set(id, { id, x, y });
    };
    const addSideNode = (
      id: string,
      personId: string,
      anchorId: string,
      x: number,
      y: number,
      kind: SideNodePosition["kind"],
      parentKeys?: string[],
    ) => {
      if (!peopleById.has(personId) || sideNodes.has(id)) {
        return;
      }
      sideNodes.set(id, { id, personId, anchorId, x, y, kind, parentKeys });
    };

    const naturalBranchNodes = new Set<string>();
    const rootPartnerPositions = new Map<string, number>();

    addMainNode(rootId, 0, 0);
    naturalBranchNodes.add(rootId);

    const rootPartnerIds = rootPerson.spouse.filter((personId) => peopleById.has(personId));
    rootPartnerIds.forEach((partnerId, partnerIndex) => {
      const partnerX = (partnerIndex + 1) * ROOT_PARTNER_X_GAP;

      addMainNode(partnerId, partnerX, 0);
      partnerLinks.push({ fromKey: rootId, toKey: partnerId });
      naturalBranchNodes.add(partnerId);
      rootPartnerPositions.set(partnerId, partnerX);
    });

    getSiblingIds(rootPerson, peopleById).forEach((siblingId, siblingIndex) => {
      addMainNode(siblingId, -(siblingIndex + 1) * ROOT_SIBLING_X_GAP, 0);
      naturalBranchNodes.add(siblingId);
    });

    rootPartnerIds.forEach((partnerId) => {
      const partner = peopleById.get(partnerId);
      const partnerX = rootPartnerPositions.get(partnerId);

      if (!partner || partnerX === undefined) {
        return;
      }

      getSiblingIds(partner, peopleById).forEach((siblingId, siblingIndex) => {
        addMainNode(siblingId, partnerX + (siblingIndex + 1) * ROOT_SIBLING_X_GAP, 0);
        naturalBranchNodes.add(siblingId);
      });
    });

    const getAncestorX = (depth: number, slotIndex: number, baseX: number) => {
      const slotCount = 2 ** depth;
      return baseX + (slotIndex - (slotCount - 1) / 2) * ANCESTOR_SLOT_GAP;
    };

    const placeAncestors = (personId: string, depth: number, slotIndex: number, baseX: number) => {
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
        const parentX = getAncestorX(nextDepth, parentSlotIndex, baseX);
        const parentY = -(depth + 1) * MAIN_Y_GAP;
        addMainNode(parentId, parentX, parentY);
        placeAncestors(parentId, nextDepth, parentSlotIndex, baseX);
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
        placeDescendants(childId, depth + 1, childX, Math.max(spread * 0.65, 140));
      });
    };

    placeAncestors(rootId, 0, 0, 0);
    rootPartnerIds.forEach((partnerId) => {
      const partnerX = rootPartnerPositions.get(partnerId);

      if (partnerX === undefined) {
        return;
      }

      placeAncestors(partnerId, 0, 0, partnerX);
    });
    placeDescendants(rootId, 0, 0, MAIN_X_SPREAD);

    mainNodes.forEach((mainNode) => {
      const person = peopleById.get(mainNode.id);
      if (!person || !expandedBranches[mainNode.id]) {
        return;
      }

      const siblingIds = getSiblingIds(person, peopleById);
      const branchDirection = mainNode.x >= 0 ? "right" : "left";
      const directionMultiplier = branchDirection === "right" ? 1 : -1;
      let branchOffset = SIDE_BRANCH_START_OFFSET;

      siblingIds.forEach((siblingId) => {
        const sideNodeId = `${mainNode.id}::sibling:${siblingId}`;
        const sideX = mainNode.x + directionMultiplier * branchOffset;
        const sideY = mainNode.y;

        addSideNode(sideNodeId, siblingId, mainNode.id, sideX, sideY, "relative");

        const sibling = peopleById.get(siblingId);
        const spouseCount = sibling?.spouse.length ?? 0;
        const partnerKeys = [sideNodeId];

        sibling?.spouse.forEach((spouseId, spouseIndex) => {
          const spouseNodeId = `${sideNodeId}::spouse:${spouseId}`;
          const spouseX = sideX + directionMultiplier * SIDE_CARD_X_STEP * (spouseIndex + 1);

          addSideNode(spouseNodeId, spouseId, sideNodeId, spouseX, sideY, "spouse");
          partnerLinks.push({ fromKey: sideNodeId, toKey: spouseNodeId });
          partnerKeys.push(spouseNodeId);
        });

        const childIds = sibling?.children ?? [];
        const clusterStartX = Math.min(
          sideX,
          ...partnerKeys
            .map((key) => sideNodes.get(key)?.x)
            .filter((value): value is number => value !== undefined),
        );
        const clusterEndX = Math.max(
          sideX,
          ...partnerKeys
            .map((key) => sideNodes.get(key)?.x)
            .filter((value): value is number => value !== undefined),
        );
        const clusterCenterX = (clusterStartX + clusterEndX) / 2;

        childIds.forEach((childId, childIndex) => {
          const childNodeId = `${sideNodeId}::child:${childId}`;
          const childOffset = (childIndex - (childIds.length - 1) / 2) * SIDE_CHILD_X_STEP;
          const childX = clusterCenterX + childOffset;
          const childY = sideY + SIDE_CHILD_Y_GAP;

          addSideNode(childNodeId, childId, sideNodeId, childX, childY, "child", partnerKeys);
        });

        branchOffset += (spouseCount + 1) * SIDE_CARD_X_STEP + SIDE_CLUSTER_GAP;
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

    const visibleNodes: VisibleNode[] = [
      ...Array.from(mainNodes.values()).map((node) => ({ key: node.id, personId: node.id })),
      ...Array.from(sideNodes.values())
        .filter((node) => node.kind !== "spouse")
        .map((node) => ({ key: node.id, personId: node.personId, parentKeys: node.parentKeys })),
    ];

    const familyGroupMap = new Map<string, FamilyGroup>();
    const branchDirections = new Map<string, BranchDirection>();

    visibleNodes.forEach((node) => {
      const person = peopleById.get(node.personId);
      if (!person) {
        return;
      }

      const parentKeys =
        node.parentKeys?.slice().sort() ?? person.parents.filter((parentId) => mainNodes.has(parentId)).sort();
      if (parentKeys.length === 0) {
        return;
      }

      const groupKey = parentKeys.join("|");
      const existingGroup = familyGroupMap.get(groupKey);

      if (existingGroup) {
        if (!existingGroup.childKeys.includes(node.key)) {
          existingGroup.childKeys.push(node.key);
        }
        return;
      }

      familyGroupMap.set(groupKey, {
        parentKeys,
        childKeys: [node.key],
      });
    });

    mainNodes.forEach((node) => {
      const person = peopleById.get(node.id);
      if (!person || naturalBranchNodes.has(node.id) || getSiblingIds(person, peopleById).length === 0) {
        return;
      }

      branchDirections.set(node.id, node.x >= 0 ? "right" : "left");
    });

    return {
      rootId,
      width,
      height,
      mainNodes: Array.from(mainNodes.values()),
      sideNodes: Array.from(sideNodes.values()),
      absolutePositions,
      familyGroups: Array.from(familyGroupMap.values()),
      partnerLinks,
      branchDirections,
      naturalBranchNodes,
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
            {layout.familyGroups.flatMap((group, groupIndex) =>
              getFamilyConnectorPaths(group, layout.absolutePositions).map((path, pathIndex) => (
                <path
                  key={`${group.parentKeys.join("|")}-${groupIndex}-${pathIndex}`}
                  d={path}
                  fill="none"
                  stroke="#BE8A57"
                  strokeOpacity={0.74}
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )),
            )}
            {layout.partnerLinks.map((link, index) => {
              const from = layout.absolutePositions.get(link.fromKey);
              const to = layout.absolutePositions.get(link.toKey);

              if (!from || !to) {
                return null;
              }

              const spouseOnRight = to.x > from.x;
              const x1 = spouseOnRight ? from.x + NODE_WIDTH : from.x;
              const x2 = spouseOnRight ? to.x : to.x + NODE_WIDTH;
              const y = from.y + NODE_HEIGHT / 2;

              return (
                <path
                  key={`${link.fromKey}-${link.toKey}-${index}`}
                  d={`M ${x1} ${y} L ${x2} ${y}`}
                  fill="none"
                  stroke="#BE8A57"
                  strokeOpacity={0.68}
                  strokeWidth={1.6}
                  strokeLinecap="round"
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
            const showBranchToggle = sideCount > 0 && !layout.naturalBranchNodes.has(node.id);

            return (
              <PersonCard
                key={node.id}
                person={person}
                x={absolute.x}
                y={absolute.y}
                showBranchToggle={showBranchToggle}
                branchDirection={layout.branchDirections.get(node.id) ?? "left"}
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
                branchDirection="left"
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
  return getSiblingSequence(person, peopleById).filter((id) => id !== person.id);
}

function getSiblingSequence(person: Person, peopleById: Map<string, Person>): string[] {
  const siblingIdsFromParents = person.parents.flatMap((parentId) => {
    const parent = peopleById.get(parentId);
    return parent?.children ?? [];
  });

  const preferred = siblingIdsFromParents.length > 0 ? siblingIdsFromParents : person.siblings ?? [];
  const unique = Array.from(new Set(preferred));
  return unique.filter((id) => peopleById.has(id));
}

function getFamilyConnectorPaths(
  group: FamilyGroup,
  positions: Map<string, { x: number; y: number }>,
): string[] {
  const parents = group.parentKeys
    .map((key) => positions.get(key))
    .filter((position): position is { x: number; y: number } => !!position)
    .map((position) => ({
      x: position.x + NODE_WIDTH / 2,
      y: position.y + NODE_HEIGHT,
    }))
    .sort((left, right) => left.x - right.x);

  const children = group.childKeys
    .map((key) => positions.get(key))
    .filter((position): position is { x: number; y: number } => !!position)
    .map((position) => ({
      x: position.x + NODE_WIDTH / 2,
      y: position.y,
    }))
    .sort((left, right) => left.x - right.x);

  if (parents.length === 0 || children.length === 0) {
    return [];
  }

  const parentY = Math.max(...parents.map((parent) => parent.y));
  const childY = Math.min(...children.map((child) => child.y));
  const gap = childY - parentY;
  const railY = Math.max(parentY + 26, Math.min(childY - 26, parentY + gap * 0.45));
  const trunkX =
    parents.length > 1 ? (parents[0].x + parents[parents.length - 1].x) / 2 : parents[0].x;
  const railStart = Math.min(trunkX, ...children.map((child) => child.x));
  const railEnd = Math.max(trunkX, ...children.map((child) => child.x));

  const paths: string[] = [];

  if (parents.length > 1) {
    paths.push(`M ${parents[0].x} ${parentY} L ${parents[parents.length - 1].x} ${parentY}`);
  }

  paths.push(`M ${trunkX} ${parentY} L ${trunkX} ${railY}`);

  if (railStart !== railEnd) {
    paths.push(`M ${railStart} ${railY} L ${railEnd} ${railY}`);
  }

  children.forEach((child) => {
    paths.push(`M ${child.x} ${railY} L ${child.x} ${child.y}`);
  });

  return paths;
}

type PersonCardProps = {
  person: Person;
  x: number;
  y: number;
  showBranchToggle: boolean;
  branchDirection: BranchDirection;
  isBranchOpen?: boolean;
  isSideBranch?: boolean;
  onToggleBranch?: () => void;
};

function PersonCard({
  person,
  x,
  y,
  showBranchToggle,
  branchDirection,
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
          className={`absolute top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-[#8F653D] transition-colors hover:text-[#6F4C2C] ${
            branchDirection === "right" ? "-right-7" : "-left-7"
          }`}
          onClick={onToggleBranch}
          aria-label={isBranchOpen ? "Hide relatives" : "Show relatives"}
        >
          {branchDirection === "right" ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      ) : null}

      <Link href={`/family/person/${person.id}`} className="block" data-interactive="true">
        <FamilyPortrait
          person={person}
          alt={person.name}
          width={96}
          height={96}
          className="mx-auto h-24 w-24 rounded-full border-2 border-[#CE955E]/50 object-cover transition duration-200 hover:scale-105"
        />
      </Link>

      <h3 className="mt-4 text-lg font-semibold leading-tight">{person.name}</h3>
      <p className="mt-2 text-sm text-[#5B4630]">{formatLifeRange(person)}</p>
    </article>
  );
}
