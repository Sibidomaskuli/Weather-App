// Steps to display the current date
let now = new Date();

let date = document.querySelector("#current-date");

let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Friday", "Saturday"];

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

// Timestamp

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

// Display the weather condions of city-input

function displayWeather(response) {
  console.log(response.data);
  // console.log(response.data.sys.country);
  let displayTemp = document.querySelector(".temperature");
  displayTemp.innerHTML = Math.round(response.data.main.temp);

  let description = document.querySelector(".description");
  description.innerHTML = `${response.data.weather[0].description}`;

  let displayCity = document.querySelector("#city-display");
  displayCity.innerHTML = `${response.data.name}, ${response.data.sys.country}`;

  let feelsLike = document.querySelector("#feels-like");
  feelsLike.innerHTML = `${Math.round(response.data.main.feels_like)}°C`;

  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `${Math.round(response.data.wind.speed * 3.6)}km/h`;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${response.data.main.humidity}%`;

  let maxTemp = document.querySelector("#max-temp");
  maxTemp.innerHTML = `${Math.round(response.data.main.temp_max)}°C`;

  let minTemp = document.querySelector("#min-temp");
  minTemp.innerHTML = `${Math.round(response.data.main.temp_min)}°C`;

  let visibility = document.querySelector("#visibility");
  visibility.innerHTML = `${response.data.visibility / 1000}km`;

  let timezone = response.data.timezone * 1000;
  let utcSunrise = response.data.sys.sunrise * 1000;
  let utcSunset = response.data.sys.sunset * 1000;
  let localSunrise = utcSunrise + timezone;
  let localSunset = utcSunset + timezone;

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
}

// city on load
function cityOnload(cityInput) {
  let apiEndPoint = `https://api.openweathermap.org/data/2.5/weather`;
  let apiKey = "fc0a1c92e0473f3c314dae218cdd219d";
  let unit = "metric";
  let apiUrl = `${apiEndPoint}?q=${cityInput}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayWeather);
}

// typed in city name
function handleCitySubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input").value;
  cityOnload(cityInput);
}

let searchBar = document.querySelector("#search-form");
searchBar.addEventListener("submit", handleCitySubmit);

cityOnload("Mississauga");
