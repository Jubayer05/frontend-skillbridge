import { AuthSidePanel } from "@/components/modules/Auth/auth-side-panel";
import { LoginForm } from "@/components/modules/Auth/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100svh-8rem)] lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      <AuthSidePanel
        title="Welcome back to smarter learning."
        description="Access your courses, continue your progress, and manage your learning journey from one place."
      />
    </div>
  );
}
