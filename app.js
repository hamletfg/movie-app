// TMDB API key
const API_KEY = "ecb4a172095ca019b424c1f14bb27d25";

// Constants (variables)
const popularMoviesContainer = document.getElementById("popular-movies");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");

// Reusable Functions
async function fetchMovies(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network error");
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch movies");
  }
}

// Render Function

async function handleMovieFetch(url, query = "") {
  try {
    // Show loading state
    popularMoviesContainer.innerHTML = '<p class="loading">Loading... 🍿</p>';

    // Fetch data
    const data = await fetchMovies(url);

    // Handle no results
    if (data.results.length === 0) {
      popularMoviesContainer.innerHTML = `<p>No movies found for "${query}". Try again! 🔍</p>`;
      return;
    }

    // Clear & render movies
    popularMoviesContainer.innerHTML = "";
    data.results.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.className = "movie-card";
      movieCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" 
             alt="${movie.title} Poster" 
             class="movie-poster">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.vote_average}/10</p>
      `;

      // Click handler
      movieCard.addEventListener("click", () => {
        showMovieDetails(movie.id); // Pass movie ID to fetch details
      });

      popularMoviesContainer.appendChild(movieCard);
    });
  } catch (error) {
    console.error("🚨 Error:", error);
    popularMoviesContainer.innerHTML = `<p>Oops! Something went wrong. 🛠️</p>`;
  }
}

async function showMovieDetails(movieId) {
  try {
    // Fetch movie details + videos (for treailer)
    const detailsUrl =
      "https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}";
    const videosUrl =
      "https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}";

    const [detailsResponse, videosResponse] = await Promise.all([
      fetchMovies(detailsUrl),
      fetchMovies(videosUrl),
    ]);

    const trailer = videosResponse.results.find(
      (video) => video.type === "Trailer"
    );

    // Render details page
    renderDetailsPage(detailsResponse, trailer);
  } catch (error) {
    console.error("🚨 Failed to load details:", error);
    popularMoviesContainer.innerHTML = `<p>Couldn't load details. Try again!</p>`;
  }
}

// Event Listeners
function handleSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    popularMoviesContainer.innerHTML = `<p>Please type a movie title! 🎬</p>`;
    return;
  }

  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;
  handleMovieFetch(searchUrl, query);
}

searchButton.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});

// Initial Load (Popular Movies)
window.onload = () => {
  const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
  handleMovieFetch(popularUrl);
};
