import { cities } from "@/lib/mock-data";
import { CityCard } from "./city-card";
import { Button } from "@/components/ui/button";

export function CityGrid() {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
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
