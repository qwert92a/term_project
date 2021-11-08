import webbrowser
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import numpy as np
import json

# read user profile data from excel file
user_profile = pd.read_excel('./life_log_report/data/life_log_data/user_profile.xlsx')

# read life log data from csv
life_log_datas = {}
for i in user_profile['id']:
    life_log_datas[i] = pd.read_csv('./life_log_report/data/life_log_data/hs_' + str(i) + '_m08_0903_1355.csv', encoding='cp949')

program_data = {}
dialog_data = {}

for i in user_profile['id']:
    program_data[i] = {}
    program_data[i]['list'] = life_log_datas[i][life_log_datas[i].Z == '프로그램']
    program_data[i]['list'] = program_data[i]['list'].loc[:, ['Time', 'Z', 'Act', 'State']]
    program_data[i]['list'] = program_data[i]['list'].reset_index(drop=True)
    program_data[i]['count'] = {'total':0, 'learning':0, 'health':0, 'mind':0, 'stress':0 }
    program_data[i]['count']['total'] = len(program_data[i]['list'])
    
    dialog_data[i] = {}
    dialog_data[i]['list'] = life_log_datas[i][(pd.isna(life_log_datas[i].STT_1) == False)
                                               | (pd.isna(life_log_datas[i].STT_2) == False)
                                              | (pd.isna(life_log_datas[i].STT_3) == False) ]
    dialog_data[i]['message_list'] = life_log_datas[i][(pd.isna(life_log_datas[i].Message_1) == False)
                                               | (pd.isna(life_log_datas[i].Message_2) == False)
                                              | (pd.isna(life_log_datas[i].Message_3) == False) ]

    dialog_data[i]['list'] = dialog_data[i]['list'].loc[:, ['Message_1', 'STT_1', 'Message_2', 'STT_2', 'Message_3', 'STT_3']]
    dialog_data[i]['message_list'] = dialog_data[i]['message_list'].loc[:, ['Message_1', 'Message_2', 'Message_3']]
    dialog_data[i]['list'] = dialog_data[i]['list'].reset_index(drop=True)
    dialog_data[i]['message_list'] = dialog_data[i]['message_list'].reset_index(drop=True)
    dialog_data[i]['count'] = len(dialog_data[i]['list'])


program_count_list = [program_data[id]['count']['total'] for id in program_data]
max_count = max(program_count_list)
program_avg = round(np.mean(program_count_list))
dialog_count_list = [dialog_data[id]['count'] for id in dialog_data]
dialog_avg = round(np.mean(dialog_count_list))

category = { 'learning' : ['도전 실버벨', '영어교실', '순이책방', '일어교실', '시낭독' ],
            'health' : ['순이체조', '요가명상' ],
            'mind' : ['순이 특별대화', '순이대화', '꿀잠소리', '마음스트레칭', '순이인생', '마음그림터', '마음세탁소', '명언산책' ],
            'stress' : ['무비순이', '순이극장', '시시콜콜', '듣는대화', '노래자랑' ] }
for i in program_data:
    for pname in program_data[i]['list']['State']:
        if pname in category['learning']:
            program_data[i]['count']['learning'] += 1
        elif pname in category['health']:
            program_data[i]['count']['health'] += 1
        elif pname in category['mind']:
            program_data[i]['count']['mind'] += 1
        elif pname in category['stress']:
            program_data[i]['count']['stress'] += 1


def participation_rate(program_data, dialog_data):

  for id in program_data:
    count_total = program_data[id]['count']['total']
    count_learning = program_data[id]['count']['learning']
    count_health = program_data[id]['count']['health']
    count_mind = program_data[id]['count']['mind']
    count_stress = program_data[id]['count']['stress']
    count_list = [ count_learning, count_health, count_mind, count_stress ]

    program_count = program_data[id]['count'].copy()
    del program_count['total']
    min_count = min(count_list)
    min_category = [ category for category in program_count if (program_count[category] == min_count and min_count < 4) ]
    program_data[id]['count']['min_category'] = min_category
    program_data[id]['count']['participation_rate'] = round(count_total / program_avg * 100)

    for id in dialog_data:
      if len(dialog_data[id]['message_list']) == 0:
            dialog_data[id]['participation_rate'] = 0
      else:
          dialog_data[id]['participation_rate'] = round(dialog_data[id]['count'] / len(dialog_data[id]['message_list']) * 100)

      if len(dialog_data[id]['message_list']) == 0:
        dialog_data[id]['last_message'] = "대화 내역 없음"
      else:
        messages = dialog_data[id]['message_list'].iloc[-1]
        if pd.isna(messages['Message_3']) == False:
          dialog_data[id]['last_message'] = messages['Message_3']
        elif pd.isna(messages['Message_2']) == False:
          dialog_data[id]['last_message'] = messages['Message_2']
        elif pd.isna(messages['Message_1']) == False:
          dialog_data[id]['last_message'] = messages['Message_1']
        
      if dialog_data[id]['last_message'] == '프로그램 메시지':
        dialog_data[id]['last_message'] = '프로그램 메시지 (대화 내용이 Log 데이터에 남아 있지 않음)'

participation_rate(program_data, dialog_data)
user_data = { 'program_data': program_data, 'dialog_data': dialog_data }

parsed_user_data = {}
for id in user_data['program_data']:
  parsed_user_data[id] = {}
  parsed_user_data[id]['program_data'] = user_data['program_data'][id]['count']
  parsed_user_data[id]['dialog_data'] = {'last_message': user_data['dialog_data'][id]['last_message'], 'participation_rate': user_data['dialog_data'][id]['participation_rate'] }

user_profile.reset_index(drop=True)
for i in range(len(user_profile)):
    parsed_user_data[user_profile['id'][i]]['profile'] = {'sex': user_profile['sex'][i], 'age': int(user_profile['age'][i])}

json_str = 'json_user_data=' + "'" + json.dumps(parsed_user_data) + "'"

with open("./life_log_report/data/json/program_data/program_data.json", "w") as json_file:
  json_file.write(json_str)


filename = 'file:///'+os.getcwd()+'/' + 'life_log_report/index.html'
webbrowser.open_new_tab(filename)