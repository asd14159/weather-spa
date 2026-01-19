##　Weather SPA (tamble Cording Test)

## 起動手順
 ### 前提条件
 -Node.js v18以上
 -npm(Node.jsに同梱)

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
ルーティングやビルド設定が標準で整備されている。
開発効率と実務での利用頻度を考慮し、Next.jsを採用。
App Routerによるファイルベース構成により、UIとロジックの責務を分離。
- TypeScript
- Recharts

  Reactコンポーネントとして扱いやすい

  Tooltipや軸フォーマット制御を容易に実装できる

  TypeScriptと親和性が高い

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
  ├─public/ #画像やSVGなどの静的ファイル
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
  コンポーネントを以下のように分割し、それぞれの責務を明確化した。
   - WeatherControls: 都市・期間・指標の選択UIを担当
   - WeatherChart: チャート描画を担当
   - LoadingView: データ取得中の表示を担当
   - ErrorView: エラー発生時の表示と再読み込みを担当

### データ取得
 - `useCallback`と`useEffect`を組み合わせて、都市や期間が変更されたときのみAPIを呼ぶ。これにより、再レンダリングや無駄なリクエストを防止。また、エラー時の再読み込みボタンは`useCallback`でメモ化した`useEffect`を再利用。

 ### UXと表示の工夫
  - ローディング中はスピナーを表示して、ユーザーに処理中であることを視覚的に提示。

  - エラー発生時には再読み込みボタンを設置し、UXを高めた。

## 既知の構成/注意事項
  - Node.js18以上、npm同梱環境での動作
  - 対応ブラウザはGoogle Chrome最新版
  - 天気データはOpen-Meteo APIから取得