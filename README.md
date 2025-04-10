# TWSE Fetcher

台灣證券交易所資料查詢系統。

## 功能

- 股票資料查詢
- 基於日期範圍的數據分析
- 用戶登入系統

## 安裝與設定

1. 克隆專案

```bash
git clone https://github.com/yourusername/twse-fetcher.git
cd twse-fetcher
```

2. 安裝依賴

```bash
npm install
```

3. 設定環境變數

創建一個 `.env.local` 檔案在專案根目錄並設定以下環境變數：

```
AUTH_USERNAME=你的用戶名
AUTH_PASSWORD=你的密碼
```

4. 啟動開發伺服器

```bash
npm run dev
```

然後在瀏覽器打開 [http://localhost:3000](http://localhost:3000) 查看結果。

## 登入資訊

使用在 `.env.local` 文件中設定的用戶名和密碼進行登入。如果未設定，默認值為：

- 用戶名：admin
- 密碼：password

## 技術棧

- Next.js
- React
- Ant Design
- Tailwind CSS
- 使用 localStorage 進行簡單的身份驗證
