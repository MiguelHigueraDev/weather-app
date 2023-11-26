import { WEATHER_CODES } from '../constants';

const image = document.querySelector('#forecast-icon');
const temperature = document.querySelector('#forecast-temperature');
const condition = document.querySelector('#forecast-condition');

function loadForecast(code) {
  const { day, night, icon } = WEATHER_CODES.find((arr) => arr.code === code);
  image.src = icon;
  console.log(day, night, icon);
}

const forecastManager = {
  loadForecast,
};

export default forecastManager;
