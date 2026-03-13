export interface City {
  id: string;
  name_ko: string;
  name_en: string;
  region: string;
  image_url: string;
  nomad_score: number;
  monthly_cost: number;
  internet_speed: number;
  safety_score: number;
  review_count: number;
  like_count: number;
  dislike_count: number;
  tags: string[];
  current_temp: number;
  weather_emoji: string;
  aqi: number;
  rank: number;
  budget: "100만원 이하" | "100~200만원" | "200만원 이상";
  area: "수도권" | "경상도" | "전라도" | "강원도" | "제주도" | "충청도";
  environment: string[];
  best_season: string[];
}

export interface Review {
  id: string;
  user_name: string;
  user_avatar: string;
  city_name: string;
  overall_rating: number;
  stay_duration: string;
  content: string;
  pros: string[];
  cons: string[];
  like_count: number;
  comment_count: number;
  created_at: string;
}

export interface Meetup {
  id: string;
  city: string;
  date: string;
  attendees: number;
  avatars: string[];
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  city?: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  time: string;
}

export const cities: City[] = [
  {
    id: "1",
    name_ko: "서울",
    name_en: "Seoul",
    region: "수도권",
    image_url: "https://images.unsplash.com/photo-1546874177-9e664107314e?w=400&h=300&fit=crop",
    nomad_score: 4.5,
    monthly_cost: 1850000,
    internet_speed: 187,
    safety_score: 4.6,
    review_count: 328,
    like_count: 245,
    dislike_count: 18,
    tags: ["도심", "카페많음", "빠른인터넷", "외국인친화"],
    current_temp: 9,
    weather_emoji: "☀️",
    aqi: 72,
    rank: 1,
    budget: "200만원 이상",
    area: "수도권",
    environment: ["도심선호", "카페작업", "코워킹 필수"],
    best_season: ["봄", "가을"],
  },
  {
    id: "2",
    name_ko: "부산",
    name_en: "Busan",
    region: "영남권",
    image_url: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&h=300&fit=crop",
    nomad_score: 4.3,
    monthly_cost: 1200000,
    internet_speed: 156,
    safety_score: 4.4,
    review_count: 215,
    like_count: 198,
    dislike_count: 12,
    tags: ["해변", "맛집많음", "카페많음"],
    current_temp: 12,
    weather_emoji: "☀️",
    aqi: 45,
    rank: 2,
    budget: "100~200만원",
    area: "경상도",
    environment: ["카페작업", "자연친화"],
    best_season: ["봄", "가을"],
  },
  {
    id: "3",
    name_ko: "제주",
    name_en: "Jeju",
    region: "제주권",
    image_url: "https://images.unsplash.com/photo-1597668260643-6e7b3b25b4aa?w=400&h=300&fit=crop",
    nomad_score: 4.2,
    monthly_cost: 1350000,
    internet_speed: 142,
    safety_score: 4.7,
    review_count: 189,
    like_count: 176,
    dislike_count: 21,
    tags: ["자연", "해변", "카페많음", "조용한"],
    current_temp: 10,
    weather_emoji: "🌧",
    aqi: 32,
    rank: 3,
    budget: "100~200만원",
    area: "제주도",
    environment: ["자연친화", "카페작업"],
    best_season: ["봄", "가을"],
  },
  {
    id: "4",
    name_ko: "대전",
    name_en: "Daejeon",
    region: "충청권",
    image_url: "https://images.unsplash.com/photo-1578637387939-43c525550085?w=400&h=300&fit=crop",
    nomad_score: 4.1,
    monthly_cost: 1050000,
    internet_speed: 198,
    safety_score: 4.5,
    review_count: 97,
    like_count: 89,
    dislike_count: 8,
    tags: ["조용한", "빠른인터넷", "대중교통"],
    current_temp: 7,
    weather_emoji: "☀️",
    aqi: 58,
    rank: 4,
    budget: "100~200만원",
    area: "충청도",
    environment: ["도심선호", "코워킹 필수"],
    best_season: ["봄", "가을"],
  },
  {
    id: "5",
    name_ko: "강릉",
    name_en: "Gangneung",
    region: "강원권",
    image_url: "https://images.unsplash.com/photo-1596786232650-1fb2c064d50f?w=400&h=300&fit=crop",
    nomad_score: 4.0,
    monthly_cost: 980000,
    internet_speed: 165,
    safety_score: 4.6,
    review_count: 76,
    like_count: 72,
    dislike_count: 9,
    tags: ["해변", "카페많음", "자연", "조용한"],
    current_temp: 5,
    weather_emoji: "🌤",
    aqi: 28,
    rank: 5,
    budget: "100만원 이하",
    area: "강원도",
    environment: ["자연친화", "카페작업"],
    best_season: ["여름", "가을"],
  },
  {
    id: "6",
    name_ko: "전주",
    name_en: "Jeonju",
    region: "호남권",
    image_url: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400&h=300&fit=crop",
    nomad_score: 3.9,
    monthly_cost: 850000,
    internet_speed: 130,
    safety_score: 4.5,
    review_count: 63,
    like_count: 58,
    dislike_count: 7,
    tags: ["맛집많음", "문화생활", "조용한"],
    current_temp: 8,
    weather_emoji: "☀️",
    aqi: 42,
    rank: 6,
    budget: "100만원 이하",
    area: "전라도",
    environment: ["자연친화", "카페작업"],
    best_season: ["봄", "가을"],
  },
  {
    id: "7",
    name_ko: "수원",
    name_en: "Suwon",
    region: "수도권",
    image_url: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=400&h=300&fit=crop",
    nomad_score: 3.8,
    monthly_cost: 1150000,
    internet_speed: 178,
    safety_score: 4.4,
    review_count: 54,
    like_count: 48,
    dislike_count: 6,
    tags: ["도심", "대중교통", "빠른인터넷"],
    current_temp: 8,
    weather_emoji: "☀️",
    aqi: 65,
    rank: 7,
    budget: "100~200만원",
    area: "수도권",
    environment: ["도심선호", "코워킹 필수"],
    best_season: ["봄", "가을"],
  },
  {
    id: "8",
    name_ko: "여수",
    name_en: "Yeosu",
    region: "호남권",
    image_url: "https://images.unsplash.com/photo-1623348523859-bae8e778a17c?w=400&h=300&fit=crop",
    nomad_score: 3.8,
    monthly_cost: 920000,
    internet_speed: 125,
    safety_score: 4.6,
    review_count: 48,
    like_count: 45,
    dislike_count: 5,
    tags: ["해변", "맛집많음", "자연"],
    current_temp: 11,
    weather_emoji: "🌤",
    aqi: 35,
    rank: 8,
    budget: "100만원 이하",
    area: "전라도",
    environment: ["자연친화"],
    best_season: ["봄", "여름"],
  },
  {
    id: "9",
    name_ko: "대구",
    name_en: "Daegu",
    region: "영남권",
    image_url: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=300&fit=crop",
    nomad_score: 3.7,
    monthly_cost: 1000000,
    internet_speed: 155,
    safety_score: 4.3,
    review_count: 67,
    like_count: 52,
    dislike_count: 10,
    tags: ["도심", "맛집많음", "대중교통"],
    current_temp: 10,
    weather_emoji: "☀️",
    aqi: 68,
    rank: 9,
    budget: "100만원 이하",
    area: "경상도",
    environment: ["도심선호", "카페작업"],
    best_season: ["봄", "가을"],
  },
  {
    id: "10",
    name_ko: "춘천",
    name_en: "Chuncheon",
    region: "강원권",
    image_url: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=400&h=300&fit=crop",
    nomad_score: 3.6,
    monthly_cost: 820000,
    internet_speed: 140,
    safety_score: 4.5,
    review_count: 42,
    like_count: 38,
    dislike_count: 4,
    tags: ["자연", "조용한", "산"],
    current_temp: 4,
    weather_emoji: "🌤",
    aqi: 25,
    rank: 10,
    budget: "100만원 이하",
    area: "강원도",
    environment: ["자연친화"],
    best_season: ["여름", "가을"],
  },
  {
    id: "11",
    name_ko: "경주",
    name_en: "Gyeongju",
    region: "영남권",
    image_url: "https://images.unsplash.com/photo-1596939245839-1a8cd3988e29?w=400&h=300&fit=crop",
    nomad_score: 3.6,
    monthly_cost: 780000,
    internet_speed: 120,
    safety_score: 4.7,
    review_count: 35,
    like_count: 32,
    dislike_count: 3,
    tags: ["문화생활", "조용한", "자연"],
    current_temp: 11,
    weather_emoji: "☀️",
    aqi: 38,
    rank: 11,
    budget: "100만원 이하",
    area: "경상도",
    environment: ["자연친화"],
    best_season: ["봄", "가을"],
  },
  {
    id: "12",
    name_ko: "속초",
    name_en: "Sokcho",
    region: "강원권",
    image_url: "https://images.unsplash.com/photo-1567789884554-0b844b597180?w=400&h=300&fit=crop",
    nomad_score: 3.5,
    monthly_cost: 890000,
    internet_speed: 135,
    safety_score: 4.6,
    review_count: 31,
    like_count: 28,
    dislike_count: 4,
    tags: ["해변", "산", "자연", "맛집많음"],
    current_temp: 3,
    weather_emoji: "🌤",
    aqi: 22,
    rank: 12,
    budget: "100만원 이하",
    area: "강원도",
    environment: ["자연친화"],
    best_season: ["여름"],
  },
];

