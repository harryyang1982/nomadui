import type { ProfileRow } from "@/lib/database.types";
import type { AuthUser } from "@/../test/helpers/supabase-mock";

const ISO = "2026-04-20T09:00:00.000Z";

export const authUser: AuthUser = {
  id: "user-1",
  email: "alex@example.com",
  user_metadata: { avatar_url: "https://example.com/alex.png" },
};

export const profileRow: ProfileRow = {
  id: authUser.id,
  username: "alex_nomad",
  avatar_url: "https://example.com/alex.png",
  current_city_id: null,
  created_at: ISO,
  updated_at: ISO,
};
