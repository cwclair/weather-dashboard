var apiKey = "eb5cff2c542e454a13fb9d52a2a5c3ca";

// Use the endpoint api.openweathermap.org for the API calls.
// Example of API call: api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=eb5cff2c542e454a13fb9d52a2a5c3ca

var getValueFromUrl = location.search.split('&');
var cityName = getValueFromUrl[0].split('=').pop();
console.log(cityName);

var queryString = document.location.search;
console.log(queryString);

var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=eb5cff2c542e454a13fb9d52a2a5c3ca`;
console.log(apiURL)
function getWeatherData(){
    if(!queryString){
        return;
    }
    fetch(apiURL)
    .then(function(response){
            response.json()
            .then(function (data){
                console.log(data);
            });

    })
    
}
getWeatherData();