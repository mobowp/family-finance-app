'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentUser } from './user';

export async function createTransaction(formData: FormData) {
  const amount = parseFloat(formData.get('amount') as string);
  const type = formData.get('type') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const accountId = formData.get('accountId') as string;
  const date = new Date(formData.get('date') as string);

  // Get current user from cookie or fallback
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not found. Please create a user first.');
  }

  // Transaction logic
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create Transaction Record
      await tx.transaction.create({
        data: {
          amount,
          type,
          description,
          date,
          categoryId: categoryId === 'none' ? null : categoryId,
          accountId,
          userId: user.id,
        },
      });

      // 2. Update Account Balance
      const account = await tx.account.findUnique({ where: { id: accountId } });
      if (account) {
        let newBalance = account.balance;
        if (type === 'INCOME') {
          newBalance += amount;
        } else if (type === 'EXPENSE') {
          newBalance -= amount;
        }
        
        await tx.account.update({
          where: { id: accountId },
          data: { balance: newBalance },
        });
      }
    });
  } catch (error) {
    console.error('Failed to create transaction:', error);
    throw new Error('Failed to create transaction');
  }

  revalidatePath('/transactions');
  revalidatePath('/accounts');
  redirect('/transactions');
}

export async function updateTransaction(id: string, formData: FormData) {
  const amount = parseFloat(formData.get('amount') as string);
  const type = formData.get('type') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const accountId = formData.get('accountId') as string;
  const date = new Date(formData.get('date') as string);

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Get original transaction
      const oldTransaction = await tx.transaction.findUnique({
        where: { id },
        include: { account: true }
      });

      if (!oldTransaction) throw new Error("Transaction not found");

      // 2. Revert old balance effect
      if (oldTransaction.accountId) {
        const oldAccount = await tx.account.findUnique({ where: { id: oldTransaction.accountId } });
        if (oldAccount) {
          let revertedBalance = oldAccount.balance;
          if (oldTransaction.type === 'INCOME') {
            revertedBalance -= oldTransaction.amount;
          } else {
            revertedBalance += oldTransaction.amount;
          }
          await tx.account.update({
            where: { id: oldTransaction.accountId },
            data: { balance: revertedBalance }
          });
        }
      }

      // 3. Update Transaction Record
      await tx.transaction.update({
        where: { id },
        data: {
          amount,
          type,
          description,
          date,
          categoryId: categoryId === 'none' ? null : categoryId,
          accountId,
        },
      });

      // 4. Apply new balance effect
      const newAccount = await tx.account.findUnique({ where: { id: accountId } });
      if (newAccount) {
        let newBalance = newAccount.balance;
        if (type === 'INCOME') {
          newBalance += amount;
        } else {
          newBalance -= amount;
        }
        await tx.account.update({
          where: { id: accountId },
          data: { balance: newBalance }
        });
      }
    });
  } catch (error) {
    console.error('Failed to update transaction:', error);
    throw new Error('Failed to update transaction');
  }

  revalidatePath('/transactions');
  revalidatePath('/accounts');
  redirect('/transactions');
}

export async function deleteTransactions(ids: string[]) {
  try {
    await prisma.$transaction(async (tx) => {
      for (const id of ids) {
        const transaction = await tx.transaction.findUnique({
          where: { id },
        });

        if (!transaction) continue;

        // Revert balance
        if (transaction.accountId) {
          const account = await tx.account.findUnique({ where: { id: transaction.accountId } });
          if (account) {
            let newBalance = account.balance;
            if (transaction.type === 'INCOME') {
              newBalance -= transaction.amount;
            } else {
              newBalance += transaction.amount;
            }
            await tx.account.update({
              where: { id: transaction.accountId },
              data: { balance: newBalance }
            });
          }
        }

        // Delete record
        await tx.transaction.delete({ where: { id } });
      }
    });
  } catch (error) {
    console.error('Failed to delete transactions:', error);
    throw new Error('Failed to delete transactions');
  }

  revalidatePath('/transactions');
  revalidatePath('/accounts');
}

export async function deleteTransaction(id: string) {
  await deleteTransactions([id]);
}
