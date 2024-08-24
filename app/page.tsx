import HeroSection from "@/components/home/HeroSection";
import PopularSection from "@/components/home/PopularSection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-foreground">
      <HeroSection />
      <PopularSection />
    </main>
  );
}
