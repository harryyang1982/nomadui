"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FloatingCtaBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <p className="text-sm">
          <span className="mr-1">🇰🇷</span>
          <span className="hidden sm:inline">
            디지털 노마드를 위한 한국 도시 가이드
          </span>
          <span className="sm:hidden">KoNomad 시작하기</span>
        </p>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-coral text-white hover:bg-coral/90"
          >
            KoNomad 시작하기
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-gray-100"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
