import webbrowser
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import numpy as np
import json
import random

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
  parsed_user_data[id]['program_data']['recommend'] = [ random.choice(category[min_category]) for min_category in parsed_user_data[id]['program_data']['min_category']]
  parsed_user_data[id]['dialog_data'] = {'last_message': user_data['dialog_data'][id]['last_message'], 'participation_rate': user_data['dialog_data'][id]['participation_rate'] }

user_profile.reset_index(drop=True)
for i in range(len(user_profile)):
    parsed_user_data[user_profile['id'][i]]['profile'] = {'sex': user_profile['sex'][i], 'age': int(user_profile['age'][i])}

json_str = 'json_user_data=' + "'" + json.dumps(parsed_user_data) + "'"

with open("./life_log_report/data/json/program_data/program_data.json", "w", encoding='UTF-8') as json_file:
  json_file.write(json_str)


#-----------------------------------------------------------------------------------

data_path = os.getcwd()+'/' + 'life_log_report/data/life_log_data2/hs_g73_m08'
os.chdir(data_path)
files = os.listdir(data_path)

def GetDataById (id):
    if (int(id) > 30063): fileName = ("hs_" + str(id) + "_m08_0903_1356.csv")
    else: fileName = ("hs_" + str(id) + "_m08_0903_1355.csv")
    data = pd.read_csv(fileName, encoding='cp949')
    
    return data

def GetDays (data): #사용날짜(일수) 불러오기
    Time = data["Time"].str.split(expand = True)
    Time.columns = ["날짜", "시간"]
    Date = Time.drop(["시간"], axis=1)
    Date = Date.drop_duplicates()
    return len(Date.index)

def GetDailyData (column_name, data): # 활동(State)의 일일 평균 횟수
    sel_col = data[column_name]
    sel_col = pd.value_counts(sel_col.values)
    sel_col = sel_col.reset_index()
    sel_col.columns = ["활동", "일일 평균 횟수"]
    sel_col["일일 평균 횟수"] = sel_col["일일 평균 횟수"].div(GetDays(data)).round(2)
    return sel_col

def MergeByAdd (table1, table2, columnName, mergedName):
    total = pd.merge(table1, table2, how='outer', on=columnName)
    total = total.fillna(0)
    sum_column = total.iloc[:,1]+total.iloc[:,2]
    total[mergedName] = sum_column
    colname1 = total.columns[1]
    colname2 = total.columns[2]
    total = total.drop([colname1, colname2], axis=1)
    
    return total

def DailyRoutine(data):
    Time = data["Time"].str.split(expand=True)
    Date = Time[0]
    TimeStamp = Time[1].str.slice(stop=2)
    
    DayTime = []
    for i in range (24):
        TimeStr = str(i)
        if (i<10): TimeStr = "0" + TimeStr
        DayTime.append(TimeStr)
        
    Graph = pd.Series(DayTime)
    
    TimeCount = pd.value_counts(TimeStamp.values)
    TimeCount = TimeCount.sort_index()
    
    for i in range (24):
        TimeStr = str(i)
        if (i < 10): TimeStr = "0" + TimeStr
            
        if (TimeStr not in TimeCount.index):
            Graph[i] = 0
        else:
            Graph[i] = TimeCount[TimeStr]
        i+=1
    
    Graph = Graph.reset_index()
    Graph.columns = ["시간", "활동량"]
    
    return Graph

first = True
count = 0

#전체 사용자 ---------------------------------------------------------------
json_path = "../../json/program_data2/total_act.json"
json_data = {}
json_data['활동'] = []
json_data['일일 평균 횟수'] = []

for file in files:
    data = pd.read_csv(file, encoding='cp949')
    
    if (data.empty != True):

        newState = GetDailyData("State", data)

        if (first):
            oldState = newState
            first = False
        else:
            oldState = MergeByAdd(oldState, newState, '활동', '일일 평균 횟수')
            
            
oldState['일일 평균 횟수'] = oldState['일일 평균 횟수'].div(len(files)).round(2)
final = oldState
final = final.sort_values(by=['일일 평균 횟수'], ascending=False, ignore_index = True)
final = final.truncate(before=0, after=4)

json_data['활동'] = list(final['활동'])
json_data['일일 평균 횟수'] = list(final['일일 평균 횟수'])

json_str = 'total_act=' + json.dumps(json_data, ensure_ascii=False) 

with open(json_path, 'w', encoding='UTF-8') as outfile:
    outfile.write(json_str)


# 생활패턴------------------------------------------------------------------
data = {}

for file in files:
    user_id = file.split("_")[1]
    user_data = GetDataById(user_id)

    json_path = "../../json/program_data2/lifecycle.json"
    data[user_id] = {}

    if (not user_data.empty):
        DR_data = DailyRoutine(user_data)
        act_rate = list([int(x) for x in DR_data['활동량']])
        data[user_id] = {
            "act_rate": act_rate
        }

json_str = 'lifecycle=' + json.dumps(data, indent=4,ensure_ascii=False) 

with open(json_path, 'w', encoding='UTF-8') as outfile:
    outfile.write(json_str)




#TV--------------------------------------------------------------------
data = {}

