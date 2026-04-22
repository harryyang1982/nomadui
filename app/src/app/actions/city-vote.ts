"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type VoteDirection = "like" | "dislike" | "clear";

export async function voteCity(cityId: string, direction: VoteDirection) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=" + encodeURIComponent("로그인 후 투표할 수 있어요."));
  }

  if (direction === "clear") {
    await supabase
      .from("city_votes")
      .delete()
      .eq("city_id", cityId)
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("city_votes")
      .upsert(
        {
          city_id: cityId,
          user_id: user.id,
          vote: direction === "like" ? 1 : -1,
        },
        { onConflict: "city_id,user_id" }
      );
  }

  revalidatePath("/");
  revalidatePath(`/city/${cityId}`);
}
