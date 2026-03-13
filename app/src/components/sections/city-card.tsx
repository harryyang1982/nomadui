"use client";

import { useState } from "react";
import type { City } from "@/lib/mock-data";

export function CityCard({ city }: { city: City }) {
  const costFormatted = `₩${city.monthly_cost.toLocaleString()}`;
  const [vote, setVote] = useState<"none" | "like" | "dislike">("none");
  const [likeCount, setLikeCount] = useState(city.like_count);
  const [dislikeCount, setDislikeCount] = useState(city.dislike_count);

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (vote === "none") {
      setLikeCount((c) => c + 1);
      setVote("like");
    } else if (vote === "like") {
      setLikeCount((c) => c - 1);
      setVote("none");
    } else {
      setDislikeCount((c) => c - 1);
      setLikeCount((c) => c + 1);
      setVote("like");
    }
  }

  function handleDislike(e: React.MouseEvent) {
    e.stopPropagation();
    if (vote === "none") {
      setDislikeCount((c) => c + 1);
      setVote("dislike");
    } else if (vote === "dislike") {
      setDislikeCount((c) => c - 1);
      setVote("none");
    } else {
      setLikeCount((c) => c - 1);
      setDislikeCount((c) => c + 1);
      setVote("dislike");
    }
  }

  return (
    <div
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
      <div className="px-4 py-3 space-y-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div><span className="text-muted-foreground">예산</span> <span>{city.budget}</span></div>
          <div><span className="text-muted-foreground">지역</span> <span>{city.area}</span></div>
          <div><span className="text-muted-foreground">환경</span> <span>{city.environment.join(", ")}</span></div>
          <div><span className="text-muted-foreground">계절</span> <span>{city.best_season.join(", ")}</span></div>
        </div>
        <div className="flex items-center justify-end gap-2 text-sm">
          <button
            onClick={handleLike}
            className={`cursor-pointer rounded px-1.5 py-0.5 transition-colors ${
              vote === "like"
                ? "bg-blue-100 text-blue-600"
                : "text-muted-foreground hover:text-blue-500"
            }`}
          >
            👍 {likeCount}
          </button>
          <button
            onClick={handleDislike}
            className={`cursor-pointer rounded px-1.5 py-0.5 transition-colors ${
              vote === "dislike"
                ? "bg-red-100 text-red-600"
                : "text-muted-foreground hover:text-red-500"
            }`}
          >
            👎 {dislikeCount}
          </button>
        </div>
      </div>
    </div>
  );
}
