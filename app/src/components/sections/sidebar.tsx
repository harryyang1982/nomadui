import { meetups, travelingMembers, newMembers, chatMessages } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  return (
    <aside className="w-full space-y-4 lg:w-72 xl:w-80">
      {/* Meetup Widget */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            🥥 다음 밋업 ({meetups.length}회/월)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {meetups.map((meetup) => (
            <div
              key={meetup.id}
              className="rounded-lg border bg-gray-50 p-3"
            >
              <p className="text-sm font-medium">📍 {meetup.city}</p>
              <p className="text-xs text-muted-foreground">{meetup.date}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex -space-x-1">
                  {meetup.avatars.map((a, i) => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-white">
                      <AvatarFallback className="bg-coral/70 text-[10px] text-white">
                        {a}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {meetup.attendees}명 참가
                </span>
              </div>
            </div>
          ))}
          <a href="#" className="block text-xs font-medium text-coral hover:underline">
            → 밋업 더보기
          </a>
        </CardContent>
      </Card>

      {/* Ad Widget */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <p className="mb-1 text-sm font-medium">🏢 코워킹 스페이스 할인</p>
          <p className="text-xs text-muted-foreground">
            첫 달 50% 할인
          </p>
          <span className="mt-2 rounded bg-gray-100 px-2 py-0.5 text-[10px] text-muted-foreground">
            Ad
          </span>
        </CardContent>
      </Card>

      {/* Traveling Members */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            🛩 현재 여행중 ({travelingMembers.length}명)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {travelingMembers.slice(0, 4).map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-blue-100 text-xs">
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium">{member.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  → {member.city} 체류중
                </p>
              </div>
            </div>
          ))}
          <a href="#" className="block text-xs font-medium text-coral hover:underline">
            → 전체 보기
          </a>
        </CardContent>
      </Card>

      {/* New Members */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            👋 신규 멤버 (606명/월)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {newMembers.map((member) => (
              <Avatar key={member.id} className="h-8 w-8">
                <AvatarFallback className="bg-green-100 text-xs">
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[10px] text-muted-foreground">
              +598
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Chat */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">💬 커뮤니티 채팅</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {chatMessages.slice(0, 3).map((msg) => (
            <div key={msg.id} className="select-none blur-[3px]">
              <p className="text-xs">
                <span className="font-medium">{msg.user}:</span>{" "}
                {msg.message}
              </p>
              <p className="text-[10px] text-muted-foreground">{msg.time}</p>
            </div>
          ))}
          <Separator />
          <a
            href="#"
            className="block text-center text-xs font-medium text-coral hover:underline"
          >
            → 채팅 참여하기
          </a>
        </CardContent>
      </Card>
    </aside>
  );
}
