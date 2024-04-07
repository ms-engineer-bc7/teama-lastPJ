# ベースイメージとしてPython 3.12.2を使用
FROM python:3.12.2

# PythonがPython内でバッファリングされずに直接コンソールに出力されるようにする
ENV PYTHONUNBUFFERED 1

# コンテナ内の作業ディレクトリを/appに設定
WORKDIR /app

# ホストマシンからコンテナの作業ディレクトリにrequirements.txtをコピー
COPY requirements.txt /app/
RUN pip install -r requirements.txt

# 必要なファイルをコピー
COPY . /app/

# ポートを公開（Djangoのデフォルトポート8000）
EXPOSE 8000

# gunicornを使用してDjangoアプリケーションを実行するコマンド
# 0.0.0.0:8000はすべてのインターフェイスで8000ポートをリッスンすることを意味
# Djangoのyour_django_project.wsgiは実際のプロジェクト名に置き換える必要あり
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi:application"]

