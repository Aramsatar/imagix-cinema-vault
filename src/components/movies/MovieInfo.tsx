
import { Movie } from '@/services/movieService';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieInfoProps {
  movie: Movie;
  onWatchMovie: () => void;
  onWatchTrailer: () => void;
}

const MovieInfo = ({ movie, onWatchMovie, onWatchTrailer }: MovieInfoProps) => {
  return (
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
          onClick={onWatchMovie}
        >
          Watch Now
        </Button>
        
        <button 
          className="trailer-button group" 
          onClick={onWatchTrailer}
        >
          <div className="h-10 w-10 rounded-full bg-muted/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-cinema-red/20 transition-colors">
            <Play size={18} className="ml-0.5" />
          </div>
          <span>Watch Trailer</span>
        </button>
      </div>
    </div>
  );
};

export default MovieInfo;
