
import { useState, useEffect } from 'react';
import { Movie, getMovies } from '@/services/movieService';
import MovieCard from '../movies/MovieCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MovieSectionProps {
  title: string;
  category: 'now_playing' | 'coming_soon';
}

const formatOptions = ['All', '2D', '3D', 'IMAX', 'IMAX 3D'];

const MovieSection = ({ title, category }: MovieSectionProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const moviesPerPage = 4;

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await getMovies(category, selectedFormat);
        setMovies(data);
        setCurrentPage(0); // Reset to first page when changing format
      } catch (error) {
        console.error(`Failed to fetch ${category} movies:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category, selectedFormat]);

  // Calculate pagination
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const start = currentPage * moviesPerPage;
  const displayedMovies = movies.slice(start, start + moviesPerPage);

  return (
    <section className="cinema-section">
      <div className="cinema-container">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="section-title">{title}</h2>
          
          {/* Format tabs */}
          <div className="flex overflow-x-auto pb-2 mt-3 md:mt-0">
            {formatOptions.map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={cn(
                  'format-tab',
                  selectedFormat === format && 'active'
                )}
              >
                {format}
              </button>
            ))}
          </div>
        </div>
        
        {/* Movies grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="movie-card animate-pulse">
                <div className="aspect-[2/3] bg-muted rounded-lg"></div>
                <div className="p-3">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-cinema-gray">No movies available for this format.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 stagger-animation">
              {displayedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} className="opacity-0 animate-fade-in" />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={cn(
                      'pagination-dot',
                      currentPage === index && 'active'
                    )}
                    aria-label={`Page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MovieSection;
