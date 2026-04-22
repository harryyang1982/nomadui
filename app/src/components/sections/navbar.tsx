"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/sign-out";

export interface NavbarUser {
  email: string | null;
  username: string | null;
  avatar_url: string | null;
}

export function Navbar({ user }: { user: NavbarUser | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName =
    user?.username ?? user?.email?.split("@")[0] ?? "";
  const initial = (displayName || "?").charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🇰🇷</span>
          <span className="text-xl font-bold tracking-tight">KoNomad</span>
        </Link>

        {/* Auth (desktop) */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar_url}
                    alt={displayName}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral/20 text-xs font-bold text-coral">
                    {initial}
                  </span>
                )}
                <span className="text-sm font-medium">{displayName}</span>
              </div>
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm">
                  로그아웃
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-coral text-white hover:bg-coral/90"
                >
                  회원가입 →
                </Button>
              </Link>
            </>
          )}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-3 pt-3">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  {user.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar_url}
                      alt={displayName}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral/20 text-xs font-bold text-coral">
                      {initial}
                    </span>
                  )}
                  <span className="text-sm font-medium">{displayName}</span>
                </div>
                <form action={signOut}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  >
                    로그아웃
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">
                    로그인
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button
                    size="sm"
                    className="w-full bg-coral text-white hover:bg-coral/90"
                  >
                    회원가입
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
