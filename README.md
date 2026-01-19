## Weather SPA (tamble Cording Test)
 都市・期間・指標を選択し、時系列の天気データを可視化するSPAです。
 Open-Metro APIを利用して天気情報を取得し、折れ線グラフとして表示します。

  ## 起動手順
  ### 前提条件
  - Node.js v18以上
  - npm(Node.jsに同梱)

  ### セットアップ
  ```bash
  git clone https://github.com/asd14159/weather-spa.git
  cd weather-spa
  npm install
  npm run dev
  ```

  ### ブラウザで確認
  http://localhost:3000

  ### デモ
  https://weather-71bwmmdru-asd14159s-projects.vercel.app/

  ## 技術スタック
  - Next.js(App Rosuter)

    -ルーティングやビルド設定が標準で整備されており、開発効率が高い

    -実務での利用頻度を考慮してNext.jsを採用

    -App Routerによるファイルベース構成により、UIとロジックの責務を分離

  - TypeScript
  - Recharts

    -Reactコンポーネントとして扱いやすい

    -Tooltipや軸フォーマット制御を容易に実装できる

    -TypeScriptと親和性が高い

  - Open-Meteo API

  ## ディレクトリ構成
  ```
  weather-spa/
    ├─app/
    │ ├─page.tsx #トップページ
    │ ├─components/
    │ │ ├─WeatherChart.tsx
    │ │ ├─WeatherControls.tsx
    │ │ ├─LoadingView.tsx
    │ │ └─ErrorView.tsx
    │ └─hooks/ #カスタムフック
    │ └─useWeather.ts
    ├─public/ #静的ファイル
    │ ├─globe.svg
    │ └─next.svg
    ├─types/ #TypeScriptの型定義
    │ ├─chart.ts
    │ └─weather.ts
    ├─package.json
    ├─tsconfig.json
    ├─next.config.ts
    ├─postcss.config.mjs
    └─README.md
  ```
    

  ## 工夫点
  ### コード設計
  コンポーネントを以下のように分割し、それぞれの責務を明確化しました。
  - WeatherControls: 都市・期間・指標の選択UIを担当
  - WeatherChart: チャート描画を担当
  - LoadingView: データ取得中の表示を担当
  - ErrorView: エラー発生時の表示と再読み込みを担当

  ### UXと表示の工夫
  - ローディング中はスピナーを表示して、ユーザーに処理中であることを視覚的に提示。

  - エラー発生時には再読み込みボタンを設置し、UXを高めた。

  ### 表示指標の設計工夫
  - 気温と体感温度、最高気温と最低気温という同じ単位（℃）で表現できる指標のみを同時に表示できる設計とした。
  - 降水量や風速など単位の異なる指標は混在させず、Y軸の意味が分かりにくくならないように設計。

  ## 既知の構成/注意事項
  - Node.js18以上、npm同梱環境での動作
  - 対応ブラウザはGoogle Chrome最新版
  - 天気データはOpen-Meteo APIから取得