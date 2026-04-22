import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRecentReviews } from "@/lib/queries";
import { formatRelative } from "@/lib/format";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-500">
      {"⭐".repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? "⭐" : ""}
    </span>
  );
}

export async function RecentReviews() {
  const reviews = await getRecentReviews();
  if (reviews.length === 0) return null;

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 text-xl font-bold">✍️ 최근 리뷰</h2>
        <div className="space-y-4">
          {reviews.map((review) => {
            const username = review.profiles?.username ?? "익명";
            const cityName = review.city?.name_ko ?? "";
            return (
              <Card key={review.id}>
                <CardContent className="p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-coral/20 text-xs">
                        {username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{username}</span>
                    <span className="text-muted-foreground">·</span>
                    <span>{cityName}</span>
                    <span className="text-muted-foreground">·</span>
                    <StarRating rating={review.rating} />
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {review.stay_duration}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {formatRelative(review.created_at)}
                    </span>
                  </div>

                  <p className="mb-3 text-sm leading-relaxed">
                    &ldquo;{review.content}&rdquo;
                  </p>

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
            );
          })}
        </div>
      </div>
    </section>
  );
}
