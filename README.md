# 設計書

## サービス内容
- 不妊治療をサポートするアプリ

## 作成理由
- 女性が抱える課題に寄り添い、課題を解消できるサービスを作りたい
- 女性の不調（生理、更年期、不妊治療）にアプローチしたい
- 不妊治療をしている女性のうち、仕事と両立できずに離職してしまう女性の割合は23％、10％が正規から非正規雇用に
- 不妊治療をやめた人は、10.9%
- 2020年に体外受精により誕生した出生児の割合は、約14人に1人で、人工授精やタイミング法まで含めると、その数はさらに増える

## ペルソナ
- すでに不妊治療を始めていて、人工受精からの治療を始めようとしている女性
- 

## 言語選定
- フロントエンド
  - TypeScript（選定理由 : これまでの学習で使い慣れているため）

- バックエンド
  - Python（選定理由 : LLMを使用するのに適しているため）

## 技術スタック
- Docker

- フロントエンド
  - Next.js App Router（選定理由 : 近年人気があり、これまでの学習で使い慣れているため）
  - Tailwind CSS（選定理由 : ユーティリティファーストなフレームワーク、将来性、ドキュメント豊富なため）

- バックエンド
  - Django（選定理由 : 多数のエンドポイントを管理しやすい、実用性が高い、使用率高い、学習に挑戦したかったため）
  - PostgreSQL（選定理由 : カレンダー機能はRDBが適している、これまでの学習で使い慣れているため）

- API
  - 

- 認証
  - Firebase（選定理由 : 多機能、無料プランで十分な実装可能、プラットフォームでの管理がしやすいため）

- 決済
  - Stripe（選定理由 : 多くの企業で使用されている、開発者側の導入・管理が簡単、UIUXが高いため）

## タスク管理、共有事項等
Notion（https://volcano-lightning-92e.notion.site/Team-A-983c676525bc4b0aae59531a713d4e3d?pvs=4）

=================================================================================

# PRD

## カレンダー
- パートナー・会社と、スケジュールやどんな治療なのか、どのくらい精神・身体に負担があるかを共有する
- 不妊治療をもっと自分事のように関心をもってもらうための、パートナーへの通知
- 8週までは流産の可能性があることも留意してもらう　その記載をする

## 金額目安一覧
- 金額が治療、病院によって様々
- 適用される保険のルールや種類も自治体ごとに異なる
- 本当に人によって様々なので、目安となる金額を提示する
- 他サイトに飛ぶようにする

## FAQ
- LLMを使用

## 妊娠に至らなかった経験、コミュニティ
- これは可能であれば実装したい機能
- チャットルームのように、妊娠に至らなかった、不妊治療を終了した人たちの経験談や気持ちをシェアする（攻撃性のある投稿はフィルタリング）
- 体験談にリンクを飛ばす
