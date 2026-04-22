import { describe, it, expect } from "vitest";
import { voteReducer, type VoteState } from "./vote-reducer";

function state(
  vote: VoteState["vote"],
  likeCount: number,
  dislikeCount: number
): VoteState {
  return { vote, likeCount, dislikeCount };
}

describe("voteReducer - like action", () => {
  it("vote=none 에서 like 는 likeCount +1 하고 vote=like 로 바꾼다", () => {
    expect(voteReducer(state("none", 5, 3), "like")).toEqual(
      state("like", 6, 3)
    );
  });

  it("vote=like 에서 like 는 toggle off 로 동작해 likeCount -1, vote=none", () => {
    expect(voteReducer(state("like", 5, 3), "like")).toEqual(
      state("none", 4, 3)
    );
  });

  it("vote=dislike 에서 like 는 dislikeCount -1, likeCount +1, vote=like", () => {
    expect(voteReducer(state("dislike", 5, 3), "like")).toEqual(
      state("like", 6, 2)
    );
  });
});

describe("voteReducer - dislike action", () => {
  it("vote=none 에서 dislike 는 dislikeCount +1 하고 vote=dislike 로 바꾼다", () => {
    expect(voteReducer(state("none", 5, 3), "dislike")).toEqual(
      state("dislike", 5, 4)
    );
  });

  it("vote=dislike 에서 dislike 는 toggle off 로 동작해 dislikeCount -1, vote=none", () => {
    expect(voteReducer(state("dislike", 5, 3), "dislike")).toEqual(
      state("none", 5, 2)
    );
  });

  it("vote=like 에서 dislike 는 likeCount -1, dislikeCount +1, vote=dislike", () => {
    expect(voteReducer(state("like", 5, 3), "dislike")).toEqual(
      state("dislike", 4, 4)
    );
  });
});

describe("voteReducer - clear action", () => {
  it("vote=like 에서 clear 는 likeCount -1, vote=none", () => {
    expect(voteReducer(state("like", 5, 3), "clear")).toEqual(
      state("none", 4, 3)
    );
  });

  it("vote=dislike 에서 clear 는 dislikeCount -1, vote=none", () => {
    expect(voteReducer(state("dislike", 5, 3), "clear")).toEqual(
      state("none", 5, 2)
    );
  });

  it("vote=none 에서 clear 는 카운트 변화 없이 그대로 vote=none", () => {
    expect(voteReducer(state("none", 5, 3), "clear")).toEqual(
      state("none", 5, 3)
    );
  });

  it("vote=none 에서 clear 를 연속 호출해도 카운트가 음수가 되지 않는다", () => {
    let s = state("none", 5, 3);
    s = voteReducer(s, "clear");
    s = voteReducer(s, "clear");
    s = voteReducer(s, "clear");
    expect(s).toEqual(state("none", 5, 3));
  });
});

describe("voteReducer - immutability & misc", () => {
  it("이전 상태 객체를 변이(mutate) 하지 않는다", () => {
    const prev = state("like", 5, 3);
    const snapshot = { ...prev };
    voteReducer(prev, "like");
    expect(prev).toEqual(snapshot);
  });

  it("like → clear 는 like → like 와 동일한 최종 상태를 만든다", () => {
    const initial = state("like", 5, 3);
    expect(voteReducer(initial, "clear")).toEqual(
      voteReducer(initial, "like")
    );
  });

  it("dislike → clear 는 dislike → dislike 와 동일한 최종 상태를 만든다", () => {
    const initial = state("dislike", 5, 3);
    expect(voteReducer(initial, "clear")).toEqual(
      voteReducer(initial, "dislike")
    );
  });

  it("like → dislike → like 전이가 카운트에 정확히 반영된다", () => {
    let s = state("none", 10, 10);
    s = voteReducer(s, "like");
    expect(s).toEqual(state("like", 11, 10));
    s = voteReducer(s, "dislike");
    expect(s).toEqual(state("dislike", 10, 11));
    s = voteReducer(s, "like");
    expect(s).toEqual(state("like", 11, 10));
  });
});
