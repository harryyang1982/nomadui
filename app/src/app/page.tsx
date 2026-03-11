import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { SocialProofBar } from "@/components/sections/social-proof-bar";
import { PressQuotes } from "@/components/sections/press-quotes";
import { FilterBar } from "@/components/sections/filter-bar";
import { CityGrid } from "@/components/sections/city-grid";
import { Sidebar } from "@/components/sections/sidebar";
import { StatsSection } from "@/components/sections/stats-section";
import { PopularTags } from "@/components/sections/popular-tags";
import { RecentReviews } from "@/components/sections/recent-reviews";
import { BottomCta } from "@/components/sections/bottom-cta";
import { Footer } from "@/components/sections/footer";
import { FloatingCtaBar } from "@/components/sections/floating-cta-bar";
import { SettingsToggle } from "@/components/sections/settings-toggle";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SocialProofBar />
      <PressQuotes />
      <FilterBar />

      {/* Main Content: City Grid + Sidebar */}
      <section className="px-4 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
          <CityGrid />
          <Sidebar />
        </div>
      </section>

      <StatsSection />
      <PopularTags />
      <RecentReviews />
      <BottomCta />
      <Footer />

      {/* Floating Elements */}
      <FloatingCtaBar />
      <SettingsToggle />
    </div>
  );
}
