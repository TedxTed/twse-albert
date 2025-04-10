# 構建階段
FROM node:18-alpine AS builder

WORKDIR /app

# 安裝 pnpm
RUN npm install -g pnpm

# 複製 package 文件
COPY package.json pnpm-lock.yaml ./

# 安裝依賴
RUN pnpm install --frozen-lockfile

# 複製原始碼
COPY . .

# 執行生產構建
RUN pnpm run build

# 生產階段
FROM node:18-alpine AS production

WORKDIR /app

# 從構建階段複製必要文件
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# 在生產環境重新全局安裝 pnpm ↓↓↓ 新增這一步
RUN npm install -g pnpm

# 環境變量設定
ENV NODE_ENV production
ENV PORT 3000

# 非 root 用戶
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

# 修正啟動命令 ↓↓↓ 使用絕對路徑
CMD ["/usr/local/bin/pnpm", "start"]
