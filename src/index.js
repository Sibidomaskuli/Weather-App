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

// Display forecast HTML

function displayForecastHTML() {
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
        <div class="col-2">
            <span id="forecast-day">${day}</span>
            <br />
            <img
              src="http://openweathermap.org/img/wn/10d@2x.png"
              alt="icon"
              class="forecastIcon"
              id="forecast-icon"
            />
            <br />
            <span id="forecastTempHigh">6°</span>
            <span id="forecastTempLow"> 7°</span>
        </div>
      `;
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

// Display the weather condions of city-input

function displayWeather(response) {
  console.log(response.data);

  celciusTemp = response.data.main.temp;

  let displayTemp = document.querySelector(".temperature");
  displayTemp.innerHTML = Math.round(celciusTemp);

  let pressure = document.querySelector("#pressure");
  pressure.innerHTML = `${response.data.main.pressure}`;

  let description = document.querySelector(".description");
  description.innerHTML = `${response.data.weather[0].description}`;

  let displayCity = document.querySelector("#city-display");
  displayCity.innerHTML = `${response.data.name}, ${response.data.sys.country}`;

  feels = response.data.main.feels_like;

  let feelsLike = document.querySelector("#feels-like");
  feelsLike.innerHTML = `${Math.round(feels)}°`;

  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = `${Math.round(response.data.wind.speed * 3.6)}km/h`;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${response.data.main.humidity}%`;

  max = response.data.main.temp_max;

  let maxTemp = document.querySelector("#max-temp");
  maxTemp.innerHTML = `${Math.round(max)}°`;

  min = response.data.main.temp_min;

  let minTemp = document.querySelector("#min-temp");
  minTemp.innerHTML = `${Math.round(response.data.main.temp_min)}°`;

  let visibility = document.querySelector("#visibility");
  visibility.innerHTML = `${(response.data.visibility / 1000).toFixed(1)}km`;

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
  displayForecastHTML();
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
// Temperature conversion
function displayFahrenheitTemp(event) {
  event.preventDefault();
  let fTemp = (celciusTemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector(".temperature");
  temperatureElement.innerHTML = Math.round(fTemp);

  let feelsLikeTemp = (feels * 9) / 5 + 32;
  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = Math.round(feelsLikeTemp);

  let maxTemp = (max * 9) / 5 + 32;
  let maxElement = document.querySelector("#max-temp");
  maxElement.innerHTML = Math.round(maxTemp);

  let minTemp = (min * 9) / 5 + 32;
  let minElement = document.querySelector("#min-temp");
  minElement.innerHTML = Math.round(minTemp);

  // change the active class
  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}
function displayCelciusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".temperature");
  temperatureElement.innerHTML = Math.round(celciusTemp);

  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = Math.round(feels);

  let maxElement = document.querySelector("#max-temp");
  maxElement.innerHTML = Math.round(max);

  let minElement = document.querySelector("#min-temp");
  minElement.innerHTML = Math.round(min);

  // change the active class
  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}
// global var for temp conversion
let celciusTemp = null;
let feels = null;
let max = null;
let min = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelciusTemp);

let searchBar = document.querySelector("#search-form");
searchBar.addEventListener("submit", handleCitySubmit);

cityOnload("Mississauga");
