import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BottomCta() {
  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="mb-2 text-2xl font-bold">
          🇰🇷 대한민국 노마드 커뮤니티에 참여하세요
        </h2>
        <p className="mb-8 text-muted-foreground">
          2,400명의 디지털 노마드가 함께하고 있습니다
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Input
            type="email"
            placeholder="이메일 입력..."
            className="h-11 sm:w-72"
          />
          <Button className="h-11 bg-coral px-6 text-white hover:bg-coral/90">
            무료로 시작하기 →
          </Button>
        </div>
      </div>
    </section>
  );
}
