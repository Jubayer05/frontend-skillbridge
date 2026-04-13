"use client";

import { TutorDiscoveryCard } from "@/components/tutor/TutorCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";
import { listTutors } from "@/services/tutorsBrowse";
import type {
  PaginatedTutorList,
  TutorBrowseSort,
} from "@/types/tutor-discovery";
import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function parseNum(s: string | null): number | undefined {
  if (s == null || s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

const SORT_OPTIONS: { value: TutorBrowseSort; label: string }[] = [
  { value: "rating_desc", label: "Rating: high to low" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "newest", label: "Newest profiles" },
];

const RATING_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "3", label: "3+ ★" },
  { value: "4", label: "4+ ★" },
  { value: "4.5", label: "4.5+ ★" },
];

export function TutorsBrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: catLoading } = useCategories();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<PaginatedTutorList | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const page = Math.max(1, parseNum(searchParams.get("page")) ?? 1);
  const limit = Math.min(
    48,
    Math.max(1, parseNum(searchParams.get("limit")) ?? 12),
  );
  const categoryId = searchParams.get("categoryId") ?? "";
  const minPrice = parseNum(searchParams.get("minPrice"));
  const maxPrice = parseNum(searchParams.get("maxPrice"));
  const minRating = parseNum(searchParams.get("minRating"));
  const q = searchParams.get("q") ?? "";
  const sort =
    (searchParams.get("sort") as TutorBrowseSort | null) ?? "rating_desc";

  const validSort: TutorBrowseSort =
    sort === "price_asc" ||
    sort === "price_desc" ||
    sort === "newest" ||
    sort === "rating_desc"
      ? sort
      : "rating_desc";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listTutors({
        page,
        limit,
        categoryId: categoryId || undefined,
        minPrice,
        maxPrice,
        minRating,
        q: q || undefined,
        sort: validSort,
      });
      setData(res);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to load tutors");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, categoryId, minPrice, maxPrice, minRating, q, validSort]);

  useEffect(() => {
    void load();
  }, [load]);

  const pushFilters = (next: Record<string, string | undefined>) => {
    const p = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === undefined || v === "") p.delete(k);
      else p.set(k, v);
    }
    if (!("page" in next)) p.set("page", "1");
    router.push(`/tutors?${p.toString()}`);
  };

  const hasActiveFilters = !!(
    categoryId ||
    minPrice ||
    maxPrice ||
    minRating ||
    q
  );

  return (
    <div className="bg-[#f8f7f4] font-sans">
      {/* ── Main layout ── */}
      <div className="mx-auto flex max-w-7xl items-start gap-6 px-4 py-8 md:px-6">
        {/* Mobile filter toggle */}
        <button
          className="md:hidden flex items-center gap-2 text-[13px] font-medium text-[#0f1f3d] border border-[#e4e1d8] bg-white px-4 py-2 rounded-lg mb-4 self-start"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-[#0f1f3d] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {/* ── Sidebar ── */}
        <aside
          className={cn(
            "sticky top-4 w-64 shrink-0 transition-all md:top-24",
            "hidden md:block",
            sidebarOpen &&
              "!block fixed inset-0 z-40 w-full md:relative md:w-64",
          )}
        >
          {sidebarOpen && (
            <div
              className="absolute inset-0 bg-black/40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div
            className={cn(
              "bg-white rounded-xl border border-[#e4e1d8] overflow-hidden",
              sidebarOpen &&
                "relative z-10 max-w-72 h-screen overflow-y-auto md:h-auto",
            )}
          >
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-[#eeede8] flex items-center justify-between">
              <span className="text-[11px] tracking-[0.1em] uppercase text-[#8896a8] font-medium">
                Filters
              </span>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={() => router.push("/tutors")}
                    className="text-[11px] text-amber-600 font-medium uppercase tracking-wider hover:text-amber-700"
                  >
                    Clear all
                  </button>
                )}
                <button
                  className="md:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="size-4 text-[#8896a8]" />
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="px-4 py-4 border-b border-[#eeede8]">
              <Label className="text-[11px] tracking-[0.08em] uppercase text-[#8896a8] font-medium mb-2 block">
                Category
              </Label>
              {catLoading ? (
                <div className="space-y-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-7 rounded-md" />
                  ))}
                </div>
              ) : (
                <div className="space-y-0.5">
                  <button
                    onClick={() => pushFilters({ categoryId: undefined })}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] transition-colors",
                      !categoryId
                        ? "bg-[#edf2ff] text-[#1a3260] font-medium"
                        : "text-[#4a5568] hover:bg-[#f8f7f4]",
                    )}
                  >
                    All subjects
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => pushFilters({ categoryId: c.id })}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] transition-colors",
                        categoryId === c.id
                          ? "bg-[#edf2ff] text-[#1a3260] font-medium"
                          : "text-[#4a5568] hover:bg-[#f8f7f4]",
                      )}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price range */}
            <div className="px-4 py-4 border-b border-[#eeede8]">
              <Label className="text-[11px] tracking-[0.08em] uppercase text-[#8896a8] font-medium mb-2 block">
                Price per hour
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[#8896a8] font-medium mb-1">
                    Min $
                  </p>
                  <Input
                    type="number"
                    min={0}
                    defaultValue={minPrice ?? ""}
                    placeholder="0"
                    className="h-8 text-[13px] border-[#e4e1d8]"
                    onBlur={(e) =>
                      pushFilters({ minPrice: e.target.value || undefined })
                    }
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[#8896a8] font-medium mb-1">
                    Max $
                  </p>
                  <Input
                    type="number"
                    min={0}
                    defaultValue={maxPrice ?? ""}
                    placeholder="Any"
                    className="h-8 text-[13px] border-[#e4e1d8]"
                    onBlur={(e) =>
                      pushFilters({ maxPrice: e.target.value || undefined })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Min rating */}
            <div className="px-4 py-4">
              <Label className="text-[11px] tracking-[0.08em] uppercase text-[#8896a8] font-medium mb-2 block">
                Minimum rating
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {RATING_OPTIONS.map((opt) => {
                  const active =
                    opt.value === "any"
                      ? minRating == null
                      : String(minRating) === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() =>
                        pushFilters({
                          minRating:
                            opt.value === "any" ? undefined : opt.value,
                        })
                      }
                      className={cn(
                        "px-3 py-1 rounded-full border text-[12px] transition-all",
                        active
                          ? "bg-[#0f1f3d] border-[#0f1f3d] text-white font-medium"
                          : "bg-white border-[#e4e1d8] text-[#4a5568] hover:border-[#0f1f3d]",
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Content ── */}
        <div className="min-w-0 flex-1">
          {/* Search + toolbar */}
          <div className="mb-5 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 overflow-hidden rounded-lg border border-[#e4e1d8] bg-white shadow-sm">
              <input
                ref={searchInputRef}
                type="search"
                defaultValue={q}
                placeholder="Search by name, subject, or keyword…"
                className="placeholder:text-muted-foreground h-10 min-w-0 flex-1 border-0 bg-transparent px-3 text-[13.5px] text-[#0f1f3d] outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    pushFilters({
                      q: (e.target as HTMLInputElement).value || undefined,
                    });
                  }
                }}
              />
              <button
                type="button"
                onClick={() =>
                  pushFilters({
                    q: searchInputRef.current?.value?.trim() || undefined,
                  })
                }
                className="flex shrink-0 items-center gap-2 bg-amber-400 px-4 text-[13px] font-medium text-[#0f1f3d] transition-colors hover:bg-amber-300"
              >
                <Search className="size-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-[#4a5568]">
              {loading ? (
                <span className="text-[#8896a8]">Loading…</span>
              ) : data ? (
                <>
                  <span className="font-medium text-[#0f1f3d]">
                    {data.total}
                  </span>{" "}
                  tutor{data.total === 1 ? "" : "s"} found
                </>
              ) : null}
            </p>

            <div className="flex items-center gap-2.5">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#8896a8] whitespace-nowrap hidden sm:block">
                  Sort by
                </span>
                <Select
                  value={validSort}
                  onValueChange={(v) =>
                    pushFilters({ sort: v as TutorBrowseSort })
                  }
                >
                  <SelectTrigger className="h-8 text-[12.5px] border-[#e4e1d8] bg-white w-auto min-w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem
                        key={o.value}
                        value={o.value}
                        className="text-[13px]"
                      >
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View toggle */}
              <div className="flex border border-[#e4e1d8] rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  className={cn(
                    "w-8 h-8 flex items-center justify-center transition-colors",
                    view === "grid" ? "bg-[#0f1f3d]" : "hover:bg-[#f8f7f4]",
                  )}
                >
                  <LayoutGrid
                    className={cn(
                      "size-3.5",
                      view === "grid" ? "text-white" : "text-[#8896a8]",
                    )}
                  />
                </button>
                <button
                  onClick={() => setView("list")}
                  aria-label="List view"
                  className={cn(
                    "w-8 h-8 flex items-center justify-center transition-colors",
                    view === "list" ? "bg-[#0f1f3d]" : "hover:bg-[#f8f7f4]",
                  )}
                >
                  <List
                    className={cn(
                      "size-3.5",
                      view === "list" ? "text-white" : "text-[#8896a8]",
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {q && (
                <FilterChip
                  label={`"${q}"`}
                  onRemove={() => pushFilters({ q: undefined })}
                />
              )}
              {categoryId && (
                <FilterChip
                  label={
                    categories.find((c) => c.id === categoryId)?.name ??
                    categoryId
                  }
                  onRemove={() => pushFilters({ categoryId: undefined })}
                />
              )}
              {minPrice != null && (
                <FilterChip
                  label={`Min $${minPrice}`}
                  onRemove={() => pushFilters({ minPrice: undefined })}
                />
              )}
              {maxPrice != null && (
                <FilterChip
                  label={`Max $${maxPrice}`}
                  onRemove={() => pushFilters({ maxPrice: undefined })}
                />
              )}
              {minRating != null && (
                <FilterChip
                  label={`${minRating}+ stars`}
                  onRemove={() => pushFilters({ minRating: undefined })}
                />
              )}
            </div>
          )}

          {/* Cards */}
          {loading && !data ? (
            <div
              className={
                view === "grid"
                  ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  : "space-y-3"
              }
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={
                    view === "grid" ? "h-80 rounded-xl" : "h-24 rounded-xl"
                  }
                />
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[#8896a8] text-[15px] mb-1">
                No tutors match your filters.
              </p>
              <Link
                href="/tutors"
                className="text-[13px] text-amber-600 underline underline-offset-2"
              >
                Reset all filters
              </Link>
            </div>
          ) : view === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {data?.items.map((t) => (
                <TutorDiscoveryCard key={t.id} tutor={t} variant="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {data?.items.map((t) => (
                <TutorDiscoveryCard key={t.id} tutor={t} variant="list" />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-8 mt-6 border-t border-[#eeede8]">
              <PaginationButton
                onClick={() => {
                  const p = new URLSearchParams(searchParams.toString());
                  p.set("page", String(page - 1));
                  router.push(`/tutors?${p.toString()}`);
                }}
                disabled={page <= 1 || loading}
                aria-label="Previous page"
              >
                ←
              </PaginationButton>

              {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
                const pg = i + 1;
                return (
                  <PaginationButton
                    key={pg}
                    active={pg === page}
                    onClick={() => {
                      const p = new URLSearchParams(searchParams.toString());
                      p.set("page", String(pg));
                      router.push(`/tutors?${p.toString()}`);
                    }}
                    disabled={loading}
                  >
                    {pg}
                  </PaginationButton>
                );
              })}

              {data.totalPages > 5 && (
                <span className="text-[13px] text-[#8896a8] px-2">…</span>
              )}

              <span className="text-[12px] text-[#8896a8] px-3 tabular-nums">
                Page {page} of {data.totalPages}
              </span>

              <PaginationButton
                onClick={() => {
                  const p = new URLSearchParams(searchParams.toString());
                  p.set("page", String(page + 1));
                  router.push(`/tutors?${p.toString()}`);
                }}
                disabled={page >= data.totalPages || loading}
                aria-label="Next page"
              >
                →
              </PaginationButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#edf2ff] text-[#1a3260] text-[12px] font-medium px-3 py-1 rounded-full border border-[#c7d4f8]">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-red-500 transition-colors"
        aria-label={`Remove filter: ${label}`}
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

function PaginationButton({
  children,
  active,
  disabled,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  "aria-label"?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "w-8 h-8 rounded-lg border text-[13px] font-medium transition-all flex items-center justify-center",
        active
          ? "bg-[#0f1f3d] border-[#0f1f3d] text-white shadow-sm"
          : "bg-white border-[#e4e1d8] text-[#4a5568] hover:border-[#0f1f3d] hover:text-[#0f1f3d]",
        disabled && "opacity-35 cursor-not-allowed pointer-events-none",
      )}
    >
      {children}
    </button>
  );
}
