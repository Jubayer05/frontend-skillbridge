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

