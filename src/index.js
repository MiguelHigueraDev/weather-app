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

const forecast = new Chart(chart, {
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
    backgroundColor: '#0096FF',
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,

    },
  },
});
