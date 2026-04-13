"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSubjectById } from "@/services/subjectService";
import { formatSlotTitle, isSlotSessionInFuture } from "@/lib/slot-display";
import { cn } from "@/lib/utils";
import { listPublicAvailabilitySlotsBySubject } from "@/services/availability";
import type { PublicAvailabilitySlot } from "@/types/availability";

export function CategorySubjectSlots({
  categoryId,
  subjectId,
  backHref,
}: {
  categoryId: string;
  subjectId: string;
  backHref?: string;
}) {
  const router = useRouter();
  const [slots, setSlots] = useState<PublicAvailabilitySlot[] | null>(null);
  const [title, setTitle] = useState<string>("Subject");
  const [categoryName, setCategoryName] = useState<string>("Category");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setSlots(null);

    void (async () => {
      try {
        const [subject, data] = await Promise.all([
          getSubjectById(subjectId),
          listPublicAvailabilitySlotsBySubject({ subjectId }),
        ]);
        if (!active) return;
        setTitle(subject.name);
        setCategoryName(subject.category?.name ?? "Category");
        setSlots(data);
      } catch (err: unknown) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load slots");
        setSlots([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [subjectId]);

  if (loading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-24 w-full max-w-2xl" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-destructive text-sm">{error}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href={`/categories/${encodeURIComponent(categoryId)}`}>
            Back to category
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link
            href={
              backHref ?? `/categories/${encodeURIComponent(categoryId)}`
            }
          >
            ← Category
          </Link>
        </Button>
      </div>

      <div>
        <p className="text-muted-foreground text-sm">{categoryName}</p>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Upcoming slots from all tutors — open slots can be booked; booked
          times are shown for reference.
        </p>
      </div>

      {(() => {
        const upcoming = (slots ?? []).filter(isSlotSessionInFuture);
        if (!slots || upcoming.length === 0) {
          return (
            <p className="text-muted-foreground text-sm">
              No upcoming slots right now. Check back later.
            </p>
          );
        }
        return (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((slot) => {
              const isBooked = slot.status === "booked";
              return (
                <li key={slot.id}>
                  <Card
                    className={cn(
                      "h-full",
                      isBooked &&
                        "border-amber-500/55 bg-amber-500/6 ring-1 ring-amber-500/25",
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle className="text-base font-medium leading-snug">
                            {formatSlotTitle(slot)}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center gap-2">
                            {slot.tutor.image ? (
                              <Image
                                src={slot.tutor.image}
                                alt=""
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                            ) : (
                              <span className="bg-muted inline-block size-5 rounded-full" />
                            )}
                            <span className="text-foreground font-medium">
                              {slot.tutor.name}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          {isBooked ? (
                            <span className="rounded-md border border-amber-600/60 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-900 dark:border-amber-500/50 dark:text-amber-100">
                              Booked
                            </span>
                          ) : null}
                          <span className="text-muted-foreground text-xs">
                            ${slot.price}
                          </span>
                        </div>
                      </div>

                      {slot.subject ? (
                        <div className="mt-3 space-y-1">
                          <p className="text-muted-foreground text-xs">
                            {slot.subject.category.name}
                          </p>
                          <p className="text-primary text-base font-semibold tracking-tight">
                            {slot.subject.name}
                          </p>
                        </div>
                      ) : null}
                    </CardHeader>
                    <CardContent>
                      {slot.status === "available" ? (
                        <Button
                          type="button"
                          className="w-full"
                          onClick={() =>
                            router.push(`/checkout/slots/${slot.id}`)
                          }
                        >
                          Book slot
                        </Button>
                      ) : (
                        <p className="text-muted-foreground text-center text-sm">
                          This slot is fully booked.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        );
      })()}
    </div>
  );
}

