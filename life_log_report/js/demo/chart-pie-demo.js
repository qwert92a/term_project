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
  Most_Watch = tvData[user_Id].MostWatchAt
  snack_count = snackData[user_Id].DailyCount

  tv_program = ['0시 프로그램', '1시 프로그램', '2시 프로그램', '3시 프로그램', '4시 프로그램', '5시 프로그램',
                '6시 프로그램', '7시 프로그램', '8시 프로그램', '9시 프로그램', '10시 프로그램', '11시 프로그램',
                '12시 프로그램', '13시 프로그램', '14시 프로그램', '15시 프로그램', '16시 프로그램', '17시 프로그램',
                '18시 프로그램', '19시 프로그램', '20시 프로그램', '21시 프로그램', '22시 프로그램', '23시 프로그램']

  if (tv_count == 0 || JSON.stringify(tvData[user_Id]) === '{}' ) {
    document.getElementById('TV').innerHTML = 
      'TV를 자주 보시는 분께는 순이가 시간대별 프로그램을 추천해드려요!'
  } else if (tv_count > 5) {
    document.getElementById('TV_card').classList.remove('bg-primary')
    document.getElementById('TV_card').classList.add('bg-danger')

    document.getElementById('TV').innerHTML = ""

    var img = document.createElement("img");
    img.src = "././img/warning.png";
    var src = document.getElementById("TV");
    src.appendChild(img);

    document.getElementById('TV').innerHTML += 
    ' 하루 평균 TV 시청 횟수가 5회를 넘었어요! TV 시청 횟수를 줄이고 다른 활동을 더 해보시는 건 어떠세요?'
  } else {
      document.getElementById('TV').innerHTML = 
      '하루에 TV를 평균 ' + tv_count + '회 보시네요!' + ' <br /> '
      + Most_Watch + '시에 가장 TV를 많이 보시는군요? 그렇다면 이번 주는' + ' <br /> '
      + tv_program[parseInt(Most_Watch)] + ' 어떠신가요?'
  }

  if (snack_count == 0 || JSON.stringify(snackData[user_Id]) === '{}' ) {
    document.getElementById('snack').innerHTML = 
      '간식 섭취는 안하고 계시네요!'
  } else if (snack_count > 5) {
    document.getElementById('snack_card').classList.remove('bg-success')
    document.getElementById('snack_card').classList.add('bg-danger')

    document.getElementById('snack').innerHTML = ""

    var img = document.createElement("img");
    img.src = "././img/warning.png";
    var src = document.getElementById("snack");
    src.appendChild(img);

    document.getElementById('snack').innerHTML += 
    ' 하루 평균 간식 섭취 횟수가 5회를 넘었어요! '
  } else {
      document.getElementById('snack').innerHTML = 
      '하루에 간식을 평균 ' + snack_count + '회 정도 드시고 있어요!'
  }

