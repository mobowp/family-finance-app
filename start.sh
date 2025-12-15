#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "❌ 未检测到 Node.js"
  echo "请安装 Node.js 18+ (https://nodejs.org) 后重试"
  exit 1
fi

NODE_MAJOR=$(node -v | sed 's/^v//' | cut -d. -f1)
if [ "${NODE_MAJOR}" -lt 18 ]; then
  echo "❌ Node.js 版本过低: $(node -v)"
  echo "请升级到 18 或更高版本"
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "📦 安装依赖..."
  if [ -f package-lock.json ]; then
    npm ci --no-audit --no-fund
  else
    npm install --no-audit --no-fund
  fi
else
  echo "✅ 依赖已安装"
fi

echo "🔧 生成 Prisma Client..."
npx prisma generate

echo "🗄️ 应用数据库迁移..."
npx prisma migrate deploy

echo "🌱 执行种子数据..."
npx prisma db seed

PORT="${PORT:-3000}"
if command -v open >/dev/null 2>&1; then
  ( sleep 2; open "http://localhost:${PORT}" ) &
fi

echo "🚀 启动开发服务器 (http://localhost:${PORT})"
exec npm run dev
