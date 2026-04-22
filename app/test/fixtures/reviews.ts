import type { ReviewRow } from "@/lib/database.types";

const ISO = "2026-04-20T09:00:00.000Z";

export interface ReviewWithAuthorFixture extends ReviewRow {
  profiles: { username: string | null; avatar_url: string | null } | null;
}

export const seoulReview: ReviewWithAuthorFixture = {
  id: "aaaaaaaa-0000-0000-0000-000000000001",
  user_id: "user-1",
  city_id: "11111111-1111-1111-1111-000000000001",
  rating: 5,
  stay_duration: "3개월 체류",
  content: "강남역 근처 코워킹 스페이스가 정말 많고 인터넷도 빨라서 일하기 좋았습니다.",
  pros: ["빠른인터넷", "카페많음"],
  cons: ["비싼월세"],
  like_count: 24,
  comment_count: 3,
  created_at: ISO,
  updated_at: ISO,
  profiles: { username: "alex_nomad", avatar_url: null },
};

export const jejuReview: ReviewWithAuthorFixture = {
  id: "aaaaaaaa-0000-0000-0000-000000000002",
  user_id: "user-2",
  city_id: "11111111-1111-1111-1111-000000000003",
  rating: 4,
  stay_duration: "1~4주 체류",
  content: "자연환경 좋고 카페 예쁨. 렌터카 없이는 이동이 좀 불편해요.",
  pros: ["자연환경", "카페많음"],
  cons: ["대중교통불편"],
  like_count: 18,
  comment_count: 5,
  created_at: "2026-04-15T09:00:00.000Z",
  updated_at: "2026-04-15T09:00:00.000Z",
  profiles: { username: "mina_travels", avatar_url: null },
};

export const reviews: ReviewWithAuthorFixture[] = [seoulReview, jejuReview];
