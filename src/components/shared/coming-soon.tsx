import { Construction } from "lucide-react";

import {
  DashboardHero,
  DashboardPageShell,
} from "@/components/modules/profile/dashboard-page-shell";
import { Card, CardContent } from "@/components/ui/card";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({
  title,
  description = "This page is under construction and will be available soon.",
}: ComingSoonProps) {
  return (
    <DashboardPageShell maxWidth="narrow">
      <div className="space-y-8">
        <DashboardHero
          eyebrow="Coming soon"
          title={title}
          description={description}
        />

        <Card className="border border-[#e4e1d8] bg-white shadow-sm">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#0f1f3d]/6">
              <Construction className="size-5 text-[#0f1f3d]" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-base font-medium text-[#0f1f3d]">
                We’re building this section
              </p>
              <p className="text-sm leading-relaxed text-[#5c5a54]">
                It will appear here once the learning features are ready. In the
                meantime, you can keep booking sessions from the catalog.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
