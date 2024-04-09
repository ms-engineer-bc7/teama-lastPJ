FROM node:18

# アプリケーションの作業ディレクトリを設定
WORKDIR /usr/src/app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install --save-dev @firebase/app @firebase/auth @types/firebase
RUN npm install firebase --save
RUN npm install -g eslint
RUN npm install react-firebase-hooks

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# アプリケーションが使用するポートを公開
EXPOSE 3000

# アプリケーションを実行
CMD ["npm", "start"]