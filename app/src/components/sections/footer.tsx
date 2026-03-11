import { Separator } from "@/components/ui/separator";

export function Footer() {
  const columns = [
    {
      title: "서비스",
      links: ["도시 목록", "지도 보기", "코워킹 찾기", "도시 비교", "리뷰 작성"],
    },
    {
      title: "커뮤니티",
      links: ["밋업", "채팅", "블로그", "뉴스레터"],
    },
    {
      title: "고객지원",
      links: ["자주 묻는 질문", "문의하기", "피드백 보내기"],
    },
    {
      title: "법적고지",
      links: ["이용약관", "개인정보처리방침", "쿠키 정책"],
    },
  ];

  return (
    <footer className="bg-gray-900 px-4 py-12 text-gray-400">
      <div className="mx-auto max-w-7xl">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-lg font-bold text-white">🇰🇷 KoNomad</span>
          <p className="mt-1 text-xs">
            대한민국 디지털 노마드 도시 가이드 & 리뷰 플랫폼
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold text-white">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs">&copy; 2026 KoNomad. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-xs hover:text-white">
              Twitter
            </a>
            <a href="#" className="text-xs hover:text-white">
              Instagram
            </a>
            <a href="#" className="text-xs hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
