"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { TutorAvailabilityCalendar } from "@/components/modules/tutor/TutorAvailabilityCalendar";
import { StaticStars } from "@/components/modules/reviews/StarRating";
import { TutorReviewsSection } from "@/components/modules/reviews/TutorReviewsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { getTutorPublicDetail } from "@/services/tutorsBrowse";
import type {
  TutorPublicDetail,
  TutorPublicDetailTutor,
} from "@/types/tutor-discovery";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  Languages,
  Star,
} from "lucide-react";

function profileAvatarUrl(profile: TutorPublicDetailTutor): string {
  const name = profile.user.name;
  if (profile.profileImageUrl?.trim()) return profile.profileImageUrl.trim();
  if (profile.user.image?.trim()) return profile.user.image.trim();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=256&background=1a3260&color=fefefe`;
}

export function TutorPublicProfile({ tutorUserId }: { tutorUserId: string }) {
  const [detail, setDetail] = useState<TutorPublicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getTutorPublicDetail(tutorUserId, { reviewsPage: 1, reviewsLimit: 10 })
      .then((d) => {
        if (!active) return;
        setDetail(d);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load tutor");
        setDetail(null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tutorUserId]);

  if (loading) return <ProfileSkeleton />;

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
            <span className="text-red-400 text-2xl">!</span>
          </div>
          <p className="text-[#4a5568] text-[15px]">
            {error ?? "This tutor does not have a public profile yet."}
          </p>
          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#0f1f3d] border border-[#e4e1d8] bg-white px-4 py-2 rounded-lg hover:border-[#0f1f3d] transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Browse tutors
          </Link>
        </div>
      </div>
    );
  }

  const profile = detail.tutor;
  const ratingNum =
    profile.rating != null && profile.rating !== ""
      ? Number(profile.rating)
      : null;
  const avatarSrc = profileAvatarUrl(profile);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* ── Profile Hero ── */}
      <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3260] relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute right-[-80px] top-[-80px] w-72 h-72 rounded-full border border-amber-400/10 pointer-events-none" />
        <div className="absolute left-1/2 bottom-[-100px] w-48 h-48 rounded-full border border-amber-400/8 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
            {/* Avatar */}
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc}
                alt=""
                className="h-24 w-24 rounded-2xl border-[2.5px] border-white/15 object-cover shadow-xl md:h-28 md:w-28"
              />
              {profile.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-md border-2 border-[#0f1f3d]">
                  <BadgeCheck
                    className="size-4 text-[#0f1f3d]"
                    strokeWidth={2.5}
                  />
                </div>
              )}
            </div>

            {/* Name & headline */}
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="font-serif text-white text-[26px] md:text-[30px] font-medium leading-tight">
                  {profile.user.name}
                </h1>
                {profile.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full tracking-wide uppercase">
                    <BadgeCheck className="size-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-white/70 text-[15px] font-light mb-4">
                {profile.headline}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-white text-[22px] font-medium">
                    ${profile.hourlyRate}
                  </span>
                  <span className="text-white/50 text-[13px]">/ hr</span>
                </div>

                {ratingNum != null && !Number.isNaN(ratingNum) ? (
                  <div className="flex items-center gap-2">
                    <StaticStars value={ratingNum} />
                    <span className="text-white font-medium text-[14px] tabular-nums">
                      {detail.averageRating ?? profile.rating}
                    </span>
                    <span className="text-white/50 text-[13px]">
                      ({profile.totalReviews} reviews)
                    </span>
                  </div>
                ) : (
                  <span className="text-white/40 text-[13px]">
                    No ratings yet
                  </span>
                )}

                {profile.experience && (
                  <div className="flex items-center gap-1.5 text-white/60 text-[13px]">
                    <Clock className="size-3.5" />
                    {profile.experience} yrs experience
                  </div>
                )}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-2.5 flex-shrink-0 self-start md:self-end">
              <Link
                href={`/tutors/${encodeURIComponent(tutorUserId)}/slots`}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#0f1f3d] font-semibold text-[13px] px-5 py-2.5 rounded-lg transition-colors shadow-sm tracking-wide"
              >
                <CalendarDays className="size-4" /> Book session
              </Link>
              <Link
                href={`/tutors/${encodeURIComponent(tutorUserId)}/slots`}
                className="inline-flex items-center gap-2 border border-white/25 hover:border-white/50 text-white text-[13px] font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                View availability
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Left: Main content ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Section title="About">
            <p className="text-[#4a5568] text-[14px] leading-relaxed whitespace-pre-wrap">
              {profile.bio}
            </p>
          </Section>

          {/* Subjects */}
          {profile.subjects.length > 0 && (
            <Section title="Subjects taught">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {profile.subjects.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-[#e4e1d8] bg-white"
                  >
                    <div className="w-8 h-8 rounded-md bg-[#edf2ff] flex items-center justify-center flex-shrink-0">
                      <BookOpen className="size-4 text-[#1a3260]" />
                    </div>
                    <div>
                      <p className="text-[13.5px] font-medium text-[#0f1f3d]">
                        {s.name}
                      </p>
                      <p className="text-[11.5px] text-[#8896a8]">
                        {s.category.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section title="Availability">
            <TutorAvailabilityCalendar tutorUserId={tutorUserId} />
          </Section>
        </div>

        {/* ── Right: Sidebar info ── */}
        <div className="space-y-4">
          {/* Quick stats */}
          <div className="bg-white border border-[#e4e1d8] rounded-xl p-5 space-y-4">
            <h3 className="text-[11px] tracking-[0.1em] uppercase text-[#8896a8] font-medium">
              Details
            </h3>

            <InfoRow
              icon={<GraduationCap className="size-4 text-[#1a3260]" />}
              label="Education"
            >
              {profile.education}
            </InfoRow>

            {profile.experience && (
              <InfoRow
                icon={<Clock className="size-4 text-[#1a3260]" />}
                label="Experience"
              >
                {profile.experience} years teaching
              </InfoRow>
            )}

            {profile.languages.length > 0 && (
              <InfoRow
                icon={<Languages className="size-4 text-[#1a3260]" />}
                label="Languages"
              >
                {profile.languages.join(", ")}
              </InfoRow>
            )}

            {ratingNum != null && (
              <InfoRow
                icon={<Star className="size-4 text-amber-500" />}
                label="Rating"
              >
                <span className="font-medium">
                  {detail.averageRating ?? profile.rating}
                </span>
                <span className="text-[#8896a8] ml-1">
                  ({profile.totalReviews} reviews)
                </span>
              </InfoRow>
            )}
          </div>

          {/* Categories */}
          {profile.categories.length > 0 && (
            <div className="bg-white border border-[#e4e1d8] rounded-xl p-5">
              <h3 className="text-[11px] tracking-[0.1em] uppercase text-[#8896a8] font-medium mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.categories.map((c) => (
                  <span
                    key={c.id}
                    className="text-[12px] font-medium text-[#1a3260] bg-[#edf2ff] border border-[#c7d4f8] px-3 py-1 rounded-full"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sticky book CTA (desktop) */}
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3260] rounded-xl p-5 text-center">
            <p className="text-white font-serif text-[16px] font-medium mb-1">
              ${profile.hourlyRate}
              <span className="text-white/50 text-[13px] font-sans font-normal">
                {" "}
                / hr
              </span>
            </p>
            <p className="text-white/60 text-[12px] mb-4">
              Free cancellation up to 24h before
            </p>
            <Link
              href={`/tutors/${encodeURIComponent(tutorUserId)}/slots`}
              className="block w-full bg-amber-400 hover:bg-amber-300 text-[#0f1f3d] font-semibold text-[13px] py-2.5 rounded-lg transition-colors tracking-wide text-center"
            >
              Book a session
            </Link>
            <Link
              href={`/tutors/${encodeURIComponent(tutorUserId)}/slots`}
              className="block w-full mt-2 border border-white/20 hover:border-white/40 text-white text-[13px] font-medium py-2.5 rounded-lg transition-colors text-center"
            >
              View availability
            </Link>
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-serif text-[#0f1f3d] text-[22px] font-medium">
              Student reviews
            </h2>
            {profile.totalReviews > 0 && (
              <span className="bg-[#edf2ff] text-[#1a3260] text-[12px] font-medium px-3 py-0.5 rounded-full border border-[#c7d4f8]">
                {profile.totalReviews} total
              </span>
            )}
          </div>
          <p className="text-[#8896a8] text-[13px]">
            Verified feedback from completed sessions.
          </p>
        </div>
        <TutorReviewsSection
          key={tutorUserId}
          tutorUserId={tutorUserId}
          initialReviews={detail.reviews}
        />
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#e4e1d8] rounded-xl p-5 md:p-6">
      <h2 className="text-[11px] tracking-[0.1em] uppercase text-[#8896a8] font-medium mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-md bg-[#f0f4ff] flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-[#8896a8] uppercase tracking-wide font-medium mb-0.5">
          {label}
        </p>
        <p className="text-[13.5px] text-[#0f1f3d]">{children}</p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="bg-[#0f1f3d] h-14" />
      <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3260] px-6 py-14">
        <div className="max-w-5xl mx-auto flex gap-6 items-end">
          <Skeleton className="w-28 h-28 rounded-2xl bg-white/10" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-48 bg-white/10" />
            <Skeleton className="h-4 w-72 bg-white/10" />
            <Skeleton className="h-4 w-40 bg-white/10" />
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-52 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
