let now = new Date();
let h1 = document.querySelector("h1");

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

let hours = now.getHours();
let minutes = now.getMinutes();

h1.innerHTML = `${day} <br />${hours}:${minutes}`;
if (minutes < 10) {
  h1.innerHTML = `${day} <br />${hours}:0${minutes}`;
}
if (hours < 10) {
  h1.innerHTML = `${day} <br />0${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast-container");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col-2">
        <div class="forecast-day">${formatDay(forecastDay.time)}</div>
          <img 
              src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                forecastDay.condition.icon
              }.png"
              id="forecast-icon"
              class="forecast-icon"
              alt="${forecastDay.condition.icon}"
              width="60px"
          />
            <div class="forecast-temperatures"> 
             <span class="forecast-max-temp">${Math.round(
               forecastDay.temperature.maximum
             )} °C</span>
             <br />
             <span class="forecast-min-temp">${Math.round(
               forecastDay.temperature.minimum
             )} °C</span>
            </div>
      </div>
    `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(position) {
  let city = position;

  let apiKey = "e1c36520c14f56fa74b8fob3tcc313d4";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function updateWeather(response) {
  let temperature = Math.round(response.data.main.temp);
  let cityTemperature = document.querySelector(".temperature-value");
  cityTemperature.innerHTML = `${temperature}`;

  let newCity = document.querySelector(".city-name");
  newCity.innerHTML = response.data.name;

  let weatherDescription = response.data.weather[0].description;
  let description = document.querySelector(".description");
  description.innerHTML = `${weatherDescription}`;

  let humidity = response.data.main.humidity;
  let cityHumidity = document.querySelector(".humidity");
  cityHumidity.innerHTML = `${humidity}`;

  let high = Math.round(response.data.main.temp_max);
  let maxTemp = document.querySelector(".max");
  maxTemp.innerHTML = `${high}`;

  let low = Math.round(response.data.main.temp_min);
  let minTemp = document.querySelector(".min");
  minTemp.innerHTML = `${low}`;

  let wind = Math.round(response.data.wind.speed);
  let windCity = document.querySelector(".wind");
  windCity.innerHTML = `${wind}`;

  let feelsLike = Math.round(response.data.main.feels_like);
  let feelsLikeCity = document.querySelector(".feels-like");
  feelsLikeCity.innerHTML = `${feelsLike}`;

  celsiusTemp = response.data.main.temp;

  getForecast(response.data.name);
}

function showMyPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiKey = "667d9f573c8af4c33457be5d561a9148";
  let apiLink = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiLink}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios
    .get(apiUrl)
    .then(updateWeather)
    .catch((error) => {
      alert(`This location could not be found`);
    });
}

function myLocationButt(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showMyPosition);
}

let positionButton = document.querySelector(".location");
positionButton.addEventListener("click", myLocationButt);

function changeLocation(event) {
  event.preventDefault();

  let locationInput = document.querySelector(".location-form");
  let city = locationInput.value;

  let apiKey = "667d9f573c8af4c33457be5d561a9148";
  let apiLink = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiLink}?q=${city}&appid=${apiKey}&units=metric`;
  axios
    .get(apiUrl)
    .then(updateWeather)
    .catch((error) => {
      alert(`This location could not be found`);
    });
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", changeLocation);

function updateIcon(response) {
  let iconWeather = document.querySelector("#weather-icon");
  iconWeather.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
}

function selectIcon(event) {
  event.preventDefault();

  let locationInput = document.querySelector(".location-form");
  let city = locationInput.value;

  let apiKey = "e1c36520c14f56fa74b8fob3tcc313d4";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateIcon);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", selectIcon);
