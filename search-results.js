var apiKey = "eb5cff2c542e454a13fb9d52a2a5c3ca";

// Use the endpoint api.openweathermap.org for the API calls.
// Example of API call: api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=eb5cff2c542e454a13fb9d52a2a5c3ca

var getValueFromUrl = location.search.split('&');
var cityName = getValueFromUrl[0].split('=').pop();
console.log(cityName);

var queryString = document.location.search;
console.log(queryString);

var apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=eb5cff2c542e454a13fb9d52a2a5c3ca&units=imperial`;
console.log(apiUrlCurrent)
function getCurrentWeather(){
    if(!queryString){
        return;
    }
    fetch(apiUrlCurrent)
    .then(function(response){
            response.json()
            .then(function (data){
                console.log(data);
                console.log(data.coord.lat);
            displayCurrentWeather(data)    
            });

    })
    
}
// a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// function displayWeatherData() 




getCurrentWeather();

function displayCurrentWeather(data) {
    var today = dayjs().format('M/D/YYYY');
    
    var currentWeatherDiv = document.createElement('div');
    currentWeatherDiv.setAttribute('class', 'card');
    weatherDisplayDiv.append(currentWeatherDiv);

    var cityDisplayTitle = document.createElement('h3');
    cityDisplayTitle.textContent = data.name + ' (' + today + ')';
    currentWeatherDiv.appendChild(cityDisplayTitle);

    var weatherIcon = document.createElement('img');
    weatherIcon.classList.add('col-1')
    var weatherIconVal = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherIconVal}.png`
    currentWeatherDiv.appendChild(weatherIcon);
    
    // I found the character combo for the degrees symbol at Javascripter.net
    var currentTemperature = document.createElement('p');
    currentTemperature.textContent = Math.floor(data.main.temp) + '\xB0 F';
    currentWeatherDiv.appendChild(currentTemperature);

    var windSpeed = document.createElement('p');
    windSpeed.textContent = 'Wind speed: ' + Math.ceil(data.wind.speed) + ' mph';
    currentWeatherDiv.appendChild(windSpeed);

    var humidityLevel = document.createElement('p');
    humidityLevel.textContent = 'Humidity: ' + data.main.humidity + '%';
    currentWeatherDiv.appendChild(humidityLevel);

}

