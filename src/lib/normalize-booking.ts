import type { Booking } from "@/types/booking";

/** Ensures `reviewId` is present when the API omits it (older servers). */
export function normalizeBooking(b: Booking): Booking {
  const r = b as Booking & { reviewId?: string | null };
  return { ...r, reviewId: r.reviewId ?? null };
}
