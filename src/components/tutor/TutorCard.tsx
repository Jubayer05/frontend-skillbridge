"use client";

import Link from "next/link";

import { StaticStars } from "@/components/reviews/StarRating";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { TutorProfileSummary } from "@/types/category";
import { BadgeCheck } from "lucide-react";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  const first = parts[0]!;
  const last = parts[parts.length - 1]!;
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export default function TutorCard({ tutor }: { tutor: TutorProfileSummary }) {
  const displayName = tutor.user.name;
  const avatarSrc = tutor.profileImageUrl ?? tutor.user.image ?? undefined;
  const ratingNum =
    tutor.rating != null && tutor.rating !== ""
      ? Number(tutor.rating)
      : null;
  const hasRating = ratingNum != null && !Number.isNaN(ratingNum);

  const inner = (
    <Card className="h-full overflow-hidden transition-colors hover:bg-muted/30">
      <CardContent className="flex gap-4 p-4">
        <div className="relative shrink-0">
          <Avatar size="lg">
            {avatarSrc ? (
              <AvatarImage src={avatarSrc} alt={displayName} />
            ) : null}
            <AvatarFallback>{initialsFromName(displayName)}</AvatarFallback>
          </Avatar>
          {tutor.isVerified ? (
            <span
              className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full ring-2 ring-background"
              title="Verified tutor"
            >
              <BadgeCheck className="size-3.5" aria-hidden />
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium leading-tight">{displayName}</p>
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {tutor.headline}
          </p>
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span>
              <span className="font-medium text-foreground">Rate:</span> $
              {tutor.hourlyRate}/hr
            </span>
            {hasRating ? (
              <span className="flex flex-wrap items-center gap-2">
                <StaticStars
                  value={ratingNum}
                  starClassName="size-3.5"
                />
                <span className="tabular-nums">
                  {tutor.rating}{" "}
                  <span className="text-muted-foreground">
                    ({tutor.totalReviews})
                  </span>
                </span>
              </span>
            ) : (
              <span>No ratings yet</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Link
      href={`/tutors/${encodeURIComponent(tutor.userId)}`}
      className="block min-w-0"
    >
      {inner}
    </Link>
  );
}
