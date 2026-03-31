import { AuthSidePanel } from "@/components/modules/Auth/auth-side-panel";
import { SignupForm } from "@/components/modules/Auth/signup-form";

export default function RegisterPage() {
  return (
    <div className="grid min-h-[calc(100svh-8rem)] lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>

      <AuthSidePanel
        title="Start building your learning path."
        description="Create your account to join courses, connect with tutors, and grow your skills with SkillBridge."
      />
    </div>
  );
}
