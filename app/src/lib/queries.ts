import "server-only";
import { createClient } from "@/utils/supabase/server";
import type {
  AreaRegion,
  BudgetBand,
  CityWithWeather,
  PressQuoteRow,
  ReviewRow,
} from "@/lib/database.types";

export interface CityFilters {
  budget?: BudgetBand;
  area?: AreaRegion;
  environment?: string;
  bestSeason?: string;
}

export async function getCities(
  filters: CityFilters = {},
  limit = 48
): Promise<CityWithWeather[]> {
  const supabase = await createClient();
  let query = supabase
    .from("cities")
    .select("*, city_weather(*)")
    .order("rank", { ascending: true, nullsFirst: false })
    .limit(limit);

  if (filters.budget) query = query.eq("budget", filters.budget);
  if (filters.area) query = query.eq("area", filters.area);
  if (filters.environment) query = query.contains("environment", [filters.environment]);
  if (filters.bestSeason) query = query.contains("best_season", [filters.bestSeason]);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as CityWithWeather[];
}

export async function getCityById(id: string): Promise<CityWithWeather | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cities")
    .select("*, city_weather(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as CityWithWeather | null) ?? null;
}

export type ReviewWithAuthor = ReviewRow & {
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
};

export async function getReviewsByCity(
  cityId: string,
  limit = 20
): Promise<ReviewWithAuthor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(username, avatar_url)")
    .eq("city_id", cityId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ReviewWithAuthor[];
}

export async function getRecentReviews(limit = 6): Promise<
  (ReviewWithAuthor & { city: { name_ko: string } | null })[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(username, avatar_url), city:cities(name_ko)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as (ReviewWithAuthor & {
    city: { name_ko: string } | null;
  })[];
}

export async function getPressQuotes(): Promise<PressQuoteRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("press_quotes")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
