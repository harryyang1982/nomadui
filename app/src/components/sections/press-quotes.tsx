import { pressQuotes } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";

export function PressQuotes() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3">
        {pressQuotes.map((item, i) => (
          <Card key={i} className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <p className="mb-4 text-sm leading-relaxed text-gray-700">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                ── {item.source}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
