'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import * as XLSX from 'xlsx';
import { format } from "date-fns";

export async function exportTransactions(searchParams: { [key: string]: string | string[] | undefined }) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const { search, type, categoryId, accountId, startDate, endDate } = searchParams;

  // Prepare Filters
  const where: Prisma.TransactionWhereInput = {};

  if (search && typeof search === 'string') {
    where.OR = [
      { description: { contains: search } }, 
    ];
  }

  if (type && typeof type === 'string') {
    where.type = type;
  }

  if (categoryId && typeof categoryId === 'string') {
    where.categoryId = categoryId;
  }

  if (accountId && typeof accountId === 'string') {
    where.accountId = accountId;
  }

  if (startDate && typeof startDate === 'string') {
    const dateFilter = where.date as Prisma.DateTimeFilter || {};
    where.date = { ...dateFilter, gte: new Date(startDate) };
  }

  if (endDate && typeof endDate === 'string') {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const dateFilter = where.date as Prisma.DateTimeFilter || {};
    where.date = { ...dateFilter, lte: end };
  }

  // Fetch ALL matching transactions (no pagination)
  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: [
      { date: 'desc' },
      { createdAt: 'desc' }
    ],
    include: {
      category: true,
      account: true,
      user: true,
    },
  });

  // Transform data for Excel
  const data = transactions.map(tx => ({
    '日期': format(new Date(tx.date), 'yyyy-MM-dd HH:mm:ss'),
    '类型': tx.type === 'INCOME' ? '收入' : '支出',
    '金额': tx.amount,
    '分类': tx.category?.name || '无分类',
    '账户': tx.account?.name || '未知账户',
    '描述': tx.description || '',
    '归属人': tx.user?.name || tx.user?.email || '',
  }));

  // Create Workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  // Generate Buffer
  const buffer = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

  return buffer;
}
