"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { createBooking } from "@/services/bookingService";

function paramId(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return "";
}

export default function SlotCheckoutPage() {
  return (
    <ProtectedRoute roles={["STUDENT"]}>
      <SlotCheckoutInner />
    </ProtectedRoute>
  );
}

function SlotCheckoutInner() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slotId = useMemo(() => paramId(params?.slotId), [params]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!slotId) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">Invalid slot.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/categories">← Back</Link>
        </Button>
      </div>

      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>
            Confirm your booking. Payment method is <span className="font-medium">Cash on delivery</span> only for now.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border bg-muted/20 p-4 text-sm">
            <p className="text-muted-foreground">Student</p>
            <p className="font-medium">{user?.name ?? "Student"}</p>
            <p className="text-muted-foreground mt-3">Slot</p>
            <p className="font-mono text-xs break-all">{slotId}</p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any instructions for the tutor…"
            />
          </div>

          <Button
            type="button"
            disabled={submitting}
            className="w-full"
            onClick={() => {
              setSubmitting(true);
              createBooking({
                availabilitySlotId: slotId,
                paymentMethod: "COD",
                ...(notes.trim() ? { notes: notes.trim() } : {}),
              })
                .then(() => {
                  toast.success("Booking confirmed");
                  // Slot is marked BOOKED on the server; public lists will update on next fetch.
                  router.push("/categories");
                })
                .catch((err: Error) => {
                  toast.error(err.message ?? "Could not create booking");
                })
                .finally(() => setSubmitting(false));
            }}
          >
            Confirm booking
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

