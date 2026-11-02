# ぴうのデスクトップ

SPEC.mdに基づく、React + Vite + TypeScript製の個人創作サイトです。ソースはこのフォルダ内で完結しています。元のSPEC.mdは変更していません。

## 起動

Node.js 22.12以降を推奨します。

```sh
npm install
npm run dev
```

同梱の `pnpm-lock.yaml` を使う場合は `pnpm install` と `pnpm dev` でも起動できます。

```sh
npm run build
npm run preview
```

本番ファイルは `dist/` に出力されます。HTTPサーバーで配信してください。index.htmlを直接ダブルクリックする方法には対応していません。

## 操作

- PC：アイコンをクリックして選択、ダブルクリックまたはEnterで開く。CHARACTERS内のキャラクターは1回のクリックでプロフィールを開く。
- スマートフォン：1回タップで開く。
- タイトルバーをドラッグして移動。右上で最小化・最大化・閉じる。
- タスクバーから最小化したウィンドウを復帰。
- タスクバーの「×」で開いているウィンドウをすべて閉じてデスクトップへ戻る。
- ウィンドウをクリックすると最前面に移動。
- Startメニューから各フォルダを開く。
- File / View / Helpのメニュー、Escで閉じる。Viewで一覧表示へ切り替え。
- 画像サムネイルは1回クリックで画像ビューアを開く。

## 内容の差し替え

作者名、設定、URLは未提供のため仮データです。サイト名「そらいろデスクトップ / SORA-IRO」も仮称です。

| 対象 | 編集場所 |
| --- | --- |
| 作者プロフィール | `src/data/profile.ts` |
| キャラクター | `src/data/characters.ts` |
| 全体ギャラリー | `src/data/gallery.ts` |
| 外部リンク | `src/data/links.ts` |
| サイト名・デスクトップの文言 | `src/components/Desktop.tsx` / `index.html` |

### キャラクター追加

`characters` 配列へ `Character` 型のデータを追加すると、共通UIでフォルダが生成されます。`extraFiles` にファイルやフォルダを追加できます。
プロフィールには名前、性別、年齢、身長、所属、MBTI、イメージソング、象徴的な要素（身体的特徴、持ち物、癖、モチーフなど）、設定、メイン画像、ギャラリー、関係性がまとめて表示されます。CHARACTERS内のキャラクターをクリックすると、ファイル一覧を経由せずこのプロフィールを開きます。

### 画像

画像は `public/images/` 以下に追加します。データには `public` を省いたURLを指定してください。

```ts
main: '/images/characters/miyabi/main.png',
gallery: [
  { id: 'sketch-01', title: 'sketch-01.png', src: '/images/characters/miyabi/sketch-01.png', caption: 'スケッチ' }
]
```

画像パスが未設定、または読み込みに失敗した場合はプレースホルダーを表示します。ギャラリー配列は初期状態では空です。

デスクトップ画面には画像素材を自動配置しません。画像はキャラクタープロフィールやギャラリーを開いたときだけ表示します。

背景は `public/images/desktopbg.jpg` を差し替えるだけで変更できます。cover / centerで表示します。

### 流れるコメント

デスクトップにはニコニコ動画風のコメントがランダムな高さ・速度・間隔で流れます。表示する文字は `src/data/comments.ts` の `floatingComments` 配列を編集してください。空配列にするとコメント表示を止められます。

### リンク

`links.ts` の `url` にURLを指定すると、新しいタブで開くリンクになります。未設定の場合は「準備中」と表示されます。ショップもこの配列に追加できます。

## 構成

- `src/components/Desktop.tsx`：Desktop / Window / WindowTitleBar / Taskbarとウィンドウ管理
- `src/components/Icons.tsx`：DesktopIcon / FolderIcon / FileIcon
- `src/components/Content.tsx`：Explorer / TextViewer / ImageViewerと各表示内容
- `src/data/filesystem.ts`：データをフォルダ・ファイル構造へ変換
- `src/style.css`：共通UI、モバイル表示、reduced-motion対応

表示中のウィンドウ状態は更新するとリセットされます。個人サイトの表示にバックエンドは不要です。

## 確認

TypeScriptの型チェックと本番ビルドを実施。ブラウザでPCのフォルダ階層、テキスト・画像プレースホルダー、移動、最小化と復帰、最大化、終了、Startメニュー、各ルートを確認。390px幅のタッチ環境でタップ開閉と横スクロールが発生しないことを確認しました。

## 背景画像

組み込みimagegenで生成したオリジナル背景です。生成指示：青空が上部65%を占め、柔らかな白雲と起伏する緑の草原、遠くの小さな木々。2000年代のPC壁紙を思わせる、穏やかで少し夢のようなFrutiger Aeroの写真表現。文字、ロゴ、UI、人物なし。

保存先：`public/images/desktopbg.jpg`
