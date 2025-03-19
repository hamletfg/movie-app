// app.js
const API_KEY = "ecb4a172095ca019b424c1f14bb27d25";
const popularMoviesContainer = document.getElementById("popular-movies");

async function fetchAndRenderMovies() {
  try {
    // Show loading while movies populate
    popularMoviesContainer.innerHTML =
      '<p class="loading">Loading movies... 🍿</p>';

    // Fetch popular movies
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
    const data = await response.json();

    // Clear mock cards (if any)
    popularMoviesContainer.innerHTML = "";

    // Create movie cards
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
      popularMoviesContainer.appendChild(movieCard);
    });
  } catch (error) {
    console.error("🚨 Error fetching movies:", error);
    popularMoviesContainer.innerHTML = `<p>Oops! Failed to load movies. Please try again later.</p>`;
  }
}

// Run on page load
window.onload = fetchAndRenderMovies;
