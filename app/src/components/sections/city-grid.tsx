import type { CityWithWeather } from "@/lib/database.types";
import { CityCard } from "./city-card";
import { Button } from "@/components/ui/button";

interface CityGridProps {
  cities: CityWithWeather[];
  userVotes?: Record<string, "like" | "dislike">;
}

export function CityGrid({ cities, userVotes }: CityGridProps) {
  return (
    <div className="flex-1">
      <h2 className="mb-4 text-2xl font-bold">도시 리스트</h2>
      {cities.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center text-sm text-muted-foreground">
          조건에 맞는 도시가 없어요. 필터를 조정해 주세요.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <CityCard
                key={city.id}
                city={city}
                initialVote={userVotes?.[city.id] ?? "none"}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" className="px-8">
              더 많은 도시 보기 ↓
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
