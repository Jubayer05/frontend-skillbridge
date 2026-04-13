"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/services/reviews";
import type { Review } from "@/types/review";

import { StarRatingInput } from "./StarRating";

export function ReviewModal({
  open,
  onOpenChange,
  bookingId,
  sessionLabel,
  onSubmitted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  sessionLabel: string;
  onSubmitted: (review: Review) => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setRating(0);
    setComment("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session feedback</DialogTitle>
          <DialogDescription>
            Rate your experience for{" "}
            <span className="text-foreground font-medium">{sessionLabel}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <p className="text-sm font-medium">Rating</p>
            <StarRatingInput
              value={rating}
              onChange={setRating}
              disabled={submitting}
            />
            {rating === 0 ? (
              <p className="text-muted-foreground text-xs">Tap a star to choose 1–5.</p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <label htmlFor="review-comment" className="text-sm font-medium">
              Comments (optional)
            </label>
            <Textarea
              id="review-comment"
              placeholder="What went well? What could improve?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={submitting}
              rows={4}
              maxLength={2000}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={submitting || rating < 1}
            onClick={() => {
              setSubmitting(true);
              createReview({
                bookingId,
                rating,
                ...(comment.trim() ? { comment: comment.trim() } : {}),
              })
                .then((review) => {
                  toast.success("Thanks for your feedback");
                  onSubmitted(review);
                  reset();
                  onOpenChange(false);
                })
                .catch((err: Error) => {
                  toast.error(err.message ?? "Could not submit review");
                })
                .finally(() => setSubmitting(false));
            }}
          >
            Submit review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
