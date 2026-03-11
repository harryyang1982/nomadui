"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🇰🇷</span>
          <span className="text-xl font-bold tracking-tight">KoNomad</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 lg:flex">
          <a href="#" className="text-sm font-medium text-foreground hover:text-coral">
            홈
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-coral">
            도시목록
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-coral">
            지도
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-coral">
            밋업
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-coral">
            채팅
          </a>
        </div>

        {/* Search + Auth */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative">
            <Input
              type="text"
              placeholder="도시 검색..."
              className="h-9 w-48 pl-8 text-sm"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              🔍
            </span>
          </div>
          <Button variant="ghost" size="sm">
            로그인
          </Button>
          <Button size="sm" className="bg-coral text-white hover:bg-coral/90">
            회원가입 →
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="메뉴 열기"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-3 pt-3">
            <a href="#" className="text-sm font-medium">홈</a>
            <a href="#" className="text-sm text-muted-foreground">도시목록</a>
            <a href="#" className="text-sm text-muted-foreground">지도</a>
            <a href="#" className="text-sm text-muted-foreground">밋업</a>
            <a href="#" className="text-sm text-muted-foreground">채팅</a>
            <Input type="text" placeholder="도시 검색..." className="mt-2" />
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1">로그인</Button>
              <Button size="sm" className="flex-1 bg-coral text-white hover:bg-coral/90">회원가입</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
