var apiKey = "eb5cff2c542e454a13fb9d52a2a5c3ca";

// Use the endpoint api.openweathermap.org for the API calls.
// Example of API call: api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=eb5cff2c542e454a13fb9d52a2a5c3ca

var searchButtonEl = document.querySelector('#searchButton');

function getCityName(event) {
    event.preventDefault();

    var cityNameEl = document.querySelector('#city-name').value.trim();
    console.log(cityNameEl);
    
    if (!cityNameEl) {
        console.error("You must enter a search term!");
        return;
    }

    // var searchQuery = 'search-results.html?q=' + searchTermEl + '&format=' + formatTypeEl;
    // console.log(searchQuery);
    
}

searchButtonEl.addEventListener('click', getCityName);
