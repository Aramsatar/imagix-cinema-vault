
import {
  TMDBMovie,
  getNowPlayingMovies,
  getUpcomingMovies,
  getPopularMovies,
  getMovieDetails,
  getImageUrl,
  getGenres
} from './tmdbService';

export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop?: string;
  releaseDate: string;
  runtime: number;
  genres: string[];
  rating: number;
  overview: string;
  director?: string;
  cast?: string[];
  trailerUrl?: string;
  format: ('2D' | '3D' | 'IMAX' | 'IMAX 3D')[];
  category: ('now_playing' | 'coming_soon' | 'featured');
}

// Cache the movie genres for mapping genre IDs to names
let genresMap: Record<number, string> = {};

// Initialize the genres map
const initGenresMap = async () => {
  try {
    const genres = await getGenres();
    genresMap = genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {} as Record<number, string>);
  } catch (error) {
    console.error("Failed to initialize genres map:", error);
    // Fallback to empty map, will use fallback movies
  }
};

// Convert TMDB movie format to our app's movie format
const convertTMDBMovieToMovie = (tmdbMovie: TMDBMovie, category: 'now_playing' | 'coming_soon' | 'featured'): Movie => {
  // Extract genres from either genre_ids (list results) or genres (detail result)
  const movieGenres: string[] = [];
  
  if (tmdbMovie.genres) {
    // For movie details which have full genre objects
    movieGenres.push(...tmdbMovie.genres.map(g => g.name));
  } else if (tmdbMovie.genre_ids) {
    // For movie lists which only have genre IDs
    movieGenres.push(...tmdbMovie.genre_ids.map(id => genresMap[id] || "Unknown"));
  }
  
  // Extract director from credits if available
  let director: string | undefined;
  if (tmdbMovie.credits?.crew) {
    const directorInfo = tmdbMovie.credits.crew.find(person => person.job === "Director");
    if (directorInfo) {
      director = directorInfo.name;
    }
  }
  
  // Extract cast if available
  let cast: string[] | undefined;
  if (tmdbMovie.credits?.cast) {
    cast = tmdbMovie.credits.cast.slice(0, 5).map(person => person.name);
  }
  
  // Extract YouTube trailer URL if available
  let trailerUrl: string | undefined;
  if (tmdbMovie.videos?.results) {
    const trailer = tmdbMovie.videos.results.find(
      video => video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser")
    );
    if (trailer) {
      trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
    }
  }
  
  // Generate random formats (this would ideally come from a real API)
  const availableFormats: ('2D' | '3D' | 'IMAX' | 'IMAX 3D')[] = ['2D'];
  if (Math.random() > 0.5) availableFormats.push('3D');
  if (Math.random() > 0.7) availableFormats.push('IMAX');
  if (Math.random() > 0.9 && availableFormats.includes('3D')) availableFormats.push('IMAX 3D');
  
  return {
    id: String(tmdbMovie.id),
    title: tmdbMovie.title,
    poster: getImageUrl(tmdbMovie.poster_path),
    backdrop: getImageUrl(tmdbMovie.backdrop_path, "w1280"),
    releaseDate: tmdbMovie.release_date,
    runtime: tmdbMovie.runtime || Math.floor(Math.random() * (180 - 80) + 80), // Random runtime if not available
    genres: movieGenres.length > 0 ? movieGenres : ["Action", "Adventure"], // Fallback genres
    rating: tmdbMovie.vote_average,
    overview: tmdbMovie.overview,
    director,
    cast,
    trailerUrl,
    format: availableFormats,
    category
  };
};

// Initialize the service by loading genres
initGenresMap();

