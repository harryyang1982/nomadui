import type {
  CityRow,
  CityWeatherRow,
  CityWithWeather,
} from "@/lib/database.types";

const ISO = "2026-04-22T00:00:00.000Z";

export const seoulRow: CityRow = {
  id: "11111111-1111-1111-1111-000000000001",
  name_ko: "서울",
  name_en: "Seoul",
  region: "수도권",
  image_url: "https://example.com/seoul.jpg",
  nomad_score: 4.5,
  monthly_cost: 1850000,
  internet_speed: 187,
  safety_score: 4.6,
  rank: 1,
  budget: "200만원 이상",
  area: "수도권",
  tags: ["도심", "카페많음", "빠른인터넷"],
  environment: ["도심선호", "카페작업", "코워킹 필수"],
  best_season: ["봄", "가을"],
  review_count: 0,
  like_count: 245,
  dislike_count: 18,
  created_at: ISO,
  updated_at: ISO,
};

export const busanRow: CityRow = {
  id: "11111111-1111-1111-1111-000000000002",
  name_ko: "부산",
  name_en: "Busan",
  region: "영남권",
  image_url: "https://example.com/busan.jpg",
  nomad_score: 4.3,
  monthly_cost: 1200000,
  internet_speed: 156,
  safety_score: 4.4,
  rank: 2,
  budget: "100~200만원",
  area: "경상도",
  tags: ["해변", "맛집많음"],
  environment: ["카페작업", "자연친화"],
  best_season: ["봄", "가을"],
  review_count: 0,
  like_count: 198,
  dislike_count: 12,
  created_at: ISO,
  updated_at: ISO,
};

export const gangneungRow: CityRow = {
  id: "11111111-1111-1111-1111-000000000005",
  name_ko: "강릉",
  name_en: "Gangneung",
  region: "강원권",
  image_url: "https://example.com/gangneung.jpg",
  nomad_score: 4.0,
  monthly_cost: 980000,
  internet_speed: 165,
  safety_score: 4.6,
  rank: 5,
  budget: "100만원 이하",
  area: "강원도",
  tags: ["해변", "자연"],
  environment: ["자연친화", "카페작업"],
  best_season: ["여름", "가을"],
  review_count: 0,
  like_count: 72,
  dislike_count: 9,
  created_at: ISO,
  updated_at: ISO,
};

export const seoulWeather: CityWeatherRow = {
  city_id: seoulRow.id,
  current_temp: 9,
  weather_emoji: "☀️",
  aqi: 72,
  observed_at: ISO,
};

export const seoulWithWeather: CityWithWeather = {
  ...seoulRow,
  city_weather: seoulWeather,
};

export const busanWithWeather: CityWithWeather = {
  ...busanRow,
  city_weather: {
    city_id: busanRow.id,
    current_temp: 12,
    weather_emoji: "☀️",
    aqi: 45,
    observed_at: ISO,
  },
};

export const gangneungWithWeather: CityWithWeather = {
  ...gangneungRow,
  city_weather: {
    city_id: gangneungRow.id,
    current_temp: 5,
    weather_emoji: "🌤",
    aqi: 28,
    observed_at: ISO,
  },
};

export const citiesWithWeather: CityWithWeather[] = [
  seoulWithWeather,
  busanWithWeather,
  gangneungWithWeather,
];
