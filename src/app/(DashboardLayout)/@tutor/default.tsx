import Link from "next/link";

import {
  DashboardHero,
  DashboardPageShell,
} from "@/components/modules/profile/dashboard-page-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TutorDefaultPage() {
  return (
    <DashboardPageShell>
      <div className="space-y-8">
        <DashboardHero
          eyebrow="Tutor workspace"
          title="Welcome to your dashboard"
          description="Use the sidebar to manage availability, read student reviews, and keep your public tutor profile polished."
          action={
            <Button
              asChild
              className="border-0 bg-amber-500 text-[#0f1f3d] shadow-sm hover:bg-amber-400"
            >
              <Link href="/tutor/availability">Open availability</Link>
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border border-[#e4e1d8] bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="font-serif text-base text-[#0f1f3d]">
                Slots &amp; schedule
              </CardTitle>
              <CardDescription>
                Create tutoring windows and copy links when you need them on
                another device.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border border-[#e4e1d8] bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="font-serif text-base text-[#0f1f3d]">
                Reviews
              </CardTitle>
              <CardDescription>
                See ratings and comments from students after completed sessions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardPageShell>
  );
}
