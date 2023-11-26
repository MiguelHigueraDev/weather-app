// eslint-disable-next-line import/no-extraneous-dependencies
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
  return [code, Math.round(temp), text, country, city];
}

function getDailyTemperatures(dailyForecast) {
  // Data must be an array of temperatures like [12, 11, 13, 21, 26, 27, 22, 17];
  const dailyInfo = dailyForecast.forecast.forecastday[0].hour;
  const formattedData = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const hour of CONSTANTS.HOURS_TO_CHECK) {
    formattedData.push(Math.round(dailyInfo[hour].temp_c));
  }
  return formattedData;
}

function getDailyPrecipitationChance(dailyForecast) {
  const dailyInfo = dailyForecast.forecast.forecastday[0].hour;
  const formattedData = [];
  // eslint-disable-next-line no-restricted-syntax
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
  // eslint-disable-next-line no-restricted-syntax
  for (const hour of CONSTANTS.HOURS_TO_CHECK) {
    formattedData.push(Math.round(dailyInfo[hour].maxwind_kph));
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
  getDailyForecast,
  getDayForecast,
  getDailyPrecipitationChance,
  getDailyWindSpeed,
};

export default forecastManager;
