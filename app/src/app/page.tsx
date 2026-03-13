"use client";

import { useState } from "react";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { FilterBar, FilterState } from "@/components/sections/filter-bar";
import { CityGrid } from "@/components/sections/city-grid";
import { Footer } from "@/components/sections/footer";
import { cities, City } from "@/lib/mock-data";

const DEFAULT_FILTERS: FilterState = {
  budget: "all",
  region: "all",
  environment: "all",
  bestSeason: "all",
};

function filterCities(allCities: City[], filters: FilterState): City[] {
  return allCities.filter((city) => {
    if (filters.budget !== "all" && city.budget !== filters.budget) return false;
    if (filters.region !== "all" && city.area !== filters.region) return false;
    if (filters.environment !== "all" && !city.environment.includes(filters.environment)) return false;
    if (filters.bestSeason !== "all" && !city.best_season.includes(filters.bestSeason)) return false;
    return true;
  });
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const filteredCities = filterCities(cities, filters);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FilterBar filters={filters} onFilterChange={setFilters} />
      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <CityGrid cities={filteredCities} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
