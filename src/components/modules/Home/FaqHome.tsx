"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const accentStyles = [
  {
    pill: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800",
    icon: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  },
  {
    pill: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-800",
    icon: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  },
  {
    pill: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    icon: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
  {
    pill: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    icon: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  {
    pill: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    border: "border-pink-200 dark:border-pink-800",
    icon: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  },
];

const defaultFaqs = [
  {
    question: "What is SkillBridge?",
    answer:
      "SkillBridge is a platform where you can learn new skills from others and share what you know. Whether you want to pick up a new hobby, advance your career, or teach others, SkillBridge connects learners with skilled mentors in a simple, supportive environment.",
  },
  {
    question: "Is SkillBridge free to use?",
    answer:
      "You can join and explore SkillBridge for free. Some courses or one-on-one sessions may have a fee set by the instructor. We also offer premium features for instructors who want to grow their audience and manage their offerings.",
  },
  {
    question: "How do I become an instructor?",
    answer:
      "Sign up, complete your profile, and list the skills you want to teach. You can create courses, set your own pricing, and start accepting learners. We provide tools to schedule sessions, share materials, and get paid securely.",
  },
  {
    question: "How do I find courses or mentors?",
    answer:
      "Browse by skill, topic, or instructor. You can read reviews, see availability, and book sessions or enroll in courses that fit your goals. Many instructors offer free intro sessions so you can try before you commit.",
  },
  {
    question: "Can I cancel or get a refund?",
    answer:
      "Refund and cancellation policies depend on the instructor and the type of offering. You can see each instructor's policy before you book. For platform or billing issues, our support team is here to help.",
  },
];

interface FaqItem {
  question: string;
  answer: string;
}
interface FaqHomeProps {
  title?: string;
  description?: string;
  faqs?: FaqItem[];
  className?: string;
}

export function FaqHome({
  title = "Frequently asked questions.",
  description = "Everything you need to know about learning and teaching on SkillBridge.",
  faqs = defaultFaqs,
  className,
}: FaqHomeProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border/50 bg-background px-6 py-12 sm:px-10 sm:py-14",
        className,
      )}
    >
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 mb-4">
          Got questions?
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-2">
        {faqs.map((faq, i) => {
          const s = accentStyles[i % accentStyles.length];
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={cn(
                "rounded-xl border bg-background transition-colors",
                isOpen ? cn("border", s.border) : "border-border/60",
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-foreground sm:text-base">
                  {faq.question}
                </span>
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors",
                    s.icon,
                  )}
                >
                  {isOpen ? (
                    <Minus className="size-3.5" />
                  ) : (
                    <Plus className="size-3.5" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
