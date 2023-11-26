import CONSTANTS from '../constants';

const image = document.querySelector('#forecast-icon');
const temperature = document.querySelector('#forecast-temperature');
const condition = document.querySelector('#forecast-condition');
const location = document.querySelector('#weather-location-text');

function updateHeader(code, temp, cond, country, city) {
  const { icon } = CONSTANTS.WEATHER_CODES.find((weather) => weather.code === code);
  image.src = icon;
  temperature.textContent = `${temp}`;
  condition.textContent = cond;
  location.textContent = `${city}, ${country}`;
}

async function getDailyForecast(apiKey, local) {
  const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${local}&aqi=no`, { cors: true });
  const dailyForecast = await response.json();
  console.log(dailyForecast);
  return dailyForecast;
}

function getHeaderInformation(dailyForecast) {
  const { code, text } = dailyForecast.current.condition;
  const { temp_c: temp } = dailyForecast.current;
  const { country, name: city } = dailyForecast.location;
  return [code, temp, text, country, city];
}

function getDailyTemperatures(dailyForecast) {
  // Data must be in format [12, 11, 13, 21, 26, 27, 22, 17];
  // Where ['04:00', '07:00', '10:00', '13:00', '16:00', '19:00', '22:00', '01:00'],
  const dailyTemps = dailyForecast.forecast.forecastday[0].hour;
  const formattedData = dailyTemps;
}

async function updateCurrent(apiKey, local) {
  const dailyForecast = await getDailyForecast(apiKey, local);
  updateHeader(...getHeaderInformation(dailyForecast));
}

updateCurrent(CONSTANTS.API_KEY, 'Santiago');

const forecastManager = {
  updateCurrent,
};

export default forecastManager;
