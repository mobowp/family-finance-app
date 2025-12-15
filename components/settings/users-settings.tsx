import { prisma } from "@/lib/prisma";
import { CreateUserDialog } from "@/components/create-user-dialog";
import { UsersTable } from "@/components/settings/users-table";
import { getCurrentUser } from "@/app/actions/user";

export async function UsersSettings() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  const currentUser = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-lg font-medium">用户列表</h3>
           <p className="text-sm text-muted-foreground">管理系统内的所有用户。</p>
        </div>
        <CreateUserDialog />
      </div>

      <div className="space-y-4">
        {users.length === 0 ? (
            <p className="text-muted-foreground text-sm">暂无其他用户</p>
        ) : (
            <UsersTable users={users} currentUserEmail={currentUser?.email || undefined} />
        )}
      </div>
    </div>
  );
}
