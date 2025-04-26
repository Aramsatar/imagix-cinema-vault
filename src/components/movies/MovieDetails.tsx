import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Movie, getMovieById } from '@/services/movieService';
import { Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getImageUrl } from '@/services/tmdbService';
import MovieInfo from './MovieInfo';
import MovieImages from './MovieImages';
import MovieCast from './MovieCast';
import MovieSidebar from './MovieSidebar';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWatchingTrailer, setIsWatchingTrailer] = useState(false);
  const [isWatchingMovie, setIsWatchingMovie] = useState(false);
  const [movieImages, setMovieImages] = useState<{ cast: string[]; stills: string[] }>({
    cast: [],
    stills: []
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const movieData = await getMovieById(id);
        if (movieData) {
          setMovie(movieData);
          
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/images?api_key=49f494cb35b3ea755e58f9a7cd6d183b`
          );
          const imagesData = await response.json();
          
          const castResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=49f494cb35b3ea755e58f9a7cd6d183b`
          );
          const castData = await castResponse.json();
          
          setMovieImages({
            cast: castData.cast
              .filter((member: any) => member.profile_path)
              .slice(0, 6)
              .map((member: any) => getImageUrl(member.profile_path, 'w185')),
            stills: imagesData.backdrops
              .slice(0, 6)
              .map((image: any) => getImageUrl(image.file_path, 'w780'))
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

    fetchMovieDetails();
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
        <Link to="/"><button>Return to Home</button></Link>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.backdrop || movie.poster})`,
          }}
        />
        
        <div className="absolute inset-0 bg-hero-gradient" />
        
        <div className="cinema-container relative h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-40 md:w-60 rounded-lg overflow-hidden shadow-xl hidden md:block">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-auto" 
              />
            </div>
            
            <MovieInfo
              movie={movie}
              onWatchMovie={handleWatchMovie}
              onWatchTrailer={handleWatchTrailer}
            />
          </div>
        </div>
      </div>
      
      <div className="cinema-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-medium mb-4">Synopsis</h2>
            <p className="text-cinema-gray mb-8">
              {movie.overview}
            </p>
            
            <MovieCast
              cast={movie.cast}
              director={movie.director}
              castImages={movieImages.cast}
            />

            <MovieImages stills={movieImages.stills} />
          </div>
          
          <div>
            <MovieSidebar movie={movie} onWatchMovie={handleWatchMovie} />
          </div>
        </div>
      </div>
      
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
