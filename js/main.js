
// Элементы
const body = document.querySelector("body");
const search = document.getElementById("search");
const main = document.querySelector(".main");
const movieTitle = document.querySelectorAll(".movieTitle");
const movie = document.querySelector(".movie");
const movieImg = document.querySelector(".movieImg");
const movieDesk = document.querySelector(".movieDescription");
const similarMovies = document.querySelector(".similarMovies");

// Кнопки
const themeBtn = document.querySelector("#themeChange");
const searchBtn = document.querySelector("#searchBtn");

// Слушатели событий
if (themeBtn) {
  themeBtn.addEventListener("click", themeChange);
}
if (searchBtn) {
  searchBtn.addEventListener("click", findMovie);
}
window.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    findMovie();
  }
});

function themeChange() {
  body.classList.toggle("dark");
}

async function findMovie() {
  const loader = document.querySelector(".loader");
  loader.style.display = "block";
  const data = { apikey: "aa0b9a65", t: search.value };
  const response = await sendRequest("https://www.omdbapi.com", "GET", data);
  loader.style.display = "none";
  if (response.Response === "False") {
    main.style.display = "block";
    movie.style.display = "none";
    movieTitle[0].style.display = "block";
    movieTitle[0].innerHTML = "Фильм не найден";
  } else {
    showMovie(response);
    findSimilarMovies();
  }
}

function showMovie(data) {
  main.style.display = "block";
  movieTitle[0].style.display = "block";
  movie.style.display = "flex";
  movieImg.style.backgroundImage = `url(${data.Poster})`;
  movieTitle[0].innerHTML = data.Title;
  
  let params = ["imdbRating", "Year", "Released", "Genre", "Country", "Language", "Director", "Writer", "Actors"];
  movieDesk.innerHTML = "";
  params.forEach((elem) => {
    movieDesk.innerHTML += `
      <div class="desk">
        <p>${elem}</p>
        <p>${data[elem]}</p>
      </div>`;
  });
}

async function findSimilarMovies() {
  const data = { apikey: "aa0b9a65", s: search.value };
  const response = await sendRequest("https://www.omdbapi.com", "GET", data);
  if (!response.Search) return;
  movieTitle[1].style.display = "block";
  movieTitle[1].innerHTML = `Найдено похожих фильмов: ${response.Search.length}`;
  showSimilarMovies(response.Search);
}

function showSimilarMovies(movies) {
  similarMovies.style.display = "grid";
  similarMovies.innerHTML = "";
  movies.forEach((movie) => {
    if (movie.Poster !== "N/A") {
      let similarMovie = `
        <div class="similarCard" style="background-image: url(${movie.Poster})">
          <div class="similar" onclick="addSaved(event)"
          data-poster="${movie.Poster}"  
          data-title="${movie.Title}" 
          data-imdbID="${movie.imdbID}"></div>
          <p>${movie.Title}</p>
        </div>`;
      similarMovies.innerHTML += similarMovie;
    }
  });
}

function addSaved(event) {
  const target = event.currentTarget;
  const movieData = {
    title: target.getAttribute("data-title"),
    poster: target.getAttribute("data-poster"),
    imdbID: target.getAttribute("data-imdbID"),
  };

  let favs = JSON.parse(localStorage.getItem("favs")) || [];
  let movieIndex = favs.findIndex((movie) => movie.imdbID === movieData.imdbID);
  
  if (movieIndex > -1) {
    favs.splice(movieIndex, 1);
    target.classList.remove("star");
  } else {
    favs.push(movieData);
    target.classList.add("star");
  }

  localStorage.setItem("favs", JSON.stringify(favs));
    showFavorites();
}

function showFavorites() {
  const favoritesContainer = document.querySelector(".favoritesContainer");
  if (!favoritesContainer) return console.error("Ошибка: Контейнер избранного не найден!");

  const favorites = JSON.parse(localStorage.getItem("favs")) || [];
  favoritesContainer.innerHTML = favorites.length
    ? ""
    : "<p>Нет избранных фильмов</p>";

  favorites.forEach(({ title, poster, imdbID }) => {
    favoritesContainer.innerHTML += `
      <div class="similarCard" style="background-image: url(${poster})">
        <div class="similar star" data-title="${title}" data-poster="${poster}" data-imdbID="${imdbID}" onclick="addSaved(event)"></div>
        <p>${title}</p>
      </div>`;
  });

  console.log("Фильмы успешно добавлены в избранное.");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("favoritesPage")) {
    console.log("Запускаем showFavorites()");
    showFavorites();
  }
});

async function sendRequest(url, method, data) {
  if (method === "POST") {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    response = await response.json();
    return response;
  } else if (method === "GET") {
    url = url + "?" + new URLSearchParams(data);
    let response = await fetch(url, {
      method: "GET",
    });
    response = await response.json();
    return response;
  }
}


