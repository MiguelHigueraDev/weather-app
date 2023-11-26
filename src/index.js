import CONSTANTS from './constants';
import chartManager from './modules/chartManager';
import displayManager from './modules/displayManager';
import forecastManager from './modules/forecastManager';

const searchModalBtn = document.querySelector('#search');
const searchModal = document.querySelector('#city-search');
const searchInput = document.querySelector('#city');
const searchBtn = document.querySelector('#get-weather-btn');

searchModalBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchModal.showModal();
});

searchBtn.addEventListener('click', () => {
  if (searchInput.value.length > 2) {
    forecastManager.setSavedLocation(searchInput.value);
    displayManager.updateForecast(CONSTANTS.API_KEY);
    searchModal.close();
  }
});

displayManager.startUI();
chartManager.createChart();
