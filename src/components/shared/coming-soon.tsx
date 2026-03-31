import { Construction } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({
  title,
  description = "This page is under construction and will be available soon.",
}: ComingSoonProps) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Construction className="size-6" />
          <span className="text-sm font-medium uppercase tracking-wide">
            Coming Soon
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