// Fallback to sample movies if API fails
const sampleMovies: Movie[] = [
  {
    id: "1",
    title: "Venom: The Last Dance",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop",
    releaseDate: "2025-05-15",
    runtime: 125,
    genres: ["Action", "Sci-Fi", "Thriller"],
    rating: 8.2,
    overview: "In this thrilling conclusion to the Venom trilogy, Eddie Brock and Venom face their most formidable challenge yet as they encounter a new symbiote threat that could destroy both of their worlds.",
    director: "Andy Serkis",
    cast: ["Tom Hardy", "Michelle Williams", "Woody Harrelson", "Naomie Harris"],
    trailerUrl: "https://www.youtube.com/watch?v=dummylink",
    format: ["2D", "3D", "IMAX", "IMAX 3D"],
    category: "featured"
  },
  {
    id: "2",
    title: "Echoes of Eternity",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop",
    releaseDate: "2025-04-10",
    runtime: 142,
    genres: ["Drama", "Sci-Fi", "Mystery"],
    rating: 7.8,
    overview: "A brilliant physicist discovers a way to communicate across multiple dimensions, only to find that altering the fabric of reality comes with unforeseen consequences.",
    director: "Denis Villeneuve",
    cast: ["Rachel McAdams", "Oscar Isaac", "Tilda Swinton"],
    trailerUrl: "https://www.youtube.com/watch?v=dummylink",
    format: ["2D", "IMAX"],
    category: "now_playing"
  },
  {
    id: "3",
    title: "Midnight Shadows",
    poster: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&auto=format&fit=crop",
    releaseDate: "2025-04-22",
    runtime: 115,
    genres: ["Horror", "Thriller", "Mystery"],
    rating: 7.5,
    overview: "A group of friends on a weekend getaway encounter a supernatural entity that only appears after sunset, forcing them to confront their deepest fears.",
    director: "Ari Aster",
    cast: ["Florence Pugh", "Jack Reynor", "Lakeith Stanfield"],
    trailerUrl: "https://www.youtube.com/watch?v=dummylink",
    format: ["2D"],
    category: "now_playing"
  },
  {
    id: "4",
    title: "The Lost Expedition",
    poster: "https://images.unsplash.com/photo-1518909418078-96be7a1d6ead?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1200&auto=format&fit=crop",
    releaseDate: "2025-04-28",
    runtime: 135,
    genres: ["Adventure", "Action", "Drama"],
    rating: 8.1,
    overview: "When a renowned explorer disappears in the Amazon, his daughter assembles a team to find him, discovering a lost civilization and ancient dangers along the way.",
    director: "Kathryn Bigelow",
    cast: ["Charlize Theron", "Daniel Kaluuya", "Pedro Pascal"],
    trailerUrl: "https://www.youtube.com/watch?v=dummylink",
    format: ["2D", "IMAX"],
    category: "now_playing"
  },
  {
    id: "5",
    title: "Quantum Break",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop",
    releaseDate: "2025-06-15",
    runtime: 130,
    genres: ["Sci-Fi", "Action", "Thriller"],
    rating: 7.9,
    overview: "A time-travel experiment gone wrong causes reality to fracture, giving a government agent the ability to manipulate time as a shadowy organization hunts him down.",
    director: "Christopher Nolan",
    cast: ["John David Washington", "Robert Pattinson", "Elizabeth Debicki"],
    trailerUrl: "https://www.youtube.com/watch?v=dummylink",
    format: ["2D", "IMAX", "IMAX 3D"],
    category: "coming_soon"
  },
  {
    id: "6",
    title: "The Golden Hour",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop",
    releaseDate: "2025-06-30",
    runtime: 118,
    genres: ["Romance", "Drama"],
    rating: 7.3,
    overview: "Two strangers meet by chance during the golden hour of sunset in Paris, spending just one day together that will change both of their lives forever.",
    director: "Richard Linklater",
    cast: ["Zendaya", "Timothée Chalamet", "Jodie Comer"],
    trailerUrl: "https://www.youtube.com/watch?v=dummylink",
    format: ["2D"],
    category: "coming_soon"
  },
  {
    id: "7",
    title: "Nebula's Edge",
    poster: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&auto=format&fit=crop",
    releaseDate: "2025-07-12",
    runtime: 155,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    rating: 8.5,
    overview: "A deep space mining crew discovers an abandoned alien ship at the edge of a nebula, finding technology that could save humanity but awakens an ancient threat.",
    director: "James Cameron",
    cast: ["Zoe Saldana", "Sam Worthington", "Sigourney Weaver"],
    trailerUrl: "https://www.youtube.com/watch?v=dummylink",
    format: ["2D", "3D", "IMAX", "IMAX 3D"],
    category: "coming_soon"
  },
  {
    id: "8",
    title: "Whispers in the Dark",
    poster: "https://images.unsplash.com/photo-1626814026359-8cd5661a8450?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop",
    releaseDate: "2025-07-28",
    runtime: 110,
    genres: ["Horror", "Psychological", "Thriller"],
    rating: 7.7,
    overview: "A sleep researcher studying night terrors becomes the subject of her own experiment when she starts experiencing increasingly disturbing dreams that blur into reality.",
    director: "Mike Flanagan",
    cast: ["Anya Taylor-Joy", "Dev Patel", "Rebecca Hall"],
    trailerUrl: "https://www.youtube.com/watch?v=dummylink",
    format: ["2D"],
    category: "coming_soon"
  },
  {
    id: "9",
    title: "The Matrix Resurrections",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop",
    releaseDate: "2025-05-20",
    runtime: 148,
    genres: ["Action", "Sci-Fi", "Thriller"],
    rating: 8.6,
    overview: "Neo finds himself trapped once again in the simulated reality known as the Matrix, where he must confront a new enemy and rediscover who he truly is.",
    director: "Lana Wachowski",
    cast: ["Keanu Reeves", "Carrie-Anne Moss", "Yahya Abdul-Mateen II"],
    trailerUrl: "https://www.youtube.com/watch?v=dummylink",
    format: ["2D", "3D", "IMAX"],
    category: "now_playing"
  },
  {
    id: "10",
    title: "Midnight Forest",
    poster: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1200&auto=format&fit=crop",
    releaseDate: "2025-06-10",
    runtime: 115,
    genres: ["Mystery", "Thriller", "Horror"],
    rating: 7.3,
    overview: "When strange lights begin appearing in the forest near a small town, a group of friends decides to investigate, only to discover a terrifying secret that's been hidden for decades.",
    director: "M. Night Shyamalan",
    cast: ["Joseph Quinn", "Sadie Sink", "Maya Hawke"],
    trailerUrl: "https://www.youtube.com/watch?v=dummylink",
    format: ["2D"],
    category: "coming_soon"
  },
  {
    id: "11",
    title: "Cosmic Voyage",
    poster: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200&auto=format&fit=crop",
    releaseDate: "2025-05-05",
    runtime: 162,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    rating: 9.0,
    overview: "A team of astronauts embarks on humanity's most ambitious space mission yet, traveling through a mysterious wormhole in search of a new habitable planet for humanity.",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac"],
    trailerUrl: "https://www.youtube.com/watch?v=dummylink",
    format: ["2D", "IMAX", "IMAX 3D"],
    category: "now_playing"
  },
  {
    id: "12",
    title: "Desert Mirage",
    poster: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=500&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1200&auto=format&fit=crop",
    releaseDate: "2025-07-15",
    runtime: 128,
    genres: ["Action", "Adventure", "Thriller"],
    rating: 7.8,
    overview: "A treasure hunter searching for a legendary lost city in the Sahara Desert finds herself in a race against time and dangerous mercenaries who will stop at nothing to claim the treasure.",
    director: "Patty Jenkins",
    cast: ["Gal Gadot", "Idris Elba", "John David Washington"],
    trailerUrl: "https://www.youtube.com/watch?v=dummylink",
    format: ["2D", "IMAX"],
    category: "coming_soon"
  }
];

