export type ReviewStudent = {
  id: string;
  name: string;
  image: string | null;
};

export type Review = {
  id: string;
  bookingId: string;
  studentId: string;
  tutorProfileId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  student: ReviewStudent;
};

export type PaginatedReviews = {
  data: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateReviewPayload = {
  bookingId: string;
  rating: number;
  comment?: string;
};

/** Tutor dashboard table row (from GET /tutor/reviews). */
export type TutorDashboardReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  booking: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    slotName: string;
  };
};

export type PaginatedTutorDashboardReviews = {
  data: TutorDashboardReviewRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
