"use client";

import { useEffect, useRef, useState } from "react";
import type { Settings } from "react-slick";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { Skeleton } from "@/components/ui/skeleton";
import { listTutorReviews } from "@/services/reviews";
import type { PaginatedReviews, Review } from "@/types/review";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const PAGE_SIZE = 10;

/** Match react-slick `responsive` breakpoint (slidesToShow below this width). */
function useSlidesVisible(): number {
  const [n, setN] = useState(2);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setN(mq.matches ? 1 : 2);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return n;
}

// ── Review Card ───────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const initials = (review.student?.name ?? "A")
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const rating = Number(review.rating ?? 0);
  const date = review.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
      }).format(new Date(review.createdAt))
    : null;

  return (
    <div
      className="group h-full bg-white border border-[#e4e1d8] rounded-xl p-5 md:p-6 flex flex-col gap-4 transition-all duration-200 hover:border-[#1a3260] hover:shadow-md"
      style={{ minHeight: 220 }}
    >
      {/* Quote icon */}
      <Quote
        className="size-5 text-amber-400/60 flex-shrink-0"
        strokeWidth={1.5}
      />

      {/* Review text */}
      <p className="text-[13.5px] text-[#4a5568] leading-relaxed flex-1 line-clamp-5">
        {review.comment ?? ""}
      </p>

      {/* Footer: reviewer info + stars */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#eeede8]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1a3260, #2c5490)" }}
          >
            {initials}
          </div>
          <div>
            <p className="text-[12.5px] font-medium text-[#0f1f3d] leading-none">
              {review.student?.name ?? "Anonymous"}
            </p>
            {date && (
              <p className="text-[11px] text-[#8896a8] mt-0.5">{date}</p>
            )}
          </div>
        </div>

        {/* Stars */}
        {rating > 0 && (
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="size-3"
                fill={i < Math.round(rating) ? "#c9a84c" : "none"}
                stroke={i < Math.round(rating) ? "#c9a84c" : "#d1d5db"}
                strokeWidth={1.5}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────
export function TutorReviewsSection({
  tutorUserId,
  initialReviews,
}: {
  tutorUserId: string;
  initialReviews?: PaginatedReviews | null;
}) {
  const sliderRef = useRef<Slider>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    () => initialReviews?.totalPages ?? 0,
  );
  const [total, setTotal] = useState(() => initialReviews?.total ?? 0);
  const [items, setItems] = useState<Review[]>(
    () => initialReviews?.data ?? [],
  );
  const [loading, setLoading] = useState(() => !initialReviews);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const slidesVisible = useSlidesVisible();

  useEffect(() => {
    if (initialReviews && page === 1) {
      setTotalPages(initialReviews.totalPages);
      setTotal(initialReviews.total);
      setItems(initialReviews.data);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(page === 1);
    setLoadingMore(page > 1);
    setError(null);
    void listTutorReviews(tutorUserId, { page, limit: PAGE_SIZE })
      .then((res) => {
        if (!active) return;
        setTotalPages(res.totalPages);
        setTotal(res.total);
        setItems((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load reviews");
        if (page === 1) setItems([]);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setLoadingMore(false);
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorUserId, page]);

  if (loading && page === 1) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-[13px] bg-red-50 border border-red-100 px-4 py-3 rounded-lg">
        {error}
      </p>
    );
  }

  if (total === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-[#e4e1d8] rounded-xl bg-white">
        <Quote
          className="size-8 text-[#c7d4f8] mx-auto mb-3"
          strokeWidth={1.5}
        />
        <p className="text-[#0f1f3d] font-medium text-[14px]">No reviews yet</p>
        <p className="text-[#8896a8] text-[13px] mt-1">
          Completed sessions can be reviewed by students.
        </p>
      </div>
    );
  }

  // Use carousel for 3+ reviews, simple grid otherwise
  const useCarousel = items.length >= 3;

  const sliderSettings: Settings = {
    dots: false,
    infinite: false,
    speed: 350,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    swipe: true,
    touchMove: true,
    afterChange: (current: number) => setActiveSlide(current),
    responsive: [
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  const totalSlides = items.length;
  const maxSlideIndex = Math.max(0, totalSlides - slidesVisible);
  const isAtStart = activeSlide <= 0;
  const isAtEnd = activeSlide >= maxSlideIndex;

  return (
    <div className="space-y-6">
      {useCarousel ? (
        <div className="relative px-6">
          {/* Custom nav buttons */}
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            disabled={isAtStart}
            aria-label="Previous reviews"
            className={`absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border flex items-center justify-center shadow-sm transition-all ${
              isAtStart
                ? "border-[#e4e1d8] text-[#c7d4f8] cursor-not-allowed"
                : "border-[#e4e1d8] text-[#8896a8] hover:border-[#0f1f3d] hover:text-[#0f1f3d]"
            }`}
          >
            <ChevronLeft className="size-4" />
          </button>

          <button
            onClick={() => sliderRef.current?.slickNext()}
            disabled={isAtEnd}
            aria-label="Next reviews"
            className={`absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border flex items-center justify-center shadow-sm transition-all ${
              isAtEnd
                ? "border-[#e4e1d8] text-[#c7d4f8] cursor-not-allowed"
                : "border-[#e4e1d8] text-[#8896a8] hover:border-[#0f1f3d] hover:text-[#0f1f3d]"
            }`}
          >
            <ChevronRight className="size-4" />
          </button>

          <Slider ref={sliderRef} {...sliderSettings}>
            {items.map((r) => (
              <div key={r.id} className="px-2">
                <ReviewCard review={r} />
              </div>
            ))}
          </Slider>

          {/* Dot indicators (one per valid "page" position) */}
          {maxSlideIndex > 0 && (
            <div className="flex justify-center gap-1.5 mt-5">
              {Array.from({ length: maxSlideIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sliderRef.current?.slickGoTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`rounded-full transition-all ${
                    i === activeSlide
                      ? "h-2 w-5 bg-[#0f1f3d]"
                      : "h-2 w-2 bg-[#d1d5db] hover:bg-[#8896a8]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}

      {/* Load more */}
      {page < totalPages && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#0f1f3d] border border-[#e4e1d8] bg-white hover:border-[#0f1f3d] px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-[#0f1f3d] border-t-transparent animate-spin" />
                Loading…
              </>
            ) : (
              `Load more reviews (${total - items.length} remaining)`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
