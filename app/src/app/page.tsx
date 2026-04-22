import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { FilterBar } from "@/components/sections/filter-bar";
import { CityGrid } from "@/components/sections/city-grid";
import { Footer } from "@/components/sections/footer";
import { getCities } from "@/lib/queries";
import { createClient } from "@/utils/supabase/server";
import { getNavbarUser } from "@/lib/current-user";
import { parseFilters, type HomeSearchParams } from "@/lib/filters";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [cities, navbarUser] = await Promise.all([
    getCities(filters),
    getNavbarUser(),
  ]);

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
      <Navbar user={navbarUser} />
      <Hero isAuthenticated={!!navbarUser} />
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
