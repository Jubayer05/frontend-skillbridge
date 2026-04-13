"use client";

import SubjectCard from "@/components/modules/subject/SubjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryById } from "@/hooks/useCategories";
import { useSubjects } from "@/hooks/useSubjects";
import { FolderOpen } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function SubjectListSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-[#e4e1d8] bg-white p-5 shadow-sm"
        >
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export default function SubjectList({
  categoryId,
}: {
  categoryId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { subjects, loading, error } = useSubjects(categoryId);
  const base = (pathname ?? "").startsWith("/dashboard/")
    ? "/dashboard/subjects"
    : "/subjects";
  const { category: filterCategory } = useCategoryById(
    categoryId ?? "",
  );

  if (loading) {
    return <SubjectListSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-[13px] text-red-800">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categoryId ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#c7d4f8] bg-[#edf2ff]/80 px-4 py-3 text-[13px] text-[#1a3260]">
          <FolderOpen className="size-4 shrink-0" />
          <span>
            Filtered by{" "}
            <span className="font-semibold">
              {filterCategory?.name ?? "this category"}
            </span>
            .{" "}
            <Link
              href={base}
              className="font-medium underline-offset-2 hover:underline"
            >
              Clear filter
            </Link>
          </span>
        </div>
      ) : null}
      {subjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e4e1d8] bg-white px-8 py-14 text-center">
          <FolderOpen className="mx-auto mb-4 size-10 text-[#c7d4f8]" />
          <p className="text-[15px] font-medium text-[#0f1f3d]">
            No subjects found
          </p>
          <p className="mt-2 text-[13px] text-[#8896a8]">
            Try another category or check back later.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onClick={() => {
                router.push(`${base}/${subject.id}`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