export const getMovies = async (category?: string, format?: string): Promise<Movie[]> => {
  try {
    let tmdbMovies: TMDBMovie[] = [];
    
    if (!category || category === 'featured') {
      tmdbMovies = await getPopularMovies();
    } else if (category === 'now_playing') {
      tmdbMovies = await getNowPlayingMovies();
    } else if (category === 'coming_soon') {
      tmdbMovies = await getUpcomingMovies();
    }
    
    // Convert TMDB movies to our app format
    let movies = tmdbMovies.map(movie => 
      convertTMDBMovieToMovie(movie, category as 'now_playing' | 'coming_soon' | 'featured' || 'featured')
    );
    
    // Filter by format if specified
    if (format && format !== 'All') {
      movies = movies.filter(movie => movie.format.includes(format as any));
    }
    
    return movies;
  } catch (error) {
    console.error('Failed to fetch movies from TMDB:', error);
    // Fallback to sample data
    let filtered = [...sampleMovies];
    
    if (category) {
      filtered = filtered.filter(movie => movie.category === category);
    }
    
    if (format && format !== 'All') {
      filtered = filtered.filter(movie => movie.format.includes(format as any));
    }
    
    return filtered;
  }
};

export const getMovieById = async (id: string): Promise<Movie | undefined> => {
  try {
    const tmdbMovie = await getMovieDetails(Number(id));
    return convertTMDBMovieToMovie(tmdbMovie, 'featured');
  } catch (error) {
    console.error('Failed to fetch movie details from TMDB:', error);
    // Fallback to sample data
    return sampleMovies.find(movie => movie.id === id);
  }
};

export const getFeaturedMovie = async (): Promise<Movie> => {
  try {
    const popularMovies = await getPopularMovies();
    // Use the first popular movie as featured
    if (popularMovies.length > 0) {
      const tmdbMovie = await getMovieDetails(popularMovies[0].id);
      return convertTMDBMovieToMovie(tmdbMovie, 'featured');
    }
    throw new Error('No featured movie found');
  } catch (error) {
    console.error('Failed to fetch featured movie from TMDB:', error);
    // Fallback to sample data
    const featured = sampleMovies.find(movie => movie.category === 'featured');
    return featured || sampleMovies[0];
  }
};
