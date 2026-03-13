import { City } from "@/lib/mock-data";
import { CityCard } from "./city-card";
import { Button } from "@/components/ui/button";

interface CityGridProps {
  cities: City[];
}

export function CityGrid({ cities }: CityGridProps) {
  const sorted = [...cities].sort((a, b) => b.like_count - a.like_count);

  return (
    <div className="flex-1">
      <h2 className="mb-4 text-2xl font-bold">도시 리스트</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button variant="outline" className="px-8">
          더 많은 도시 보기 ↓
        </Button>
      </div>
    </div>
  );
}
