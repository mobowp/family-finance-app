import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    const familyId = user.familyId || user.id;

    const [users, categories, accounts, transactions, assetTypes, assets, physicalItems] = await Promise.all([
      prisma.user.findMany({
        where: { OR: [{ id: familyId }, { familyId: familyId }] },
        select: { id: true, name: true, email: true, role: true, image: true, familyId: true, createdAt: true }
      }),
      prisma.category.findMany(),
      prisma.account.findMany({
        where: { user: { OR: [{ id: familyId }, { familyId: familyId }] } },
        include: { user: { select: { id: true, name: true, email: true } } }
      }),
      prisma.transaction.findMany({
        where: { user: { OR: [{ id: familyId }, { familyId: familyId }] } },
        include: { category: true, account: true, user: { select: { id: true, name: true, email: true } } }
      }),
      prisma.assetType.findMany(),
      prisma.asset.findMany({
        where: { user: { OR: [{ id: familyId }, { familyId: familyId }] } },
        include: { user: { select: { id: true, name: true, email: true } } }
      }),
      prisma.physicalItem.findMany({
        where: { user: { OR: [{ id: familyId }, { familyId: familyId }] } },
        include: { user: { select: { id: true, name: true, email: true } } }
      })
    ]);

    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      exportedBy: { id: user.id, name: user.name, email: user.email },
      data: { users, categories, accounts, transactions, assetTypes, assets, physicalItems }
    };

    return NextResponse.json(backupData);
  } catch (error) {
    console.error('导出数据失败:', error);
    return NextResponse.json({ error: '导出数据失败' }, { status: 500 });
  }
}
