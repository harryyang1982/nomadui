import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { FilterBar } from "@/components/sections/filter-bar";
import { CityGrid } from "@/components/sections/city-grid";
import { Footer } from "@/components/sections/footer";
import { getCities, type CityFilters } from "@/lib/queries";
import { createClient } from "@/utils/supabase/server";
import type { AreaRegion, BudgetBand } from "@/lib/database.types";

const BUDGETS: BudgetBand[] = ["100만원 이하", "100~200만원", "200만원 이상"];
const AREAS: AreaRegion[] = [
  "수도권",
  "경상도",
  "전라도",
  "강원도",
  "제주도",
  "충청도",
];

type HomeSearchParams = Promise<{
  budget?: string;
  region?: string;
  environment?: string;
  bestSeason?: string;
}>;

function parseFilters(params: Awaited<HomeSearchParams>): CityFilters {
  const filters: CityFilters = {};
  if (params.budget && BUDGETS.includes(params.budget as BudgetBand)) {
    filters.budget = params.budget as BudgetBand;
  }
  if (params.region && AREAS.includes(params.region as AreaRegion)) {
    filters.area = params.region as AreaRegion;
  }
  if (params.environment && params.environment !== "all") {
    filters.environment = params.environment;
  }
  if (params.bestSeason && params.bestSeason !== "all") {
    filters.bestSeason = params.bestSeason;
  }
  return filters;
}

export default async function Home({
  searchParams,
}: {
  searchParams: HomeSearchParams;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cities = await getCities(filters);

  const userVotes: Record<string, "like" | "dislike"> = {};
  if (user) {
    const { data: votes } = await supabase
      .from("city_votes")
      .select("city_id, vote")
      .eq("user_id", user.id);
    for (const row of votes ?? []) {
      userVotes[row.city_id] = row.vote === 1 ? "like" : "dislike";
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FilterBar />
      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <CityGrid cities={cities} userVotes={userVotes} />
        </div>
      </section>
      <Footer />
    </div>
  );
}
