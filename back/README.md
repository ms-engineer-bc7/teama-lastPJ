## データベース設計

### ユーザー情報（User）

- uid (Firebase の Uid、NULL 許容)
- name (ユーザー名、デフォルト空文字)
- email (メールアドレス、ユニーク)
- role (役割、選択肢：'user' - '女性'、'partner' - 'パートナー'、空白許容)
- partner_id (外部キー、自己参照の OneToOne、NULL 許容)

### 予定管理（Event）

- user_id (外部キー、Users にリンク)
- title (イベントタイトル)
- description (説明、NULL 許容)
- tag (タグ、NULL 許容)
- start_date (開始日時)
- end_date (終了日時)
- hide_from_hr (ブール型、人事から隠すかどうか)
- alert_message_for_u (アラートメッセージ、ユーザー用、NULL 許容)
- alert_message_for_p (アラートメッセージ、パートナー用、NULL 許容)
- alert_time (アラートの時間、NULL 許容)

### 金額の目安（Cost）

- id (主キー)
- treatment_type (治療の種類、例：検査、注射、採卵、培養、人工授精、体外受精)
- insurance_coverage (保険適用内容、NULL 許容)
- cost_details (金額内訳、NULL 許容)
- total_cost (合計金額)

### FAQ（FAQ）

- id (主キー)
- question (質問)
- answer (回答)
- created_at (作成日時、自動追加)

### 経験談（Testimonial）

- id (主キー)
- tag (タグ)
- content (経験談の内容)
- created_at (作成日時、自動追加)

### スプレッドシート情報（SpreadSheet）

- id (主キー)
- user_id (外部キー、Users にリンク)
- sheet_id (スプレッドシートの ID、NULL 許容)
- shared_email (共有されたメールアドレス)

#### ER 図

![ER Diagram](<https://prod-files-secure.s3.us-west-2.amazonaws.com/fae54200-263a-443f-a2d7-4f439f5b2e0c/af6aae28-f0be-426b-a5ad-6e40056ec353/diagram_(lastpj).png>)

---

## API 設計

### ユーザー関連

- `POST /users`: ユーザー登録
- `GET /users/{id}`: ユーザー情報取得
- `PUT /users/{id}`: ユーザー情報更新
- `DELETE /users/{id}`: ユーザー削除

### 予定管理関連

- `POST /events`: 予定作成
- `GET /events`: 予定一覧取得
- `GET /events/{id}`: 予定詳細取得
- `PUT /events/{id}`: 予定更新
- `DELETE /events/{id}`: 予定削除

### 費用関連

- `GET /costs`: 金額の目安一覧取得
- `GET /costs/{id}`: 指定した ID の費用情報取得
- `POST /costs`: 金額の目安追加
- `PUT /costs/{id}`: 指定した ID の費用情報更新
- `DELETE /costs/{id}`: 指定した ID の費用情報削除

### FAQ 関連

- `GET /faqs`: FAQ 一覧取得
- `POST /faqs`: FAQ 追加
- `PUT /faqs/{id}`: FAQ 更新
- `DELETE /faqs/{id}`: FAQ 削除

### 経験談関連

- `GET /testimonials`: 経験談一覧取得
- `POST /testimonials`: 経験談追加
- `PUT /testimonials{id}`: 経験談更新
- `DELETE /testimonials/{id}`: 経験談削除
