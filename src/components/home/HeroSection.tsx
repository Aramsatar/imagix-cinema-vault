
import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie, getFeaturedMovie } from '@/services/movieService';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadFeaturedMovie = async () => {
      try {
        const movie = await getFeaturedMovie();
        setFeaturedMovie(movie);
      } catch (error) {
        console.error('Failed to fetch featured movie:', error);
        toast({
          title: 'Error',
          description: 'Failed to load featured movie',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedMovie();
  }, [toast]);

  if (loading) {
    return (
      <div className="h-[70vh] bg-cinema-navy flex items-center justify-center">
        <div className="animate-pulse h-8 w-48 bg-muted rounded"></div>
      </div>
    );
  }

  if (!featuredMovie) {
    return null;
  }

  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${featuredMovie.backdrop || featuredMovie.poster})`,
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      {/* Content */}
      <div className="cinema-container relative h-full flex items-center">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {featuredMovie.title}
          </h1>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {featuredMovie.genres.map((genre, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-muted/30 backdrop-blur-sm text-xs rounded-full text-cinema-gray"
              >
                {genre}
              </span>
            ))}
          </div>
          
          <p className="text-cinema-gray mb-8 max-w-lg">
            {featuredMovie.overview.length > 200
              ? `${featuredMovie.overview.substring(0, 200)}...`
              : featuredMovie.overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to={`/movie/${featuredMovie.id}`}>
              <Button className="bg-cinema-red hover:bg-opacity-90">
                Book Now
              </Button>
            </Link>
            
            <button className="trailer-button group">
              <div className="h-10 w-10 rounded-full bg-muted/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-cinema-red/20 transition-colors">
                <Play size={18} className="ml-0.5" />
              </div>
              <span>Watch Trailer</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
