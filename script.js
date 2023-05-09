var apiKey = "eb5cff2c542e454a13fb9d52a2a5c3ca";

// Use the endpoint api.openweathermap.org for the API calls.
// Example of API call: api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=eb5cff2c542e454a13fb9d52a2a5c3ca

var searchButtonEl = document.querySelector("#searchButton");
var cityNameEl = document.querySelector("#city-name");

function readCitiesFromStorage() {
  var cities = localStorage.getItem("cities");
  if (cities) {
    cities = JSON.parse(cities);
  } else {
    cities = [];
  }
  console.log(cities);
  return cities;
}

function saveCitiesToStorage(cities) {
  localStorage.setItem("cities", JSON.stringify(cities));
}

function addCitiesToPage() {
 
  var cities = readCitiesFromStorage();

  for (var i = 0; i < cities.length; i++) {
    var newCity = cities[i];
    var containerDiv = document.createElement('div')
    searchHistoryDiv.appendChild(containerDiv);    
    var breakDiv = document.createElement('div')
    breakDiv.innerHTML = '<br />'
    containerDiv.append(breakDiv);
    var newCityDiv = document.createElement("a");
    newCityDiv.href = "index.html?q=" + newCity + "&APPID=" + apiKey;
    newCityDiv.textContent = newCity;    
    containerDiv.append(newCityDiv);
  }
}

searchButtonEl.addEventListener("click", getCityName);

function getCityName(event) {
  event.preventDefault();

// TO-DO: REMOVE THE EXISTING LIST CONTENT BEFORE DISPLAYING UPDATED LIST

  var cityName = document.querySelector("#city-name").value.trim();
  console.log(cityName);

  if (!cityName) {
    console.error("You must enter a search term!");
    return;
  }
  var cities = readCitiesFromStorage();
  cities.unshift(cityName);
  saveCitiesToStorage(cities);
  searchHistoryDiv.innerHTML = '';
    addCitiesToPage();

    var apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&APPID=${apiKey}&units=imperial`;
    console.log(apiUrlCurrent);
    fetch(apiUrlCurrent)
    .then(function (response) {
      response.json()
      .then(function (data) {
        console.log(data);
        var cityLatitude = data.coord.lat;
        var cityLongitude = data.coord.lon;
        var apiUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLatitude}&lon=${cityLongitude}&appid=${apiKey}&units=imperial`;
        console.log(apiUrlFiveDay);
  
        fetch(apiUrlFiveDay)
        .then(function (response) {
            response.json()
            .then(function (predictions) {
              console.log(predictions.list);
              displayFiveDayForecast(predictions.list);
            });
          });

          displayCurrentWeather(data);
            
      
    });
  });
}


function displayCurrentWeather(data) {
  var today = dayjs().format("M/D/YYYY");

  weatherDisplayDiv.innerHTML = '';

  var currentWeatherDiv = document.createElement("div");
  currentWeatherDiv.setAttribute("class", "card mb-3 p-3");
  currentWeatherDiv.setAttribute('id', 'currentWeatherDisplay');
  weatherDisplayDiv.append(currentWeatherDiv);

  var cityDisplayTitle = document.createElement("h3");
  cityDisplayTitle.textContent = data.name + " (" + today + ")";
  currentWeatherDiv.appendChild(cityDisplayTitle);

  var weatherIcon = document.createElement("img");
  weatherIcon.classList.add("col-1");
  var weatherIconVal = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${weatherIconVal}.png`;
  currentWeatherDiv.appendChild(weatherIcon);

  // I found the character combo for the degrees symbol at Javascripter.net
  var currentTemperature = document.createElement("p");
  currentTemperature.textContent =
    "Current temp: " + Math.floor(data.main.temp) + "\xB0 F";
  currentWeatherDiv.appendChild(currentTemperature);

  var windSpeed = document.createElement("p");
  windSpeed.textContent = "Wind speed: " + Math.ceil(data.wind.speed) + " mph";
  currentWeatherDiv.appendChild(windSpeed);

  var humidityLevel = document.createElement("p");
  humidityLevel.textContent = "Humidity: " + data.main.humidity + "%";
  currentWeatherDiv.appendChild(humidityLevel);
}

function displayFiveDayForecast(predictions) {
    fiveDayForecastDiv.innerHTML = '';

    if (predictions.length === 0) {
    return;
  }
  // do a for loop that increases by 1 to create the overall containers and the divs that will display the dates.
  // below that, you'll create the other elements and set their attributes
  var forecastDayOne = dayjs().add(1, "day").format("M/D/YYYY");
  var forecastDayTwo = dayjs().add(2, "day").format("M/D/YYYY");
  var forecastDayThree = dayjs().add(3, "day").format("M/D/YYYY");
  var forecastDayFour = dayjs().add(4, "day").format("M/D/YYYY");
  var forecastDayFive = dayjs().add(5, "day").format("M/D/YYYY");

  var extendedForecastDays = [
    forecastDayOne,
    forecastDayTwo,
    forecastDayThree,
    forecastDayFour,
    forecastDayFive,
  ];

  fiveDayForecastTitle = document.createElement("h3");
  fiveDayForecastTitle.textContent = "Five-Day Forecast";
  fiveDayForecastDiv.append(fiveDayForecastTitle);

  for (var i = 0, j = 7; i < 5; i++, j += 8) {
    var fiveDayForecastCard = document.createElement("div");
    fiveDayForecastCard.setAttribute("class", "card col-6 col-md-2 p-2");
    fiveDayForecastDiv.append(fiveDayForecastCard);

    var forecastDateField = document.createElement("h5");
    forecastDateField.textContent = extendedForecastDays[i];
    fiveDayForecastCard.appendChild(forecastDateField);

    var forecastWeatherIcon = document.createElement("img");
    forecastWeatherIcon.classList.add("col-3");
    var forecastWeatherIconVal = predictions[j].weather[0].icon;
    console.log(forecastWeatherIconVal);
    forecastWeatherIcon.src = `https://openweathermap.org/img/wn/${forecastWeatherIconVal}.png`;
    fiveDayForecastCard.appendChild(forecastWeatherIcon);

    var currentTemperature = document.createElement("p");
    currentTemperature.textContent =
      Math.ceil(predictions[j].main.temp_max) + "\xB0 F";
    fiveDayForecastCard.appendChild(currentTemperature);

    var windSpeed = document.createElement("p");
    windSpeed.textContent =
      "Wind speed: " + Math.ceil(predictions[j].wind.speed) + " mph";
    fiveDayForecastCard.appendChild(windSpeed);

    var humidityLevel = document.createElement("p");
    humidityLevel.textContent =
      "Humidity: " + predictions[j].main.humidity + "%";
    fiveDayForecastCard.appendChild(humidityLevel);
  }
}
addCitiesToPage();
