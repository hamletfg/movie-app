// TMDB API key
const API_KEY = "ecb4a172095ca019b424c1f14bb27d25";

// Constants (variables)
const popularMoviesContainer = document.getElementById("popular-movies");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const savedMoviesBtn = document.getElementById("saved-movies-btn");
const savedMoviesPage = document.getElementById("saved-movies-page");
const backBtn = document.getElementById("back-btn");
const savedMoviesGrid = document.getElementById("saved-movies-grid");

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

// Render Functions

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
    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
    const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`;

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

function renderDetailsPage(movie, trailer) {
  const modal = document.getElementById("details-modal");
  const container = document.getElementById("details-container");
  const ratingInput = document.getElementById("rating");
  const commentInput = document.getElementById("comment");
  const closeButton = document.querySelector(".close");
  const saveForm = document.getElementById("save-form");

  // Reset form fields
  ratingInput.value = "";
  commentInput.value = "";

  // Populate details
  container.innerHTML = `
    <h2>${movie.title}</h2>
    <p>${movie.overview}</p>
    <p>⭐ ${movie.vote_average}/10 (${movie.vote_count} votes)</p>
    ${
      trailer
        ? `
      <iframe width="560" height="315"
        src="https://www.youtube.com/embed/${trailer.key}"
        frameborder="0"
        allowfullscreen>
      </iframe>
      `
        : "<p>No trailer available 😢</p>"
    }
  `;

  // Show modal
  modal.classList.remove("hidden");

  // Close modal when X is clicked
  closeButton.onclick = () => {
    modal.classList.add("hidden");
  };

  // Save form handler
  saveForm.onsubmit = (e) => {
    e.preventDefault();
    const savedMovie = {
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path,
      rating: ratingInput.value,
      comment: commentInput.value,
    };
    saveToLocalStorage(savedMovie);
    alert("Movie saved!");
  };
}

// Utility function
function saveToLocalStorage(movie) {
  const savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || [];
  savedMovies.push(movie);
  localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
}

// Saved Movies Renderer
function renderSavedMovies() {
  const savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || [];
  savedMoviesGrid.innerHTML = savedMovies
    .map(
      (movie) => `
      <div class="movie-card">
        <img src="https://image.tmdb.org/t/p/w200${movie.poster}"
          alt="${movie.title} Poster">
        <h3>${movie.title}</h3>
        <p>⭐ ${movie.rating}/10</p>
        <p>💬 ${movie.comment || "No comment"}</p>
      </div>
      `
    )
    .join("");
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

// Show Saved Movies Page
savedMoviesBtn.addEventListener("click", () => {
  document.querySelector(".container").classList.add("hidden");
  savedMoviesPage.classList.remove("hidden");
  renderSavedMovies();
});

//Return to Search Page
backBtn.addEventListener("click", () => {
  savedMoviesPage.classList.add("hidden");
  document.querySelector(".container").classList.remove("hidden");
});