for file in files:

    #TV
    user_id = file.split("_")[1]
    user_data = GetDataById(user_id)

    json_path = "../../json/program_data2/TV.json"
    data[user_id] = {}

    if (not user_data.empty):
        Z_data = GetDailyData("Z", user_data)
        
        Watch_data = user_data['Z'] == '리모콘'
        TV_log= user_data[Watch_data]
        Daily_TV_count = round(len(TV_log) / GetDays(user_data))
        if (Daily_TV_count > 1):  

            Time = TV_log["Time"].str.split(expand=True)
            TimeStamp = Time[1].str.slice(stop=2)
            TimeCount = pd.value_counts(TimeStamp.values)
            
            TimeCount = TimeCount.sort_values(ascending=False)
            TimeCount = TimeCount.reset_index()
            MostWatchAt = TimeCount['index'][0]

            data[user_id]= {
            "DailyCount": Daily_TV_count,
            "MostWatchAt": MostWatchAt
            }
            
json_str = 'tv=' + json.dumps(data, indent=4,ensure_ascii=False) 

with open(json_path, 'w', encoding='UTF-8') as outfile:
    outfile.write(json_str)


#개인활동------------------------------------------------------------
data = {}

for file in files:

    user_id = file.split("_")[1]
    user_data = GetDataById(user_id)

    json_path = "../../json/program_data2/user_act.json"
    data[user_id] = {}

    if (not user_data.empty): 
        top_acts = GetDailyData("State", user_data).truncate(before=0, after =3)
        leftover = sum(GetDailyData("State", user_data).truncate(before=4)['일일 평균 횟수'].array)
        labels = list(top_acts['활동'].values)
        counts = list(top_acts['일일 평균 횟수'].values)

        if (leftover != 0):
            labels.append('기타')
            counts.append(leftover.round(1))

        ratio = list((counts / sum(counts) * 100).round(1))

        data[user_id]= {
        "labels": labels,
        "ratios": ratio
        }

json_str = 'user_act=' + json.dumps(data, ensure_ascii=False)

with open(json_path, 'w', encoding='UTF-8') as outfile:
    outfile.write(json_str)
    


#간식------------------------------------------------------------
data = {}

for file in files:

    user_id = file.split("_")[1]
    user_data = GetDataById(user_id)

    json_path = "../../json/program_data2/snack.json"
    data[user_id] = {}

    if (not user_data.empty):
        Act_data = GetDailyData("Act", user_data)
        
        Eat_data = user_data['Act'] == '간식'
        Snack_log= user_data[Eat_data]
        Daily_Snack_count = round(len(Snack_log) / GetDays(user_data))
        data[user_id]= {"DailyCount": Daily_Snack_count}
            
json_str = 'snack=' + json.dumps(data, indent=4,ensure_ascii=False) 

with open(json_path, 'w', encoding='UTF-8') as outfile:
    outfile.write(json_str)

#---------------------------------------------------------------


#약 복용------------------------------------------------------------
data = {}

for file in files:
    user_id = file.split("_")[1]
    user_data = GetDataById(user_id)
    
    json_path = "../../json/program_data3/drug.json"
    data[user_id] = {}
    
    if (not user_data.empty):
        Act_data = GetDailyData("Act", user_data)
        
        Drug_data = user_data["Act"].str.contains('복약')
        drug_log = user_data[Drug_data]
        Daily_drug_count = round(len(drug_log) / GetDays(user_data))
        data[user_id] = {"DailyCount" : Daily_drug_count}
        
json_str = 'drug=' + json.dumps(data, indent=4, ensure_ascii=False)

with open(json_path, 'w', encoding='UTF-8') as outfile:
    outfile.write(json_str)
    
#낮잠------------------------------------------------------------

data = {}

for file in files:
    user_id = file.split("_")[1]
    user_data = GetDataById(user_id)
    
    json_path = "../../json/program_data3/nap.json"
    data[user_id] = {}
    
    if (not user_data.empty):
        Act_data = GetDailyData("Act", user_data)
        
        Nap_data = user_data["Act"] == '낮잠'
        nap_log = user_data[Nap_data]
        Daily_nap_count = round(len(drug_log) / GetDays(user_data))
        data[user_id] = {"DailyCount" : Daily_nap_count}
        
json_str = 'nap=' + json.dumps(data, indent=4, ensure_ascii=False)

with open(json_path, 'w', encoding='UTF-8') as outfile:
    outfile.write(json_str)

# 외출, 운동------------------------------------------------------------

data = {}
labels = ['외출', '실내운동', '실외운동']

for file in files:

    user_id = file.split("_")[1]
    user_data = GetDataById(user_id)

    json_path = "../../json/program_data3/active.json"
    data[user_id] = {}
    active = user_data[user_data['Act'].str.contains('운동|외출')]

    if (not user_data.empty): 
        counts = []
        ratio = []
        out = len(active[active['Act'].str.contains('외출')])
        indoor = len(active[active['Act'].str.contains('실내운동')])
        outdoor = len(active[active['Act'].str.contains('실외운동')])
        
        counts.append(out)
        counts.append(indoor)
        counts.append(outdoor)
        
        if sum(counts) == 0:
            ratio.append(0)
            ratio.append(0)
            ratio.append(0)
        else:
            ratio.append(round((out / sum(counts) * 100), 1))
            ratio.append(round((indoor / sum(counts) * 100), 1))
            ratio.append(round((outdoor / sum(counts) * 100), 1))

        data[user_id]= {
        "labels": labels,
        "counts": counts,
        "ratios": ratio
        }
        
json_str = 'activity=' + json.dumps(data, ensure_ascii=False) 

with open(json_path, 'w', encoding='UTF-8') as outfile:
    outfile.write(json_str)

os.chdir('../../../../')
print(os.getcwd())

#---------------------------------------------------------------

filename = 'file:///'+os.getcwd()+'/' + 'life_log_report/index.html'
webbrowser.open_new_tab(filename)