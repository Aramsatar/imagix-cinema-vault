
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Movie, getMovieById } from '@/services/movieService';
import { Button } from '@/components/ui/button';
import { Loader2, Play, ArrowLeft, Calendar, Clock, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWatchingTrailer, setIsWatchingTrailer] = useState(false);
  const [isWatchingMovie, setIsWatchingMovie] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const movieData = await getMovieById(id);
        if (movieData) {
          setMovie(movieData);
        } else {
          toast({
            title: 'Error',
            description: 'Movie not found',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Failed to fetch movie details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load movie details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, toast]);

  const handleWatchTrailer = () => {
    if (movie?.trailerUrl) {
      setIsWatchingTrailer(true);
    } else {
      toast({
        title: 'Trailer Not Available',
        description: 'The trailer for this movie is not available.',
        variant: 'default',
      });
    }
  };
  
  const handleWatchMovie = () => {
    setIsWatchingMovie(true);
  };
  
  const getTrailerEmbedUrl = () => {
    if (!movie?.trailerUrl) return '';
    
    // Extract YouTube video ID
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = movie.trailerUrl.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
    
    return movie.trailerUrl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-cinema-red" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-medium mb-4">Movie Not Found</h2>
        <p className="text-cinema-gray mb-6">The movie you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero section with backdrop */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.backdrop || movie.poster})`,
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-hero-gradient" />
        
        {/* Content */}
        <div className="cinema-container relative h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Poster */}
            <div className="w-40 md:w-60 rounded-lg overflow-hidden shadow-xl hidden md:block">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-auto" 
              />
            </div>
            
            {/* Movie info */}
            <div className="max-w-2xl animate-fade-in">
              <Link to="/" className="inline-flex items-center text-cinema-gray hover:text-cinema-red mb-4 transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Back to Movies
              </Link>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap gap-3 mb-4">
                {movie.genres.map((genre, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-muted/30 backdrop-blur-sm text-xs rounded-full text-cinema-gray"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-cinema-gray mb-6">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>
                    {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{movie.runtime} min</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  className="bg-cinema-red hover:bg-opacity-90"
                  onClick={handleWatchMovie}
                >
                  Watch Now
                </Button>
                
                <button 
                  className="trailer-button group" 
                  onClick={handleWatchTrailer}
                >
                  <div className="h-10 w-10 rounded-full bg-muted/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-cinema-red/20 transition-colors">
                    <Play size={18} className="ml-0.5" />
                  </div>
                  <span>Watch Trailer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Movie details */}
      <div className="cinema-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-medium mb-4">Synopsis</h2>
            <p className="text-cinema-gray mb-8">
              {movie.overview}
            </p>
            
            <h2 className="text-2xl font-medium mb-4">Cast & Crew</h2>
            <div className="mb-8">
              {movie.director && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Director</h3>
                  <p className="text-cinema-gray">{movie.director}</p>
                </div>
              )}
              
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Cast</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((actor, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-cinema-card-bg rounded-full text-sm text-cinema-gray"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-cinema-card-bg border border-muted rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Movie Information</h3>
              
              <div className="space-y-4 text-cinema-gray">
                <div>
                  <h4 className="text-sm opacity-70">Release Date</h4>
                  <p>
                    {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm opacity-70">Runtime</h4>
                  <p>{movie.runtime} minutes</p>
                </div>
                
                <div>
                  <h4 className="text-sm opacity-70">Rating</h4>
                  <div className="flex items-center">
                    <span className="text-cinema-red font-medium">{movie.rating.toFixed(1)}</span>
                    <span className="ml-1">/10</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm opacity-70">Formats</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {movie.format.map((format, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-0.5 bg-muted/30 text-xs rounded text-cinema-white"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <Button 
                className="w-full bg-cinema-red hover:bg-opacity-90"
                onClick={handleWatchMovie}
              >
                Watch Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trailer Modal */}
      <Dialog open={isWatchingTrailer} onOpenChange={setIsWatchingTrailer}>
        <DialogContent className="max-w-4xl p-0 bg-cinema-navy border-cinema-gray/20">
          <div className="relative pt-[56.25%] w-full">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={getTrailerEmbedUrl()}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Watch Movie Modal */}
      <Dialog open={isWatchingMovie} onOpenChange={setIsWatchingMovie}>
        <DialogContent className="max-w-5xl p-0 bg-cinema-navy border-cinema-gray/20">
          <DialogHeader className="p-4 border-b border-muted/20">
            <DialogTitle className="text-white">{movie.title}</DialogTitle>
            <DialogDescription>
              Enjoy watching the full movie in HD quality
            </DialogDescription>
            <Button
              className="absolute right-4 top-4"
              variant="ghost"
              size="icon"
              onClick={() => setIsWatchingMovie(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="relative pt-[56.25%] w-full">
            {movie.trailerUrl ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={getTrailerEmbedUrl()}
                title={`${movie.title} Movie`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
                <div className="text-center px-4">
                  <Play className="mx-auto h-16 w-16 text-cinema-red opacity-50" />
                  <p className="mt-4 text-lg text-white">
                    This is a demo. In a real application, the movie would play here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovieDetails;
