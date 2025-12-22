import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/actions/user";
import { WealthDashboard } from "@/components/wealth/wealth-dashboard";

export default async function WealthPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return <div>请先登录</div>;
  }

  const params = await searchParams;

  const familyId = (currentUser as any).familyId || currentUser.id;
  const userFilter = {
    OR: [
      { id: currentUser.id },
      { familyId: familyId }
    ]
  };
  
  const [accounts, users, assets, assetTypes] = await Promise.all([
    prisma.account.findMany({
      where: { 
        parentId: null,
        user: userFilter
      },
      include: { 
        children: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }).catch((e: any) => {
      console.error(e);
      return [];
    }),
    prisma.user.findMany({
      where: {
        OR: [
          { id: currentUser.id },
          { familyId: familyId }
        ]
      },
      select: { id: true, name: true, email: true }
    }),
    prisma.asset.findMany({
      where: {
        user: userFilter
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }),
    prisma.assetType.findMany()
  ]);

  const totalAccountBalance = accounts.reduce((sum: number, account: any) => {
    const childBalance = account.children?.reduce((cSum: number, child: any) => cSum + child.balance, 0) || 0;
    return sum + account.balance + childBalance;
  }, 0);

  const totalAssetValue = assets.reduce((sum: number, asset: any) => {
    const price = asset.marketPrice || asset.costPrice;
    return sum + (price * asset.quantity);
  }, 0);

  const totalWealth = totalAccountBalance + totalAssetValue;

  return (
    <WealthDashboard 
      totalWealth={totalWealth}
      totalAccountBalance={totalAccountBalance}
      totalAssetValue={totalAssetValue}
      accounts={accounts}
      assets={assets}
      assetTypes={assetTypes}
      users={users}
      defaultTab={(params.tab as string) || "accounts"}
    />
  );
}
