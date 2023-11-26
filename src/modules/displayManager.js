import CONSTANTS from '../constants';
import chartManager from './chartManager';
import forecastManager from './forecastManager';

const image = document.querySelector('#forecast-icon');
const temperature = document.querySelector('#forecast-temperature');
const condition = document.querySelector('#forecast-condition');
const location = document.querySelector('#weather-location-text');

const getWeatherIcon = (code) => {
  const { icon } = CONSTANTS.WEATHER_CODES.find((w) => w.code === code);
  return icon;
};

function updateHeader(code, temp, cond, country, city) {
  const icon = getWeatherIcon(code);
  image.src = icon;
  temperature.textContent = `${temp}`;
  condition.textContent = cond;
  location.textContent = `${city}, ${country}`;
}

function updateChart(type, forecast) {
  if (type === 'temperature') {
    const temps = forecastManager.getDailyTemperatures(forecast);
    chartManager.updateTemperatures(temps);
  }
}

function updateDayForecast(index, icon, text, day, max, min) {
  const card = document.querySelector(`#day-${index}`);
  const img = card.querySelector('img');
  img.src = getWeatherIcon(icon);
  const dayDiv = card.querySelector('.day');
  dayDiv.textContent = day;
  const dayForecast = card.querySelector('.daily-forecast');
  dayForecast.textContent = text;
  const high = card.querySelector('.high');
  high.textContent = `${max}°`;
  const low = card.querySelector('.low');
  low.textContent = `${min}°`;
}

async function updateForecast(apiKey, local) {
  const dailyForecast = await forecastManager.getDailyForecast(apiKey, local);
  updateHeader(...forecastManager.getHeaderInformation(dailyForecast));
  updateChart('temperature', dailyForecast);
  // Update the 3 days
  updateDayForecast(1, ...forecastManager.getDayForecast(dailyForecast, 1));
  updateDayForecast(2, ...forecastManager.getDayForecast(dailyForecast, 2));
  updateDayForecast(3, ...forecastManager.getDayForecast(dailyForecast, 3));
}

function startUI() {
  // First update current information (header)
  updateForecast(CONSTANTS.API_KEY, 'Cincinnati');
}

const displayManager = {
  updateForecast, startUI,
};

export default displayManager;
