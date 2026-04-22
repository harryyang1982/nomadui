import type { VoteDirection } from "@/app/actions/city-vote";

export type VoteValue = "none" | "like" | "dislike";

export interface VoteState {
  vote: VoteValue;
  likeCount: number;
  dislikeCount: number;
}

export function voteReducer(
  prev: VoteState,
  action: VoteDirection
): VoteState {
  const next: VoteState = { ...prev };
  if (action === "clear") {
    if (prev.vote === "like") next.likeCount -= 1;
    if (prev.vote === "dislike") next.dislikeCount -= 1;
    next.vote = "none";
  } else if (action === "like") {
    if (prev.vote === "like") {
      next.likeCount -= 1;
      next.vote = "none";
    } else {
      if (prev.vote === "dislike") next.dislikeCount -= 1;
      next.likeCount += 1;
      next.vote = "like";
    }
  } else if (action === "dislike") {
    if (prev.vote === "dislike") {
      next.dislikeCount -= 1;
      next.vote = "none";
    } else {
      if (prev.vote === "like") next.likeCount -= 1;
      next.dislikeCount += 1;
      next.vote = "dislike";
    }
  }
  return next;
}
