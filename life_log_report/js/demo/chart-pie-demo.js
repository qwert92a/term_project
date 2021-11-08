// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = 'Nunito'),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

  let user_actData = JSON.parse(JSON.stringify(user_act));
  var tvData = JSON.parse(JSON.stringify(tv));
  var snackData = JSON.parse(JSON.stringify(snack));
  let user_Id = location.hash.split('#')[1];

  console.log(JSON.stringify(user_actData[user_Id]) === '{}' ) // empty 
  var label_data = user_actData[user_Id].labels
  var ratio_data = user_actData[user_Id].ratios
  var data_len = label_data.length
  

  // Pie Chart Example
  var ctx = document.getElementById('myPieChart');
  var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: label_data,
      datasets: [
        {
          data: ratio_data,
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#FFEA00'],
          hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
          hoverBorderColor: 'rgba(234, 236, 244, 1)',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: 'rgb(255,255,255)',
        bodyFontColor: '#858796',
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false,
      },
      cutoutPercentage: 80,
    },
  });

  for (i = 0; i<data_len; i++) {
    label_color = 'text-primary'
    if (i == 0) {label_color = 'text-primary'}
    else if (i == 1) {label_color = 'text-success'}
    else if (i == 2) {label_color = 'text-info'}
    else if (i == 3) {label_color = 'text-warning'}
    else {label_color = 'text-secondary'}

    document.getElementById('pieChartLabels').innerHTML += 
    '<span class="mr-2"> <i class="fas fa-circle ' + label_color + '"></i> '
    + label_data[i] + '</span> '
    
  }

  tv_count = tvData[user_Id].DailyCount
  snack_count = snackData[user_Id].DailyCount

  if (tv_count == 0 || JSON.stringify(tvData[user_Id]) === '{}' ) {
    TV_box = document.getElementById('TV_box')
    TV_box.remove();
  } else {
      document.getElementById('TV').innerHTML = 
      '일일 평균 TV 시청 횟수 <br /> ' + tv_count
  }

  if (snack_count == 0 || JSON.stringify(snackData[user_Id]) === '{}' ) {
    snack_box = document.getElementById('snack_box')
    snack_box.remove();
  } else {
      document.getElementById('snack').innerHTML = 
      '일일 평균 간식 섭취 횟수 <br /> ' + snack_count
  }

