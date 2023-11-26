import {
  Chart, CategoryScale, LinearScale, LineController, PointElement, LineElement, Filler, Tooltip,
} from 'chart.js';

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(LineController);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(Filler);
Chart.register(Tooltip);

const chart = document.getElementById('daily-forecast-chart');
const data = [12, 11, 13, 21, 26, 27, 22, 17];
let forecast;

function createChart() {
  forecast = new Chart(chart, {
    type: 'line',
    data: {
      labels: ['04:00', '07:00', '10:00', '13:00', '16:00', '19:00', '22:00', '01:00'],
      datasets: [{
        label: 'Temperature',
        data,
        borderWidth: 1,
        fill: true,
        pointRadius: 1.5,
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            display: false,
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      line: {
        borderColor: '#FF0000',
      },
      backgroundColor: '#FF5F1F',
      tooltips: {
        enabled: true,
        mode: 'index',
        intersect: false,

      },
    },
  });
}

function updateData(newData) {
  forecast.data.datasets[0].data = newData;
  forecast.update();
}

function updateTemperatures(newData) {
  forecast.options.backgroundColor = '#FF5F1F';
  forecast.data.datasets[0].label = 'Temperature (°C)';
  updateData(newData);
}

function updatePrecipitationChance(newData) {
  forecast.options.backgroundColor = '#0096FF';
  forecast.data.datasets[0].label = 'Chance of rain (%)';
  updateData(newData);
}

function updateWindSpeed(newData) {
  forecast.options.backgroundColor = '#32CD32';
  forecast.data.datasets[0].label = 'Wind speed (km/h)';
  updateData(newData);
}

const chartManager = {
  createChart, updateTemperatures, updatePrecipitationChance, updateWindSpeed,
};

export default chartManager;
