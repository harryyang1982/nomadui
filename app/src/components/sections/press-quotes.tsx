import { Card, CardContent } from "@/components/ui/card";
import { getPressQuotes } from "@/lib/queries";

export async function PressQuotes() {
  const pressQuotes = await getPressQuotes();
  if (pressQuotes.length === 0) return null;

  return (
    <section className="px-4 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3">
        {pressQuotes.map((item) => (
          <Card key={item.id} className="border-gray-200 bg-white">
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
