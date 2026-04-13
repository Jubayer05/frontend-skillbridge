"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/types/review";

import { StaticStars } from "./StarRating";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function ReviewCard({ review }: { review: Review }) {
  const s = review.student;
  return (
    <Card className="h-full border-border/80">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-11 shrink-0">
            {s.image ? <AvatarImage src={s.image} alt="" /> : null}
            <AvatarFallback>{initials(s.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium leading-tight">{s.name}</p>
            <div className="mt-1">
              <StaticStars value={review.rating} />
            </div>
          </div>
        </div>
        {review.comment ? (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {review.comment}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm italic">No written feedback</p>
        )}
        <p className="text-muted-foreground text-xs">
          {new Date(review.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </CardContent>
    </Card>
  );
}
