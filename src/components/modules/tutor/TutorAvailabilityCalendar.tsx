"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatSlotTitle, isSlotSessionInFuture } from "@/lib/slot-display";
import { cn } from "@/lib/utils";
import { listAvailabilitySlotsByTutor } from "@/services/availability";
import type { AvailabilitySlot } from "@/types/availability";
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function dateKeyLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function slotDateKey(slot: AvailabilitySlot): string | null {
  const raw = slot.date?.trim();
  if (raw) return raw.slice(0, 10);
  if (slot.startAt?.trim()) {
    const t = Date.parse(slot.startAt);
    if (!Number.isNaN(t)) return dateKeyLocal(new Date(t));
  }
  return null;
}

function startMs(slot: AvailabilitySlot): number {
  const k = slot.startAt?.trim();
  if (k) {
    const t = Date.parse(k);
    if (!Number.isNaN(t)) return t;
  }
  const dk = slotDateKey(slot);
  if (dk && slot.startTime) {
    const t = Date.parse(`${dk}T${slot.startTime}`);
    if (!Number.isNaN(t)) return t;
  }
  return 0;
}

function calendarCells(year: number, month: number): { d: Date; inMonth: boolean }[] {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevLast = new Date(year, month, 0).getDate();
  const cells: { d: Date; inMonth: boolean }[] = [];

  for (let i = 0; i < startPad; i++) {
    const day = prevLast - startPad + i + 1;
    cells.push({ d: new Date(year, month - 1, day), inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ d: new Date(year, month, day), inMonth: true });
  }
  let n = 1;
  while (cells.length < 42) {
    cells.push({ d: new Date(year, month + 1, n), inMonth: false });
    n += 1;
  }
  return cells;
}

