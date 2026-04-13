import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MaxWidth = "default" | "narrow";

export function DashboardPageShell({
  children,
  className,
  maxWidth = "default",
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: MaxWidth;
}) {
  return (
    <div className={cn("min-h-full bg-[#f8f7f4]", className)}>
      <div
        className={cn(
          "mx-auto px-4 py-8 md:px-6 md:py-10",
          maxWidth === "narrow" ? "max-w-3xl" : "max-w-6xl",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Navy gradient strip for dashboard section titles (matches public marketing pages). */
export function DashboardHero({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-[#0f1f3d] to-[#1a3260] p-6 shadow-md md:p-8">
      <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full border border-amber-400/15" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 size-24 rounded-full border border-amber-400/10 opacity-70" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-2">
          {eyebrow ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-amber-300/90">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-serif text-2xl font-medium tracking-tight text-white md:text-[28px]">
            {title}
          </h1>
          <p className="text-[14px] font-light leading-relaxed text-white/75">
            {description}
          </p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
