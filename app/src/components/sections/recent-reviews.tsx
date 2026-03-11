import { reviews } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-500">
      {"⭐".repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? "⭐" : ""}
    </span>
  );
}

export function RecentReviews() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 text-xl font-bold">✍️ 최근 리뷰</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-5">
                {/* Header */}
                <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-coral/20 text-xs">
                      {review.user_avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{review.user_name}</span>
                  <span className="text-muted-foreground">·</span>
                  <span>{review.city_name}</span>
                  <span className="text-muted-foreground">·</span>
                  <StarRating rating={review.overall_rating} />
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {review.stay_duration}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {review.created_at}
                  </span>
                </div>

                {/* Content */}
                <p className="mb-3 text-sm leading-relaxed">
                  &ldquo;{review.content}&rdquo;
                </p>

                {/* Tags + Engagement */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {review.pros.map((pro) => (
                      <Badge
                        key={pro}
                        variant="secondary"
                        className="bg-green-50 text-xs text-green-700"
                      >
                        ✅ {pro}
                      </Badge>
                    ))}
                    {review.cons.map((con) => (
                      <Badge
                        key={con}
                        variant="secondary"
                        className="bg-red-50 text-xs text-red-700"
                      >
                        ❌ {con}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>👍 {review.like_count}</span>
                    <span>💬 {review.comment_count}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-center">
          <a
            href="#"
            className="text-sm font-medium text-coral hover:underline"
          >
            → 리뷰 더보기
          </a>
        </div>
      </div>
    </section>
  );
}
