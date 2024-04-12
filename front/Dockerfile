FROM node:lts

# アプリケーションの作業ディレクトリを設定
WORKDIR /usr/src/app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install --save-dev @firebase/app @firebase/auth @types/firebase
RUN npm install firebase --save
RUN npm install react-firebase-hooks
RUN npm install --save-dev --legacy-peer-deps @typescript-eslint/eslint-plugin @typescript-eslint/parser
RUN npm install @fullcalendar/common @fullcalendar/daygrid @fullcalendar/react @fullcalendar/interaction next-transpile-modules
RUN npm install react-modal
RUN npm install --save-dev @types/react-modal

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# アプリケーションが使用するポートを公開
EXPOSE 3000

# アプリケーションを実行
CMD ["npm", "start"]