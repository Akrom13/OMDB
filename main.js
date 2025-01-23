//Элементы
const body = document.querySelector("body");
const search = document.getElementById("search");
const main = document.querySelector('.main');
const movieTitile = document.querySelectorAll('.movieTitle');
const movie = document.querySelector(".movie");
const movieImg = document.querySelector(".movieImg");
const movieDesc = document.querySelector(".movieDescription");
const similarMovies = document.querySelector(".similarMovies");
const similarCard = document.querySelectorAll(".similarCard");

//Кнопка
const themeBtn = document.querySelector("#themeChange");
const searchBtn = document.querySelector("#searchBtn")

//Слушатели событий
themeBtn.addEventListener("click", themeChange);
searchBtn.addEventListener("click", findMovie);

function themeChange() {
    body.classList.tiggle("dark")
}

async function findMovie() {
  const loader = document.querySelector(".loader");
  loader.style.display = "block";
  const data = { apikey:"aa0b9a65", t: search.value };
  const response = await sendRequest("https://www.omdbapi.com", "GET", data);
   loader.style.display = "none";
  if (response.Response === "False") {
    main.style.display = "block"
    movie.style.display = "none"
    movieTitile[0].style.display = "block"
    movieTitile[0].innerHTML = "Фильм не найден"
  } else {
    showMovies(response);
  }
}
function showMovies(data) {
  main.style.display = "block";
  movieTitile[0].style.display = "block";
  movie.style.display = "flex";
  movieImg.style.backgroundImage = `url(${data.Poster})`;
  movieTitile[0].innerHTML = data.Title;
  let params = [
    "imdbRating",
    "Year",
    "Released",
    "Genre",
    "Country",
    "Language",
    "Director",
    "Writer",
    "Actors",
  ];
  movieDesc.innerHTML = ""
  params.forEach((elem) => {
    movieDesc.innerHTML += `
                    <div class="desc">
                    <p>${elem}</p>
                    <p>${data[elem]}</p>
                    </div> `;
  });
}



async function sendRequest(url, method, data) {
    if (method == "POST") {
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
    } else if (method == "GET") {
      url = url + "?" + new URLSearchParams(data);
      let response = await fetch(url, {
        method: "GET",
      });
      response = await response.json();
      return response;
    }
  }
