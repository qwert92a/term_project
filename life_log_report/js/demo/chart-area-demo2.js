// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = 'Nunito'),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
    dec = typeof dec_point === 'undefined' ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// Area Chart Example
let lifecycleData = JSON.parse(JSON.stringify(lifecycle));
let user_id = location.hash.split('#')[1];
let act_rate_data = lifecycleData[user_id].act_rate;

var ctx = document.getElementById('myAreaChart');
var ChartBox = document.getElementById('AreaChartBox');
var lifecycle_tab = document.getElementById("lifecycle_tab");
var textbox = document.createElement("div");
var text = document.createElement("h6");
var text2 = document.createElement("h6");

let data_empty = JSON.stringify(lifecycleData[user_id]) === '{}'
if (data_empty){
  ChartBox.innerHTML = "데이터가 없어요"
} else {
var time = [];
var act_data = [];
for (var i = 0; i < 24; i++) {
  time.push(String(i) + '시');
  act_data.push(act_rate_data[i]);
}
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: time,
    datasets: [
      {
        label: '활동량',
        lineTension: 0.3,
        backgroundColor: 'rgba(78, 115, 223, 0.05)',
        borderColor: 'rgba(78, 115, 223, 1)',
        pointRadius: 3,
        pointBackgroundColor: 'rgba(78, 115, 223, 1)',
        pointBorderColor: 'rgba(78, 115, 223, 1)',
        pointHoverRadius: 3,
        pointHoverBackgroundColor: 'rgba(78, 115, 223, 1)',
        pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: act_data,
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0,
      },
    },
    scales: {
      xAxes: [
        {
          time: {
            unit: 'date',
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            maxTicksLimit: 7,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            maxTicksLimit: 5,
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              // return '$' + number_format(value);
              return number_format(value) + '회';
            },
          },
          gridLines: {
            color: 'rgb(234, 236, 244)',
            zeroLineColor: 'rgb(234, 236, 244)',
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2],
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    tooltips: {
      backgroundColor: 'rgb(255,255,255)',
      bodyFontColor: '#858796',
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function (tooltipItem, chart) {
          var datasetLabel =
            chart.datasets[tooltipItem.datasetIndex].label || '';
          // return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
          return number_format(tooltipItem.yLabel) + '회';
        },
      },
    },
  },
});


let sort_act_data = act_data.slice();
sort_act_data.sort(function(a,b) {return b-a;});
sort_act_data = sort_act_data.slice(0,6);

function range(start, end) {
 
  var arr = [];

  var length = end - start; 

  for (var i = 0; i <= length; i++) { 

      arr[i] = start;
      start++;
  }

  return arr;
}

let act_time_arr = []

for (i=0; i<6; i++){
  act_time = act_data.indexOf(sort_act_data[i])
  act_time_arr.push(act_time)
}

let reducer = (accumulator, curr) => accumulator + curr;
let act_time_mean = act_time_arr.reduce(reducer) / 6;
let daytime_dist = Math.abs(act_time_mean - 8)
let nhttime_dist = Math.abs(act_time_mean - 18)

if (daytime_dist == nhttime_dist) {
  top_time = act_data.indexOf(sort_act_data[0])
  daytime_dist = Math.abs(top_time - 6)
  nhttime_dist = Math.abs(top_time - 18)
}

if (daytime_dist < nhttime_dist) {
  text.innerHTML = "아침형"
  text.classList.add('font-weight-bold', 'text-warning', 'mb-0')
}
else { 
  text.innerHTML = "저녁형" 
  text.classList.add('font-weight-bold', 'text-success', 'mb-0')
}


text2.innerHTML += " 생활 패턴을 가지고 계세요!"
text2.classList.add('font-weight-bold', 'mb-0')
text2.style.marginLeft = "0.5em"
textbox.style.display = "flex"
textbox.style.marginLeft = "30%"
textbox.appendChild(text)
textbox.appendChild(text2)
lifecycle_tab.appendChild(textbox)
}