// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = 'Nunito'),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

let user_data = JSON.parse(json_user_data);
let id = location.hash.split('#')[1];
document.getElementById(
  'category_count'
).innerText = `learning: ${user_data[id]['program_data']['learning']}    health: ${user_data[id]['program_data']['health']}    mind: ${user_data[id]['program_data']['mind']}    stress: ${user_data[id]['program_data']['stress']}`;
console.log([
  user_data[id]['program_data']['learning'],
  user_data[id]['program_data']['health'],
  user_data[id]['program_data']['mind'],
  user_data[id]['program_data']['stress'],
]);
const CHART = document.getElementById('myRadarChart');

let radarChart = new Chart(CHART, {
  type: 'radar',
  data: {
    labels: ['learning', 'health', 'mind', 'stress'],
    datasets: [
      {
        label: '참여 횟수: ',
        data: [
          user_data[id]['program_data']['learning'],
          user_data[id]['program_data']['health'],
          user_data[id]['program_data']['mind'],
          user_data[id]['program_data']['stress'],
        ],
        backgroundColor: 'RGBA(28,200,138,0.1)',
        borderColor: '#17a673',
        borderWidth: 2,
      },
    ],
  },
  options: {
    scale: {
      ticks: {
        beginAtZero: true,
        // max: 5,
        // min: 0,
        stepSize: 1,
      },
    },
  },
});
