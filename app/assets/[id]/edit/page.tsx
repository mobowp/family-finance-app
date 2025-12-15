import { updateAsset, deleteAsset } from "@/app/actions/asset";
import { getAssetTypes } from "@/app/actions/asset-type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import { EditAssetForm } from "@/components/wealth/edit-asset-form";
import { getCurrentUser } from "@/app/actions/user";

export default async function EditAssetPage({ params }: { params: { id: string } }) {
  const assetTypes = await getAssetTypes();
  const asset = await prisma.asset.findUnique({
    where: { id: params.id },
  });

  if (!asset) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';
  
  let users: { id: string; name: string | null; email: string }[] = [];
  if (isAdmin) {
    users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    });
  }

  const deleteAssetWithId = deleteAsset.bind(null, asset.id);

  return (
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>编辑资产</CardTitle>
          <form action={deleteAssetWithId}>
             <Button variant="destructive" size="icon" type="submit">
                <Trash2 className="h-4 w-4" />
             </Button>
          </form>
        </CardHeader>
        <CardContent>
          <EditAssetForm asset={asset} assetTypes={assetTypes} users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
