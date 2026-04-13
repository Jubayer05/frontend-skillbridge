"use client";

import TutorCard from "@/components/tutor/TutorCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubjectById, useTutorsBySubject } from "@/hooks/useSubjects";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-serif text-[20px] font-medium tracking-tight text-[#0f1f3d] md:text-[22px]">
      {children}
    </h2>
  );
}

export default function SubjectDetail({
  subjectId,
}: {
  subjectId: string;
}) {
  const {
    subject,
    loading: subjectLoading,
    error: subjectError,
  } = useSubjectById(subjectId);
  const {
    tutors,
    loading: tutorsLoading,
    error: tutorsError,
  } = useTutorsBySubject(subjectId);

  const categoryHref = subject?.category?.id
    ? `/subjects?categoryId=${encodeURIComponent(subject.category.id)}`
    : "/subjects";

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1f3d] to-[#1a3260]">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full border border-amber-400/10" />
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          {subjectLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-5 w-48 bg-white/10" />
              <Skeleton className="h-10 w-full max-w-lg bg-white/10" />
              <Skeleton className="h-16 w-full max-w-2xl bg-white/10" />
            </div>
          ) : subjectError ? (
            <div className="rounded-xl border border-red-400/40 bg-red-950/30 px-4 py-3 text-[13px] text-red-100">
              {subjectError}
            </div>
          ) : subject ? (
            <>
              {subject.category ? (
                <Link
                  href={categoryHref}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wide text-amber-300/95 hover:text-amber-200"
                >
                  <BookOpen className="size-3.5" />
                  {subject.category.name}
                </Link>
              ) : (
                <span className="text-[12px] font-medium uppercase tracking-wide text-amber-300/80">
                  Subject
                </span>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-[28px] font-medium leading-tight text-white md:text-[34px]">
                  {subject.name}
                </h1>
                {subject._count?.tutorProfiles !== undefined ? (
                  <Badge className="border-amber-400/50 bg-amber-400/15 text-[11px] font-semibold uppercase tracking-wide text-amber-100">
                    <Users className="mr-1 size-3" />
                    {subject._count.tutorProfiles} tutor
                    {subject._count.tutorProfiles === 1 ? "" : "s"}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-4 max-w-3xl text-[15px] font-light leading-relaxed text-white/75 whitespace-pre-wrap">
                {subject.description?.trim()
                  ? subject.description
                  : "No description has been added for this subject yet."}
              </p>
            </>
          ) : null}
        </div>
      </div>

      {/* Tutors */}
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:px-6 md:py-12">
        <div className="rounded-xl border border-[#e4e1d8] bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6 flex flex-col gap-2 border-b border-[#eeede8] pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-[#8896a8]">
                <GraduationCap className="size-4" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">
                  Tutors
                </span>
              </div>
              <SectionTitle>Tutors with availability</SectionTitle>
              <p className="mt-1 text-[13px] text-[#8896a8]">
                Instructors who have at least one open slot for this subject.
              </p>
            </div>
          </div>
          {tutorsLoading ? (
            <div className="grid gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-52 w-full rounded-xl" />
              ))}
            </div>
          ) : tutorsError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-800">
              {tutorsError}
            </p>
          ) : tutors.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e4e1d8] bg-[#fafaf8] px-6 py-10 text-center">
              <Users className="mx-auto mb-3 size-9 text-[#c7d4f8]" />
              <p className="text-[14px] font-medium text-[#0f1f3d]">
                No tutors yet
              </p>
              <p className="mt-1 text-[13px] text-[#8896a8]">
                No one has published slots for this subject. Check back later
                or explore other subjects.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
