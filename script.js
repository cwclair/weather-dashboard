var apiKey = "eb5cff2c542e454a13fb9d52a2a5c3ca";

// Use the endpoint api.openweathermap.org for the API calls.
// Example of API call: api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=eb5cff2c542e454a13fb9d52a2a5c3ca

// global variable for the search button
var searchButtonEl = document.querySelector('#searchButton');
var searchHistoryDivEl = document.querySelector('#searchHistoryDiv');

// function that reads the stored array of cities (if there is one) and creates an empty array if nothing is in storage 
function readCitiesFromStorage() {
  var cities = localStorage.getItem('cities');
  if (cities) {
    cities = JSON.parse(cities);
  } else {
    cities = [];
  }
  console.log(cities);
  return cities;
}

// saves the array of cities to local storage 
function saveCitiesToStorage(cities) {
  localStorage.setItem('cities', JSON.stringify(cities));
}

// this calls the array back from storage, establishes an unordered list element on the left side of the page, appends the unordered list as a child to the larger search container div, then runs through the array of cities, creates list items (children elements) for each city, and displays them on the page 
function addCitiesToPage() {
 
  var cities = readCitiesFromStorage();
  var containerDiv = document.createElement('ul')
  containerDiv.setAttribute('class', 'list-unstyled')
  searchHistoryDiv.appendChild(containerDiv);    

  for (var i = 0; i < cities.length; i++) {
    var newCity = cities[i];
    var newCityDiv = document.createElement('li');
    newCityDiv.setAttribute('class', 'historyEntry mt-1 p-1')
    newCityDiv.textContent = newCity;    
    containerDiv.appendChild(newCityDiv);
  }
}

// event handler for the search button. it gets the value of the new city name from the form, adds the new cities to the cities array, saves that updated array to local storage, clears the existing search history display, displays the updated list on the page, and executes the API call for the current conditions and the extended forecast. the two display functions (current, five-day) are called here as well.
searchButtonEl.addEventListener('click', getCityName);

function getCityName(event) {
  event.preventDefault();

  var cityName = document.querySelector('#city-name').value.trim();
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
  let clearForm = document.getElementById('city-name');
    clearForm.value = "";
}

// displays the current weather conditions at the top of the right side of the page
function displayCurrentWeather(data) {
  var today = dayjs().format('M/D/YYYY');

  weatherDisplayDiv.innerHTML = '';

  var currentWeatherDiv = document.createElement('div');
  currentWeatherDiv.setAttribute('class', 'card mb-3 p-3');
  currentWeatherDiv.setAttribute('id', 'currentWeatherDisplay');
  weatherDisplayDiv.append(currentWeatherDiv);

  var cityDisplayTitle = document.createElement('h3');
  cityDisplayTitle.textContent = data.name + ' (' + today + ')';
  currentWeatherDiv.appendChild(cityDisplayTitle);

  var weatherIcon = document.createElement('img');
  weatherIcon.classList.add('col-1');
  var weatherIconVal = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${weatherIconVal}.png`;
  currentWeatherDiv.appendChild(weatherIcon);

  // I found the character combo for the degrees symbol at Javascripter.net
  var currentTemperature = document.createElement('p');
  currentTemperature.textContent =
    'Current temp: ' + Math.floor(data.main.temp) + '\xB0 F';
  currentWeatherDiv.appendChild(currentTemperature);

  var windSpeed = document.createElement('p');
  windSpeed.textContent = 'Wind speed: ' + Math.ceil(data.wind.speed) + ' mph';
  currentWeatherDiv.appendChild(windSpeed);

  var humidityLevel = document.createElement('p');
  humidityLevel.textContent = 'Humidity: ' + data.main.humidity + '%';
  currentWeatherDiv.appendChild(humidityLevel);
}

// displays the five-day forecast on the right side of the page, underneath the current conditions
function displayFiveDayForecast(predictions) {
    fiveDayForecastDiv.innerHTML = '';

    if (predictions.length === 0) {
    return;
  }
  // do a for loop that increases by 1 to create the overall containers and the divs that will display the dates.
  // below that, create the other elements and set their attributes
  var forecastDayOne = dayjs().add(1, 'day').format('M/D/YYYY');
  var forecastDayTwo = dayjs().add(2, 'day').format('M/D/YYYY');
  var forecastDayThree = dayjs().add(3, 'day').format('M/D/YYYY');
  var forecastDayFour = dayjs().add(4, 'day').format('M/D/YYYY');
  var forecastDayFive = dayjs().add(5, 'day').format('M/D/YYYY');

  var extendedForecastDays = [
    forecastDayOne,
    forecastDayTwo,
    forecastDayThree,
    forecastDayFour,
    forecastDayFive,
  ];

  fiveDayForecastTitle = document.createElement('h3');
  fiveDayForecastTitle.textContent = 'Five-Day Forecast';
  fiveDayForecastDiv.append(fiveDayForecastTitle);

  for (var i = 0, j = 7; i < 5; i++, j += 8) {
    var fiveDayForecastCard = document.createElement('div');
    fiveDayForecastCard.setAttribute('class', 'card col-6 col-md-2 p-3');
    fiveDayForecastDiv.append(fiveDayForecastCard);

    var forecastDateField = document.createElement('h5');
    forecastDateField.textContent = extendedForecastDays[i];
    fiveDayForecastCard.appendChild(forecastDateField);

    var forecastWeatherIcon = document.createElement('img');
    forecastWeatherIcon.classList.add('col-3');
    var forecastWeatherIconVal = predictions[j].weather[0].icon;
    console.log(forecastWeatherIconVal);
    forecastWeatherIcon.src = `https://openweathermap.org/img/wn/${forecastWeatherIconVal}.png`;
    fiveDayForecastCard.appendChild(forecastWeatherIcon);

    var currentTemperature = document.createElement('p');
    currentTemperature.textContent =
      Math.ceil(predictions[j].main.temp_max) + '\xB0 F';
    fiveDayForecastCard.appendChild(currentTemperature);

    var windSpeed = document.createElement('p');
    windSpeed.textContent =
      'Wind: ' + Math.ceil(predictions[j].wind.speed) + ' mph';
    fiveDayForecastCard.appendChild(windSpeed);

    var humidityLevel = document.createElement('p');
    humidityLevel.textContent =
      'Humidity: ' + predictions[j].main.humidity + '%';
    fiveDayForecastCard.appendChild(humidityLevel);
  }
}
// the initial call to display the search history 
addCitiesToPage();

// event listener for the search history list -- this will display the current conditions and forecast of previously searched cities when the city name is clicked
searchHistoryDivEl.addEventListener('click', getHistoryName);

function getHistoryName(event) {
  event.preventDefault();

  var cityName = event.target.textContent;
  console.log(cityName);

  if (!cityName) {
    console.error("You must enter a search term!");
    return;
  }
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