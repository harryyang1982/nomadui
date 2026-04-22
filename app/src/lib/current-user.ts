import "server-only";
import { createClient } from "@/utils/supabase/server";
import type { NavbarUser } from "@/components/sections/navbar";

export async function getNavbarUser(): Promise<NavbarUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return {
    email: user.email ?? null,
    username: profile?.username ?? null,
    avatar_url:
      profile?.avatar_url ??
      (user.user_metadata?.avatar_url as string | undefined) ??
      null,
  };
}
