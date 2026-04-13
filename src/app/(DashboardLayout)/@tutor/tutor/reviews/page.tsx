import { ProtectedRoute } from "@/components/auth/protected-route";
import { TutorReviewsDashboardPage } from "@/components/modules/tutor/tutor-reviews-dashboard";

export default function TutorReviewsPage() {
  return (
    <ProtectedRoute roles={["TUTOR"]}>
      <TutorReviewsDashboardPage />
    </ProtectedRoute>
  );
}
