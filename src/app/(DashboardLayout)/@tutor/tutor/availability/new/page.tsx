import Link from "next/link";

import { TutorAvailabilitySlotForm } from "@/components/modules/availability/tutor-availability-slot-form";
import {
  DashboardHero,
  DashboardPageShell,
} from "@/components/modules/profile/dashboard-page-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TutorAvailabilityNewPage() {
  return (
    <DashboardPageShell maxWidth="narrow">
      <div className="space-y-8">
        <div className="space-y-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 h-auto px-2 text-[#5c5a54] hover:text-[#0f1f3d]"
          >
            <Link href="/tutor/availability">← Availability</Link>
          </Button>
          <DashboardHero
            eyebrow="Create"
            title="New availability slot"
            description="Name the session, tie it to a subject, and set the window and price. Times use 24-hour format (HH:mm)."
          />
        </div>

        <Card className="border border-[#e4e1d8] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-[#0f1f3d]">
              Slot details
            </CardTitle>
            <CardDescription>
              Students see the name together with date and time in the catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 rounded-b-xl bg-[#faf9f6]/40 pt-2">
            <p className="text-sm leading-relaxed text-[#5c5a54]">
              Need a new category or subject first?{" "}
              <Link
                href="/dashboard/categories/new"
                className="font-medium text-[#0f1f3d] underline underline-offset-4 hover:text-amber-800"
              >
                New category
              </Link>
              {" · "}
              <Link
                href="/dashboard/subjects/new"
                className="font-medium text-[#0f1f3d] underline underline-offset-4 hover:text-amber-800"
              >
                New subject
              </Link>
              .
            </p>
            <TutorAvailabilitySlotForm mode="create" />
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
