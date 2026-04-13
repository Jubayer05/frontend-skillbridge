"use client";

import SubjectList from "@/components/modules/subject/SubjectList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useCategoryById } from "@/hooks/useCategories";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import Link from "next/link";

export default function SubjectsPage({
  categoryId,
}: {
  categoryId?: string;
}) {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "TUTOR";
  const { category: filterCategory } = useCategoryById(categoryId ?? "");

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1f3d] to-[#1a3260]">
        <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full border border-amber-400/10" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 size-32 rounded-full border border-amber-400/10 opacity-60" />

        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
          {categoryId ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="mb-6 -ml-2 text-white/85 hover:bg-white/10 hover:text-white"
            >
              <Link href="/subjects" className="gap-2">
                <ArrowLeft className="size-4" />
                All subjects
              </Link>
            </Button>
          ) : null}

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-amber-300/90">
                Explore topics
              </p>
              <h1 className="font-serif text-[28px] font-medium leading-tight text-white md:text-[32px]">
                {categoryId && filterCategory?.name
                  ? `Subjects in ${filterCategory.name}`
                  : "Subjects"}
              </h1>
              <p className="text-[15px] font-light leading-relaxed text-white/70">
                {categoryId
                  ? "Tutors and courses organized under this category."
                  : "Browse every subject on SkillBridge and discover who teaches what."}
              </p>
            </div>
            {canManage ? (
              <Button
                asChild
                className="shrink-0 bg-amber-400 font-semibold text-[#0f1f3d] shadow-sm hover:bg-amber-300"
              >
                <Link href="/dashboard/subjects/new" className="gap-2">
                  <Plus className="size-4" />
                  New subject
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        {!categoryId ? (
          <div className="mb-8 flex flex-wrap items-center gap-2 rounded-xl border border-[#e4e1d8] bg-white px-4 py-3 text-[13px] text-[#4a5568] shadow-sm">
            <BookOpen className="size-4 shrink-0 text-[#1a3260]" />
            <span>
              Filter by category from the{" "}
              <Link
                href="/categories"
                className="font-medium text-[#1a3260] underline-offset-2 hover:underline"
              >
                categories
              </Link>{" "}
              page, or browse everything below.
            </span>
          </div>
        ) : null}
        <SubjectList categoryId={categoryId} />
      </div>
    </div>
  );
}
