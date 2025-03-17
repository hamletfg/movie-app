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
