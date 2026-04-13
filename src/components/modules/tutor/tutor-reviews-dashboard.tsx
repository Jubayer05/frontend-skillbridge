"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { StaticStars } from "@/components/reviews/StarRating";
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
import { listMyTutorDashboardReviews } from "@/services/reviews";
import type { TutorDashboardReviewRow } from "@/types/review";

const PAGE_SIZE = 15;

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

function formatSession(row: TutorDashboardReviewRow) {
  const { slotName, date, startTime, endTime } = row.booking;
  const label = slotName.trim() ? slotName : "Session";
  return `${label} · ${date} · ${startTime}–${endTime}`;
}

export function TutorReviewsDashboardPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState<TutorDashboardReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((p: number) => {
    setLoading(true);
    setError(null);
    void listMyTutorDashboardReviews({ page: p, limit: PAGE_SIZE })
      .then((res) => {
        setRows(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setPage(res.page);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Could not load reviews");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Feedback from students after completed sessions ({total} total).
        </p>
      </div>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Student feedback</CardTitle>
          <CardDescription>
            Ratings, comments, student details, and the booked slot for each review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : rows.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No reviews yet. Students can leave feedback after you mark a booking as
              completed.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Student</TableHead>
                    <TableHead className="w-[140px]">Rating</TableHead>
                    <TableHead className="min-w-[220px]">Message</TableHead>
                    <TableHead className="min-w-[240px]">Booking / slot</TableHead>
                    <TableHead className="w-[160px] whitespace-nowrap">
                      Review time
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="bg-muted relative size-9 shrink-0 overflow-hidden rounded-full">
                            {row.student.image ? (
                              <Image
                                src={row.student.image}
                                alt=""
                                width={36}
                                height={36}
                                className="size-9 object-cover"
                              />
                            ) : (
                              <span className="text-muted-foreground flex size-9 items-center justify-center text-xs font-medium">
                                {initials(row.student.name)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{row.student.name}</p>
                            <p className="text-muted-foreground truncate text-xs">
                              {row.student.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <StaticStars value={row.rating} />
                          <span className="text-muted-foreground text-xs tabular-nums">
                            {row.rating}/5
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[320px]">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {row.comment?.trim()
                            ? row.comment
                            : "—"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm leading-snug">{formatSession(row)}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                        {new Date(row.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 ? (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-4">
                  <p className="text-muted-foreground text-sm">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page <= 1 || loading}
                      onClick={() => load(page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages || loading}
                      onClick={() => load(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
