import CONSTANTS from './constants';
import chartManager from './modules/chartManager';
import displayManager from './modules/displayManager';
import forecastManager from './modules/forecastManager';
import './style.css';

const searchModalBtn = document.querySelector('#search');
const searchModal = document.querySelector('#city-search');
const searchInput = document.querySelector('#city');
const searchBtn = document.querySelector('#get-weather-btn');
const form = document.querySelector('form');
const creditsModalBtn = document.querySelector('#credits-btn');
const creditsModal = document.querySelector('#credits-modal');

searchModalBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchModal.showModal();
});

creditsModalBtn.addEventListener('click', () => creditsModal.showModal());

function updateLocation() {
  if (searchInput.value.length > 2) {
    forecastManager.setSavedLocation(searchInput.value);
    displayManager.updateForecast(CONSTANTS.API_KEY);
    searchModal.close();
  }
}

searchBtn.addEventListener('click', updateLocation);

displayManager.updateForecast(CONSTANTS.API_KEY);
chartManager.createChart();

// Disable form onSubmit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  updateLocation();
});

const modals = document.querySelectorAll('.modal');
// eslint-disable-next-line no-restricted-syntax
for (const modal of modals) {
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = rect.top <= e.clientY
      && e.clientY <= rect.top + rect.height
      && rect.left <= e.clientX
      && e.clientX <= rect.left + rect.width;
    if (!isInDialog) {
      modal.close();
    }
  });
}