export function TutorAvailabilityCalendar({ tutorUserId }: { tutorUserId: string }) {
  const router = useRouter();
  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void listAvailabilitySlotsByTutor(tutorUserId, { status: "available" })
      .then((data) => {
        if (!active) return;
        setSlots(data);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load slots");
        setSlots([]);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tutorUserId]);

  const upcoming = useMemo(
    () => (slots ?? []).filter(isSlotSessionInFuture).sort((a, b) => startMs(a) - startMs(b)),
    [slots],
  );

  const slotsByDay = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of upcoming) {
      const k = slotDateKey(s);
      if (!k) continue;
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
  }, [upcoming]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const cells = useMemo(() => calendarCells(year, month), [year, month]);
  const label = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(view);

  const todayKey = dateKeyLocal(new Date());
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const filtered = useMemo(() => {
    if (!selectedKey) return upcoming.slice(0, 8);
    return upcoming.filter((s) => slotDateKey(s) === selectedKey).slice(0, 12);
  }, [upcoming, selectedKey]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-dashed border-red-200 bg-red-50/50 px-4 py-6 text-center">
        <p className="text-destructive text-[13px]">{error}</p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href={`/tutors/${encodeURIComponent(tutorUserId)}/slots`}>
            View slots page
          </Link>
        </Button>
      </div>
    );
  }

  if (upcoming.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#c7d4f8] bg-[#f0f4ff]/60 p-8 text-center">
        <CalendarDays className="mx-auto mb-3 size-10 text-[#1a3260]/35" />
        <p className="text-[15px] font-medium text-[#0f1f3d]">No upcoming openings</p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#8896a8]">
          This tutor has no bookable sessions in the future right now.
        </p>
        <Button asChild variant="outline" className="mt-5">
          <Link href={`/tutors/${encodeURIComponent(tutorUserId)}/slots`}>
            Open full availability
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Month calendar */}
      <div className="overflow-hidden rounded-xl border border-[#e4e1d8] bg-white">
        <div className="flex items-center justify-between border-b border-[#eeede8] bg-[#fafaf8] px-3 py-2.5 md:px-4">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-transparent text-[#8896a8] transition-colors hover:border-[#e4e1d8] hover:bg-white hover:text-[#0f1f3d]"
            aria-label="Previous month"
            onClick={() =>
              setView(new Date(year, month - 1, 1))
            }
          >
            <ChevronLeft className="size-5" />
          </button>
          <p className="font-medium text-[#0f1f3d]">{label}</p>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-transparent text-[#8896a8] transition-colors hover:border-[#e4e1d8] hover:bg-white hover:text-[#0f1f3d]"
            aria-label="Next month"
            onClick={() =>
              setView(new Date(year, month + 1, 1))
            }
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-[#eeede8] p-2 md:p-3">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-[#8896a8]"
            >
              {wd}
            </div>
          ))}
          {cells.map(({ d, inMonth }, idx) => {
            const key = dateKeyLocal(d);
            const count = slotsByDay.get(key) ?? 0;
            const isToday = key === todayKey;
            const isPast = d < todayStart;
            const hasOpenings = count > 0 && !isPast;
            const isSelected = selectedKey === key;

            return (
              <button
                key={`cal-${idx}-${key}`}
                type="button"
                disabled={isPast || !hasOpenings}
                onClick={() => {
                  if (hasOpenings) setSelectedKey((prev) => (prev === key ? null : key));
                }}
                className={cn(
                  "relative flex min-h-[2.5rem] flex-col items-center justify-center rounded-lg text-[13px] transition-colors md:min-h-[2.75rem]",
                  !inMonth && !hasOpenings && "text-[#c7d4f8]",
                  !inMonth && hasOpenings && "text-[#0f1f3d]",
                  inMonth && !isPast && !hasOpenings && "text-[#0f1f3d]",
                  isPast && "cursor-not-allowed text-[#c7d4f8]",
                  isToday && "font-semibold",
                  hasOpenings &&
                    "bg-amber-50/90 font-medium text-[#0f1f3d] hover:bg-amber-100",
                  isSelected && "ring-2 ring-[#0f1f3d] ring-offset-1",
                  !hasOpenings && !isPast && inMonth && "hover:bg-[#f8f7f4]",
                )}
              >
                <span>{d.getDate()}</span>
                {hasOpenings ? (
                  <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-800">
                    {count} slot{count === 1 ? "" : "s"}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="border-t border-[#eeede8] px-3 py-2 text-center text-[11px] text-[#8896a8] md:px-4">
          Days with openings are highlighted. Times are in UTC.
        </p>
      </div>

      {/* Upcoming list */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[13px] font-semibold text-[#0f1f3d]">
            {selectedKey
              ? `Openings on ${selectedKey}`
              : "Next openings"}
          </h3>
          {selectedKey ? (
            <button
              type="button"
              className="text-[12px] font-medium text-[#1a3260] underline-offset-2 hover:underline"
              onClick={() => setSelectedKey(null)}
            >
              Show all
            </button>
          ) : null}
        </div>
        <ul className="space-y-2">
          {filtered.length === 0 && selectedKey ? (
            <li className="rounded-lg border border-dashed border-[#e4e1d8] bg-[#fafaf8] px-4 py-6 text-center text-[13px] text-[#8896a8]">
              No slots on this day. Pick another highlighted day or{" "}
              <button
                type="button"
                className="font-medium text-[#1a3260] underline"
                onClick={() => setSelectedKey(null)}
              >
                show all openings
              </button>
              .
            </li>
          ) : null}
          {filtered.map((slot) => (
            <li
              key={slot.id}
              className="flex flex-col gap-2 rounded-lg border border-[#e4e1d8] bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium leading-snug text-[#0f1f3d]">
                  {formatSlotTitle(slot)}
                </p>
                {slot.subject ? (
                  <p className="mt-0.5 truncate text-[12px] text-[#8896a8]">
                    {slot.subject.name} · {slot.subject.category.name}
                  </p>
                ) : null}
                <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#8896a8]">
                  <Clock className="size-3" /> UTC
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                <span className="text-[14px] font-semibold text-[#0f1f3d]">
                  ${slot.price}
                </span>
                <Button
                  type="button"
                  size="sm"
                  className="bg-[#0f1f3d] font-semibold text-white hover:bg-[#1a3260]"
                  onClick={() => router.push(`/checkout/slots/${slot.id}`)}
                >
                  Book
                </Button>
              </div>
            </li>
          ))}
        </ul>
        {!selectedKey && upcoming.length > 8 ? (
          <div className="mt-4 text-center">
            <Button asChild variant="outline" size="sm">
              <Link href={`/tutors/${encodeURIComponent(tutorUserId)}/slots`}>
                See all slots
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
