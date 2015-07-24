## 使い方

このリポジトリに含まれる index.html をブラウザで開き、
Ctrl + Option + I (又は F12) で開発者ツールのコンソールを開いてください。

1コマあたり2テーマ x 4コマの構成で、タイムテーブル案の総組み合わせを生成し、
投票しかつ参加できる人数をスコアとして、スコアの高い順に、開発者コンソールに
ログ出力します。

## ビルド方法

### Windows + Visual Studio 2015 の場合

このリポジトリに収録されている Visual Studio ソリューションファイル(.sln)を開けばよいです。

Ctrl + F5 で IIS Express が自動起動され、ブラウザが開いて実行されます。

TypeScript (.ts) ファイルを保存するごとに、JavaScript ファイルが生成されます。

### Node.js 環境の場合

`npm install` を実行して必要なモジュールをダウンロードしてください。

`npm run build` で TypeScript の JavaScript へのコンパイルが実行されます。

`npm run server` で Web サーバーが立ち上がります。( http://localhost:8080 をブラウザで開けば見られます)
