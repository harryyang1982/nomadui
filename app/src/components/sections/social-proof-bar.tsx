import { pressLogos } from "@/lib/mock-data";

export function SocialProofBar() {
  return (
    <section className="border-b bg-gray-50 px-4 py-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 md:gap-10">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          as seen on
        </span>
        {pressLogos.map((logo) => (
          <span
            key={logo}
            className="text-sm font-semibold text-gray-400 transition-colors hover:text-gray-600"
          >
            {logo}
          </span>
        ))}
      </div>
    </section>
  );
}
