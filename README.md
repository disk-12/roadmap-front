# roadmap-front

## 立ち上げ

### 初回インストール

```bash
yarn install
```

### モックサーバ関連 (バックさんとつながり次第削除)

#### モック DB

```bash
cd db
docker compose up
```

#### モッククライアント生成

```bash
yarn prisma:generate
```

### 開発起動

```bash
yarn dev
```

- 必要に応じて

```bash
cp .env.example .env
```

### openapi generate

```bash
yarn openapi:g
```

## ディレクトリ構成

- atomic 不採用 (極力切り出しは避ける？)
- あとで真面目に書く

## バックエンド系接続イメージ

- prisma/\*
- src/pages/api/\*
