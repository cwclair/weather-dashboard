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
                var cityLatitude = data.coord.lat;
                var cityLongitude = data.coord.lon;
                localStorage.setItem('latitude', cityLatitude);
                localStorage.setItem('longitude', cityLongitude);
            displayCurrentWeather(data)    
            });

    })
    
}
getCurrentWeather();

var cityLatitude5Day = localStorage.getItem('latitude');
var cityLongitude5Day = localStorage.getItem('longitude');
console.log(cityLatitude5Day);
console.log(cityLongitude5Day);

var apiUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLatitude5Day}&lon=${cityLongitude5Day}&appid=${apiKey}&units=imperial`
console.log(apiUrlFiveDay);

function getFiveDayForecast() {
    fetch(apiUrlFiveDay)
    .then(function(response) {
        response.json()
        .then(function(predictions) {
            console.log(predictions.list);
            displayFiveDayForecast(predictions.list);
        })
    })
}

getFiveDayForecast();



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
    currentTemperature.textContent = 'Current temp: ' + Math.floor(data.main.temp) + '\xB0 F';
    currentWeatherDiv.appendChild(currentTemperature);

    var windSpeed = document.createElement('p');
    windSpeed.textContent = 'Wind speed: ' + Math.ceil(data.wind.speed) + ' mph';
    currentWeatherDiv.appendChild(windSpeed);

    var humidityLevel = document.createElement('p');
    humidityLevel.textContent = 'Humidity: ' + data.main.humidity + '%';
    currentWeatherDiv.appendChild(humidityLevel);

}

function displayFiveDayForecast(predictions){
    if(predictions.length === 0){
        return;
    }
// do a for loop that increases by 1 to create the overall containers and the divs that will display the dates.
// below that, you'll create the other elements and set their attributes 
    var forecastDayOne = dayjs().add(1, 'day').format('M/D/YYYY');
    var forecastDayTwo = dayjs().add(2, 'day').format('M/D/YYYY');
    var forecastDayThree = dayjs().add(3, 'day').format('M/D/YYYY');
    var forecastDayFour = dayjs().add(4, 'day').format('M/D/YYYY');
    var forecastDayFive = dayjs().add(5, 'day').format('M/D/YYYY');
    
    var extendedForecastDays = [forecastDayOne, forecastDayTwo, forecastDayThree, forecastDayFour, forecastDayFive]
    console.log(extendedForecastDays);

    for (var i = 0, j = 7 ; i < 5; i++, j += 8) {
        var fiveDayForecastCard = document.createElement('div');
        fiveDayForecastCard.setAttribute('class', 'card');
        fiveDayForecastDiv.append(fiveDayForecastCard);
    
        var forecastDateField = document.createElement('h5');
        forecastDateField.textContent = extendedForecastDays[i];
        fiveDayForecastCard.appendChild(forecastDateField);

        var forecastWeatherIcon = document.createElement('img');
        forecastWeatherIcon.classList.add('col-1')
        var forecastWeatherIconVal = predictions[j].weather[0].icon;
        console.log(forecastWeatherIconVal);
        forecastWeatherIcon.src = `https://openweathermap.org/img/wn/${forecastWeatherIconVal}.png`
        fiveDayForecastCard.appendChild(forecastWeatherIcon);

        var currentTemperature = document.createElement('p');
        currentTemperature.textContent = Math.ceil(predictions[j].main.temp_max) + '\xB0 F';
        fiveDayForecastCard.appendChild(currentTemperature);
    
        var windSpeed = document.createElement('p');
        windSpeed.textContent = 'Wind speed: ' + Math.ceil(predictions[j].wind.speed) + ' mph';
        fiveDayForecastCard.appendChild(windSpeed);
    
        var humidityLevel = document.createElement('p');
        humidityLevel.textContent = 'Humidity: ' + predictions[j].main.humidity + '%';
        fiveDayForecastCard.appendChild(humidityLevel);

    }
}
