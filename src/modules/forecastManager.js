import { format, parse } from 'date-fns';
import CONSTANTS from '../constants';

async function getDailyForecast(apiKey, local) {
  const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${local}&aqi=no&days=4`, { cors: true });
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
  // Data must be an array of temperatures like [12, 11, 13, 21, 26, 27, 22, 17];
  const dailyTemps = dailyForecast.forecast.forecastday[0].hour;
  const formattedData = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const hour of CONSTANTS.HOURS_TO_CHECK) {
    formattedData.push(Math.round(dailyTemps[hour].temp_c));
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
  getDailyTemperatures, getHeaderInformation, getDailyForecast, getDayForecast,
};

export default forecastManager;
