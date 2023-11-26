/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line import/no-extraneous-dependencies
import { format, parse } from 'date-fns';
import CONSTANTS from '../constants';

function getSavedLocation() {
  const location = localStorage.getItem('location');
  if (location == null) localStorage.setItem('location', 'Santiago');
  return localStorage.getItem('location');
}

function setSavedLocation(loc) {
  localStorage.setItem('location', loc);
}

async function getDailyForecast(apiKey) {
  const location = getSavedLocation();
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&aqi=no&days=4`, { cors: true });
    const dailyForecast = await response.json();
    if (dailyForecast.error) {
      alert('No data found for entered location. Going back to default location.');
      setSavedLocation('Santiago');
      return getDailyForecast(CONSTANTS.API_KEY);
    }
    return dailyForecast;
  } catch (err) {
    return console.error(err);
  }
}

function getHeaderInformation(dailyForecast) {
  const { code, text } = dailyForecast.current.condition;
  const { temp_c: temp } = dailyForecast.current;
  const { country, name: city } = dailyForecast.location;
  return [code, Math.round(temp), text, country, city];
}

function getDailyTemperatures(dailyForecast) {
  // Data must be an array of temperatures like [12, 11, 13, 21, 26, 27, 22, 17];
  const dailyInfo = dailyForecast.forecast.forecastday[0].hour;
  const formattedData = [];
  for (const hour of CONSTANTS.HOURS_TO_CHECK) {
    formattedData.push(Math.round(dailyInfo[hour].temp_c));
  }
  return formattedData;
}

function getDailyPrecipitationChance(dailyForecast) {
  const dailyInfo = dailyForecast.forecast.forecastday[0].hour;
  const formattedData = [];
  for (const hour of CONSTANTS.HOURS_TO_CHECK) {
    // Snow is also precipitation :)
    // TODO: This part could be improved due to the fact that there could be a low chance
    // of snow, although it could be higher than the chance of rain
    if (dailyInfo[hour].will_it_snow === 1) {
      formattedData.push(Math.round(dailyInfo[hour].chance_of_snow));
    } else {
      formattedData.push(Math.round(dailyInfo[hour].chance_of_rain));
    }
  }
  return formattedData;
}

function getDailyWindSpeed(dailyForecast) {
  const dailyInfo = dailyForecast.forecast.forecastday[0].hour;
  const formattedData = [];
  for (const hour of CONSTANTS.HOURS_TO_CHECK) {
    formattedData.push(Math.round(dailyInfo[hour].wind_kph));
  }
  return formattedData;
}

const formatDate = (date) => {
  const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
  return format(parsedDate, 'EEEE');
};

function getDayForecast(dailyForecast, day) {
  const { day: dailyInfo } = dailyForecast.forecast.forecastday[day];
  // Date must be formatted before being returned
  let { date } = dailyForecast.forecast.forecastday[day];
  date = formatDate(date);
  const { maxtemp_c: maxTemp, mintemp_c: minTemp } = dailyInfo;
  const { code, text } = dailyInfo.condition;
  return [code, text, date, Math.round(maxTemp), Math.round(minTemp)];
}

const forecastManager = {
  getDailyTemperatures,
  getHeaderInformation,
  getSavedLocation,
  setSavedLocation,
  getDailyForecast,
  getDayForecast,
  getDailyPrecipitationChance,
  getDailyWindSpeed,
};

export default forecastManager;
