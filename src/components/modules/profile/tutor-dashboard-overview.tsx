"use client";

import {
  BadgeDollarSign,
  CalendarDays,
  MessageSquareQuote,
  Star,
} from "lucide-react";
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

const reviews = [
  {
    student: "Ayesha",
    text: "Explains difficult topics in a very simple and structured way.",
  },
  {
    student: "Fahim",
    text: "The mock interview feedback helped me improve quickly.",
  },
];

export function TutorDashboardOverview() {
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
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
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

  const rating = profile?.tutorProfile?.rating ?? "4.90";
  const totalReviews = profile?.tutorProfile?.totalReviews ?? 24;
  const hourlyRate = profile?.tutorProfile?.hourlyRate ?? "45.00";

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
      label: "Sessions this week",
      value: String(upcoming.length).padStart(2, "0"),
      icon: CalendarDays,
      hint: "Next confirmed sessions",
    },
    {
      label: "Estimated earnings",
      value: `$${hourlyRate}`,
      icon: BadgeDollarSign,
      hint: "Current hourly rate",
    },
    {
      label: "Average rating",
      value: `${rating}`,
      icon: Star,
      hint: `${totalReviews} reviews`,
    },
  ];

  return (
    <DashboardPageShell>
      <div className="space-y-8">
        <DashboardHero
          eyebrow="Tutor home"
          title={`Welcome, ${profile?.name ?? "Tutor"}`}
          description="Track sessions, your rate, and feedback in one calm workspace. Open availability when you are ready for new bookings."
          action={
            <Button
              asChild
              className="border-0 bg-amber-500 text-[#0f1f3d] shadow-sm hover:bg-amber-400"
            >
              <Link href="/tutor/availability">Manage availability</Link>
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
                  <CardTitle className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#0f1f3d]">
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

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border border-[#e4e1d8] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-lg text-[#0f1f3d]">
                Upcoming sessions
              </CardTitle>
              <CardDescription>
                Your next confirmed tutoring sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.length > 0 ? (
                upcoming.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-xl border border-[#e4e1d8] bg-[#faf9f6] px-4 py-3"
                  >
                    <p className="font-medium text-[#0f1f3d]">
                      {booking.subject?.name ?? "Subject"}
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
                ))
              ) : (
                <p className="text-sm text-[#5c5a54]">
                  No upcoming sessions yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[#e4e1d8] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif text-lg text-[#0f1f3d]">
                Recent reviews
              </CardTitle>
              <CardDescription>
                Sample feedback—see live reviews on your public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviews.map((review) => (
                <div
                  key={review.student}
                  className="rounded-xl border border-[#e4e1d8] bg-[#faf9f6] px-4 py-3 text-sm"
                >
                  <div className="mb-1.5 flex items-center gap-2 font-medium text-[#0f1f3d]">
                    <MessageSquareQuote className="size-4 text-amber-600" />
                    {review.student}
                  </div>
                  <p className="leading-relaxed text-[#5c5a54]">{review.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageShell>
  );
}
