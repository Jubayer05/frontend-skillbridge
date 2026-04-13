import Link from "next/link";

import {
  DashboardHero,
  DashboardPageShell,
} from "@/components/modules/profile/dashboard-page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentDefaultPage() {
  return (
    <DashboardPageShell>
      <div className="space-y-8">
        <DashboardHero
          eyebrow="Student workspace"
          title="Welcome to your dashboard"
          description="View upcoming sessions, keep your profile updated, and continue learning from one place."
          action={
            <Button
              asChild
              className="border-0 bg-amber-500 text-[#0f1f3d] shadow-sm hover:bg-amber-400"
            >
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border border-[#e4e1d8] bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="font-serif text-base text-[#0f1f3d]">
                Profile
              </CardTitle>
              <CardDescription>
                Keep your contact and bio updated for tutors.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border border-[#e4e1d8] bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="font-serif text-base text-[#0f1f3d]">
                Bookings
              </CardTitle>
              <CardDescription>
                Manage upcoming sessions and leave feedback after completion.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardPageShell>
  );
}
