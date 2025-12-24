#!/bin/bash

# Configuration
SERVER="root@114.55.131.189"
REMOTE_DIR="/var/www/family-finance"

echo "🚀 Starting deployment of 'Physical Items' feature..."

# 1. Sync Files
echo "📦 Syncing files..."

# Sync Prisma Schema and Migrations
scp prisma/schema.prisma $SERVER:$REMOTE_DIR/prisma/
scp -r prisma/migrations/20251223085029_add_physical_item $SERVER:$REMOTE_DIR/prisma/migrations/

# Sync Navbar (UI change)
scp components/navbar.tsx $SERVER:$REMOTE_DIR/components/

# Sync New Actions
scp app/actions/physical-item.ts $SERVER:$REMOTE_DIR/app/actions/

# Sync New Pages (Recursive)
# Ensure remote directories exist first
ssh $SERVER "mkdir -p $REMOTE_DIR/app/items $REMOTE_DIR/components/items"
scp -r app/items/* $SERVER:$REMOTE_DIR/app/items/
scp -r components/items/* $SERVER:$REMOTE_DIR/components/items/

# Sync Fixes for Dynamic Routes (Next.js 15 params fix)
scp app/transactions/\[id\]/edit/page.tsx $SERVER:$REMOTE_DIR/app/transactions/\[id\]/edit/
scp app/assets/\[id\]/edit/page.tsx $SERVER:$REMOTE_DIR/app/assets/\[id\]/edit/
scp app/accounts/\[id\]/edit/page.tsx $SERVER:$REMOTE_DIR/app/accounts/\[id\]/edit/

echo "✅ File sync complete."

# 2. Run Server Commands
echo "🔧 Running server commands..."
ssh $SERVER "cd $REMOTE_DIR && \
  set -a && source .env.production && set +a && \
  echo 'Running database migrations...' && \
  npx prisma migrate deploy && \
  echo 'Generating Prisma client...' && \
  npx prisma generate && \
  echo 'Building Next.js application...' && \
  npm run build && \
  echo 'Restarting PM2 service...' && \
  pm2 restart family-finance || pm2 restart all"

echo "🎉 Deployment complete!"
