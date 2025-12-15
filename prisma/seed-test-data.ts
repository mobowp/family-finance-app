import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding test data...')

  // 1. Get the Admin user
  const user = await prisma.user.findUnique({
    where: { email: 'mobowp027@gmail.com' },
  })

  if (!user) {
    console.error('User not found. Please run the main seed script first.')
    return
  }

  console.log(`Found user: ${user.name} (${user.id})`)

  // 2. Create Accounts
  const accountsData = [
    { name: '招商银行', type: 'BANK', balance: 50000, icon: 'landmark' },
    { name: '支付宝', type: 'ALIPAY', balance: 12000, icon: 'wallet' },
    { name: '微信钱包', type: 'WECHAT', balance: 3500, icon: 'message-circle' },
    { name: '现金钱包', type: 'CASH', balance: 800, icon: 'banknote' },
    { name: '花呗', type: 'CREDIT', balance: -2000, icon: 'credit-card' },
  ]

  const accounts = []
  for (const acc of accountsData) {
    const created = await prisma.account.create({
      data: {
        ...acc,
        userId: user.id,
      },
    })
    accounts.push(created)
    console.log(`Created account: ${created.name}`)
  }

  // 3. Create Assets
  const assetsData = [
    { name: '贵州茅台', type: 'STOCK', symbol: '600519', quantity: 100, costPrice: 1600, marketPrice: 1750 },
    { name: '腾讯控股', type: 'HK_STOCK', symbol: '00700', quantity: 500, costPrice: 300, marketPrice: 320 },
    { name: '易方达蓝筹', type: 'FUND', symbol: '005827', quantity: 10000, costPrice: 2.5, marketPrice: 2.3 },
    { name: '投资性房产', type: 'REAL_ESTATE', quantity: 1, costPrice: 2000000, marketPrice: 2200000 },
  ]

  for (const asset of assetsData) {
    await prisma.asset.create({
      data: {
        ...asset,
        userId: user.id,
      },
    })
    console.log(`Created asset: ${asset.name}`)
  }

  // 4. Get Categories
  const categories = await prisma.category.findMany()
  const expenseCats = categories.filter(c => c.type === 'EXPENSE')
  const incomeCats = categories.filter(c => c.type === 'INCOME')

  if (expenseCats.length === 0 || incomeCats.length === 0) {
    console.log('Categories not found, creating defaults...')
    // Fallback if main seed didn't run or categories missing
    // (Skipping for brevity, assuming main seed ran)
  }

  // 5. Create Transactions
  const transactions = []
  const now = new Date()
  
  // Generate 50 random transactions over the last 90 days
  for (let i = 0; i < 50; i++) {
    const isIncome = Math.random() > 0.7 // 30% income, 70% expense
    const categoryList = isIncome ? incomeCats : expenseCats
    const category = categoryList[Math.floor(Math.random() * categoryList.length)]
    const account = accounts[Math.floor(Math.random() * accounts.length)]
    
    // Random date within last 90 days
    const date = new Date(now.getTime() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000))
    
    // Random amount
    const amount = isIncome 
      ? Math.floor(Math.random() * 10000) + 5000 // 5000 - 15000 for income
      : Math.floor(Math.random() * 500) + 20 // 20 - 520 for expense

    transactions.push({
      amount,
      type: isIncome ? 'INCOME' : 'EXPENSE',
      date,
      description: isIncome ? '工资/奖金' : '日常消费',
      categoryId: category?.id,
      accountId: account.id,
      userId: user.id,
    })
  }

  // Add a few specific large transactions
  transactions.push({
    amount: 25000,
    type: 'INCOME',
    date: new Date(now.getFullYear(), now.getMonth(), 5), // 5th of this month
    description: '月度工资',
    categoryId: incomeCats.find(c => c.name === '工资')?.id,
    accountId: accounts[0].id, // Bank
    userId: user.id,
  })

  for (const tx of transactions) {
    await prisma.transaction.create({ data: tx })
  }
  console.log(`Created ${transactions.length} transactions`)

  console.log('Test data seeding completed!')
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
