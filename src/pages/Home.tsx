
import PageLayout from '@/components/layout/PageLayout';
import CarouselHeroSection from '@/components/home/CarouselHeroSection';
import MovieSection from '@/components/home/MovieSection';
import NewsSection from '@/components/home/NewsSection';
import { Separator } from '@/components/ui/separator';

const Home = () => {
  return (
    <PageLayout>
      <CarouselHeroSection />
      
      <MovieSection title="Opening This Week" category="now_playing" />
      
      <Separator className="max-w-[95%] mx-auto opacity-20" />
      
      <MovieSection title="Coming Soon" category="coming_soon" />
      
      <Separator className="max-w-[95%] mx-auto opacity-20" />
      
      <NewsSection />
    </PageLayout>
  );
};

export default Home;
