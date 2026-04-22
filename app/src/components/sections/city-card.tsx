"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import type { CityWithWeather } from "@/lib/database.types";
import { voteCity, type VoteDirection } from "@/app/actions/city-vote";
import { voteReducer, type VoteState } from "@/lib/vote-reducer";

export function CityCard({
  city,
  initialVote,
}: {
  city: CityWithWeather;
  initialVote?: "like" | "dislike" | "none";
}) {
  const costFormatted = `₩${city.monthly_cost.toLocaleString()}`;
  const weather = city.city_weather;
  const [isPending, startTransition] = useTransition();

  const [state, mutate] = useOptimistic<VoteState, VoteDirection>(
    {
      vote: initialVote ?? "none",
      likeCount: city.like_count,
      dislikeCount: city.dislike_count,
    },
    voteReducer
  );

  function send(direction: VoteDirection, serverDirection: VoteDirection) {
    startTransition(() => {
      mutate(direction);
      voteCity(city.id, serverDirection);
    });
  }

  function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (state.vote === "like") send("like", "clear");
    else send("like", "like");
  }

  function handleDislike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (state.vote === "dislike") send("dislike", "clear");
    else send("dislike", "dislike");
  }

  return (
    <Link
      href={`/city/${city.id}`}
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
            {city.rank != null && (
              <span className="rounded-md bg-black/40 px-2 py-0.5 text-sm font-bold backdrop-blur-sm">
                #{city.rank}
              </span>
            )}
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
              {weather?.current_temp != null && (
                <span>
                  {weather.weather_emoji ?? "🌤"} {weather.current_temp}°C
                </span>
              )}
              {weather?.aqi != null && (
                <span>
                  {weather.aqi > 50 ? "😷" : "😊"} AQI {weather.aqi}
                </span>
              )}
            </div>

            <p className="mt-1 text-lg font-bold">{costFormatted}/월</p>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="px-4 py-3 space-y-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div>
            <span className="text-muted-foreground">예산</span>{" "}
            <span>{city.budget}</span>
          </div>
          <div>
            <span className="text-muted-foreground">지역</span>{" "}
            <span>{city.area}</span>
          </div>
          <div>
            <span className="text-muted-foreground">환경</span>{" "}
            <span>{city.environment.join(", ")}</span>
          </div>
          <div>
            <span className="text-muted-foreground">계절</span>{" "}
            <span>{city.best_season.join(", ")}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 text-sm">
          <button
            onClick={handleLike}
            disabled={isPending}
            className={`cursor-pointer rounded px-1.5 py-0.5 transition-colors disabled:opacity-60 ${
              state.vote === "like"
                ? "bg-blue-100 text-blue-600"
                : "text-muted-foreground hover:text-blue-500"
            }`}
          >
            👍
          </button>
          <span
            className={
              state.vote === "like"
                ? "text-blue-600 font-medium"
                : "text-muted-foreground"
            }
          >
            {state.likeCount}
          </span>
          <span
            className={
              state.vote === "dislike"
                ? "text-red-600 font-medium"
                : "text-muted-foreground"
            }
          >
            {state.dislikeCount}
          </span>
          <button
            onClick={handleDislike}
            disabled={isPending}
            className={`cursor-pointer rounded px-1.5 py-0.5 transition-colors disabled:opacity-60 ${
              state.vote === "dislike"
                ? "bg-red-100 text-red-600"
                : "text-muted-foreground hover:text-red-500"
            }`}
          >
            👎
          </button>
        </div>
      </div>
    </Link>
  );
}
