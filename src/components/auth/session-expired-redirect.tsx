"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Dispatched from auth-context when the client-side session timer fires
 * (aligned with Better Auth session.expiresAt). No polling / API calls.
 */
export function SessionExpiredRedirect() {
  const router = useRouter();

  useEffect(() => {
    const onExpired = () => {
      toast.message("Session expired", {
        description: "Please sign in again.",
      });
      router.push("/auth/login");
      router.refresh();
    };
    window.addEventListener("skillbridge:session-expired", onExpired);
    return () =>
      window.removeEventListener("skillbridge:session-expired", onExpired);
  }, [router]);

  return null;
}