export const reviews: Review[] = [
  {
    id: "1",
    user_name: "alex_nomad",
    user_avatar: "A",
    city_name: "서울",
    overall_rating: 5,
    stay_duration: "3개월 체류",
    content:
      "강남역 근처 코워킹 스페이스가 정말 많고 인터넷도 빨라서 일하기 최고였습니다. 다만 월세가 비싼 편이에요.",
    pros: ["빠른인터넷", "카페많음"],
    cons: ["비싼월세"],
    like_count: 24,
    comment_count: 3,
    created_at: "2일 전",
  },
  {
    id: "2",
    user_name: "mina_travels",
    user_avatar: "M",
    city_name: "제주",
    overall_rating: 4,
    stay_duration: "1~4주 체류",
    content:
      "자연환경 좋고 카페 예쁨. 렌터카 없이는 이동이 좀 불편해요.",
    pros: ["자연환경", "카페많음"],
    cons: ["대중교통불편"],
    like_count: 18,
    comment_count: 5,
    created_at: "5일 전",
  },
  {
    id: "3",
    user_name: "josh_dev",
    user_avatar: "J",
    city_name: "부산",
    overall_rating: 5,
    stay_duration: "1~3개월 체류",
    content:
      "해운대 바다보며 일하기 최고. 서울보다 생활비 저렴하고 맛집도 많아요.",
    pros: ["저렴한생활비", "해변", "맛집많음"],
    cons: [],
    like_count: 31,
    comment_count: 7,
    created_at: "1주 전",
  },
];

