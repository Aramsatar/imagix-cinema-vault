
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Movie, getMoviesBySearch } from '@/services/movieService';
import PageLayout from '@/components/layout/PageLayout';
import MovieCard from '@/components/movies/MovieCard';
import { Loader2, Search } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        if (query) {
          const results = await getMoviesBySearch(query);
          setMovies(results);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error('Failed to search movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  return (
    <PageLayout>
      <div className="cinema-container py-12">
        <h1 className="text-3xl font-bold mb-6">
          Search Results: <span className="text-cinema-red">{query}</span>
        </h1>
        
        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="h-8 w-8 animate-spin text-cinema-red" />
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="mx-auto h-16 w-16 text-muted mb-4" />
            <h2 className="text-xl font-medium mb-2">No results found</h2>
            <p className="text-cinema-gray">
              We couldn't find any movies matching "{query}".
              <br />
              Try a different search term or browse our categories.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SearchResults;
