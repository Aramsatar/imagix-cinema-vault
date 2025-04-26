
import { Movie } from '@/services/movieService';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface MovieSidebarProps {
  movie: Movie;
  onWatchMovie: () => void;
}

const MovieSidebar = ({ movie, onWatchMovie }: MovieSidebarProps) => {
  return (
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
        onClick={onWatchMovie}
      >
        Watch Now
      </Button>
    </div>
  );
};

export default MovieSidebar;
