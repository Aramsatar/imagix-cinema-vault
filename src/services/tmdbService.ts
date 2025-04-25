
// The Movie Database (TMDB) API service

const TMDB_API_KEY = "49f494cb35b3ea755e58f9a7cd6d183b"; // This is a public API key from the image
const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
  genre_ids?: number[];
  vote_average: number;
  overview: string;
  credits?: {
    crew: { job: string; name: string }[];
    cast: { name: string }[];
  };
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
    }[];
  };
}

export interface TMDBGenre {
  id: number;
  name: string;
}

// Cache genres to avoid repeated API calls
let genresCache: TMDBGenre[] = [];

// Helper function to make API requests
const fetchFromTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params
  });
  
  const response = await fetch(`${TMDB_API_URL}${endpoint}?${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Get full image URL with appropriate size
export const getImageUrl = (path: string | null | undefined, size: string = "w500"): string => {
  if (!path) {
    return "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&auto=format&fit=crop"; // Fallback image
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Get all genres
export const getGenres = async (): Promise<TMDBGenre[]> => {
  if (genresCache.length > 0) {
    return genresCache;
  }
  
  const data = await fetchFromTMDB("/genre/movie/list");
  genresCache = data.genres;
  return data.genres;
};

// Get movies that are now playing in theaters
export const getNowPlayingMovies = async (page: number = 1): Promise<TMDBMovie[]> => {
  const data = await fetchFromTMDB("/movie/now_playing", { language: "en-US", page: page.toString() });
  return data.results;
};

// Get upcoming movies
export const getUpcomingMovies = async (page: number = 1): Promise<TMDBMovie[]> => {
  const data = await fetchFromTMDB("/movie/upcoming", { language: "en-US", page: page.toString() });
  return data.results;
};

// Get popular movies
export const getPopularMovies = async (page: number = 1): Promise<TMDBMovie[]> => {
  const data = await fetchFromTMDB("/movie/popular", { language: "en-US", page: page.toString() });
  return data.results;
};

// Get top rated movies
export const getTopRatedMovies = async (page: number = 1): Promise<TMDBMovie[]> => {
  const data = await fetchFromTMDB("/movie/top_rated", { language: "en-US", page: page.toString() });
  return data.results;
};

// Get trending movies
export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<TMDBMovie[]> => {
  const data = await fetchFromTMDB(`/trending/movie/${timeWindow}`);
  return data.results;
};

// Get movie details by ID
export const getMovieDetails = async (id: number): Promise<TMDBMovie> => {
  const movie = await fetchFromTMDB(`/movie/${id}`, {
    append_to_response: "credits,videos",
    language: "en-US"
  });
  return movie;
};

// Search for movies
export const searchMovies = async (query: string, page: number = 1): Promise<TMDBMovie[]> => {
  if (!query) return [];
  
  const data = await fetchFromTMDB("/search/movie", {
    query,
    language: "en-US",
    page: page.toString()
  });
  
  return data.results;
};

// Get similar movies
export const getSimilarMovies = async (movieId: number): Promise<TMDBMovie[]> => {
  const data = await fetchFromTMDB(`/movie/${movieId}/similar`);
  return data.results;
};

// Get recommendations
export const getRecommendations = async (movieId: number): Promise<TMDBMovie[]> => {
  const data = await fetchFromTMDB(`/movie/${movieId}/recommendations`);
  return data.results;
};
