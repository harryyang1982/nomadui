"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterKey = "budget" | "region" | "environment" | "bestSeason";

const OPTIONS: Record<FilterKey, { value: string; label: string }[]> = {
  budget: [
    { value: "all", label: "전체" },
    { value: "100만원 이하", label: "100만원 이하" },
    { value: "100~200만원", label: "100~200만원" },
    { value: "200만원 이상", label: "200만원 이상" },
  ],
  region: [
    { value: "all", label: "전체" },
    { value: "수도권", label: "수도권" },
    { value: "경상도", label: "경상도" },
    { value: "전라도", label: "전라도" },
    { value: "강원도", label: "강원도" },
    { value: "제주도", label: "제주도" },
    { value: "충청도", label: "충청도" },
  ],
  environment: [
    { value: "all", label: "전체" },
    { value: "자연친화", label: "자연친화" },
    { value: "도심선호", label: "도심선호" },
    { value: "카페작업", label: "카페작업" },
    { value: "코워킹 필수", label: "코워킹 필수" },
  ],
  bestSeason: [
    { value: "all", label: "전체" },
    { value: "봄", label: "봄" },
    { value: "여름", label: "여름" },
    { value: "가을", label: "가을" },
    { value: "겨울", label: "겨울" },
  ],
};

const LABELS: Record<FilterKey, string> = {
  budget: "예산",
  region: "지역",
  environment: "환경",
  bestSeason: "최고 계절",
};

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function current(key: FilterKey) {
    return searchParams.get(key) ?? "all";
  }

  function handleChange(key: FilterKey, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    });
  }

  return (
    <section className="sticky top-[57px] z-40 border-b bg-white/95 px-4 py-4 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(Object.keys(OPTIONS) as FilterKey[]).map((key) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {LABELS[key]}
              </label>
              <Select
                value={current(key)}
                onValueChange={(v) => handleChange(key, v ?? "all")}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  {OPTIONS[key].map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
