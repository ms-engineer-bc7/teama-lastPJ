module.exports = {
  env: {
    browser: true, //ブラウザ環境での開発
    node: true, //Node.js環境での開発
    es2021: true, //ECMAScript 2021の機能を使用　新しい
  },
  extends: [
    "eslint:recommended", //ESLintが推奨する基本的なルールセット
    "plugin:@typescript-eslint/recommended", //TypeScriptのための標準ルールセット
    "plugin:react/recommended", // React特有のベストプラクティスとルールを適用
    "next/core-web-vitals", // Next.js のパフォーマンス関連のベストプラクティスをルールセット
    "plugin:prettier/recommended", //PrettierとESLintを組合て、コードのフォーマットに関する問題をリントするための設定を適用
  ],
  parser: "@typescript-eslint/parser", //TSコードを解析するためのパーサーを指定。これにより、ESLintがTStの構文を正しく理解できるように
  parserOptions: {
    ecmaFeatures: {
      //ECMAScript
      jsx: true, //JSX構文が有効
    },
    ecmaVersion: "latest", //'latest'は最新バージョン
    sourceType: "module", //ｺードがECMAScriptモジュールとして解析
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    quotes: ["error", "double"], //single　//double　//backtick
    semi: ["error", "always"], //文末にセミコロンを付ける
    indent: ["error", 4], //2or4　インデント2スペース
  },
};
