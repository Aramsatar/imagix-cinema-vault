
import { Card } from '@/components/ui/card';

interface MovieCastProps {
  cast?: string[];
  director?: string;
  castImages: string[];
}

const MovieCast = ({ cast, director, castImages }: MovieCastProps) => {
  return (
    <>
      <h2 className="text-2xl font-medium mb-4">Cast & Crew</h2>
      <div className="mb-8">
        {director && (
          <div className="mb-4">
            <h3 className="text-lg font-medium">Director</h3>
            <p className="text-cinema-gray">{director}</p>
          </div>
        )}
        
        {cast && cast.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Cast</h3>
            <div className="flex flex-wrap gap-2">
              {cast.map((actor, index) => (
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

      <h2 className="text-2xl font-medium mb-4">Cast</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        {castImages.map((imageUrl, index) => (
          <Card key={index} className="overflow-hidden">
            <img
              src={imageUrl}
              alt={`Cast member ${index + 1}`}
              className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-300"
            />
          </Card>
        ))}
      </div>
    </>
  );
};

export default MovieCast;
