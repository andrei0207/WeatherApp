import countries from "./countries.json" assert { type: "json" };

const APIKey = "ad51f3832e4ca6662ba6291f38d0d51b";
const units = "metric";
const baseUrl = "https://api.openweathermap.org";

const weatherContainer = document.querySelector(".container");
const form = document.getElementById("form-search");
const weatherImg = document.querySelector(".w-img");
const weatherInput = document.querySelector(".w-search-input");
const weatherName = document.querySelector(".w-name");
const weatherDescription = document.querySelector(".w-desc");
const location = document.querySelector(".w-title h3");
const temp = document.querySelector(".w-title h5");
const humidity = document.querySelector(".w-details .w-humid span");
const cloudiness = document.querySelector(".w-details .w-cloud span");
const sunrise = document.querySelector(".w-details .w-sunrise span");
const sunset = document.querySelector(".w-details .w-sunset span");

// const london = _.find(countries, (country) => {
//   return country.name === "Philippines";
// });

const sanitize = function (str) {
  return str.trim().replace(/[^\w\s]/gi, "");
}; 

async function getLatLong() {
  const input = sanitize(weatherInput.value) || "New York";

  try {
    const response = await fetch(
      `${baseUrl}/geo/1.0/direct?q=${input}&limit=1&appid=${APIKey}`
    );
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error("Unable to fetch geocode API.");
    }
    if (data.length === 0) {
      return;
    }
    return data[0];
  } catch (err) {
    console.log(err);
    return;
  }
} 

async function getWeather(e) {
  if (e) {
    e.preventDefault();
  }
  try {
    const { lat, lon } = (await getLatLong()) || {};
    if (lat === undefined || lon === undefined) {
      weatherImg.src = "";
      weatherImg.alt = "";
      weatherName.textContent = "Location Not Found";
      weatherDescription.textContent = "";
      location.textContent = "N/A";
      temp.textContent = "";
      humidity.textContent = "N/A";
      cloudiness.textContent = "N/A";
      sunrise.textContent = "N/A";
      sunset.textContent = "N/A";
      return;
    }

    const response = await fetch(
      `${baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${APIKey}`
    );
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error("Unable to fetch Weather API.");
    }

    let weather = null;

    switch (data.weather[0].main) {
      case "Clouds":
        weatherImg.src = "images/cloud.png";
        weather = "Cloudy";
        break;
      case "Thunderstorm":
        weatherImg.src = "images/thunderstorm.png";
        weather = "Thunderstorms";
        break;
      case "Rain":
        weatherImg.src = "images/rain.png";
        weather = "Rainy";
        break;
      case "Snow":
        weatherImg.src = "images/snow.png";
        weather = "Snow";
        break;
      case "Mist":
        weatherImg.src = "images/mist.png";
        weather = "Mist";
        break;
      case "Clear":
        weatherImg.src = "images/clear.png";
        weather = "Clear Sky";
        break;

      default:
        weatherImg.src = "";
    }

    weatherImg.alt = weather;
    weatherName.textContent = weather;

    location.textContent = `${DOMPurify.sanitize(
      data.name
    )} (${DOMPurify.sanitize(data.sys.country)})`;

    temp.innerHTML = `${DOMPurify.sanitize(data.main.temp)} <span>°C</span>`;

    humidity.textContent = `Humidity: ${DOMPurify.sanitize(
      data.main.humidity
    )}%`;

    cloudiness.textContent = `Cloudiness: ${DOMPurify.sanitize(
      data.clouds.all
    )}%`;

    sunrise.textContent = `Sunrise: ${moment(data.sys.sunrise).format(
      "hh:mm A"
    )}`;

    sunset.textContent = `Sunset: ${moment(data.sys.sunset).format("hh:mm A")}`;

    weatherDescription.textContent = DOMPurify.sanitize(
      data.weather[0].description
    );
  } catch (err) {
    console.log(err);
    return;
  }
}

form.addEventListener("submit", getWeather);

function currentTime() {
  let date = new Date();
  document.querySelector("#clock span").innerText =
    moment(date).format("hh:mm:ss a");

  setTimeout(function () {
    currentTime();
  }, 1000);
}

currentTime();
getWeather();