export const meetups: Meetup[] = [
  {
    id: "1",
    city: "서울",
    date: "3/15(토)",
    attendees: 12,
    avatars: ["S", "K", "L"],
  },
  {
    id: "2",
    city: "부산",
    date: "3/22(토)",
    attendees: 8,
    avatars: ["P", "Q"],
  },
];

export const travelingMembers: Member[] = [
  { id: "1", name: "alex", avatar: "A", city: "부산" },
  { id: "2", name: "mina", avatar: "M", city: "제주" },
  { id: "3", name: "josh", avatar: "J", city: "서울" },
  { id: "4", name: "sora", avatar: "S", city: "강릉" },
  { id: "5", name: "yuki", avatar: "Y", city: "전주" },
];

export const newMembers: Member[] = [
  { id: "1", name: "hana", avatar: "H" },
  { id: "2", name: "jin", avatar: "J" },
  { id: "3", name: "luke", avatar: "L" },
  { id: "4", name: "yuna", avatar: "Y" },
  { id: "5", name: "noah", avatar: "N" },
  { id: "6", name: "ari", avatar: "A" },
  { id: "7", name: "kai", avatar: "K" },
  { id: "8", name: "sumi", avatar: "S" },
];

export const chatMessages: ChatMessage[] = [
  { id: "1", user: "alex", message: "서울 강남에 새로 생긴 코워킹 괜찮...", time: "2분 전" },
  { id: "2", user: "mina", message: "제주 한달살이 추천 숙소 있나요?", time: "5분 전" },
  { id: "3", user: "josh", message: "부산 해운대 카페 리스트 공유합니...", time: "12분 전" },
  { id: "4", user: "sora", message: "강릉 날씨가 요즘 진짜 좋아요!", time: "18분 전" },
];

export const pressQuotes = [
  {
    quote: "한국은 빠른 인터넷과 안전한 환경으로 디지털 노마드에게 최적의 환경을 제공한다",
    source: "조선일보",
  },
  {
    quote: "KoNomad는 한국 디지털 노마드의 필수 플랫폼으로 자리잡고 있다",
    source: "블로터",
  },
  {
    quote: "생활비, 인터넷 속도, 안전까지 한눈에 비교할 수 있는 유일한 서비스",
    source: "매일경제",
  },
];

export const popularTags = [
  "#해변도시",
  "#카페많음",
  "#100만이하",
  "#조용한",
  "#빠른인터넷",
  "#외국인친화",
  "#맛집많음",
  "#산/자연",
  "#대중교통",
  "#문화생활",
];

export const pressLogos = ["조선일보", "한겨레", "KBS", "매일경제", "한국경제", "블로터"];
