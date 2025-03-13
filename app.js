// app.js
const API_KEY = "ecb4a172095ca019b424c1f14bb27d25";

// API Test: Fetch popular movies on page load
async function fetchPopularMovies() {
  try {
    // Make api call to TMDB's "popular" endpoint
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );

    // Convert response to JSON
    const data = await response.json();

    // Log results to console to see if it works
    console.log("Popular Movies:", data.results);
  } catch (error) {
    console.error("Opps, API error:", error);
  }
}

// Call the function when the page loads
window.onload = fetchPopularMovies;
