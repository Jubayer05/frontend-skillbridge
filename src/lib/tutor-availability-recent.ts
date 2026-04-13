import type {
  AvailabilitySlot,
  AvailabilitySlotStatus,
} from "@/types/availability";

const STORAGE_KEY = "skillbridge-tutor-recent-availability-slots";
const MAX_ENTRIES = 30;

export type RecentAvailabilitySlotRef = Pick<
  AvailabilitySlot,
  "id" | "name" | "date" | "startTime" | "endTime" | "status"
>;

/**
 * Map API / Prisma / legacy localStorage values to the API shape
 * (`"available"` | `"booked"`). Case-insensitive; unknown → `"available"`.
 */
export function coerceAvailabilitySlotStatus(
  raw: unknown,
): AvailabilitySlotStatus {
  if (typeof raw !== "string") return "available";
  const s = raw.trim().toLowerCase();
  if (s === "booked") return "booked";
  if (s === "available") return "available";
  return "available";
}

/** Coerce a stored JSON row into a safe shape (legacy entries may omit fields). */
export function normalizeRecentAvailabilitySlot(
  raw: unknown,
): RecentAvailabilitySlotRef | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === "string" && r.id.trim().length > 0 ? r.id.trim() : null;
  if (!id) return null;

  const status = coerceAvailabilitySlotStatus(r.status);

  return {
    id,
    name: typeof r.name === "string" ? r.name : "",
    date: typeof r.date === "string" ? r.date : "",
    startTime: typeof r.startTime === "string" ? r.startTime : "",
    endTime: typeof r.endTime === "string" ? r.endTime : "",
    status,
  };
}

function readAll(): RecentAvailabilitySlotRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((row) => normalizeRecentAvailabilitySlot(row))
      .filter((row): row is RecentAvailabilitySlotRef => row !== null);
  } catch {
    return [];
  }
}

function writeAll(rows: RecentAvailabilitySlotRef[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(rows.slice(0, MAX_ENTRIES)),
  );
}

export function getRecentAvailabilitySlots(): RecentAvailabilitySlotRef[] {
  return readAll();
}

export function rememberAvailabilitySlot(slot: AvailabilitySlot) {
  const row: RecentAvailabilitySlotRef = {
    id: slot.id,
    name: slot.name,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: coerceAvailabilitySlotStatus(slot.status),
  };
  const rest = readAll().filter((r) => r.id !== row.id);
  writeAll([row, ...rest]);
}

export function forgetAvailabilitySlotId(slotId: string) {
  writeAll(readAll().filter((r) => r.id !== slotId));
}
