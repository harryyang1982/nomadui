import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { CityDetailReviews } from "@/components/sections/city-detail-reviews";
import { getCityById } from "@/lib/queries";

interface CityDetailProps {
  params: Promise<{ id: string }>;
}

export default async function CityDetailPage({ params }: CityDetailProps) {
  const { id } = await params;
  const city = await getCityById(id);

  if (!city) {
    notFound();
  }

  const weather = city.city_weather;
  const costFormatted = `₩${city.monthly_cost.toLocaleString()}`;

  const metrics: { label: string; value: string; icon: string }[] = [
    { label: "월 생활비", value: costFormatted, icon: "💰" },
    { label: "인터넷", value: `${city.internet_speed}Mbps`, icon: "📶" },
    { label: "안전 점수", value: `${city.safety_score}/5`, icon: "🛡️" },
  ];

  if (weather?.current_temp != null) {
    metrics.push({
      label: "현재 날씨",
      value: `${weather.weather_emoji ?? "🌤"} ${weather.current_temp}°C`,
      icon: "🌡️",
    });
  }

  if (weather?.aqi != null) {
    metrics.push({
      label: "공기질(AQI)",
      value: `${weather.aqi}`,
      icon: weather.aqi <= 50 ? "😊" : "😷",
    });
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 sm:h-80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={city.image_url}
          alt={city.name_ko}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {city.rank != null && (
              <span className="mb-2 inline-block rounded-md bg-black/40 px-2 py-0.5 text-sm font-bold backdrop-blur-sm">
                #{city.rank}
              </span>
            )}
            <h1 className="text-3xl font-bold sm:text-4xl">
              {city.name_ko}{" "}
              <span className="text-lg font-normal text-gray-300">
                ({city.name_en})
              </span>
            </h1>
            <p className="mt-1 text-sm text-gray-300">
              대한민국 · {city.region}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {city.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/20 px-3 py-0.5 text-xs backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            ← 홈으로 돌아가기
          </Link>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border bg-white p-4 text-center shadow-sm"
              >
                <p className="text-2xl">{m.icon}</p>
                <p className="mt-1 text-lg font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Detail Info */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">상세 정보</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">예산</span>
                <p className="font-medium">{city.budget}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">지역</span>
                <p className="font-medium">{city.area}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">환경</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {city.environment.map((env) => (
                    <span
                      key={env}
                      className="rounded-full bg-blue-50 px-3 py-0.5 text-xs text-blue-700"
                    >
                      {env}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">최고 계절</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {city.best_season.map((season) => (
                    <span
                      key={season}
                      className="rounded-full bg-green-50 px-3 py-0.5 text-xs text-green-700"
                    >
                      {season}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Like / Dislike */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>👍 {city.like_count}</span>
            <span>👎 {city.dislike_count}</span>
            <span>리뷰 {city.review_count}개</span>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="mb-4 text-lg font-bold">리뷰</h2>
            <CityDetailReviews cityId={city.id} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
