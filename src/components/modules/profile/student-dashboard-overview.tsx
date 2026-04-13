"use client";

import { BookOpen, CalendarClock, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
import { getMyProfile } from "@/services/profile";
import { listBookings } from "@/services/bookings";
import { formatSlotTitle } from "@/lib/slot-display";
import type { Booking } from "@/types/booking";
import type { UserProfile } from "@/types/profile";

const quickStats = [
  {
    label: "Upcoming bookings",
    value: "03",
    icon: CalendarClock,
    hint: "Next 7 days",
  },
  {
    label: "Learning hours",
    value: "12.5",
    icon: Clock3,
    hint: "This week",
  },
  {
    label: "Saved tutors",
    value: "08",
    icon: BookOpen,
    hint: "Ready to book",
  },
];

export function StudentDashboardOverview() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const data = await getMyProfile();
        if (!active) return;
        setProfile(data);
        setError(null);
      } catch (err: unknown) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      }

      try {
        const rows = await listBookings({ status: "confirmed" });
        if (!active) return;
        setBookings(rows);
      } catch {
        if (!active) return;
        setBookings([]);
      } finally {
        if (!active) return;
        setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <DashboardPageShell>
        <div className="space-y-8">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </DashboardPageShell>
    );
  }

  if (error) {
    return (
      <DashboardPageShell>
        <Card className="border border-[#e4e1d8] bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Unable to load dashboard</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </DashboardPageShell>
    );
  }

  const upcoming =
    (bookings ?? [])
      .filter((b) => b.status === "confirmed")
      .filter((b) => {
        const start = new Date(`${b.date}T${b.startTime}:00Z`).getTime();
        return Number.isFinite(start) ? start > Date.now() : true;
      })
      .slice(0, 3) ?? [];

  const stats = [
    {
      label: "Upcoming bookings",
      value: String(upcoming.length).padStart(2, "0"),
      icon: CalendarClock,
      hint: "Next confirmed sessions",
    },
    ...quickStats.slice(1),
  ];

  return (
    <DashboardPageShell>
      <div className="space-y-8">
        <DashboardHero
          eyebrow="Student home"
          title={`Welcome back, ${profile?.name ?? "Student"}`}
          description="See what is next on your calendar and keep your profile ready so tutors can support you."
          action={
            <Button
              asChild
              variant="outline"
              className="border-white/25 bg-white/10 text-white hover:bg-white/15"
            >
              <Link href="/dashboard/profile">Edit profile</Link>
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border border-[#e4e1d8] bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardDescription className="text-xs font-medium uppercase tracking-wide text-[#5c5a54]">
                    {stat.label}
                  </CardDescription>
                  <CardTitle className="mt-2 flex items-center gap-2 font-serif text-3xl font-medium tracking-tight text-[#0f1f3d]">
                    {stat.label === "Upcoming bookings" ? (
                      <Sparkles className="size-6 text-amber-600" />
                    ) : null}
                    {stat.value}
                  </CardTitle>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#0f1f3d]/6">
                  <stat.icon className="size-5 text-[#0f1f3d]" />
                </div>
              </CardHeader>
              <CardContent className="text-sm text-[#5c5a54]">
                {stat.hint}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-[#e4e1d8] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-[#0f1f3d]">
              Upcoming bookings
            </CardTitle>
            <CardDescription>
              Your next confirmed tutoring sessions at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length > 0 ? (
              upcoming.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e4e1d8] bg-[#faf9f6] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#0f1f3d]">
                      {booking.subject?.name ?? "Subject"} with{" "}
                      {booking.tutor?.name ?? "Tutor"}
                    </p>
                    <p className="text-sm text-[#5c5a54]">
                      {formatSlotTitle({
                        name: booking.slotName,
                        date: booking.date,
                        startTime: booking.startTime,
                        endTime: booking.endTime,
                      })}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-[#0f1f3d]">
                    Confirmed
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#5c5a54]">
                No upcoming bookings yet. Book a slot from the categories page.
              </p>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-[#5c5a54]">
          Completed a session?{" "}
          <Link
            href="/dashboard/bookings"
            className="font-medium text-[#0f1f3d] underline underline-offset-4 hover:text-amber-700"
          >
            Leave feedback
          </Link>{" "}
          from your Bookings page.
        </p>
      </div>
    </DashboardPageShell>
  );
}
