"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterState {
  budget: string;
  region: string;
  environment: string;
  bestSeason: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  function handleChange(key: keyof FilterState, value: string | null) {
    onFilterChange({ ...filters, [key]: value ?? "all" });
  }

  return (
    <section className="sticky top-[57px] z-40 border-b bg-white/95 px-4 py-4 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.budget}
            onValueChange={(v) => handleChange("budget", v)}
          >
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="예산: 전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="100만원 이하">100만원 이하</SelectItem>
              <SelectItem value="100~200만원">100~200만원</SelectItem>
              <SelectItem value="200만원 이상">200만원 이상</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.region}
            onValueChange={(v) => handleChange("region", v)}
          >
            <SelectTrigger className="h-8 w-[120px] text-xs">
              <SelectValue placeholder="지역: 전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="수도권">수도권</SelectItem>
              <SelectItem value="경상도">경상도</SelectItem>
              <SelectItem value="전라도">전라도</SelectItem>
              <SelectItem value="강원도">강원도</SelectItem>
              <SelectItem value="제주도">제주도</SelectItem>
              <SelectItem value="충청도">충청도</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.environment}
            onValueChange={(v) => handleChange("environment", v)}
          >
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="환경: 전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="자연친화">자연친화</SelectItem>
              <SelectItem value="도심선호">도심선호</SelectItem>
              <SelectItem value="카페작업">카페작업</SelectItem>
              <SelectItem value="코워킹 필수">코워킹 필수</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.bestSeason}
            onValueChange={(v) => handleChange("bestSeason", v)}
          >
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="최고 계절: 전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="봄">봄</SelectItem>
              <SelectItem value="여름">여름</SelectItem>
              <SelectItem value="가을">가을</SelectItem>
              <SelectItem value="겨울">겨울</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
