import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password', 10)

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'mobowp027@gmail.com' },
    update: {
      role: 'ADMIN',
    },
    create: {
      email: 'mobowp027@gmail.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    },
  })

  console.log({ admin })

  // Create Expense Categories (if not exist)
  const expenseCategories = [
    { name: '餐饮', type: 'EXPENSE', icon: 'utensils' },
    { name: '交通', type: 'EXPENSE', icon: 'bus' },
    { name: '购物', type: 'EXPENSE', icon: 'shopping-bag' },
    { name: '娱乐', type: 'EXPENSE', icon: 'gamepad-2' },
    { name: '住房', type: 'EXPENSE', icon: 'home' },
    { name: '医疗', type: 'EXPENSE', icon: 'stethoscope' },
  ]

  for (const cat of expenseCategories) {
    // Check if category exists to avoid duplicates if running seed multiple times
    // Since name is not unique in schema, we might create duplicates if we just create.
    // But for simplicity in this seed script, let's check first.
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, type: cat.type }
    })
    
    if (!existing) {
      await prisma.category.create({
        data: cat
      })
    }
  }

  // Create Income Categories
  const incomeCategories = [
    { name: '工资', type: 'INCOME', icon: 'banknote' },
    { name: '奖金', type: 'INCOME', icon: 'gift' },
    { name: '理财收益', type: 'INCOME', icon: 'trending-up' },
  ]

  for (const cat of incomeCategories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, type: cat.type }
    })
    
    if (!existing) {
      await prisma.category.create({
        data: cat
      })
    }
  }

  // Create Sample Accounts
  const accounts = [
    { name: '现金钱包', type: 'CASH', balance: 500.00, icon: 'wallet' },
    { name: '招商银行', type: 'BANK', balance: 15000.00, icon: 'credit-card' },
    { name: '支付宝', type: 'ALIPAY', balance: 3500.50, icon: 'smartphone' },
  ]

  for (const acc of accounts) {
    const existing = await prisma.account.findFirst({
      where: { name: acc.name, userId: admin.id }
    })

    if (!existing) {
      await prisma.account.create({
        data: {
          ...acc,
          userId: admin.id
        }
      })
    }
  }

  // Create Sample Assets
  const assets = [
    { name: '贵州茅台', type: 'CN_STOCK', symbol: '600519', quantity: 100, costPrice: 1600.00, marketPrice: 1750.00 },
    { name: '腾讯控股', type: 'HK_STOCK', symbol: '00700', quantity: 200, costPrice: 300.00, marketPrice: 320.00 },
    { name: '黄金ETF', type: 'FUND', symbol: '518880', quantity: 1000, costPrice: 4.50, marketPrice: 4.80 },
  ]

  for (const asset of assets) {
    const existing = await prisma.asset.findFirst({
      where: { name: asset.name, userId: admin.id }
    })

    if (!existing) {
      await prisma.asset.create({
        data: {
          ...asset,
          userId: admin.id
        }
      })
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
