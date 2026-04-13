"use client";

import { Copy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { TutorAvailabilitySlotForm } from "@/components/modules/availability/tutor-availability-slot-form";
import {
  DashboardHero,
  DashboardPageShell,
} from "@/components/modules/profile/dashboard-page-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { canDeleteTutorAvailabilitySlot } from "@/lib/availability-slot-ui";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { formatSlotTitle } from "@/lib/slot-display";
import {
  forgetAvailabilitySlotId,
  rememberAvailabilitySlot,
} from "@/lib/tutor-availability-recent";
import {
  deleteAvailabilitySlot,
  getAvailabilitySlotById,
} from "@/services/availability";
import type { AvailabilitySlot } from "@/types/availability";

export function TutorAvailabilitySlotDetail({ slotId }: { slotId: string }) {
  const router = useRouter();
  const [slot, setSlot] = useState<AvailabilitySlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    getAvailabilitySlotById(slotId)
      .then((data) => {
        if (!active) return;
        setSlot(data);
        rememberAvailabilitySlot(data);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message ?? "Failed to load slot");
        setSlot(null);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slotId]);

  const onDelete = () => {
    if (slot && !canDeleteTutorAvailabilitySlot(slot)) {
      toast.error(
        "You can’t delete a slot that has an active or completed booking. Cancel the booking first if allowed.",
      );
      return;
    }
    if (
      !window.confirm(
        "Delete this availability slot? This cannot be undone.",
      )
    ) {
      return;
    }
    setDeleting(true);
    deleteAvailabilitySlot(slotId)
      .then(() => {
        forgetAvailabilitySlotId(slotId);
        toast.success("Slot deleted");
        router.push("/tutor/availability");
      })
      .catch((err: Error) => {
        toast.error(err.message ?? "Could not delete slot");
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  if (loading) {
    return (
      <DashboardPageShell>
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </DashboardPageShell>
    );
  }

  if (error || !slot) {
    return (
      <DashboardPageShell>
        <Card className="border border-[#e4e1d8] bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Slot not available</CardTitle>
            <CardDescription>{error ?? "Unknown error"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="border-[#e4e1d8]">
              <Link href="/tutor/availability">Back to availability</Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell>
      <div className="space-y-8">
        <div className="space-y-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 h-auto px-2 text-[#5c5a54] hover:text-[#0f1f3d]"
          >
            <Link href="/tutor/availability">← Availability</Link>
          </Button>
          <DashboardHero
            eyebrow="Slot detail"
            title={formatSlotTitle(slot)}
            description={
              slot.subject
                ? `${slot.subject.category.name} · ${slot.subject.name} · $${slot.price} · ${slot.status}`
                : `No subject linked · $${slot.price} · ${slot.status}`
            }
            action={
              <Button
                type="button"
                variant="destructive"
                disabled={
                  deleting ||
                  (slot ? !canDeleteTutorAvailabilitySlot(slot) : true)
                }
                title={
                  slot && !canDeleteTutorAvailabilitySlot(slot)
                    ? "Cannot delete: active or completed booking on this slot"
                    : undefined
                }
                onClick={onDelete}
              >
                Delete slot
              </Button>
            }
          />
        </div>

      <Card className="border border-[#e4e1d8] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-[#0f1f3d]">
            Share this slot
          </CardTitle>
          <CardDescription>
            Copy the page link to open this session from another device. Students
            book from the public catalog; they do not need this link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 border-[#e4e1d8]"
            onClick={() => {
              const url =
                typeof window !== "undefined" ? window.location.href : "";
              if (!url) return;
              copyToClipboard(url)
                .then(() => {
                  toast.success("Link copied");
                })
                .catch(() => {
                  toast.error("Could not copy to clipboard");
                });
            }}
          >
            <Copy className="size-4" aria-hidden />
            Copy page link
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-[#e4e1d8] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-[#0f1f3d]">
            Details
          </CardTitle>
          <CardDescription>
            {slot.subject ? (
              <>
                {slot.subject.category.name} · {slot.subject.name} ·{" "}
              </>
            ) : (
              <span className="text-amber-600 dark:text-amber-500">
                No subject linked ·{" "}
              </span>
            )}
            {formatSlotTitle(slot)} · ${slot.price} ·{" "}
            <span className="capitalize">{slot.status}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-[#5c5a54]">
          <p>Starts (UTC): {new Date(slot.startAt).toISOString()}</p>
          <p>Ends (UTC): {new Date(slot.endAt).toISOString()}</p>
        </CardContent>
      </Card>

      <Card className="border border-[#e4e1d8] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-[#0f1f3d]">
            Edit slot
          </CardTitle>
          <CardDescription>
            Update name, time, price, or status. End time must be after start time.
          </CardDescription>
        </CardHeader>
        <CardContent className="rounded-b-xl bg-[#faf9f6]/50 pt-2">
          <TutorAvailabilitySlotForm
            key={`${slot.id}-${slot.name}-${slot.subjectId ?? ""}-${slot.startAt}-${slot.endAt}-${slot.price}-${slot.status}`}
            mode="edit"
            slot={slot}
            onUpdated={(s) => setSlot(s)}
          />
        </CardContent>
      </Card>
      </div>
    </DashboardPageShell>
  );
}
