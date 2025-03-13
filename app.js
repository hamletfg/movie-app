// app.js
const API_KEY = "ecb4a172095ca019b424c1f14bb27d25";

async function fetchAndDisplayFirstMovie() {
  try {
    // Fetch data
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
    const data = await response.json();

    // Extract first movie
    const firstMovie = data.results[0];
    const movieTitle = firstMovie.title;

    // Display it
    const movieContainer = document.getElementById("movie-container");
    movieContainer.innerHTML = `<h2>${movieTitle}</h2>`;

    console.log("🎉 Success! Your first movie is alive!");
  } catch (error) {
    console.error("🚨 API Error:", error);
    movieContainer.innerHTML = `<p>Oops! Failed to load movies.</p>`;
  }
}

// Run on page load
window.onload = fetchAndDisplayFirstMovie;

// API Test: Fetch popular movies on page load
// async function fetchPopularMovies() {
//   try {
//     // Make api call to TMDB's "popular" endpoint
//     const response = await fetch(
//       `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
//     );

//     // Convert response to JSON
//     const data = await response.json();

//     // Log results to console to see if it works
//     console.log("Popular Movies:", data.results);
//   } catch (error) {
//     console.error("Opps, API error:", error);
//   }
// }

// // Call the function when the page loads
// window.onload = fetchPopularMovies;
