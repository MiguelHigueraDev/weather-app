import CONSTANTS from '../constants';
import chartManager from './chartManager';
import forecastManager from './forecastManager';

const image = document.querySelector('#forecast-icon');
const temperature = document.querySelector('#forecast-temperature');
const condition = document.querySelector('#forecast-condition');
const location = document.querySelector('#weather-location-text');

const temperatureBtn = document.querySelector('#temperature-btn');
const precipitationBtn = document.querySelector('#precipitation-btn');
const windBtn = document.querySelector('#wind-btn');

const animatedDivs = document.querySelectorAll('.animated');

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

function resetSelectedBtn() {
  temperatureBtn.classList.remove('selected-info');
  precipitationBtn.classList.remove('selected-info');
  windBtn.classList.remove('selected-info');
}

function toggleVisibility(bool) {
  animatedDivs.forEach((div) => {
    if (bool) {
      div.classList.add('visible');
      div.classList.remove('transparent');
    } else {
      div.classList.add('transparent');
      div.classList.remove('visible');
    }
  });
}

async function updateChart(type) {
  resetSelectedBtn();
  const loc = forecastManager.getSavedLocation();
  const forecast = await forecastManager.getDailyForecast(CONSTANTS.API_KEY, loc);
  if (type === 'temperature') {
    const temps = forecastManager.getDailyTemperatures(forecast);
    chartManager.updateTemperatures(temps);
    temperatureBtn.classList.add('selected-info');
  } else if (type === 'precipitation') {
    const precipitation = forecastManager.getDailyPrecipitationChance(forecast);
    chartManager.updatePrecipitationChance(precipitation);
    precipitationBtn.classList.add('selected-info');
  } else if (type === 'wind') {
    const windSpeeds = forecastManager.getDailyWindSpeed(forecast);
    chartManager.updateWindSpeed(windSpeeds);
    windBtn.classList.add('selected-info');
  }
}

temperatureBtn.addEventListener('click', () => { updateChart('temperature'); });
precipitationBtn.addEventListener('click', () => { updateChart('precipitation'); });
windBtn.addEventListener('click', () => { updateChart('wind'); });

function updateDayForecast(index, icon, text, day, max, min) {
  const card = document.querySelector(`#day-${index}`);
  const img = card.querySelector('img');
  img.src = getWeatherIcon(icon);
  const dayDiv = card.querySelector('.day');
  dayDiv.textContent = day;
  const dayCondition = card.querySelector('.daily-condition');
  dayCondition.textContent = text;
  const high = card.querySelector('.high');
  high.textContent = `${max}°`;
  const low = card.querySelector('.low');
  low.textContent = `${min}°`;
}

async function updateForecast(apiKey) {
  const local = localStorage.getItem('location');
  toggleVisibility(false);
  const dailyForecast = await forecastManager.getDailyForecast(apiKey, local);
  updateHeader(...forecastManager.getHeaderInformation(dailyForecast));
  updateChart('temperature');
  // Update the 3 days
  updateDayForecast(1, ...forecastManager.getDayForecast(dailyForecast, 1));
  updateDayForecast(2, ...forecastManager.getDayForecast(dailyForecast, 2));
  updateDayForecast(3, ...forecastManager.getDayForecast(dailyForecast, 3));
  toggleVisibility(true);
}

function startUI() {
  // First update current information (header)
  updateForecast(CONSTANTS.API_KEY, 'Cincinnati');
}

const displayManager = {
  updateForecast, startUI,
};

export default displayManager;
