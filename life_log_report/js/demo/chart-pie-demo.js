// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = 'Nunito'),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
let empty_Data = JSON.parse(JSON.stringify(id_data));
let user_Id = location.hash.split('#')[1];

if (empty_Data[user_Id].empty == 'true') {
  history.back(alert('기록된데이터가 없습니다!'));
} else {
  let user_actData = JSON.parse(JSON.stringify(user_act));
  var tvData = JSON.parse(JSON.stringify(tv));
  var snackData = JSON.parse(JSON.stringify(snack));
  let sleepData = JSON.parse(JSON.stringify(sleep_reg));
  let exData = JSON.parse(JSON.stringify(ex_avg));

  var label_data = user_actData[user_Id].labels;
  var ratio_data = user_actData[user_Id].ratios;
  var data_len = label_data.length;

  function p_tag(string) {
    let tag =
      '<p style="display:flex; align-items:center; margin-bottom: 0; margin-left:1em">';
    let tag_end = '</p>';
    let p_tag = tag + string + tag_end;
    return p_tag;
  }

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

  for (i = 0; i < data_len; i++) {
    label_color = 'text-primary';
    if (i == 0) {
      label_color = 'text-primary';
    } else if (i == 1) {
      label_color = 'text-success';
    } else if (i == 2) {
      label_color = 'text-info';
    } else if (i == 3) {
      label_color = 'text-warning';
    } else {
      label_color = 'text-secondary';
    }

    document.getElementById('pieChartLabels').innerHTML +=
      '<span class="mr-2"> <i class="fas fa-circle ' +
      label_color +
      '"></i> ' +
      label_data[i] +
      '</span> ';
  }

  tv_count = tvData[user_Id].DailyCount;
  Most_Watch = tvData[user_Id].MostWatchAt;
  snack_count = snackData[user_Id].DailyCount;

  tv_danger = false;
  snack_danger = false;
  sleep_data_exist = true;
  ex_data_exist = true;
  sleep_score = 50;
  ex_score = 50;

  tv_container = document.getElementById('TV');
  tv_container.style.display = 'flex';

  tv_program = [
    '&lt;헬로 트로트&gt; 재방송이',
    '월~목요일에 &lt;나이트라인&gt;이',
    '&lt;헬로 트로트&gt; 재방송이',
    '&lt;골프왕&gt; 재방송이',
    '&lt;골프왕&gt; 재방송이',
    '&lt;진리식당&gt; 재방송이',
    '&lt;건강한 집&gt; 재방송이',
    '&lt;굿모닝 MBN&gt;이',
    '평일에 &lt;아침마당&gt;이',
    '평일에 &lt;신통방통&gt;이',
    '평일에 &lt;SBS 10 뉴스&gt;가',
    '&lt;코로나19 통합 뉴스룸&gt;이',
    '일요일에 &lt;전국노래자랑&gt;이',
    '월~목요일에 &lt;일단 해봐요 생방송 오후 1시&gt;가',
    '평일에 &lt;사건파일 24&gt;가',
    '토요일에 &lt;쇼! 음악중심&gt;이',
    '일요일에 &lt;SBS 인기가요&gt;',
    '&lt;동물의 왕국&gt;이',
    '평일에 &lt;6시 내고향&gt;이',
    '화요일에 &lt;이웃집 찰스&gt;가',
    '&lt;SBS 8 뉴스&gt;가',
    '화요일에 &lt;헬로트로트&gt;가',
    '월요일에 &lt;가요무대&gt;가',
    '월~목요일에 &lt;더 라이브&gt;가',
  ];

  if (tv_count == 0 || JSON.stringify(tvData[user_Id]) === '{}') {
    document.getElementById('TV').innerHTML = '';
    var img = document.createElement('img');
    img.style.objectFit = 'contain';
    img.src = '././img/tv.png';
    var src = document.getElementById('TV');
    src.appendChild(img);
    document.getElementById('TV').innerHTML += p_tag(
      'TV를 자주 보시는 분께는 순이가 시간대별 프로그램을 추천해드리고 있답니다!'
    );
  } else if (tv_count > 5) {
    tv_danger = true;
    document.getElementById('TV_card').classList.remove('bg-primary');
    document.getElementById('TV_card').classList.add('bg-danger');

    document.getElementById('TV').innerHTML = '';

    var img = document.createElement('img');
    img.style.objectFit = 'contain';
    img.src = '././img/warning.png';
    var src = document.getElementById('TV');
    src.appendChild(img);

    document.getElementById('TV').innerHTML += p_tag(
      '하루 평균 TV 시청 횟수가 5회를 넘었어요! TV 시청 횟수를 줄이고 다른 활동을 더 해보시는 건 어떠세요?'
    );
  } else {
    document.getElementById('TV').innerHTML = '';
    var img = document.createElement('img');
    img.style.objectFit = 'contain';
    img.src = '././img/tv.png';
    var src = document.getElementById('TV');
    src.appendChild(img);

    tv_rec_string =
      '하루에 TV를 ' +
      tv_count +
      '회 보시네요! <br /> ' +
      +Most_Watch +
      '시에 가장 TV를 많이 보시는군요? <br /> 그 시간대에는 ' +
      tv_program[parseInt(Most_Watch)] +
      ' 방영되고 있어요!';

    document.getElementById('TV').innerHTML += p_tag(tv_rec_string);
  }

  snack_container = document.getElementById('snack');
  snack_container.style.display = 'flex';
  document.getElementById('snack').innerHTML = '';

  if (snack_count == 0 || JSON.stringify(snackData[user_Id]) === '{}') {
    snack_container.innerHTML =
      '간식 섭취는 안하고 계시네요. 가끔은 과일이나 견과류를 섭취하시는 것도 건강에 좋아요!';
  } else if (snack_count > 5) {
    snack_danger = true;
    document.getElementById('snack_card').classList.remove('bg-success');
    document.getElementById('snack_card').classList.add('bg-danger');

    var img = document.createElement('img');
    img.style.objectFit = 'contain';
    img.src = '././img/warning.png';
    var src = document.getElementById('snack');
    src.appendChild(img);

    snack_container.innerHTML += p_tag(
      '하루 간식 섭취 횟수가 5회를 넘었어요! 3번으로 줄여보시는 건 어떨까요? <br /> 달걀, 콩, 견과류에 단백질과 지방이 많아 포만감이 오래간대요!'
    );
  } else {
    var img = document.createElement('img');
    img.style.objectFit = 'contain';
    img.src = '././img/ice-cream.png';
    var src = document.getElementById('snack');
    src.appendChild(img);

    snack_container.innerHTML += p_tag(
      '하루에 간식을 평균 ' +
        snack_count +
        '회 정도 드시고 있어요. 간식도 규칙적으로 섭취하는 것이 좋다고 해요!'
    );
  }

  user_std = sleepData[user_Id].std;
  sleep_container = document.getElementById('sleep');

  sleep_container.innerHTML = '';
  var img = document.createElement('img');
  img.style.objectFit = 'contain';
  img.src = '././img/face.png';
  var src = document.getElementById('sleep');
  src.appendChild(img);

  if (JSON.stringify(sleepData[user_Id]) === '{}') {
    sleep_data_exist = false;
    sleep_container.innerHTML += p_tag('수면 데이터가 존재하지 않습니다!');
  } else if (user_std < 3) {
    sleep_container.innerHTML += p_tag('규칙적인 수면을 하시고 있어요!');
    if (user_std < 1) {
      user_std = 1;
    }
    sleep_score = (5 * (11 - user_std)).toFixed(0);
  } else {
    sleep_container.innerHTML += p_tag(
      '불규칙적인 수면을 하시고 있어요! 규칙적인 수면은 건강에 무척 중요하답니다.'
    );
    sleep_score = (5 * (11 - user_std)).toFixed(0);
  }

  sleep_score = parseInt(sleep_score);

  user_Wk = exData[user_Id].WeekN;
  Ex_Count = exData[user_Id].Weekly_Ex_count;
  ex_container = document.getElementById('exercise');

  console.log(JSON.stringify(exData[user_Id]));
  ex_container.innerHTML = '';

  var img = document.createElement('img');
  img.style.objectFit = 'contain';
  img.src = '././img/dumbbells.png';
  var src = document.getElementById('exercise');
  src.appendChild(img);

  if (JSON.stringify(exData[user_Id]) === '{}') {
    ex_data_exist = false;
    ex_container.innerHTML += p_tag('운동 데이터가 존재하지 않습니다!');
  } else if (user_Wk < 1) {
    ex_data_exist = false;
    ex_container.innerHTML += p_tag(
      '7일 이상 이용하시면 운동 분석 데이터를 제공해드려요!'
    );
  } else if (Ex_Count < 3) {
    ex_container.innerHTML += p_tag(
      '주 ' +
        Ex_Count +
        '회 운동하고 계세요!' +
        '<br />' +
        '권장 운동 횟수는 주 3회라고 해요. 운동 횟수를 늘려보시는 건 어떠세요?'
    );
    ex_score = ((50 / 3) * Ex_Count).toFixed(0);
    ex_score = parseInt(ex_score);
  } else if (Ex_Count > 7) {
    Daily_Ex_Count = (Ex_Count / user_Wk).toFixed(1);
    ex_container.innerHTML += p_tag(
      '매일 평균 ' +
        Daily_Ex_Count +
        '회 운동하고 계세요!' +
        '<br />' +
        '꾸준히 노력하고 계시네요. 멋있어요!'
    );
    ex_score = 50;
  } else {
    ex_container.innerHTML += p_tag(
      '일주일에 평균 ' +
        Ex_Count +
        '회 운동하고 계세요!' +
        '<br />' +
        '꾸준히 노력하고 계시네요. 멋있어요!'
    );
    ex_score = 50;
  }

  let total_container = document.getElementById('health_score');

  if (sleep_data_exist != true || ex_data_exist != true) {
    total_container.innerHTML =
      '수면 데이터와 운동 데이터가 모두 있어야 건강 점수를 계산할 수 있어요!';
  } else {
    total_score = sleep_score + ex_score;
    if (tv_danger) {
      total_score -= 10;
    }
    if (snack_danger) {
      total_score -= 10;
    }

    if (total_score < 0) {
      total_score = 0;
    }
    var score = document.createElement('h4');
    score.style.fontWeight = '700';
    score.style.fontSize = '5rem';
    score.innerHTML = total_score + '점';
    if (total_score < 40) {
      score.style.color = 'red';
    } else if (total_score < 80) {
      score.style.color = 'yellow';
    } else {
      score.style.color = 'green';
      score.innerHTML += '!';
    }
    total_container.appendChild(score);
  }
}
