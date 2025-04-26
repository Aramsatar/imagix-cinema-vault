
import PageLayout from '@/components/layout/PageLayout';
import { HeroSection } from '@/components/home/HeroSection';
import MovieSection from '@/components/home/MovieSection';
import NewsSection from '@/components/home/NewsSection';
import { Separator } from '@/components/ui/separator';

const Home = () => {
  return (
    <PageLayout>
      <HeroSection
        badge={{
          text: "Welcome to Cinema+",
          action: {
            text: "Browse Movies",
            href: "/movies",
          },
        }}
        title="Your Gateway to Endless Entertainment"
        description="Discover the latest movies, upcoming releases, and exclusive content. Join us for an unparalleled cinematic experience."
        actions={[
          {
            text: "Browse Movies",
            href: "/movies",
            variant: "default",
          },
          {
            text: "Latest News",
            href: "/news",
            variant: "outline",
          },
        ]}
        image="/hero-cinema.jpg"
      />
      
      <MovieSection title="Opening This Week" category="now_playing" />
      
      <Separator className="max-w-[95%] mx-auto opacity-20" />
      
      <MovieSection title="Coming Soon" category="coming_soon" />
      
      <Separator className="max-w-[95%] mx-auto opacity-20" />
      
      <NewsSection />
    </PageLayout>
  );
};

export default Home;
