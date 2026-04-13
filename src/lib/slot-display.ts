/** Shared formatting for availability slots in the UI (IDs stay internal). */

export type SlotScheduleFields = {
  date: string;
  startTime: string;
  endTime: string;
};

export type SlotDisplayFields = SlotScheduleFields & {
  name: string;
};

export function formatSlotSchedule(slot: SlotScheduleFields): string {
  return `${slot.date} · ${slot.startTime}–${slot.endTime}`;
}

/** Name (when non-empty) plus date and time range. */
export function formatSlotTitle(slot: SlotDisplayFields): string {
  const schedule = formatSlotSchedule(slot);
  const n = slot.name.trim();
  return n ? `${n} · ${schedule}` : schedule;
}

/** True when the session start is strictly after now (uses `startAt` when set). */
export function isSlotSessionInFuture(slot: SlotScheduleFields & { startAt: string }): boolean {
  const startAt = slot.startAt?.trim();
  if (startAt) {
    const t = Date.parse(startAt);
    if (!Number.isNaN(t)) return t > Date.now();
  }
  const date = slot.date?.trim();
  const time = slot.startTime?.trim();
  if (date && time) {
    const combined = time.includes("T") ? time : `${date}T${time}`;
    const t = Date.parse(combined);
    if (!Number.isNaN(t)) return t > Date.now();
  }
  if (date) {
    const t = Date.parse(date);
    if (!Number.isNaN(t)) return t > Date.now();
  }
  return false;
}

