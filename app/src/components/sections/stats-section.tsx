export function StatsSection() {
  const stats = [
    { value: "50+", label: "등록 도시", emoji: "🏙" },
    { value: "2,400+", label: "활성 멤버", emoji: "👥" },
    { value: "8,300+", label: "리뷰", emoji: "✍️" },
    { value: "120+", label: "코워킹 스페이스", emoji: "☕" },
  ];

  return (
    <section className="bg-gray-900 px-4 py-16 text-white">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="mb-1 text-3xl">{stat.emoji}</p>
            <p className="text-3xl font-bold md:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
