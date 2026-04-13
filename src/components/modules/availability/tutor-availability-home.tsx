"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/auth-context";
import {
  canDeleteTutorAvailabilitySlot,
  tutorSlotStatusLabel,
} from "@/lib/availability-slot-ui";
import { forgetAvailabilitySlotId } from "@/lib/tutor-availability-recent";
import {
  deleteAvailabilitySlot,
  listAvailabilitySlotsByTutor,
} from "@/services/availability";
import type { AvailabilitySlot } from "@/types/availability";

function formatDateCell(isoDate: string) {
  const t = isoDate.trim();
  if (!t) return "—";
  const ms = Date.parse(t);
  if (Number.isNaN(ms)) return t;
  return new Date(ms).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTimeRangeSlot(slot: AvailabilitySlot) {
  const a = slot.startTime.trim();
  const b = slot.endTime.trim();
  if (a && b) return `${a}–${b}`;
  if (a || b) return a || b;
  return "—";
}

export function TutorAvailabilityHome() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSlots = useCallback(() => {
    if (!user || user.role !== "TUTOR") return;
    void listAvailabilitySlotsByTutor(user.id)
      .then((data) => {
        setSlots(data);
        setListError(null);
      })
      .catch((err: unknown) => {
        setListError(
          err instanceof Error
            ? err.message
            : "Could not load availability slots",
        );
        setSlots([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user || user.role !== "TUTOR") {
      queueMicrotask(() => {
        setSlots(null);
        setListError(null);
        setLoading(false);
      });
      return;
    }
    queueMicrotask(() => {
      setLoading(true);
    });
    loadSlots();
  }, [user, loadSlots]);

  const onDeleteRow = (slot: AvailabilitySlot) => {
    if (!canDeleteTutorAvailabilitySlot(slot)) {
      toast.error(
        "You can’t delete a slot that has an active or completed booking. Cancel the booking first if allowed.",
      );
      return;
    }
    if (
      !window.confirm("Delete this availability slot? This cannot be undone.")
    ) {
      return;
    }
    setDeletingId(slot.id);
    deleteAvailabilitySlot(slot.id)
      .then(() => {
        forgetAvailabilitySlotId(slot.id);
        toast.success("Slot deleted");
        loadSlots();
      })
      .catch((err: Error) => {
        toast.error(err.message ?? "Could not delete slot");
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  const wrongRole = user && user.role !== "TUTOR";

  return (
    <DashboardPageShell>
      <div className="space-y-8">
        <DashboardHero
          eyebrow="Scheduling"
          title="Availability"
          description="All slots are loaded from your account. Status reflects the booking record: booked, completed, or free to delete."
          action={
            <Button
              asChild
              className="border-0 bg-amber-500 text-[#0f1f3d] shadow-sm hover:bg-amber-400"
            >
              <Link href="/tutor/availability/new">New slot</Link>
            </Button>
          }
        />

        <Card className="border border-[#e4e1d8] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-[#0f1f3d]">
              Your slots (database)
            </CardTitle>
            <CardDescription>
              Pulled from the server with booking status. Delete is only allowed
              when there is no confirmed or completed booking on the slot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {wrongRole ? (
              <p className="text-sm text-[#5c5a54]">
                Only tutor accounts can manage availability.
              </p>
            ) : loading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ) : listError ? (
              <p className="text-destructive text-sm">{listError}</p>
            ) : !slots || slots.length === 0 ? (
              <p className="text-sm text-[#5c5a54]">
                No slots yet. Create one with &quot;New slot&quot; or open an
                existing slot by ID above.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#e4e1d8]">
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow className="border-[#e4e1d8] hover:bg-transparent">
                      <TableHead className="w-[200px] text-[#0f1f3d]">
                        Name
                      </TableHead>
                      <TableHead className="w-[170px] text-[#0f1f3d]">
                        Subject
                      </TableHead>
                      <TableHead className="w-[170px] whitespace-nowrap text-[#0f1f3d]">
                        Date
                      </TableHead>
                      <TableHead className="w-[120px] whitespace-nowrap text-[#0f1f3d]">
                        Time
                      </TableHead>
                      <TableHead className="w-[150px] text-[#0f1f3d]">
                        Price
                      </TableHead>
                      <TableHead className="w-[100px] text-[#0f1f3d]">
                        Status
                      </TableHead>
                      <TableHead className="w-[120px] text-right text-[#0f1f3d]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slots.map((slot) => {
                      const canDel = canDeleteTutorAvailabilitySlot(slot);
                      const label = tutorSlotStatusLabel(slot);
                      return (
                        <TableRow
                          key={slot.id}
                          className="border-[#e4e1d8] hover:bg-[#faf9f6]"
                        >
                          <TableCell className="truncate font-medium text-[#0f1f3d]">
                            <Link
                              href={`/tutor/availability/${slot.id}`}
                              className="block truncate hover:underline"
                            >
                              {slot.name.trim() ? (
                                slot.name.trim()
                              ) : (
                                <span className="font-normal text-[#5c5a54]">
                                  —
                                </span>
                              )}
                            </Link>
                          </TableCell>
                          <TableCell className="truncate text-sm text-[#5c5a54]">
                            {slot.subject?.name ?? "—"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-[#5c5a54]">
                            {formatDateCell(slot.date)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-mono text-sm text-[#5c5a54]">
                            {formatTimeRangeSlot(slot)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-[#5c5a54]">
                            ${slot.price}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                label === "Completed"
                                  ? "inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-900"
                                  : label === "Booked"
                                    ? "inline-flex rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-[#0f1f3d]"
                                    : "inline-flex rounded-full border border-[#e4e1d8] bg-white px-2 py-0.5 text-xs font-medium text-[#5c5a54]"
                              }
                            >
                              {label}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-wrap justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!canDel || deletingId === slot.id}
                                title={
                                  canDel
                                    ? "Delete this slot"
                                    : "Cannot delete: active or completed booking"
                                }
                                className="gap-1 border-[#e4e1d8] text-destructive hover:bg-destructive/10 disabled:opacity-50"
                                onClick={() => onDeleteRow(slot)}
                              >
                                <Trash2 className="size-3.5" aria-hidden />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
