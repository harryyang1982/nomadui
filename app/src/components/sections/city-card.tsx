import type { City } from "@/lib/mock-data";

export function CityCard({ city }: { city: City }) {
  const costFormatted = `₩${city.monthly_cost.toLocaleString()}`;

  return (
    <a
      href="#"
      className="group block overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image Area */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={city.image_url}
          alt={city.name_ko}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
          {/* Top Row */}
          <div className="flex items-start justify-between">
            <span className="rounded-md bg-black/40 px-2 py-0.5 text-sm font-bold backdrop-blur-sm">
              #{city.rank}
            </span>
            <span className="rounded-md bg-black/40 px-2 py-0.5 text-xs backdrop-blur-sm">
              📶 {city.internet_speed}Mbps
            </span>
          </div>

          {/* Bottom Content */}
          <div>
            <h3 className="text-xl font-bold">
              {city.name_ko}{" "}
              <span className="text-sm font-normal text-gray-300">
                ({city.name_en})
              </span>
            </h3>
            <p className="text-xs text-gray-300">대한민국 · {city.region}</p>

            <div className="mt-2 flex items-center gap-3 text-sm">
              <span>
                {city.weather_emoji} {city.current_temp}°C
              </span>
              {city.aqi > 50 && <span>😷 AQI {city.aqi}</span>}
              {city.aqi <= 50 && <span>😊 AQI {city.aqi}</span>}
            </div>

            <p className="mt-1 text-lg font-bold">{costFormatted}/월</p>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span>
            ⭐ {city.nomad_score.toFixed(1)}{" "}
            <span className="text-muted-foreground">
              리뷰 {city.review_count}개
            </span>
          </span>
          <span className="text-muted-foreground">
            👍 {city.like_count} 👎 {city.dislike_count}
          </span>
        </div>
      </div>
    </a>
  );
}
