// Contraints for API URL and API Key
let apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

// Selecting an element by its ID
const searchInputEl = document.getElementById("search-input");
const searchBtnEl = document.getElementById("search-btn");
const citiesBtnEl = document.getElementById("cities-btn-container")
const weatherEl = document.getElementById("current-weather");
const fiveDayEl = document.getElementById("five-day");


// Retrieve city data Local storage
let retrieveCitiesFromLocalStorage = () => {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    return cities;
  }

// Reterive weather data from local storage
let retrieveCurrentWeatherFromLocalStorage = () => {
    const currentWeather = JSON.parse(localStorage.getItem('current-weather')) || null;
    return currentWeather;
  }

  // Retrive 5 day forecast from local storage
  let retrieveFiveDayForecastFromLocalStorage = () => {
    const fiveDayForecast = JSON.parse(localStorage.getItem('fiveDay')) || null;
    return fiveDayForecast;
  }

//Create buttons from previous searches
function createCitiesButtons() {
  citiesBtnEl.innerHTML = ''; // Clear existing buttons
  let cities = getCitiesFromStorage();
  
  if (cities.length > 5) {
    cities.shift()
  }
  
  cities.forEach(city => {
    
      let cityBtn = document.createElement("button");
      cityBtn.textContent = city;
      cityBtn.classList.add("cityBtn")
      cityBtnContEl.insertBefore(cityBtn, cityBtnContEl.firstChild);

localStorage.setItem('cities', JSON.stringify(cities));
});  
}


// Create weather card
function createCurrentWeatherCard () {
  let currentWeather = retrieveCitiesFromLocalStorage();  
  
  if(currentWeather == null) {   
  }

  else {
  currentWeatherEl.innerHTML = `
    <div><h2>${currentWeather.city} ${currentWeather.date}</h2><img src="${currentWeather.icon}"></div>
    <p>Temp: ${currentWeather.temp}&degF<p>
    <p>Wind: ${currentWeather.wind} MPH<p>
    <p>Humidity ${currentWeather.humidity}%<p>`
}

} 

// Now display weather cards on the webpage
function createFiveDayForecastCard () {
  let fiveDayForecast = retrieveFiveDayForecastFromLocalStorage();
  for (let i = 0; i < fiveDayForecast.length; i++) {

    const fiveDayForecastCard = document.createElement('div');
    fiveDayForecast.classList.add('five-day');

    const date = document.createElement('h3');
    date.classList.add('card-title');
    fiveDayForecastCard.appendChild(date);

    const temp = document.createElement('p');
    temp.classList.add('card-text');
    fiveDayForecastCard.appendChild(temp);

    const humidity = document.createElement('p');
    humidity.classList.add('card-text');
    fiveDayForecastCard.appendChild(humidity);

    const wind = document.createElement('p');
    wind.classList.add('card-text');
    fiveDayForecastCard.appendChild(wind);

    fiveDayEl.appendChild(fiveDayForecastCard);
  }
}

// Event lisener added to the search button
searchBtnEl.addEventListener("click", function(event) {
  event.preventDefault();
  const city = searchInputEl.value;
  searchWeather(city);
  searchInputEl.value = '';
});

//Add event listener to parent container of dynamically created buttons. 
citiesBtnEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("cities-btn-container")) {
    let cityBtnText = e.target.textContent;
    searchApi(cityBtnText);
  }
})
// Add API's to fetch data from the server

function searchWeather(city) {

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl) 
    .then((response) => {
      if (response.ok) {
      }
      return response.json();
    })

    .then((data) => {
      let cityGeoInfo = {
        lat: data.coord.lat,
        lon: data.coord.lon
      };
      //Use information from fetch(weatherCityURL) to dynamically create current weather URL
    let currentGeoURL = `https://api.openweathermap.org/data/2.5/weather?lat=${cityGeoInfo.lat}&lon=${cityGeoInfo.lon}&units=imperial&appid=52d4c71f9cae17ae79966146d4c3044e`

    fetch(currentGeoURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
    }
})
    .then((data) => {
      let currentWeather = {
        city: data.name,
        date: new Date().toLocaleDateString(),
        icon: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        temp: data.main.temp,
        wind: data.wind.speed,
        humidity: data.main.humidity
      }
      localStorage.setItem('current-weather', JSON.stringify(currentWeather));
      createCurrentWeatherCard();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
