"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const slides = [
  {
    tag: "Now in open beta",
    headline: "The learning platform\nbuilt around real expertise.",
    sub: "Connect with practitioners who teach from experience — not just theory. Skills that actually transfer.",
    primaryCta: { label: "Start learning free", href: "/signup" },
    secondaryCta: { label: "Browse courses", href: "/courses" },
    trust: ["No credit card required", "Free forever tier", "Cancel anytime"],
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80",
    bar: "linear-gradient(90deg,#534AB7,#7F77DD,#AFA9EC)",
    accent: "#7F77DD",
    dot: "#7F77DD",
  },
  {
    tag: "12,400+ active learners",
    headline: "Grow your skills.\nAdvance your career.",
    sub: "Structured learning paths built by industry veterans. Go from beginner to job-ready in weeks, not years.",
    primaryCta: { label: "Explore paths", href: "/courses" },
    secondaryCta: { label: "See success stories", href: "/stories" },
    trust: ["Verified instructors", "Hands-on projects", "Lifetime access"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80",
    bar: "linear-gradient(90deg,#0F6E56,#1D9E75,#5DCAA5)",
    accent: "#1D9E75",
    dot: "#1D9E75",
  },
  {
    tag: "840 expert instructors",
    headline: "Share what you know.\nBuild a real income.",
    sub: "Turn your expertise into a course in minutes. Reach thousands of learners ready to pay for your knowledge.",
    primaryCta: { label: "Become an instructor", href: "/teach" },
    secondaryCta: { label: "See how it works", href: "/how-it-works" },
    trust: ["Keep 80% revenue", "No upfront cost", "Full analytics"],
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&q=80",
    bar: "linear-gradient(90deg,#993C1D,#D85A30,#F0997B)",
    accent: "#D85A30",
    dot: "#D85A30",
  },
  {
    tag: "Teams & enterprise",
    headline: "Upskill your entire team.\nTogether.",
    sub: "Custom learning plans, admin dashboards, and team analytics — everything your org needs to grow as one.",
    primaryCta: { label: "Book a demo", href: "/demo" },
    secondaryCta: { label: "View team plans", href: "/teams" },
    trust: ["SSO & admin controls", "Progress reporting", "Dedicated support"],
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&q=80",
    bar: "linear-gradient(90deg,#185FA5,#378ADD,#85B7EB)",
    accent: "#378ADD",
    dot: "#378ADD",
  },
];

export function HomeBanner({ className }: { className?: string }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul className="flex gap-2 justify-center items-center mt-4">{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => (
      <button
        className="w-2 h-2 rounded-full transition-all duration-200"
        style={{ background: slides[i].dot, opacity: 0.4 }}
      />
    ),
  };

  return (
    <section className={cn("overflow-hidden rounded-xl", className)}>
      <Slider {...settings}>
        {slides.map((s, i) => (
          <div key={i}>
            <div
              className="relative px-8 py-20 text-center flex flex-col items-center sm:px-16 sm:py-28"
              style={{
                backgroundImage: `url(${s.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Top color bar */}
              <div
                className="absolute inset-x-0 top-0 h-[3px] z-10"
                style={{ background: s.bar }}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-0">
                {/* Badge */}
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium mb-5 backdrop-blur-sm"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "#fff",
                    border: "0.5px solid rgba(255,255,255,0.25)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: s.accent }}
                  />
                  {s.tag}
                </span>

                {/* Headline */}
                <h1 className="text-4xl font-semibold tracking-tight whitespace-pre-line mb-3 text-white sm:text-5xl">
                  {s.headline}
                </h1>

                {/* Sub */}
                <p className="text-base max-w-md mx-auto mb-7 leading-relaxed text-white/75">
                  {s.sub}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                  <Link
                    href={s.primaryCta.href}
                    className="rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: s.accent }}
                  >
                    {s.primaryCta.label}
                  </Link>
                  <Link
                    href={s.secondaryCta.href}
                    className="rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "0.5px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    {s.secondaryCta.label}
                  </Link>
                </div>

                {/* Trust items */}
                <div className="flex flex-wrap gap-5 justify-center">
                  {s.trust.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1.5 text-xs text-white/60"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] flex-shrink-0 text-white"
                        style={{ background: s.accent }}
                      >
                        ✓
                      </span>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
