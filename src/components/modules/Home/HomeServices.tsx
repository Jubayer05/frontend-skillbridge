import { cn } from "@/lib/utils";
import {
  Award,
  BookOpen,
  MessageCircle,
  Sparkles,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  barColor: string;
}

const defaultServices: ServiceItem[] = [
  {
    id: "1",
    title: "Structured courses",
    description:
      "Step-by-step curricula designed by experts. Video lessons, assignments, and quizzes at your own pace.",
    icon: BookOpen,
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    barColor: "bg-blue-500",
  },
  {
    id: "2",
    title: "Live sessions",
    description:
      "Real-time workshops and Q&A. Get feedback and connect with instructors and learners live.",
    icon: Video,
    iconBg: "bg-teal-50 dark:bg-teal-950/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    barColor: "bg-teal-500",
  },
  {
    id: "3",
    title: "Mentorship",
    description:
      "One-on-one sessions with experienced mentors. Personalized guidance and accountability.",
    icon: Users,
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    barColor: "bg-violet-500",
  },
  {
    id: "4",
    title: "Certificates",
    description:
      "Earn certificates on completion. Showcase new skills on your profile and resume.",
    icon: Award,
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    barColor: "bg-amber-500",
  },
  {
    id: "5",
    title: "Community",
    description:
      "Discussions, progress sharing, and networking in a supportive learner community.",
    icon: MessageCircle,
    iconBg: "bg-pink-50 dark:bg-pink-950/40",
    iconColor: "text-pink-600 dark:text-pink-400",
    barColor: "bg-pink-500",
  },
  {
    id: "6",
    title: "Skill paths",
    description:
      "Curated paths combining courses and projects — from beginner to job-ready.",
    icon: Sparkles,
    iconBg: "bg-cyan-50 dark:bg-cyan-950/40",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    barColor: "bg-cyan-500",
  },
];

interface HomeServicesProps {
  title?: string;
  description?: string;
  services?: ServiceItem[];
  className?: string;
}

export function HomeServices({
  title = "Everything you need to grow.",
  description = "Learn new skills through courses, live sessions, and mentorship — all in one place.",
  services = defaultServices,
  className,
}: HomeServicesProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border/50",
        className,
      )}
    >
      <div className="px-6 pt-12 pb-0 text-center sm:px-10 sm:pt-14">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 mb-4">
          How it works
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground sm:text-lg mb-0">
            {description}
          </p>
        )}
      </div>

      {/* Flush grid — no padding, dividers via bg + gap:1px trick */}
      <div className="mt-10 grid grid-cols-1 gap-px bg-border/40 border-t border-border/40 sm:grid-cols-2 md:grid-cols-3">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <article
              key={s.id}
              className="group bg-background p-7 transition-colors hover:bg-muted/40"
            >
              <div
                className={cn(
                  "mb-4 inline-flex size-11 items-center justify-center rounded-xl",
                  s.iconBg,
                  s.iconColor,
                )}
              >
                <Icon className="size-5" aria-hidden />
              </div>
              {/* Colored accent bar */}
              <div className={cn("mb-3 h-0.5 w-8 rounded-full", s.barColor)} />
              <h3 className="text-base font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
