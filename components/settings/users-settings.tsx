import { prisma } from "@/lib/prisma";
import { CreateUserDialog } from "@/components/create-user-dialog";
import { UsersTable } from "@/components/settings/users-table";
import { getCurrentUser } from "@/app/actions/user";

export async function UsersSettings() {
  const currentUser = await getCurrentUser();
  
  // 构建查询条件
  const whereConditions: any[] = [
    { id: currentUser?.id } // 1. 总是包含当前用户自己
  ];

  const familyId = (currentUser as any)?.familyId;
  
  if (familyId) {
    // 如果当前用户属于某个家庭
    whereConditions.push({ familyId: familyId }); // 2. 包含同一家庭的其他成员
    whereConditions.push({ id: familyId });       // 3. 包含家庭创建者（家长）
  } else {
    // 如果当前用户没有 familyId，说明可能是家庭创建者
    whereConditions.push({ familyId: currentUser?.id }); // 4. 包含归属于自己的成员
  }
  
  const users = await prisma.user.findMany({
    where: {
      OR: whereConditions
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-lg font-medium">家庭成员</h3>
           <p className="text-sm text-muted-foreground">管理您的家庭成员（共 {users.length} 人）。</p>
        </div>
        <CreateUserDialog />
      </div>

      <div className="space-y-4">
        {users.length === 0 ? (
            <p className="text-muted-foreground text-sm">暂无其他家庭成员</p>
        ) : (
            <UsersTable users={users} currentUserEmail={currentUser?.email || undefined} />
        )}
      </div>
    </div>
  );
}
