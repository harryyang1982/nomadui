import { describe, it, expect } from "vitest";
import { formatRelative } from "./format";

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-04-22T12:00:00.000Z").getTime();

function isoAgo(ms: number): string {
  return new Date(NOW - ms).toISOString();
}

describe("formatRelative", () => {
  it("1일 미만(23시간 59분 전)이면 '오늘' 을 반환한다", () => {
    expect(formatRelative(isoAgo(DAY_MS - 60 * 1000), NOW)).toBe("오늘");
  });

  it("정확히 같은 시각이면 '오늘' 을 반환한다", () => {
    expect(formatRelative(isoAgo(0), NOW)).toBe("오늘");
  });

  it("미래 시각(음수 diff)도 '오늘' 로 취급한다", () => {
    expect(formatRelative(isoAgo(-60 * 1000), NOW)).toBe("오늘");
  });

  it("정확히 24시간 전이면 '1일 전' 이다", () => {
    expect(formatRelative(isoAgo(DAY_MS), NOW)).toBe("1일 전");
  });

  it("2~6일 범위는 '${days}일 전' 형식이다", () => {
    expect(formatRelative(isoAgo(DAY_MS * 2), NOW)).toBe("2일 전");
    expect(formatRelative(isoAgo(DAY_MS * 3), NOW)).toBe("3일 전");
    expect(formatRelative(isoAgo(DAY_MS * 6), NOW)).toBe("6일 전");
  });

  it("정확히 7일 전이면 '1주 전' 이다", () => {
    expect(formatRelative(isoAgo(DAY_MS * 7), NOW)).toBe("1주 전");
  });

  it("13일(1주차 후반)은 '1주 전' 이다", () => {
    expect(formatRelative(isoAgo(DAY_MS * 13), NOW)).toBe("1주 전");
  });

  it("14일은 '2주 전' 이다", () => {
    expect(formatRelative(isoAgo(DAY_MS * 14), NOW)).toBe("2주 전");
  });

  it("34일(5주 미만 경계)은 '4주 전' 이다", () => {
    expect(formatRelative(isoAgo(DAY_MS * 34), NOW)).toBe("4주 전");
  });

  it("35일(5주 진입)은 months 단위로 바뀌어 '1개월 전' 이다", () => {
    expect(formatRelative(isoAgo(DAY_MS * 35), NOW)).toBe("1개월 전");
  });

  it("60일은 '2개월 전' 이다", () => {
    expect(formatRelative(isoAgo(DAY_MS * 60), NOW)).toBe("2개월 전");
  });

  it("359일(12개월 미만)은 '11개월 전' 이다", () => {
    expect(formatRelative(isoAgo(DAY_MS * 359), NOW)).toBe("11개월 전");
  });

  it("365일(12개월 경계)은 '1년 전' 이다", () => {
    expect(formatRelative(isoAgo(DAY_MS * 365), NOW)).toBe("1년 전");
  });

  it("2년 이상은 floor(days/365) 로 계산한다", () => {
    expect(formatRelative(isoAgo(DAY_MS * 730), NOW)).toBe("2년 전");
    expect(formatRelative(isoAgo(DAY_MS * 365 * 3), NOW)).toBe("3년 전");
  });

  it("now 파라미터를 명시하지 않으면 Date.now() 기준으로 동작한다", () => {
    const iso = new Date(Date.now() - 60 * 1000).toISOString();
    expect(formatRelative(iso)).toBe("오늘");
  });
});
