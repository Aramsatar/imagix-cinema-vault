
import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Movie, getMovies } from '@/services/movieService';
import MovieCard from '@/components/movies/MovieCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Movies = () => {
  const [activeTab, setActiveTab] = useState('popular');
  const [movies, setMovies] = useState<Record<string, Movie[]>>({
    popular: [],
    now_playing: [],
    coming_soon: [],
    top_rated: []
  });
  const [loading, setLoading] = useState<Record<string, boolean>>({
    popular: true,
    now_playing: true,
    coming_soon: true,
    top_rated: true
  });
  const [page, setPage] = useState<Record<string, number>>({
    popular: 1,
    now_playing: 1,
    coming_soon: 1,
    top_rated: 1
  });

  const tabToCategory: Record<string, string> = {
    popular: 'featured',
    now_playing: 'now_playing',
    coming_soon: 'coming_soon',
    top_rated: 'top_rated'
  };

  const fetchMoviesForTab = async (tab: string) => {
    const category = tabToCategory[tab];
    setLoading(prev => ({ ...prev, [tab]: true }));
    
    try {
      const newMovies = await getMovies(category);
      setMovies(prev => ({ ...prev, [tab]: newMovies }));
    } catch (error) {
      console.error(`Error fetching ${tab} movies:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [tab]: false }));
    }
  };

  const loadMore = async () => {
    setLoading(prev => ({ ...prev, [activeTab]: true }));
    try {
      const nextPage = page[activeTab] + 1;
      const category = tabToCategory[activeTab];
      const newMovies = await getMovies(category, undefined, nextPage);
      
      setMovies(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], ...newMovies]
      }));
      
      setPage(prev => ({
        ...prev,
        [activeTab]: nextPage
      }));
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setLoading(prev => ({ ...prev, [activeTab]: false }));
    }
  };

  useEffect(() => {
    // Load initial data for the active tab
    fetchMoviesForTab(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (movies[value].length === 0) {
      fetchMoviesForTab(value);
    }
  };

  const tabTitles: Record<string, string> = {
    popular: 'Popular',
    now_playing: 'Now Playing',
    coming_soon: 'Coming Soon',
    top_rated: 'Top Rated'
  };

  return (
    <PageLayout>
      {/* Hero section */}
      <div className="relative h-[30vh] md:h-[40vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/jXJxMcVoEuXzym3vFnjqDW4ifo6.jpg)`,
          }}
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="cinema-container relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Discover Movies
          </h1>
        </div>
      </div>

      <div className="cinema-container py-12">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            {Object.entries(tabTitles).map(([key, title]) => (
              <TabsTrigger key={key} value={key} className="text-sm md:text-base">
                {title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(tabTitles).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {movies[tab].map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {loading[tab] && (
                <div className="flex justify-center mt-8">
                  <Loader2 className="h-8 w-8 animate-spin text-cinema-red" />
                </div>
              )}

              {!loading[tab] && movies[tab].length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={loadMore} 
                    variant="outline"
                    className="border-cinema-red text-cinema-red hover:bg-cinema-red hover:text-white"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Movies;
