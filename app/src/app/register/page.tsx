"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "../login/actions";

function RegisterForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">회원가입</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          KoNomad 커뮤니티에 참여하세요
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-md bg-green-50 p-3 text-center text-sm text-green-600">
          {message}
        </div>
      )}

      <form className="space-y-4" action={signup}>
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
          <label htmlFor="password" className="text-sm font-medium">
            비밀번호
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="8자 이상 입력하세요"
            className="h-10"
            minLength={8}
            required
          />
        </div>
        <Button
          type="submit"
          className="h-10 w-full bg-coral text-white hover:bg-coral/90"
        >
          가입하기
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        가입 시{" "}
        <a href="#" className="underline hover:text-foreground">
          이용약관
        </a>{" "}
        및{" "}
        <a href="#" className="underline hover:text-foreground">
          개인정보처리방침
        </a>
        에 동의하는 것으로 간주됩니다.
      </p>

      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="font-medium text-coral hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="border-b bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🇰🇷</span>
            <span className="text-xl font-bold tracking-tight">KoNomad</span>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">
              로그인
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </main>
    </div>
  );
}
