import { AuthSidePanel } from "@/components/modules/Auth/auth-side-panel";
import { ForgotPasswordForm } from "@/components/modules/Auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-[calc(100svh-8rem)] lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>

      <AuthSidePanel
        title="Recover your account."
        description="Enter your email and we'll send you a secure link to reset your password."
      />
    </div>
  );
}
