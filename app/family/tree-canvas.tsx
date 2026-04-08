"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpRightIcon,
  MoveIcon,
  SearchIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FamilyPortrait } from "@/components/family-portrait";
import {
  buildFamilyGraph,
  formatLifeRange,
  getPersonFamilyUnits,
  getPersonParents,
  getPersonPartners,
  validateFamilyData,
  type FamilyData,
  type FamilyGraph,
  type FamilyUnit,
  type Person,
} from "@/lib/family-data";

type FamilyTreeCanvasProps = {
  data: FamilyData;
};

type CanvasNode = {
  key: string;
  personId: string;
  x: number;
  y: number;
  role: "focus" | "ancestor" | "descendant" | "partner";
};

type FamilyConnectorGroup = {
  parentKeys: string[];
  childKeys: string[];
};

type PartnerLink = {
  fromKey: string;
  toKey: string;
};

type Viewport = {
  x: number;
  y: number;
  scale: number;
};

const MAIN_CARD_WIDTH = 210;
const MAIN_CARD_HEIGHT = 244;
const PARTNER_CARD_WIDTH = 178;
const PARTNER_CARD_HEIGHT = 210;
const GRID_X_STEP = 250;
const ANCESTOR_Y_STEP = 320;
const DESCENDANT_Y_STEP = 340;
const PARTNER_X_GAP = 220;
const UNIT_GAP = 0.9;
const SIBLING_GAP = 0.65;
const BOARD_PADDING = 180;
const MIN_SCALE = 0.42;
const MAX_SCALE = 1.4;
const INITIAL_SCALE = 0.74;
const DRAG_THRESHOLD = 6;

