"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";

const RANDOMUSER_BASE = "https://randomuser.me/api/portraits";

const accentColors = [
  "from-violet-600 to-violet-400",
  "from-teal-600 to-teal-400",
  "from-orange-600 to-orange-400",
  "from-blue-600 to-blue-400",
];

const starColors = [
  "fill-violet-500 text-violet-500",
  "fill-teal-500 text-teal-500",
  "fill-orange-500 text-orange-500",
  "fill-blue-500 text-blue-500",
];

const defaultReviews = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Designer",
    avatar: `${RANDOMUSER_BASE}/women/32.jpg`,
    text: "SkillBridge helped me level up my design skills with real projects and feedback from working designers. The 1:1 sessions were worth every penny.",
    rating: 5,
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "Software Developer",
    avatar: `${RANDOMUSER_BASE}/men/22.jpg`,
    text: "I went from zero to landing my first dev job in six months. The mentors on SkillBridge know their stuff and actually care about your progress.",
    rating: 5,
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    role: "Marketing Lead",
    avatar: `${RANDOMUSER_BASE}/women/44.jpg`,
    text: "Finally a platform where I could learn analytics and content strategy from people doing it day to day. No fluff, just practical skills.",
    rating: 5,
  },
  {
    id: "4",
    name: "James Okonkwo",
    role: "Freelance Writer",
    avatar: `${RANDOMUSER_BASE}/men/67.jpg`,
    text: "The writing and storytelling courses connected me with editors who gave me actionable feedback. My portfolio improved dramatically.",
    rating: 5,
  },
];

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar?: string;
}

interface HomeReviewsProps {
  title?: string;
  description?: string;
  reviews?: ReviewItem[];
  autoplayDelay?: number;
  className?: string;
}

export function HomeReviews({
  title = "What learners are saying.",
  description = "Real stories from people who built new skills and grew their careers on SkillBridge.",
  reviews = defaultReviews,
  autoplayDelay = 5000,
  className,
}: HomeReviewsProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  React.useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => api.scrollNext(), autoplayDelay);
    return () => clearInterval(interval);
  }, [api, autoplayDelay]);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border/50 bg-background px-6 py-12 sm:px-10 sm:py-14",
        className,
      )}
    >
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 mb-4">
          Learner stories
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

      <Carousel
        opts={{ loop: true, align: "start" }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {reviews.map((review, i) => (
            <CarouselItem
              key={review.id}
              className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
            >
              <div className="relative rounded-xl border border-border/60 bg-background p-6 h-full flex flex-col overflow-hidden">
                {/* Top color bar */}
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r",
                    accentColors[i % accentColors.length],
                  )}
                />

                {/* Star row */}
                <div className="flex gap-1 mb-4 mt-1">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <svg
                      key={j}
                      className={cn(
                        "size-4",
                        starColors[i % starColors.length],
                      )}
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="flex-1 text-sm text-foreground leading-relaxed mb-5">
                  &ldquo;{review.text}&rdquo;
                </blockquote>

                <footer className="flex items-center gap-3">
                  <Image
                    src={review.avatar ?? `${RANDOMUSER_BASE}/men/1.jpg`}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover ring-2 ring-border"
                  />
                  <div>
                    <cite className="not-italic text-sm font-semibold text-foreground">
                      {review.name}
                    </cite>
                    <span className="block text-xs text-muted-foreground">
                      {review.role}
                    </span>
                  </div>
                </footer>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
