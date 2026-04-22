import { describe, it, expect } from "vitest";
import { AREAS, BUDGETS, parseFilters } from "./filters";

describe("filters constants", () => {
  it("BUDGETS 에 세 개의 예산 밴드가 정의되어 있다", () => {
    expect(BUDGETS).toEqual([
      "100만원 이하",
      "100~200만원",
      "200만원 이상",
    ]);
  });

  it("AREAS 에 여섯 개의 지역이 정의되어 있다", () => {
    expect(AREAS).toEqual([
      "수도권",
      "경상도",
      "전라도",
      "강원도",
      "제주도",
      "충청도",
    ]);
  });
});

describe("parseFilters", () => {
  it("빈 객체를 받으면 빈 객체를 반환한다", () => {
    expect(parseFilters({})).toEqual({});
  });

  it("undefined 만 포함된 객체를 받아도 빈 객체를 반환한다", () => {
    expect(
      parseFilters({
        budget: undefined,
        region: undefined,
        environment: undefined,
        bestSeason: undefined,
      })
    ).toEqual({});
  });

  it("BUDGETS 에 포함된 budget 값은 그대로 통과시킨다", () => {
    expect(parseFilters({ budget: "100만원 이하" })).toEqual({
      budget: "100만원 이하",
    });
    expect(parseFilters({ budget: "100~200만원" })).toEqual({
      budget: "100~200만원",
    });
    expect(parseFilters({ budget: "200만원 이상" })).toEqual({
      budget: "200만원 이상",
    });
  });

  it("BUDGETS 에 없는 budget 값은 무시된다", () => {
    expect(parseFilters({ budget: "50만원" })).toEqual({});
    expect(parseFilters({ budget: "all" })).toEqual({});
    expect(parseFilters({ budget: "" })).toEqual({});
  });

  it("AREAS 에 포함된 region 값은 area 키로 매핑된다", () => {
    expect(parseFilters({ region: "수도권" })).toEqual({ area: "수도권" });
    expect(parseFilters({ region: "제주도" })).toEqual({ area: "제주도" });
    expect(parseFilters({ region: "충청도" })).toEqual({ area: "충청도" });
  });

  it("AREAS 에 없는 region 값은 무시된다", () => {
    expect(parseFilters({ region: "서울" })).toEqual({});
    expect(parseFilters({ region: "all" })).toEqual({});
    expect(parseFilters({ region: "" })).toEqual({});
  });

  it("environment 는 'all' 과 빈 문자열을 제외하고 통과시킨다", () => {
    expect(parseFilters({ environment: "도시" })).toEqual({
      environment: "도시",
    });
    expect(parseFilters({ environment: "자연" })).toEqual({
      environment: "자연",
    });
    expect(parseFilters({ environment: "all" })).toEqual({});
    expect(parseFilters({ environment: "" })).toEqual({});
  });

  it("bestSeason 은 'all' 과 빈 문자열을 제외하고 통과시킨다", () => {
    expect(parseFilters({ bestSeason: "봄" })).toEqual({
      bestSeason: "봄",
    });
    expect(parseFilters({ bestSeason: "여름" })).toEqual({
      bestSeason: "여름",
    });
    expect(parseFilters({ bestSeason: "all" })).toEqual({});
    expect(parseFilters({ bestSeason: "" })).toEqual({});
  });

  it("여러 필터를 동시에 전달하면 유효한 것만 모아서 반환한다", () => {
    expect(
      parseFilters({
        budget: "100~200만원",
        region: "강원도",
        environment: "자연",
        bestSeason: "가을",
      })
    ).toEqual({
      budget: "100~200만원",
      area: "강원도",
      environment: "자연",
      bestSeason: "가을",
    });
  });

  it("일부는 유효, 일부는 무효인 경우 유효한 것만 포함한다", () => {
    expect(
      parseFilters({
        budget: "100만원 이하",
        region: "서울",
        environment: "all",
        bestSeason: "겨울",
      })
    ).toEqual({
      budget: "100만원 이하",
      bestSeason: "겨울",
    });
  });

  it("region 키는 입력이지만 출력 키는 area 로 정규화된다", () => {
    const out = parseFilters({ region: "전라도" });
    expect(out).toHaveProperty("area", "전라도");
    expect(out).not.toHaveProperty("region");
  });
});
