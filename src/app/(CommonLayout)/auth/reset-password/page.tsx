import { AuthSidePanel } from "@/components/modules/Auth/auth-side-panel";
import { ResetPasswordForm } from "@/components/modules/Auth/reset-password-form";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-[calc(100svh-8rem)] lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>

      <AuthSidePanel
        title="Create a new password."
        description="Choose a strong password to keep your SkillBridge account secure."
      />
    </div>
  );
}
