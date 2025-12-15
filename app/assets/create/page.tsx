import { getAssetTypes } from "@/app/actions/asset-type";
import { CreateAssetForm } from "@/components/wealth/create-asset-form";
import { getCurrentUser } from "@/app/actions/user";
import { prisma } from "@/lib/prisma";

export default async function CreateAssetPage() {
  const assetTypes = await getAssetTypes();

  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';
  
  let users: { id: string; name: string | null; email: string }[] = [];
  if (isAdmin) {
    users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    });
  }

  return (
    <div className="flex justify-center p-8">
      <CreateAssetForm assetTypes={assetTypes} users={users} />
    </div>
  );
}
