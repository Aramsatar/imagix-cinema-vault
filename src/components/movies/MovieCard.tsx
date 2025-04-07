
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Movie } from '@/services/movieService';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard = ({ movie, className }: MovieCardProps) => {
  return (
    <Link 
      to={`/movie/${movie.id}`} 
      className={cn("movie-card group", className)}
    >
      <div className="relative">
        {/* Movie poster */}
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="movie-card-image" 
          loading="lazy" 
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-cinema-overlay opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <div className="h-12 w-12 rounded-full bg-cinema-red/80 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
            <Play size={20} className="ml-0.5" />
          </div>
        </div>
        
        {/* Formats */}
        {movie.format && movie.format.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-1">
            {movie.format.map((format, index) => (
              <span 
                key={index} 
                className="text-xs font-medium px-1.5 py-0.5 rounded bg-cinema-navy/80 text-cinema-white"
              >
                {format}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Movie info */}
      <div className="p-3">
        <h3 className="font-medium text-cinema-white line-clamp-1">{movie.title}</h3>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-cinema-gray">
            {movie.runtime} min
          </span>
          
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 2).map((genre, index) => (
              <span 
                key={index} 
                className="text-xs text-cinema-gray"
              >
                {genre}{index < Math.min(movie.genres.length - 1, 1) && ', '}
              </span>
            ))}
            {movie.genres.length > 2 && (
              <span className="text-xs text-cinema-gray">...</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
