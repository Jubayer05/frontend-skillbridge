"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { TutorReviewsSection } from "@/components/reviews/TutorReviewsSection";
import { StaticStars } from "@/components/reviews/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getTutorProfileByUserId } from "@/services/profile";
import type { PublicTutorProfile } from "@/types/profile";

export function TutorPublicProfile({ tutorUserId }: { tutorUserId: string }) {
  const [profile, setProfile] = useState<PublicTutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getTutorProfileByUserId(tutorUserId)
      .then((p) => {
        if (!active) return;
        setProfile(p);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message ?? "Could not load tutor");
        setProfile(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tutorUserId]);

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full max-w-3xl" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-destructive text-sm">
          {error ?? "This tutor does not have a public profile yet."}
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  const ratingNum =
    profile.rating != null && profile.rating !== ""
      ? Number(profile.rating)
      : null;

  return (
    <div className="space-y-10 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">← Home</Link>
        </Button>
      </div>

      <Card className="max-w-3xl border-border/80">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">
                {profile.user.name}
              </CardTitle>
              <CardDescription className="mt-1 text-base">
                {profile.headline}
              </CardDescription>
            </div>
            {profile.isVerified ? (
              <Badge variant="secondary">Verified</Badge>
            ) : null}
          </div>
          <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span>
              <span className="text-foreground font-medium">${profile.hourlyRate}</span>
              /hr
            </span>
            <span className="flex items-center gap-2">
              {ratingNum != null && !Number.isNaN(ratingNum) ? (
                <>
                  <StaticStars value={ratingNum} />
                  <span className="text-foreground font-medium tabular-nums">
                    {profile.rating}
                  </span>
                  <span>({profile.totalReviews} reviews)</span>
                </>
              ) : (
                <span>No ratings yet</span>
              )}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/tutors/${encodeURIComponent(tutorUserId)}/slots`}>
                View availability & book
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="max-w-4xl space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground text-sm">
            Feedback from students after completed sessions.
          </p>
        </div>
        <TutorReviewsSection key={tutorUserId} tutorUserId={tutorUserId} />
      </section>
    </div>
  );
}
