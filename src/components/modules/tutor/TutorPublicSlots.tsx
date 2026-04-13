"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatSlotTitle, isSlotSessionInFuture } from "@/lib/slot-display";
import { listAvailabilitySlotsByTutor } from "@/services/availability";
import { getTutorProfileByUserId } from "@/services/profile";
import type { AvailabilitySlot } from "@/types/availability";
import type { PublicTutorProfile } from "@/types/profile";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Clock,
  DollarSign,
} from "lucide-react";

function tutorAvatarUrl(p: PublicTutorProfile): string {
  const name = p.user.name;
  if (p.profileImageUrl?.trim()) return p.profileImageUrl.trim();
  if (p.user.image?.trim()) return p.user.image.trim();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=256&background=1a3260&color=fefefe`;
}

export function TutorPublicSlots({ tutorUserId }: { tutorUserId: string }) {
  const router = useRouter();
  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [profile, setProfile] = useState<PublicTutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const [data, tutorProfile] = await Promise.all([
          listAvailabilitySlotsByTutor(tutorUserId, { status: "available" }),
          getTutorProfileByUserId(tutorUserId).catch((): null => null),
        ]);
        if (!active) return;
        setSlots(data);
        setProfile(tutorProfile);
        setError(null);
        setLoading(false);
      } catch (err: unknown) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Could not load availability",
        );
        setSlots([]);
        setProfile(null);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [tutorUserId]);

  const upcomingSlots = useMemo(
    () => (slots ?? []).filter(isSlotSessionInFuture),
    [slots],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="h-40 bg-muted/40">
          <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
            <Skeleton className="mb-6 h-9 w-40" />
            <div className="flex gap-4">
              <Skeleton className="size-24 shrink-0 rounded-2xl md:size-28" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-72 max-w-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-5xl space-y-4 px-4 py-10 md:px-6">
          <Skeleton className="h-6 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#f8f7f4] p-8">
        <div className="max-w-md text-center space-y-4">
          <p className="text-destructive text-sm">{error}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild variant="outline">
              <Link href="/tutors">Browse tutors</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.user.name ?? "Tutor";
  const headline = profile?.headline?.trim();
  const avatarSrc = profile ? tutorAvatarUrl(profile) : null;
  const verified = profile?.isVerified ?? false;

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1f3d] to-[#1a3260]">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full border border-amber-400/10" />
        <div className="pointer-events-none absolute bottom-[-5rem] left-1/3 size-48 rounded-full border border-amber-400/10" />

        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Link href="/tutors" className="gap-2">
                <ArrowLeft className="size-4" />
                All tutors
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Link
                href={`/tutors/${encodeURIComponent(tutorUserId)}`}
                className="gap-2"
              >
                Profile & reviews
              </Link>
            </Button>
          </div>

          <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:gap-10">
            <div className="relative shrink-0">
              {avatarSrc ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarSrc}
                    alt=""
                    className="size-24 rounded-2xl border-[2.5px] border-white/15 object-cover shadow-xl md:size-28"
                  />
                  {verified && (
                    <div className="absolute -bottom-1.5 -right-1.5 flex size-8 items-center justify-center rounded-full border-2 border-[#0f1f3d] bg-amber-400 shadow-md">
                      <BadgeCheck
                        className="size-4 text-[#0f1f3d]"
                        strokeWidth={2.5}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="flex size-24 items-center justify-center rounded-2xl border-[2.5px] border-white/15 bg-white/10 font-serif text-2xl font-medium text-white shadow-xl md:size-28"
                  aria-hidden
                >
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 pb-0.5">
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.12em] text-amber-300/90">
                Book a session
              </p>
              <h1 className="font-serif text-[26px] font-medium leading-tight text-white md:text-[30px]">
                {displayName}
              </h1>
              {headline ? (
                <p className="mt-2 text-[15px] font-light text-white/70">
                  {headline}
                </p>
              ) : (
                <p className="mt-2 text-[15px] font-light text-white/55">
                  Open time slots you can book below.
                </p>
              )}
            </div>

            <Button
              asChild
              className="shrink-0 bg-amber-400 font-semibold text-[#0f1f3d] shadow-sm hover:bg-amber-300"
            >
              <Link
                href={`/tutors/${encodeURIComponent(tutorUserId)}`}
                className="gap-2"
              >
                <CalendarDays className="size-4" />
                Full profile
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Slots */}
      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#e4e1d8] pb-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#0f1f3d]">
              Upcoming availability
            </h2>
            <p className="mt-1 text-[13px] text-[#8896a8]">
              {upcomingSlots.length === 0
                ? "No bookable slots in the future yet."
                : `${upcomingSlots.length} open slot${upcomingSlots.length === 1 ? "" : "s"} — times shown in UTC.`}
            </p>
          </div>
        </div>

        {upcomingSlots.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#c7d4f8] bg-white/80 px-8 py-14 text-center">
            <CalendarDays className="mx-auto mb-4 size-10 text-[#1a3260]/35" />
            <p className="text-[15px] font-medium text-[#0f1f3d]">
              No upcoming slots
            </p>
            <p className="mt-2 max-w-md mx-auto text-[13px] leading-relaxed text-[#8896a8]">
              This tutor has no bookable sessions in the future right now. Try
              again later or browse other tutors.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/tutors">Browse tutors</Link>
            </Button>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {upcomingSlots.map((slot) => (
              <li key={slot.id}>
                <Card className="h-full pt-0 overflow-hidden border-[#e4e1d8] bg-white shadow-sm transition-shadow hover:shadow-md">
                  <CardHeader className="space-y-3 pt-6 border-b border-[#eeede8] bg-[#fafaf8]/80 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-[15px] font-semibold leading-snug text-[#0f1f3d]">
                        {formatSlotTitle(slot)}
                      </CardTitle>
                      <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                        Open
                      </span>
                    </div>
                    {slot.subject ? (
                      <div className="flex gap-3 rounded-lg border border-[#eeede8] bg-white px-3 py-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#edf2ff]">
                          <BookOpen className="size-4 text-[#1a3260]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] text-[#8896a8]">
                            {slot.subject.category.name}
                          </p>
                          <p className="text-[14px] font-semibold text-[#1a3260]">
                            {slot.subject.name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[12px] text-[#8896a8]">
                        Subject not linked
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#4a5568]">
                      <span className="inline-flex items-center gap-1.5">
                        <DollarSign className="size-4 text-[#8896a8]" />
                        <span className="font-semibold text-[#0f1f3d]">
                          ${slot.price}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[#8896a8]">
                        <Clock className="size-4" />
                        UTC
                      </span>
                    </div>
                    <Button
                      type="button"
                      className="w-full bg-[#0f1f3d] font-semibold text-white hover:bg-[#1a3260]"
                      onClick={() => router.push(`/checkout/slots/${slot.id}`)}
                    >
                      Book this slot
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
