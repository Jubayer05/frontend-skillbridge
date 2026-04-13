"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subject } from "@/types/subject";

export default function SubjectCard({
  subject,
  onClick,
}: {
  subject: Subject;
  onClick: () => void;
}) {
  const tutorCount = subject._count?.tutorProfiles ?? 0;
  const categoryName = subject.category?.name ?? "Category";

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <Card className="h-full border-[#e4e1d8] bg-white shadow-sm transition-all hover:border-[#1a3260]/35 hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-[17px] font-semibold leading-snug text-[#0f1f3d]">
            {subject.name}
          </CardTitle>
          <Badge
            variant="outline"
            className="shrink-0 border-[#c7d4f8] bg-[#edf2ff] text-[11px] font-medium text-[#1a3260]"
          >
            {categoryName}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="line-clamp-2 text-[13px] leading-relaxed text-[#4a5568]">
            {subject.description ?? "No description"}
          </p>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#8896a8]">
            {tutorCount} tutor{tutorCount === 1 ? "" : "s"}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}
