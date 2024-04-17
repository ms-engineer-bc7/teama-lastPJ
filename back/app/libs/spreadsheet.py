from google.oauth2.service_account import Credentials
import gspread
from gspread_formatting import *

import datetime
from collections import defaultdict

from django.conf import settings


class SpreadSheetClient():

    def __init__(self):
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        credentials = Credentials.from_service_account_info(
            {
                "type": "service_account",
                "project_id": settings.GCP_PROJECT_ID,
                "private_key_id": settings.GCP_PRIVATE_KEY_ID,
                "private_key": settings.GCP_PRIVATE_KEY,
                "client_email": settings.GCP_CLIENT_MAIL,
                "client_id": settings.GCP_CLIENT_ID,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/mse-spreadsheet%40scpro-302715.iam.gserviceaccount.com",
                "universe_domain": "googleapis.com"
            },
            scopes=scopes
        )
        self.client = gspread.authorize(credentials)
        print(self.client)
        return 

    def create_spreadsheet(self, user_email, shared_email, title='Sharecleカレンダー共有'):
        # spreadsheetの設定
        spreadsheet = self.client.create(title)
        
        #　権限の付与
        spreadsheet.share(user_email, perm_type='user', role='writer')
        spreadsheet.share(shared_email, perm_type='user', role='reader')
        
        return spreadsheet
    

    def update_calendar(self, sheet_id, events):
        spreadsheet = self.client.open_by_key(sheet_id)
        sheet = spreadsheet.sheet1

        # イベント情報を日付の配列に変換
        eventDict = self.event2calendar(events)

        result = []
        # 現在の日付
        today = datetime.datetime.now()
        # 直近の30日分の日時を生成
        dates = [today + datetime.timedelta(days=x) for x in range(30)]
        # 日時と曜日の情報を出力
        weekdayJp = {
            'Monday': '月',
            'Tuesday': '火',
            'Wednesday': '水',
            'Thursday': '木',
            'Friday': '金',
            'Saturday': '土',
            'Sunday': '日',
        }
        header = ['日付', '曜日', 'イベント']
        result.append(header)
        for date in dates:
            weekday = weekdayJp[date.strftime('%A')]
            result.append([date.strftime("%Y/%m/%d"), weekday, "\n".join(eventDict[date.strftime("%Y/%m/%d")])])
        sheet.update('A1', result)

        fmt = cellFormat(
            backgroundColor=color(1, 0.9, 0.9),
            horizontalAlignment='CENTER'
            )
        format_cell_range(sheet, 'A1:C1', fmt)
          
    def event2calendar(self, events):
        result = defaultdict(list)

        for event in events:
            start_date = event.start_date
            end_date = event.end_date
            title = event.title
            
            # start_dateからend_dateまでの日付を生成
            date_range = [start_date + datetime.timedelta(days=i) for i in range((end_date - start_date).days + 1)]
            
            # 各日付のtitleをresultに追加
            for date in date_range:
                result[date.strftime("%Y/%m/%d")].append(title)
        return result
    
