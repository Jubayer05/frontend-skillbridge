import type { AvailabilitySlot } from "@/types/availability";

/** Server-linked booking row for this slot (when present). */
export function canDeleteTutorAvailabilitySlot(slot: AvailabilitySlot): boolean {
  if (!slot.booking) return true;
  return slot.booking.status === "cancelled";
}

/**
 * Human-readable status using slot row + booking (source of truth for sessions).
 */
export function tutorSlotStatusLabel(slot: AvailabilitySlot): string {
  const b = slot.booking;
  if (b?.status === "completed") return "Completed";
  if (b?.status === "confirmed") return "Booked";
  if (b?.status === "cancelled") return "Available";
  if (slot.status === "booked") return "Booked";
  return "Available";
}
