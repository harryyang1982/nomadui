"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, signInWithGoogle } from "./actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">로그인</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          KoNomad에 다시 오신 것을 환영합니다
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <form className="space-y-4" action={login}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            이메일
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="hello@example.com"
            className="h-10"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="h-10"
            required
          />
        </div>
        <Button
          type="submit"
          className="h-10 w-full bg-coral text-white hover:bg-coral/90"
        >
          로그인
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">또는</span>
        </div>
      </div>

      <form action={signInWithGoogle}>
        <Button
          type="submit"
          variant="outline"
          className="h-10 w-full gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M21.35 11.1h-9.17v2.92h5.28c-.24 1.4-1.55 4.1-5.28 4.1-3.18 0-5.77-2.64-5.77-5.88 0-3.25 2.59-5.88 5.77-5.88 1.81 0 3.02.77 3.72 1.43l2.54-2.45C16.86 3.76 14.8 2.88 12.18 2.88 7.03 2.88 2.82 7.08 2.82 12.23s4.21 9.35 9.36 9.35c5.4 0 8.98-3.8 8.98-9.15 0-.62-.07-1.08-.17-1.53z"
              fill="#4285F4"
            />
          </svg>
          Google로 계속하기
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        아직 계정이 없으신가요?{" "}
        <Link
          href="/register"
          className="font-medium text-coral hover:underline"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="border-b bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🇰🇷</span>
            <span className="text-xl font-bold tracking-tight">KoNomad</span>
          </Link>
          <Link href="/register">
            <Button variant="ghost" size="sm">
              회원가입
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
