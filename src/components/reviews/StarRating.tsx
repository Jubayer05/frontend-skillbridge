"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StaticStars({
  value,
  className,
  starClassName,
}: {
  value: number;
  className?: string;
  /** Override default star icon size (e.g. `size-3.5`). */
  starClassName?: string;
}) {
  const v = Math.round(Math.min(5, Math.max(0, value)));
  return (
    <div
      className={cn("flex gap-0.5", className)}
      aria-label={`${v} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "shrink-0",
            starClassName ?? "size-4",
            i <= v
              ? "fill-amber-400 text-amber-500"
              : "text-muted-foreground/35",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function StarRatingInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          className={cn(
            "rounded-sm p-0.5 transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
            disabled && "pointer-events-none opacity-50",
          )}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          aria-pressed={value === n}
        >
          <Star
            className={cn(
              "size-8",
              n <= value
                ? "fill-amber-400 text-amber-500"
                : "text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}
