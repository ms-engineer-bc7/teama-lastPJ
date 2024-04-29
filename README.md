# Sharecle
Sharecle（シェアクル）は、不妊治療のあゆみをサポートするアプリケーション

https://github.com/ms-engineer-bc7/teama-lastPJ/assets/141146509/76dc276f-093e-4dfd-811f-70b3933ea8ae

### プレゼンスライド
https://www.canva.com/design/DAGDZbNSWk8/pEA8HGB7hsyoVGfQOrFsTA/view?utm_content=DAGDZbNSWk8&utm_campaign=designshare&utm_medium=link&utm_source=editor

## 機能
- Google認証
- サインアップ、ログイン
- 役割選択（女性・パートナー）
- 女性用カレンダー
- パートナー用カレンダー（パートナーの女性のスケジュールを反映）
- LLMによるメッセージ生成（女性向け、パートナー向け）
- 不妊治療金額一覧
- カウンセリング
- 決済
- マイページ閲覧、編集
- カップル連携
- スケジュールのスプレッドシート連携

## 使い方
1. リポジトリのクローン
```
$ git clone https://github.com/ms-engineer-bc7/teama-lastPJ.git
```

2. ルートディレクトリへ移動
```
$ cd teama-lastPJ
```

3. dockerコマンドを入力
```
$ docker compose up --build -d
```

4. アプリにアクセスする
```
http://localhost:3000/login
```

## 使用技術
- Next.js: 14.2.3
- TypeScript: 10.2.4
- Node.js: 20.11.1
- Tailwind CSS: 3.4.3
- Python: 3.12.2
- Django:
- PostgreSQL:
- Firebase: 10.11.0
- Stripe
- Docker: 25.0.3
- OpenAI API: GPT-3.5

## タスク管理、共有事項等
Notion: https://volcano-lightning-92e.notion.site/Team-A-983c676525bc4b0aae59531a713d4e3d?pvs=4
