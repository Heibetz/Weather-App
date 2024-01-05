/**
 * @Author Hank Heiselbetz
 * Weather App
 */

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "b5518c2cd94531e0c404dc1e3d86818a";

/** 
 * Event listener that gets information from the form 
 */
weatherForm.addEventListener("submit", async event => {

    //prevents refreshing the page
    event.preventDefault();

    const city = cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.log(error);
            displayError(error);
        }
    }
    else {
        displayError("Please enter a city");
    }

});

/**
 * Fetches the weather data information and sends it to weatherForm function
 * @param {*} city 
 * @returns weather information in a JSON format
 */
async function getWeatherData(city){

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    //fetches information from the url
    //await is allowed because it is an async function
    const response = await fetch(apiUrl);

    //Throws an error if the city is not found
    if(!response.ok){
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

/**
 * Displays city, temp, humidity, description, weather
 * @param {*} data 
 */
function displayWeatherInfo(data) {
    
    const {name: city,
        main: {temp, humidity},
        weather: [{description, id}]} = data;

    card.textContent= "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    //City Display
    cityDisplay.textContent = city;             //Sets the text to the city
    cityDisplay.classList.add("cityDisplay");   //gets access to the CSS file
    card.appendChild(cityDisplay);              //Appends the display to the card

    //Temperature Display
    tempDisplay.textContent = `${((temp - 273.15) * (9/5) + 32).toFixed(1)}°F`;
    tempDisplay.classList.add("tempDisplay");
    card.appendChild(tempDisplay);

    //Humidity Display
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    humidityDisplay.classList.add("humidityDisplay");
    card.appendChild(humidityDisplay);

    //Description Display
    descDisplay.textContent = description;
    descDisplay.classList.add("descDisplay");
    card.appendChild(descDisplay);

    //Weather Emoji Display
    weatherEmoji.textContent = getWeatherEmoji(id);
    weatherEmoji.classList.add("weatherEmoji");
    card.appendChild(weatherEmoji);
}

/**
 * Gets the weather ID and uses that to choose an emoji to display
 * 200 = thunderstorm, 300 = drizzle, 500 = rain
 * 600 = snow, 700 = atmosphere, 800 = clear sky, 
 * > 800 = clouds
 * @param {*} weatherId 
 */
function getWeatherEmoji(weatherId){

    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "🌞";
        case (weatherId >= 801 && weatherId < 810):
            return "☁️";
        default:
            return "🧐";
    }
}

/**
 * Displays the error message when a city is not typed in, or not a correct city
 * @param {} message 
 */
function displayError(message){

    //creates a paragraph
    const errorDisplay = document.createElement("p");
    //Displays the message
    errorDisplay.textContent = message;
    //Adds the CSS class to the app
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}