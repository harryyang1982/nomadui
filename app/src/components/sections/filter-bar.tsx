"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function FilterBar() {
  return (
    <section className="sticky top-[57px] z-40 border-b bg-white/95 px-4 py-4 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl space-y-3">
        {/* Search Row */}
        <div className="relative">
          <Input
            type="text"
            placeholder="검색 또는 필터 입력..."
            className="h-10 pl-9"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            🔍
          </span>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2">
          <Select>
            <SelectTrigger className="h-8 w-[110px] text-xs">
              <SelectValue placeholder="지역: 전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="sudo">수도권</SelectItem>
              <SelectItem value="yeongnam">영남</SelectItem>
              <SelectItem value="honam">호남</SelectItem>
              <SelectItem value="chungcheong">충청</SelectItem>
              <SelectItem value="gangwon">강원</SelectItem>
              <SelectItem value="jeju">제주</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="생활비: 전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="under80">80만 이하</SelectItem>
              <SelectItem value="80-120">80~120만</SelectItem>
              <SelectItem value="120-180">120~180만</SelectItem>
              <SelectItem value="over180">180만 이상</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="h-8 w-[110px] text-xs">
              <SelectValue placeholder="태그: 전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="beach">해변</SelectItem>
              <SelectItem value="mountain">산</SelectItem>
              <SelectItem value="city">도심</SelectItem>
              <SelectItem value="quiet">조용함</SelectItem>
              <SelectItem value="cafe">카페많음</SelectItem>
              <SelectItem value="foreigner">외국인친화</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue placeholder="인터넷: 전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="50">50Mbps 이상</SelectItem>
              <SelectItem value="100">100Mbps 이상</SelectItem>
              <SelectItem value="200">200Mbps 이상</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort + View Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Select>
            <SelectTrigger className="h-8 w-[150px] text-xs">
              <SelectValue placeholder="노마드 점수순" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">노마드 점수순</SelectItem>
              <SelectItem value="cost-low">생활비 낮은순</SelectItem>
              <SelectItem value="internet">인터넷 빠른순</SelectItem>
              <SelectItem value="reviews">리뷰 많은순</SelectItem>
              <SelectItem value="likes">좋아요순</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-1">
            <Button variant="secondary" size="sm" className="h-8 text-xs">
              ▦ 그리드
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              🗺 지도
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs hidden sm:inline-flex">
              📊 차트
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs hidden sm:inline-flex">
              ⚖ 비교
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
