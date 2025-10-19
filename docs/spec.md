## Chrome拡張機能 仕様書：証券コード一括検索ツール (TypeScript版)

### 1\. 概要 (Overview)

これからTypeScriptを使用してChrome拡張機能を作成します。
ユーザーがポップアップウィンドウに証券コード（例: 7203）を1つ入力してボタンを押すと、3つの異なる金融情報サイト（ヤフーファイナンス、株探、四季報オンライン）の該当ページが、それぞれ新しいタブで開かれるようにしてください。

-----

### 2\. 機能要件 (Functional Requirements)

1.  **ポップアップUI:**
      * 拡張機能のアイコンをクリックすると、ポップアップ（`popup.html`）が開く。
      * UIにはテキスト入力欄が1つ（`id="stockCodeInput"`）と、ボタンが1つ（`id="openTabsButton"`）必要。
      * 入力欄には `placeholder="証券コード (例: 7203)"` を設定する。
2.  **実行（ボタンクリック）:**
      * 「開く」ボタン（`#openTabsButton`）がクリックされたら、入力欄の証券コードを取得する。
      * 取得したコードを使い、以下の3つのURLを**新しいタブ**で開く。
          * ヤフーファイナンス: `https://finance.yahoo.co.jp/quote/[CODE].T`
          * 株探: `https://kabutan.jp/stock/?code=[CODE]`
          * 四季報オンライン: `https://shikiho.toyokeizai.net/stocks/[CODE]`
      * `[CODE]` は入力された証券コードに置き換える。
3.  **実行（Enterキー）:**
      * テキスト入力欄（`#stockCodeInput`）でEnterキーが押された場合も、ボタンクリック時と全く同じ動作（要件2）を実行する。
4.  **入力チェック:**
      * 証券コードが空欄（または空白のみ）の場合は、タブを開く処理を実行しない。

-----

### 3\. ファイル構成 (File Structure)

ソースコードは `src` フォルダに配置し、ビルド（コンパイル）後のファイルが `dist` フォルダに出力される構成を想定します。
Cursor Agentには **`src` フォルダ内のファイル**と **`tsconfig.json`** の作成を依頼してください。

```
/stock-ticker-opener-ts
  ├── src/
  │   ├── manifest.json
  │   ├── popup.html
  │   ├── popup.css
  │   ├── popup.ts       <-- (JavaScriptから変更)
  │   └── icons/
  │       ├── icon16.png
  │       ├── icon48.png
  │       └── icon128.png
  ├── tsconfig.json      <-- (追加)
  └── dist/              <-- (ビルド後の出力先フォルダ、作成不要)
      ├── manifest.json
      ├── popup.html
      ├── popup.css
      ├── popup.js       <-- (popup.tsからコンパイルされる)
      └── icons/
          ...
```

-----

### 4\. 各ファイルの仕様 (File Specifications)

#### 4-1. `src/manifest.json`

  * `manifest_version`: 3
  * `name`: "証券コード一括オープナー (TS)"
  * `version`: "1.0"
  * `description`: "証券コードを基に、ヤフーファイナンス、株探、四季報オンラインを新しいタブで開きます。"
  * `permissions`:
      * `"tabs"`
  * `action`:
      * `"default_popup": "popup.html"`
      * `"default_icon": { "16": "icons/icon16.png", "48": "icons/icon48.png" }`
  * `icons`:
      * `"16": "icons/icon16.png"`
      * `"48": "icons/icon48.png"`
      * `"128": "icons/icon128.png"`

#### 4-2. `src/popup.html`

  * `popup.css` を読み込む。
  * **重要:** `popup.ts` ではなく、**コンパイル後の `popup.js`** を `defer` 属性付きで読み込む。
      * `<script src="popup.js" defer></script>`
  * `<body>` には機能要件で指定した `#stockCodeInput` と `#openTabsButton` を配置する。
  * `<h1>` タグなどで「証券コード検索」のようなタイトルも表示する。

#### 4-3. `src/popup.css`

  * `body` に `width: 300px;` を設定する。
  * `#stockCodeInput` と `#openTabsButton` が `width: 100%;` に近くなり、縦に並ぶようにスタイリングする (`box-sizing: border-box;` を使用)。
  * ボタンは押しやすいように適切な `padding` と `background-color` を設定する。

#### 4-4. `src/popup.ts`

  * `DOMContentLoaded` イベントを待ってから処理を開始する。
  * `document.getElementById` で取得した要素が `null` でないことを確認し、適切な型（`HTMLInputElement`, `HTMLButtonElement`）として扱う。
  * `openTabsButton` のクリックイベントと、`stockCodeInput` の `keydown` イベント（'Enter'キーの判定）をリッスンする。
  * イベント発生時に関数を呼び出す。この関数は以下の処理を行う:
    1.  `stockCodeInput` の値 (`value`) を取得し、`.trim()` で空白を除去する。
    2.  コードが空 (`""`) でないことを確認する。
    3.  指定された3つのURLを生成する。
    4.  `chrome.tabs.create()` を3回呼び出し、各URLを新しいタブで開く。
    5.  (推奨) 処理完了後、`window.close()` を呼び出してポップアップを閉じる。

#### 4-5. `tsconfig.json` (ルートディレクトリに配置)

  * TypeScriptのコンパイル設定ファイルです。以下の内容で作成してください。
  * コンパイル後のJavaScriptは `dist` フォルダに出力されるよう `outDir` を設定します。

<!-- end list -->

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src",
    // Chrome拡張機能でよく使われるDOMやAPIの型定義
    "lib": ["ES2020", "DOM"]
  },
  "include": [
    "src/**/*.ts"
  ]
}
```

-----

### 5\. ビルドと実行に関する補足

  * この仕様書は **`src` フォルダ内のソースコード** と **`tsconfig.json`** を作成するためのものです。
  * 開発者は `tsc` コマンド（TypeScriptコンパイラ）を実行して `src` 内の `.ts` ファイルをコンパイルし、`dist` フォルダに `.js` ファイルを生成する必要があります。
  * また、`manifest.json`、`.html`、`.css`、`icons` フォルダも `dist` フォルダにコピーする必要があります。
  * 最終的にChromeには `dist` フォルダを読み込ませます。
