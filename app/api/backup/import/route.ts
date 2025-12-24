import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    const backupData = await request.json();

    if (backupData.version !== '1.0') {
      return NextResponse.json({ error: '不支持的备份文件版本' }, { status: 400 });
    }

    const { data } = backupData;
    const oldToNewIdMap: Record<string, Record<string, string>> = {
      users: {},
      categories: {},
      accounts: {},
      assetTypes: {}
    };

    await prisma.$transaction(async (tx) => {
      if (data.users?.length > 0) {
        for (const userData of data.users) {
          const existing = await tx.user.findUnique({ where: { email: userData.email } });
          if (existing) {
            oldToNewIdMap.users[userData.id] = existing.id;
          } else {
            const newUser = await tx.user.create({
              data: {
                name: userData.name,
                email: userData.email,
                role: userData.role || 'USER',
                image: userData.image,
    familyId: currentUser.familyId || currentUser.id,
                password: Math.random().toString(36).slice(-8)
              }
            });
            oldToNewIdMap.users[userData.id] = newUser.id;
          }
        }
      }

      if (data.categories?.length > 0) {
        for (const category of data.categories) {
          const newCategory = await tx.category.create({
            data: {
              name: category.name,
              type: category.type
            }
          });
          oldToNewIdMap.categories[category.id] = newCategory.id;
        }
      }

      if (data.assetTypes?.length > 0) {
        for (const assetType of data.assetTypes) {
          const existing = await tx.assetType.findUnique({ where: { code: assetType.code } });
          if (existing) {
            oldToNewIdMap.assetTypes[assetType.id] = existing.id;
          } else {
            const newAssetType = await tx.assetType.create({
              data: { name: assetType.name, code: assetType.code }
            });
            oldToNewIdMap.assetTypes[assetType.id] = newAssetType.id;
          }
        }
      }

      if (data.accounts?.length > 0) {
        for (const account of data.accounts) {
          const newAccount = await tx.account.create({
            data: {
        name: account.name,
              type: account.type,
              balance: account.balance,
      icon: account.icon,
              userId: oldToNewIdMap.users[account.userId] || currentUser.id,
              parentId: account.parentId ? (oldToNewIdMap.accounts[account.parentId] || null) : null
            }
          });
          oldToNewIdMap.accounts[account.id] = newAccount.id;
        }
      }

      if (data.transactions?.length > 0) {
        for (const transaction of data.transactions) {
          await tx.transaction.create({
            data: {
              type: transaction.type,
              amount: transaction.amount,
              description: transaction.description,
              date: new Date(transaction.date),
              userId: oldToNewIdMap.users[transaction.userId] || currentUser.id,
              categoryId: transaction.categoryId ? (oldToNewIdMap.categories[transaction.categoryId] || null) : null,
              accountId: oldToNewIdMap.accounts[transaction.accountId],
              targetAccountId: transaction.targetAccountId ? (oldToNewIdMap.accounts[transaction.targetAccountId] || null) : null
            }
          });
        }
      }

      if (data.assets?.length > 0) {
        for (const asset of data.assets) {
          await tx.asset.create({
            data: {
              name: asset.name,
              type: asset.type,
              symbol: asset.symbol,
              quantity: asset.quantity,
              costPrice: asset.costPrice || asset.purchasePrice || 0,
              marketPrice: asset.marketPrice || asset.currentValue,
              userId: oldToNewIdMap.users[asset.userId] || currentUser.id
            }
          });
        }
      }

      if (data.physicalItems?.length > 0) {
        for (const item of data.physicalItems) {
          await tx.physicalItem.create({
            data: {
              name: item.name,
              icon: item.icon,
              image: item.image,
              price: item.price,
              purchaseDate: new Date(item.purchaseDate),
              warrantyDate: item.warrantyDate ? new Date(item.warrantyDate) : null,
              status: item.status,
              note: item.note,
              userId: oldToNewIdMap.users[item.userId] || currentUser.id
            }
          });
        }
      }

    });

    return NextResponse.json({ success: true, message: '数据导入成功' });
  } catch (error) {
    console.error('导入数据失败:', error);
    return NextResponse.json(
      { error: '导入数据失败: ' + (error instanceof Error ? error.message : '未知错误') },
      { status: 500 }
    );
  }
}
