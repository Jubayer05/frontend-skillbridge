import { API_ENDPOINTS } from "@/config/apiConfig";
import { apiFetch } from "@/lib/api-fetch";
import { normalizeBooking } from "@/lib/normalize-booking";
import type { Booking, BookingStatus } from "@/types/booking";

export async function listBookings(params?: {
  status?: BookingStatus;
  from?: string;
  to?: string;
}): Promise<Booking[]> {
  const url = new URL(API_ENDPOINTS.bookings.list);
  if (params?.status) url.searchParams.set("status", params.status);
  if (params?.from) url.searchParams.set("from", params.from);
  if (params?.to) url.searchParams.set("to", params.to);

  const res = await apiFetch<Booking[]>(url.toString());
  return (res.data ?? []).map((b) => normalizeBooking(b));
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  const res = await apiFetch<Booking>(API_ENDPOINTS.bookings.cancel(bookingId), {
    method: "PATCH",
  });
  if (!res.data) throw new Error("Booking data was not returned");
  return normalizeBooking(res.data);
}

export async function completeBooking(bookingId: string): Promise<Booking> {
  const res = await apiFetch<Booking>(
    API_ENDPOINTS.bookings.complete(bookingId),
    {
      method: "PATCH",
    },
  );
  if (!res.data) throw new Error("Booking data was not returned");
  return normalizeBooking(res.data);
}

