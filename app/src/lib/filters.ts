import type { AreaRegion, BudgetBand } from "@/lib/database.types";
import type { CityFilters } from "@/lib/queries";

export const BUDGETS: BudgetBand[] = [
  "100만원 이하",
  "100~200만원",
  "200만원 이상",
];

export const AREAS: AreaRegion[] = [
  "수도권",
  "경상도",
  "전라도",
  "강원도",
  "제주도",
  "충청도",
];

export interface HomeSearchParams {
  budget?: string;
  region?: string;
  environment?: string;
  bestSeason?: string;
}

export function parseFilters(params: HomeSearchParams): CityFilters {
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
