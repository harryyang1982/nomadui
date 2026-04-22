import { getReviewsByCity } from "@/lib/queries";
import { formatRelative } from "@/lib/format";

interface CityDetailReviewsProps {
  cityId: string;
}

export async function CityDetailReviews({ cityId }: CityDetailReviewsProps) {
  const reviews = await getReviewsByCity(cityId);

  if (reviews.length === 0) {
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
      {reviews.map((review) => {
        const username = review.profiles?.username ?? "익명";
        const initial = username.charAt(0).toUpperCase();
        return (
          <div
            key={review.id}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600">
                {initial}
              </div>
              <div>
                <p className="text-sm font-medium">{username}</p>
                <p className="text-xs text-muted-foreground">
                  {"⭐".repeat(review.rating)} · {review.stay_duration} ·{" "}
                  {formatRelative(review.created_at)}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed">{review.content}</p>

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

            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span>👍 {review.like_count}</span>
              <span>💬 {review.comment_count}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
