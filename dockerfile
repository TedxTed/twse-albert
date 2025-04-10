# 構建階段
FROM node:18-alpine AS builder

WORKDIR /app

# 安裝 pnpm
RUN npm install -g pnpm

# 先複製 package.json 和 lock 檔案
COPY package.json pnpm-lock.yaml ./

# 安裝所有依賴(包含 devDependencies)
RUN pnpm install --frozen-lockfile

# 複製所有原始碼
COPY . .

# 執行生產環境構建
RUN pnpm run build

# 生產階段
FROM node:18-alpine AS production

WORKDIR /app

# 只從構建階段複製必要檔案
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# 設定生產環境變數
ENV NODE_ENV production
ENV PORT 3000

# 使用非 root 使用者執行
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# 暴露 3000 端口 (Next.js 預設端口)
EXPOSE 3000

# 啟動命令
CMD ["pnpm", "start"]
