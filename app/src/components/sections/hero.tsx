import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Hero() {
  const avatars = ["S", "K", "L", "M", "A", "J", "Y"];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-20 text-white md:py-28">
      {/* Background overlay pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23fff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
          <span className="text-yellow-400">★★★★★</span>
          <span>#1 한국 디지털 노마드 커뮤니티 Since 2026</span>
        </div>

        {/* Main Copy */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          <span className="mr-2">🇰🇷</span> 대한민국에서
          <br />
          노마드하기
        </h1>

        {/* Sub Copy */}
        <p className="mb-8 text-lg text-gray-300 md:text-xl">
          디지털 노마드를 위한 한국 도시 가이드 & 리뷰 커뮤니티
        </p>

        {/* Member Avatars */}
        <div className="mb-8 flex justify-center -space-x-2">
          {avatars.map((a, i) => (
            <Avatar key={i} className="h-9 w-9 border-2 border-gray-800">
              <AvatarFallback className="bg-coral/80 text-xs text-white">
                {a}
              </AvatarFallback>
            </Avatar>
          ))}
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-800 bg-white/20 text-xs backdrop-blur">
            +2k
          </div>
        </div>

        {/* Value Props */}
        <div className="mb-10 grid grid-cols-1 gap-3 text-left text-sm sm:grid-cols-2 sm:gap-x-8 sm:gap-y-2 sm:text-center">
          <div className="flex items-center gap-2 sm:justify-center">
            <span>☕</span>
            <span>전국 120+ 코워킹 스페이스 정보</span>
          </div>
          <div className="flex items-center gap-2 sm:justify-center">
            <span>🧪</span>
            <span>50개 도시 실시간 데이터 비교</span>
          </div>
          <div className="flex items-center gap-2 sm:justify-center">
            <span>⭐</span>
            <span>노마드 리뷰 & 평점 시스템</span>
          </div>
          <div className="flex items-center gap-2 sm:justify-center">
            <span>💬</span>
            <span>노마드 커뮤니티 채팅</span>
          </div>
        </div>

        {/* Email CTA */}
        <div className="mx-auto max-w-md space-y-3">
          <Input
            type="email"
            placeholder="이메일을 입력하세요..."
            className="h-12 border-white/20 bg-white/10 text-center text-white placeholder:text-gray-400"
          />
          <Button className="h-12 w-full bg-coral text-base font-semibold text-white hover:bg-coral/90">
            무료로 시작하기 →
          </Button>
          <p className="text-xs text-gray-400">
            이미 계정이 있으시면 로그인됩니다
          </p>
        </div>
      </div>
    </section>
  );
}
