import { Badge } from "@/components/ui/badge";

const popularTags = [
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

export function PopularTags() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-xl font-bold">🔥 인기 태그로 찾기</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-coral hover:text-white"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
