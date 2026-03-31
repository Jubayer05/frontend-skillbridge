import { AuthSidePanel } from "@/components/modules/Auth/auth-side-panel";
import { VerifyEmailNotice } from "@/components/modules/Auth/verify-email-notice";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <div className="grid min-h-[calc(100svh-8rem)] lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense>
              <VerifyEmailNotice />
            </Suspense>
          </div>
        </div>
      </div>

      <AuthSidePanel
        title="One step away from learning."
        description="Verify your email to unlock your SkillBridge account and start exploring courses."
      />
    </div>
  );
}
