
import { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie, getMoviesByCategory } from '@/services/movieService';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/use-media-query';

const CarouselHeroSection = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const loadTrendingMovies = async () => {
    try {
      setLoading(true);
      // Using 'trending' to get trending movies
      const movies = await getMoviesByCategory('trending', undefined, 1);
      setTrendingMovies(movies.slice(0, 5)); // Take top 5 trending movies
    } catch (error) {
      console.error('Failed to fetch trending movies:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trending movies',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  useEffect(() => {
    if (isPlaying && trendingMovies.length > 0) {
      // Set timer to 10 seconds to match trailer clip length
      timerRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % trendingMovies.length);
      }, 10000); // Exactly 10 seconds
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, trendingMovies.length]);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % trendingMovies.length);
    resetTimer();
  };

  const handlePrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + trendingMovies.length) % trendingMovies.length);
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      if (isPlaying) {
        timerRef.current = setInterval(() => {
          setActiveIndex((prevIndex) => (prevIndex + 1) % trendingMovies.length);
        }, 10000); // Reset to 10 seconds
      }
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className="h-[70vh] bg-cinema-navy flex items-center justify-center">
        <div className="animate-pulse h-8 w-48 bg-muted rounded"></div>
      </div>
    );
  }

  if (trendingMovies.length === 0) {
    return null;
  }

  const activeMovie = trendingMovies[activeIndex];
  
  const getYoutubeEmbedUrl = (trailerUrl?: string): string | null => {
    if (!trailerUrl) return null;
    
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = trailerUrl.match(youtubeRegex);
    
    // Set clip to play only 10 seconds by specifying start and end parameters
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${match[1]}&start=30&end=40` : null;
  };

  const youtubeEmbedUrl = getYoutubeEmbedUrl(activeMovie.trailerUrl);

  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0 bg-cinema-black">
        {youtubeEmbedUrl ? (
          <iframe
            ref={iframeRef}
            className="absolute w-full h-full object-cover"
            src={youtubeEmbedUrl}
            title={`${activeMovie.title} trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ pointerEvents: 'none' }}
          ></iframe>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${activeMovie.backdrop || activeMovie.poster})`,
            }}
          />
        )}
      </div>
      
      <div className="absolute inset-0 bg-hero-gradient" />
      
      <div className="cinema-container relative h-full flex items-center">
        <div className="max-w-2xl animate-fade-in z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {activeMovie.title}
          </h1>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {activeMovie.genres.map((genre, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-muted/30 backdrop-blur-sm text-xs rounded-full text-cinema-gray"
              >
                {genre}
              </span>
            ))}
          </div>
          
          <p className="text-cinema-gray mb-8 max-w-lg">
            {activeMovie.overview.length > 200
              ? `${activeMovie.overview.substring(0, 200)}...`
              : activeMovie.overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to={`/movie/${activeMovie.id}`}>
              <Button className="bg-cinema-red hover:bg-opacity-90">
                Book Now
              </Button>
            </Link>
            
            <Link to={`/movie/${activeMovie.id}`} className="trailer-button group">
              <div className="h-10 w-10 rounded-full bg-muted/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-cinema-red/20 transition-colors">
                <Play size={18} className="ml-0.5" />
              </div>
              <span>Watch Full Trailer</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 z-20">
        {!isMobile && (
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-muted/30 backdrop-blur-sm flex items-center justify-center hover:bg-cinema-red/20 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        )}
        
        <div className="flex gap-3 items-center">
          {trendingMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === activeIndex ? "w-10 bg-cinema-red" : "w-2 bg-white/30"
              }`}
              aria-label={`Go to movie ${idx + 1}`}
            />
          ))}
        </div>
        
        {!isMobile && (
          <div className="flex gap-2">
            <span className="text-sm text-white/70">
              {activeIndex + 1}/{trendingMovies.length}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CarouselHeroSection;
