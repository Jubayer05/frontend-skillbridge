"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ReviewModal } from "@/components/reviews/ReviewModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import {
  cancelBooking,
  completeBooking,
  listBookings,
} from "@/services/bookings";
import { formatSlotTitle } from "@/lib/slot-display";
import type { Review } from "@/types/review";
import type { Booking, BookingStatus } from "@/types/booking";
import { cn } from "@/lib/utils";

function statusLabel(status: BookingStatus) {
  if (status === "confirmed") return "Confirmed";
  if (status === "completed") return "Completed";
  return "Cancelled";
}

function statusTone(status: BookingStatus) {
  if (status === "confirmed")
    return "bg-primary/10 text-primary border-primary/20";
  if (status === "completed")
    return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
  return "bg-destructive/10 text-destructive border-destructive/20";
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

function BookingCard({
  booking,
  role,
  onChanged,
}: {
  booking: Booking;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  onChanged: (next: Booking) => void;
}) {
  const tutorName = booking.tutor?.name ?? "Tutor";
  const tutorImage = booking.tutor?.profileImageUrl ?? booking.tutor?.image ?? null;
  const subjectName = booking.subject?.name ?? "Subject";
  const categoryName = booking.subject?.category?.name ?? "Category";

  const canCancel =
    booking.status === "confirmed" && (role === "STUDENT" || role === "TUTOR" || role === "ADMIN");
  const canComplete = booking.status === "confirmed" && role === "TUTOR";
  const reviewId = booking.reviewId ?? null;
  const canLeaveReview =
    role === "STUDENT" &&
    booking.status === "completed" &&
    reviewId === null;

  const [reviewOpen, setReviewOpen] = useState(false);

  const sessionLabel = formatSlotTitle({
    name: booking.slotName,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
  });

  return (
    <div className="min-w-0">
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold leading-snug">
              {formatSlotTitle({
                name: booking.slotName,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
              })}
            </CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {categoryName} ·{" "}
              <span className="text-foreground font-medium">{subjectName}</span>
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
              statusTone(booking.status),
            )}
          >
            {statusLabel(booking.status)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {tutorImage ? (
              <Image
                src={tutorImage}
                alt=""
                width={36}
                height={36}
                className="size-9 rounded-full object-cover"
              />
            ) : (
              <div className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full text-xs font-semibold">
                {initials(tutorName)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{tutorName}</p>
              <p className="text-muted-foreground truncate text-xs">
                {booking.tutor?.headline ?? "Tutor session"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold">${booking.totalPrice}</p>
            <p className="text-muted-foreground text-xs">
              {booking.paymentMethod === "COD" ? "Cash on delivery" : booking.paymentMethod}
            </p>
          </div>
        </div>

        {(canCancel || canComplete || canLeaveReview) && (
          <div className="flex flex-wrap gap-2">
            {canCancel ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  cancelBooking(booking.id)
                    .then((next) => {
                      toast.success("Booking cancelled");
                      onChanged(next);
                    })
                    .catch((err: Error) => toast.error(err.message ?? "Could not cancel booking"));
                }}
              >
                Cancel
              </Button>
            ) : null}

            {canComplete ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  completeBooking(booking.id)
                    .then((next) => {
                      toast.success("Marked as completed");
                      onChanged(next);
                    })
                    .catch((err: Error) =>
                      toast.error(err.message ?? "Could not complete booking"),
                    );
                }}
              >
                Mark completed
              </Button>
            ) : null}

            {canLeaveReview ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setReviewOpen(true)}
              >
                Leave feedback
              </Button>
            ) : null}
          </div>
        )}

        {reviewId ? (
          <p className="text-muted-foreground text-xs">You left a review for this session.</p>
        ) : null}
      </CardContent>
    </Card>

    {canLeaveReview ? (
      <ReviewModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        bookingId={booking.id}
        sessionLabel={sessionLabel}
        onSubmitted={(r: Review) => {
          onChanged({ ...booking, reviewId: r.id });
        }}
      />
    ) : null}
    </div>
  );
}

export function BookingsDashboardPage() {
  const { user } = useAuth();
  const role = (user?.role ?? "STUDENT") as "STUDENT" | "TUTOR" | "ADMIN";

  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const [rows, setRows] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    return {
      status: status === "all" ? undefined : status,
      from: from.trim() || undefined,
      to: to.trim() || undefined,
    };
  }, [status, from, to]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    void listBookings(query)
      .then((data) => {
        if (!active) return;
        setRows(data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load bookings");
        setRows([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground text-sm">
            {role === "TUTOR"
              ? "Sessions you’re teaching and their status."
              : "Your booked tutoring sessions and payment details."}
          </p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardContent className="grid gap-3 pt-6 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Status</p>
            <div className="flex flex-wrap gap-2">
              {(["all", "confirmed", "completed", "cancelled"] as const).map(
                (s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    variant={status === s ? "default" : "outline"}
                    onClick={() => setStatus(s)}
                  >
                    {s === "all" ? "All" : statusLabel(s)}
                  </Button>
                ),
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">From (YYYY-MM-DD)</p>
            <Input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="2026-04-01"
            />
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">To (YYYY-MM-DD)</p>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="2026-04-30"
            />
          </div>
        </CardContent>
      </Card>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {loading && rows === null ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : rows && rows.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              role={role}
              onChanged={(next) =>
                setRows((prev) =>
                  (prev ?? []).map((x) => (x.id === next.id ? next : x)),
                )
              }
            />
          ))}
        </div>
      ) : (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">No bookings found</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Try changing the filters, or book a slot from the public catalog.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

