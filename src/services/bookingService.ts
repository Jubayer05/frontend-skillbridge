import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";
import { normalizeBooking } from "@/lib/normalize-booking";
import type { Booking, CreateBookingPayload } from "@/types/booking";

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const res = await apiFetch<Booking>(API_ENDPOINTS.bookings.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.data) {
    throw new Error("Booking data was not returned");
  }
  return normalizeBooking(res.data);
}