export function FamilyTreeCanvas({ data }: FamilyTreeCanvasProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, scale: INITIAL_SCALE });
  const [searchValue, setSearchValue] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragPendingRef = useRef(false);
  const dragOriginRef = useRef({ pointerX: 0, pointerY: 0, viewportX: 0, viewportY: 0 });

  const graph = useMemo(() => buildFamilyGraph(data), [data]);
  const validationIssues = useMemo(() => validateFamilyData(data), [data]);

  const people = useMemo(
    () => [...data.people].sort((left, right) => left.name.localeCompare(right.name)),
    [data.people],
  );

  const filteredPeople = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase();

    if (!normalizedQuery) {
      return people;
    }

    return people.filter((person) => person.name.toLowerCase().includes(normalizedQuery));
  }, [people, searchValue]);

  const focusedPersonId = searchParams.get("person") ?? searchParams.get("focus") ?? data.rootPersonId;
  const focusedPerson = graph.peopleById.get(focusedPersonId) ?? graph.peopleById.get(data.rootPersonId);

  const layout = useMemo(() => {
    if (!focusedPerson) {
      return null;
    }

    const mainNodes = new Map<string, CanvasNode>();
    const partnerNodes = new Map<string, CanvasNode>();
    const familyGroups: FamilyConnectorGroup[] = [];
    const partnerLinks: PartnerLink[] = [];

    const descendantWidthCache = new Map<string, number>();
    const familyUnitWidthCache = new Map<string, number>();
    const ancestorWidthCache = new Map<string, number>();

    const addMainNode = (personId: string, x: number, y: number, role: CanvasNode["role"]) => {
      if (!graph.peopleById.has(personId) || mainNodes.has(personId)) {
        return;
      }

      mainNodes.set(personId, { key: personId, personId, x, y, role });
    };

    const addPartnerNode = (
      anchorPersonId: string,
      partnerId: string,
      x: number,
      y: number,
    ) => {
      if (!graph.peopleById.has(partnerId)) {
        return null;
      }

      const key = `partner:${anchorPersonId}:${partnerId}`;
      if (!partnerNodes.has(key)) {
        partnerNodes.set(key, { key, personId: partnerId, x, y, role: "partner" });
      }

      partnerLinks.push({ fromKey: anchorPersonId, toKey: key });
      return key;
    };

    const measureAncestorWidth = (personId: string, lineagePath: string[]): number => {
      const cacheKey = `${personId}:${lineagePath.join(">")}`;
      const cachedWidth = ancestorWidthCache.get(cacheKey);

      if (cachedWidth !== undefined) {
        return cachedWidth;
      }

      if (lineagePath.includes(personId)) {
        ancestorWidthCache.set(cacheKey, 1);
        return 1;
      }

      const parents = getPersonParents(personId, graph);

      if (parents.length === 0) {
        ancestorWidthCache.set(cacheKey, 1);
        return 1;
      }

      const width =
        parents.reduce(
          (sum, parentId, index) =>
            sum + measureAncestorWidth(parentId, [...lineagePath, personId]) + (index > 0 ? SIBLING_GAP : 0),
          0,
        ) || 1;

      ancestorWidthCache.set(cacheKey, width);
      return width;
    };

    const placeAncestors = (personId: string, centerX: number, depth: number, lineagePath: string[]) => {
      if (lineagePath.includes(personId)) {
        return;
      }

      const parents = getPersonParents(personId, graph);

      if (parents.length === 0) {
        return;
      }

      const widths = parents.map((parentId) => measureAncestorWidth(parentId, [...lineagePath, personId]));
      const totalWidth = widths.reduce((sum, width, index) => sum + width + (index > 0 ? SIBLING_GAP : 0), 0);
      let cursorX = centerX - totalWidth / 2;

      const parentKeys: string[] = [];

      parents.forEach((parentId, index) => {
        const parentWidth = widths[index] ?? 1;
        const parentCenter = cursorX + parentWidth / 2;

        addMainNode(parentId, parentCenter * GRID_X_STEP, -depth * ANCESTOR_Y_STEP, "ancestor");
        parentKeys.push(parentId);

        placeAncestors(parentId, parentCenter, depth + 1, [...lineagePath, personId]);
        cursorX += parentWidth + SIBLING_GAP;
      });

      familyGroups.push({ parentKeys, childKeys: [personId] });
    };

    const measureFamilyUnitWidth = (familyUnit: FamilyUnit, lineagePath: string[]): number => {
      const cacheKey = `${familyUnit.id}:${lineagePath.join(">")}`;
      const cachedWidth = familyUnitWidthCache.get(cacheKey);

      if (cachedWidth !== undefined) {
        return cachedWidth;
      }

      if (familyUnit.childIds.length === 0) {
        familyUnitWidthCache.set(cacheKey, 1);
        return 1;
      }

      const width = familyUnit.childIds.reduce((sum, childId, index) => {
        const childWidth = measureDescendantWidth(childId, lineagePath);
        return sum + childWidth + (index > 0 ? SIBLING_GAP : 0);
      }, 0);

      const resolvedWidth = Math.max(1, width);
      familyUnitWidthCache.set(cacheKey, resolvedWidth);
      return resolvedWidth;
    };

    const measureDescendantWidth = (personId: string, lineagePath: string[]): number => {
      const cacheKey = `${personId}:${lineagePath.join(">")}`;
      const cachedWidth = descendantWidthCache.get(cacheKey);

      if (cachedWidth !== undefined) {
        return cachedWidth;
      }

      if (lineagePath.includes(personId)) {
        descendantWidthCache.set(cacheKey, 1);
        return 1;
      }

      const familyUnits = getPersonFamilyUnits(personId, graph).filter((familyUnit) => familyUnit.childIds.length > 0);

      if (familyUnits.length === 0) {
        descendantWidthCache.set(cacheKey, 1);
        return 1;
      }

      const width = familyUnits.reduce((sum, familyUnit, index) => {
        const familyWidth = measureFamilyUnitWidth(familyUnit, [...lineagePath, personId]);
        return sum + familyWidth + (index > 0 ? UNIT_GAP : 0);
      }, 0);

      const resolvedWidth = Math.max(1, width);
      descendantWidthCache.set(cacheKey, resolvedWidth);
      return resolvedWidth;
    };

    const placePartnerNodes = (personId: string, x: number, y: number) => {
      const partners = getPersonPartners(personId, graph);

      partners.forEach((partnerId, index) => {
        const partnerX = x + (index + 1) * PARTNER_X_GAP;
        addPartnerNode(personId, partnerId, partnerX, y);
      });
    };

    const placeDescendants = (personId: string, centerX: number, depth: number, lineagePath: string[]) => {
      if (lineagePath.includes(personId)) {
        return;
      }

      const personNode = mainNodes.get(personId);
      if (!personNode) {
        return;
      }

      const familyUnits = getPersonFamilyUnits(personId, graph).filter((familyUnit) => familyUnit.childIds.length > 0);

      if (familyUnits.length === 0) {
        return;
      }

      placePartnerNodes(personId, personNode.x, personNode.y);

      const widths = familyUnits.map((familyUnit) => measureFamilyUnitWidth(familyUnit, [...lineagePath, personId]));
      const totalWidth = widths.reduce((sum, width, index) => sum + width + (index > 0 ? UNIT_GAP : 0), 0);
      let cursorX = centerX - totalWidth / 2;

      familyUnits.forEach((familyUnit, familyIndex) => {
        const familyWidth = widths[familyIndex] ?? 1;
        const familyCenter = cursorX + familyWidth / 2;

        const parentKeys = [personId];
        familyUnit.parentIds
          .filter((parentId) => parentId !== personId)
          .forEach((partnerId) => {
            const partnerKey = `partner:${personId}:${partnerId}`;
            if (partnerNodes.has(partnerKey)) {
              parentKeys.push(partnerKey);
            }
          });

        let childCursorX = familyCenter - familyWidth / 2;
        const childKeys: string[] = [];

        familyUnit.childIds.forEach((childId) => {
          const childWidth = measureDescendantWidth(childId, [...lineagePath, personId]);
          const childCenter = childCursorX + childWidth / 2;

          addMainNode(childId, childCenter * GRID_X_STEP, (depth + 1) * DESCENDANT_Y_STEP, "descendant");
          childKeys.push(childId);

          placeDescendants(childId, childCenter, depth + 1, [...lineagePath, personId]);
          childCursorX += childWidth + SIBLING_GAP;
        });

        familyGroups.push({ parentKeys, childKeys });
        cursorX += familyWidth + UNIT_GAP;
      });
    };

    addMainNode(focusedPerson.id, 0, 0, "focus");
    placePartnerNodes(focusedPerson.id, 0, 0);
    placeAncestors(focusedPerson.id, 0, 1, []);
    placeDescendants(focusedPerson.id, 0, 0, []);

    const allNodes = [...mainNodes.values(), ...partnerNodes.values()];
    const minX = Math.min(...allNodes.map((node) => node.x)) - BOARD_PADDING;
    const maxX = Math.max(...allNodes.map((node) => node.x + getNodeWidth(node.role))) + BOARD_PADDING;
    const minY = Math.min(...allNodes.map((node) => node.y)) - BOARD_PADDING;
    const maxY = Math.max(...allNodes.map((node) => node.y + getNodeHeight(node.role))) + BOARD_PADDING;

    const width = maxX - minX;
    const height = maxY - minY;
    const offsetX = -minX;
    const offsetY = -minY;

    const absolutePositions = new Map(
      allNodes.map((node) => [
        node.key,
        {
          x: node.x + offsetX,
          y: node.y + offsetY,
          width: getNodeWidth(node.role),
          height: getNodeHeight(node.role),
        },
      ]),
    );

    return {
      width,
      height,
      rootKey: focusedPerson.id,
      mainNodes: [...mainNodes.values()],
      partnerNodes: [...partnerNodes.values()],
      familyGroups,
      partnerLinks,
      absolutePositions,
    };
  }, [focusedPerson, graph]);

  useEffect(() => {
    if (!layout || !containerRef.current) {
      return;
    }

    const rootPosition = layout.absolutePositions.get(layout.rootKey);
    if (!rootPosition) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    setViewport({
      x: rect.width / 2 - (rootPosition.x + rootPosition.width / 2) * INITIAL_SCALE,
      y: rect.height / 2 - (rootPosition.y + rootPosition.height / 2) * INITIAL_SCALE,
      scale: INITIAL_SCALE,
    });
  }, [layout?.rootKey]);

  if (!focusedPerson || !layout) {
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
    <div className="relative h-full overflow-hidden bg-[#1c160f] text-[#f5ecde]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(237,206,163,0.2),_transparent_34%),linear-gradient(180deg,_rgba(44,33,21,0.92),_rgba(22,17,11,1))]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="absolute left-5 top-5 z-20 flex max-w-[520px] flex-col gap-3 rounded-[28px] border border-[#d8b389]/20 bg-[#21180f]/85 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#cda679]">
          <Link className="rounded-full px-2 py-1 hover:bg-white/5" href="/">
            Home
          </Link>
          <span>/</span>
          <span>Family</span>
        </div>

        <div>
          <h1 className="font-serif text-3xl tracking-tight text-[#fff3e0]">Family Canvas</h1>
          <p className="mt-1 max-w-md text-sm text-[#dcc6ae]">
            One person in focus. Direct ascendants above. Direct descendants below. Drag the canvas and zoom to
            inspect the lineage.
          </p>
        </div>

        <div className="rounded-[22px] border border-[#d8b389]/16 bg-black/15 p-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#cda679]">Focused lineage</p>
          <p className="mt-2 text-lg font-semibold text-[#fff3e0]">{focusedPerson.name}</p>
          <p className="mt-1 text-sm text-[#ccb59d]">{formatLifeRange(focusedPerson)}</p>
        </div>

        {validationIssues.length > 0 ? (
          <p className="text-xs text-[#c9a47b]">
            Data warnings: {validationIssues.length}. The canvas still renders, but some relationships should be
            cleaned up.
          </p>
        ) : null}
      </div>

      <div className="absolute right-5 top-5 z-20 flex w-[360px] flex-col gap-3 rounded-[28px] border border-[#d8b389]/20 bg-[#21180f]/85 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="flex items-center gap-2 rounded-[20px] border border-[#d8b389]/14 bg-black/15 px-3 py-2">
          <SearchIcon className="h-4 w-4 text-[#cda679]" />
          <input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search people"
            className="w-full bg-transparent text-sm text-[#fff3e0] outline-none placeholder:text-[#9e8468]"
          />
        </div>

        <div className="max-h-[220px] overflow-y-auto rounded-[22px] border border-[#d8b389]/14 bg-black/15 p-2">
          <div className="grid gap-2">
            {filteredPeople.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => router.push(`/family?person=${person.id}`)}
                className={`rounded-[18px] px-3 py-2 text-left text-sm transition ${
                  person.id === focusedPerson.id
                    ? "bg-[#d1a06a] text-[#23180f]"
                    : "bg-white/[0.04] text-[#f0deca] hover:bg-white/[0.08]"
                }`}
              >
                <div className="font-medium">{person.name}</div>
                <div className="text-xs opacity-75">{formatLifeRange(person)}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[22px] border border-[#d8b389]/14 bg-black/15 px-3 py-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#cda679]">
            <MoveIcon className="h-4 w-4" />
            Drag canvas
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScale(viewport.scale / 1.1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8b389]/18 bg-white/[0.04] text-[#fff3e0] transition hover:bg-white/[0.08]"
              aria-label="Zoom out"
            >
              <ZoomOutIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setScale(viewport.scale * 1.1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8b389]/18 bg-white/[0.04] text-[#fff3e0] transition hover:bg-white/[0.08]"
              aria-label="Zoom in"
            >
              <ZoomInIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-full w-full touch-none"
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

          if (!isDraggingRef.current && travel >= DRAG_THRESHOLD) {
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
            const factor = event.deltaY > 0 ? 0.93 : 1.07;
            const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, current.scale * factor));
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
                  stroke="#d7b185"
                  strokeOpacity={0.86}
                  strokeWidth={1.8}
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

              const fromCenterY = from.y + from.height / 2;
              const toCenterY = to.y + to.height / 2;
              const startX = from.x + from.width;
              const endX = to.x;
              const bendX = startX + (endX - startX) / 2;

              return (
                <path
                  key={`${link.fromKey}-${link.toKey}-${index}`}
                  d={`M ${startX} ${fromCenterY} C ${bendX} ${fromCenterY}, ${bendX} ${toCenterY}, ${endX} ${toCenterY}`}
                  fill="none"
                  stroke="#f1d1ad"
                  strokeOpacity={0.52}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {layout.mainNodes.map((node) => {
            const person = graph.peopleById.get(node.personId);
            const position = layout.absolutePositions.get(node.key);

            if (!person || !position) {
              return null;
            }

            return (
              <CanvasCard
                key={node.key}
                person={person}
                position={position}
                role={node.role}
                interactive
              />
            );
          })}

          {layout.partnerNodes.map((node) => {
            const person = graph.peopleById.get(node.personId);
            const position = layout.absolutePositions.get(node.key);

            if (!person || !position) {
              return null;
            }

            return (
              <CanvasCard
                key={node.key}
                person={person}
                position={position}
                role="partner"
                interactive
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CanvasCard({
  person,
  position,
  role,
  interactive = false,
}: {
  person: Person;
  position: { x: number; y: number; width: number; height: number };
  role: CanvasNode["role"];
  interactive?: boolean;
}) {
  const compact = role === "partner";
  const portraitSize = compact ? 72 : role === "focus" ? 104 : 90;

  const skin =
    role === "focus"
      ? "border-[#f1c18b]/60 bg-[linear-gradient(180deg,rgba(255,248,237,0.98),rgba(249,233,211,0.94))] text-[#26180d] shadow-[0_34px_90px_rgba(0,0,0,0.28)]"
      : role === "partner"
        ? "border-[#c9a57b]/28 bg-[linear-gradient(180deg,rgba(47,35,24,0.96),rgba(31,23,15,0.98))] text-[#f5ebde] shadow-[0_20px_60px_rgba(0,0,0,0.24)]"
        : "border-[#d0af86]/32 bg-[linear-gradient(180deg,rgba(40,30,21,0.94),rgba(23,17,11,0.98))] text-[#f5ebde] shadow-[0_24px_72px_rgba(0,0,0,0.25)]";

  const tag =
    role === "focus" ? "Focused person" : role === "ancestor" ? "Ascendant" : role === "descendant" ? "Descendant" : "Partner";

  return (
    <article
      className={`absolute rounded-[30px] border p-4 ${skin}`}
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] opacity-70">{tag}</p>
          <p className="mt-1 text-xs opacity-70">{formatLifeRange(person)}</p>
        </div>

        <Link
          href={`/family?person=${person.id}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-current/15 bg-white/5 transition hover:bg-white/10"
          aria-label={`Open ${person.name}'s tree`}
          data-interactive={interactive ? "true" : undefined}
        >
          <ArrowUpRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 flex flex-col items-center text-center">
        <Link href={`/family/person/${person.id}`} data-interactive={interactive ? "true" : undefined}>
          <FamilyPortrait
            person={person}
            alt={person.name}
            width={portraitSize}
            height={portraitSize}
            className="rounded-full border-2 border-current/20 object-cover"
          />
        </Link>

        <h3 className="mt-4 text-lg font-semibold leading-tight">{person.name}</h3>
      </div>
    </article>
  );
}

function getNodeWidth(role: CanvasNode["role"]) {
  return role === "partner" ? PARTNER_CARD_WIDTH : MAIN_CARD_WIDTH;
}

function getNodeHeight(role: CanvasNode["role"]) {
  return role === "partner" ? PARTNER_CARD_HEIGHT : MAIN_CARD_HEIGHT;
}

function getFamilyConnectorPaths(
  group: FamilyConnectorGroup,
  positions: Map<string, { x: number; y: number; width: number; height: number }>,
): string[] {
  const parents = group.parentKeys
    .map((key) => positions.get(key))
    .filter((position): position is { x: number; y: number; width: number; height: number } => !!position)
    .map((position) => ({
      x: position.x + position.width / 2,
      y: position.y + position.height,
    }))
    .sort((left, right) => left.x - right.x);

  const children = group.childKeys
    .map((key) => positions.get(key))
    .filter((position): position is { x: number; y: number; width: number; height: number } => !!position)
    .map((position) => ({
      x: position.x + position.width / 2,
      y: position.y,
    }))
    .sort((left, right) => left.x - right.x);

  if (parents.length === 0 || children.length === 0) {
    return [];
  }

  const parentY = Math.max(...parents.map((parent) => parent.y));
  const childY = Math.min(...children.map((child) => child.y));
  const gap = childY - parentY;
  const railY = Math.max(parentY + 32, Math.min(childY - 28, parentY + gap * 0.42));
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
