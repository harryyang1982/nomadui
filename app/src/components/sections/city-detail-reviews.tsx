import { reviews } from "@/lib/mock-data";

interface CityDetailReviewsProps {
  cityName: string;
}

export function CityDetailReviews({ cityName }: CityDetailReviewsProps) {
  const cityReviews = reviews.filter((r) => r.city_name === cityName);

  if (cityReviews.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
        <p className="text-lg">📝</p>
        <p className="mt-2 text-sm text-muted-foreground">
          아직 리뷰가 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cityReviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600">
              {review.user_avatar}
            </div>
            <div>
              <p className="text-sm font-medium">{review.user_name}</p>
              <p className="text-xs text-muted-foreground">
                {"⭐".repeat(review.overall_rating)} · {review.stay_duration} ·{" "}
                {review.created_at}
              </p>
            </div>
          </div>

          {/* Content */}
          <p className="mt-3 text-sm leading-relaxed">{review.content}</p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {review.pros.map((pro) => (
              <span
                key={pro}
                className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs text-green-700"
              >
                +{pro}
              </span>
            ))}
            {review.cons.map((con) => (
              <span
                key={con}
                className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs text-red-700"
              >
                -{con}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span>👍 {review.like_count}</span>
            <span>💬 {review.comment_count}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
