// Steps to display the current date
let now = new Date();

let date = document.querySelector("#current-date");

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
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let currentDate = `${day} ${hour}:${minutes}`;
if (hour < 4 || hour > 21) {
  document.querySelector("#stars").classList.add("stars");
  document.querySelector(".container").classList.add("nightBackground");
} else {
  document.querySelector(".container").classList.add("dayBackground");
}
date.innerHTML = currentDate;

// Setting the geolocation button

function getCoords(response) {
  let lat = response.coords.latitude;
  let lon = response.coords.longitude;
  let apiEndPoint = `https://api.openweathermap.org/data/2.5/weather`;
  let apiKey = "fc0a1c92e0473f3c314dae218cdd219d";
  let unit = "metric";
  let apiUrl = `${apiEndPoint}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayWeather);
}

function geolocationInput(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCoords);
}

let geolocationButton = document.querySelector("#geolocation");
geolocationButton.addEventListener("click", geolocationInput);

// Timestamp conversion

function formatHours(timestamp) {
  let time = new Date(timestamp);
  let hours = time.getUTCHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = time.getUTCMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

// Day timestamp
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];

  return day;
}

// Display forecast HTML

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 5) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col-3">
            <span id="forecast-day"><strong>${formatDay(
              forecastDay.dt
            )}</strong></span>
            <br />
            <img
            src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"
            alt="icon"
            class="forecastIcon"
            id="forecast-icon"
            />
            <br />
            <span class="forecastDescription">${
              forecastDay.weather[0].main
            }</span>
            <br />
            <span id="forecastTempHigh"><strong>${Math.round(
              forecastDay.temp.max
            )}°</strong></span>
            <span class="light" id="forecastTempLow"> <strong>${Math.round(
              forecastDay.temp.min
            )}°</strong></span>
        </div>
      `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}
// Forecast API
function getForecast(coord) {
  let apiKey = "fc0a1c92e0473f3c314dae218cdd219d";
  let apiEndPoint = `https://api.openweathermap.org/data/2.5/onecall`;
  let unit = "metric";
  let apiUrl = `${apiEndPoint}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayForecast);
}

// Display the weather condions of city-input

function displayWeather(response) {
  let displayTemp = document.querySelector(".temperature");
  displayTemp.innerHTML = Math.round(response.data.main.temp);

  let pressure = document.querySelector("#pressure");
  pressure.innerHTML = `${response.data.main.pressure}`;

  let description = document.querySelector(".description");
  description.innerHTML = `${response.data.weather[0].description}`;

  let displayCity = document.querySelector("#city-display");
  displayCity.innerHTML = `${response.data.name}, ${response.data.sys.country}`;

  let feelsLike = document.querySelector("#feels-like");
  feelsLike.innerHTML = `${Math.round(response.data.main.feels_like)}°`;

  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `${Math.round(response.data.wind.speed * 3.6)}km/h`;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${response.data.main.humidity}%`;

  let maxTemp = document.querySelector("#max-temp");
  maxTemp.innerHTML = `${Math.round(response.data.main.temp_max)}°`;

  let minTemp = document.querySelector("#min-temp");
  minTemp.innerHTML = `${Math.round(response.data.main.temp_min)}°`;

  let visibility = document.querySelector("#visibility");
  visibility.innerHTML = `${(response.data.visibility / 1000).toFixed(1)}km`;

  let timezoneShift = response.data.timezone * 1000;
  let utcSunrise = response.data.sys.sunrise * 1000;
  let utcSunset = response.data.sys.sunset * 1000;
  let localSunrise = utcSunrise + timezoneShift;
  let localSunset = utcSunset + timezoneShift;

  document.querySelector("#sunrise-time").innerHTML = `${formatHours(
    localSunrise
  )}`;
  document.querySelector("#sunset-time").innerHTML = `${formatHours(
    localSunset
  )}`;

  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  getForecast(response.data.coord);
}

// Current Weather API
function cityOnload(cityInput) {
  let apiEndPoint = `https://api.openweathermap.org/data/2.5/weather`;
  let apiKey = "fc0a1c92e0473f3c314dae218cdd219d";
  let unit = "metric";
  let apiUrl = `${apiEndPoint}?q=${cityInput}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayWeather);
}

function handleCitySubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input").value;
  cityOnload(cityInput);
}

let searchBar = document.querySelector("#search-form");
searchBar.addEventListener("submit", handleCitySubmit);

cityOnload("Mississauga");
