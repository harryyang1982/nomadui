import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";

export async function Sidebar() {
  const supabase = await createClient();

  const [meetupsRes, travelingRes, newMembersRes, chatRes, monthlyNewCountRes] =
    await Promise.all([
      supabase
        .from("meetups")
        .select("id, event_at, title, city:cities(name_ko), meetup_attendees(count)")
        .gte("event_at", new Date().toISOString())
        .order("event_at", { ascending: true })
        .limit(3),
      supabase
        .from("profiles")
        .select("id, username, avatar_url, city:cities(name_ko)")
        .not("current_city_id", "is", null)
        .limit(4),
      supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("chat_messages")
        .select("id, content, created_at, profiles(username)")
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte(
          "created_at",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        ),
    ]);

  const meetups = meetupsRes.data ?? [];
  const traveling = travelingRes.data ?? [];
  const newMembers = newMembersRes.data ?? [];
  const chatMessages = chatRes.data ?? [];
  const monthlyNew = monthlyNewCountRes.count ?? 0;

  const initial = (s?: string | null) =>
    (s ?? "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <aside className="w-full space-y-4 lg:w-72 xl:w-80">
      {/* Meetup Widget */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            🥥 다음 밋업 ({meetups.length}회 예정)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {meetups.length === 0 && (
            <p className="text-xs text-muted-foreground">
              예정된 밋업이 없어요.
            </p>
          )}
          {meetups.map((meetup) => {
            const city = Array.isArray(meetup.city) ? meetup.city[0] : meetup.city;
            const cityName = (city as { name_ko?: string } | null)?.name_ko;
            const attendees = Array.isArray(meetup.meetup_attendees)
              ? (meetup.meetup_attendees[0] as { count?: number } | undefined)
              : undefined;
            const attendeeCount = attendees?.count ?? 0;
            return (
              <div
                key={meetup.id}
                className="rounded-lg border bg-gray-50 p-3"
              >
                <p className="text-sm font-medium">📍 {cityName ?? "-"}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(meetup.event_at).toLocaleDateString("ko-KR", {
                    month: "numeric",
                    day: "numeric",
                    weekday: "short",
                  })}
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {attendeeCount}명 참가
                </div>
              </div>
            );
          })}
          <Link
            href="/meetups"
            className="block text-xs font-medium text-coral hover:underline"
          >
            → 밋업 더보기
          </Link>
        </CardContent>
      </Card>

      {/* Ad Widget */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <p className="mb-1 text-sm font-medium">🏢 코워킹 스페이스 할인</p>
          <p className="text-xs text-muted-foreground">첫 달 50% 할인</p>
          <span className="mt-2 rounded bg-gray-100 px-2 py-0.5 text-[10px] text-muted-foreground">
            Ad
          </span>
        </CardContent>
      </Card>

      {/* Traveling Members */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            🛩 현재 여행중 ({traveling.length}명)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {traveling.length === 0 && (
            <p className="text-xs text-muted-foreground">
              아직 체류 중인 멤버가 없어요.
            </p>
          )}
          {traveling.map((member) => {
            const city = Array.isArray(member.city) ? member.city[0] : member.city;
            const cityName = (city as { name_ko?: string } | null)?.name_ko;
            return (
              <div key={member.id} className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-blue-100 text-xs">
                    {initial(member.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium">
                    {member.username ?? "익명"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    → {cityName ?? "?"} 체류중
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* New Members */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            👋 신규 멤버 ({monthlyNew}명/월)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {newMembers.map((m) => (
              <Avatar key={m.id} className="h-8 w-8">
                <AvatarFallback className="bg-green-100 text-xs">
                  {initial(m.username)}
                </AvatarFallback>
              </Avatar>
            ))}
            {monthlyNew > newMembers.length && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[10px] text-muted-foreground">
                +{monthlyNew - newMembers.length}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Community Chat */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">💬 커뮤니티 채팅</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {chatMessages.length === 0 && (
            <p className="text-xs text-muted-foreground">
              아직 채팅이 없어요.
            </p>
          )}
          {chatMessages.map((msg) => {
            const profile = Array.isArray(msg.profiles)
              ? msg.profiles[0]
              : msg.profiles;
            const user = (profile as { username?: string } | null)?.username;
            return (
              <div key={msg.id} className="select-none blur-[3px]">
                <p className="text-xs">
                  <span className="font-medium">{user ?? "익명"}:</span>{" "}
                  {msg.content}
                </p>
              </div>
            );
          })}
          <Separator />
          <Link
            href="/chat"
            className="block text-center text-xs font-medium text-coral hover:underline"
          >
            → 채팅 참여하기
          </Link>
        </CardContent>
      </Card>
    </aside>
  );
}
